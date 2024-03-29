import { Buffer } from "buffer";
import { Schema } from "borsh";
export class Assignable {
        [key: string]: any; // Add index signature
        constructor(properties: { [x: string]: any; variant?: number; league_id?: string; creator_id?: string; league_name?: string; events_included?: number; user_id?: string; manager_id?: string; entry_fee?: number; name?: string; }) {
            Object.keys(properties).map((key) => {
                return (this[key] = properties[key]);
            });
        }
    }
export class Payload extends Assignable{}
//Generating a schema for the league
export const payloadSchema: Schema = new Map([
    [
    Payload,
    {
        kind: "struct",
        fields: [
            ["variant", "u8"],
            ["league_id", "string"],
            ["league_name", "string"],
            ["creator_id", "string"],
            ["events_included", "u8"],
            ["user_id", "string"],
            ["manager_id", "string"],
            ["entry_fee", "u64"],
            ["name", "string"],
        ],
    },
    ],
]);


