use borsh::{BorshDeserialize, BorshSerialize};

#[derive(BorshDeserialize, BorshSerialize)]
pub struct Account {
    pub user_id: String,
    pub manager_id: String
}

#[derive(BorshDeserialize, BorshSerialize)]
pub struct Mantra {
    pub accounts: Vec<Account>
}