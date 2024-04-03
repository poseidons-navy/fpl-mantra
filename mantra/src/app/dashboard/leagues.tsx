"use client"
import { TableBody, TableCell, TableRow } from "@/components/ui/table"
import {Button} from "@/components/ui/button"
import Link from "next/link"
export default function LeaguesList(props:any){
    return (
        <TableBody>
            {
              /* {purchaseHistory.map((elem, index) => {
                        return*/ <TableRow /*key={index}*/>
                <TableCell>{props.league_name}</TableCell>
                <TableCell>Admin</TableCell>
                <TableCell>{props.total_members}</TableCell>
                <TableCell>
                  <Link href="/dashboard/store/see">
                    <Button>Preview</Button>
                  </Link>
                </TableCell>
              </TableRow>
              /*})} */
            }
          </TableBody>
    )
}