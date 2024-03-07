use std::borrow::Borrow;

use solana_program::{
    account_info::{next_account_info, AccountInfo}, entrypoint::ProgramResult, msg, program::invoke_signed, program_error::ProgramError, pubkey::Pubkey, sysvar::{rent::Rent, Sysvar}, system_instruction
};

use crate::processor::helper;

pub fn init_league_jackpot(
    league_name: &String,
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