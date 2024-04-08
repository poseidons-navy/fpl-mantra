"use client";
import BackButton from "@/components/back-button";
import React, { useState, Suspense } from "react";
import { useSearchParams } from "next/navigation";
import { z } from "zod";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { FplData } from "./league";
import axios from "axios";
const formSchema = z.object({
  name: z.string(),
  description: z.string(),
  teams: z.number(),
  price: z.number(),

  // tags: z.string()
});

type Schema = z.infer<typeof formSchema>;

function CreateLeague() {
  const [league_members, setLeague_members] = useState<FplData[]>([]);
  const searchParams = useSearchParams();
  const league_id = searchParams.get("leagueId");
  const join_code = searchParams.get("code");
  const name = searchParams.get("name");
  if (league_id === null || join_code === null || name === null) {
    throw new Error("Invalid league id or join code or name");
  }
  React.useEffect(() => {
    (async () => {
      try {
        const response = await axios.get(
          `/api/get_leagues?leagueId=${league_id}`
        );
        setLeague_members(response.data);
      } catch (err) {
        console.log("error occured during fetch");
      }
    })();
  }, [league_id]);
  return (
    <div className="flex flex-col w-auto h-auto ">
      <div className="flex flex-row items-center justify-start w-full">
        <BackButton />
      </div>
      <div className="flex flex-col w-full  h-full items-center justify-center px-5 ">
        <h2 className="text-lg font-semibold">{name?.toUpperCase()}</h2>
        <h3 className="text-md font-semibold">Join Code: {join_code}</h3>
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>Pos</TableHead>
              <TableHead>Team/Owner</TableHead>
              <TableHead>GW Points</TableHead>
              <TableHead>Total Points</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {((league_members as any).standings?.results || []).map(
              (elem: any, index: number) => {
                return (
                  <TableRow key={elem.entry_name}>
                    <TableCell>{index + 1}</TableCell>
                    <TableCell>{elem.entry_name}</TableCell>
                    <TableCell>{elem.event_total}</TableCell>
                    <TableCell>{elem.total}</TableCell>
                  </TableRow>
                );
              }
            )}
          </TableBody>
        </Table>
      </div>
    </div>
  );
}

export default CreateLeague;
