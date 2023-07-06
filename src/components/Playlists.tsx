import { playlistIdState } from "@/atoms/playlistAtoms";
import { currentViewState } from "@/atoms/viewsAtoms";
import { useRecoilState } from "recoil";

interface IPlaylists {
  playlist: SpotifyApi.PlaylistObjectSimplified;
}

export default function Playlists({ playlist }: IPlaylists) {
  const [playlistId, setPlaylistsId] = useRecoilState(playlistIdState);
  const [view, setView] = useRecoilState(currentViewState);

  const handleClick = () => {
    setPlaylistsId(playlist.id);
    setView("Playlist");
  };

  return (
    <div
      onClick={() => handleClick()}
      className="cursor-pointer rounded hover:bg-zinc-900 transition-colors p-2"
    >
      <div className="flex items-center space-x-2">
        <img
          className="w-12 h-12 rounded"
          src={playlist.images[0].url ?? ""}
          alt=""
        />
        <div className="flex flex-col space-y-1 max-w-xs">
          <p className="text-base text-zinc-300 whitespace-pre-wrap 2xl:truncate">
            {playlist.name}
          </p>
          <span className="capitalize text-sm">
            {playlist.type} • {playlist.owner.display_name}
          </span>
        </div>
      </div>
    </div>
  );
}
