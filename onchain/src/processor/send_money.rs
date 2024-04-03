use crate::processor::create_league;
use solana_program::{
    account_info::{next_account_info, AccountInfo},
    entrypoint::ProgramResult,
    msg,
    program::invoke_signed,
    pubkey::Pubkey,
    system_instruction::transfer,
};
/**
 * Function to send money to the winner
 */
pub fn send_money(
    amount: u8,
    league_id: String,
    program_id: &Pubkey,
    accounts: &[AccountInfo],
) -> ProgramResult {
    msg!("Send money to winner");
    let in_lamports = amount as u64 * 1000000000;
    let account_info_iter = &mut accounts.iter();
    let to_account = next_account_info(account_info_iter)?;
    let pda = next_account_info(account_info_iter)?;
    let system_account = next_account_info(account_info_iter)?;
    let (_jackpot_pubkey, bump_seed) = create_league::generate_pda(&league_id, program_id);
    let ix = transfer(pda.key, to_account.key, in_lamports.into());
    invoke_signed(
        &ix,
        &[to_account.clone(), pda.clone(), system_account.clone()],
        &[&[
            "leagues".as_bytes().as_ref(),
            league_id.as_bytes().as_ref(),
            &[bump_seed],
        ]],
    )?;
    Ok(())
}
