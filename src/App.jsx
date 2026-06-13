import Navbar from './components/Navbar';
import Hero from './components/Hero';
import About from './components/About';
import Skills from './components/Skills';
import Projects from './components/Projects';
import Experience from './components/Experience';
import Education from './components/Education';
import Certifications from './components/Certifications';
import HackerTerminal from './components/HackerTerminal';
import Contact from './components/Contact';
import Footer from './components/Footer';
import CustomCursor from './components/CustomCursor';

export default function App() {
  return (
    <div className="min-h-screen bg-bg text-text-primary scanline-overlay">
      <CustomCursor />
      <Navbar />
      <main className="space-y-0">
        <Hero />
        <About />
        <Skills />
        <Projects />
        <Experience />
        <Education />
        <Certifications />
        
        {/* Hacker Terminal Interactive Section */}
        <section className="relative py-12 bg-bg max-w-7xl mx-auto px-6 lg:px-12 hacker-grid">
          <div className="border border-accent/20 rounded-3xl p-1 bg-surface-2/10">
            <HackerTerminal />
          </div>
        </section>

        <Contact />
      </main>
      <Footer />
    </div>
  );
}
