import { playlistState, playlistIdState } from "@/atoms/playlistAtoms";
import useSpotify from "@/hooks/useSpotify";
import { shuffle } from "lodash";
import { ChevronDownIcon } from "lucide-react";
import { signOut, useSession } from "next-auth/react";
import { useEffect, useState } from "react";
import { useRecoilState } from "recoil";
import Songs from "./Songs";

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
  const [color, setColor] = useState<string>();
  const playlistId = useRecoilState(playlistIdState);
  const [playlist, setPlaylist] = useRecoilState(playlistState);
  const firstPlaylistId = playlistId[0];

  useEffect(() => {
    setColor(shuffle(colors).pop());
  }, [firstPlaylistId]);

  useEffect(() => {
    spotifyApi.getPlaylist(playlistId[0])
    .then((data) => {
      setPlaylist(data.body);
    })
    .catch((error) => console.log("Something went wrong!", error));
  }, [firstPlaylistId, spotifyApi]);

  return (
    <div className="flex-grow h-screen overflow-y-scroll scrollbar-hide relative">
      <header className="absolute top-5 right-8">
        <div
          className={`flex items-center bg-black space-x-3 opacity-90 hover:opacity-80 cursor-pointer rounded-full p-1 pr-2 text-white transition-opacity`}
          onClick={() => signOut()}
        >
          <img
            className="rounded-full w-10 h-10"
            src={session?.user?.image!}
            alt=""
            referrerPolicy="no-referrer"
          />

          <h2>{session?.user?.name}</h2>
          <ChevronDownIcon className="h-5 w-5" />
        </div>
      </header>

      <section
        className={`flex items-end space-x-7 bg-gradient-to-b to-black ${color} h-80 px-8 text-white`}
      >
        {
          playlist.images ?
          <img
          className="h-44 w-44 shadow-2xl"
          src={playlist.images[0].url}
          alt=""
        />
        :
        <div className="h-44 w-44 shadow-2xl border border-white">

        </div>
        }
        <div>
          <p className="text-sm">PLAYLIST</p>
          <h1 className="text-2xl md:text-3xl xl:text-5xl font-bold">{playlist.name}</h1>
        </div>
      </section>

      <div className="">
        <Songs />
      </div>
    </div>
  );
}
