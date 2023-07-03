import { currentTrackState, isPlayingState } from '@/atoms/songAtoms';
import useSpotify from '@/hooks/useSpotify';
import { artistsFormatter } from '@/utils/formattedArtists';
import { millisToMinutesAndSeconds } from '@/utils/time'
import { useRecoilState } from 'recoil';

interface ISong {
  order: number;
  track: SpotifyApi.PlaylistTrackObject;
}

export default function Song({ order, track }: ISong) {
  const spotifyApi = useSpotify();
  const [currentTrackId, setCurrentTrackId] = useRecoilState(currentTrackState)
  const [isPlaying, setIsPlaying] = useRecoilState(isPlayingState)

  const playSong = () => {
    setCurrentTrackId(track.track!.id)
    setIsPlaying(true)
    spotifyApi.play({
      uris: [track.track!.uri],
    })
  }

  return (
    <div className="group grid grid-cols-2 py-3 px-4 rounded-lg hover:bg-zinc-800/80 text-zinc-400" onClick={playSong}>
      <div className="flex items-center space-x-4">
        <p className=''>{order + 1}</p>
        <img
          className="h-10 w-10"
          src={track.track?.album.images[0].url}
          alt=""
        />
        <div className="">
          <p className='text-white text-base w-36 lg:w-64 truncate'>{track.track?.name}</p>
          <div className="inline-flex items-center text-sm space-x-2">
            {track.track?.explicit && (
              <span>
                <span className="px-[5px] py-[3px] bg-zinc-400 text-black text-[9px] rounded-sm font-bold">
                  E
                </span>
              </span>
            )}
            <span className="w-40 lg:w-72 truncate group-hover:text-white">{artistsFormatter(track.track!)}</span>
          </div>
        </div>
      </div>

      <div className="flex items-center justify-between text-sm">
        <p className='w-40 hidden md:inline'>{track.track?.album.name}</p>
        <p>{millisToMinutesAndSeconds(track.track!.duration_ms)}</p>
      </div>
    </div>
  );
}
