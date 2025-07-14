
import { ExternalLink } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { certificatesData } from '@/data/portfolio';
import { COLORS } from '@/utils/designTokens';

export const Certificates = () => {
  return (
    <section id="certificates" className="py-20" style={{ backgroundColor: COLORS.primary }}>
      <div className="container mx-auto px-4">
        <div className="text-center mb-16">
          <h2 className="text-4xl md:text-5xl font-bold mb-6 text-white">Certificates</h2>
          <div className="w-24 h-1 mx-auto mb-8" style={{ backgroundColor: COLORS.accent.primary }}></div>
          <p className="text-lg text-gray-300 max-w-2xl mx-auto">
            Professional certifications and achievements
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {certificatesData.map((certificate, index) => (
            <div 
              key={index}
              className="backdrop-blur-sm rounded-lg overflow-hidden transition-all duration-300 transform hover:scale-105 group shadow-lg"
              style={{
                backgroundColor: COLORS.glass.background,
                border: `${COLORS.glass.outline.width}px ${COLORS.glass.outline.style} ${COLORS.glass.outline.color}`,
                backdropFilter: `blur(${COLORS.glass.blur.radius}px)`
              }}
            >
              <div className="relative overflow-hidden">
                <img 
                  src={certificate.image} 
                  alt={certificate.title}
                  className="w-full h-48 object-cover group-hover:scale-110 transition-transform duration-300"
                />
                <div 
                  className="absolute inset-0 opacity-0 group-hover:opacity-100 transition-opacity duration-300"
                  style={{
                    background: `linear-gradient(to top, ${COLORS.gray[900]}CC, transparent)`
                  }}
                ></div>
              </div>
              
              <div className="p-6">
                <h3 className="text-lg font-bold mb-2 text-white">{certificate.title}</h3>
                <p className="mb-4" style={{ color: COLORS.gray[400] }}>{certificate.issuer}</p>
                
                <a 
                  href={certificate.credentialLink} 
                  target="_blank" 
                  rel="noopener noreferrer"
                >
                  <Button 
                    variant="outline" 
                    size="sm"
                    className="w-full"
                    style={{
                      borderColor: COLORS.accent.primary,
                      color: COLORS.accent.primary
                    }}
                  >
                    <ExternalLink size={16} className="mr-2" />
                    View Credential
                  </Button>
                </a>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};
