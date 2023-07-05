"use client";

import { signIn } from "next-auth/react";
import spotifyLogo from "@/assets/Spotify-Logo.png";
import Image from "next/image";

export default function Login() {
  return (
    <div className="flex flex-col justify-center items-center bg-zinc-900 w-full min-h-screen space-y-8 font-bold">
      <div className="flex flex-col items-center justify-center">
        <Image
          src={spotifyLogo}
          alt="spotifyLogo"
          className="w-96 mb-5 hover"
        />
        <p className="text-3xl text-white">Spotify Profile</p>
      </div>
      <div>
        <button
          className="bg-[#00bf52] text-white py-4 px-8 rounded-full hover:bg-[#00DA60] transition-colors"
          onClick={() => signIn("spotify", { callbackUrl: "/" })}
        >
          LOG IN TO SPOTIFY
        </button>
      </div>
    </div>
  );
}
