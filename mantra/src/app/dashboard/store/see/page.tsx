"use client";
import { Suspense } from "react";
import CreateLeague from "./see";
function PageSee() {
  return (
    <Suspense>
      <CreateLeague />
    </Suspense>
  );
}
export default PageSee;
