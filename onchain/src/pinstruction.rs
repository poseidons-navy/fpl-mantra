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

    JoinLeague {
        league_id: String,
        user_id: String,
    },


    // Creating League Jackpot wallet
    CreateLeagueJackpotWallet {
        league_name: String
    },

    CreateCompetition {
        name: String,
        league_id: String,
        entry_fee: u8,
        creator_id: String
    },

    JoinCompetition {
        name: String,
        league_id: String,
        user_id: String,
        manager_id: String
    },
    SendMoney{
        entry_fee: u8,
        league_id: String,
    },
    

}

#[derive(BorshDeserialize, BorshSerialize)]
pub struct LeagueInstructionStruct {
    pub league_id: String,
    pub creator_id: String,
    pub league_name: String,
    pub events_included: u8,
    pub user_id: String,
    pub manager_id: String,
    pub entry_fee: u8,
    pub name: String,
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

            3 => Self::JoinLeague {
                league_id: payload.league_id,
                user_id: payload.user_id},

            2 => Self::CreateLeagueJackpotWallet { 
                league_name: payload.league_name 
            },
            4 => Self::CreateCompetition { 
                name: payload.name, 
                league_id: payload.league_id, 
                entry_fee: payload.entry_fee, 
                creator_id: payload.creator_id
            },
            5 => Self::JoinCompetition { 
                name: payload.name, 
                league_id: payload.league_id, 
                user_id: payload.user_id, 
                manager_id: payload.manager_id 

            },
            6 => Self::SendMoney {
                entry_fee: payload.entry_fee,
                league_id: payload.league_id
            },
            _ => return Err(ProgramError::InvalidInstructionData),
        })
    }
}
