import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Input } from '@/components/ui/input';
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from '@/components/ui/alert-dialog';
import { useToast } from '@/hooks/use-toast';
import { 
  FileText, 
  Plus, 
  Search, 
  Edit, 
  Trash2, 
  Eye,
  ExternalLink,
  Github,
  Loader2
} from 'lucide-react';
import { supabase } from '@/integrations/supabase/client';
import AdminLayout from '@/components/layout/AdminLayout';
import { useProjects } from '@/hooks/usePortfolioData';

const AdminProjects = () => {
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [user, setUser] = useState<any>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');
  const [deletingProjectId, setDeletingProjectId] = useState<string | null>(null);
  const navigate = useNavigate();
  const { data: projects, isLoading: projectsLoading, refetch } = useProjects();
  const { toast } = useToast();

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

  const handleDeleteProject = async (projectId: string, projectTitle: string) => {
    setDeletingProjectId(projectId);
    
    try {
      // First, get the project to find associated images
      const { data: project, error: fetchError } = await supabase
        .from('projects')
        .select('*')
        .eq('id', projectId)
        .single();

      if (fetchError) {
        throw new Error('Failed to fetch project details');
      }

      // Delete images from storage if they exist
      if (project.cover_image) {
        const coverImagePath = project.cover_image.split('/').pop();
        if (coverImagePath) {
          await supabase.storage
            .from('portofolio')
            .remove([`projects/${projectTitle}/${coverImagePath}`]);
        }
      }

      if (project.images && project.images.length > 0) {
        const imagePaths = project.images.map((image: string) => {
          const imageName = image.split('/').pop();
          return `projects/${projectTitle}/${imageName}`;
        });
        
        await supabase.storage
          .from('portofolio')
          .remove(imagePaths);
      }

      // Delete the project from database
      const { error: deleteError } = await supabase
        .from('projects')
        .delete()
        .eq('id', projectId);

      if (deleteError) {
        throw new Error('Failed to delete project from database');
      }

      // Refresh the projects list
      await refetch();

      toast({
        title: "Project deleted successfully",
        description: `${projectTitle} has been permanently deleted.`,
        variant: "default",
      });

    } catch (error) {
      console.error('Error deleting project:', error);
      toast({
        title: "Error deleting project",
        description: error instanceof Error ? error.message : "An unexpected error occurred",
        variant: "destructive",
      });
    } finally {
      setDeletingProjectId(null);
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

  const filteredProjects = projects?.filter(project =>
    project.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
    project.short_desc.toLowerCase().includes(searchTerm.toLowerCase())
  ) || [];

  return (
    <AdminLayout user={user}>
      <div className="space-y-6">
        {/* Header */}
        <div className="flex justify-between items-center">
          <div>
            <h1 className="text-3xl font-bold text-white">Projects Management</h1>
            <p className="text-gray-300">Manage your portfolio projects</p>
          </div>
          <Button 
            className="bg-accent hover:bg-accent/80 text-primary"
            onClick={() => navigate('/admin/projects/add')}
          >
            <Plus className="w-4 h-4 mr-2" />
            Add New Project
          </Button>
        </div>

        {/* Search and Stats */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <Card className="bg-secondary/10 border-secondary/20">
            <CardContent className="p-6">
              <div className="flex items-center space-x-2">
                <Search className="w-4 h-4 text-gray-400" />
                <Input
                  placeholder="Search projects..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="bg-secondary/20 border-secondary/30 text-white placeholder:text-gray-400"
                />
              </div>
            </CardContent>
          </Card>

          <Card className="bg-secondary/10 border-secondary/20">
            <CardContent className="p-6">
              <div className="text-center">
                <div className="text-2xl font-bold text-white">{projects?.length || 0}</div>
                <p className="text-sm text-gray-400">Total Projects</p>
              </div>
            </CardContent>
          </Card>

          <Card className="bg-secondary/10 border-secondary/20">
            <CardContent className="p-6">
              <div className="text-center">
                <div className="text-2xl font-bold text-green-400">
                  {projects?.filter(p => p.demo_link || p.repository_link).length || 0}
                </div>
                <p className="text-sm text-gray-400">With Links</p>
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Projects Grid */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          {projectsLoading ? (
            <div className="col-span-2 text-center py-12">
              <div className="text-lg">Loading projects...</div>
            </div>
          ) : filteredProjects.length === 0 ? (
            <div className="col-span-2 text-center py-12">
              <FileText className="w-12 h-12 text-gray-400 mx-auto mb-4" />
              <h3 className="text-lg font-medium text-white mb-2">No projects found</h3>
              <p className="text-gray-400">Try adjusting your search terms</p>
            </div>
          ) : (
            filteredProjects.map((project) => (
              <Card key={project.id} className="bg-secondary/10 border-secondary/20 hover:bg-secondary/20 transition-colors">
                <CardHeader>
                  <div className="flex items-start justify-between">
                    <div className="flex-1">
                      <CardTitle className="text-white text-lg">{project.title}</CardTitle>
                      <CardDescription className="text-gray-300 mt-2">
                        {project.short_desc}
                      </CardDescription>
                    </div>
                    <div className="flex items-center space-x-2 ml-4">
                      <Button 
                        variant="ghost" 
                        size="sm" 
                        className="text-gray-400 hover:text-white"
                        onClick={() => navigate(`/admin/projects/edit/${project.id}`)}
                      >
                        <Edit className="w-4 h-4" />
                      </Button>
                      
                      <AlertDialog>
                        <AlertDialogTrigger asChild>
                          <Button 
                            variant="ghost" 
                            size="sm" 
                            className="text-gray-400 hover:text-red-400 hover:bg-red-400/10"
                            disabled={deletingProjectId === project.id}
                          >
                            {deletingProjectId === project.id ? (
                              <Loader2 className="w-4 h-4 animate-spin" />
                            ) : (
                              <Trash2 className="w-4 h-4" />
                            )}
                          </Button>
                        </AlertDialogTrigger>
                        <AlertDialogContent className="bg-secondary border-secondary/20">
                          <AlertDialogHeader>
                            <AlertDialogTitle className="text-white">
                              Delete Project
                            </AlertDialogTitle>
                            <AlertDialogDescription className="text-gray-300">
                              Are you sure you want to delete "{project.title}"? This action cannot be undone and will permanently remove the project and all associated images from your portfolio.
                            </AlertDialogDescription>
                          </AlertDialogHeader>
                          <AlertDialogFooter>
                            <AlertDialogCancel className="bg-secondary/20 border-secondary/30 text-gray-300 hover:bg-secondary/30">
                              Cancel
                            </AlertDialogCancel>
                            <AlertDialogAction
                              className="bg-red-600 hover:bg-red-700 text-white"
                              onClick={() => handleDeleteProject(project.id, project.title)}
                            >
                              Delete Project
                            </AlertDialogAction>
                          </AlertDialogFooter>
                        </AlertDialogContent>
                      </AlertDialog>
                    </div>
                  </div>
                </CardHeader>
                <CardContent className="space-y-4">
                  {/* Tech Stack */}
                  <div className="flex flex-wrap gap-2">
                    {project.tech_stack?.slice(0, 3).map((tech, index) => (
                      <Badge key={index} variant="secondary" className="bg-accent/20 text-accent">
                        {tech}
                      </Badge>
                    ))}
                    {project.tech_stack && project.tech_stack.length > 3 && (
                      <Badge variant="secondary" className="bg-secondary/30 text-gray-400">
                        +{project.tech_stack.length - 3} more
                      </Badge>
                    )}
                  </div>

                  {/* Links */}
                  <div className="flex items-center space-x-2">
                    {project.demo_link && (
                      <Button variant="outline" size="sm" className="border-accent text-accent hover:bg-accent hover:text-primary">
                        <ExternalLink className="w-3 h-3 mr-1" />
                        Demo
                      </Button>
                    )}
                    {project.repository_link && (
                      <Button variant="outline" size="sm" className="border-accent text-accent hover:bg-accent hover:text-primary">
                        <Github className="w-3 h-3 mr-1" />
                        Code
                      </Button>
                    )}
                    <Button variant="outline" size="sm" className="border-secondary/30 text-gray-400 hover:bg-secondary/20">
                      <Eye className="w-3 h-3 mr-1" />
                      View
                    </Button>
                  </div>

                  {/* Status */}
                  <div className="flex items-center justify-between pt-2 border-t border-secondary/20">
                    <div className="flex items-center space-x-2">
                      <div className="w-2 h-2 bg-green-400 rounded-full"></div>
                      <span className="text-xs text-gray-400">Published</span>
                    </div>
                    <span className="text-xs text-gray-400">
                      {new Date(project.created_at).toLocaleDateString()}
                    </span>
                  </div>
                </CardContent>
              </Card>
            ))
          )}
        </div>
      </div>
    </AdminLayout>
  );
};

export default AdminProjects; 