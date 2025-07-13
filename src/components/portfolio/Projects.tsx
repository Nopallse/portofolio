
import { Link } from 'react-router-dom';
import { ExternalLink, Github } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { ThreeDMarquee } from '@/components/ui/3d-marquee';
import { projectsData } from '@/data/portfolio';

export const Projects = () => {
  return (
    <section id="projects" className="py-20 bg-primary">
      <div className="container mx-auto px-4">
        <div className="text-center mb-16">
          <h2 className="text-4xl md:text-5xl font-bold mb-6 text-white">Projects</h2>
          <div className="w-24 h-1 bg-accent mx-auto mb-8"></div>
          <p className="text-lg text-gray-300 max-w-2xl mx-auto">
            Here are some of my recent projects that showcase my skills and experience
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {projectsData.map((project) => (
            <div 
              key={project.id}
              className="bg-gray-900/50 rounded-lg overflow-hidden border border-gray-700 hover:border-accent/50 transition-all duration-300 transform hover:scale-105 group"
            >
              <div className="relative overflow-hidden">
                <img 
                  src={project.coverImage} 
                  alt={project.title}
                  className="w-full h-48 object-cover group-hover:scale-110 transition-transform duration-300"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-gray-900/80 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>
              </div>
              
              <div className="p-6">
                <h3 className="text-xl font-bold mb-3 text-white">{project.title}</h3>
                <p className="text-gray-400 mb-4 line-clamp-3">{project.shortDesc}</p>
                
                <div className="flex flex-wrap gap-2 mb-4">
                  {project.techStack.slice(0, 3).map((tech) => (
                    <Badge key={tech} variant="secondary" className="bg-accent/20 text-accent border-accent/30">
                      {tech}
                    </Badge>
                  ))}
                  {project.techStack.length > 3 && (
                    <Badge variant="secondary" className="bg-gray-700 text-gray-300">
                      +{project.techStack.length - 3}
                    </Badge>
                  )}
                </div>

                <div className="flex gap-3">
                  <Link to={`/projects/${project.id}`}>
                    <Button 
                      variant="outline" 
                      size="sm"
                      className="border-accent text-accent hover:bg-accent hover:text-primary flex-1"
                    >
                      View Details
                    </Button>
                  </Link>
                  
                  <a 
                    href={project.repositoryLink} 
                    target="_blank" 
                    rel="noopener noreferrer"
                  >
                    <Button variant="ghost" size="sm" className="text-gray-400 hover:text-accent">
                      <Github size={16} />
                    </Button>
                  </a>
                </div>
              </div>
            </div>
          ))}
        </div>

        {/* 3D Marquee Showcase */}
        <div className="mt-20">
          <h3 className="text-2xl font-bold mb-8 text-center text-white">Project Gallery</h3>
          <div className="mx-auto max-w-7xl rounded-3xl bg-gray-900/50 p-2 ring-1 ring-gray-700/50">
            <ThreeDMarquee 
              images={projectsData.flatMap(project => project.images)} 
            />
          </div>
        </div>
      </div>
    </section>
  );
};
