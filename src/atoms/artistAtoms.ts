import { atom } from "recoil";

export interface IArtist extends SpotifyApi.ArtistObjectFull {}

export const artistState = atom({
  key: "artistState",
  default: {} as IArtist,
});

export const artistIdState = atom({
  key: "artistIdState",
  default: "",
});
