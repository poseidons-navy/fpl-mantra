import Link from "next/link";

export default function Join() {
    return (<div className="bg-neutral-500">
        <p>If you don't have an FPL Account click join now otherwise click on create FPL Mantra Account</p>
        <Link href="https://fantasy.premierleague.com/"><button className='w-48 h-12 text-sm sm:text-base rounded bg-white text-black hover:bg-fuchsia-700 hover:text-white transition-colors'>Join Now!</button></Link>
        <Link href="/create-account"><button className='h-12 text-sm sm:text-base rounded bg-white text-black hover:bg-fuchsia-700 hover:text-white transition-colors'>Create FPL Mantra Account</button></Link>
    </div>);
}