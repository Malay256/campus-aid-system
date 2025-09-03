import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";
import { 
  BookOpen, 
  Home, 
  Bell, 
  FileText, 
  HelpCircle, 
  Calendar, 
  User, 
  Settings,
  LogOut,
  Briefcase
} from "lucide-react";

interface SidebarProps {
  activeTab: string;
  onTabChange: (tab: string) => void;
  onLogout: () => void;
}

const menuItems = [
  { id: "dashboard", label: "Dashboard", icon: Home },
  { id: "notices", label: "Notices", icon: Bell },
  { id: "materials", label: "Study Materials", icon: FileText },
  { id: "events", label: "Events", icon: Calendar },
  { id: "queries", label: "Query Help", icon: HelpCircle },
  { id: "tools", label: "Student Tools", icon: Briefcase },
  { id: "profile", label: "Profile", icon: User },
];

export const Sidebar = ({ activeTab, onTabChange, onLogout }: SidebarProps) => {
  return (
    <div className="flex flex-col h-full bg-sidebar border-r border-sidebar-border">
      {/* Logo */}
      <div className="flex items-center space-x-2 p-6 border-b border-sidebar-border">
        <div className="p-2 bg-sidebar-primary rounded-lg">
          <BookOpen className="h-5 w-5 text-sidebar-primary-foreground" />
        </div>
        <span className="text-lg font-bold text-sidebar-foreground">EduPortal</span>
      </div>

      {/* Navigation */}
      <div className="flex-1 py-4">
        <nav className="space-y-1 px-3">
          {menuItems.map((item) => {
            const Icon = item.icon;
            const isActive = activeTab === item.id;
            
            return (
              <Button
                key={item.id}
                variant="ghost"
                onClick={() => onTabChange(item.id)}
                className={cn(
                  "w-full justify-start px-3 py-2 text-sidebar-foreground hover:bg-sidebar-accent hover:text-sidebar-accent-foreground",
                  isActive && "bg-sidebar-accent text-sidebar-accent-foreground"
                )}
              >
                <Icon className="mr-3 h-4 w-4" />
                {item.label}
              </Button>
            );
          })}
        </nav>
      </div>

      {/* Bottom Actions */}
      <div className="p-4 border-t border-sidebar-border">
        <Button
          variant="ghost"
          onClick={onLogout}
          className="w-full justify-start px-3 py-2 text-sidebar-foreground hover:bg-destructive hover:text-destructive-foreground"
        >
          <LogOut className="mr-3 h-4 w-4" />
          Logout
        </Button>
      </div>
    </div>
  );
};