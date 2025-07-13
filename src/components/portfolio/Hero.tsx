
import { ArrowDown, FolderOpen, Award, Briefcase } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Link } from 'react-router-dom';
import { FloatingDock } from '@/components/ui/floating-dock';
import { IconBrandGithub, IconBrandLinkedin, IconMail } from '@tabler/icons-react';
import { motion } from 'motion/react';
import { COLORS } from '@/utils/designTokens';

export const Hero = () => {
  const scrollToSection = (sectionId: string) => {
    const element = document.getElementById(sectionId);
    if (element) {
      element.scrollIntoView({ behavior: 'smooth' });
    }
  };

  const socialItems = [
    {
      title: "GitHub",
      icon: <IconBrandGithub className="h-full w-full text-neutral-100 dark:text-neutral-300" />,
      href: "https://github.com/naaufaal",
    },
    {
      title: "LinkedIn",
      icon: <IconBrandLinkedin className="h-full w-full text-neutral-100 dark:text-neutral-300" />,
      href: "https://linkedin.com/in/naaufaal",
    },
    {
      title: "Email",
      icon: <IconMail className="h-full w-full text-neutral-100 dark:text-neutral-300" />,
      href: "mailto:noppal.901@gmail.com",
    },
  ];

  return (
    <section id="hero" className="min-h-screen flex items-center justify-center relative overflow-hidden">
      <div className="absolute inset-0 bg-gradient-to-br from-primary via-primary to-gray-900 opacity-90"></div>
      <div className="container mx-auto px-4 text-center relative z-10">
        <div className="animate-fade-in">
          <div className="mb-8">
            <div className="w-32 h-32 mx-auto mb-6 rounded-full bg-gradient-to-r from-accent to-orange-400 p-1">
              <div className="w-full h-full rounded-full bg-primary flex items-center justify-center">
                <span className="text-4xl font-bold text-accent">N</span>
              </div>
            </div>
          </div>
          
          <h1 className="text-5xl md:text-7xl font-bold mb-6 bg-gradient-to-r from-white to-gray-300 bg-clip-text text-transparent">
            Hi, I'm Naufal
          </h1>
          
          <p className="text-xl md:text-2xl text-gray-300 mb-8 max-w-3xl mx-auto">
            Full-Stack Developer & Mobile App Developer
          </p>
          
          <p className="text-lg text-gray-400 mb-12 max-w-2xl mx-auto">
            Passionate about creating innovative digital solutions with modern technologies. 
            Currently pursuing Information Systems at Universitas Andalas.
          </p>

          <FloatingDock 
            items={socialItems}
            desktopClassName="mb-12"
            mobileClassName="mb-12"
          />
        </div>
      </div>
    </section>
  );
};
