use borsh::{BorshDeserialize, BorshSerialize};

#[derive(BorshDeserialize, BorshSerialize)]
pub struct Account {
    pub user_id: String,
    pub manager_id: String
}