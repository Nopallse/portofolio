import { COLORS, TYPOGRAPHY } from "@/utils/designTokens";
import { useParams, Link } from 'react-router-dom';
import { ExternalLink, Github, ArrowLeft } from 'lucide-react';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import CircularGallery from '@/components/ui/circular-gallery';
import { useProjects, type Project } from '@/hooks/usePortfolioData';
import { Navigation } from '@/components/portfolio/Navigation';
import { useEffect, useState } from 'react';

const ProjectDetailPage = () => {
  const { id } = useParams<{ id: string }>();
  const { data: projects, isLoading, error } = useProjects();
  
  const project = projects?.find(p => p.id === id);

  const images = project?.images;
  const [galleryItems, setGalleryItems] = useState<{ image: string; text: string; width?: number; height?: number }[]>([]);

  useEffect(() => {
    if (!images) return;
    
    Promise.all(
      images.map(
        (img) =>
          new Promise<{ image: string; text: string; width: number; height: number }>((resolve) => {
            const imageObj = new window.Image();
            imageObj.onload = function () {
              resolve({ 
                image: img, 
                text: '', 
                width: imageObj.naturalWidth, 
                height: imageObj.naturalHeight 
              });
            };
            imageObj.src = img;
          })
      )
    ).then(setGalleryItems);
  }, [images]);
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
          <div style={{ color: COLORS.text, fontSize: TYPOGRAPHY.fontSize.lg }}>Loading project...</div>
        </div>
      </div>
    );
  }

  if (error || !project) {
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
          <div className="text-center">
            <div style={{ color: '#FF3B30', fontSize: TYPOGRAPHY.fontSize.lg, marginBottom: 16 }}>Project not found</div>
            <Link to="/projects">
              <Button variant="outline" style={{ borderColor: COLORS.accent.primary, color: COLORS.accent.primary }}>
                <ArrowLeft size={16} style={{ marginRight: 8 }} />
                Back to Projects
              </Button>
            </Link>
          </div>
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
        {/* Back Button */}
        <div className="mb-8">
          <Link to="/projects">
            <Button variant="ghost" style={{ color: COLORS.gray[400] }}>
              <ArrowLeft size={16} style={{ marginRight: 8 }} />
              Back to Projects
            </Button>
          </Link>
        </div>

        {/* Project Header */}
        <div className="text-center mb-16">
          <h1
            className="font-bold mb-6"
            style={{
              color: COLORS.text,
              fontSize: TYPOGRAPHY.fontSize['4xl'],
              fontWeight: TYPOGRAPHY.fontWeight.bold,
            }}
          >
            {project.title}
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
            className="max-w-3xl mx-auto"
            style={{ color: COLORS.gray[400], fontSize: TYPOGRAPHY.fontSize.lg }}
          >
            {project.full_desc}
          </p>
        </div>

        {/* Project Gallery Circular Gallery */}
        <div className="mb-16">
          <h2 className="text-2xl font-bold mb-8 text-center text-white">Project Gallery</h2>
          <div className="mx-auto max-w-6xl h-[600px]">
            <CircularGallery 
              items={galleryItems}
              bend={0}
              textColor="#fff"
              borderRadius={0.05}
              font="bold 30px Figtree"
              scrollSpeed={2}
              scrollEase={0.05}
            />
          </div>
        </div>

        {/* Project Details */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 max-w-6xl mx-auto">
          {/* Tech Stack */}
          <div className="bg-gray-900/50 rounded-lg p-8 border border-gray-700">
            <h3 className="text-2xl font-bold mb-6 text-accent">Tech Stack</h3>
            <div className="flex flex-wrap gap-3">
              {project.tech_stack.map((tech) => (
                <Badge key={tech} className="bg-accent/20 text-accent border-accent/30 text-sm px-3 py-1">
                  {tech}
                </Badge>
              ))}
            </div>
          </div>

          {/* Features */}
          <div className="bg-gray-900/50 rounded-lg p-8 border border-gray-700">
            <h3 className="text-2xl font-bold mb-6 text-accent">Key Features</h3>
            <ul className="space-y-3">
              {project.features.map((feature, index) => (
                <li key={index} className="flex items-start gap-3 text-gray-300">
                  <div className="w-2 h-2 bg-accent rounded-full mt-2 flex-shrink-0"></div>
                  <span>{feature}</span>
                </li>
              ))}
            </ul>
          </div>
        </div>

        {/* Action Buttons */}
        <div className="flex justify-center gap-6 mt-16">
          {project.repository_link && (
            <a 
              href={project.repository_link} 
              target="_blank" 
              rel="noopener noreferrer"
              className="flex items-center gap-2 px-6 py-3 bg-gray-700 hover:bg-gray-600 text-white rounded-md transition-colors duration-200 font-semibold"
            >
              <Github size={20} />
              View Code
            </a>
          )}
          {project.demo_link && (
            <a 
              href={project.demo_link} 
              target="_blank" 
              rel="noopener noreferrer"
              className="flex items-center gap-2 px-6 py-3 bg-accent hover:bg-accent/80 text-primary rounded-md transition-colors duration-200 font-semibold"
            >
              <ExternalLink size={20} />
              Live Demo
            </a>
          )}
        </div>
      </div>
    </div>
  );
};

export default ProjectDetailPage;