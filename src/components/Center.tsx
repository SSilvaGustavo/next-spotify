import { playlistState, playlistIdState } from "@/atoms/playlistAtoms";
import useSpotify from "@/hooks/useSpotify";
import { shuffle } from "lodash";
import { ChevronDownIcon } from "lucide-react";
import { signOut, useSession } from "next-auth/react";
import { useEffect, useState } from "react";
import { useRecoilState } from "recoil";
import { currentViewState } from "@/atoms/viewsAtoms";
import Playlist from "./Playlist";
import Artist from "./Artist";
import Home from "./Home";
import { colorState } from "@/atoms/utilsAtoms";
import { artistIdState } from "@/atoms/artistAtoms";

const colors = [
  "from-red-500",
  "from-blue-500",
  "from-green-500",
  "from-indigo-500",
  "from-purple-500",
  "from-yellow-500",
  "from-pink-500",
  "from-sky-500",
  "from-teal-500",
  "from-emerald-500",
  "from-orange-500",
];

export default function Center() {
  const { data: session } = useSession();
  const spotifyApi = useSpotify();
  const [color, setColor] = useRecoilState(colorState);
  const playlistId = useRecoilState(playlistIdState);
  const artistId = useRecoilState(artistIdState);
  const [playlist, setPlaylist] = useRecoilState(playlistState);
  const [view, setView] = useRecoilState(currentViewState);
  const firstPlaylistId = playlistId[0];

  useEffect(() => {
    setColor(shuffle(colors).pop()!);
  }, [artistId[0], playlistId[0]]);

  return (
    <div className="flex-grow h-screen overflow-y-scroll scrollbar-hide relative m-2">
      <header className="absolute top-5 right-8">
        <div
          className={`flex items-center bg-black space-x-3 opacity-90 hover:opacity-80 cursor-pointer rounded-full p-1 pr-2 text-white transition-opacity`}
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
      </header>
      { view === "Home" && <Home /> }
      { view === "Playlist" && <Playlist  /> }
      { view === "Artist" && <Artist /> }
    </div>
  );
}
