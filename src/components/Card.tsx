import { PlayIcon } from "lucide-react";

interface ICard {
  image: string;
  name: string;
  description: string;
  isArtist?: boolean;
  onClick?: () => void;
}

export default function Card({
  image,
  name,
  description,
  isArtist,
  onClick,
}: ICard) {
  return (
    <div
      className="group relative flex flex-col bg-zinc-750/60 rounded-lg p-5 cursor-pointer hover:bg-zinc-750 transition-colors"
      onClick={onClick}
    >
      <img
        className={`h-[9.5rem] w-40 bg-white ${
          isArtist ? "rounded-full" : "rounded"
        } shadow-lg shadow-black border border-[#282828]`}
        src={image}
        alt=""
      />
      <p className="text-white font-bold pb-1 pt-4 w-[8.5rem] truncate">
        {name}
      </p>
      <span
        className={`text-sm text-zinc-500 font-medium ${
          isArtist && "capitalize"
        } w-36 line-clamp-2`}
      >
        {description}
      </span>
      <div className="absolute hidden items-center justify-center h-12 w-12 rounded-full bg-green-500 bottom-24 right-4 group-hover:flex animate-fade-in-top">
        <PlayIcon className="h-6 w-6 stroke-black fill-black" />
      </div>
    </div>
  );
}
