import { useState } from 'react';
import { Calendar, MapPin } from 'lucide-react';
import { Dialog, DialogContent, DialogTrigger, DialogTitle, DialogDescription } from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import { useExperience, type Experience } from '@/hooks/usePortfolioData';
import { Navigation } from '@/components/portfolio/Navigation';
import { COLORS, TYPOGRAPHY } from "@/utils/designTokens";

const ExperiencePage = () => {
  const [selectedExperience, setSelectedExperience] = useState<Experience | null>(null);
  const { data: experiences, isLoading, error } = useExperience();

  if (isLoading) {
    return (
      <div
        className="min-h-screen"
        style={{
          background: COLORS.background,
          color: COLORS.text,
          fontFamily: TYPOGRAPHY.fontFamily.primary,
        }}
      >
        <Navigation />
        <div className="flex items-center justify-center min-h-screen">
          <div style={{ color: COLORS.text, fontSize: TYPOGRAPHY.fontSize.lg }}>Loading experience...</div>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div
        className="min-h-screen"
        style={{
          background: COLORS.background,
          color: COLORS.text,
          fontFamily: TYPOGRAPHY.fontFamily.primary,
        }}
      >
        <Navigation />
        <div className="flex items-center justify-center min-h-screen">
          <div style={{ color: '#FF3B30', fontSize: TYPOGRAPHY.fontSize.lg }}>Error loading experience</div>
        </div>
      </div>
    );
  }

  return (
    <div
      className="min-h-screen"
      style={{
        background: COLORS.background,
        color: COLORS.text,
        fontFamily: TYPOGRAPHY.fontFamily.primary,
      }}
    >
      <Navigation />
      <div className="container mx-auto px-4 py-20">
        <div className="text-center mb-16">
          <h1
            className="font-bold mb-6"
            style={{
              color: COLORS.text,
              fontSize: TYPOGRAPHY.fontSize['4xl'],
              fontWeight: TYPOGRAPHY.fontWeight.bold,
            }}
          >
            My Experience
          </h1>
          <div
            className="mx-auto mb-8"
            style={{
              width: 96,
              height: 4,
              background: COLORS.accent.primary,
              borderRadius: 2,
            }}
          ></div>
          <p
            className="max-w-2xl mx-auto"
            style={{ color: COLORS.gray[400], fontSize: TYPOGRAPHY.fontSize.lg }}
          >
            My professional journey and key learning experiences
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-8 max-w-6xl mx-auto">
          {experiences?.map((experience) => (
            <Card 
              key={experience.id}
              className="group bg-transparent border-gray-700 hover:border-accent/50 transition-all duration-500 overflow-hidden"
            >
              <div className="relative overflow-hidden">
                <img 
                  src={experience.image} 
                  alt={experience.title}
                  className="w-full h-64 object-cover transition-transform duration-500 group-hover:scale-110"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-transparent to-transparent"></div>
                
                {/* Overlay Content */}
                <div className="absolute bottom-4 left-4 right-4">
                  <h3 className="text-xl font-bold text-white mb-2">{experience.title}</h3>
                  <div className="flex flex-col gap-2 text-sm text-gray-300">
                    <div className="flex items-center gap-2">
                      <Calendar size={14} className="text-accent" />
                      <span>{experience.date_range}</span>
                    </div>
                    <div className="flex items-center gap-2">
                      <MapPin size={14} className="text-accent" />
                      <span>{experience.location}</span>
                    </div>
                  </div>
                </div>
              </div>
              
              <CardContent className="p-6">
                <p className="text-gray-400 mb-4 line-clamp-3">{experience.description}</p>
                
                <Dialog>
                  <DialogTrigger asChild>
                    <Button 
                      variant="outline" 
                      className="w-full border-accent text-accent hover:bg-accent hover:text-primary transition-all duration-300"
                      onClick={() => setSelectedExperience(experience)}
                    >
                      View Details
                    </Button>
                  </DialogTrigger>
                  <DialogContent className="max-w-2xl bg-primary border-gray-700">
                    <DialogTitle className="text-2xl font-bold text-white">
                      {selectedExperience?.title}
                    </DialogTitle>
                    <DialogDescription asChild>
                      <div className="space-y-4">
                        <img 
                          src={selectedExperience?.image} 
                          alt={selectedExperience?.title}
                          className="w-full h-64 object-cover rounded-lg"
                        />
                        
                        <div className="flex flex-col sm:flex-row gap-4 text-sm text-gray-400">
                          <div className="flex items-center gap-2">
                            <Calendar size={16} className="text-accent" />
                            <span>{selectedExperience?.date_range}</span>
                          </div>
                          <div className="flex items-center gap-2">
                            <MapPin size={16} className="text-accent" />
                            <span>{selectedExperience?.location}</span>
                          </div>
                        </div>
                        
                        <p className="text-gray-300 leading-relaxed">
                          {selectedExperience?.description}
                        </p>
                      </div>
                    </DialogDescription>
                  </DialogContent>
                </Dialog>
              </CardContent>
            </Card>
          ))}
        </div>
      </div>
    </div>
  );
};

export default ExperiencePage;
