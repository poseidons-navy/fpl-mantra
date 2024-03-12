use borsh::{BorshDeserialize, BorshSerialize};

#[derive(BorshDeserialize, BorshSerialize)]
pub struct Account {
    pub user_id: String,
    pub manager_id: String
}

#[derive(BorshDeserialize, BorshSerialize)]
pub struct Competition {
    pub members: Vec<String>,
    pub name: String,
    pub league_id: String,
    pub entry_fee: f64
}