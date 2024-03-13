use borsh::BorshSerialize;
use solana_program::{
    entrypoint::ProgramResult,
    account_info::{AccountInfo, next_account_info},
    pubkey::Pubkey,
    program_error::ProgramError,
    sysvar::{Sysvar, rent::Rent},
    program::invoke_signed,
    system_instruction,
    msg
};

use crate::{processor::helper, pstate::LeagueAccountState, state::{Account, Competition}};
use solana_sdk::borsh1::try_from_slice_unchecked;

pub fn join_competition(
    name: String,
    league_id: String,
    user_id: String,
    manager_id: String,
    accounts: &[AccountInfo],
    program_id: &Pubkey
) -> ProgramResult {
    msg!("Joining User To Competition!");
    let accounts_iter = &mut accounts.iter();
    let member_account = next_account_info(accounts_iter)?;
    let competition_account = next_account_info(accounts_iter)?;
    let user_account = next_account_info(accounts_iter)?;
    let league_account = next_account_info(accounts_iter)?;
    
    // Check if user was created
    let account = Account {
        user_id: user_id.clone(),
        manager_id: manager_id.clone()
    };
    let (account, _) = helper::get_pda_for_accounts(&account, program_id);
    if account != user_account.key.clone() {
        msg!("Wrong user account provided");
        return Err(ProgramError::InvalidArgument);
    }

    msg!("Checking if user has account");
    if user_account.data_is_empty() {
        msg!("User Does Not Have An Account");
        return Err(ProgramError::InvalidArgument);
    }

    // Checking if competition exists
    let (competition, bump_seed) = helper::get_competition_account(name.clone(), league_id.clone(), program_id);
    if competition != competition_account.key.clone() {
        msg!("Competition Does Not Exist");
        return Err(ProgramError::InvalidArgument);
    }

    // Check if competition belongs to league
    if league_id.clone() != "none" {
        msg!("Competition Belongs To League");

        // Check if member is in league
        let (league, _) = Pubkey::find_program_address(
            &["leagues".as_bytes().as_ref(), league_id.as_bytes().as_ref()], 
            program_id
        );

        if league_account.key.clone() != league {
            msg!("Wrong League Account Created");
            return Err(ProgramError::InvalidArgument);
        }

        // Check if league exists
        if league_account.data_is_empty() {
            msg!("League Does Not Exist");
            return  Err(ProgramError::InvalidAccountData);
        }

        // Get league from league_account
        let league = try_from_slice_unchecked::<LeagueAccountState>(&league_account.data.borrow()).unwrap();
        
        msg!("Check if creator belongs to league");
        if !league.league_members.contains(&user_id.clone()) {
            msg!("Creator Not Member of League");
            return  Err(ProgramError::InvalidArgument);
        }
    }

    // Add user to commuinity
    let mut competition = try_from_slice_unchecked::<Competition>(&competition_account.data.borrow()).unwrap();
    msg!("Adding member to competition");
    competition.members.push(user_id.clone());

    // Add lamports if needed
    msg!("Calculating Rent Needed!");
    let rent = Rent::get()?;
    let new_competition_size = helper::get_competition_size(&competition);
    let new_rent_lamports = rent.minimum_balance(new_competition_size);

    if competition_account.lamports() < new_rent_lamports {
        msg!("Charging Member for entry to competition");
        let lamports_to_be_paid = new_rent_lamports - competition_account.lamports();
        if member_account.lamports() < lamports_to_be_paid {
            return Err(ProgramError::InsufficientFunds);
        }

        msg!("Charging Member");
        invoke_signed(
            &system_instruction::transfer(member_account.key, competition_account.key, lamports_to_be_paid),
            &[member_account.clone(), competition_account.clone()],
            &[&[league_id.as_bytes().as_ref(), "community".as_bytes().as_ref(), name.as_bytes().as_ref(), &[bump_seed]]],
        )?;
    }

    competition_account.realloc(new_competition_size, false)?;

    // Save changes in account
    msg!("Saving Competition");
    competition.serialize(&mut &mut competition_account.data.borrow_mut()[..])?;
    msg!("Done");
    Ok(())
}

#[cfg(test)]
mod tests {
    use {
        super::*, crate::pinstruction::LeagueInstructionStruct, solana_program::instruction::{AccountMeta, Instruction}, solana_program_test::{processor, ProgramTest, ProgramTestBanksClientExt}, solana_sdk::{signer::Signer, system_program, transaction::Transaction},
    };
    use borsh::BorshDeserialize;

    #[tokio::test]
    async fn join_competition_test() {
        let user_id = String::from("1");
        let manager_id = String::from("1");

        let mut instruction_data = LeagueInstructionStruct {
            league_id: String::from(""),
            creator_id: String::from(""),
            league_name: String::from(""),
            events_included: 0,
            user_id: user_id.clone(),
            manager_id: manager_id.clone(),
            entry_fee: 0.0,
            name: String::from("")
        };

        // Serialize instructions
        let mut sink = vec![1];
        instruction_data.serialize( &mut sink).unwrap();
        let program_id = Pubkey::new_unique();

        let (mut banks_client, payer, recent_blockhash) = ProgramTest::new(
            "FPL Mantra",
            program_id,
            processor!(crate::entrypoint::process_instruction)
        ).start().await;

        let account = Account {
            user_id: user_id.clone(),
            manager_id: manager_id.clone()
        };
        let (pda, _) = helper::get_pda_for_accounts(&account, &program_id);



        let mut transaction = Transaction::new_with_payer(
            &[Instruction {
                program_id,
                accounts: vec![
                    AccountMeta::new(payer.pubkey(), true),
                    AccountMeta::new(pda, false),
                    AccountMeta::new(system_program::id(), false)
                ],
                data: sink
            }],
            Some(&payer.pubkey())
        );

        transaction.sign(&[&payer], recent_blockhash);

        banks_client.process_transaction(transaction).await.unwrap();

        // Creating test user account
        let user_id2 = String::from("2");
        let manager_id2 = String::from("2");

        instruction_data = LeagueInstructionStruct {
            league_id: String::from(""),
            creator_id: String::from(""),
            league_name: String::from(""),
            events_included: 0,
            user_id: user_id2.clone(),
            manager_id: manager_id2.clone(),
            entry_fee: 0.0,
            name: String::from("")
        };

        // Serialize instructions
        sink = vec![1];
        instruction_data.serialize( &mut sink).unwrap();

        let account = Account {
            user_id: user_id2.clone(),
            manager_id: manager_id2.clone()
        };
        let (pda2, _) = helper::get_pda_for_accounts(&account, &program_id);



        transaction = Transaction::new_with_payer(
            &[Instruction {
                program_id,
                accounts: vec![
                    AccountMeta::new(payer.pubkey(), true),
                    AccountMeta::new(pda2, false),
                    AccountMeta::new(system_program::id(), false)
                ],
                data: sink
            }],
            Some(&payer.pubkey())
        );

        let mut last_blockhash = banks_client.get_new_latest_blockhash(&recent_blockhash).await.unwrap();

        transaction.sign(&[&payer], last_blockhash);

        banks_client.process_transaction(transaction).await.unwrap();

        // Create competition
        let name = String::from("Test Competition");
        let league_id = String::from("none");
        let entry_fee = 60.0;
        let creator_id = user_id.clone();

        instruction_data = LeagueInstructionStruct {
            league_id: league_id.clone(),
            creator_id: creator_id.clone(),
            league_name: String::from(""),
            events_included: 0,
            user_id: String::from(""),
            manager_id: String::from(""),
            entry_fee: entry_fee.clone(),
            name: name.clone()
        };

        // Serialize instructions
        let mut sink = vec![4];
        instruction_data.serialize( &mut sink).unwrap();

        let (league, _) = Pubkey::find_program_address(
            &["leagues".as_bytes().as_ref(), league_id.as_bytes().as_ref()], 
            &program_id
        );
        let (competition, _) = helper::get_competition_account(name.clone(), league_id.clone(), &program_id);


        transaction = Transaction::new_with_payer(
            &[Instruction {
                program_id,
                accounts: vec![
                    AccountMeta::new(payer.pubkey(), true),
                    AccountMeta::new(competition, false),
                    AccountMeta::new(league, false),
                    AccountMeta::new(system_program::id(), false)
                ],
                data: sink
            }],
            Some(&payer.pubkey())
        );

        last_blockhash = banks_client.get_new_latest_blockhash(&last_blockhash).await.unwrap();
        transaction.sign(&[&payer], last_blockhash);

        banks_client.process_transaction(transaction).await.unwrap();

        // Join Competition
        instruction_data = LeagueInstructionStruct {
            league_id: league_id.clone(),
            creator_id: creator_id.clone(),
            league_name: String::from(""),
            events_included: 0,
            user_id: user_id2.clone(),
            manager_id: manager_id2.clone(),
            entry_fee: entry_fee.clone(),
            name: name.clone()
        };

        // Serialize instructions
        let mut sink = vec![5];
        instruction_data.serialize( &mut sink).unwrap();

        let (league, _) = Pubkey::find_program_address(
            &["leagues".as_bytes().as_ref(), league_id.as_bytes().as_ref()], 
            &program_id
        );
        let (competition, _) = helper::get_competition_account(name.clone(), league_id.clone(), &program_id);

        transaction = Transaction::new_with_payer(
            &[Instruction {
                program_id,
                accounts: vec![
                    AccountMeta::new(payer.pubkey(), true),
                    AccountMeta::new(competition, false),
                    AccountMeta::new(pda2, false),
                    AccountMeta::new(league, false),
                ],
                data: sink
            }],
            Some(&payer.pubkey())
        );

        last_blockhash = banks_client.get_new_latest_blockhash(&last_blockhash).await.unwrap();
        transaction.sign(&[&payer], last_blockhash);

        banks_client.process_transaction(transaction).await.unwrap();

        let modified_competition = banks_client.get_account(competition).await;

        let competition_data = Competition {
            members: vec![user_id.clone(), user_id2.clone()],
            name: name.clone(),
            league_id: league_id.clone(),
            entry_fee: entry_fee.clone()
        };
        match modified_competition {
            Ok(None) => assert_eq!(false, true),
            Ok(Some(account)) => {
                let account_data = Competition::deserialize(&mut account.data.to_vec().as_ref()).unwrap();

                assert_eq!(account_data, competition_data, "Wrong Competition Created");
            },
            Err(_) => assert_eq!(false, true)
        }
    }
}