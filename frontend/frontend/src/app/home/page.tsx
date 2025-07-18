"use client";

import Navbar from "@/components/navebar/navbarHome";
import MatchPage from "@/components/Match/MatchPage";

export default function HomePage() {

  return (
    <div style={{ padding: "2rem" }}>
      <h1>home</h1>
      <MatchPage />
      <Navbar />
    </div>
  );
}
