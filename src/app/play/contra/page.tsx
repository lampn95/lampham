import type { Metadata } from "next";
import { JungleRunGame } from "@/components/games/JungleRunGame";

export const metadata: Metadata = {
  title: "Jungle Run",
  description:
    "A clean-room run-and-gun tribute. Original art and code — sprint, jump, shoot five ways, dodge turrets, and blow the gate.",
};

export default function ContraPage() {
  return <JungleRunGame />;
}
