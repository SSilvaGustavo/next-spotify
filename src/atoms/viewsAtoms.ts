import { atom } from "recoil";

export interface ISong {
  view: string;
}

export const currentViewState = atom({
  key: "currentViewState",
  default: "Home",
});
