import useSpotify from "@/hooks/useSpotify";
import { ChevronDownIcon, PlayIcon } from "lucide-react";
import { signOut, useSession } from "next-auth/react";
import { useEffect, useState } from "react";
import { useRecoilState } from "recoil";
import { currentViewState } from "@/atoms/viewsAtoms";
import {
  artistIdState,
  artistState,
  artistTopTracks,
  relatedArtistsState,
} from "@/atoms/artistAtoms";
import ArtistSong from "./ArtistSong";
import Card from "./Card";
import { colorState } from "@/atoms/utilsAtoms";

export default function Artist() {
  const { data: session } = useSession();
  const spotifyApi = useSpotify();
  const [color, setColor] = useRecoilState(colorState);
  const [artistId, setArtistId] = useRecoilState(artistIdState);
  const [artist, setArtist] = useRecoilState(artistState);
  const [relatedArtists, setRelatedArtists] =
    useState<SpotifyApi.ArtistObjectFull[]>();
  // const [artistTracks, setArtistTracks] = useState<SpotifyApi.TrackObjectFull[]>();
  const [artistTracks, setArtistTracks] = useRecoilState(artistTopTracks)

  async function getTopTracks() {
    const response = await fetch(
      `https://api.spotify.com/v1/artists/${artistId}/top-tracks?` +
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
  }, [session, artistId]);

  useEffect(() => {
    spotifyApi
      .getArtist(artistId)
      .then((data) => {
        setArtist(data.body);
      })
      .catch((error) => console.log("Something went wrong!", error));

      spotifyApi
      .getArtistRelatedArtists(artistId)
      .then((data) => {
        setRelatedArtists(data.body.artists);
      })
      .catch((error) => console.log("Something went wrong!", error));
  }, [artistId, spotifyApi]);

  return (
    <div className="flex flex-col h-full">
      <section
        className={`flex items-end space-x-7 bg-gradient-to-b to-zinc-950 ${color} h-80 px-8 py-4 text-white rounded-t-lg`}
      >
        {artist.images ? (
          <img
            className="h-60 w-60 shadow-2xl rounded"
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
      <div className="px-8 flex flex-col pb-28 pt-12 bg-zinc-950 gap-12">
        <div className="flex flex-col text-white font-bold space-y-2">
          <h1 className="text-2xl">Popular</h1>
          <div className="flex flex-col text-white space-y-1">
            {artistTracks?.slice(0, 5).map((track, i) => (
              <ArtistSong key={track.id} track={track} order={i + 1} />
            ))}
          </div>
        </div>
        <div className="flex flex-col text-white font-bold space-y-6">
          <h1 className="text-2xl">Fans Also Like</h1>
          <div className="flex gap-6">
            {relatedArtists?.slice(0, 7).map((relatedArtist, i) => (
              <Card key={relatedArtist.id} image={relatedArtist.images[0].url} name={relatedArtist.name} description={relatedArtist.type} onClick={() => setArtistId(relatedArtist.id)} isArtist/>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}
