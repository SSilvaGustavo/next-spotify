import { atom } from "recoil";

export interface ISong {
  id: string;
}

export const currentTrackState = atom({
  key: "currentTrackState",
  default: "",
})

export const isPlayingState = atom({
  key: "isPlayingState",
  default: false
})