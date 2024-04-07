export interface FplData {
    new_entries: {
        has_next: boolean;
        page: number;
        results: any[]; // Update the type of results based on the actual data structure
    };
    last_updated_data: string;
    league: {
        id: number;
        name: string;
        created: string;
        closed: boolean;
        max_entries: number | null;
        league_type: string;
        scoring: string;
        admin_entry: number;
        start_event: number;
        code_privacy: string;
        has_cup: boolean;
        cup_league: any; // Update the type based on the actual data structure
        rank: any; // Update the type based on the actual data structure
    };
    standings: {
        has_next: boolean;
        page: number;
        results: StandingsResult[]; // Create a new interface for StandingsResult
    };
}

interface StandingsResult {
    id: number;
    event_total: number;
    player_name: string;
    rank: number;
    last_rank: number;
    rank_sort: number;
    total: number;
    entry: number;
    entry_name: string;
}