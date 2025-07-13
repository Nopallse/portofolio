
import { Calendar, MapPin } from 'lucide-react';
import { experienceData } from '@/data/portfolio';

export const Experience = () => {
  return (
    <section id="experience" className="py-20 bg-gray-900/50">
      <div className="container mx-auto px-4">
        <div className="text-center mb-16">
          <h2 className="text-4xl md:text-5xl font-bold mb-6 text-white">Experience</h2>
          <div className="w-24 h-1 bg-accent mx-auto mb-8"></div>
          <p className="text-lg text-gray-300 max-w-2xl mx-auto">
            My professional journey and key learning experiences
          </p>
        </div>

        <div className="max-w-4xl mx-auto">
          <div className="space-y-8">
            {experienceData.map((experience, index) => (
              <div 
                key={index}
                className="flex flex-col md:flex-row gap-6 p-6 bg-primary/50 rounded-lg border border-gray-700 hover:border-accent/50 transition-all duration-300 transform hover:scale-105"
              >
                <div className="md:w-1/3">
                  <img 
                    src={experience.image} 
                    alt={experience.title}
                    className="w-full h-48 md:h-32 object-cover rounded-lg"
                  />
                </div>
                
                <div className="md:w-2/3">
                  <h3 className="text-xl font-bold mb-3 text-white">{experience.title}</h3>
                  <p className="text-gray-300 mb-4">{experience.description}</p>
                  
                  <div className="flex flex-col sm:flex-row gap-4 text-sm text-gray-400">
                    <div className="flex items-center gap-2">
                      <Calendar size={16} className="text-accent" />
                      <span>{experience.date}</span>
                    </div>
                    <div className="flex items-center gap-2">
                      <MapPin size={16} className="text-accent" />
                      <span>{experience.location}</span>
                    </div>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
};
