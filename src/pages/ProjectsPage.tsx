import { Link, useNavigate } from 'react-router-dom';
import { ExternalLink, Github, Star, Code } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { CardBody, CardContainer, CardItem } from '@/components/ui/3d-card';
import { useProjects, type Project } from '@/hooks/usePortfolioData';
import { Navigation } from '@/components/portfolio/Navigation';
import { COLORS, TYPOGRAPHY } from "@/utils/designTokens";

const ProjectsPage = () => {
  const { data: projects, isLoading, error } = useProjects();
  const navigate = useNavigate();

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
          <div style={{ color: COLORS.text, fontSize: TYPOGRAPHY.fontSize.lg }}>Loading projects...</div>
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
          <div style={{ color: '#FF3B30', fontSize: TYPOGRAPHY.fontSize.lg }}>Error loading projects</div>
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
            My Projects
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
            Here are some of my recent projects that showcase my skills and experience
          </p>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-8">
          {projects?.map((project) => (
            <CardContainer key={project.id} className="w-full" style={{ aspectRatio: '4/5' }}>
              <CardBody
                className="relative group/card w-full h-full rounded-2xl cursor-pointer overflow-hidden p-6"
                style={{
                  background: COLORS.secondary,
                  boxShadow: '0 4px 20px rgba(0, 0, 0, 0.1)',
                  border: `1px solid ${COLORS.gray[700]}`,
                }}
                onClick={() => navigate(`/projects/${project.id}`)}
              >
                {/* Project Title */}
                <CardItem
                  translateZ="50"
                  className="text-lg font-bold mb-2"
                  style={{ color: COLORS.text }}
                >
                  {project.title}
                </CardItem>

                {/* Project Description */}
                <CardItem
                  as="p"
                  translateZ="60"
                  className="text-sm mb-4 line-clamp-2"
                  style={{ color: COLORS.gray[400] }}
                >
                  {project.short_desc}
                </CardItem>

                {/* Project Image with Advanced 3D Effects */}
                <CardItem
                  translateZ="100"
                  rotateX={15}
                  rotateZ={-5}
                  className="w-full"
                >
                  <div className="relative overflow-hidden rounded-xl">
                    <img
                      src={project.cover_image}
                      alt={project.title}
                      className="h-full w-full object-cover group-hover/card:shadow-xl transition-all duration-300"
                    />
                    {/* Subtle overlay on hover */}
                    <div className="absolute inset-0 bg-black opacity-0 group-hover/card:opacity-20 transition-opacity duration-300"></div>
                  </div>
                </CardItem>
              </CardBody>
            </CardContainer>
          ))}
        </div>
      </div>
    </div>
  );
};

export default ProjectsPage;
