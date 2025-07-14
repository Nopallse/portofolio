import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { 
  Mail, 
  Save, 
  Edit, 
  User, 
  MapPin, 
  Phone, 
  Github, 
  Linkedin, 
  Globe, 
  Camera,
  CheckCircle,
  AlertCircle
} from 'lucide-react';
import { supabase } from '@/integrations/supabase/client';
import AdminLayout from '@/components/layout/AdminLayout';

interface ContactInfo {
  id: string;
  email: string;
  phone: string | null;
  location: string | null;
  github: string | null;
  linkedin: string | null;
  portfolio: string | null;
  photo: string | null;
  created_at: string;
  updated_at: string;
}

const AdminContactInfo = () => {
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [user, setUser] = useState<any>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [contactInfo, setContactInfo] = useState<ContactInfo | null>(null);
  const [isEditing, setIsEditing] = useState(false);
  const [isSaving, setIsSaving] = useState(false);
  const [uploadingPhoto, setUploadingPhoto] = useState(false);
  const [photoPreview, setPhotoPreview] = useState<string>('');
  const [selectedPhoto, setSelectedPhoto] = useState<File | null>(null);
  const navigate = useNavigate();

  // Form state
  const [formData, setFormData] = useState({
    email: '',
    phone: '',
    location: '',
    github: '',
    linkedin: '',
    portfolio: '',
    photo: ''
  });

  useEffect(() => {
    // Check current session
    const checkSession = async () => {
      const { data: { session }, error } = await supabase.auth.getSession();
      
      if (session && session.user) {
        setUser(session.user);
        setIsAuthenticated(true);
        fetchContactInfo();
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

  const fetchContactInfo = async () => {
    try {
      const { data, error } = await supabase
        .from('contact_info')
        .select('*')
        .limit(1)
        .single();

      if (error && error.code !== 'PGRST116') { // PGRST116 is "no rows returned"
        throw error;
      }

      if (data) {
        setContactInfo(data);
        setFormData({
          email: data.email || '',
          phone: data.phone || '',
          location: data.location || '',
          github: data.github || '',
          linkedin: data.linkedin || '',
          portfolio: data.portfolio || '',
          photo: data.photo || ''
        });
        setPhotoPreview(data.photo || '');
      }
    } catch (error) {
      console.error('Error fetching contact info:', error);
    }
  };

  const uploadPhoto = async (file: File): Promise<string> => {
    const fileExt = file.name.split('.').pop();
    const fileName = `${Math.random().toString(36).substring(2)}.${fileExt}`;
    const filePath = `profile/${fileName}`;
    const { error: uploadError } = await supabase.storage
      .from('portofolio')
      .upload(filePath, file, { upsert: true });
    if (uploadError) throw uploadError;
    const { data: { publicUrl } } = supabase.storage
      .from('portofolio')
      .getPublicUrl(filePath);
    return publicUrl;
  };

  const handlePhotoChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      setSelectedPhoto(file);
      const reader = new FileReader();
      reader.onload = (e) => {
        setPhotoPreview(e.target?.result as string);
      };
      reader.readAsDataURL(file);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSaving(true);
    try {
      let photoUrl = formData.photo;
      if (selectedPhoto) {
        setUploadingPhoto(true);
        photoUrl = await uploadPhoto(selectedPhoto);
        setUploadingPhoto(false);
      }
      if (contactInfo) {
        // Update existing contact info
        const { error } = await supabase
          .from('contact_info')
          .update({
            ...formData,
            photo: photoUrl,
            updated_at: new Date().toISOString()
          })
          .eq('id', contactInfo.id);
        if (error) throw error;
      } else {
        // Create new contact info
        const { error } = await supabase
          .from('contact_info')
          .insert([{
            ...formData,
            photo: photoUrl,
            created_at: new Date().toISOString(),
            updated_at: new Date().toISOString()
          }]);
        if (error) throw error;
      }
      setIsEditing(false);
      setSelectedPhoto(null);
      fetchContactInfo();
    } catch (error) {
      console.error('Error saving contact info:', error);
    } finally {
      setIsSaving(false);
      setUploadingPhoto(false);
    }
  };

  const handleEdit = () => {
    setIsEditing(true);
  };

  const handleCancel = () => {
    setIsEditing(false);
    setSelectedPhoto(null);
    if (contactInfo) {
      setFormData({
        email: contactInfo.email || '',
        phone: contactInfo.phone || '',
        location: contactInfo.location || '',
        github: contactInfo.github || '',
        linkedin: contactInfo.linkedin || '',
        portfolio: contactInfo.portfolio || '',
        photo: contactInfo.photo || ''
      });
      setPhotoPreview(contactInfo.photo || '');
    }
  };

  const validateEmail = (email: string) => {
    return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email);
  };

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
    return formData.email && 
           validateEmail(formData.email) && 
           validateUrl(formData.github) && 
           validateUrl(formData.linkedin) && 
           validateUrl(formData.portfolio);
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
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-3xl font-bold text-white">Contact Information</h1>
            <p className="text-gray-300">Manage your contact details and social media links</p>
          </div>
          {!isEditing && (
            <Button 
              onClick={handleEdit}
              className="bg-accent hover:bg-accent/80 text-primary"
            >
              <Edit className="w-4 h-4 mr-2" />
              Edit Contact Info
            </Button>
          )}
        </div>

        {/* Contact Info Display/Edit */}
        <Card className="bg-secondary/10 border-secondary/20">
          <CardHeader>
            <CardTitle className="text-white flex items-center">
              <Mail className="w-5 h-5 mr-2 text-accent" />
              Contact Details
            </CardTitle>
            <CardDescription className="text-gray-300">
              {isEditing ? 'Update your contact information below' : 'Your current contact information'}
            </CardDescription>
          </CardHeader>
          <CardContent>
            {isEditing ? (
              <form onSubmit={handleSubmit} className="space-y-6">
                {/* Basic Information */}
                <div className="space-y-4">
                  <h3 className="text-lg font-semibold text-white flex items-center">
                    <User className="w-4 h-4 mr-2 text-accent" />
                    Basic Information
                  </h3>
                  
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div>
                      <Label htmlFor="email" className="text-gray-300">Email Address *</Label>
                      <Input
                        id="email"
                        type="email"
                        value={formData.email}
                        onChange={(e) => setFormData({...formData, email: e.target.value})}
                        required
                        className="bg-secondary/20 border-secondary/30 text-white"
                        placeholder="your.email@example.com"
                      />
                      {formData.email && !validateEmail(formData.email) && (
                        <p className="text-red-400 text-sm mt-1 flex items-center">
                          <AlertCircle className="w-3 h-3 mr-1" />
                          Please enter a valid email address
                        </p>
                      )}
                    </div>
                    
                    <div>
                      <Label htmlFor="phone" className="text-gray-300">Phone Number</Label>
                      <Input
                        id="phone"
                        type="tel"
                        value={formData.phone}
                        onChange={(e) => setFormData({...formData, phone: e.target.value})}
                        className="bg-secondary/20 border-secondary/30 text-white"
                        placeholder="+1 (555) 123-4567"
                      />
                    </div>
                  </div>

                  <div>
                    <Label htmlFor="location" className="text-gray-300">Location</Label>
                    <Input
                      id="location"
                      value={formData.location}
                      onChange={(e) => setFormData({...formData, location: e.target.value})}
                      className="bg-secondary/20 border-secondary/30 text-white"
                      placeholder="City, Country"
                    />
                  </div>
                </div>

                {/* Social Media Links */}
                <div className="space-y-4">
                  <h3 className="text-lg font-semibold text-white flex items-center">
                    <Globe className="w-4 h-4 mr-2 text-accent" />
                    Social Media & Links
                  </h3>
                  
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div>
                      <Label htmlFor="github" className="text-gray-300 flex items-center">
                        <Github className="w-4 h-4 mr-2" />
                        GitHub Profile
                      </Label>
                      <Input
                        id="github"
                        type="url"
                        value={formData.github}
                        onChange={(e) => setFormData({...formData, github: e.target.value})}
                        className="bg-secondary/20 border-secondary/30 text-white"
                        placeholder="https://github.com/username"
                      />
                      {formData.github && !validateUrl(formData.github) && (
                        <p className="text-red-400 text-sm mt-1 flex items-center">
                          <AlertCircle className="w-3 h-3 mr-1" />
                          Please enter a valid URL
                        </p>
                      )}
                    </div>
                    
                    <div>
                      <Label htmlFor="linkedin" className="text-gray-300 flex items-center">
                        <Linkedin className="w-4 h-4 mr-2" />
                        LinkedIn Profile
                      </Label>
                      <Input
                        id="linkedin"
                        type="url"
                        value={formData.linkedin}
                        onChange={(e) => setFormData({...formData, linkedin: e.target.value})}
                        className="bg-secondary/20 border-secondary/30 text-white"
                        placeholder="https://linkedin.com/in/username"
                      />
                      {formData.linkedin && !validateUrl(formData.linkedin) && (
                        <p className="text-red-400 text-sm mt-1 flex items-center">
                          <AlertCircle className="w-3 h-3 mr-1" />
                          Please enter a valid URL
                        </p>
                      )}
                    </div>
                  </div>

                  <div>
                    <Label htmlFor="portfolio" className="text-gray-300">Portfolio Website</Label>
                    <Input
                      id="portfolio"
                      type="url"
                      value={formData.portfolio}
                      onChange={(e) => setFormData({...formData, portfolio: e.target.value})}
                      className="bg-secondary/20 border-secondary/30 text-white"
                      placeholder="https://your-portfolio.com"
                    />
                    {formData.portfolio && !validateUrl(formData.portfolio) && (
                      <p className="text-red-400 text-sm mt-1 flex items-center">
                        <AlertCircle className="w-3 h-3 mr-1" />
                        Please enter a valid URL
                      </p>
                    )}
                  </div>
                </div>

                {/* Profile Photo */}
                <div className="space-y-4">
                  <h3 className="text-lg font-semibold text-white flex items-center">
                    <Camera className="w-4 h-4 mr-2 text-accent" />
                    Profile Photo
                  </h3>
                  
                  <div>
                    <Label htmlFor="photo" className="text-gray-300">Upload Photo</Label>
                    <Input
                      id="photo"
                      type="file"
                      accept="image/*"
                      onChange={handlePhotoChange}
                      className="bg-secondary/20 border-secondary/30 text-white file:mr-4 file:py-2 file:px-4 file:rounded-full file:border-0 file:text-sm file:font-semibold file:bg-accent file:text-primary hover:file:bg-accent/80"
                    />
                    {uploadingPhoto && (
                      <p className="text-gray-400 text-sm mt-1 flex items-center">
                        <div className="w-4 h-4 border-2 border-primary border-t-transparent rounded-full animate-spin mr-2" />
                        Uploading photo...
                      </p>
                    )}
                  </div>

                  {(photoPreview || formData.photo) && (
                    <div className="flex items-center space-x-4">
                      <img 
                        src={photoPreview || formData.photo} 
                        alt="Profile preview" 
                        className="w-16 h-16 rounded-full object-cover border-2 border-accent/30"
                        onError={(e) => {
                          e.currentTarget.style.display = 'none';
                        }}
                      />
                      <div className="text-sm text-gray-300">
                        <p>Photo preview</p>
                        <p className="text-xs text-gray-400">Make sure the image is accessible</p>
                      </div>
                    </div>
                  )}
                </div>

                {/* Action Buttons */}
                <div className="flex gap-2 pt-4">
                  <Button 
                    type="submit" 
                    disabled={!isFormValid() || isSaving || uploadingPhoto}
                    className="bg-accent hover:bg-accent/80 text-primary disabled:opacity-50"
                  >
                    {isSaving || uploadingPhoto ? (
                      <>
                        <div className="w-4 h-4 border-2 border-primary border-t-transparent rounded-full animate-spin mr-2" />
                        Saving...
                      </>
                    ) : (
                      <>
                        <Save className="w-4 h-4 mr-2" />
                        Save Changes
                      </>
                    )}
                  </Button>
                  <Button 
                    type="button" 
                    variant="outline"
                    onClick={handleCancel}
                    className="border-secondary/30 text-gray-300"
                  >
                    Cancel
                  </Button>
                </div>
              </form>
            ) : (
              <div className="space-y-6">
                {/* Basic Information Display */}
                <div className="space-y-4">
                  <h3 className="text-lg font-semibold text-white flex items-center">
                    <User className="w-4 h-4 mr-2 text-accent" />
                    Basic Information
                  </h3>
                  
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div className="flex items-center space-x-3">
                      <Mail className="w-5 h-5 text-accent" />
                      <div>
                        <p className="text-sm text-gray-400">Email</p>
                        <p className="text-white">{contactInfo?.email || 'Not set'}</p>
                      </div>
                    </div>
                    
                    <div className="flex items-center space-x-3">
                      <Phone className="w-5 h-5 text-accent" />
                      <div>
                        <p className="text-sm text-gray-400">Phone</p>
                        <p className="text-white">{contactInfo?.phone || 'Not set'}</p>
                      </div>
                    </div>
                  </div>

                  <div className="flex items-center space-x-3">
                    <MapPin className="w-5 h-5 text-accent" />
                    <div>
                      <p className="text-sm text-gray-400">Location</p>
                      <p className="text-white">{contactInfo?.location || 'Not set'}</p>
                    </div>
                  </div>
                </div>

                {/* Social Media Links Display */}
                <div className="space-y-4">
                  <h3 className="text-lg font-semibold text-white flex items-center">
                    <Globe className="w-4 h-4 mr-2 text-accent" />
                    Social Media & Links
                  </h3>
                  
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div className="flex items-center space-x-3">
                      <Github className="w-5 h-5 text-accent" />
                      <div className="flex-1">
                        <p className="text-sm text-gray-400">GitHub</p>
                        {contactInfo?.github ? (
                          <a 
                            href={contactInfo.github} 
                            target="_blank" 
                            rel="noopener noreferrer"
                            className="text-blue-400 hover:text-blue-300 transition-colors"
                          >
                            {contactInfo.github}
                          </a>
                        ) : (
                          <p className="text-gray-500">Not set</p>
                        )}
                      </div>
                    </div>
                    
                    <div className="flex items-center space-x-3">
                      <Linkedin className="w-5 h-5 text-accent" />
                      <div className="flex-1">
                        <p className="text-sm text-gray-400">LinkedIn</p>
                        {contactInfo?.linkedin ? (
                          <a 
                            href={contactInfo.linkedin} 
                            target="_blank" 
                            rel="noopener noreferrer"
                            className="text-blue-400 hover:text-blue-300 transition-colors"
                          >
                            {contactInfo.linkedin}
                          </a>
                        ) : (
                          <p className="text-gray-500">Not set</p>
                        )}
                      </div>
                    </div>
                  </div>

                  <div className="flex items-center space-x-3">
                    <Globe className="w-5 h-5 text-accent" />
                    <div className="flex-1">
                      <p className="text-sm text-gray-400">Portfolio</p>
                      {contactInfo?.portfolio ? (
                        <a 
                          href={contactInfo.portfolio} 
                          target="_blank" 
                          rel="noopener noreferrer"
                          className="text-blue-400 hover:text-blue-300 transition-colors"
                        >
                          {contactInfo.portfolio}
                        </a>
                      ) : (
                        <p className="text-gray-500">Not set</p>
                      )}
                    </div>
                  </div>
                </div>

                {/* Profile Photo Display */}
                {contactInfo?.photo && (
                  <div className="space-y-4">
                    <h3 className="text-lg font-semibold text-white flex items-center">
                      <Camera className="w-4 h-4 mr-2 text-accent" />
                      Profile Photo
                    </h3>
                    
                    <div className="flex items-center space-x-4">
                      <img 
                        src={contactInfo.photo} 
                        alt="Profile" 
                        className="w-20 h-20 rounded-full object-cover border-2 border-accent/30"
                        onError={(e) => {
                          e.currentTarget.style.display = 'none';
                        }}
                      />
                      <div>
                        <p className="text-sm text-gray-400">Current photo</p>
                        <a 
                          href={contactInfo.photo} 
                          target="_blank" 
                          rel="noopener noreferrer"
                          className="text-blue-400 hover:text-blue-300 transition-colors text-sm"
                        >
                          View full size
                        </a>
                      </div>
                    </div>
                  </div>
                )}

                {/* Last Updated */}
                {contactInfo?.updated_at && (
                  <div className="pt-4 border-t border-secondary/20">
                    <p className="text-xs text-gray-400">
                      Last updated: {new Date(contactInfo.updated_at).toLocaleString()}
                    </p>
                  </div>
                )}
              </div>
            )}
          </CardContent>
        </Card>
      </div>
    </AdminLayout>
  );
};

export default AdminContactInfo; 