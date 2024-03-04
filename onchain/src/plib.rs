use solana_program::{
    account_info::AccountInfo,
    address_lookup_table::instruction,
    entrypoint::{self, ProgramResult},
    msg,
    program_error::ProgramError,
    program_pack::{IsInitialized, Pack, Sealed},
    pubkey::Pubkey,
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
    match instruction {
        LeagueInstruction::CreateLeague {
            league_id,
            creator_id,
            league_name,
            events_included,
        } => create_league(program_id, accounts, league_id, creator_id, league_name, events_included)
    }
    msg!("At least this worked!");
    Ok(())
}
pub fn create_league(
    program_id: &Pubkey,
    accounts: &[AccountInfo],
    league_id: String,
    creator_id: String,
    league_name: String,
    events_included: u8,
) -> ProgramResult {
    msg!("Instruction: CreateLeague");
    msg!("League ID: {}", league_id);
    msg!("Creator ID: {}", creator_id);
    msg!("League Name: {}", league_name);
    msg!("Events Included: {}", events_included);
    msg!("Create League");
    Ok(())
}
