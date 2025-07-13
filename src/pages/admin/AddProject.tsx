import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
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
  Image as ImageIcon
} from 'lucide-react';
import { supabase } from '@/integrations/supabase/client';
import AdminLayout from '@/components/layout/AdminLayout';

const AddProject = () => {
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [user, setUser] = useState<any>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');
  const navigate = useNavigate();

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

  const uploadCoverImage = async (): Promise<string> => {
    if (!coverImageFile) return '';
    
    setUploadingCover(true);
    try {
      // Check if user is authenticated
      const { data: { session } } = await supabase.auth.getSession();
      if (!session) {
        throw new Error('User not authenticated');
      }

      const projectFolderName = formData.title.toLowerCase().replace(/\s+/g, '-').replace(/[^a-z0-9-]/g, '');
      const fileName = `${projectFolderName}-cover.${coverImageFile.name.split('.').pop()}`;
      const filePath = `project/${projectFolderName}/${fileName}`;

      console.log('Uploading cover image to:', filePath);

      const { data, error } = await supabase.storage
        .from('portofolio')
        .upload(filePath, coverImageFile, {
          cacheControl: '3600',
          upsert: false
        });

      if (error) {
        console.error('Storage upload error:', error);
        throw error;
      }

      console.log('Cover image uploaded successfully:', data);

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
    if (projectImageFiles.length === 0) return [];
    
    setUploadingImages(true);
    try {
      // Check if user is authenticated
      const { data: { session } } = await supabase.auth.getSession();
      if (!session) {
        throw new Error('User not authenticated');
      }

      const projectFolderName = formData.title.toLowerCase().replace(/\s+/g, '-').replace(/[^a-z0-9-]/g, '');
      const uploadedUrls: string[] = [];

      for (let i = 0; i < projectImageFiles.length; i++) {
        const file = projectImageFiles[i];
        const fileName = `${projectFolderName}-${i + 1}.${file.name.split('.').pop()}`;
        const filePath = `project/${projectFolderName}/${fileName}`;

        console.log('Uploading project image to:', filePath);

        const { data, error } = await supabase.storage
          .from('portofolio')
          .upload(filePath, file, {
            cacheControl: '3600',
            upsert: false
          });

        if (error) {
          console.error('Storage upload error:', error);
          throw error;
        }

        console.log('Project image uploaded successfully:', data);

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
    setError('');
    setSuccess('');
    setIsSubmitting(true);

    try {
      // Check if user is authenticated
      const { data: { session } } = await supabase.auth.getSession();
      if (!session) {
        throw new Error('User not authenticated');
      }

      // Upload cover image
      let coverImageUrl = '';
      if (coverImageFile) {
        coverImageUrl = await uploadCoverImage();
      }

      // Upload project images
      let projectImageUrls: string[] = [];
      if (projectImageFiles.length > 0) {
        projectImageUrls = await uploadProjectImages();
      }

      console.log('Inserting project data...');

      // Insert project data
      const { data, error } = await supabase
        .from('projects')
        .insert([{
          title: formData.title,
          short_desc: formData.short_desc,
          full_desc: formData.full_desc,
          cover_image: coverImageUrl || formData.cover_image,
          demo_link: formData.demo_link || null,
          repository_link: formData.repository_link || null,
          tech_stack: formData.tech_stack,
          features: formData.features,
          images: projectImageUrls.length > 0 ? projectImageUrls : formData.images
        }]);

      if (error) {
        console.error('Database insert error:', error);
        setError(error.message);
      } else {
        console.log('Project inserted successfully:', data);
        setSuccess('Project added successfully!');
        setTimeout(() => {
          navigate('/admin/projects');
        }, 2000);
      }
    } catch (err: any) {
      console.error('Submit error:', err);
      setError(err.message || 'An unexpected error occurred. Please try again.');
    } finally {
      setIsSubmitting(false);
    }
  };

  if (isLoading) {
    return (
      <div className="min-h-screen bg-primary text-white flex items-center justify-center">
        <div className="text-lg">Loading...</div>
      </div>
    );
  }

  if (!isAuthenticated) {
    return null;
  }

  return (
    <AdminLayout user={user}>
      <div className="space-y-6">
        {/* Header */}
        <div className="flex items-center space-x-4">
          <Button
            variant="ghost"
            onClick={() => navigate('/admin/projects')}
            className="text-gray-400 hover:text-white"
          >
            <ArrowLeft className="w-4 h-4 mr-2" />
            Back to Projects
          </Button>
          <div>
            <h1 className="text-3xl font-bold text-white">Add New Project</h1>
            <p className="text-gray-300">Create a new portfolio project</p>
          </div>
        </div>

        {/* Form */}
        <form onSubmit={handleSubmit} className="space-y-6">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            {/* Basic Information */}
            <Card className="bg-secondary/10 border-secondary/20">
              <CardHeader>
                <CardTitle className="text-white">Basic Information</CardTitle>
                <CardDescription className="text-gray-300">
                  Essential project details
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="space-y-2">
                  <Label htmlFor="title" className="text-white">Project Title *</Label>
                  <Input
                    id="title"
                    value={formData.title}
                    onChange={(e) => setFormData(prev => ({ ...prev, title: e.target.value }))}
                    className="bg-secondary/20 border-secondary/30 text-white placeholder:text-gray-400"
                    placeholder="Enter project title"
                    required
                  />
                </div>

                <div className="space-y-2">
                  <Label htmlFor="short_desc" className="text-white">Short Description *</Label>
                  <Textarea
                    id="short_desc"
                    value={formData.short_desc}
                    onChange={(e) => setFormData(prev => ({ ...prev, short_desc: e.target.value }))}
                    className="bg-secondary/20 border-secondary/30 text-white placeholder:text-gray-400"
                    placeholder="Brief description of the project"
                    rows={3}
                    required
                  />
                </div>

                <div className="space-y-2">
                  <Label htmlFor="full_desc" className="text-white">Full Description *</Label>
                  <Textarea
                    id="full_desc"
                    value={formData.full_desc}
                    onChange={(e) => setFormData(prev => ({ ...prev, full_desc: e.target.value }))}
                    className="bg-secondary/20 border-secondary/30 text-white placeholder:text-gray-400"
                    placeholder="Detailed description of the project"
                    rows={6}
                    required
                  />
                </div>

                <div className="space-y-2">
                  <Label htmlFor="cover_image" className="text-white">Cover Image *</Label>
                  <div className="space-y-2">
                    <div className="flex items-center space-x-2">
                      <Input
                        id="cover_image"
                        type="file"
                        accept="image/*"
                        onChange={handleCoverImageChange}
                        className="bg-secondary/20 h-auto border-secondary/30 text-white file:mr-4 file:py-2 file:px-4 file:rounded-full file:border-0 file:text-sm file:font-semibold file:bg-accent file:text-primary hover:file:bg-accent/80"
                      />
                      {uploadingCover && (
                        <div className="text-sm text-gray-400">Uploading...</div>
                      )}
                    </div>
                    {coverImageFile && (
                      <div className="flex items-center space-x-2 p-2 bg-secondary/20 rounded">
                        <ImageIcon className="w-4 h-4 text-accent" />
                        <span className="text-sm text-white">{coverImageFile.name}</span>
                        <button
                          type="button"
                          onClick={() => setCoverImageFile(null)}
                          className="text-gray-400 hover:text-red-400"
                        >
                          <X className="w-4 h-4" />
                        </button>
                      </div>
                    )}
                  </div>
                </div>
              </CardContent>
            </Card>

            {/* Links and Tech Stack */}
            <Card className="bg-secondary/10 border-secondary/20">
              <CardHeader>
                <CardTitle className="text-white">Links & Technology</CardTitle>
                <CardDescription className="text-gray-300">
                  Project links and tech stack
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="space-y-2">
                  <Label htmlFor="demo_link" className="text-white">Demo Link</Label>
                  <div className="relative">
                    <ExternalLink className="absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-gray-400" />
                    <Input
                      id="demo_link"
                      value={formData.demo_link}
                      onChange={(e) => setFormData(prev => ({ ...prev, demo_link: e.target.value }))}
                      className="pl-10 bg-secondary/20 border-secondary/30 text-white placeholder:text-gray-400"
                      placeholder="https://demo.example.com"
                    />
                  </div>
                </div>

                <div className="space-y-2">
                  <Label htmlFor="repository_link" className="text-white">Repository Link</Label>
                  <div className="relative">
                    <Github className="absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-gray-400" />
                    <Input
                      id="repository_link"
                      value={formData.repository_link}
                      onChange={(e) => setFormData(prev => ({ ...prev, repository_link: e.target.value }))}
                      className="pl-10 bg-secondary/20 border-secondary/30 text-white placeholder:text-gray-400"
                      placeholder="https://github.com/username/repo"
                    />
                  </div>
                </div>

                <div className="space-y-2">
                  <Label className="text-white">Tech Stack</Label>
                  <div className="flex space-x-2">
                    <Input
                      value={techInput}
                      onChange={(e) => setTechInput(e.target.value)}
                      onKeyPress={(e) => e.key === 'Enter' && (e.preventDefault(), handleAddTech())}
                      className="bg-secondary/20 border-secondary/30 text-white placeholder:text-gray-400"
                      placeholder="Add technology"
                    />
                    <Button
                      type="button"
                      onClick={handleAddTech}
                      variant="outline"
                      className="border-accent text-accent hover:bg-accent hover:text-primary"
                    >
                      <Plus className="w-4 h-4" />
                    </Button>
                  </div>
                  <div className="flex flex-wrap gap-2 mt-2">
                    {formData.tech_stack.map((tech, index) => (
                      <Badge key={index} variant="secondary" className="bg-accent/20 text-accent">
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
                </div>
              </CardContent>
            </Card>
          </div>

          {/* Features and Images */}
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            <Card className="bg-secondary/10 border-secondary/20">
              <CardHeader>
                <CardTitle className="text-white">Features</CardTitle>
                <CardDescription className="text-gray-300">
                  Key features of the project
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="flex space-x-2">
                  <Input
                    value={featureInput}
                    onChange={(e) => setFeatureInput(e.target.value)}
                    onKeyPress={(e) => e.key === 'Enter' && (e.preventDefault(), handleAddFeature())}
                    className="bg-secondary/20 border-secondary/30 text-white placeholder:text-gray-400"
                    placeholder="Add feature"
                  />
                  <Button
                    type="button"
                    onClick={handleAddFeature}
                    variant="outline"
                    className="border-accent text-accent hover:bg-accent hover:text-primary"
                  >
                    <Plus className="w-4 h-4" />
                  </Button>
                </div>
                <div className="space-y-2">
                  {formData.features.map((feature, index) => (
                    <div key={index} className="flex items-center justify-between p-2 bg-secondary/20 rounded">
                      <span className="text-white text-sm">{feature}</span>
                      <button
                        type="button"
                        onClick={() => handleRemoveFeature(feature)}
                        className="text-gray-400 hover:text-red-400"
                      >
                        <X className="w-4 h-4" />
                      </button>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>

            <Card className="bg-secondary/10 border-secondary/20">
              <CardHeader>
                <CardTitle className="text-white">Project Images</CardTitle>
                <CardDescription className="text-gray-300">
                  Additional project screenshots
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="space-y-2">
                  <Input
                    type="file"
                    accept="image/*"
                    multiple
                    onChange={handleProjectImagesChange}
                    className="bg-secondary/20 h-auto border-secondary/30 text-white file:mr-4 file:py-2 file:px-4 file:rounded-full file:border-0 file:text-sm file:font-semibold file:bg-accent file:text-primary hover:file:bg-accent/80"
                  />
                  {uploadingImages && (
                    <div className="text-sm text-gray-400">Uploading images...</div>
                  )}
                </div>
                <div className="space-y-2">
                  {projectImageFiles.map((file, index) => (
                    <div key={index} className="flex items-center justify-between p-2 bg-secondary/20 rounded">
                      <div className="flex items-center space-x-2">
                        <ImageIcon className="w-4 h-4 text-accent" />
                        <span className="text-white text-sm truncate">{file.name}</span>
                      </div>
                      <button
                        type="button"
                        onClick={() => removeProjectImage(index)}
                        className="text-gray-400 hover:text-red-400"
                      >
                        <X className="w-4 h-4" />
                      </button>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
          </div>

          {/* Alerts */}
          {error && (
            <Alert className="border-red-500/50 bg-red-500/10">
              <AlertDescription className="text-red-300">{error}</AlertDescription>
            </Alert>
          )}

          {success && (
            <Alert className="border-green-500/50 bg-green-500/10">
              <AlertDescription className="text-green-300">{success}</AlertDescription>
            </Alert>
          )}

          {/* Submit Button */}
          <div className="flex justify-end space-x-4">
            <Button
              type="button"
              variant="outline"
              onClick={() => navigate('/admin/projects')}
              className="border-secondary/30 text-gray-400 hover:bg-secondary/20"
            >
              Cancel
            </Button>
            <Button
              type="submit"
              disabled={isSubmitting || uploadingCover || uploadingImages}
              className="bg-accent hover:bg-accent/80 text-primary"
            >
              <Save className="w-4 h-4 mr-2" />
              {isSubmitting ? 'Saving...' : 'Save Project'}
            </Button>
          </div>
        </form>
      </div>
    </AdminLayout>
  );
};

export default AddProject; 