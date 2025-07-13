
import { Calendar, MapPin } from 'lucide-react';
import { useEducation } from '@/hooks/usePortfolioData';

export const Education = () => {
  const { data: education, isLoading, error } = useEducation();

  if (isLoading) {
    return (
      <section id="education" className="py-20 bg-primary">
        <div className="container mx-auto px-4">
          <div className="text-center">
            <div className="text-lg text-white">Loading education...</div>
          </div>
        </div>
      </section>
    );
  }

  if (error) {
    return (
      <section id="education" className="py-20 bg-primary">
        <div className="container mx-auto px-4">
          <div className="text-center">
            <div className="text-lg text-red-400">Error loading education</div>
          </div>
        </div>
      </section>
    );
  }

  return (
    <section id="education" className="py-20 bg-primary">
      <div className="container mx-auto px-4">
        <div className="text-center mb-16">
          <h2 className="text-4xl md:text-5xl font-bold mb-6 text-white">Education</h2>
          <div className="w-24 h-1 bg-accent mx-auto mb-8"></div>
          <p className="text-lg text-gray-300 max-w-2xl mx-auto">
            My academic background
          </p>
        </div>

        <div className="max-w-4xl mx-auto">
          {education?.map((edu) => (
            <div 
              key={edu.id}
              className="flex flex-col md:flex-row gap-6 p-6 bg-gray-900/50 rounded-lg border border-gray-700 hover:border-accent/50 transition-all duration-300 transform hover:scale-105"
            >
              <div className="md:w-1/3">
                <img 
                  src={edu.image} 
                  alt={edu.institution}
                  className="w-full h-48 md:h-32 object-cover rounded-lg"
                />
              </div>
              
              <div className="md:w-2/3">
                <h3 className="text-xl font-bold mb-2 text-white">{edu.institution}</h3>
                <h4 className="text-lg font-semibold mb-3 text-accent">{edu.degree}</h4>
                
                <div className="flex flex-col sm:flex-row gap-4 text-sm text-gray-400">
                  <div className="flex items-center gap-2">
                    <Calendar size={16} className="text-accent" />
                    <span>{edu.date_range}</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <MapPin size={16} className="text-accent" />
                    <span>{edu.location}</span>
                  </div>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};
