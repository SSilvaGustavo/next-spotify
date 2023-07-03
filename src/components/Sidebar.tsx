import { playlistIdState, playlistState } from "@/atoms/playlistAtoms";
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
import { useRecoilState } from "recoil";

export default function Sidebar() {
  const spotifyApi = useSpotify();
  const { data: session, status } = useSession();
  const [playlistId, setPlaylistsId] = useRecoilState(playlistIdState);

  const [playlists, setPlaylists] = useState<
    SpotifyApi.PlaylistObjectSimplified[]
  >([]);

  useEffect(() => {
    if (spotifyApi.getAccessToken()) {
      spotifyApi.getUserPlaylists().then((data) => {
        setPlaylists(data.body.items);
      });
    }
  }, [session, spotifyApi]);

  return (
    <div className="text-zinc-500 p-5 text-xs lg:text-sm border-r border-zinc-900 overflow-y-scroll h-screen scrollbar-hide sm:max-w-[12rem] lg:max-w-[15rem] hidden md:inline-flex">
      <div className="space-y-4 font-bold">
        <button
          className="sidebar-button"
          onClick={() => signOut()}
        >
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

        {playlists.map((playlist) => (
          <p
            key={playlist.id}
            onClick={() => setPlaylistsId(playlist.id)}
            className="cursor-pointer hover:text-white"
          >
            <div>
              <img src={playlist.images[0]} alt="" />
              <p>{playlist.name}</p>
            </div>
          </p>
        ))}
      </div>
    </div>
  );
}
