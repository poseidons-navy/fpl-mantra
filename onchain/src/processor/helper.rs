use solana_program::{
    pubkey::Pubkey,
    program_error::ProgramError
};
use borsh::BorshDeserialize;

pub fn get_pda_for_accounts(
    program_id: &Pubkey
) -> (Pubkey, u8) {
    let (pda, bump_seed) = Pubkey::find_program_address(&["accounts".as_ref()], program_id);
    (pda, bump_seed)
}

pub fn my_try_from_slice_unchecked<T: BorshDeserialize>(data: &[u8]) -> Result<T, ProgramError> {
    let mut data_mut = data;
    match T::deserialize(&mut data_mut) {
        Ok(result) => Ok(result),
        Err(_) => Err(ProgramError::InvalidInstructionData)
    }
}