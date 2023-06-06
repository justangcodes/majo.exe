import { ArrowRightIcon } from "@heroicons/react/24/outline";
import { Invite } from "components/buttons/Invite";
import { Login } from "components/buttons/Login";
import Link from "next/link";

export default async function Main() {
 return (
  <div className="h-screen w-full absolute before:grayscale after:absolute after:inset-0 after:h-full after:w-full after:-z-10 after:top-20 after:opacity-30 custom-bg z-20 before:md:bg-[url('/assets/svg/grid.svg')] before:opacity-50 before:w-full before:h-full before:absolute before:z-10">
   <div className="z-20 relative flex h-screen flex-col items-center justify-center gap-4 bg-[radial-gradient(circle,rgba(2,0,36,0)0,rgb(16,17,16,100%))]">
    <Link href={"/invite"} className="text-center -mt-4 font-medium bg-background-menu-button/50 backdrop-blur flex flex-row items-center border group transition-all duration-200 hover:bg-background-menu-button/40 cursor-copy border-neutral-700 rounded-full px-6 py-1">
     Introducing Majo.exe v6
     <ArrowRightIcon className="inline-block w-4 h-4 ml-2 group-hover:translate-x-1 transition-all duration-200" />
    </Link>
    <h1 className="text-center text-6xl pt-4 font-extrabold text-white">
     <p>The only one Discord Bot</p>
     <p>you will ever need.</p>
    </h1>
    <h1></h1>
    <h2 className="max-w-[680px] text-center text-2xl text-white/70 px-4">Majo.exe will not only keep your server entertained but also assist you with moderation and many other things!</h2>
    <div className="mt-2 flex gap-4">
     <Login />
     <Invite />
    </div>
   </div>
  </div>
 );
}
