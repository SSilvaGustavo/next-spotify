import { playlistIdState } from "@/atoms/playlistAtoms";
import { shuffle } from "lodash";
import { useEffect } from "react";
import { useRecoilState } from "recoil";
import { currentViewState } from "@/atoms/viewsAtoms";
import Playlist from "./Playlist";
import Artist from "./Artist";
import Home from "./Home";
import { colorState, meState } from "@/atoms/utilsAtoms";
import { artistIdState } from "@/atoms/artistAtoms";
import User from "./User";
import { useSession } from "next-auth/react";
import useSpotify from "@/hooks/useSpotify";

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
  const { data: session, status } = useSession();
  const spotifyApi = useSpotify();
  const [color, setColor] = useRecoilState(colorState);
  const playlistId = useRecoilState(playlistIdState);
  const artistId = useRecoilState(artistIdState);
  const [view, setView] = useRecoilState(currentViewState);
  const [me, setMe] = useRecoilState(meState);

  useEffect(() => {
    setColor(shuffle(colors).pop()!);
  }, [artistId[0], playlistId[0]]);

  useEffect(() => {
    if (spotifyApi.getAccessToken()) {
      spotifyApi.getMe().then((data) => {
        setMe(data.body)
      })
    }
  }, [session, spotifyApi]);


  return (
    <div className="flex-grow h-screen overflow-y-scroll scrollbar-hide relative m-2">
      <User />
      {view === "Home" && <Home />}
      {view === "Playlist" && <Playlist />}
      {view === "Artist" && <Artist />}
    </div>
  );
}
