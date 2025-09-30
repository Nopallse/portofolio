
import { useSkills } from '@/hooks/usePortfolioData';

export const Skills = () => {
  const { data: skills, isLoading, error } = useSkills();

  if (isLoading) {
    return (
      <section id="skills" className="py-20 bg-gray-900/50">
        <div className="container mx-auto px-4">
          <div className="text-center">
            <div className="text-lg text-white">Loading skills...</div>
          </div>
        </div>
      </section>
    );
  }

  if (error) {
    return (
      <section id="skills" className="py-20 bg-gray-900/50">
        <div className="container mx-auto px-4">
          <div className="text-center">
            <div className="text-lg text-red-400">Error loading skills</div>
          </div>
        </div>
      </section>
    );
  }

  const skillCategories = [
    { title: 'Programming Languages', category: 'languages' },
    { title: 'Frameworks & Libraries', category: 'frameworks' },
    { title: 'Tools & Platforms', category: 'tools' },
    { title: 'Databases', category: 'databases' },
  ];

  return (
    <section id="skills" className="py-20 bg-gray-900/50">
      <div className="container mx-auto px-4">
        <div className="text-center mb-16">
          <h2 className="text-4xl md:text-5xl font-bold mb-6 text-white">Skills</h2>
          <div className="w-24 h-1 bg-accent mx-auto mb-8"></div>
          <p className="text-lg text-gray-300 max-w-2xl mx-auto">
            Technologies and tools I work with
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-8 max-w-6xl mx-auto">
          {skillCategories.map((categoryInfo, index) => {
            const skillData = skills?.find(skill => skill.category === categoryInfo.category);
            
            return (
              <div 
                key={index}
                className="bg-primary/50 rounded-lg p-6 border border-gray-700 hover:border-accent/50 transition-all duration-300 transform hover:scale-105"
              >
                <div className="flex items-center mb-4">
                  <span className="text-2xl mr-3">{categoryInfo.icon}</span>
                  <h3 className="text-xl font-bold text-white">{categoryInfo.title}</h3>
                </div>
                
                <div className="flex flex-wrap gap-2">
                  {skillData?.items.map((skill) => (
                    <span 
                      key={skill}
                      className="px-3 py-1 bg-accent/20 text-accent rounded-full text-sm border border-accent/30 hover:bg-accent/30 transition-colors duration-200"
                    >
                      {skill}
                    </span>
                  ))}
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </section>
  );
};
