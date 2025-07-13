
import { Code, Smartphone, Database, Globe } from 'lucide-react';

export const About = () => {
  const highlights = [
    {
      icon: <Code className="w-8 h-8 text-accent" />,
      title: "Full-Stack Development",
      description: "Experienced in both frontend and backend technologies"
    },
    {
      icon: <Smartphone className="w-8 h-8 text-accent" />,
      title: "Mobile Development",
      description: "Android and cross-platform mobile applications"
    },
    {
      icon: <Database className="w-8 h-8 text-accent" />,
      title: "Database Design",
      description: "Proficient in various database technologies"
    },
    {
      icon: <Globe className="w-8 h-8 text-accent" />,
      title: "Web Technologies",
      description: "Modern web frameworks and responsive design"
    }
  ];

  return (
    <section id="about" className="py-20 bg-gray-900/50">
      <div className="container mx-auto px-4">
        <div className="text-center mb-16">
          <h2 className="text-4xl md:text-5xl font-bold mb-6 text-white">About Me</h2>
          <div className="w-24 h-1 bg-accent mx-auto mb-8"></div>
        </div>

        <div className="max-w-4xl mx-auto">
          <div className="text-center mb-12">
            <p className="text-lg text-gray-300 leading-relaxed mb-6">
              I'm a passionate Information Systems student at Universitas Andalas with a strong focus on 
              full-stack and mobile development. My journey in technology has been marked by continuous 
              learning and hands-on experience through various projects and internships.
            </p>
            <p className="text-lg text-gray-300 leading-relaxed">
              I recently completed the prestigious Bangkit Academy program by Google, graduating with 
              distinction after 900+ hours of intensive Android development training. I'm always eager 
              to tackle new challenges and contribute to innovative projects.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
            {highlights.map((item, index) => (
              <div 
                key={index}
                className="text-center p-6 rounded-lg bg-primary/50 border border-gray-700 hover:border-accent/50 transition-all duration-300 transform hover:scale-105 hover:bg-primary/70"
              >
                <div className="flex justify-center mb-4">
                  {item.icon}
                </div>
                <h3 className="text-xl font-semibold mb-3 text-white">{item.title}</h3>
                <p className="text-gray-400">{item.description}</p>
              </div>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
};
