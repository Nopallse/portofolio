import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { 
  GraduationCap, 
  Plus, 
  Edit, 
  Trash2, 
  Search, 
  Calendar,
  MapPin,
  Building,
  BookOpen,
  Image as ImageIcon,
  ExternalLink
} from 'lucide-react';
import { supabase } from '@/integrations/supabase/client';
import AdminLayout from '@/components/layout/AdminLayout';
import { COLORS } from '@/utils/designTokens';

interface Education {
  id: string;
  institution: string;
  degree: string;
  date_range: string;
  location: string;
  image: string;
  created_at: string;
  updated_at: string;
}

const AdminEducation = () => {
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [user, setUser] = useState<any>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [education, setEducation] = useState<Education[]>([]);
  const [isAdding, setIsAdding] = useState(false);
  const [editingEducation, setEditingEducation] = useState<Education | null>(null);
  const [searchTerm, setSearchTerm] = useState('');
  const navigate = useNavigate();

  // Form state
  const [formData, setFormData] = useState({
    institution: '',
    degree: '',
    date_range: '',
    location: '',
    image: ''
  });

  useEffect(() => {
    // Check current session
    const checkSession = async () => {
      const { data: { session }, error } = await supabase.auth.getSession();
      
      if (session && session.user) {
        setUser(session.user);
        setIsAuthenticated(true);
        fetchEducation();
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

  const fetchEducation = async () => {
    try {
      const { data, error } = await supabase
        .from('education')
        .select('*')
        .order('created_at', { ascending: false });

      if (error) throw error;
      setEducation(data || []);
    } catch (error) {
      console.error('Error fetching education:', error);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    try {
      if (editingEducation) {
        // Update existing education
        const { error } = await supabase
          .from('education')
          .update({
            ...formData,
            updated_at: new Date().toISOString()
          })
          .eq('id', editingEducation.id);

        if (error) throw error;
        setEditingEducation(null);
      } else {
        // Add new education
        const { error } = await supabase
          .from('education')
          .insert([{
            ...formData,
            created_at: new Date().toISOString(),
            updated_at: new Date().toISOString()
          }]);

        if (error) throw error;
        setIsAdding(false);
      }

      // Reset form
      setFormData({
        institution: '',
        degree: '',
        date_range: '',
        location: '',
        image: ''
      });

      fetchEducation();
    } catch (error) {
      console.error('Error saving education:', error);
    }
  };

  const handleDelete = async (id: string) => {
    if (window.confirm('Are you sure you want to delete this education record?')) {
      try {
        const { error } = await supabase
          .from('education')
          .delete()
          .eq('id', id);

        if (error) throw error;
        fetchEducation();
      } catch (error) {
        console.error('Error deleting education:', error);
      }
    }
  };

  const handleEdit = (educationItem: Education) => {
    setEditingEducation(educationItem);
    setFormData({
      institution: educationItem.institution,
      degree: educationItem.degree,
      date_range: educationItem.date_range,
      location: educationItem.location,
      image: educationItem.image
    });
  };

  const filteredEducation = education.filter(item => {
    const matchesSearch = item.institution.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         item.degree.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         item.location.toLowerCase().includes(searchTerm.toLowerCase());
    
    return matchesSearch;
  });

  const validateUrl = (url: string) => {
    if (!url) return true;
    try {
      new URL(url);
      return true;
    } catch {
      return false;
    }
  };

  const isFormValid = () => {
    return formData.institution && 
           formData.degree && 
           formData.date_range && 
           formData.location &&
           validateUrl(formData.image);
  };

  if (isLoading) {
    return (
      <div className="min-h-screen text-white flex items-center justify-center" style={{ backgroundColor: COLORS.primary }}>
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
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-3xl font-bold text-white">Education</h1>
            <p className="text-gray-300">Manage your educational background and qualifications</p>
          </div>
          <Button 
            onClick={() => setIsAdding(true)}
            style={{
              backgroundColor: COLORS.accent.primary,
              color: COLORS.primary
            }}
            className="hover:opacity-80"
          >
            <Plus className="w-4 h-4 mr-2" />
            Add Education
          </Button>
        </div>

        {/* Search */}
        <Card style={{
          backgroundColor: COLORS.glass.background,
          border: `${COLORS.glass.outline.width}px ${COLORS.glass.outline.style} ${COLORS.glass.outline.color}`,
          backdropFilter: `blur(${COLORS.glass.blur.radius}px)`
        }}>
          <CardContent className="p-6">
            <div className="relative">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4" />
              <Input
                placeholder="Search education records..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="pl-10"
                style={{
                  backgroundColor: COLORS.secondary,
                  borderColor: COLORS.gray[600],
                  color: COLORS.text
                }}
              />
            </div>
          </CardContent>
        </Card>

        {/* Add/Edit Form */}
        {(isAdding || editingEducation) && (
          <Card style={{
            backgroundColor: COLORS.glass.background,
            border: `${COLORS.glass.outline.width}px ${COLORS.glass.outline.style} ${COLORS.glass.outline.color}`,
            backdropFilter: `blur(${COLORS.glass.blur.radius}px)`
          }}>
            <CardHeader>
              <CardTitle className="text-white">
                {editingEducation ? 'Edit Education' : 'Add New Education'}
              </CardTitle>
            </CardHeader>
            <CardContent>
              <form onSubmit={handleSubmit} className="space-y-4">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <Label htmlFor="institution" className="text-gray-300">Institution *</Label>
                    <Input
                      id="institution"
                      value={formData.institution}
                      onChange={(e) => setFormData({...formData, institution: e.target.value})}
                      required
                      className="bg-secondary/20 border-secondary/30 text-white"
                      placeholder="University Name"
                    />
                  </div>
                  <div>
                    <Label htmlFor="degree" className="text-gray-300">Degree *</Label>
                    <Input
                      id="degree"
                      value={formData.degree}
                      onChange={(e) => setFormData({...formData, degree: e.target.value})}
                      required
                      className="bg-secondary/20 border-secondary/30 text-white"
                      placeholder="Bachelor of Science"
                    />
                  </div>
                  <div>
                    <Label htmlFor="date_range" className="text-gray-300">Date Range *</Label>
                    <Input
                      id="date_range"
                      value={formData.date_range}
                      onChange={(e) => setFormData({...formData, date_range: e.target.value})}
                      required
                      className="bg-secondary/20 border-secondary/30 text-white"
                      placeholder="2020 - 2024"
                    />
                  </div>
                  <div>
                    <Label htmlFor="location" className="text-gray-300">Location *</Label>
                    <Input
                      id="location"
                      value={formData.location}
                      onChange={(e) => setFormData({...formData, location: e.target.value})}
                      required
                      className="bg-secondary/20 border-secondary/30 text-white"
                      placeholder="City, Country"
                    />
                  </div>
                </div>
                <div>
                  <Label htmlFor="image" className="text-gray-300">Institution Logo URL</Label>
                  <Input
                    id="image"
                    type="url"
                    value={formData.image}
                    onChange={(e) => setFormData({...formData, image: e.target.value})}
                    className="bg-secondary/20 border-secondary/30 text-white"
                    placeholder="https://example.com/logo.png"
                  />
                  {formData.image && !validateUrl(formData.image) && (
                    <p className="text-red-400 text-sm mt-1">Please enter a valid URL</p>
                  )}
                </div>
                <div className="flex gap-2">
                  <Button 
                    type="submit" 
                    disabled={!isFormValid()}
                    style={{
                      backgroundColor: COLORS.accent.primary,
                      color: COLORS.primary
                    }}
                    className="disabled:opacity-50"
                  >
                    {editingEducation ? 'Update Education' : 'Add Education'}
                  </Button>
                  <Button 
                    type="button" 
                    variant="outline"
                    onClick={() => {
                      setIsAdding(false);
                      setEditingEducation(null);
                      setFormData({
                        institution: '',
                        degree: '',
                        date_range: '',
                        location: '',
                        image: ''
                      });
                    }}
                    className="border-secondary/30 text-gray-300"
                  >
                    Cancel
                  </Button>
                </div>
              </form>
            </CardContent>
          </Card>
        )}

        {/* Education List */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {filteredEducation.map((item) => (
            <Card key={item.id} style={{
              backgroundColor: COLORS.glass.background,
              border: `${COLORS.glass.outline.width}px ${COLORS.glass.outline.style} ${COLORS.glass.outline.color}`,
              backdropFilter: `blur(${COLORS.glass.blur.radius}px)`
            }} className="hover:bg-secondary/20 transition-colors">
              <CardHeader>
                <div className="flex items-start justify-between">
                  <div className="flex items-center space-x-2">
                    <GraduationCap className="w-5 h-5" style={{ color: COLORS.accent.primary }} />
                    <Badge variant="secondary" className="bg-accent/20 text-accent border-accent/30">
                      Education
                    </Badge>
                  </div>
                  <div className="flex space-x-1">
                    <Button
                      size="sm"
                      variant="ghost"
                      onClick={() => handleEdit(item)}
                      className="text-gray-400 hover:text-white hover:bg-secondary/30"
                    >
                      <Edit className="w-4 h-4" />
                    </Button>
                    <Button
                      size="sm"
                      variant="ghost"
                      onClick={() => handleDelete(item.id)}
                      className="text-red-400 hover:text-red-300 hover:bg-red-500/20"
                    >
                      <Trash2 className="w-4 h-4" />
                    </Button>
                  </div>
                </div>
                <CardTitle className="text-white text-lg">{item.degree}</CardTitle>
                <CardDescription className="text-gray-300">{item.institution}</CardDescription>
              </CardHeader>
              <CardContent className="space-y-3">
                <div className="flex items-center space-x-2 text-sm text-gray-400">
                  <Calendar className="w-4 h-4" />
                  <span>{item.date_range}</span>
                </div>
                <div className="flex items-center space-x-2 text-sm text-gray-400">
                  <MapPin className="w-4 h-4" />
                  <span>{item.location}</span>
                </div>
                {item.image && (
                  <div className="flex items-center space-x-2">
                    <img 
                      src={item.image} 
                      alt={item.institution}
                      className="w-8 h-8 rounded object-cover"
                      onError={(e) => {
                        e.currentTarget.style.display = 'none';
                      }}
                    />
                    <Button size="sm" variant="outline" className="border-secondary/30 text-gray-300 hover:bg-secondary/20">
                      <ExternalLink className="w-4 h-4 mr-1" />
                      View Logo
                    </Button>
                  </div>
                )}
              </CardContent>
            </Card>
          ))}
        </div>

        {filteredEducation.length === 0 && (
          <Card style={{
            backgroundColor: COLORS.glass.background,
            border: `${COLORS.glass.outline.width}px ${COLORS.glass.outline.style} ${COLORS.glass.outline.color}`,
            backdropFilter: `blur(${COLORS.glass.blur.radius}px)`
          }}>
            <CardContent className="p-12 text-center">
              <GraduationCap className="w-12 h-12 mx-auto mb-4" style={{ color: COLORS.gray[400] }} />
              <h3 className="text-lg font-medium text-gray-300 mb-2">No education records found</h3>
              <p className="text-gray-400 mb-4">
                {searchTerm 
                  ? 'Try adjusting your search criteria.'
                  : 'Get started by adding your first education record.'
                }
              </p>
              {!searchTerm && (
                <Button 
                  onClick={() => setIsAdding(true)} 
                  style={{
                    backgroundColor: COLORS.accent.primary,
                    color: COLORS.primary
                  }}
                  className="hover:opacity-80"
                >
                  <Plus className="w-4 h-4 mr-2" />
                  Add Education
                </Button>
              )}
            </CardContent>
          </Card>
        )}
      </div>
    </AdminLayout>
  );
};

export default AdminEducation; 