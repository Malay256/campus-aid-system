import { useState, useEffect } from "react";
import { Sidebar } from "@/components/layout/Sidebar";
import { DashboardHome } from "@/components/dashboard/DashboardHome";
import { NoticesPage } from "@/components/dashboard/NoticesPage";
import { StudyMaterialsPage } from "@/components/dashboard/StudyMaterialsPage";
import { EventsPage } from "@/components/dashboard/EventsPage";
import { QueriesPage } from "@/components/dashboard/QueriesPage";
import { StudentToolsPage } from "@/components/dashboard/StudentToolsPage";
import { ProfilePage } from "@/components/dashboard/ProfilePage";
import { AdminPanel } from "@/components/dashboard/AdminPanel";
import { useAuth } from "@/hooks/useAuth";
import { useRole } from "@/hooks/useRole";
import { Button } from "@/components/ui/button";
import { Menu, X } from "lucide-react";
import { Sheet, SheetContent, SheetTrigger } from "@/components/ui/sheet";

interface DashboardProps {
  onLogout: () => void;
}

export const Dashboard = ({ onLogout }: DashboardProps) => {
  const [activeTab, setActiveTab] = useState("dashboard");
  const { user, profile, signOut } = useAuth();
  const { isAdmin } = useRole();
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);

  const handleLogout = async () => {
    await signOut();
    onLogout();
  };

  const renderContent = () => {
    switch (activeTab) {
      case "dashboard":
        return (
          <DashboardHome
            studentName={profile?.name || user?.email?.split('@')[0] || "Student"}
            onNavigate={setActiveTab}
          />
        );
      case "notices":
        return <NoticesPage />;
      case "materials":
        return <StudyMaterialsPage />;
      case "events":
        return <EventsPage />;
      case "queries":
        return <QueriesPage />;
      case "tools":
        return <StudentToolsPage />;
      case "profile":
        return <ProfilePage studentData={profile} />;
      case "admin":
        return isAdmin ? <AdminPanel /> : (
          <DashboardHome
            studentName={profile?.name || user?.email?.split('@')[0] || "Student"}
            onNavigate={setActiveTab}
          />
        );
      default:
        return (
          <DashboardHome
            studentName={profile?.name || user?.email?.split('@')[0] || "Student"}
            onNavigate={setActiveTab}
          />
        );
    }
  };

  if (!user) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gradient-subtle">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary mx-auto mb-4"></div>
          <p className="text-muted-foreground">Loading dashboard...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="flex h-screen bg-background">
      {/* Sidebar */}
      <div className="w-64 hidden md:block">
        <Sidebar
          activeTab={activeTab}
          onTabChange={setActiveTab}
          onLogout={handleLogout}
        />
      </div>

      {/* Main Content */}
      <div className="flex-1 overflow-auto">
        {/* Mobile Header */}
        <div className="md:hidden flex justify-between items-center p-4 border-b">
          <Sheet open={isMobileMenuOpen} onOpenChange={setIsMobileMenuOpen}>
            <SheetTrigger asChild>
              <Button variant="ghost" size="icon">
                <Menu className="h-6 w-6" />
              </Button>
            </SheetTrigger>
            <SheetContent side="left" className="w-64 p-0">
              <Sidebar
                activeTab={activeTab}
                onTabChange={(tab) => {
                  setActiveTab(tab);
                  setIsMobileMenuOpen(false);
                }}
                onLogout={handleLogout}
              />
            </SheetContent>
          </Sheet>
          <h1 className="text-lg font-bold">EduPortal</h1>
        </div>

        <div className="p-6">
          {renderContent()}
        </div>
      </div>
    </div>
  );
};
