"use client"
import Image from "next/image";
import Link from "next/link";
import background from "../../public/stadium.png"

export default function Home() {
  return (
     <main className="flex max-h-screen flex-col items-center justify-center relative p-24">
      <div className="absolute inset-0 z-0">
        <Image 
          src={background}
          alt="background image" 
          objectFit="cover"
        />
      </div>
      <header id="home" className="flex flex-col-reverse md:flex-row w-full h-screen max-w-7xl items-center justify-center p-8 relative overflow-x-hidden">
        <div className='w-full h-2/4 md:h-full md:w-2/5 flex flex-col justify-center items-center md:items-start gap-8'>
          <div className='flex flex-col gap-2'>
            <h1 className='text-4xl font-black md:text-8xl'>FPL Mantra</h1>
            <h2 className='text-md md:text-2xl'>Start winning today!</h2>
          </div>
          <p className='max-w-md text-sm md:text-base text-zinc-500'>FPL Mantra is a platform that allows users to win prizes from league tournaments they set on fpl league.</p>
          <div className='w-full flex items-center justify-center md:justify-start gap-4'>
           {/* <Link href="https://fantasy.premierleague.com/"><button className='w-48 h-12 text-sm sm:text-base rounded bg-white text-black hover:bg-fuchsia-700 hover:text-white transition-colors'>Join Now!</button></Link> */}
            <Link href = "/join"><button className='w-48 h-12 text-sm sm:text-base rounded bg-white text-black hover:bg-fuchsia-700 hover:text-white transition-colors'>Join Now!</button></Link>
            <p className='max-w-md text-sm md:text-base text-zinc-500'>Already have an account? <Link className="text-black hover:text-fuchsia-700 " href="./Signup">Log in</Link></p>
          </div>
        </div>

        <div className='w-full h-2/4 md:h-full md:w-3/5 flex items-center justify-center relative -z-10'>
          
  </div>

      </header>

     
    </main>

  );
}



function Navbar() {
  return (
    <div className='w-full h-16 backdrop-filter backdrop-blur-xl bg-opacity-20 border-b flex items-center justify-center'>
      <div className='max-w-7xl w-full flex items-center justify-between p-4'>
        <h1 className='font-bold'>FPL Mantra</h1>
      </div>

    </div>
  )
}




