import { ArrowDown, FolderOpen, Award, Briefcase } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Link } from 'react-router-dom';
import { FloatingDock } from '@/components/ui/floating-dock';
import { IconBrandGithub, IconBrandLinkedin, IconMail } from '@tabler/icons-react';
import { motion } from 'motion/react';
import { COLORS } from '@/utils/designTokens';
import ProfileCard from '@/components/ui/ProfileCard';
import '@/components/ui/ProfileCard.css';
import { useEffect, useState } from 'react';
import { supabase } from '@/integrations/supabase/client';

interface ContactInfo {
  id: string;
  email: string;
  phone: string | null;
  location: string | null;
  linkedin: string | null;
  github: string | null;
  portfolio: string | null;
  created_at: string;
  updated_at: string;
  photo: string | null;
}

export const Hero = () => {
  const [contactInfo, setContactInfo] = useState<ContactInfo | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchContactInfo = async () => {
      const { data, error } = await supabase
        .from('contact_info')
        .select('*')
        .limit(1)
        .single();
      if (!error && data) {
        setContactInfo(data);
      }
      setLoading(false);
    };
    fetchContactInfo();
  }, []);

  const socialItems = [
    {
      title: 'GitHub',
      icon: <IconBrandGithub className="h-full w-full text-neutral-100 dark:text-neutral-300" />,
      href: contactInfo?.github || 'https://github.com/naaufaal',
    },
    {
      title: 'LinkedIn',
      icon: <IconBrandLinkedin className="h-full w-full text-neutral-100 dark:text-neutral-300" />,
      href: contactInfo?.linkedin || 'https://linkedin.com/in/naaufaal',
    },
    {
      title: 'Email',
      icon: <IconMail className="h-full w-full text-neutral-100 dark:text-neutral-300" />,
      href: contactInfo?.email ? `mailto:${contactInfo.email}` : 'mailto:noppal.901@gmail.com',
    },
  ];

  // Derive name from email prefix if no name field
  const name = contactInfo?.email ? contactInfo.email.split('@')[0] : 'Naufal';
  const title = 'Full-Stack Developer & Mobile App Developer';
  const status = contactInfo?.location || 'Information Systems @ Universitas Andalas';
  const handle = contactInfo?.email ? contactInfo.email.split('@')[0] : 'naaufaal';
  const avatarUrl = contactInfo?.photo || '/placeholder.svg';
  const contactEmail = contactInfo?.email || 'noppal.901@gmail.com';

  return (
    <section id="hero" className="min-h-screen flex items-center justify-center relative overflow-hidden">
      <div className="absolute inset-0 bg-gradient-to-br from-primary via-primary to-gray-900 opacity-90"></div>
      <div className="container mx-auto px-4 relative z-10">
        <div className="animate-fade-in">
          {/* Main Content Grid */}
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 lg:gap-12 items-center min-h-[70vh]">
            {/* Left Content */}
            <div className="text-center lg:text-left order-2 lg:order-1">
              <h1 className="text-4xl md:text-5xl lg:text-6xl font-bold mb-6 bg-gradient-to-r from-white to-gray-300 bg-clip-text text-transparent">
                Hi, I'm {name}
              </h1>
              
              <p className="text-xl md:text-2xl text-gray-300 mb-6">
                Full-Stack Developer & Mobile App Developer
              </p>
              
              <p className="text-lg text-gray-400 mb-8 max-w-xl mx-auto lg:mx-0">
                Passionate about creating innovative digital solutions with modern technologies. 
                Currently pursuing Information Systems at Universitas Andalas.
              </p>

              {/* Call to Action Buttons */}
              <div className="flex flex-col sm:flex-row gap-4 justify-center lg:justify-start">
                <Button 
                  size="lg" 
                  className="bg-white text-primary hover:bg-gray-100 transition-colors"
                  onClick={() => window.open(`mailto:${contactEmail}`)}
                >
                  Contact Me
                </Button>
                <Button 
                  size="lg" 
                  variant="outline"
                  className="border-white text-white hover:bg-white hover:text-primary transition-colors"
                >
                  View Portfolio
                </Button>
              </div>
            </div>

            {/* Right Profile */}
            <div className="flex justify-center lg:justify-end order-1 lg:order-2">
              <div className="transform hover:scale-105 transition-transform duration-300">
                <ProfileCard
                  name={name}
                  title={title}
                  handle={handle}
                  status={status}
                  contactText="Contact Me"
                  avatarUrl={avatarUrl}
                  showUserInfo={true}
                  enableTilt={true}
                  onContactClick={() => window.open(`mailto:${contactEmail}`)}
                />
              </div>
            </div>
          </div>

          {/* Floating Dock - Centered at Bottom */}
          <div className="flex justify-center mt-12">
            <FloatingDock 
              items={socialItems}
              desktopClassName=""
              mobileClassName=""
            />
          </div>
        </div>
      </div>
    </section>
  );
};