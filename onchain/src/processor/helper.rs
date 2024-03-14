use solana_program::{
    pubkey::Pubkey,
    program_error::ProgramError
};
use borsh::BorshDeserialize;
use crate::state::{Account, Competition};

pub fn get_pda_for_accounts(
    account: &Account,
    program_id: &Pubkey
) -> (Pubkey, u8) {
    let (pda, bump_seed) = Pubkey::find_program_address(&["accounts".as_bytes().as_ref(), account.user_id.as_bytes().as_ref(), account.manager_id.as_bytes().as_ref()], program_id);
    (pda, bump_seed)
}

pub fn get_competition_account(
    name: String,
    league_id: String,
    program_id: &Pubkey
) -> (Pubkey, u8) {
    let (competition, bump_seed) = Pubkey::find_program_address(
        &[league_id.as_bytes().as_ref(), "community".as_bytes().as_ref(), name.as_bytes().as_ref()], 
        program_id
    );
    (competition, bump_seed)
}

pub fn get_competition_jackpot_account(
    name: String,
    league_id: String,
    program_id: &Pubkey
) -> (Pubkey, u8) {
    let (competition_jackpot, bump_seed) = Pubkey::find_program_address(
        &[league_id.as_bytes().as_ref(), "community_jackpot".as_bytes().as_ref(), name.as_bytes().as_ref()], 
        program_id
    );
    (competition_jackpot, bump_seed)
}

pub fn get_league_jackpot_account(
    league_name: String,
    program_id: &Pubkey
) -> (Pubkey, u8) {
    let (jackpot, bump_seed) = Pubkey::find_program_address(
        &[league_name.as_bytes().as_ref(), "jackpot_account".as_bytes().as_ref()], 
        program_id
    );
    (jackpot, bump_seed)
}

pub fn my_try_from_slice_unchecked<T: BorshDeserialize>(data: &[u8]) -> Result<T, ProgramError> {
    let mut data_mut = data;
    match T::deserialize(&mut data_mut) {
        Ok(result) => Ok(result),
        Err(_) => Err(ProgramError::InvalidInstructionData)
    }
}

pub fn get_account_size(account: &Account) -> usize{
    let mut account_size = 0;
    account_size +=  (4 + account.manager_id.len()) + (4 + account.user_id.len());
    
    account_size
}

pub fn get_competition_size(competition: &Competition) -> usize {
    let mut competition_size = 0;

    // Add 4 because of vec
    competition_size += 4;
    for member in competition.members.iter() {
        competition_size += 4 + member.len();
    }

    competition_size += competition.name.len() + 4;
    competition_size += 8; // entry fee
    competition_size += competition.league_id.len() + 4;


    competition_size
}