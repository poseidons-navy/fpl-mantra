use borsh::BorshSerialize;
use solana_program::{
    account_info::{next_account_info, AccountInfo},
    entrypoint::ProgramResult,
    msg,
    program::invoke_signed,
    program_error::ProgramError,
    pubkey::Pubkey,
    system_instruction,
    sysvar::{rent::Rent, Sysvar},
};

use crate::processor::helper;
use crate::state::Account;

pub fn create_account(
    user_id: String,
    manager_id: String,
    accounts: &[AccountInfo],
    program_id: &Pubkey,
) -> ProgramResult {
    msg!("Creating Account For A User!");
    let accounts_iter = &mut accounts.iter();
    let user_account = next_account_info(accounts_iter)?;
    let pda_account = next_account_info(accounts_iter)?;
    let system_program_account = next_account_info(accounts_iter)?;

    msg!("Getting Accounts PDA");
    let account = Account {
        user_id,
        manager_id,
    };
    let (pda, bump_seed) = helper::get_pda_for_accounts(&account, program_id);
    if pda != pda_account.key.clone() {
        return Err(ProgramError::InvalidArgument);
    }

    msg!("Check if PDA exists");
    if pda_account.data_is_empty() {
        msg!("PDA Does Not Exist So Create Account");
        invoke_signed(
            &system_instruction::create_account(
                user_account.key, 
                pda_account.key, 
                Rent::get()?.minimum_balance(0), 
                0, 
                program_id
            ), 
            &[
                user_account.clone(),
                pda_account.clone(),
                system_program_account.clone()
            ], 
            &[&["accounts".as_bytes().as_ref(), account.user_id.as_bytes().as_ref(), account.manager_id.as_bytes().as_ref(), &[bump_seed]]]
        )?;
        msg!("PDA Created");
    }

    msg!("Calculating Rent Needed");
    let rent = Rent::get()?;
    let new_account_size = helper::get_account_size(&account);
    let new_rent_lamports = rent.minimum_balance(new_account_size);

    if pda_account.lamports() < new_rent_lamports {
        msg!("Charging user for new account");
        let lamports_to_be_paid = new_rent_lamports - pda_account.lamports();
        if user_account.lamports() < lamports_to_be_paid {
            return Err(ProgramError::InsufficientFunds);
        }
        invoke_signed(
            &system_instruction::transfer(user_account.key, pda_account.key, lamports_to_be_paid),
            &[user_account.clone(), pda_account.clone()],
            &[&["accounts".as_bytes().as_ref(), account.user_id.as_bytes().as_ref(), account.manager_id.as_bytes().as_ref(), &[bump_seed]]],
        )?;
    }

    msg!("Serializing Mantra to pda");
    pda_account.realloc(new_account_size, false)?;
    account.serialize(&mut &mut pda_account.data.borrow_mut()[..])?;

    msg!("Account Is There");
    Ok(())
}

#[cfg(test)]
mod tests {
    use {
        super::*, crate::pinstruction::LeagueInstructionStruct, solana_program::instruction::{AccountMeta, Instruction}, solana_program_test::{processor, ProgramTest}, solana_sdk::{signer::Signer, system_program, transaction::Transaction},
    };
    use borsh::BorshDeserialize;

    #[tokio::test]
    async fn create_account_test() {
        let user_id = String::from("1");
        let manager_id = String::from("1");

        let instruction_data = LeagueInstructionStruct {
            league_id: String::from(""),
            creator_id: String::from(""),
            league_name: String::from(""),
            events_included: 0,
            user_id: user_id.clone(),
            manager_id: manager_id.clone(),
            entry_fee: 0,
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