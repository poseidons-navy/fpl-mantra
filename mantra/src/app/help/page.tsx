"use client";
import Image from "next/image";
import Link from "next/link";
import points from "../../../public/points.png";
import gameweek from "../../../public/gameweek.png";
import urlgame from "../../../public/url.png";


const Instructions = () => {
  return (
    <main className="flex flex-col items-center justify-center p-8">
      {/* Section 1: */}
      <section className="max-w-4xl mb-8">
        <h1 className="text-3xl font-bold mb-4">Sign up and getting Manager ID</h1>
        <p className="text-lg mb-4">
          <strong>Step 1:</strong> From the homepage, select <strong>Sign Up</strong>. You will be redirected to the Fantasy Premier League app. Create a new account if you don't have one or sign in if you are already a member.
        </p>
        <p className="text-lg mb-4">
          <strong>Step 2:</strong> From the navigation menus, select <strong>Points</strong>.
        </p>
        <div className="mb-4">
          <Image src={points} alt="Select Points" width={600} height={400} />
        </div>
        <p className="text-lg mb-4">
          <strong>Step 3:</strong> Look to your right and select <strong>View Gameweek History</strong>.
        </p>
        <div className="mb-4">
          <Image src={gameweek} alt="Select Points" width={600} height={400} />
        </div>
        <p className="text-lg mb-4">
          <strong>Step 4:</strong> At the top you can see URL, locate your <strong>Manager ID (in digits)</strong> and Copy it, can also save it for future reference.
        </p>
        <div className="mb-4">
          <Image src={urlgame} alt="Select Points" width={600} height={400} />
        </div>
        <p className="text-lg mb-4">
          <strong>Step 5:</strong> Return to the FPL Mantra homepage. Click <strong>Log In</strong> (then next you will paste your manager ID ) and start enjoying your FPL experience!
        </p>
    </section>

      
    </main>
  );
};

export default Instructions;

