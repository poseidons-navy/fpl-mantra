use crate::pstate::LeagueAccountState;
use borsh::{BorshDeserialize, BorshSerialize};
use solana_program::{
    account_info::{next_account_info, AccountInfo},
    entrypoint::ProgramResult,
    instruction::Instruction,
    msg,
    program::invoke_signed,
    program_error::ProgramError,
    pubkey::Pubkey,
    system_instruction,
    sysvar::{rent::Rent, Sysvar},
};

/**
 * Function to create a league
 */
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

    //Iterate through accounts

    //Get the account iterator
    let account_info_iter = &mut accounts.iter();
    //Get accounts
    let league_creator = next_account_info(account_info_iter)?;
    let pda_account = next_account_info(account_info_iter)?;
    let system_program_info = next_account_info(account_info_iter)?;

    //Getting the amount of space needed.
    let default_league = LeagueAccountState {
        league_id: league_id.clone(),
        creator_id: creator_id,
        league_name: league_name.clone(),
        events_included,
        league_members: Vec::new(),
        is_initalized: true,
        is_created: false,
    };
    //Calculating rent
    let account_len = get_league_size(&default_league);
    let rent = Rent::get()?;
    let rent_lamports = rent.minimum_balance(account_len);
    //derive the PDA
    let (pda, bump_seed) = generate_pda(&league_creator.key, &league_id, program_id);

    //Create new account
    invoke_signed_transaction(
        &system_instruction::create_account(
            &league_creator.key,
            &pda_account.key,
            rent_lamports,
            account_len.try_into().unwrap(),
            program_id,
        ),
        &[
            league_creator.clone(),
            pda_account.clone(),
            system_program_info.clone(),
        ],
        &league_id,
        bump_seed,
    )?;
    //Deserializing the account data
    let mut pda_account_data =
        deserialize_account_data::<LeagueAccountState>(&pda_account.data.borrow()).unwrap();
    pda_account_data.league_id = default_league.league_id;
    pda_account_data.creator_id = default_league.creator_id;
    pda_account_data.league_name = default_league.league_name;
    pda_account_data.events_included = default_league.events_included;
    pda_account_data.is_initalized = default_league.is_initalized;
    pda_account_data.is_created = default_league.is_created;
    pda_account_data.league_members = default_league.league_members;
    //Serialize the account data
    msg!("Serializing the account data");

    pda_account_data.serialize(&mut &mut pda_account.data.borrow_mut()[..])?;

    Ok(())
}

/**
 * Function to generate the PDA
 *
 */
pub fn generate_pda(
    league_creator: &Pubkey,
    league_id: &String,
    program_id: &Pubkey,
) -> (Pubkey, u8) {
    let (pda, _bump_seed) =
        Pubkey::find_program_address(&[league_creator.as_ref(), league_id.as_bytes()], program_id);
    (pda, _bump_seed)
}

pub fn get_league_size(league: &LeagueAccountState) -> usize {
    let is_initialized_size = 1;
    let league_id_size = 4 + league.league_id.len();
    let creator_id_size = 4 + league.creator_id.len();
    let league_name_size = 4 + league.league_name.len();
    let events_included_size = 1;
    let mut league_members_size = 4;
    for member in league.league_members.iter() {
        league_members_size += 4 + member.len();
    }
    let size = is_initialized_size
        + league_id_size
        + creator_id_size
        + league_name_size
        + events_included_size
        + league_members_size;
    size + 50
}

/***
 * Invoke signed transaction
 */
pub fn invoke_signed_transaction(
    instruction: &Instruction,
    account_info: &[AccountInfo],
    league_id: &String,
    bump_seed: u8,
) -> ProgramResult {
    invoke_signed(
        &instruction,
        account_info,
        &[&[
            &league_id.as_bytes(),
            &[bump_seed],
            &account_info[0].key.as_ref(),
        ]],
    )?;
    Ok(())
}

/**
 * Deserialize account data
 */
pub fn deserialize_account_data<T: borsh::BorshDeserialize>(
    data: &[u8],
) -> Result<T, ProgramError> {
    let mut mutable_data = data;
    match T::deserialize(&mut mutable_data) {
        Ok(data) => Ok(data),
        Err(_) => Err(ProgramError::InvalidInstructionData),
    }
}

#[cfg(test)]
mod tests {
    use {
        super::*,
        crate::pinstruction::LeagueInstructionStruct,
        crate::pstate::LeagueAccountState,
        borsh::{BorshDeserialize, BorshSerialize},
        solana_program::instruction::{AccountMeta, Instruction},
        solana_program::system_program,
        solana_program_test::*,
        solana_sdk::{signature::Signer, signer::keypair::Keypair, transaction::Transaction},
    };

    #[tokio::test]
    async fn create_league_works() {
        let instruction_data = LeagueInstructionStruct {
            league_id: String::from("LeagueID"),
            creator_id: String::from("CreatorID"),
            league_name: String::from("League Name"),
            events_included: 1,
            user_id: String::from(""),
            manager_id: String::from(""),
        };
        //Serialize the instruction data
        let mut sink = vec![1];
        instruction_data.serialize(&mut sink).unwrap();
        msg!("Sink: {:?}", sink);
        let program_id = Pubkey::new_unique();

        let (mut banks_client, payer, recent_blockhash) = ProgramTest::new(
            "Mantra",
            program_id,
            processor!(crate::entrypoint::process_instruction),
        )
        .start()
        .await;
        let league_creator = Keypair::new();
        let (pda,_bump_seed) = generate_pda(&league_creator.pubkey(), &instruction_data.league_id, &program_id);
        msg!("PDA: {}", pda);
      

        let mut transaction = Transaction::new_with_payer(
            &[Instruction {
                program_id,
                accounts: vec![
                    AccountMeta::new(payer.pubkey(), true),
                    AccountMeta::new(pda, false),
                    AccountMeta::new(system_program::id(), false),
                ],
                data: sink,
            }],
            Some(&payer.pubkey()),
        );

        transaction.sign(&[&payer], recent_blockhash);

        banks_client.process_transaction(transaction).await.unwrap();

        let created_account = banks_client.get_account(pda).await;

        match created_account {
            Ok(None) => assert_eq!(false, true),
            Ok(Some(account)) => {
                let league =
                    LeagueAccountState::deserialize(&mut account.data.to_vec().as_ref()).unwrap();
                    msg!("League ID from program: {}", league.league_id);
                    msg!("League id from instruction: {}", &instruction_data.league_id);
                assert!(league.league_id== instruction_data.league_id);
            }
            Err(_) => assert_eq!(false, true),
        }
    }
}
