interface Artist extends SpotifyApi.TrackObjectFull {}

export function artistsFormatter(track: Artist | undefined) {
  const formattedArtists = track?.artists.map((artist) => artist.name).join(", ");

  return formattedArtists;
}