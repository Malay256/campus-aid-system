import { useState, useEffect } from "react";
import { Sidebar } from "@/components/layout/Sidebar";
import { DashboardHome } from "@/components/dashboard/DashboardHome";
import { NoticesPage } from "@/components/dashboard/NoticesPage";
import { StudyMaterialsPage } from "@/components/dashboard/StudyMaterialsPage";
import { EventsPage } from "@/components/dashboard/EventsPage";
import { QueriesPage } from "@/components/dashboard/QueriesPage";
import { StudentToolsPage } from "@/components/dashboard/StudentToolsPage";
import { ProfilePage } from "@/components/dashboard/ProfilePage";
import { useAuth } from "@/hooks/useAuth";

interface DashboardProps {
  onLogout: () => void;
}

export const Dashboard = ({ onLogout }: DashboardProps) => {
  const [activeTab, setActiveTab] = useState("dashboard");
  const { user, profile, signOut } = useAuth();
  const { isAdmin } = useRole();

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
        <div className="p-6">
          {renderContent()}
        </div>
      </div>
    </div>
  );
};