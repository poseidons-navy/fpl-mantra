use crate::pstate::LeagueAccountState;
use borsh::{BorshDeserialize, BorshSerialize};
use solana_program::{
    account_info::{next_account_info, AccountInfo},
    entrypoint::ProgramResult,
    instruction::Instruction,
    msg,
    program::invoke_signed,
    program_error::ProgramError,
    pubkey::Pubkey,
    system_instruction,
    sysvar::{rent::Rent, Sysvar},
    borsh1::try_from_slice_unchecked,
};
use {
    crate::processor::create_league::generate_pda,
    crate::processor::create_league::get_league_size,
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
    msg!("Instruction: JoinLeague");
    msg!("League ID: {}", league_id);
    msg!("User ID: {}", user_id);
    msg!("Join League");

    //Iterate through accounts
    let account_info_iter = &mut accounts.iter();
    let user_account = next_account_info(account_info_iter)?;
    let league_creator = next_account_info(account_info_iter)?;
    let league_pda = next_account_info(account_info_iter)?;
    let system_program_account = next_account_info(account_info_iter)?;

    //Deriving the league PDA
    let (pda, bump_seed) = generate_pda(&league_id, program_id);
    //Deserialize account data
    let mut account_data =
        try_from_slice_unchecked::<LeagueAccountState>(&league_pda.data.borrow()).unwrap();

    //Getting the space needed and rent
    account_data.league_members.push(user_id);
    //Add lamports if needed
    let rent = Rent::get()?;
    let new_account_size = get_league_size(&account_data);
    let new_rent_lamports = rent.minimum_balance(new_account_size);
    if league_pda.lamports() < new_rent_lamports {
        msg!("Charging Member for entry");
        // Charge member for lamports
        let lamports_to_be_paid = new_rent_lamports - league_pda.lamports();
        if user_account.lamports() < lamports_to_be_paid {
            return Err(ProgramError::InsufficientFunds);
        }
        invoke_signed(
            &system_instruction::create_account(
                league_creator.key,
                league_pda.key,
                lamports_to_be_paid,
                0,
                program_id,
            ),
            &[
                league_creator.clone(),
                league_pda.clone(),
                system_program_account.clone(),
            ],
            &[&[
                "leagues".as_bytes().as_ref(),
                league_id.as_bytes().as_ref(),
                &[bump_seed]
            ]],
        )?;
    }
    //Increase the size ofthe account
    league_pda.realloc(new_account_size, false)?;
    //Save the changes in the account
    msg!("Serializing account data to PDA");
    account_data.serialize(&mut &mut league_pda.data.borrow_mut()[..])?;
    Ok(())
}


#[cfg(test)]
mod tests {
    use {
        super::*,
        crate::pinstruction::LeagueInstructionStruct,
        crate::pstate::LeagueAccountState,
        borsh::{BorshDeserialize, BorshSerialize},
        solana_program::instruction::{AccountMeta, Instruction},
        solana_program::system_program,
        solana_program_test::*,
        solana_sdk::{signature::Signer, signer::keypair::Keypair, transaction::Transaction},
    };


    #[tokio::test]
    async fn add_member_works() {
        let instruction_data = LeagueInstructionStruct {
            league_id: String::from("LeagueID"),
            creator_id: String::from(""),
            league_name: String::from(""),
            events_included: 1,
            user_id: String::from("UserID"),
            manager_id: String::from(""),
            entry_fee: 0,
            name: String::from(""),
        };
        // Create vessel
        let mut sink = vec![0];
        instruction_data.serialize( &mut sink).unwrap();
        let program_id = Pubkey::new_unique();

        let (mut banks_client, payer, recent_blockhash) = ProgramTest::new(
            "Mantra",
            program_id,
            processor!(crate::entrypoint::process_instruction)
        )
        .start()
        .await;

        let test_account = Keypair::new();

        let mut transaction = Transaction::new_with_payer(
            &[Instruction {
                program_id,
                accounts: vec![
                    AccountMeta::new(payer.pubkey(), true),
                    AccountMeta::new(test_account.pubkey(), true),
                    AccountMeta::new(system_program::id(), false)
                ],
                data: sink
            }],
            Some(&payer.pubkey()),
        );

        transaction.sign(&[&payer, &test_account], recent_blockhash);

        banks_client.process_transaction(transaction).await.unwrap();

        // Create a member for the vessel
        let mut sink2 = vec![11];
        instruction_data.serialize( &mut sink2).unwrap();
        let mut transaction2 = Transaction::new_with_payer(
            &[Instruction {
                program_id,
                accounts: vec![
                    AccountMeta::new(payer.pubkey(), true),
                    AccountMeta::new(payer.pubkey(), true),
                    AccountMeta::new(test_account.pubkey(), true),
                    AccountMeta::new(system_program::id(), false)
                ],
                data: sink2
            }],
            Some(&payer.pubkey()),
        );

        transaction2.sign(&[&payer, &test_account], recent_blockhash);

        banks_client.process_transaction(transaction2).await.unwrap();

        // Test if any of the created members has the id of the added member
        let created_account = banks_client.get_account(test_account.pubkey()).await;

        match created_account {
            Ok(None) => assert_eq!(false, true),
            Ok(Some(account)) => {
                let league = LeagueAccountState::deserialize(&mut account.data.to_vec().as_ref()).unwrap();
                msg!("the test reached here");
                msg!("League ID from program: {}", league.league_id);
                // See if any member was returned
                assert!(league.league_members.len() >= 1, "No member was created `{}`", league.league_name);

                // See if the write member was created
                let mut found = false;
                for x in league.league_members {
                    if x == instruction_data.user_id {
                        found = true;
                    }
                }

                assert_eq!(found, true, "The wrong member was created");
            },
            Err(_) => assert_eq!(false, true),
        }

    }
}