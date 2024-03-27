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

use crate::{processor::helper, pstate::LeagueAccountState};
use crate::state::Competition;

pub fn create_competition(
    name: String,
    league_id: String,
    entry_fee: u64,
    creator_id: String,
    accounts: &[AccountInfo],
    program_id: &Pubkey,
) -> ProgramResult {
    msg!("Creating Competition");
    let accounts_iter = &mut accounts.iter();
    let creator_account = next_account_info(accounts_iter)?;
    let competition_account = next_account_info(accounts_iter)?;
    let league_account = next_account_info(accounts_iter)?;
    let competition_jackpot_account = next_account_info(accounts_iter)?;
    let system_program = next_account_info(accounts_iter)?;

    if league_id.clone() != String::from("none") {
        msg!("Community belongs to league");

        msg!("Check if league exists");
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
        let league = helper::my_try_from_slice_unchecked::<LeagueAccountState>(&league_account.data.borrow()).unwrap();
        
        msg!("Check if creator belongs to league");
        if !league.league_members.contains(&creator_id.clone()) {
            msg!("Creator Not Member of League");
            return  Err(ProgramError::InvalidArgument);
        }
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
        members: vec![creator_id.clone()],
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

    msg!("Creating Account To Hold Competition Jackpot");
    msg!("Confirm if the provided competition jackpot account is correct");
    let (competition_jackpot, bump_seed) = helper::get_competition_jackpot_account(name.clone(), league_id.clone() ,program_id);
    if competition_jackpot != competition_jackpot_account.key.clone() {
        msg!("Provided Competition Jackpot Account Is Wrong");
        return Err(ProgramError::InvalidArgument);
    }

    msg!("Check if the jackpot had already been created");
    if competition_jackpot_account.data_is_empty() {
        msg!("Jackpot account had not been created, creating account");

        invoke_signed(
                    &system_instruction::create_account(
                        creator_account.key,
                        competition_jackpot_account.key,
                        Rent::get()?.minimum_balance(0),
                        0,
                        program_id,
                    ),
                    &[
                        creator_account.clone(),
                        competition_jackpot_account.clone(),
                        system_program.clone(),
                    ],
                    &[&[league_id.as_bytes().as_ref(), "community_jackpot".as_bytes().as_ref(), name.as_bytes().as_ref(), &[bump_seed]]],
                )?;
    }
    
    msg!("Competition Jackpot Account Has Been Created");
    msg!("Funding Competition Jackpot Account");
    invoke_signed(
        &system_instruction::transfer(creator_account.key, competition_jackpot_account.key, entry_fee.clone()),
        &[creator_account.clone(), competition_jackpot_account.clone()],
        &[&[league_id.as_bytes().as_ref(), "community_jackpot".as_bytes().as_ref(), name.as_bytes().as_ref(), &[bump_seed]]],
    )?;

    Ok(())
}

// #[cfg(test)]
// mod tests {
//     use {
//         super::*, crate::{pinstruction::LeagueInstructionStruct, processor::create_league::generate_pda}, solana_program::instruction::{AccountMeta, Instruction}, solana_program_test::{processor, ProgramTest}, solana_sdk::{signer::Signer, system_program, transaction::Transaction},
//     };
//     use borsh::BorshDeserialize;

//     #[tokio::test]
//     async fn create_global_competition_test() {
//         let name = String::from("Test Competition");
//         let league_id = String::from("none");
//         let entry_fee = 100;
//         let creator_id = String::from("1");

//         let instruction_data = LeagueInstructionStruct {
//             league_id: league_id.clone(),
//             creator_id: creator_id.clone(),
//             league_name: String::from(""),
//             events_included: 0,
//             user_id: String::from(""),
//             manager_id: String::from(""),
//             entry_fee: entry_fee.clone(),
//             name: name.clone()
//         };

//         // Serialize instructions
//         let mut sink = vec![4];
//         instruction_data.serialize( &mut sink).unwrap();
//         let program_id = Pubkey::new_unique();

//         let (mut banks_client, payer, recent_blockhash) = ProgramTest::new(
//             "FPL Mantra",
//             program_id.clone(),
//             processor!(crate::entrypoint::process_instruction)
//         ).start().await;

//         let competition_test = Competition {
//             members: vec![creator_id.clone()],
//             name: name.clone(),
//             league_id: league_id.clone(),
//             entry_fee: entry_fee.clone(),
//         };
//         let (competition, _) = helper::get_competition_account(name.clone(), league_id.clone(), &program_id);
//         let (league, _) = generate_pda(&league_id, &program_id);
//         let (competition_jackpot, _) = helper::get_competition_jackpot_account(name.clone(), league_id.clone(), &program_id);


//         let mut transaction = Transaction::new_with_payer(
//             &[Instruction {
//                 program_id,
//                 accounts: vec![
//                     AccountMeta::new(payer.pubkey(), true),
//                     AccountMeta::new(competition, false),
//                     AccountMeta::new(league, false),
//                     AccountMeta::new(competition_jackpot, false),
//                     AccountMeta::new(system_program::id(), false)
//                 ],
//                 data: sink
//             }],
//             Some(&payer.pubkey())
//         );

//         transaction.sign(&[&payer], recent_blockhash);

//         banks_client.process_transaction(transaction).await.unwrap();

//         let created_competition = banks_client.get_account(competition).await;

//         match created_competition {
//             Ok(None) => assert_eq!(false, true),
//             Ok(Some(account)) => {
//                 let competition_account = Competition::deserialize(&mut account.data.to_vec().as_ref()).unwrap();

//                 assert!(competition_account.members == competition_test.members.clone(), "Competition Created With Wrong Members");
//                 assert!(competition_account.entry_fee == competition_test.entry_fee, "Competition Created With Wrong Entry Fee");
//                 assert!(competition_account.league_id == competition_test.league_id.clone(), "Competition Created With Wrong League ID");
//                 assert!(competition_account.name == competition_test.name, "Competition Created With Wrong Name");
//             },
//             Err(_) => assert_eq!(false, true)
//         }
//     }

//     #[tokio::test]
//     async fn create_league_competition_test() {
//         let league_name = String::from("TestLeague");
//         let league_id = String::from("1");
//         let entry_fee = 100;
//         let mut creator_id = String::from("1");
//         let events_included: u8 = 1;

//         // Create league
//         let mut instruction_data = LeagueInstructionStruct {
//             league_id: league_id.clone(),
//             creator_id: creator_id.clone(),
//             league_name: league_name.clone(),
//             events_included: events_included.clone(),
//             user_id: String::from(""),
//             manager_id: String::from(""),
//             entry_fee: entry_fee.clone(),
//             name: String::from("")
//         };
//         // Serialize instructions
//         let mut sink = vec![0];
//         instruction_data.serialize( &mut sink).unwrap();
//         let program_id = Pubkey::new_unique();

//         let (mut banks_client, payer, recent_blockhash) = ProgramTest::new(
//             "FPL Mantra",
//             program_id.clone(),
//             processor!(crate::entrypoint::process_instruction)
//         ).start().await;

//         let (league, _) = generate_pda(&league_id, &program_id);
        

//         let mut transaction = Transaction::new_with_payer(
//             &[Instruction {
//                 program_id,
//                 accounts: vec![
//                     AccountMeta::new(payer.pubkey(), true),
//                     AccountMeta::new(league, false),
//                     AccountMeta::new(system_program::id(), false)
//                 ],
//                 data: sink
//             }],
//             Some(&payer.pubkey())
//         );

//         transaction.sign(&[&payer], recent_blockhash);

//         banks_client.process_transaction(transaction).await.unwrap();

//         // Create competition
//         let name = String::from("Test Competition");
//         creator_id = String::from("1");
//         instruction_data = LeagueInstructionStruct {
//             league_id: league_id.clone(),
//             creator_id: creator_id.clone(),
//             league_name: String::from(""),
//             events_included: 0,
//             user_id: String::from(""),
//             manager_id: String::from(""),
//             entry_fee: entry_fee.clone(),
//             name: name.clone()
//         };

//         // Serialize instructions
//         sink = vec![4];
//         instruction_data.serialize( &mut sink).unwrap();

        

//         let competition_test = Competition {
//             members: vec![creator_id.clone()],
//             name: name.clone(),
//             league_id: league_id.clone(),
//             entry_fee: entry_fee.clone(),
//         };
//         let (competition, _) = helper::get_competition_account(name.clone(), league_id.clone(), &program_id);
//         let (competition_jackpot, _) = helper::get_competition_jackpot_account(name.clone(), league_id.clone(), &program_id);

//         transaction = Transaction::new_with_payer(
//             &[Instruction {
//                 program_id,
//                 accounts: vec![
//                     AccountMeta::new(payer.pubkey(), true),
//                     AccountMeta::new(competition, false),
//                     AccountMeta::new(league, false),
//                     AccountMeta::new(competition_jackpot, false),
//                     AccountMeta::new(system_program::id(), false)
//                 ],
//                 data: sink
//             }],
//             Some(&payer.pubkey())
//         );

//         transaction.sign(&[&payer], recent_blockhash);

//         banks_client.process_transaction(transaction).await.unwrap();

//         let created_competition = banks_client.get_account(competition).await;

//         match created_competition {
//             Ok(None) => assert_eq!(false, true),
//             Ok(Some(account)) => {
//                 let competition_account = Competition::deserialize(&mut account.data.to_vec().as_ref()).unwrap();

//                 assert!(competition_account.members == competition_test.members.clone(), "Competition Created With Wrong Members");
//                 assert!(competition_account.entry_fee == competition_test.entry_fee, "Competition Created With Wrong Entry Fee");
//                 assert!(competition_account.league_id == competition_test.league_id.clone(), "Competition Created With Wrong League ID");
//                 assert!(competition_account.name == competition_test.name, "Competition Created With Wrong Name");
//             },
//             Err(_) => assert_eq!(false, true)
//         }
//     }
// }
