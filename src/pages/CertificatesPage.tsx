import { useState } from 'react';
import { ExternalLink } from 'lucide-react';
import { Dialog, DialogContent, DialogTrigger, DialogTitle, DialogDescription } from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import { useCertificates, type Certificate } from '@/hooks/usePortfolioData';
import { Navigation } from '@/components/portfolio/Navigation';
import { COLORS, TYPOGRAPHY } from "@/utils/designTokens";

const CertificatesPage = () => {
  const [selectedCertificate, setSelectedCertificate] = useState<Certificate | null>(null);
  const { data: certificates, isLoading, error } = useCertificates();

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
          <div style={{ color: COLORS.text, fontSize: TYPOGRAPHY.fontSize.lg }}>Loading certificates...</div>
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
          <div style={{ color: '#FF3B30', fontSize: TYPOGRAPHY.fontSize.lg }}>Error loading certificates</div>
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
            My Certificates
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
            Professional certifications and achievements
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {certificates?.map((certificate) => (
            <Card 
              key={certificate.id}
              className="group bg-transparent border-gray-700 hover:border-accent/50 transition-all duration-500 overflow-hidden"
            >
              <div className="relative overflow-hidden">
                <img 
                  src={certificate.image} 
                  alt={certificate.title}
                  className="w-full h-64 object-cover transition-transform duration-500 group-hover:scale-110"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>
                
                {/* Floating Action Button */}
                <div className="absolute top-4 right-4 opacity-0 group-hover:opacity-100 transition-opacity duration-300">
                  {certificate.credential_link && (
                    <a 
                      href={certificate.credential_link} 
                      target="_blank" 
                      rel="noopener noreferrer"
                      className="p-2 bg-black/50 backdrop-blur-sm rounded-full hover:bg-accent/20 transition-colors"
                    >
                      <ExternalLink size={16} className="text-white" />
                    </a>
                  )}
                </div>
                
                {/* Overlay Content */}
                <div className="absolute bottom-4 left-4 right-4 opacity-0 group-hover:opacity-100 transition-opacity duration-300">
                  <h3 className="text-lg font-bold text-white mb-1">{certificate.title}</h3>
                  <p className="text-sm text-gray-300">{certificate.issuer}</p>
                </div>
              </div>
              
              <CardContent className="p-6">
                <h3 className="text-lg font-bold mb-2 text-white group-hover:text-accent transition-colors">
                  {certificate.title}
                </h3>
                <p className="text-gray-400 mb-4">{certificate.issuer}</p>
                
                <div className="flex gap-3">
                  <Dialog>
                    <DialogTrigger asChild>
                      <Button 
                        variant="outline" 
                        className="flex-1 border-accent text-accent hover:bg-accent hover:text-primary transition-all duration-300"
                        onClick={() => setSelectedCertificate(certificate)}
                      >
                        View Details
                      </Button>
                    </DialogTrigger>
                    <DialogContent className="max-w-2xl bg-primary border-gray-700">
                      <DialogTitle className="text-2xl font-bold text-white">
                        {selectedCertificate?.title}
                      </DialogTitle>
                      <DialogDescription asChild>
                        <div className="space-y-4">
                          <img 
                            src={selectedCertificate?.image} 
                            alt={selectedCertificate?.title}
                            className="w-full h-auto object-cover rounded-lg"
                          />
                          
                          <div className="text-center">
                            <p className="text-lg text-gray-300 mb-2">Issued by</p>
                            <p className="text-xl font-semibold text-accent">{selectedCertificate?.issuer}</p>
                          </div>
                          
                          {selectedCertificate?.credential_link && (
                            <div className="flex justify-center">
                              <a 
                                href={selectedCertificate.credential_link} 
                                target="_blank" 
                                rel="noopener noreferrer"
                                className="flex items-center gap-2 px-6 py-3 bg-accent hover:bg-accent/80 text-primary rounded-md transition-colors duration-200 font-semibold"
                              >
                                <ExternalLink size={16} />
                                View Credential
                              </a>
                            </div>
                          )}
                        </div>
                      </DialogDescription>
                    </DialogContent>
                  </Dialog>
                  
                  {certificate.credential_link && (
                    <a 
                      href={certificate.credential_link} 
                      target="_blank" 
                      rel="noopener noreferrer"
                    >
                      <Button variant="ghost" size="sm" className="text-gray-400 hover:text-accent">
                        <ExternalLink size={16} />
                      </Button>
                    </a>
                  )}
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      </div>
    </div>
  );
};

export default CertificatesPage;
