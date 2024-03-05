use borsh::{BorshDeserialize, BorshSerialize};



/**
 * LeagueAccountState. This struct will define the
 *  parametersthat each new league account will store in its data field
 */
#[derive(BorshDeserialize, BorshSerialize)]
 pub struct LeagueAccountState {
    pub league_id: String,
    pub is_initalized: bool,
    pub is_created: bool,
    pub creator_id: String,
    pub league_name: String,
    pub events_included: u8,
    pub league_members: Vec<String>,//For now string but may be changed to a struct
}