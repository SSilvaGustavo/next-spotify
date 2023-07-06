"use client";

import useSpotify from "@/hooks/useSpotify";
import { HomeIcon, SearchIcon, LibraryIcon, LogOutIcon } from "lucide-react";
import { signOut, useSession } from "next-auth/react";
import { useEffect, useRef, useState } from "react";
import Playlists from "./Playlists";
import Artists from "./Artists";
import { currentViewState } from "@/atoms/viewsAtoms";
import { useRecoilState } from "recoil";
import { isEmpty } from "lodash";
import Link from "next/link";
import { meState } from "@/atoms/utilsAtoms";

export default function Sidebar() {
  const spotifyApi = useSpotify();
  const { data: session, status } = useSession();
  const [view, setView] = useRecoilState(currentViewState);
  const me = useRecoilState(meState);

  const [playlists, setPlaylists] = useState<
    SpotifyApi.PlaylistObjectSimplified[]
  >([]);
  const [artists, setArtists] = useState<SpotifyApi.ArtistObjectFull[]>();
  const [prevScrollPos, setPrevScrollPos] = useState(0);
  const scrollDiv = useRef<HTMLDivElement>(null);

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
    <div className="text-zinc-500 bg-black m-2 text-xs lg:text-sm h-screen hidden md:inline-flex rounded-lg">
      <div className="flex flex-col gap-5 h-full font-extrabold text-base w-60 lg:w-96">
        <div className="flex flex-col space-y-4 bg-zinc-950 rounded-lg p-5">
          <button className="sidebar-button gap-4" onClick={() => signOut()}>
            <LogOutIcon className="h-6 w-6" />
            <p>Logout</p>
          </button>
          <button
            className="sidebar-button gap-4"
            onClick={() => setView("Home")}
          >
            <HomeIcon className="h-6 w-6" />
            <p>Home</p>
          </button>
          <button
            className="sidebar-button gap-4"
            onClick={() => setView("Home")}
          >
            <SearchIcon className="h-6 w-6" />
            <p>Search</p>
          </button>
        </div>

        <div className={`bg-zinc-950 rounded-lg`}>
          <div
            className={`${
              prevScrollPos === 0 ? "" : "shadow-lg shadow-black/70"
            }`}
          >
            <button className={`sidebar-button p-5`}>
              <LibraryIcon className="h-6 w-6 gap-4" />
              <p>Your Library</p>
            </button>
          </div>
          <div
            className="flex flex-col overflow-y-scroll scrollbar-hide h-[70vh] 2xl:h-[64vh]"
            ref={scrollDiv}
            onScroll={() => setPrevScrollPos(scrollDiv.current!.scrollTop)}
          >
            {!isEmpty(playlists) && !isEmpty(artists) ? (
              <>
                {playlists.map((playlist) => (
                  <Playlists key={playlist.id} playlist={playlist} />
                ))}

                {artists &&
                  artists.map((artist) => (
                    <Artists key={artist.id} artist={artist} />
                  ))}
              </>
            ) : (
              <div className="flex flex-col bg-zinc-750 rounded p-4 mx-4 text-white">
                <h1>Create your first playlist</h1>
                <p className="text-sm mt-4 mb-8">It's easy, just click here</p>
                <Link
                  href={me[0].external_urls?.spotify ?? ""}
                  target="_blank"
                  className="flex items-center justify-center bg-white text-sm text-black p-2 rounded-full w-32 cursor-pointer hover:scale-105 transition-transform"
                >
                  Create playlist
                </Link>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
