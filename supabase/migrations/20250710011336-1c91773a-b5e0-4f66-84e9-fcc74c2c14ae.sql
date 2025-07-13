
-- Create projects table
CREATE TABLE public.projects (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  title TEXT NOT NULL,
  short_desc TEXT NOT NULL,
  full_desc TEXT NOT NULL,
  cover_image TEXT NOT NULL,
  images TEXT[] NOT NULL DEFAULT '{}',
  tech_stack TEXT[] NOT NULL DEFAULT '{}',
  features TEXT[] NOT NULL DEFAULT '{}',
  repository_link TEXT,
  demo_link TEXT,
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  updated_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

-- Create experience table
CREATE TABLE public.experience (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  title TEXT NOT NULL,
  description TEXT NOT NULL,
  date_range TEXT NOT NULL,
  location TEXT NOT NULL,
  image TEXT NOT NULL,
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  updated_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

-- Create certificates table
CREATE TABLE public.certificates (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  title TEXT NOT NULL,
  issuer TEXT NOT NULL,
  image TEXT NOT NULL,
  credential_link TEXT,
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  updated_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

-- Create skills table
CREATE TABLE public.skills (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  category TEXT NOT NULL,
  items TEXT[] NOT NULL DEFAULT '{}',
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  updated_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

-- Create education table
CREATE TABLE public.education (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  institution TEXT NOT NULL,
  degree TEXT NOT NULL,
  date_range TEXT NOT NULL,
  location TEXT NOT NULL,
  image TEXT NOT NULL,
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  updated_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

-- Create contact info table (single row for portfolio owner)
CREATE TABLE public.contact_info (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  email TEXT NOT NULL,
  phone TEXT,
  location TEXT,
  linkedin TEXT,
  github TEXT,
  portfolio TEXT,
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  updated_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

-- Insert sample data based on your portfolio
INSERT INTO public.projects (title, short_desc, full_desc, cover_image, images, tech_stack, features, repository_link, demo_link) VALUES
('E-Commerce Platform', 'A full-featured online shopping platform with cart and checkout functionality.', 'A comprehensive e-commerce solution built with modern technologies. This platform offers a seamless shopping experience with intuitive navigation, product search, filtering, user accounts, cart management, and secure checkout.', 'https://images.unsplash.com/photo-1556742049-0cfed4f6a45d?w=800&h=600&fit=crop', ARRAY['https://images.unsplash.com/photo-1556742049-0cfed4f6a45d?w=800&h=600&fit=crop', 'https://images.unsplash.com/photo-1563013544-824ae1b704d3?w=800&h=600&fit=crop', 'https://images.unsplash.com/photo-1556742212-5b321f3c261b?w=800&h=600&fit=crop'], ARRAY['React', 'Node.js', 'Express', 'MongoDB', 'Stripe API'], ARRAY['User authentication and profiles', 'Product catalog with categories and filters', 'Shopping cart and wishlist functionality', 'Secure payment processing', 'Order tracking and history', 'Admin dashboard for product management'], 'https://github.com/username/ecommerce-platform', 'https://ecommerce-demo.vercel.app'),
('Task Management App', 'A collaborative task management application with real-time updates.', 'A powerful task management solution designed for teams and individuals. Features real-time collaboration, project organization, deadline tracking, and comprehensive reporting capabilities.', 'https://images.unsplash.com/photo-1611224923853-80b023f02d71?w=800&h=600&fit=crop', ARRAY['https://images.unsplash.com/photo-1611224923853-80b023f02d71?w=800&h=600&fit=crop', 'https://images.unsplash.com/photo-1454165804606-c3d57bc86b40?w=800&h=600&fit=crop'], ARRAY['React', 'Firebase', 'Material-UI', 'Socket.io'], ARRAY['Real-time collaboration', 'Project and task organization', 'Deadline and priority management', 'Team member assignment', 'Progress tracking and analytics', 'Mobile responsive design'], 'https://github.com/username/task-manager', 'https://task-manager-demo.vercel.app'),
('Weather Forecast App', 'A modern weather application with location-based forecasts.', 'An intuitive weather application that provides accurate forecasts, weather alerts, and location-based services. Built with modern UI/UX principles and real-time data integration.', 'https://images.unsplash.com/photo-1504608524841-42fe6f032b4b?w=800&h=600&fit=crop', ARRAY['https://images.unsplash.com/photo-1504608524841-42fe6f032b4b?w=800&h=600&fit=crop', 'https://images.unsplash.com/photo-1559827260-dc66d52bef19?w=800&h=600&fit=crop'], ARRAY['Flutter', 'Dart', 'OpenWeather API', 'Hive'], ARRAY['7-day weather forecast', 'Location-based services', 'Weather alerts and notifications', 'Beautiful animated UI', 'Offline data caching', 'Multiple location support'], 'https://github.com/username/weather-app', 'https://weather-app-demo.vercel.app');

INSERT INTO public.experience (title, description, date_range, location, image) VALUES
('Internship at Bank Nagari', 'Worked on developing an internal internship registration system using Laravel and MySQL. Improved the UI/UX for admin and student dashboards.', 'Jan 2025 – Feb 2025', 'Padang, Indonesia', 'https://images.unsplash.com/photo-1486406146926-c627a92ad1ab?w=400&h=300&fit=crop'),
('Mobile Development Cohort - Bangkit Academy', 'Completed a 900+ hour Google-certified program on Android development and capstone project delivery, graduated with Distinction.', 'Aug 2024 – Dec 2024', 'Remote', 'https://images.unsplash.com/photo-1519389950473-47ba0277781c?w=400&h=300&fit=crop');

INSERT INTO public.certificates (title, issuer, image, credential_link) VALUES
('Android Developer Certificate', 'Bangkit Academy (Google, Gojek, Tokopedia)', 'https://images.unsplash.com/photo-1434626881859-194d67b2b86f?w=400&h=300&fit=crop', 'https://www.credential-site.com/android-dev-cert'),
('Cloud Computing Fundamentals', 'Dicoding Indonesia', 'https://images.unsplash.com/photo-1451187580459-43490279c0fa?w=400&h=300&fit=crop', 'https://www.dicoding.com/certificates/cloud-cert'),
('Full-Stack Web Development', 'FreeCodeCamp', 'https://images.unsplash.com/photo-1516321318423-f06f85e504b3?w=400&h=300&fit=crop', 'https://www.freecodecamp.org/certification/full-stack');

INSERT INTO public.skills (category, items) VALUES
('languages', ARRAY['JavaScript', 'TypeScript', 'Kotlin', 'Dart', 'Java', 'Python']),
('frameworks', ARRAY['React', 'Next.js', 'Express.js', 'Flutter', 'Node.js']),
('tools', ARRAY['Git', 'Docker', 'Firebase', 'Supabase', 'Figma', 'Postman']),
('databases', ARRAY['MySQL', 'MongoDB', 'PostgreSQL']);

INSERT INTO public.education (institution, degree, date_range, location, image) VALUES
('Universitas Andalas', 'Bachelor of Information Systems', '2021 – 2025 (Expected)', 'Padang, Indonesia', 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=400&h=300&fit=crop');

INSERT INTO public.contact_info (email, phone, location, linkedin, github, portfolio) VALUES
('noppal.901@gmail.com', '+62 877-8068-7924', 'Padang, Sumatera Barat', 'https://linkedin.com/in/naaufaal', 'https://github.com/naaufaal', 'https://naufal.dev');

-- Enable RLS on all tables (making them public for now since it's a portfolio)
ALTER TABLE public.projects ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.experience ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.certificates ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.skills ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.education ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.contact_info ENABLE ROW LEVEL SECURITY;

-- Create policies to allow public read access (since it's a portfolio website)
CREATE POLICY "Allow public read access on projects" ON public.projects FOR SELECT USING (true);
CREATE POLICY "Allow public read access on experience" ON public.experience FOR SELECT USING (true);
CREATE POLICY "Allow public read access on certificates" ON public.certificates FOR SELECT USING (true);
CREATE POLICY "Allow public read access on skills" ON public.skills FOR SELECT USING (true);
CREATE POLICY "Allow public read access on education" ON public.education FOR SELECT USING (true);
CREATE POLICY "Allow public read access on contact_info" ON public.contact_info FOR SELECT USING (true);
