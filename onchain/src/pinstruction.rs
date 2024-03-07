use borsh::{BorshDeserialize, BorshSerialize};
use solana_program::program_error::ProgramError;
pub enum LeagueInstruction {
    CreateLeague {
        league_id: String,
        creator_id: String,
        league_name: String,
        events_included: u8,
    },

    // Creating Account
    CreateAccount {
        user_id: String,
        manager_id: String,
    },

    // Creating League Jackpot wallet
    CreateLeagueJackpotWallet {
        league_name: String
    }
}

#[derive(BorshDeserialize, BorshSerialize)]
pub struct LeagueInstructionStruct {
    pub league_id: String,
    pub creator_id: String,
    pub league_name: String,
    pub events_included: u8,
    pub user_id: String,
    pub manager_id: String,
}

// Implement the unpacking of the instruction data
impl LeagueInstruction {
    // Unpack inbound buffer to associated Instruction
    // The expected format for input is a Borsh serialized vector

    pub fn unpack(input: &[u8]) -> Result<Self, ProgramError> {
        // Take the first byte as the variant to
        // determine which instruction to execute
        let (&variant, rest) = input
            .split_first()
            .ok_or(ProgramError::InvalidInstructionData)?;
        // Match the variant to the appropriate instruction
        //Extract payload from the rest of the data
        let payload = LeagueInstructionStruct::try_from_slice(rest).unwrap();
        //Match instruction to the variant
        Ok(match variant {
            0 => Self::CreateLeague {
                league_id: payload.league_id,
                creator_id: payload.creator_id,
                league_name: payload.league_name,
                events_included: payload.events_included,
            },
            1 => Self::CreateAccount {
                user_id: payload.user_id,
                manager_id: payload.manager_id,
            },
            3 => Self::CreateLeagueJackpotWallet { 
                league_name: payload.league_name 
            },
            _ => return Err(ProgramError::InvalidInstructionData),
        })
    }
}
