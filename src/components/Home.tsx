import { currentTrackState, isPlayingState } from "@/atoms/songAtoms";
import useSpotify from "@/hooks/useSpotify";
import { artistsFormatter } from "@/utils/formattedArtists";
import { PlayIcon } from "lucide-react";
import { useSession } from "next-auth/react";
import { useEffect, useState } from "react";
import { useRecoilState } from "recoil";
import Card from "./Card";
import { currentViewState } from "@/atoms/viewsAtoms";
import { artistIdState } from "@/atoms/artistAtoms";
import { playlistIdState } from "@/atoms/playlistAtoms";
import { isEmpty } from "lodash";

export default function Home() {
  const { data: session } = useSession();
  const spotifyApi = useSpotify();

  const [currentTrackId, setCurrentTrackId] = useRecoilState(currentTrackState);
  const [isPlaying, setIsPlaying] = useRecoilState(isPlayingState);
  const [view, setView] = useRecoilState(currentViewState);
  const [artistId, setArtistId] = useRecoilState(artistIdState);
  const [playlistId, setPlaylistsId] = useRecoilState(playlistIdState);

  const [recentlyTracks, setRecentlyTracks] =
    useState<SpotifyApi.PlayHistoryObject[]>();
  const [topArtist, setTopArtist] = useState<SpotifyApi.ArtistObjectFull[]>();
  const [playlists, setPlaylists] =
    useState<SpotifyApi.PlaylistObjectSimplified[]>();
  const [partyPlaylists, setPartyPlaylists] =
    useState<SpotifyApi.PlaylistObjectSimplified[]>();
  const [relatedArtists, setRelatedArtists] =
    useState<SpotifyApi.ArtistObjectFull[]>();
  const firstTopArtistId = topArtist && topArtist[0];
  const [featured, setFeatured] =
    useState<SpotifyApi.PlaylistObjectSimplified[]>();

  useEffect(() => {
    if (session?.user?.accessToken) {
      spotifyApi.getMyRecentlyPlayedTracks().then((data) => {
        setRecentlyTracks(data.body.items);
      });

      spotifyApi.getMyTopArtists({ limit: 6 }).then((data) => {
        setTopArtist(data.body.items);
      });

      spotifyApi
        .getPlaylistsForCategory("0JQ5DAqbMKFM6qDjp13Rui", {
          country: "BR",
          limit: 6,
        })
        .then((data) => {
          setPlaylists(data.body.playlists.items);
        });

      spotifyApi
        .getPlaylistsForCategory("party", { country: "BR", limit: 6 })
        .then((data) => {
          setPartyPlaylists(data.body.playlists.items);
        });

      if (isEmpty(topArtist)) {
        spotifyApi.getFeaturedPlaylists({ limit: 6 }).then((data) => {
          setFeatured(data.body.playlists.items);
        });

        spotifyApi.getPlaylistsForCategory
      }
      // spotifyApi.getCategories().then((data) => {
      //   console.log(data.body.categories.items.map((item) => item.id))
      // })
      spotifyApi
    }
  }, [spotifyApi, session]);

  useEffect(() => {
    if (session?.user?.accessToken && firstTopArtistId) {
      spotifyApi.getArtistRelatedArtists(firstTopArtistId.id).then((data) => {
        setRelatedArtists(data.body.artists);
      });
    }
  }, [spotifyApi, session, firstTopArtistId]);

  const playSong = (track: SpotifyApi.PlayHistoryObject) => {
    setCurrentTrackId(track.track.id);
    setIsPlaying(true);
    spotifyApi.play({
      uris: [track.track.uri],
    });
  };

  const handleCardClick = (id: string, type: string) => {
    if (type === "artist") {
      setView("Artist");
      setArtistId(id);
    } else {
      setView("Playlist");
      setPlaylistsId(id);
    }
  };

  return (
    <div className="flex flex-col h-full">
      <section
        className={`flex flex-col items-start justify-end space-x-7 bg-gradient-to-b to-zinc-950 from-purple-700 h-80 px-8 pb-8 text-white rounded-t-lg`}
      >
        <h1 className="text-start w-full py-6 font-bold text-4xl">
          Hi {session?.user?.name?.split(" ")[0]}
        </h1>
        {!isEmpty(recentlyTracks) && (
          <>
            <span className="text-2xl font-bold pb-2">Listen again</span>
            <div className="grid grid-cols-3 gap-x-8 gap-y-4">
              {recentlyTracks
                ?.filter(
                  (recentlyTracked, index, array) =>
                    array.findIndex(
                      (item) => item.track.id === recentlyTracked.track.id
                    ) === index
                )
                .slice(0, 6)
                .map((recentlyTracked) => (
                  <div
                    key={recentlyTracked.track.id}
                    className="relative group flex items-center rounded-lg h-20 w-[28rem] bg-zinc-400/20 space-x-6 hover:bg-zinc-400/30 transition-colors cursor-pointer"
                    onClick={() => playSong(recentlyTracked)}
                  >
                    <img
                      className="rounded-l-lg h-20 w-20"
                      src={recentlyTracked.track.album.images[0].url ?? ""}
                      alt=""
                    />
                    <div className="flex flex-col justify-center">
                      <p className="font-bold">{recentlyTracked.track.name}</p>
                      <span className="text-xs font-medium text-zinc-400 truncate w-80">
                        {artistsFormatter(recentlyTracked.track)}
                      </span>
                    </div>
                    <div className="absolute hidden items-center justify-center h-12 w-12 rounded-full bg-green-500 bottom-4 right-4 group-hover:flex animate-fade-in">
                      <PlayIcon className="h-6 w-6 stroke-black fill-black" />
                    </div>
                  </div>
                ))}
            </div>
          </>
        )}
      </section>

      <div className="px-8 flex flex-col pb-28 pt-12 bg-zinc-950 gap-12">
        <div className="flex flex-col text-white font-bold space-y-6">
          {!isEmpty(topArtist) ? (
            <>
              <h1 className="text-2xl">Your favorite artists</h1>
              <div className="flex gap-8">
                {topArtist &&
                  topArtist?.map((artist) => (
                    <Card
                      key={artist.id}
                      image={artist.images[0].url}
                      name={artist.name}
                      description={artist.type}
                      onClick={() => handleCardClick(artist.id, "artist")}
                      isArtist
                    />
                  ))}
              </div>
            </>
          ) : (
            <>
              <h1 className="text-2xl">Spotify recommendations</h1>
              <div className="flex gap-8">
                {featured &&
                  featured?.map((playlist) => (
                    <Card
                      key={playlist.id}
                      image={playlist.images[0].url}
                      name={playlist.name}
                      description={playlist.description ?? "Spotify's playlist"}
                      onClick={() => handleCardClick(playlist.id, "playlist")}
                    />
                  ))}
              </div>
            </>
          )}
        </div>

        <div className="flex flex-col text-white font-bold space-y-6">
          <h1 className="text-2xl">Feel the vibe</h1>
          <div className="flex gap-8">
            {playlists &&
              playlists?.map((playlist) => (
                <Card
                  key={playlist.id}
                  image={playlist.images[0].url}
                  name={playlist.name}
                  description={playlist.description ?? playlist.type}
                  onClick={() => handleCardClick(playlist.id, "playlist")}
                />
              ))}
          </div>
        </div>

        {relatedArtists && (
          <div className="flex flex-col text-white font-bold space-y-6">
            <h1 className="text-2xl">
              Artists similar to {firstTopArtistId?.name}
            </h1>
            <div className="flex gap-8">
              {relatedArtists?.slice(0, 6).map((artist) => (
                <Card
                  key={artist.id}
                  image={artist.images[0].url}
                  name={artist.name}
                  description={artist.type}
                  onClick={() => handleCardClick(artist.id, "artist")}
                  isArtist
                />
              ))}
            </div>
          </div>
        )}

        <div className="flex flex-col text-white font-bold space-y-6">
          <h1 className="text-2xl">Party with your friends</h1>
          <div className="flex gap-8">
            {partyPlaylists &&
              partyPlaylists?.map((playlist) => (
                <Card
                  key={playlist.id}
                  image={playlist.images[0].url}
                  name={playlist.name}
                  description={playlist.description ?? playlist.type}
                  onClick={() => handleCardClick(playlist.id, "playlist")}
                />
              ))}
          </div>
        </div>
      </div>
    </div>
  );
}
