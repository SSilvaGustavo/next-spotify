"use client";

import Center from "@/components/Center";
import Player from "@/components/Player";
import Sidebar from "@/components/Sidebar";

export default function Home() {
  return (
    <div className="bg-black h-[100dvh] overflow-hidden">
      <main className="flex">
        <Sidebar />
        <Center />
      </main>

      <div className="sticky bottom-0">
        <Player />
      </div>
    </div>
  );
}
