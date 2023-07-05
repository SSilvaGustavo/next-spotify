import { currentTrackState, isPlayingState } from "@/atoms/songAtoms";
import useSpotify from "@/hooks/useSpotify";
import { artistsFormatter } from "@/utils/formattedArtists";
import { millisToMinutesAndSeconds } from "@/utils/time";
import { PauseIcon, PlayIcon } from "lucide-react";
import { useRecoilState } from "recoil";
import Link from "next/link";

interface IArtistSong {
  order: number;
  track: SpotifyApi.TrackObjectFull;
}

export default function ArtistSong({ order, track }: IArtistSong) {
  const spotifyApi = useSpotify();
  const [currentTrackId, setCurrentTrackId] = useRecoilState(currentTrackState);
  const [isPlaying, setIsPlaying] = useRecoilState(isPlayingState);
  const isCurrentTrack = track.id === currentTrackId;

  const playSong = () => {
    setCurrentTrackId(track.id);
    setIsPlaying(true);
    spotifyApi.play({
      uris: [track.uri],
    });
  };

  return (
    <div>
      {track.id && (
        <div
          className={`group grid grid-cols-2 py-3 px-4 rounded-lg hover:bg-zinc-800/70 text-zinc-400 w-[90%] ${
            isPlaying && isCurrentTrack && "bg-zinc-800/70"
          }`}
          onClick={playSong}
        >
          <div className="flex items-center space-x-4">
            <div className="flex items-center">
              <div className="group h-4 w-4">
                <PlayIcon
                  className={`h-4 w-4 fill-white stroke-white hidden ${
                    isPlaying && isCurrentTrack ? "" : "group-hover:block"
                  }`}
                />
                {isPlaying && isCurrentTrack ? (
                  <PauseIcon className="h-4 w-4 fill-white stroke-white" />
                ) : (
                  <p className="inline group-hover:hidden">{order}</p>
                )}
              </div>
            </div>
            <Link
              href={track.external_urls.spotify}
              target="_blank"
              className="hover:scale-105 transition-transform"
              onClick={(event) => event.stopPropagation()}
            >
              <img
                className="h-10 w-10"
                src={track.album.images[0].url}
                alt=""
              />
            </Link>
            <div className="">
              <p className="text-white text-base w-36 lg:w-64 truncate">
                {track.name}
              </p>
              <div className="inline-flex items-center text-sm space-x-2">
                {track.explicit && (
                  <span>
                    <span className="px-[5px] py-[3px] bg-zinc-400 text-black text-[9px] rounded-sm font-bold">
                      E
                    </span>
                  </span>
                )}
                <span className="w-40 lg:w-72 truncate group-hover:text-white">
                  {artistsFormatter(track)}
                </span>
              </div>
            </div>
          </div>

          <div className="flex items-center justify-between text-sm">
            <p className="w-40 hidden md:inline">{track.album.name}</p>
            <p>{millisToMinutesAndSeconds(track && track.duration_ms)}</p>
          </div>
        </div>
      )}
    </div>
  );
}
