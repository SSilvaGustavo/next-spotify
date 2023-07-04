"use client"

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
import { useEffect, useState } from "react";
import Playlists from "./Playlists";
import Artists from "./Artists";

export default function Sidebar() {
  const spotifyApi = useSpotify();
  const { data: session, status } = useSession();

  const [playlists, setPlaylists] = useState<
    SpotifyApi.PlaylistObjectSimplified[]
  >([]);
  const [artists, setArtists] = useState<SpotifyApi.ArtistObjectFull[]>();

  useEffect(() => {
    if (spotifyApi.getAccessToken()) {
      spotifyApi.getUserPlaylists().then((data) => {
        setPlaylists(data.body.items);
      });
      spotifyApi.getMyTopArtists({ limit: 3 }).then((data) => {
        setArtists(data.body.items);
      });
    }
  }, [session, spotifyApi]);

  return (
    <div className="text-zinc-500 bg-zinc-950 p-5 m-2 text-xs lg:text-sm border-r border-zinc-900 h-screen sm:max-w-[12rem] lg:max-w-[24rem] hidden md:inline-flex rounded-lg">
      <div className="space-y-4 font-bold">
        <button className="sidebar-button" onClick={() => signOut()}>
          <LogOutIcon className="h-5 w-5" />
          <p>Logout</p>
        </button>
        <button className="sidebar-button">
          <HomeIcon className="h-5 w-5" />
          <p>Home</p>
        </button>
        <button className="sidebar-button">
          <SearchIcon className="h-5 w-5" />
          <p>Search</p>
        </button>
        <button className="sidebar-button">
          <LibraryIcon className="h-5 w-5" />
          <p>Your Library</p>
        </button>
        <hr className="border-t-[0.1px] border-zinc-900" />

        <button className="sidebar-button">
          <PlusCircleIcon className="h-5 w-5" />
          <p>Liked Songs</p>
        </button>
        <button className="sidebar-button">
          <HeartIcon className="h-5 w-5" />
          <p>Create Playlist</p>
        </button>
        <button className="sidebar-button">
          <RssIcon className="h-5 w-5" />
          <p>Your episodes</p>
        </button>
        <hr className="border-t-[0.1px] border-zinc-900" />
        <div className="overflow-y-scroll h-[58%] scrollbar-hide">
          {playlists.map((playlist) => (
            <Playlists key={playlist.id} playlist={playlist} />
          ))}

          {artists && artists.map((artist) => (
            <Artists  key={artist.id} artist={artist}/>
          ))}
        </div>
      </div>
    </div>
  );
}
