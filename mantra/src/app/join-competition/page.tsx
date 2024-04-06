import {getCompetitionsFromDB} from "@/db/getions";
import {FirebaseCompetition} from "@/utils/firebase-types";
import React, { useState, useEffect } from "react";

export default function JoinCompetition() {
  const [competitions, setCompetitions] = useState<FirebaseCompetition[]>([]);

  useEffect(() => {
    async function getCompetitions() {
      try {
        const c = await getCompetitionsFromDB();
        setCompetitions(c);
      } catch(er) {
        console.log("Could Not Get Competitions", er);
      }
    }

    getCompetitions();
  }, []);
  return (
    <>
      <p>Hello World</p>
    </>
  );  
}
