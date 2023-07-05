import { currentViewState } from "@/atoms/viewsAtoms";
import { ChevronDownIcon, ChevronLeftIcon } from "lucide-react";
import { signOut, useSession } from "next-auth/react";
import { useRecoilState } from "recoil";

export default function User() {
  const { data: session } = useSession();
  const [view, setView] = useRecoilState(currentViewState);
  return (
    <header>
      <div
        className={`absolute top-2 right-5 flex items-center bg-black space-x-3 opacity-90 hover:opacity-80 cursor-pointer rounded-full p-1 pr-2 text-white transition-opacity`}
        onClick={() => signOut()}
      >
        <img
          className="rounded-full w-6 h-6"
          src={session?.user?.image!}
          alt=""
          referrerPolicy="no-referrer"
        />

        <h2>{session?.user?.name}</h2>
        <ChevronDownIcon className="h-5 w-5" />
      </div>
      {view !== "Home" && (
        <div className="absolute top-2 left-5 inline-flex justify-center items-center h-8 w-8 rounded-full bg-black/70">
          <ChevronLeftIcon
            onClick={() => setView("Home")}
            className="pr-1 text-white h-8 w-8 fill-transparent stroke-1 cursor-pointer"
          />
        </div>
      )}
    </header>
  );
}
