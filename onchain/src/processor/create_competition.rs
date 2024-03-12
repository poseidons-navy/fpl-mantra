use borsh::BorshSerialize;
use solana_program::{
    account_info::{AccountInfo, next_account_info},
    pubkey::Pubkey,
    entrypoint::ProgramResult,
    program_error::ProgramError,
    program::invoke_signed,
    system_instruction,
    sysvar::{rent::Rent, Sysvar},
    msg
};

use crate::processor::helper;
use crate::state::Competition;

pub fn create_competition(
    name: String,
    league_id: String,
    entry_fee: f64,
    creator_id: String,
    accounts: &[AccountInfo],
    program_id: &Pubkey,
) -> ProgramResult {
    msg!("Creating Competition");
    let accounts_iter = &mut accounts.iter();
    let creator_account = next_account_info(accounts_iter)?;
    let competition_account = next_account_info(accounts_iter)?;
    let system_program = next_account_info(accounts_iter)?;

    if league_id.clone() != String::from("none") {
        msg!("Community belongs to league");

        msg!("TODO: Check if league exists");
        // Check if league exists

        msg!("TODO: Check if creator belongs to league");
        // Check if creator belongs to league

    }

    // Check if community exists
    msg!("Check if Competition Exists");
    let (competition, bump) = helper::get_competition_account(name.clone(), league_id.clone(), program_id);
    if competition_account.key.clone() != competition {
        return Err(ProgramError::InvalidArgument);
    }

    if competition_account.data_is_empty() {
        msg!("Competition Does Not Exist");
        msg!("Creating Competition");
        invoke_signed(
            &system_instruction::create_account(
                creator_account.key, 
                competition_account.key, 
                Rent::get()?.minimum_balance(0), 
                0, 
                program_id
            ), 
            &[
                creator_account.clone(),
                competition_account.clone(),
                system_program.clone()
            ], 
            &[&[league_id.as_bytes().as_ref(), "community".as_bytes().as_ref(), name.as_bytes().as_ref(), &[bump]]]
        )?;
        msg!("Competition Created");
    } 

    msg!("Calculating Rent Needed");
    let mut members = Vec::new();
    members.push(creator_id.clone());
    let competition = Competition {
        members,
        name: name.clone(),
        league_id: league_id.clone(),
        entry_fee: entry_fee.clone()
    };

    let rent = Rent::get()?;
    let new_competition_size = helper::get_competition_size(&competition);
    let new_rent_lamports = rent.minimum_balance(new_competition_size);

    if competition_account.lamports() < new_rent_lamports {
        msg!("Charging user for new competition");
        let lamports_to_be_paid = new_rent_lamports - competition_account.lamports();
        if creator_account.lamports() < lamports_to_be_paid {
            return Err(ProgramError::InsufficientFunds);
        }
        invoke_signed(
            &system_instruction::transfer(creator_account.key, competition_account.key, lamports_to_be_paid),
            &[creator_account.clone(), competition_account.clone()],
            &[&[league_id.as_bytes().as_ref(), "community".as_bytes().as_ref(), name.as_bytes().as_ref(), &[bump]]],
        )?;
    }

    msg!("Serializing Competition to competition_account");
    competition_account.realloc(new_competition_size, false)?;
    competition.serialize(&mut &mut competition_account.data.borrow_mut()[..])?;

    msg!("Competion Is There");
    Ok(())
}

#[cfg(test)]
mod tests {
    use {
        super::*, crate::pinstruction::LeagueInstructionStruct, solana_program::instruction::{AccountMeta, Instruction}, solana_program_test::{processor, ProgramTest}, solana_sdk::{signature::Keypair, signer::Signer, system_program, transaction::Transaction}, std::borrow::Borrow
    };

    #[tokio::test]
    async fn create_competition_test() {
        let user_id = String::from("1");
        let manager_id = String::from("1");

        let instruction_data = LeagueInstructionStruct {
            league_id: String::from(""),
            creator_id: String::from(""),
            league_name: String::from(""),
            events_included: 0,
            user_id: user_id.clone(),
            manager_id: manager_id.clone()
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
        let (pda, bump_seed) = helper::get_pda_for_accounts(&account, &program_id);



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

        let created_account = banks_client.get_account(pda).await;

        match created_account {
            Ok(None) => assert_eq!(false, true),
            Ok(Some(account)) => {
                let account_data = Account::deserialize(&mut account.data.to_vec().as_ref()).unwrap();

                assert!(account_data.user_id == user_id.clone(), "Account Created With Wrong User ID");
                assert!(account_data.manager_id == manager_id.clone(), "Account Created With Wrong Manager ID");
            },
            Err(_) => assert_eq!(false, true)
        }
    }
}