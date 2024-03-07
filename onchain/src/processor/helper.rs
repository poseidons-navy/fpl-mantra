use solana_program::{
    pubkey::Pubkey,
    program_error::ProgramError
};
use borsh::BorshDeserialize;
use crate::state::Mantra;

pub fn get_pda_for_accounts(
    program_id: &Pubkey
) -> (Pubkey, u8) {
    let (pda, bump_seed) = Pubkey::find_program_address(&["accounts".as_ref()], program_id);
    (pda, bump_seed)
}

pub fn get_league_jackpot_account(
    league_name: String,
    program_id: &Pubkey
) -> (Pubkey, u8) {
    let (jackpot, bump_seed) = Pubkey::find_program_address(
        &[league_name.as_ref(), "jackpot_account".as_ref()], 
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

pub fn get_mantra_size(mantra: &Mantra) -> usize{
    let mut mantra_size = 4;

    // Get size of all accounts
    for x in mantra.accounts.iter() {
        mantra_size += (4 + x.manager_id.len()) + (4 + x.user_id.len());
    }

    mantra_size
}