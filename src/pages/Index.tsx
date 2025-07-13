import { useEffect, useState } from 'react';
import { Hero } from '@/components/portfolio/Hero';
import { About } from '@/components/portfolio/About';
import { Skills } from '@/components/portfolio/Skills';
import { Education } from '@/components/portfolio/Education';
import { Navigation } from '@/components/portfolio/Navigation';
import { COLORS, TYPOGRAPHY } from '@/utils/designTokens';

const Index = () => {
  const [activeSection, setActiveSection] = useState('hero');

  useEffect(() => {
    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            setActiveSection(entry.target.id);
          }
        });
      },
      { threshold: 0.3 }
    );

    const sections = document.querySelectorAll('section[id]');
    sections.forEach((section) => observer.observe(section));

    return () => observer.disconnect();
  }, []);

  return (
    <div
      className="min-h-screen"
      style={{
        background: COLORS.background,
        color: COLORS.text,
        fontFamily: TYPOGRAPHY.fontFamily.primary,
      }}
    >
      <Navigation activeSection={activeSection} />
      <main>
        <Hero />
        <About />
        <Skills />
        <Education />
      </main>
    </div>
  );
};

export default Index;