import { playlistState, playlistIdState } from "@/atoms/playlistAtoms";
import useSpotify from "@/hooks/useSpotify";
import { shuffle } from "lodash";
import { ChevronDownIcon } from "lucide-react";
import { signOut, useSession } from "next-auth/react";
import { useEffect, useState } from "react";
import { useRecoilState } from "recoil";
import { currentViewState } from "@/atoms/viewsAtoms";
import PlaylistSong from "./PlaylistSong";

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

export default function Playlist() {
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
    spotifyApi
      .getPlaylist(playlistId[0])
      .then((data) => {
        setPlaylist(data.body);
      })
      .catch((error) => console.log("Something went wrong!", error));
  }, [firstPlaylistId, spotifyApi]);

  return (
    <>
      <section
        className={`flex items-end space-x-7 bg-gradient-to-b to-zinc-950 ${color} h-80 px-8 text-white rounded-lg`}
      >
        {playlist.images ? (
          <img
            className="h-60 w-60 shadow-2xl"
            src={playlist.images[0].url}
            alt=""
          />
        ) : (
          <div className="h-60 w-60 shadow-2xl border border-white"></div>
        )}
        <div className="flex flex-col text-sm font-semibold">
          <p className="capitalize font-bold">{playlist.type}</p>
          <h1
            className={`text-2xl md:text-4xl font-bold mb-10 mt-2 ${
              playlist.name
                ? playlist.name.length > 19
                  ? playlist.name.length > 25
                    ? "xl:text-4xl"
                    : "xl:text-7xl"
                  : "xl:text-8xl"
                : ""
            }`}
          >
            {playlist.name}
          </h1>
          <span className="text-zinc-400 mb-1">{playlist.description}</span>
          <p>
            {playlist.owner && playlist.owner.display_name} • {playlist.tracks && playlist.tracks.total} songs
          </p>
        </div>
      </section>

      <div className="px-8 flex flex-col text-white space-y-1 pb-28 pt-12 bg-zinc-950">
        {playlist.tracks?.items
          .filter((track) => track.track)
          .map((track, i) => (
            <PlaylistSong key={track.track?.id} track={track} order={i + 1} />
          ))}
      </div>
    </>
  );
}
