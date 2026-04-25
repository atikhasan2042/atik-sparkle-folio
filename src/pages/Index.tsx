import { useEffect } from "react";
import { Loader } from "@/components/portfolio/Loader";
import { CustomCursor } from "@/components/portfolio/CustomCursor";
import { Navbar } from "@/components/portfolio/Navbar";
import { Hero } from "@/components/portfolio/Hero";
import { About } from "@/components/portfolio/About";
import { Skills } from "@/components/portfolio/Skills";
import { Experience } from "@/components/portfolio/Experience";
import { Projects } from "@/components/portfolio/Projects";
import { Gallery } from "@/components/portfolio/Gallery";
import { Contact } from "@/components/portfolio/Contact";
import { Footer } from "@/components/portfolio/Footer";
import { BackToTop } from "@/components/portfolio/BackToTop";
import { trackVisit } from "@/lib/visitorTracker";

const Index = () => {
  useEffect(() => {
    trackVisit();
  }, []);

  return (
    <div className="relative min-h-screen bg-background text-foreground">
      <Loader />
      <CustomCursor />
      <Navbar />
      <main>
        <Hero />
        <About />
        <Skills />
        <Experience />
        <Projects />
        <Gallery />
        <Contact />
      </main>
      <Footer />
      <BackToTop />
    </div>
  );
};

export default Index;
