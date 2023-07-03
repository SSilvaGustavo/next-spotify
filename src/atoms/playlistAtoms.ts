import { atom } from "recoil";

export interface IPlaylist extends SpotifyApi.PlaylistObjectFull {}

export const playlistState = atom({
  key: "playlistState",
  default: {} as IPlaylist, 
});

export const playlistIdState = atom({
  key: "playlistIdState",
  default: ""
});