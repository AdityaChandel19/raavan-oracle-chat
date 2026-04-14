import { createFileRoute } from "@tanstack/react-router";
import { RaavanChat } from "../components/RaavanChat";

export const Route = createFileRoute("/")({
  component: Index,
  head: () => ({
    meta: [
      { title: "Raavan AI — Wisdom & Astrology Chatbot" },
      { name: "description", content: "Chat with Raavan AI for ancient wisdom, knowledge, and personalized astrology readings." },
    ],
  }),
});

function Index() {
  return <RaavanChat />;
}
