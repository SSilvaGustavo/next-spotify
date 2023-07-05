import { currentTrackState, isPlayingState } from "@/atoms/songAtoms";
import useSongInfo from "@/hooks/useSongInfo";
import useSpotify from "@/hooks/useSpotify";
import { artistsFormatter } from "@/utils/formattedArtists";
import { useSession } from "next-auth/react";
import { useCallback, useEffect, useState } from "react";
import { useRecoilState } from "recoil";
import {
  ArrowLeftRightIcon,
  SkipBackIcon,
  SkipForwardIcon,
  PauseIcon,
  PlayIcon,
  RepeatIcon,
  ShuffleIcon,
  Volume1Icon,
  Volume2Icon,
  VolumeXIcon,
  Repeat1Icon,
} from "lucide-react";
import { debounce } from "lodash";

export default function Player() {
  const spotifyApi = useSpotify();
  const { data: session, status } = useSession();
  const [currentTrackId, setCurrentTrackId] = useRecoilState(currentTrackState);
  const [isPlaying, setIsPlaying] = useRecoilState(isPlayingState);
  const [volume, setVolume] = useState(50);
  const [shuffleState, setShuffleState] = useState(false);
  const [repeatMode, setRepeatMode] = useState("off");
  const songInfo = useSongInfo();

  const fetchCurrentSong = () => {
    if (!!songInfo) {
      spotifyApi
        .getMyCurrentPlayingTrack()
        .then((data) =>
          setCurrentTrackId(data.body.item ? data.body.item.id : "")
        );
      spotifyApi
        .getMyCurrentPlaybackState()
        .then((data) => setIsPlaying(data.body.is_playing));
    }
  };

  const handlePlayPause = () => {
    spotifyApi
      .getMyCurrentPlaybackState()
      .then((data) => {
        if (data.body.is_playing) {
          spotifyApi.pause();
          setIsPlaying(false);
        } else {
          spotifyApi.play();
          setIsPlaying(true);
        }
      })
      .catch((err) => {});
  };

  useEffect(() => {
    if (spotifyApi.getAccessToken() && !currentTrackId) {
      fetchCurrentSong();
      setVolume(50);
    }
  }, [currentTrackId, spotifyApi, session]);

  useEffect(() => {
    if (volume > 0 && volume < 100) {
      debounceAdjustVolume(volume);
    }
  }, [volume]);

  const debounceAdjustVolume = useCallback(
    debounce((volume) => {
      spotifyApi.setVolume(volume).catch((err) => {});
    }, 500),
    []
  );

  const toggleShuffle = () => {
    if (session?.user?.accessToken) {
      if (!shuffleState) {
        spotifyApi.setShuffle(true);
        setShuffleState(true);
      } else {
        spotifyApi.setShuffle(false);
        setShuffleState(false);
      }
    }
  };

  const toggleRepeatMode = () => {
    if (repeatMode === "off") {
      setRepeatMode("track");
      spotifyApi.setRepeat("track");
    }
    if (repeatMode === "track") {
      setRepeatMode("off");
      spotifyApi.setRepeat("off");
    }
  };

  return (
    <div className="h-24 bg-gradient-to-b from-black to-slate-900 text-white grid grid-cols-3 px-2 md:px-8">
      <div className="flex items-center space-x-4">
        <img
          className="hidden md:inline h-14 w-h-14 rounded-md"
          src={songInfo?.album.images[0].url}
          alt=""
        />
        <div>
          <h3 className="text-sm">{songInfo?.name}</h3>
          <p className="text-xs text-zinc-400">{artistsFormatter(songInfo)}</p>
        </div>
      </div>

      <div className="flex items-center justify-center space-x-6">
        <div
          className={`relative ${
            shuffleState ? "after:content-['']" : "after:content-none"
          } after:w-1 after:h-1 after:rounded-full after:absolute after:top-6 after:right-2 after:bg-green-500`}
        >
          <ShuffleIcon
            className={`button ${shuffleState && "text-green-500"}`}
            onClick={() => toggleShuffle()}
          />
        </div>
        <SkipBackIcon
          className="button fill-slate-400 hover:fill-white"
          onClick={() => spotifyApi.skipToPrevious()}
        />

        {!isPlaying ? (
          <div className="main-button">
            <PlayIcon
              onClick={handlePlayPause}
              className="h-4 w-4 fill-black stroke-black"
            />
          </div>
        ) : (
          <div className="main-button">
            <PauseIcon
              onClick={handlePlayPause}
              className="h-4 w-4 fill-black stroke-black"
            />
          </div>
        )}

        <SkipForwardIcon
          className="button fill-slate-400 hover:fill-white"
          onClick={() => spotifyApi.skipToNext()}
        />
        <div>
          {repeatMode === "off" ? (
            <RepeatIcon className="button" onClick={() => toggleRepeatMode()} />
          ) : (
            <div
              className={`relative ${
                repeatMode === "track" && "after:content-['']"
              } after:w-1 after:h-1 after:rounded-full after:absolute after:top-6 after:right-2 after:bg-green-500`}
            >
              <Repeat1Icon
                className="button text-green-500"
                onClick={() => toggleRepeatMode()}
              />
            </div>
          )}
        </div>
      </div>

      <div className="flex items-center space-x-3 md:space-x-4 justify-end pr-5">
        {volume === 0 ? (
          <VolumeXIcon className="button" />
        ) : volume > 50 ? (
          <Volume2Icon className="button" />
        ) : (
          <Volume1Icon className="button" />
        )}
        <input
          className=" w-14 md:w-28 accent-slate-500"
          value={volume}
          onChange={(e) => setVolume(Number(e.target.value))}
          type="range"
          min={0}
          max={100}
        />
      </div>
    </div>
  );
}
