import { useEffect, useState } from "react";
import { StoreProvider } from "./lib/store";
import Header from "./components/Header";
import Hero from "./components/Hero";
import Showcase from "./components/Showcase";
import Approach from "./components/Approach";
import About from "./components/About";
import Journey from "./components/Journey";
import { ContactSection, FaqSection } from "./components/Contact";
import Footer from "./components/Footer";
import AdminApp from "./admin/AdminApp";

function useHashRoute(): string {
  const [hash, setHash] = useState(() => window.location.hash);
  useEffect(() => {
    const onChange = () => setHash(window.location.hash);
    window.addEventListener("hashchange", onChange);
    return () => window.removeEventListener("hashchange", onChange);
  }, []);
  return hash;
}

function Site() {
  return (
    <div className="relative">
      <div className="noise-layer" aria-hidden />
      <Header />
      <main>
        <Hero />
        <Showcase />
        <Approach />
        <About />
        <Journey />
        <ContactSection />
        <FaqSection />
      </main>
      <Footer />
    </div>
  );
}

export default function App() {
  const route = useHashRoute();
  const isAdmin = route.startsWith("#/admin");

  useEffect(() => {
    window.scrollTo({ top: 0, behavior: "instant" as ScrollBehavior });
  }, [isAdmin]);

  return <StoreProvider>{isAdmin ? <AdminApp /> : <Site />}</StoreProvider>;
}
