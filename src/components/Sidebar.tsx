"use client";

import useSpotify from "@/hooks/useSpotify";
import {
  HomeIcon,
  SearchIcon,
  LibraryIcon,
  PlusCircleIcon,
  HeartIcon,
  RssIcon,
  LogOutIcon,
} from "lucide-react";
import { signOut, useSession } from "next-auth/react";
import { useEffect, useRef, useState } from "react";
import Playlists from "./Playlists";
import Artists from "./Artists";
import { currentViewState } from "@/atoms/viewsAtoms";
import { useRecoilState } from "recoil";

export default function Sidebar() {
  const spotifyApi = useSpotify();
  const { data: session, status } = useSession();
  const [view, setView] = useRecoilState(currentViewState);


  const [playlists, setPlaylists] = useState<
    SpotifyApi.PlaylistObjectSimplified[]
  >([]);
  const [artists, setArtists] = useState<SpotifyApi.ArtistObjectFull[]>();
  const [prevScrollPos, setPrevScrollPos] = useState(0);
  const scrollDiv = useRef<HTMLDivElement>(null)

  useEffect(() => {
    if (spotifyApi.getAccessToken()) {
      spotifyApi.getUserPlaylists().then((data) => {
        setPlaylists(data.body.items);
      });
      spotifyApi.getMyTopArtists({ limit: 5 }).then((data) => {
        setArtists(data.body.items);
      });
    }
  }, [session, spotifyApi]);

  return (
    <div className="text-zinc-500 bg-black m-2 text-xs lg:text-sm h-screen sm:max-w-[12rem] lg:max-w-[24rem] hidden md:inline-flex rounded-lg">
      <div className="flex flex-col gap-5 h-full font-extrabold text-base">
        <div className="flex flex-col space-y-4 bg-zinc-950 rounded-lg p-5">
          <button className="sidebar-button gap-4" onClick={() => signOut()}>
            <LogOutIcon className="h-6 w-6" />
            <p>Logout</p>
          </button>
          <button className="sidebar-button gap-4" onClick={() => setView("Home")}>
            <HomeIcon className="h-6 w-6" />
            <p>Home</p>
          </button>
          <button className="sidebar-button gap-4" onClick={() => setView("Home")}>
            <SearchIcon className="h-6 w-6" />
            <p>Search</p>
          </button>
        </div>

        <div className={`bg-zinc-950 rounded-lg`}>
          <div className={`${prevScrollPos === 0 ? "" : "shadow-lg shadow-black/70"}`}>
            <button className={`sidebar-button p-5`}>
              <LibraryIcon className="h-6 w-6 gap-4" />
              <p>Your Library</p>
            </button>
          </div>
          <div className="flex flex-col overflow-y-scroll scrollbar-hide h-[64vh]" ref={scrollDiv} onScroll={() => setPrevScrollPos(scrollDiv.current!.scrollTop)}>
            {playlists.map((playlist) => (
              <Playlists key={playlist.id} playlist={playlist} />
            ))}

            {artists &&
              artists.map((artist) => (
                <Artists key={artist.id} artist={artist} />
              ))}
          </div>
        </div>
      </div>
    </div>
  );
}
