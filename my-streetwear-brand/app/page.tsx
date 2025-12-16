import Hero from "../src/components/Hero";
import Marquee from "../src/components/Marquee";
import Gallery from "../src/components/Gallery";

export default function Home() {
  return (
    <main className="min-h-screen bg-black">
      <Hero />
      <Marquee />
      <Gallery />
    </main>
  );
}
