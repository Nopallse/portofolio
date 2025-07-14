
import { useState } from 'react';
import { Link, useLocation } from 'react-router-dom';
import {
  Navbar,
  NavBody,
  MobileNav,
  MobileNavHeader,
  MobileNavMenu,
  MobileNavToggle,
  NavbarButton,
} from '@/components/ui/resizable-navbar';
import { motion } from 'motion/react';
import { COLORS } from '@/utils/designTokens';

interface NavigationProps {
  activeSection?: string;
}

// Custom NavItems component that works with React Router
const CustomNavItems = ({ 
  items, 
  className, 
  onItemClick 
}: {
  items: { name: string; link: string }[];
  className?: string;
  onItemClick?: (link: string) => void;
}) => {
  const [hovered, setHovered] = useState<number | null>(null);
  const location = useLocation();

  return (
    <motion.div
      onMouseLeave={() => setHovered(null)}
      className={`absolute inset-0 hidden flex-1 flex-row items-center justify-center space-x-2 text-sm font-medium lg:flex lg:space-x-2 ${className}`}
    >
      {items.map((item, idx) => {
        const isActive = location.pathname === item.link;
        
        return (
          <Link
            key={`link-${idx}`}
            to={item.link}
            onMouseEnter={() => setHovered(idx)}
            onClick={() => onItemClick?.(item.link)}
            className={`relative px-4 py-2 rounded-xl transition-all duration-300 hover:scale-105 ${
              isActive
                ? 'text-black font-semibold'
                : 'text-black/80 hover:text-black'
            }`}
          >
            {/* Active state background */}
            {isActive && (
              <motion.div
                layoutId="active"
                className="absolute inset-0 h-full w-full rounded-xl"
                style={{
                  background: 'rgba(255, 255, 255, 0.3)',
                  backdropFilter: 'blur(8px)',
                  boxShadow: '0 2px 8px rgba(0, 0, 0, 0.1)',
                }}
                initial={{ opacity: 0, scale: 0.8 }}
                animate={{ opacity: 1, scale: 1 }}
                transition={{ duration: 0.2 }}
              />
            )}
            
            {/* Hover state background */}
            {hovered === idx && !isActive && (
              <motion.div
                layoutId="hovered"
                className="absolute inset-0 h-full w-full rounded-xl"
                style={{
                  background: 'rgba(255, 255, 255, 0.2)',
                  backdropFilter: 'blur(8px)',
                }}
                initial={{ opacity: 0, scale: 0.8 }}
                animate={{ opacity: 1, scale: 1 }}
                transition={{ duration: 0.2 }}
              />
            )}
            
            <span className="relative z-20 flex items-center gap-2">
              {item.name}
              
            </span>
          </Link>
        );
      })}
    </motion.div>
  );
};

export const Navigation = ({ activeSection }: NavigationProps) => {
  const [isOpen, setIsOpen] = useState(false);
  const location = useLocation();

  const navItems = [
    { name: 'Home', link: '/' },
    { name: 'Projects', link: '/projects' },
    { name: 'Experience', link: '/experience' },
    { name: 'Certificates', link: '/certificates' },
  ];

  const scrollToSection = (sectionId: string) => {
    if (location.pathname !== '/') return;
    const element = document.getElementById(sectionId);
    if (element) {
      element.scrollIntoView({ behavior: 'smooth' });
    }
    setIsOpen(false);
  };

  const handleItemClick = (link: string) => {
    if (link === '/') {
      // If we're already on home page, scroll to top
      if (location.pathname === '/') {
        window.scrollTo({ top: 0, behavior: 'smooth' });
      }
    }
    setIsOpen(false);
  };

  return (
    <Navbar className="fixed top-4 left-1/2 transform -translate-x-1/2 z-50 max-w-4xl w-[calc(100%-2rem)]">
      {/* Desktop Navigation */}
      <NavBody 
        className="backdrop-blur-sm border-b border-white-transparent rounded-2xl"
        style={{
          background: 'linear-gradient(135deg, #FF9000 0%, #FFA726 100%)',
          boxShadow: '0 8px 32px rgba(255, 144, 0, 0.3)',
        }}
      >
        <Link 
          to="/" 
          className={`text-xl font-bold relative z-20 hover:scale-105 transition-transform duration-300 ${
            location.pathname === '/' ? 'text-black' : 'text-black/90'
          }`}
        >
          Portfolio
        </Link>
        
        <CustomNavItems 
          items={navItems}
          className="text-black/80 hover:text-black"
          onItemClick={handleItemClick}
        />
        
        <div className="relative z-20">
          <NavbarButton 
            href="/admin/login" 
            variant="primary"
            className="bg-black hover:bg-black/80 text-white rounded-xl transition-all duration-300 hover:scale-105"
            style={{
              boxShadow: '0 4px 16px rgba(0, 0, 0, 0.3)',
            }}
          >
            Login
          </NavbarButton>
        </div>
      </NavBody>

      {/* Mobile Navigation */}
      <MobileNav 
        className="backdrop-blur-sm border-b border-white-transparent rounded-2xl"
        style={{
          background: 'linear-gradient(135deg, #FF9000 0%, #FFA726 100%)',
          boxShadow: '0 8px 32px rgba(255, 144, 0, 0.3)',
        }}
      >
        <MobileNavHeader className="px-4">
          <Link 
            to="/" 
            className={`text-xl font-bold hover:scale-105 transition-transform duration-300 ${
              location.pathname === '/' ? 'text-black' : 'text-black/90'
            }`}
          >
            Portfolio
          </Link>
          <MobileNavToggle isOpen={isOpen} onClick={() => setIsOpen(!isOpen)} />
        </MobileNavHeader>
        
        <MobileNavMenu isOpen={isOpen} onClose={() => setIsOpen(false)}>
          <div className="flex flex-col space-y-2 w-full">
            {navItems.map((item) => {
              const isActive = location.pathname === item.link;
              
              return (
                <Link
                  key={item.name}
                  to={item.link}
                  onClick={() => handleItemClick(item.link)}
                  className={`relative px-4 py-3 text-left rounded-xl transition-all duration-300 hover:scale-105 flex items-center justify-between ${
                    isActive
                      ? 'text-black font-semibold'
                      : 'text-black/80 hover:text-black'
                  }`}
                >
                  {/* Active state background for mobile */}
                  {isActive && (
                    <motion.div
                      className="absolute inset-0 h-full w-full rounded-xl"
                      style={{
                        background: 'rgba(255, 255, 255, 0.3)',
                        backdropFilter: 'blur(8px)',
                        boxShadow: '0 2px 8px rgba(0, 0, 0, 0.1)',
                      }}
                      initial={{ opacity: 0, scale: 0.95 }}
                      animate={{ opacity: 1, scale: 1 }}
                      transition={{ duration: 0.2 }}
                    />
                  )}
                  
                  <span className="relative z-20 flex items-center gap-3">
                    {item.name}
                    {isActive && (
                      <motion.div
                        className="w-2 h-2 rounded-full bg-black"
                        initial={{ scale: 0 }}
                        animate={{ scale: 1 }}
                        transition={{ delay: 0.1, duration: 0.2 }}
                      />
                    )}
                  </span>
                  
                  {/* Active indicator line */}
                  {isActive && (
                    <motion.div
                      className="relative z-20 w-1 h-6 rounded-full bg-black"
                      initial={{ scaleY: 0 }}
                      animate={{ scaleY: 1 }}
                      transition={{ delay: 0.2, duration: 0.3 }}
                    />
                  )}
                </Link>
              );
            })}
            <div className="pt-4 border-t border-white/20">
              <NavbarButton 
                href="/admin/login" 
                variant="primary"
                className="w-full bg-black hover:bg-black/80 text-white rounded-xl transition-all duration-300 hover:scale-105"
                style={{
                  boxShadow: '0 4px 16px rgba(0, 0, 0, 0.3)',
                }}
              >
                Login
              </NavbarButton>
            </div>
          </div>
        </MobileNavMenu>
      </MobileNav>
    </Navbar>
  );
};
