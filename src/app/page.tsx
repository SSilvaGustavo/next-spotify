"use client"

import { currentViewState } from "@/atoms/viewsAtoms";
import Center from "@/components/Center";
import Player from "@/components/Player";
import Sidebar from "@/components/Sidebar";
import { useRecoilState } from 'recoil' 

export default function Home() {
  const [view, setView] = useRecoilState(currentViewState);
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
  )
}
