import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { 
  Award, 
  Plus, 
  Edit, 
  Trash2, 
  Search, 
  Upload,
  ExternalLink,
  Image as ImageIcon
} from 'lucide-react';
import { supabase } from '@/integrations/supabase/client';
import AdminLayout from '@/components/layout/AdminLayout';

interface Certificate {
  id: string;
  title: string;
  issuer: string;
  image: string;
  credential_link?: string;
  created_at: string;
  updated_at: string;
}

const AdminCertificates = () => {
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [user, setUser] = useState<any>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [certificates, setCertificates] = useState<Certificate[]>([]);
  const [isAdding, setIsAdding] = useState(false);
  const [editingCertificate, setEditingCertificate] = useState<Certificate | null>(null);
  const [searchTerm, setSearchTerm] = useState('');
  const [uploadingImage, setUploadingImage] = useState(false);
  const navigate = useNavigate();

  // Form state
  const [formData, setFormData] = useState({
    title: '',
    issuer: '',
    image: '',
    credential_link: ''
  });

  // File upload state
  const [selectedFile, setSelectedFile] = useState<File | null>(null);
  const [imagePreview, setImagePreview] = useState<string>('');

  useEffect(() => {
    // Check current session
    const checkSession = async () => {
      const { data: { session }, error } = await supabase.auth.getSession();
      
      if (session && session.user) {
        setUser(session.user);
        setIsAuthenticated(true);
        fetchCertificates();
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

  const fetchCertificates = async () => {
    try {
      const { data, error } = await supabase
        .from('certificates')
        .select('*')
        .order('created_at', { ascending: false });

      if (error) throw error;
      setCertificates(data || []);
    } catch (error) {
      console.error('Error fetching certificates:', error);
    }
  };

  const uploadImage = async (file: File): Promise<string> => {
    const fileExt = file.name.split('.').pop();
    const fileName = `${Math.random().toString(36).substring(2)}.${fileExt}`;
    const filePath = `certificates/${fileName}`;

    const { error: uploadError } = await supabase.storage
      .from('portofolio')
      .upload(filePath, file);

    if (uploadError) {
      throw uploadError;
    }

    const { data: { publicUrl } } = supabase.storage
      .from('portofolio')
      .getPublicUrl(filePath);

    return publicUrl;
  };

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      setSelectedFile(file);
      const reader = new FileReader();
      reader.onload = (e) => {
        setImagePreview(e.target?.result as string);
      };
      reader.readAsDataURL(file);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    try {
      let imageUrl = formData.image;

      // Upload new image if selected
      if (selectedFile) {
        setUploadingImage(true);
        imageUrl = await uploadImage(selectedFile);
        setUploadingImage(false);
      }

      if (editingCertificate) {
        // Update existing certificate
        const { error } = await supabase
          .from('certificates')
          .update({
            title: formData.title,
            issuer: formData.issuer,
            image: imageUrl,
            credential_link: formData.credential_link || null,
            updated_at: new Date().toISOString()
          })
          .eq('id', editingCertificate.id);

        if (error) throw error;
        setEditingCertificate(null);
      } else {
        // Add new certificate
        const { error } = await supabase
          .from('certificates')
          .insert([{
            title: formData.title,
            issuer: formData.issuer,
            image: imageUrl,
            credential_link: formData.credential_link || null,
            created_at: new Date().toISOString(),
            updated_at: new Date().toISOString()
          }]);

        if (error) throw error;
        setIsAdding(false);
      }

      // Reset form
      setFormData({
        title: '',
        issuer: '',
        image: '',
        credential_link: ''
      });
      setSelectedFile(null);
      setImagePreview('');

      fetchCertificates();
    } catch (error) {
      console.error('Error saving certificate:', error);
      setUploadingImage(false);
    }
  };

  const handleDelete = async (id: string) => {
    if (window.confirm('Are you sure you want to delete this certificate?')) {
      try {
        const { error } = await supabase
          .from('certificates')
          .delete()
          .eq('id', id);

        if (error) throw error;
        fetchCertificates();
      } catch (error) {
        console.error('Error deleting certificate:', error);
      }
    }
  };

  const handleEdit = (certificate: Certificate) => {
    setEditingCertificate(certificate);
    setFormData({
      title: certificate.title,
      issuer: certificate.issuer,
      image: certificate.image,
      credential_link: certificate.credential_link || ''
    });
    setImagePreview(certificate.image);
    setSelectedFile(null);
  };

  const filteredCertificates = certificates.filter(certificate => {
    const matchesSearch = certificate.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         certificate.issuer.toLowerCase().includes(searchTerm.toLowerCase());
    
    return matchesSearch;
  });

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
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-3xl font-bold text-white">Certificates</h1>
            <p className="text-gray-300">Manage your professional certificates and achievements</p>
          </div>
          <Button 
            onClick={() => setIsAdding(true)}
            className="bg-accent hover:bg-accent/80 text-primary"
          >
            <Plus className="w-4 h-4 mr-2" />
            Add Certificate
          </Button>
        </div>

        {/* Search */}
        <Card className="bg-secondary/10 border-secondary/20">
          <CardContent className="p-6">
            <div className="relative">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4" />
              <Input
                placeholder="Search certificates..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="pl-10 bg-secondary/20 border-secondary/30 text-white placeholder-gray-400"
              />
            </div>
          </CardContent>
        </Card>

        {/* Add/Edit Form */}
        {(isAdding || editingCertificate) && (
          <Card className="bg-secondary/10 border-secondary/20">
            <CardHeader>
              <CardTitle className="text-white">
                {editingCertificate ? 'Edit Certificate' : 'Add New Certificate'}
              </CardTitle>
            </CardHeader>
            <CardContent>
              <form onSubmit={handleSubmit} className="space-y-4">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <Label htmlFor="title" className="text-gray-300">Title *</Label>
                    <Input
                      id="title"
                      value={formData.title}
                      onChange={(e) => setFormData({...formData, title: e.target.value})}
                      required
                      className="bg-secondary/20 border-secondary/30 text-white"
                    />
                  </div>
                  <div>
                    <Label htmlFor="issuer" className="text-gray-300">Issuer *</Label>
                    <Input
                      id="issuer"
                      value={formData.issuer}
                      onChange={(e) => setFormData({...formData, issuer: e.target.value})}
                      required
                      className="bg-secondary/20 border-secondary/30 text-white"
                    />
                  </div>
                </div>
                
                <div>
                  <Label htmlFor="credential_link" className="text-gray-300">Credential Link</Label>
                  <Input
                    id="credential_link"
                    type="url"
                    value={formData.credential_link}
                    onChange={(e) => setFormData({...formData, credential_link: e.target.value})}
                    placeholder="https://..."
                    className="bg-secondary/20 border-secondary/30 text-white"
                  />
                </div>

                <div>
                  <Label htmlFor="image" className="text-gray-300">Certificate Image *</Label>
                  <div className="space-y-3">
                    <div className="flex items-center space-x-2">
                      <Input
                        id="image"
                        type="file"
                        accept="image/*"
                        onChange={handleFileChange}
                        className="bg-secondary/20 border-secondary/30 text-white file:mr-4 file:py-2 file:px-4 file:rounded-full file:border-0 file:text-sm file:font-semibold file:bg-accent file:text-primary hover:file:bg-accent/80"
                      />
                      {uploadingImage && (
                        <div className="text-sm text-gray-400">Uploading...</div>
                      )}
                    </div>
                    
                    {(imagePreview || formData.image) && (
                      <div className="relative w-32 h-32 border border-secondary/30 rounded-lg overflow-hidden">
                        <img
                          src={imagePreview || formData.image}
                          alt="Certificate preview"
                          className="w-full h-full object-cover"
                        />
                      </div>
                    )}
                  </div>
                </div>

                <div className="flex gap-2">
                  <Button 
                    type="submit" 
                    className="bg-accent hover:bg-accent/80 text-primary"
                    disabled={uploadingImage}
                  >
                    {uploadingImage ? 'Uploading...' : (editingCertificate ? 'Update Certificate' : 'Add Certificate')}
                  </Button>
                  <Button 
                    type="button" 
                    variant="outline"
                    onClick={() => {
                      setIsAdding(false);
                      setEditingCertificate(null);
                      setFormData({
                        title: '',
                        issuer: '',
                        image: '',
                        credential_link: ''
                      });
                      setSelectedFile(null);
                      setImagePreview('');
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

        {/* Certificates List */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {filteredCertificates.map((certificate) => (
            <Card key={certificate.id} className="bg-secondary/10 border-secondary/20 hover:bg-secondary/20 transition-colors">
              <CardHeader>
                <div className="flex items-start justify-between">
                  <div className="flex items-center space-x-2">
                    <Award className="w-5 h-5 text-accent" />
                  </div>
                  <div className="flex space-x-1">
                    <Button
                      size="sm"
                      variant="ghost"
                      onClick={() => handleEdit(certificate)}
                      className="text-gray-400 hover:text-white hover:bg-secondary/30"
                    >
                      <Edit className="w-4 h-4" />
                    </Button>
                    <Button
                      size="sm"
                      variant="ghost"
                      onClick={() => handleDelete(certificate.id)}
                      className="text-red-400 hover:text-red-300 hover:bg-red-500/20"
                    >
                      <Trash2 className="w-4 h-4" />
                    </Button>
                  </div>
                </div>
                <CardTitle className="text-white text-lg">{certificate.title}</CardTitle>
                <CardDescription className="text-gray-300">{certificate.issuer}</CardDescription>
              </CardHeader>
              <CardContent className="space-y-3">
                <div className="relative w-full h-48 border border-secondary/30 rounded-lg overflow-hidden">
                  <img
                    src={certificate.image}
                    alt={certificate.title}
                    className="w-full h-full object-cover"
                  />
                </div>
                
                {certificate.credential_link && (
                  <Button 
                    size="sm" 
                    variant="outline" 
                    className="w-full border-secondary/30 text-gray-300 hover:bg-secondary/20"
                    onClick={() => window.open(certificate.credential_link, '_blank')}
                  >
                    <ExternalLink className="w-4 h-4 mr-1" />
                    View Credential
                  </Button>
                )}
              </CardContent>
            </Card>
          ))}
        </div>

        {filteredCertificates.length === 0 && (
          <Card className="bg-secondary/10 border-secondary/20">
            <CardContent className="p-12 text-center">
              <Award className="w-12 h-12 text-gray-400 mx-auto mb-4" />
              <h3 className="text-lg font-medium text-gray-300 mb-2">No certificates found</h3>
              <p className="text-gray-400 mb-4">
                {searchTerm 
                  ? 'Try adjusting your search criteria.'
                  : 'Get started by adding your first certificate.'
                }
              </p>
              {!searchTerm && (
                <Button onClick={() => setIsAdding(true)} className="bg-accent hover:bg-accent/80 text-primary">
                  <Plus className="w-4 h-4 mr-2" />
                  Add Certificate
                </Button>
              )}
            </CardContent>
          </Card>
        )}
      </div>
    </AdminLayout>
  );
};

export default AdminCertificates; 