import { useEffect, useState } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { Badge } from '@/components/ui/badge';
import { 
  ArrowLeft, 
  Plus, 
  X, 
  Upload, 
  Save,
  FileText,
  ExternalLink,
  Github,
  Image as ImageIcon,
  Loader2
} from 'lucide-react';
import { supabase } from '@/integrations/supabase/client';
import AdminLayout from '@/components/layout/AdminLayout';
import { useToast } from '@/hooks/use-toast';

const EditProject = () => {
  const { id } = useParams<{ id: string }>();
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [user, setUser] = useState<any>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isLoadingProject, setIsLoadingProject] = useState(true);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');
  const navigate = useNavigate();
  const { toast } = useToast();

  // Form state
  const [formData, setFormData] = useState({
    title: '',
    short_desc: '',
    full_desc: '',
    cover_image: '',
    demo_link: '',
    repository_link: '',
    tech_stack: [] as string[],
    features: [] as string[],
    images: [] as string[]
  });

  // Input states for arrays
  const [techInput, setTechInput] = useState('');
  const [featureInput, setFeatureInput] = useState('');

  // File upload states
  const [coverImageFile, setCoverImageFile] = useState<File | null>(null);
  const [projectImageFiles, setProjectImageFiles] = useState<File[]>([]);
  const [uploadingCover, setUploadingCover] = useState(false);
  const [uploadingImages, setUploadingImages] = useState(false);

  // Original project data for comparison
  const [originalProject, setOriginalProject] = useState<any>(null);

  useEffect(() => {
    // Check current session
    const checkSession = async () => {
      const { data: { session }, error } = await supabase.auth.getSession();
      
      if (session && session.user) {
        setUser(session.user);
        setIsAuthenticated(true);
      } else {
        navigate('/admin/login');
      }
      setIsLoading(false);
    };

    checkSession();

    // Listen for auth changes
    const { data: { subscription } } = supabase.auth.onAuthStateChange(
      async (event, session) => {
        if (event === 'SIGNED_IN' && session) {
          setUser(session.user);
          setIsAuthenticated(true);
        } else if (event === 'SIGNED_OUT') {
          setUser(null);
          setIsAuthenticated(false);
          navigate('/admin/login');
        }
      }
    );

    return () => subscription.unsubscribe();
  }, [navigate]);

  // Load project data
  useEffect(() => {
    const loadProject = async () => {
      if (!id) return;

      try {
        const { data: project, error } = await supabase
          .from('projects')
          .select('*')
          .eq('id', id)
          .single();

        if (error) {
          throw error;
        }

        if (project) {
          setOriginalProject(project);
          setFormData({
            title: project.title || '',
            short_desc: project.short_desc || '',
            full_desc: project.full_desc || '',
            cover_image: project.cover_image || '',
            demo_link: project.demo_link || '',
            repository_link: project.repository_link || '',
            tech_stack: project.tech_stack || [],
            features: project.features || [],
            images: project.images || []
          });
        }
      } catch (error) {
        console.error('Error loading project:', error);
        setError('Failed to load project data');
        toast({
          title: "Error",
          description: "Failed to load project data",
          variant: "destructive",
        });
      } finally {
        setIsLoadingProject(false);
      }
    };

    if (isAuthenticated && id) {
      loadProject();
    }
  }, [id, isAuthenticated, toast]);

  const handleAddTech = () => {
    if (techInput.trim() && !formData.tech_stack.includes(techInput.trim())) {
      setFormData(prev => ({
        ...prev,
        tech_stack: [...prev.tech_stack, techInput.trim()]
      }));
      setTechInput('');
    }
  };

  const handleRemoveTech = (tech: string) => {
    setFormData(prev => ({
      ...prev,
      tech_stack: prev.tech_stack.filter(t => t !== tech)
    }));
  };

  const handleAddFeature = () => {
    if (featureInput.trim() && !formData.features.includes(featureInput.trim())) {
      setFormData(prev => ({
        ...prev,
        features: [...prev.features, featureInput.trim()]
      }));
      setFeatureInput('');
    }
  };

  const handleRemoveFeature = (feature: string) => {
    setFormData(prev => ({
      ...prev,
      features: prev.features.filter(f => f !== feature)
    }));
  };

  const handleCoverImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      setCoverImageFile(file);
    }
  };

  const handleProjectImagesChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = Array.from(e.target.files || []);
    setProjectImageFiles(prev => [...prev, ...files]);
  };

  const removeProjectImage = (index: number) => {
    setProjectImageFiles(prev => prev.filter((_, i) => i !== index));
  };

  const removeExistingImage = (index: number) => {
    setFormData(prev => ({
      ...prev,
      images: prev.images.filter((_, i) => i !== index)
    }));
  };

  const uploadCoverImage = async (): Promise<string> => {
    if (!coverImageFile) return formData.cover_image;
    
    setUploadingCover(true);
    try {
      const { data: { session } } = await supabase.auth.getSession();
      if (!session) {
        throw new Error('User not authenticated');
      }

      const projectFolderName = formData.title.toLowerCase().replace(/\s+/g, '-').replace(/[^a-z0-9-]/g, '');
      const fileName = `${projectFolderName}-cover.${coverImageFile.name.split('.').pop()}`;
      const filePath = `projects/${projectFolderName}/${fileName}`;

      const { data, error } = await supabase.storage
        .from('portofolio')
        .upload(filePath, coverImageFile, {
          cacheControl: '3600',
          upsert: true
        });

      if (error) {
        throw error;
      }

      const { data: { publicUrl } } = supabase.storage
        .from('portofolio')
        .getPublicUrl(filePath);

      return publicUrl;
    } catch (error) {
      console.error('Error uploading cover image:', error);
      throw error;
    } finally {
      setUploadingCover(false);
    }
  };

  const uploadProjectImages = async (): Promise<string[]> => {
    if (projectImageFiles.length === 0) return formData.images;
    
    setUploadingImages(true);
    try {
      const { data: { session } } = await supabase.auth.getSession();
      if (!session) {
        throw new Error('User not authenticated');
      }

      const projectFolderName = formData.title.toLowerCase().replace(/\s+/g, '-').replace(/[^a-z0-9-]/g, '');
      const uploadedUrls: string[] = [...formData.images]; // Keep existing images

      for (let i = 0; i < projectImageFiles.length; i++) {
        const file = projectImageFiles[i];
        const fileName = `${projectFolderName}-${Date.now()}-${i + 1}.${file.name.split('.').pop()}`;
        const filePath = `projects/${projectFolderName}/${fileName}`;

        const { data, error } = await supabase.storage
          .from('portofolio')
          .upload(filePath, file, {
            cacheControl: '3600',
            upsert: false
          });

        if (error) {
          throw error;
        }

        const { data: { publicUrl } } = supabase.storage
          .from('portofolio')
          .getPublicUrl(filePath);

        uploadedUrls.push(publicUrl);
      }

      return uploadedUrls;
    } catch (error) {
      console.error('Error uploading project images:', error);
      throw error;
    } finally {
      setUploadingImages(false);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);
    setError('');
    setSuccess('');

    try {
      // Validate required fields
      if (!formData.title.trim() || !formData.short_desc.trim() || !formData.full_desc.trim()) {
        throw new Error('Please fill in all required fields');
      }

      // Upload images if new files are selected
      let finalCoverImage = formData.cover_image;
      let finalProjectImages = formData.images;

      if (coverImageFile) {
        finalCoverImage = await uploadCoverImage();
      }

      if (projectImageFiles.length > 0) {
        finalProjectImages = await uploadProjectImages();
      }

      // Update project in database
      const { error: updateError } = await supabase
        .from('projects')
        .update({
          title: formData.title.trim(),
          short_desc: formData.short_desc.trim(),
          full_desc: formData.full_desc.trim(),
          cover_image: finalCoverImage,
          demo_link: formData.demo_link.trim() || null,
          repository_link: formData.repository_link.trim() || null,
          tech_stack: formData.tech_stack,
          features: formData.features,
          images: finalProjectImages,
          updated_at: new Date().toISOString()
        })
        .eq('id', id);

      if (updateError) {
        throw updateError;
      }

      setSuccess('Project updated successfully!');
      toast({
        title: "Success",
        description: "Project has been updated successfully",
        variant: "default",
      });

      // Navigate back to projects list after a short delay
      setTimeout(() => {
        navigate('/admin/projects');
      }, 1500);

    } catch (error) {
      console.error('Error updating project:', error);
      setError(error instanceof Error ? error.message : 'An unexpected error occurred');
      toast({
        title: "Error",
        description: error instanceof Error ? error.message : "An unexpected error occurred",
        variant: "destructive",
      });
    } finally {
      setIsSubmitting(false);
    }
  };

  if (isLoading || isLoadingProject) {
    return (
      <div className="min-h-screen bg-primary text-white flex items-center justify-center">
        <div className="flex items-center gap-2">
          <Loader2 className="w-6 h-6 animate-spin" />
          <div className="text-lg">Loading...</div>
        </div>
      </div>
    );
  }

  if (!isAuthenticated) {
    return null;
  }

  if (!originalProject) {
    return (
      <div className="min-h-screen bg-primary text-white flex items-center justify-center">
        <div className="text-center">
          <div className="text-lg text-red-400 mb-4">Project not found</div>
          <Button onClick={() => navigate('/admin/projects')}>
            Back to Projects
          </Button>
        </div>
      </div>
    );
  }

  return (
    <AdminLayout user={user}>
      <div className="space-y-6">
        {/* Header */}
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-3xl font-bold text-white">Edit Project</h1>
            <p className="text-gray-300">Update project information and content</p>
          </div>
          <Button 
            variant="outline" 
            onClick={() => navigate('/admin/projects')}
            className="border-secondary/30 text-gray-300 hover:bg-secondary/20"
          >
            <ArrowLeft className="w-4 h-4 mr-2" />
            Back to Projects
          </Button>
        </div>

        {/* Alerts */}
        {error && (
          <Alert className="bg-red-500/10 border-red-500/20 text-red-400">
            <AlertDescription>{error}</AlertDescription>
          </Alert>
        )}

        {success && (
          <Alert className="bg-green-500/10 border-green-500/20 text-green-400">
            <AlertDescription>{success}</AlertDescription>
          </Alert>
        )}

        {/* Form */}
        <form onSubmit={handleSubmit} className="space-y-8">
          {/* Basic Information */}
          <Card className="bg-secondary/10 border-secondary/20">
            <CardHeader>
              <CardTitle className="text-white">Basic Information</CardTitle>
              <CardDescription className="text-gray-300">
                Update the basic details of your project
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-6">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div className="space-y-2">
                  <Label htmlFor="title" className="text-white">Project Title *</Label>
                  <Input
                    id="title"
                    value={formData.title}
                    onChange={(e) => setFormData(prev => ({ ...prev, title: e.target.value }))}
                    className="bg-secondary/20 border-secondary/30 text-white"
                    placeholder="Enter project title"
                    required
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="short_desc" className="text-white">Short Description *</Label>
                  <Input
                    id="short_desc"
                    value={formData.short_desc}
                    onChange={(e) => setFormData(prev => ({ ...prev, short_desc: e.target.value }))}
                    className="bg-secondary/20 border-secondary/30 text-white"
                    placeholder="Brief description"
                    required
                  />
                </div>
              </div>

              <div className="space-y-2">
                <Label htmlFor="full_desc" className="text-white">Full Description *</Label>
                <Textarea
                  id="full_desc"
                  value={formData.full_desc}
                  onChange={(e) => setFormData(prev => ({ ...prev, full_desc: e.target.value }))}
                  className="bg-secondary/20 border-secondary/30 text-white min-h-[120px]"
                  placeholder="Detailed project description"
                  required
                />
              </div>
            </CardContent>
          </Card>

          {/* Links */}
          <Card className="bg-secondary/10 border-secondary/20">
            <CardHeader>
              <CardTitle className="text-white">Project Links</CardTitle>
              <CardDescription className="text-gray-300">
                Add demo and repository links (optional)
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-6">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div className="space-y-2">
                  <Label htmlFor="demo_link" className="text-white">Demo Link</Label>
                  <div className="relative">
                    <ExternalLink className="absolute left-3 top-3 w-4 h-4 text-gray-400" />
                    <Input
                      id="demo_link"
                      value={formData.demo_link}
                      onChange={(e) => setFormData(prev => ({ ...prev, demo_link: e.target.value }))}
                      className="bg-secondary/20 border-secondary/30 text-white pl-10"
                      placeholder="https://demo.example.com"
                    />
                  </div>
                </div>
                <div className="space-y-2">
                  <Label htmlFor="repository_link" className="text-white">Repository Link</Label>
                  <div className="relative">
                    <Github className="absolute left-3 top-3 w-4 h-4 text-gray-400" />
                    <Input
                      id="repository_link"
                      value={formData.repository_link}
                      onChange={(e) => setFormData(prev => ({ ...prev, repository_link: e.target.value }))}
                      className="bg-secondary/20 border-secondary/30 text-white pl-10"
                      placeholder="https://github.com/username/repo"
                    />
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Tech Stack */}
          <Card className="bg-secondary/10 border-secondary/20">
            <CardHeader>
              <CardTitle className="text-white">Tech Stack</CardTitle>
              <CardDescription className="text-gray-300">
                Add technologies used in this project
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="flex gap-2">
                <Input
                  value={techInput}
                  onChange={(e) => setTechInput(e.target.value)}
                  onKeyPress={(e) => e.key === 'Enter' && (e.preventDefault(), handleAddTech())}
                  className="bg-secondary/20 border-secondary/30 text-white flex-1"
                  placeholder="Add technology (e.g., React, Node.js)"
                />
                <Button type="button" onClick={handleAddTech} className="bg-accent hover:bg-accent/80 text-primary">
                  <Plus className="w-4 h-4" />
                </Button>
              </div>
              <div className="flex flex-wrap gap-2">
                {formData.tech_stack.map((tech, index) => (
                  <Badge key={index} className="bg-accent/20 text-accent border-accent/30">
                    {tech}
                    <button
                      type="button"
                      onClick={() => handleRemoveTech(tech)}
                      className="ml-2 hover:text-red-400"
                    >
                      <X className="w-3 h-3" />
                    </button>
                  </Badge>
                ))}
              </div>
            </CardContent>
          </Card>

          {/* Features */}
          <Card className="bg-secondary/10 border-secondary/20">
            <CardHeader>
              <CardTitle className="text-white">Key Features</CardTitle>
              <CardDescription className="text-gray-300">
                List the main features of your project
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="flex gap-2">
                <Input
                  value={featureInput}
                  onChange={(e) => setFeatureInput(e.target.value)}
                  onKeyPress={(e) => e.key === 'Enter' && (e.preventDefault(), handleAddFeature())}
                  className="bg-secondary/20 border-secondary/30 text-white flex-1"
                  placeholder="Add feature (e.g., User authentication)"
                />
                <Button type="button" onClick={handleAddFeature} className="bg-accent hover:bg-accent/80 text-primary">
                  <Plus className="w-4 h-4" />
                </Button>
              </div>
              <div className="space-y-2">
                {formData.features.map((feature, index) => (
                  <div key={index} className="flex items-center gap-2 p-2 bg-secondary/20 rounded">
                    <span className="text-gray-300 flex-1">{feature}</span>
                    <button
                      type="button"
                      onClick={() => handleRemoveFeature(feature)}
                      className="text-red-400 hover:text-red-300"
                    >
                      <X className="w-4 h-4" />
                    </button>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>

          {/* Images */}
          <Card className="bg-secondary/10 border-secondary/20">
            <CardHeader>
              <CardTitle className="text-white">Project Images</CardTitle>
              <CardDescription className="text-gray-300">
                Update cover image and add project screenshots
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-6">
              {/* Cover Image */}
              <div className="space-y-4">
                <Label className="text-white">Cover Image</Label>
                <div className="flex items-center gap-4">
                  {formData.cover_image && (
                    <div className="relative">
                      <img
                        src={formData.cover_image}
                        alt="Cover"
                        className="w-32 h-20 object-cover rounded border border-secondary/30"
                      />
                    </div>
                  )}
                  <div className="flex-1">
                    <Input
                      type="file"
                      accept="image/*"
                      onChange={handleCoverImageChange}
                      className="bg-secondary/20 border-secondary/30 text-white"
                    />
                    <p className="text-sm text-gray-400 mt-1">
                      {uploadingCover ? 'Uploading...' : 'Select a new cover image (optional)'}
                    </p>
                  </div>
                </div>
              </div>

              {/* Project Images */}
              <div className="space-y-4">
                <Label className="text-white">Project Images</Label>
                
                {/* Existing Images */}
                {formData.images.length > 0 && (
                  <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                    {formData.images.map((image, index) => (
                      <div key={index} className="relative group">
                        <img
                          src={image}
                          alt={`Project ${index + 1}`}
                          className="w-full h-24 object-cover rounded border border-secondary/30"
                        />
                        <button
                          type="button"
                          onClick={() => removeExistingImage(index)}
                          className="absolute top-1 right-1 bg-red-500 text-white rounded-full w-6 h-6 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity"
                        >
                          <X className="w-3 h-3" />
                        </button>
                      </div>
                    ))}
                  </div>
                )}

                {/* New Images */}
                <div className="space-y-2">
                  <Input
                    type="file"
                    accept="image/*"
                    multiple
                    onChange={handleProjectImagesChange}
                    className="bg-secondary/20 border-secondary/30 text-white"
                  />
                  <p className="text-sm text-gray-400">
                    {uploadingImages ? 'Uploading...' : 'Add new project images (optional)'}
                  </p>
                </div>

                {/* Preview New Images */}
                {projectImageFiles.length > 0 && (
                  <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                    {projectImageFiles.map((file, index) => (
                      <div key={index} className="relative group">
                        <img
                          src={URL.createObjectURL(file)}
                          alt={`New ${index + 1}`}
                          className="w-full h-24 object-cover rounded border border-secondary/30"
                        />
                        <button
                          type="button"
                          onClick={() => removeProjectImage(index)}
                          className="absolute top-1 right-1 bg-red-500 text-white rounded-full w-6 h-6 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity"
                        >
                          <X className="w-3 h-3" />
                        </button>
                      </div>
                    ))}
                  </div>
                )}
              </div>
            </CardContent>
          </Card>

          {/* Submit Button */}
          <div className="flex justify-end gap-4">
            <Button
              type="button"
              variant="outline"
              onClick={() => navigate('/admin/projects')}
              className="border-secondary/30 text-gray-300 hover:bg-secondary/20"
            >
              Cancel
            </Button>
            <Button
              type="submit"
              disabled={isSubmitting || uploadingCover || uploadingImages}
              className="bg-accent hover:bg-accent/80 text-primary"
            >
              {isSubmitting ? (
                <>
                  <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                  Updating...
                </>
              ) : (
                <>
                  <Save className="w-4 h-4 mr-2" />
                  Update Project
                </>
              )}
            </Button>
          </div>
        </form>
      </div>
    </AdminLayout>
  );
};

export default EditProject; 