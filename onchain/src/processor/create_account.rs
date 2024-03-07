use borsh::{BorshDeserialize, BorshSerialize};
use solana_program::{
    account_info::{next_account_info, AccountInfo}, entrypoint::ProgramResult, msg, program::invoke_signed, program_error::ProgramError, pubkey::Pubkey, system_instruction, sysvar::{rent::Rent, Sysvar}
};

use crate::processor::helper;
use crate::state::{Mantra, Account};


pub fn create_account(
    user_id: String,
    manager_id: String,
    accounts: &[AccountInfo],
    program_id: &Pubkey
) -> ProgramResult {
    msg!("Creating Account For A User!");

    let accounts_iter = &mut accounts.iter();
    let user_account = next_account_info(accounts_iter)?;
    let pda_account = next_account_info(accounts_iter)?;
    let system_program_account = next_account_info(accounts_iter)?;

    msg!("Getting Accounts PDA");
    let (pda, bump_seed) = helper::get_pda_for_accounts(program_id);
    if pda != pda_account.key.clone() {
        return Err(ProgramError::InvalidArgument);
    }

    if pda_account.data_is_empty() {
        msg!("PDA was not createad, I am now creating it!");

        invoke_signed(
                    &system_instruction::create_account(
                    user_account.key,
                        pda_account.key,
                        Rent::get()?.minimum_balance(0),
                        0,
                        program_id,
                    ),
                    &[
                        user_account.clone(),
                        pda_account.clone(),
                        system_program_account.clone(),
                    ],
                    &[&["accounts".as_ref(), &[bump_seed]]],
                )?;
        msg!("PDA Created");
    }

    msg!("Getting Existing Accounts");
    let mut account_data = helper::my_try_from_slice_unchecked::<Mantra>(&pda_account.data.borrow()).unwrap();
    
    msg!("Adding New Account");
    let new_account = Account {
        user_id,
        manager_id
    };
    account_data.accounts.push(new_account);

    msg!("Calculating Rent Needed");
    let rent = Rent::get()?;
    let new_mantra_size = helper::get_mantra_size(&account_data);
    let new_rent_lamports = rent.minimum_balance(new_mantra_size);

    if pda_account.lamports() < new_rent_lamports {
        msg!("Charging user for new account");
        let lamports_to_be_paid = new_rent_lamports - pda_account.lamports();
        if user_account.lamports() < lamports_to_be_paid {
            return Err(ProgramError::InsufficientFunds);
        }
        invoke_signed(
            &system_instruction::transfer(user_account.key,pda_account.key, lamports_to_be_paid), 
            &[user_account.clone(), pda_account.clone()], 
            &[&["account".as_ref(), &[bump_seed]]]
        )?;
    }

    msg!("Serializing Mantra to pda");
    pda_account.realloc(new_mantra_size, false)?;
    account_data.serialize(&mut &mut pda_account.data.borrow_mut()[..])?;
    Ok(())
}