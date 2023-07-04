import useSpotify from "@/hooks/useSpotify";
import { shuffle } from "lodash";
import { ChevronDownIcon } from "lucide-react";
import { signOut, useSession } from "next-auth/react";
import { useEffect, useState } from "react";
import { useRecoilState } from "recoil";
import { currentViewState } from "@/atoms/viewsAtoms";
import { artistIdState, artistState } from "@/atoms/artistAtoms";
import ArtistSong from "./ArtistSong";

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

export default function Artist() {
  const { data: session } = useSession();
  const spotifyApi = useSpotify();
  const [color, setColor] = useState<string>();
  const artistId = useRecoilState(artistIdState);
  const [artist, setArtist] = useRecoilState(artistState);
  const [artistTracks, setArtistTracks] = useState<SpotifyApi.TrackObjectFull[]>()
  const firstArtistId = artistId[0];

  useEffect(() => {
    setColor(shuffle(colors).pop());
  }, [firstArtistId]);

  useEffect(() => {
    spotifyApi
      .getArtist(artistId[0])
      .then((data) => {
        setArtist(data.body);
      })
      .catch((error) => console.log("Something went wrong!", error));
  }, [firstArtistId, spotifyApi]);

  async function getTopTracks() {
    const response = await fetch(
      `https://api.spotify.com/v1/artists/${artistId[0]}/top-tracks?` +
        new URLSearchParams({ market: "BR" }),
      {
        headers: {
          Authorization: `Bearer ${session?.user?.accessToken}`,
        },
      }
    );
    const data = await response.json();
    return data.tracks;
  }

  useEffect(() => {
    async function f() {
      if (session && session.user?.accessToken) {
        setArtistTracks(await getTopTracks());
      }
    }
    f();
  }, [session, artistId[0]]);

  return (
    <>
      <section
        className={`flex items-end space-x-7 bg-gradient-to-b to-zinc-950 ${color} h-80 px-8 py-4 text-white rounded-lg`}
      >
        {artist.images ? (
          <img
            className="h-60 w-60 shadow-2xl"
            src={artist.images[0].url}
            alt=""
          />
        ) : (
          <div className="h-60 w-60 shadow-2xl border border-white"></div>
        )}
        <div className="flex flex-col space-y-5">
          <h1 className="text-3xl md:text-5xl xl:text-8xl font-bold">
            {artist.name}
          </h1>
          <span className="">
            {`${artist.followers?.total.toLocaleString()} monthly listeners`}
          </span>
        </div>
      </section>

      <div className="px-8 flex flex-col text-white space-y-1 pb-28 pt-12 bg-zinc-950">
        {artistTracks?.slice(0, 5).map((track, i) => (
          <ArtistSong key={track.id} track={track} order={i + 1} />
        ))}
      </div>
    </>
  );
}
