use crate::pstate::LeagueAccountState;
use borsh::BorshSerialize;
use solana_program::{
    account_info::{next_account_info, AccountInfo},
    borsh1::try_from_slice_unchecked,
    entrypoint::ProgramResult,
    msg,
    program::invoke_signed,
    program_error::ProgramError,
    pubkey::Pubkey,
    system_instruction,
    sysvar::{rent::Rent, Sysvar},
};
use {
    crate::processor::create_league::generate_pda, crate::processor::create_league::get_league_size,
};
/**
 * function to join a league
 */
pub fn join_league(
    program_id: &Pubkey,
    accounts: &[AccountInfo],
    league_id: String,
    user_id: String,
) -> ProgramResult {
    msg!("Called join league function");
    msg!("League ID: {}", league_id);

    //Iterate through accounts
    let account_info_iter = &mut accounts.iter();
    let user_account = next_account_info(account_info_iter)?;
    let league_pda = next_account_info(account_info_iter)?;
    let system_program_account = next_account_info(account_info_iter)?;

    //Deriving the league PDA
    let (pda, bump_seed) = generate_pda(&league_id, program_id);
    msg!("PDA generated");
    if pda != league_pda.key.clone() {
        return Err(ProgramError::InvalidArgument);
    } else {
        msg!("PDA and PDA account are the same");
    }
    msg!("PDA:: {:?}", league_pda);
    msg!("trying to deserialize:: {:?}", league_pda.data.borrow());
    // //check if league exists
    // msg!("Checking if league exists");
    // if league_pda.owner != program_id {
    //     msg!("League Does Not Exist");
    //     return Err(ProgramError::InvalidArgument);
    // }

    //Deserialize account data
    let mut account_data =
        try_from_slice_unchecked::<LeagueAccountState>(&league_pda.data.borrow()).unwrap();
    msg!("try from slice unchecked");
    //Getting the space needed and rent
    account_data.league_members.push(user_id);
    msg!("Pushed user id to league members");
    //Add lamports if needed
    let rent = Rent::get()?;
    let new_account_size = get_league_size(&account_data);
    let new_rent_lamports = rent.minimum_balance(new_account_size);
    if league_pda.lamports() < new_rent_lamports {
        msg!("Charging Member for entry");
        // Charge member for lamports
        let lamports_to_be_paid = new_rent_lamports - league_pda.lamports();
        if user_account.lamports() < lamports_to_be_paid {
            msg!("Insufficient funds");
            return Err(ProgramError::InsufficientFunds);
        }
        msg!("Invoking system instruction");
        let result = invoke_signed(
            &system_instruction::transfer(user_account.key, league_pda.key, lamports_to_be_paid),
            &[
                user_account.clone(),
                league_pda.clone(),
                system_program_account.clone(),
            ],
            &[&[
                "leagues".as_bytes().as_ref(),
                league_id.as_bytes().as_ref(),
                &[bump_seed],
            ]],
        );

        match result {
            Ok(_) => {
                msg!("Charged member for entry")
            }
            Err(e) => {
                msg!("Error: {:?}", e);
                return Err(ProgramError::InvalidArgument);
            }
        }
    }

    //Increase the size of the account
    league_pda.realloc(new_account_size, false)?;
    //Save the changes in the account
    msg!("Serializing account data to PDA");
    account_data.serialize(&mut &mut league_pda.data.borrow_mut()[..])?;
    msg!("Reached the end of the join function");
    Ok(())
}

// #[cfg(test)]
// mod tests {
//     use {
//         super::*,
//         crate::pinstruction::LeagueInstructionStruct,
//         crate::pstate::LeagueAccountState,
//         borsh::{BorshDeserialize, BorshSerialize},
//         solana_program::instruction::{AccountMeta, Instruction},
//         solana_program::system_program,
//         solana_program_test::*,
//         solana_sdk::{signature::Signer, signer::keypair::Keypair, transaction::Transaction},
//     };

//     #[tokio::test]
//     async fn add_member_works() {
//         //Instruction for create league
//         let instruction_league = LeagueInstructionStruct {
//             league_id: String::from("12"),
//             creator_id: String::from("CreatorID"),
//             league_name: String::from("League Name"),
//             events_included: 1,
//             user_id: String::from(""),
//             manager_id: String::from(""),
//             entry_fee: 0,
//             name: String::from(""),
//         };
//         //Create league
//         let mut sink = vec![0];
//         instruction_league.serialize(&mut sink).unwrap();

//         let program_id = Pubkey::new_unique();

//         let (mut banks_client, payer, recent_blockhash) = ProgramTest::new(
//             "Mantra",
//             program_id,
//             processor!(crate::entrypoint::process_instruction),
//         )
//         .start()
//         .await;
//         let league_creator = Keypair::new();
//         let (pda, _bump_seed) = generate_pda(&instruction_league.league_id, &program_id);

//         let mut transaction = Transaction::new_with_payer(
//             &[Instruction {
//                 program_id,
//                 accounts: vec![
//                     AccountMeta::new(payer.pubkey(), true),
//                     AccountMeta::new(pda, false),
//                     AccountMeta::new(system_program::id(), false),
//                 ],
//                 data: sink,
//             }],
//             Some(&payer.pubkey()),
//         );

//         transaction.sign(&[&payer], recent_blockhash);

//         banks_client.process_transaction(transaction).await.unwrap();

//         // Add member
//         let instruction_member = LeagueInstructionStruct {
//             league_id: String::from("12"),
//             creator_id: String::from(""),
//             league_name: String::from(""),
//             events_included: 0,
//             user_id: String::from("User2"),
//             manager_id: String::from(""),
//             entry_fee: 0,
//             name: String::from(""),
//         };
//         let mut sink2 = vec![3];
//         instruction_member.serialize(&mut sink2).unwrap();

//         // let (mut banks_client, payer, recent_blockhash) = ProgramTest::new(
//         //     "Mantra",
//         //     program_id,
//         //     processor!(crate::entrypoint::process_instruction),
//         // )
//         // .start()
//         // .await;
//         let (pda2, _bump_seed) = generate_pda(&instruction_league.league_id, &program_id);
//         let mut transaction2 = Transaction::new_with_payer(
//             &[Instruction {
//                 program_id,
//                 accounts: vec![
//                     AccountMeta::new(payer.pubkey(), true),
//                     AccountMeta::new(pda2, false),
//                     AccountMeta::new(system_program::id(), false),
//                 ],
//                 data: sink2,
//             }],
//             Some(&payer.pubkey()),
//         );
//         let last_blockhash = banks_client
//             .get_new_latest_blockhash(&recent_blockhash)
//             .await
//             .unwrap();
//         transaction2.sign(&[&payer], last_blockhash);

//         banks_client
//             .process_transaction(transaction2)
//             .await
//             .unwrap();

//         // Test if any of the created members has the id of the added member
//         let created_account = banks_client.get_account(pda2).await;

//         match created_account {
//             Ok(None) => assert_eq!(false, true),
//             Ok(Some(account)) => {
//                 let league =
//                     LeagueAccountState::deserialize(&mut account.data.to_vec().as_ref()).unwrap();

//                 // See if any member was returned
//                 assert!(
//                     league.league_members.len() >= 1,
//                     "No member was created `{}`",
//                     league.league_name
//                 );

//                 // See if the right member was created
//                 let mut found = false;
//                 for x in league.league_members {
//                     if x == instruction_member.user_id {
//                         found = true;
//                     }
//                 }

//                 assert_eq!(found, true, "The wrong member was created");
//             }
//             Err(_) => assert_eq!(false, true),
//         }
//     }
// }
