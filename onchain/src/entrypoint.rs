use crate::processor::create_league::create_league;
use crate::{pinstruction::LeagueInstruction, processor::create_account::create_account};
use solana_program::{
    account_info::AccountInfo, entrypoint, entrypoint::ProgramResult, msg, pubkey::Pubkey,
};
//Entrypoint is a function call process_instruction
entrypoint!(process_instruction);

pub fn process_instruction(
    program_id: &Pubkey,
    accounts: &[AccountInfo],
    instruction_data: &[u8],
) -> ProgramResult {
    //Call unpack to deserialize the instruction data
    let instruction = LeagueInstruction::unpack(instruction_data)?;
    //Match the instruction and call the appropriate function
    let _ = match instruction {
        LeagueInstruction::CreateLeague {
            league_id,
            creator_id,
            league_name,
            events_included,
        } => create_league(
            program_id,
            accounts,
            league_id,
            creator_id,
            league_name,
            events_included,
        ),
        LeagueInstruction::CreateAccount {
            user_id,
            manager_id,
        } => create_account(user_id, manager_id, accounts, program_id),
    };
    msg!("At least this worked!");
    Ok(())
}