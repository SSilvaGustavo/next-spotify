import { playlistState } from "@/atoms/playlistAtoms";
import { useRecoilState } from "recoil";
import Song from "./Song";

export default function Songs() {
  const [playlist, setPlaylist] = useRecoilState(playlistState);
  return (
    <div className="px-8 flex flex-col text-white space-y-1 pb-28 pt-12">
      {
        playlist.tracks?.items.map((track, i) => (
          <Song key={track.track?.id} track={track} order={i}/>
        ))
      }
    </div>
  )
}
