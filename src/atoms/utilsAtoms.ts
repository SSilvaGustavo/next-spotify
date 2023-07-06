import { atom } from "recoil";

export const colorState = atom({
  key: "colorState",
  default: "",
});

export const meState = atom({
  key: "meState",
  default: {} as SpotifyApi.CurrentUsersProfileResponse,
})
