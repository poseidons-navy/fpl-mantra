use solana_program::{
    account_info::{next_account_info, AccountInfo}, entrypoint::ProgramResult, msg, program::invoke_signed, program_error::ProgramError, pubkey::Pubkey, sysvar::{rent::Rent, Sysvar}, system_instruction
};

use crate::processor::helper;

pub fn init_league_jackpot(
    league_name: String,
    accounts: &[AccountInfo],
    program_id: &Pubkey
) -> ProgramResult {
    // Get accounts sent in function
    msg!("Getting accounts from account list");
    let accounts_iter = &mut accounts.iter();
    let jackpot_creator = next_account_info(accounts_iter)?;
    let jackpot_account = next_account_info(accounts_iter)?;
    let system_program_account: &AccountInfo<'_> = next_account_info(accounts_iter)?;

    msg!("Confirm if the provided account is correct");
    let (jackpot_pubkey, bump_seed) = helper::get_league_jackpot_account(league_name.clone(), program_id);
    if jackpot_pubkey != jackpot_account.key.clone() {
        msg!("Provided Account Is Wrong");
        return Err(ProgramError::InvalidArgument);
    }

    msg!("Check if the jackpot had already been created");
    if jackpot_account.data_is_empty() {
        msg!("Jackpot account had not been created, creating account");

        invoke_signed(
                    &system_instruction::create_account(
                    jackpot_creator.key,
                        jackpot_account.key,
                        Rent::get()?.minimum_balance(0),
                        0,
                        program_id,
                    ),
                    &[
                        jackpot_creator.clone(),
                        jackpot_account.clone(),
                        system_program_account.clone(),
                    ],
                    &[&[league_name.clone().as_ref() ,"jackpot_account".as_ref(), &[bump_seed]]],
                )?;
    }
    
    msg!("Account Has Been Created");
    Ok(())
}

#[cfg(test)]
mod tests {
    use {
        borsh::BorshSerialize,
        super::*, crate::pinstruction::LeagueInstructionStruct, solana_program::instruction::{AccountMeta, Instruction}, solana_program_test::{processor, ProgramTest}, solana_sdk::{signer::Signer, system_program, transaction::Transaction},
    };

    #[tokio::test]
    async fn init_league_jackpot_test() {
        let league_name = String::from("TestLeague");

        let instruction_data = LeagueInstructionStruct {
            league_id: String::from(""),
            creator_id: String::from(""),
            league_name: league_name.clone(),
            events_included: 0,
            user_id: String::from(""),
            manager_id: String::from(""),
            entry_fee: 0,
            name: String::from("")
        };

        // Serialize instructions
        let mut sink = vec![2];
        instruction_data.serialize( &mut sink).unwrap();
        let program_id = Pubkey::new_unique();

        let (mut banks_client, payer, recent_blockhash) = ProgramTest::new(
            "FPL Mantra",
            program_id,
            processor!(crate::entrypoint::process_instruction)
        ).start().await;

        let (pda, _) = helper::get_league_jackpot_account(league_name.clone(), &program_id);

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
            Ok(Some(_)) => {
                assert_eq!(true, true);
            }
            // Ok(Some(account)) => {
            //     let account_data = Account::deserialize(&mut account.data.to_vec().as_ref()).unwrap();

            //     assert!(account_data.user_id == user_id.clone(), "Account Created With Wrong User ID");
            //     assert!(account_data.manager_id == manager_id.clone(), "Account Created With Wrong Manager ID");
            // },
            Err(_) => assert_eq!(false, true)
        }
    }
}