import { artistIdState } from "@/atoms/artistAtoms";
import { currentViewState } from "@/atoms/viewsAtoms";
import { useRecoilState } from "recoil";

interface IArtist {
  artist: SpotifyApi.ArtistObjectFull;
}

export default function Artists({ artist }: IArtist) {
  const [artistId, setArtistId] = useRecoilState(artistIdState);
  const [view, setView] = useRecoilState(currentViewState);

  const handleClick = () => {
    setArtistId(artist.id);
    setView("Artist");
  };

  return (
    <div
      onClick={() => handleClick()}
      className="cursor-pointer rounded hover:bg-zinc-900 transition-colors p-2"
    >
      <div className="flex items-center space-x-2">
        <img className="w-12 h-12 rounded" src={artist.images[0].url ?? ""} alt="" />
        <div className="flex flex-col space-y-1">
          <p className="max-w-[18rem] text-base text-zinc-300 truncate">
            {artist.name}
          </p>
          <span className="capitalize text-sm">{artist.type}</span>
        </div>
      </div>
    </div>
  );
}
