import { useState, useEffect } from 'react';
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
import EmailTemplate from './components/EmailTemplate';
import AdminLogin from './components/AdminLogin';
import AdminDashboard from './components/AdminDashboard';
import ServerOffline from './components/ServerOffline';
import { api } from './services/api';

export default function App() {
  const [hash, setHash] = useState(window.location.hash);
  const [serverStatus, setServerStatus] = useState('checking'); // 'checking' | 'online' | 'offline_grace' | 'offline'

  const checkServerStatus = async () => {
    setServerStatus('checking');
    try {
      await api.getProfile();
      setServerStatus('online');
    } catch (error) {
      console.error("Server connection failed:", error);
      setServerStatus('offline_grace');
      setTimeout(() => {
        setServerStatus(prev => prev === 'offline_grace' ? 'offline' : prev);
      }, 15000);
    }
  };

  useEffect(() => {
    const handleHashChange = () => {
      setHash(window.location.hash);
    };
    window.addEventListener('hashchange', handleHashChange);
    
    // Initial server check
    checkServerStatus();

    return () => window.removeEventListener('hashchange', handleHashChange);
  }, []);

  if (hash === '#email-template') {
    return <EmailTemplate />;
  }

  if (hash === '#admin-login') {
    return <AdminLogin />;
  }

  if (hash === '#admin-dashboard') {
    return <AdminDashboard />;
  }

  if (serverStatus === 'offline') {
    return (
      <>
        <CustomCursor />
        <ServerOffline onRetry={checkServerStatus} />
      </>
    );
  }

  // Show nothing while checking initial server status
  if (serverStatus === 'checking') {
    return (
      <>
        <CustomCursor />
        <div className="min-h-screen bg-bg scanline-overlay flex items-center justify-center text-accent font-mono-hacker">Initializing connection...</div>
      </>
    );
  }

  const showSkeleton = serverStatus === 'offline_grace';

  return (
    <div className="min-h-screen bg-bg text-text-primary scanline-overlay">
      <CustomCursor />
      <Navbar />
      <main className="space-y-0">
        <Hero showSkeleton={showSkeleton} />
        <About showSkeleton={showSkeleton} />
        <Skills showSkeleton={showSkeleton} />
        <Projects showSkeleton={showSkeleton} />
        <Experience showSkeleton={showSkeleton} />
        <Education showSkeleton={showSkeleton} />
        <Certifications showSkeleton={showSkeleton} />

        
        {/* Hacker Terminal Interactive Section */}
        <section className="relative py-12 bg-bg max-w-7xl mx-auto px-6 lg:px-12 hacker-grid">
          <div className="border border-accent/20 rounded-3xl p-1 bg-surface-2/10">
            <HackerTerminal />
          </div>
        </section>

        <Contact showSkeleton={showSkeleton} />
      </main>
      <Footer />
    </div>
  );
}

