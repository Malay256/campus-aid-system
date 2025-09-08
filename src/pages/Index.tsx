import { useState, useEffect } from "react";
import { Navbar } from "@/components/layout/Navbar";
import { LoginForm } from "@/components/auth/LoginForm";
import { SignupForm } from "@/components/auth/SignupForm";
import { Dashboard } from "@/pages/Dashboard";
import { Button } from "@/components/ui/button";
import { Bell, FileText, Calendar, HelpCircle, Briefcase, User } from "lucide-react";
import { useAuth } from "@/hooks/useAuth";
import heroImage from "@/assets/hero-education.jpg";

const Index = () => {
  const [currentView, setCurrentView] = useState<'home' | 'login' | 'signup' | 'dashboard'>('home');
  const { user, loading, signOut } = useAuth();

  // Auto navigate to dashboard if user is logged in
  useEffect(() => {
    if (user) {
      setCurrentView('dashboard');
    } else {
      setCurrentView('home');
    }
  }, [user]);

  const handleLogin = () => {
    setCurrentView('dashboard');
  };

  const handleLogout = async () => {
    await signOut();
    setCurrentView('home');
  };

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gradient-subtle">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary mx-auto mb-4"></div>
          <p className="text-muted-foreground">Loading...</p>
        </div>
      </div>
    );
  }

  if (currentView === 'dashboard' && user) {
    return <Dashboard onLogout={handleLogout} />;
  }

  if (currentView === 'login') {
    return (
      <LoginForm
        onBack={() => setCurrentView('home')}
        onSuccess={handleLogin}
        onSwitchToSignup={() => setCurrentView('signup')}
      />
    );
  }

  if (currentView === 'signup') {
    return (
      <SignupForm
        onBack={() => setCurrentView('home')}
        onSuccess={handleLogin}
        onSwitchToLogin={() => setCurrentView('login')}
      />
    );
  }

  return (
    <div className="min-h-screen bg-gradient-subtle">
      <Navbar
        onLoginClick={() => setCurrentView('login')}
        onSignupClick={() => setCurrentView('signup')}
      />

      {/* Hero Section */}
      <section className="relative overflow-hidden">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-24">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
            {/* Left Content */}
            <div className="space-y-8">
              <div className="space-y-4">
                <h1 className="text-4xl md:text-6xl font-bold leading-tight">
                  Your <span className="bg-gradient-primary bg-clip-text text-transparent">Student Portal</span> Awaits
                </h1>
                <p className="text-xl text-muted-foreground leading-relaxed">
                  Access course materials, stay updated with notices, register for events, and get academic support - all in one beautiful platform designed for your success.
                </p>
              </div>

              <div className="flex flex-col sm:flex-row gap-4">
                <Button
                  size="lg"
                  className="bg-gradient-primary border-0 shadow-glow text-lg px-8 py-6"
                  onClick={() => setCurrentView('signup')}
                >
                  Get Started Free
                </Button>
                <Button
                  size="lg"
                  variant="outline"
                  className="text-lg px-8 py-6"
                  onClick={() => setCurrentView('login')}
                >
                  Sign In
                </Button>
              </div>

              {/* Feature Pills */}
              <div className="flex flex-wrap gap-2">
                <div className="px-4 py-2 bg-primary/10 text-primary rounded-full text-sm font-medium">
                  📚 Study Materials
                </div>
                <div className="px-4 py-2 bg-warning/10 text-warning rounded-full text-sm font-medium">
                  📢 Live Notices
                </div>
                <div className="px-4 py-2 bg-success/10 text-success rounded-full text-sm font-medium">
                  🎯 Event Management
                </div>
                <div className="px-4 py-2 bg-accent-purple/10 text-accent-purple rounded-full text-sm font-medium">
                  💬 Query Support
                </div>
              </div>
            </div>

            {/* Right Image */}
            <div className="relative">
              <div className="relative z-10">
                <img
                  src={heroImage}
                  alt="Students studying together in a modern campus environment"
                  className="w-full h-auto rounded-2xl shadow-large"
                />
              </div>
              {/* Background Elements */}
              <div className="absolute -top-4 -right-4 w-72 h-72 bg-gradient-primary rounded-full opacity-20 blur-3xl"></div>
              <div className="absolute -bottom-8 -left-8 w-64 h-64 bg-accent-purple rounded-full opacity-20 blur-3xl"></div>
            </div>
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section className="py-24 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <h2 className="text-3xl md:text-4xl font-bold mb-4">
              Everything You Need for <span className="text-primary">Academic Success</span>
            </h2>
            <p className="text-xl text-muted-foreground max-w-2xl mx-auto">
              Our comprehensive student portal brings together all essential academic tools and resources in one place.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            <div className="bg-gradient-subtle p-8 rounded-xl shadow-soft hover:shadow-medium transition-all duration-300">
              <div className="p-3 bg-warning/10 rounded-lg w-fit mb-4">
                <Bell className="h-6 w-6 text-warning" />
              </div>
              <h3 className="text-xl font-semibold mb-2">Live Notices</h3>
              <p className="text-muted-foreground">Stay updated with real-time announcements, exam schedules, and important campus news.</p>
            </div>

            <div className="bg-gradient-subtle p-8 rounded-xl shadow-soft hover:shadow-medium transition-all duration-300">
              <div className="p-3 bg-primary/10 rounded-lg w-fit mb-4">
                <FileText className="h-6 w-6 text-primary" />
              </div>
              <h3 className="text-xl font-semibold mb-2">Study Materials</h3>
              <p className="text-muted-foreground">Access and download course materials, notes, and resources uploaded by your professors.</p>
            </div>

            <div className="bg-gradient-subtle p-8 rounded-xl shadow-soft hover:shadow-medium transition-all duration-300">
              <div className="p-3 bg-accent-purple/10 rounded-lg w-fit mb-4">
                <Calendar className="h-6 w-6 text-accent-purple" />
              </div>
              <h3 className="text-xl font-semibold mb-2">Event Management</h3>
              <p className="text-muted-foreground">Discover campus events, workshops, and festivals. Register with just a few clicks.</p>
            </div>

            <div className="bg-gradient-subtle p-8 rounded-xl shadow-soft hover:shadow-medium transition-all duration-300">
              <div className="p-3 bg-success/10 rounded-lg w-fit mb-4">
                <HelpCircle className="h-6 w-6 text-success" />
              </div>
              <h3 className="text-xl font-semibold mb-2">Query Support</h3>
              <p className="text-muted-foreground">Get help with academic queries, technical issues, and administrative questions.</p>
            </div>

            <div className="bg-gradient-subtle p-8 rounded-xl shadow-soft hover:shadow-medium transition-all duration-300">
              <div className="p-3 bg-muted rounded-lg w-fit mb-4">
                <Briefcase className="h-6 w-6 text-muted-foreground" />
              </div>
              <h3 className="text-xl font-semibold mb-2">Student Tools</h3>
              <p className="text-muted-foreground">Quick access to essential educational tools like AI assistants, design software, and productivity apps.</p>
            </div>

            <div className="bg-gradient-subtle p-8 rounded-xl shadow-soft hover:shadow-medium transition-all duration-300">
              <div className="p-3 bg-primary/10 rounded-lg w-fit mb-4">
                <User className="h-6 w-6 text-primary" />
              </div>
              <h3 className="text-xl font-semibold mb-2">Profile Management</h3>
              <p className="text-muted-foreground">Manage your personal information, track your academic progress, and customize your experience.</p>
            </div>
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-24 bg-gradient-primary text-white relative overflow-hidden">
        <div className="absolute inset-0 bg-black/10"></div>
        <div className="relative z-10 max-w-4xl mx-auto text-center px-4 sm:px-6 lg:px-8">
          <h2 className="text-3xl md:text-4xl font-bold mb-6">
            Ready to Transform Your Academic Experience?
          </h2>
          <p className="text-xl text-white/90 mb-8 max-w-2xl mx-auto">
            Join thousands of students who are already using our platform to excel in their academic journey.
          </p>
          <Button
            size="lg"
            variant="secondary"
            className="text-lg px-8 py-6 bg-white text-primary hover:bg-white/90"
            onClick={() => setCurrentView('signup')}
          >
            Start Your Journey Today
          </Button>
        </div>
      </section>
    </div>
  );
};

export default Index;