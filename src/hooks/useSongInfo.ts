import { useRecoilState } from "recoil";
import useSpotify from "./useSpotify";
import { currentTrackState } from "@/atoms/songAtoms";
import { useEffect, useState } from "react";

export default function useSongInfo() {
  const spotifyApi = useSpotify();
  const [currentTrackId, setCurrentTrackId] = useRecoilState(currentTrackState);
  const [songInfo, setSongInfo] = useState<SpotifyApi.TrackObjectFull>();

  useEffect(() => {
    const fetchSongInfo = async () => {
      if (currentTrackId && currentTrackId !== "") {
        const trackInfo = await fetch(
          `https://api.spotify.com/v1/tracks/${currentTrackId}`,
          {
            headers: {
              Authorization: `Bearer ${spotifyApi.getAccessToken()}`,
            },
          }
        ).then((res) => res.json());

        setSongInfo(trackInfo);
      }
    };

    fetchSongInfo();
  }, [currentTrackId, spotifyApi]);

  return songInfo;
}
