import { useState, useEffect } from 'react';
import { BrowserRouter, Routes, Route, Navigate, useNavigate } from 'react-router-dom';
import { AuthProvider, useAuth } from '@/context/AuthContext';
import { UserDashboard } from '@/pages/UserDashboard';
import { AdminDashboard } from '@/pages/AdminDashboard';
import { LoginModal } from '@/components/auth/LoginModal';
import { RegisterModal } from '@/components/auth/RegisterModal';
import { AdminLoginModal } from '@/components/auth/AdminLoginModal';
import './App.css';
import { 
  Shield, MapPin, Users, 
  Phone, Calendar, Star, CheckCircle, AlertTriangle,
  Menu, X, ChevronRight, Play, Download, Globe,
  Lock, Heart, Zap
} from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';

// Protected Route Component
function ProtectedRoute({ children, requireAdmin = false }: { children: React.ReactNode, requireAdmin?: boolean }) {
  const { user, isLoading } = useAuth();
  const navigate = useNavigate();

  useEffect(() => {
    if (!isLoading) {
      if (!user) {
        navigate('/');
      } else if (requireAdmin && user.role !== 'admin') {
        navigate('/dashboard');
      }
    }
  }, [user, isLoading, navigate, requireAdmin]);

  if (isLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="animate-spin w-8 h-8 border-4 border-teal-500 border-t-transparent rounded-full" />
      </div>
    );
  }

  if (!user || (requireAdmin && user.role !== 'admin')) {
    return null;
  }

  return <>{children}</>;
}

// Landing Page Component
function LandingPage() {
  const [isScrolled, setIsScrolled] = useState(false);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [activeFeature, setActiveFeature] = useState(0);
  const [loginOpen, setLoginOpen] = useState(false);
  const [registerOpen, setRegisterOpen] = useState(false);
  const [adminLoginOpen, setAdminLoginOpen] = useState(false);
  const { user, isAuthenticated } = useAuth();
  const navigate = useNavigate();

  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 50);
    };
    window.addEventListener('scroll', handleScroll, { passive: true });
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  // Redirect if already logged in
  useEffect(() => {
    if (isAuthenticated && user) {
      if (user.role === 'admin') {
        navigate('/admin');
      } else {
        navigate('/dashboard');
      }
    }
  }, [isAuthenticated, user, navigate]);

  const scrollToSection = (id: string) => {
    const element = document.getElementById(id);
    if (element) {
      element.scrollIntoView({ behavior: 'smooth' });
      setMobileMenuOpen(false);
    }
  };

  const features = [
    {
      icon: <Calendar className="w-6 h-6" />,
      title: "Trip Planning",
      description: "Plan solo or group trips with our intuitive itinerary builder. Invite friends and coordinate together.",
      image: "/group-planning.jpg"
    },
    {
      icon: <Users className="w-6 h-6" />,
      title: "Verified Guides",
      description: "Browse and book verified local tour guides by destination, language, specialty, and rating.",
      image: "/guide-booking.jpg"
    },
    {
      icon: <Lock className="w-6 h-6" />,
      title: "Escrow Payments",
      description: "Pay securely with escrow protection. Funds are released only after service completion.",
      image: "/escrow-payment.jpg"
    },
    {
      icon: <AlertTriangle className="w-6 h-6" />,
      title: "SOS Emergency",
      description: "One-tap emergency button shares your live location instantly with our support team.",
      image: "/sos-feature.jpg"
    }
  ];

  const howItWorks = [
    {
      step: 1,
      title: "Create Your Trip",
      description: "Set up your solo or group trip with dates, destinations, and preferences."
    },
    {
      step: 2,
      title: "Find Verified Guides",
      description: "Browse verified local guides, check reviews, and negotiate prices."
    },
    {
      step: 3,
      title: "Book with Confidence",
      description: "Pay securely via escrow. Your funds are protected until service is completed."
    },
    {
      step: 4,
      title: "Travel Safely",
      description: "Enjoy your journey with 24/7 support and emergency assistance at your fingertips."
    }
  ];

  const roadmap = [
    {
      phase: "Phase 1",
      title: "MVP Launch",
      status: "In Progress",
      items: ["OTP Authentication", "Trip Planning", "Guide Marketplace", "Escrow Payments", "SOS Feature", "Admin Dashboard"]
    },
    {
      phase: "Phase 2",
      title: "Transport & Rentals",
      status: "Coming Soon",
      items: ["Airport Transfers", "Driver Marketplace", "Car Rentals", "Holiday Homes"]
    },
    {
      phase: "Phase 3",
      title: "Fintech Expansion",
      status: "Planned",
      items: ["Travel Savings (TravelPiggy)", "SIM Rental", "Virtual Cards", "Events & Tours"]
    },
    {
      phase: "Phase 4",
      title: "Social & Gamification",
      status: "Planned",
      items: ["Rewards Points", "Badges", "Photo Books", "Referral Program"]
    }
  ];

  return (
    <div className="min-h-screen bg-white">
      {/* Navigation */}
      <nav className={`fixed top-0 left-0 right-0 z-50 transition-all duration-300 ${
        isScrolled ? 'glass shadow-lg' : 'bg-transparent'
      }`}>
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between h-16 lg:h-20">
            {/* Logo */}
            <div className="flex items-center gap-2">
              <div className="w-10 h-10 rounded-xl gradient-teal flex items-center justify-center">
                <Shield className="w-5 h-5 text-white" />
              </div>
              <span className={`font-bold text-xl ${isScrolled ? 'text-slate-900' : 'text-white'}`}>
                TripGuard
              </span>
            </div>

            {/* Desktop Navigation */}
            <div className="hidden lg:flex items-center gap-8">
              {['Features', 'How It Works', 'Safety', 'Roadmap'].map((item) => (
                <button
                  key={item}
                  onClick={() => scrollToSection(item.toLowerCase().replace(/\s+/g, '-'))}
                  className={`text-sm font-medium transition-colors hover:text-teal-500 ${
                    isScrolled ? 'text-slate-700' : 'text-white/90'
                  }`}
                >
                  {item}
                </button>
              ))}
            </div>

            {/* CTA Buttons */}
            <div className="hidden lg:flex items-center gap-4">
              <Button 
                variant="ghost" 
                onClick={() => setLoginOpen(true)}
                className={isScrolled ? 'text-slate-700' : 'text-white hover:text-white hover:bg-white/10'}
              >
                Sign In
              </Button>
              <Button 
                onClick={() => setRegisterOpen(true)}
                className="gradient-coral text-white border-0 hover:opacity-90"
              >
                Get Started
              </Button>
              <Button 
                variant="ghost" 
                size="sm"
                onClick={() => setAdminLoginOpen(true)}
                className={`${isScrolled ? 'text-slate-500' : 'text-white/60'} hover:text-teal-500`}
              >
                Admin
              </Button>
            </div>

            {/* Mobile Menu Button */}
            <button
              onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
              className={`lg:hidden p-2 rounded-lg ${isScrolled ? 'text-slate-700' : 'text-white'}`}
            >
              {mobileMenuOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
            </button>
          </div>
        </div>

        {/* Mobile Menu */}
        {mobileMenuOpen && (
          <div className="lg:hidden glass border-t">
            <div className="px-4 py-4 space-y-3">
              {['Features', 'How It Works', 'Safety', 'Roadmap'].map((item) => (
                <button
                  key={item}
                  onClick={() => scrollToSection(item.toLowerCase().replace(/\s+/g, '-'))}
                  className="block w-full text-left px-4 py-2 text-slate-700 hover:bg-slate-100 rounded-lg"
                >
                  {item}
                </button>
              ))}
              <div className="pt-3 border-t space-y-2">
                <Button variant="outline" className="w-full" onClick={() => setLoginOpen(true)}>Sign In</Button>
                <Button className="w-full gradient-coral text-white border-0" onClick={() => setRegisterOpen(true)}>Get Started</Button>
                <Button variant="ghost" className="w-full text-slate-500" onClick={() => setAdminLoginOpen(true)}>Admin Login</Button>
              </div>
            </div>
          </div>
        )}
      </nav>

      {/* Auth Modals */}
      <LoginModal 
        isOpen={loginOpen} 
        onClose={() => setLoginOpen(false)} 
        onSwitchToRegister={() => {
          setLoginOpen(false);
          setRegisterOpen(true);
        }}
      />
      <RegisterModal 
        isOpen={registerOpen} 
        onClose={() => setRegisterOpen(false)} 
        onSwitchToLogin={() => {
          setRegisterOpen(false);
          setLoginOpen(true);
        }}
      />
      <AdminLoginModal 
        isOpen={adminLoginOpen} 
        onClose={() => setAdminLoginOpen(false)} 
      />

      {/* Hero Section */}
      <section className="relative min-h-screen flex items-center overflow-hidden">
        {/* Background Image */}
        <div className="absolute inset-0">
          <img 
            src="/hero-travel.jpg" 
            alt="Travelers exploring" 
            className="w-full h-full object-cover"
          />
          <div className="absolute inset-0 bg-gradient-to-r from-slate-900/90 via-slate-900/70 to-slate-900/40" />
        </div>

        {/* Content */}
        <div className="relative z-10 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-32 lg:py-0">
          <div className="grid lg:grid-cols-2 gap-12 items-center">
            <div className="space-y-8">
              <Badge className="bg-teal-500/20 text-teal-300 border-teal-500/30 px-4 py-1.5">
                <Star className="w-3 h-3 mr-1 fill-current" />
                Trusted by 10,000+ Travelers
              </Badge>
              
              <h1 className="text-4xl sm:text-5xl lg:text-6xl font-bold text-white leading-tight">
                Travel Safer.
                <span className="block text-transparent bg-clip-text bg-gradient-to-r from-teal-400 to-coral-400">
                  Travel Smarter.
                </span>
              </h1>
              
              <p className="text-lg text-slate-300 max-w-xl leading-relaxed">
                Your all-in-one travel companion for planning trips, booking verified local guides, 
                secure escrow payments, and 24/7 safety support. Travel with confidence, anywhere.
              </p>

              <div className="flex flex-col sm:flex-row gap-4">
                <Button 
                  size="lg" 
                  onClick={() => setRegisterOpen(true)}
                  className="gradient-teal text-white border-0 hover:opacity-90 text-base px-8"
                >
                  <Download className="w-5 h-5 mr-2" />
                  Get Started Free
                </Button>
                <Button 
                  size="lg" 
                  variant="outline" 
                  className="border-white/30 text-white hover:bg-white/10 text-base px-8"
                >
                  <Play className="w-5 h-5 mr-2" />
                  Watch Demo
                </Button>
              </div>

              {/* Stats */}
              <div className="flex gap-8 pt-4">
                {[
                  { value: "10K+", label: "Active Users" },
                  { value: "500+", label: "Verified Guides" },
                  { value: "50+", label: "Countries" }
                ].map((stat, i) => (
                  <div key={i}>
                    <div className="text-2xl font-bold text-white">{stat.value}</div>
                    <div className="text-sm text-slate-400">{stat.label}</div>
                  </div>
                ))}
              </div>
            </div>

            {/* App Mockup */}
            <div className="hidden lg:flex justify-center">
              <div className="relative">
                <div className="absolute -inset-4 bg-gradient-to-r from-teal-500/30 to-coral-500/30 rounded-3xl blur-2xl" />
                <img 
                  src="/app-mockup.jpg" 
                  alt="TripGuard App" 
                  className="relative rounded-3xl shadow-2xl w-80 animate-float"
                />
              </div>
            </div>
          </div>
        </div>

        {/* Scroll Indicator */}
        <div className="absolute bottom-8 left-1/2 -translate-x-1/2 animate-bounce">
          <ChevronRight className="w-6 h-6 text-white/50 rotate-90" />
        </div>
      </section>

      {/* Features Section */}
      <section id="features" className="py-24 bg-slate-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center max-w-3xl mx-auto mb-16">
            <Badge className="bg-teal-100 text-teal-700 border-0 mb-4">Features</Badge>
            <h2 className="text-3xl sm:text-4xl font-bold text-slate-900 mb-4">
              Everything You Need for Safe Travel
            </h2>
            <p className="text-lg text-slate-600">
              From planning to payment to protection, TripGuard has you covered every step of your journey.
            </p>
          </div>

          <div className="grid lg:grid-cols-2 gap-8 items-start">
            {/* Feature List */}
            <div className="space-y-4">
              {features.map((feature, index) => (
                <Card
                  key={index}
                  className={`cursor-pointer transition-all duration-300 border-2 ${
                    activeFeature === index 
                      ? 'border-teal-500 shadow-lg bg-white' 
                      : 'border-transparent hover:border-slate-200 bg-white/50'
                  }`}
                  onClick={() => setActiveFeature(index)}
                >
                  <CardContent className="p-6">
                    <div className="flex items-start gap-4">
                      <div className={`w-12 h-12 rounded-xl flex items-center justify-center transition-colors ${
                        activeFeature === index ? 'gradient-teal text-white' : 'bg-slate-100 text-slate-600'
                      }`}>
                        {feature.icon}
                      </div>
                      <div className="flex-1">
                        <h3 className="font-semibold text-lg text-slate-900 mb-1">{feature.title}</h3>
                        <p className="text-slate-600 text-sm leading-relaxed">{feature.description}</p>
                      </div>
                      <ChevronRight className={`w-5 h-5 transition-transform ${
                        activeFeature === index ? 'rotate-90 text-teal-500' : 'text-slate-400'
                      }`} />
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>

            {/* Feature Image */}
            <div className="relative lg:sticky lg:top-24">
              <div className="relative rounded-2xl overflow-hidden shadow-2xl">
                <img 
                  src={features[activeFeature].image} 
                  alt={features[activeFeature].title}
                  className="w-full aspect-video object-cover transition-all duration-500"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-slate-900/60 to-transparent" />
                <div className="absolute bottom-6 left-6 right-6">
                  <Badge className="bg-white/20 text-white border-0 mb-2">
                    {features[activeFeature].title}
                  </Badge>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* How It Works Section */}
      <section id="how-it-works" className="py-24 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center max-w-3xl mx-auto mb-16">
            <Badge className="bg-coral-100 text-coral-700 border-0 mb-4">How It Works</Badge>
            <h2 className="text-3xl sm:text-4xl font-bold text-slate-900 mb-4">
              Plan, Book, Travel in 4 Simple Steps
            </h2>
            <p className="text-lg text-slate-600">
              Getting started with TripGuard is easy. Follow these steps to travel with confidence.
            </p>
          </div>

          <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-8">
            {howItWorks.map((step, index) => (
              <div key={index} className="relative">
                {/* Connector Line */}
                {index < howItWorks.length - 1 && (
                  <div className="hidden lg:block absolute top-12 left-[60%] w-[80%] h-0.5 bg-gradient-to-r from-teal-500 to-coral-500" />
                )}
                
                <div className="relative">
                  <div className="w-24 h-24 rounded-2xl gradient-teal flex items-center justify-center mb-6 mx-auto shadow-lg shadow-teal-500/25">
                    <span className="text-3xl font-bold text-white">{step.step}</span>
                  </div>
                  <h3 className="text-xl font-semibold text-slate-900 text-center mb-3">{step.title}</h3>
                  <p className="text-slate-600 text-center leading-relaxed">{step.description}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Safety Section */}
      <section id="safety" className="py-24 bg-slate-900 relative overflow-hidden">
        {/* Background Pattern */}
        <div className="absolute inset-0 opacity-10">
          <div className="absolute top-0 left-0 w-96 h-96 bg-teal-500 rounded-full blur-3xl" />
          <div className="absolute bottom-0 right-0 w-96 h-96 bg-coral-500 rounded-full blur-3xl" />
        </div>

        <div className="relative z-10 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid lg:grid-cols-2 gap-16 items-center">
            <div>
              <Badge className="bg-teal-500/20 text-teal-300 border-teal-500/30 mb-4">
                <Shield className="w-3 h-3 mr-1" />
                Safety First
              </Badge>
              <h2 className="text-3xl sm:text-4xl font-bold text-white mb-6">
                Your Safety is Our
                <span className="text-teal-400"> Top Priority</span>
              </h2>
              <p className="text-lg text-slate-400 mb-8 leading-relaxed">
                We built TripGuard with safety at its core. From verified providers to 
                emergency assistance, we've got you covered 24/7.
              </p>

              <div className="space-y-4">
                {[
                  { icon: <CheckCircle className="w-5 h-5" />, text: "Verified & background-checked tour guides" },
                  { icon: <Lock className="w-5 h-5" />, text: "Secure escrow payment protection" },
                  { icon: <Phone className="w-5 h-5" />, text: "24/7 emergency support hotline" },
                  { icon: <MapPin className="w-5 h-5" />, text: "Real-time location sharing with SOS" },
                  { icon: <Star className="w-5 h-5" />, text: "Community ratings & reviews system" }
                ].map((item, i) => (
                  <div key={i} className="flex items-center gap-3 text-slate-300">
                    <div className="w-10 h-10 rounded-lg bg-teal-500/20 flex items-center justify-center text-teal-400">
                      {item.icon}
                    </div>
                    <span>{item.text}</span>
                  </div>
                ))}
              </div>
            </div>

            <div className="relative">
              <div className="absolute -inset-4 bg-gradient-to-r from-teal-500/20 to-coral-500/20 rounded-3xl blur-2xl" />
              <img 
                src="/safety-illustration.jpg" 
                alt="Safety Features" 
                className="relative rounded-3xl shadow-2xl w-full"
              />
              
              {/* Floating Cards */}
              <div className="absolute -bottom-6 -left-6 bg-white rounded-xl p-4 shadow-xl animate-float">
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 rounded-full bg-green-100 flex items-center justify-center">
                    <CheckCircle className="w-5 h-5 text-green-600" />
                  </div>
                  <div>
                    <div className="text-sm font-semibold text-slate-900">Guide Verified</div>
                    <div className="text-xs text-slate-500">Background checked</div>
                  </div>
                </div>
              </div>

              <div className="absolute -top-6 -right-6 bg-white rounded-xl p-4 shadow-xl animate-float" style={{ animationDelay: '1s' }}>
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 rounded-full bg-teal-100 flex items-center justify-center">
                    <Shield className="w-5 h-5 text-teal-600" />
                  </div>
                  <div>
                    <div className="text-sm font-semibold text-slate-900">Payment Secure</div>
                    <div className="text-xs text-slate-500">Escrow protected</div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Roadmap Section */}
      <section id="roadmap" className="py-24 bg-slate-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center max-w-3xl mx-auto mb-16">
            <Badge className="bg-amber-100 text-amber-700 border-0 mb-4">Roadmap</Badge>
            <h2 className="text-3xl sm:text-4xl font-bold text-slate-900 mb-4">
              Our Journey Ahead
            </h2>
            <p className="text-lg text-slate-600">
              We're building TripGuard in phases to deliver the best travel experience.
            </p>
          </div>

          <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-6">
            {roadmap.map((phase, index) => (
              <Card key={index} className="border-0 shadow-lg overflow-hidden">
                <div className={`h-2 ${
                  phase.status === 'In Progress' ? 'gradient-teal' : 
                  phase.status === 'Coming Soon' ? 'gradient-coral' : 'bg-slate-200'
                }`} />
                <CardContent className="p-6">
                  <div className="flex items-center justify-between mb-4">
                    <Badge variant="outline" className="text-xs">{phase.phase}</Badge>
                    <span className={`text-xs font-medium ${
                      phase.status === 'In Progress' ? 'text-teal-600' : 
                      phase.status === 'Coming Soon' ? 'text-coral-600' : 'text-slate-500'
                    }`}>{phase.status}</span>
                  </div>
                  <h3 className="font-semibold text-lg text-slate-900 mb-4">{phase.title}</h3>
                  <ul className="space-y-2">
                    {phase.items.map((item, i) => (
                      <li key={i} className="flex items-start gap-2 text-sm text-slate-600">
                        <div className={`w-1.5 h-1.5 rounded-full mt-1.5 ${
                          phase.status === 'In Progress' ? 'bg-teal-500' : 
                          phase.status === 'Coming Soon' ? 'bg-coral-500' : 'bg-slate-300'
                        }`} />
                        {item}
                      </li>
                    ))}
                  </ul>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-24 relative overflow-hidden">
        <div className="absolute inset-0">
          <img 
            src="/destination-beach.jpg" 
            alt="Beautiful destination" 
            className="w-full h-full object-cover"
          />
          <div className="absolute inset-0 bg-gradient-to-r from-slate-900/95 via-slate-900/85 to-slate-900/70" />
        </div>

        <div className="relative z-10 max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <h2 className="text-3xl sm:text-4xl lg:text-5xl font-bold text-white mb-6">
            Ready to Travel with Confidence?
          </h2>
          <p className="text-lg text-slate-300 mb-8 max-w-2xl mx-auto">
            Join thousands of travelers who trust TripGuard for safe, seamless journeys. 
            Sign up today and start planning your next adventure.
          </p>

          <div className="flex flex-col sm:flex-row gap-4 justify-center mb-12">
            <Button 
              size="lg" 
              onClick={() => setRegisterOpen(true)}
              className="bg-white text-slate-900 hover:bg-slate-100 text-base px-8"
            >
              <Download className="w-5 h-5 mr-2" />
              Create Free Account
            </Button>
            <Button 
              size="lg" 
              variant="outline" 
              onClick={() => setLoginOpen(true)}
              className="border-white/30 text-white hover:bg-white/10 text-base px-8"
            >
              Sign In
            </Button>
          </div>

          <div className="flex flex-wrap justify-center gap-8 text-slate-400">
            {[
              { icon: <Globe className="w-5 h-5" />, text: "Available in 50+ Countries" },
              { icon: <Heart className="w-5 h-5" />, text: "Loved by Travelers" },
              { icon: <Zap className="w-5 h-5" />, text: "Free to Get Started" }
            ].map((item, i) => (
              <div key={i} className="flex items-center gap-2">
                {item.icon}
                <span className="text-sm">{item.text}</span>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="bg-slate-900 text-slate-400 py-16">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-12 mb-12">
            {/* Brand */}
            <div>
              <div className="flex items-center gap-2 mb-4">
                <div className="w-10 h-10 rounded-xl gradient-teal flex items-center justify-center">
                  <Shield className="w-5 h-5 text-white" />
                </div>
                <span className="font-bold text-xl text-white">TripGuard</span>
              </div>
              <p className="text-sm leading-relaxed mb-4">
                Your trusted travel companion for planning trips, booking verified services, 
                and staying safe on the move.
              </p>
              <div className="flex gap-4">
                {['twitter', 'facebook', 'instagram', 'linkedin'].map((social) => (
                  <a 
                    key={social} 
                    href="#" 
                    className="w-8 h-8 rounded-lg bg-slate-800 flex items-center justify-center hover:bg-teal-500 hover:text-white transition-colors"
                  >
                    <Globe className="w-4 h-4" />
                  </a>
                ))}
              </div>
            </div>

            {/* Product */}
            <div>
              <h4 className="text-white font-semibold mb-4">Product</h4>
              <ul className="space-y-2 text-sm">
                {['Features', 'How It Works', 'Pricing', 'Safety', 'Roadmap'].map((item) => (
                  <li key={item}>
                    <a href="#" className="hover:text-teal-400 transition-colors">{item}</a>
                  </li>
                ))}
              </ul>
            </div>

            {/* Company */}
            <div>
              <h4 className="text-white font-semibold mb-4">Company</h4>
              <ul className="space-y-2 text-sm">
                {['About Us', 'Careers', 'Press', 'Blog', 'Contact'].map((item) => (
                  <li key={item}>
                    <a href="#" className="hover:text-teal-400 transition-colors">{item}</a>
                  </li>
                ))}
              </ul>
            </div>

            {/* Support */}
            <div>
              <h4 className="text-white font-semibold mb-4">Support</h4>
              <ul className="space-y-2 text-sm">
                {['Help Center', 'Terms of Service', 'Privacy Policy', 'Provider Agreement', 'Emergency'].map((item) => (
                  <li key={item}>
                    <a href="#" className="hover:text-teal-400 transition-colors">{item}</a>
                  </li>
                ))}
              </ul>
            </div>
          </div>

          <div className="pt-8 border-t border-slate-800 flex flex-col sm:flex-row justify-between items-center gap-4">
            <p className="text-sm">
              © 2026 TripGuard. All rights reserved. Travel Safer. Travel Smarter.
            </p>
            <div className="flex items-center gap-2 text-sm">
              <span>Made with</span>
              <Heart className="w-4 h-4 text-coral-500 fill-current" />
              <span>for travelers worldwide</span>
            </div>
          </div>
        </div>
      </footer>
    </div>
  );
}

// Main App Component
function App() {
  return (
    <AuthProvider>
      <BrowserRouter>
        <Routes>
          <Route path="/" element={<LandingPage />} />
          <Route 
            path="/dashboard" 
            element={
              <ProtectedRoute>
                <UserDashboard />
              </ProtectedRoute>
            } 
          />
          <Route 
            path="/admin" 
            element={
              <ProtectedRoute requireAdmin>
                <AdminDashboard />
              </ProtectedRoute>
            } 
          />
          <Route path="*" element={<Navigate to="/" />} />
        </Routes>
      </BrowserRouter>
    </AuthProvider>
  );
}

export default App
