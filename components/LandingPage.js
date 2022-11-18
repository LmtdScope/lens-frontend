import Hero from "./HomePage/Hero";
import InfinitePhotos from "../components/InfinitePhotos";
import Navbar from "../components/Layout/Navbar";

export default function LandingPage() {
  return (
    <div className=" body">
      <Navbar />
      <Hero />
      <InfinitePhotos />
    </div>
  );
}
