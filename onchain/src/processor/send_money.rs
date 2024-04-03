use solana_program::{
    account_info::{next_account_info, AccountInfo},
    entrypoint::ProgramResult,
    msg,
    program::invoke_signed,
    pubkey::Pubkey,
    system_instruction::transfer,
};
use crate::processor::helper;
/**
 * Function to send money to the winner
 */
pub fn send_money(
    amount: u8,
    league_name: String,
    program_id: &Pubkey,
    accounts: &[AccountInfo],
) -> ProgramResult {
    msg!("Send money to winner");
    let account_info_iter = &mut accounts.iter();
    let to_account = next_account_info(account_info_iter)?;
    let pda = next_account_info(account_info_iter)?;
    let system_account = next_account_info(account_info_iter)?;
    let (_jackpot_pubkey, bump_seed) = helper::get_league_jackpot_account(league_name.clone(), program_id);
    let ix = transfer(pda.key, to_account.key, amount.into());
    invoke_signed(
        &ix,
        &[to_account.clone(), pda.clone(), system_account.clone()],
        &[&[league_name.clone().as_ref() ,"jackpot_account".as_ref(), &[bump_seed]]],
    )?;
    Ok(())
}
