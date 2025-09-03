import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";
import { 
  Bell, 
  FileText, 
  Calendar, 
  HelpCircle, 
  Users, 
  BookOpen,
  TrendingUp,
  Clock,
  Briefcase
} from "lucide-react";

interface DashboardHomeProps {
  studentName: string;
  onNavigate: (section: string) => void;
}

export const DashboardHome = ({ studentName, onNavigate }: DashboardHomeProps) => {
  const quickStats = [
    { label: "Active Courses", value: "6", icon: BookOpen, color: "text-primary" },
    { label: "Upcoming Events", value: "3", icon: Calendar, color: "text-accent-purple" },
    { label: "New Notices", value: "5", icon: Bell, color: "text-warning" },
    { label: "Pending Queries", value: "2", icon: HelpCircle, color: "text-success" },
  ];

  const quickActions = [
    {
      title: "Latest Notices",
      description: "Check new announcements and updates",
      icon: Bell,
      action: "notices",
      color: "bg-warning/10 text-warning"
    },
    {
      title: "Study Materials",
      description: "Access course materials and resources", 
      icon: FileText,
      action: "materials",
      color: "bg-primary/10 text-primary"
    },
    {
      title: "Upcoming Events",
      description: "View and register for events",
      icon: Calendar,
      action: "events", 
      color: "bg-accent-purple/10 text-accent-purple"
    },
    {
      title: "Ask for Help",
      description: "Submit queries and get assistance",
      icon: HelpCircle,
      action: "queries",
      color: "bg-success/10 text-success"
    },
    {
      title: "Student Tools",
      description: "Access useful educational tools",
      icon: Briefcase,
      action: "tools",
      color: "bg-muted text-muted-foreground"
    }
  ];

  return (
    <div className="space-y-6">
      {/* Welcome Header */}
      <div className="bg-gradient-primary rounded-xl p-6 text-white">
        <h1 className="text-2xl font-bold mb-2">Welcome back, {studentName}! 👋</h1>
        <p className="text-white/90">Ready to continue your learning journey? Here's what's happening today.</p>
      </div>

      {/* Quick Stats */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        {quickStats.map((stat, index) => {
          const Icon = stat.icon;
          return (
            <Card key={index} className="shadow-soft hover:shadow-medium transition-all duration-300">
              <CardContent className="p-6">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm text-muted-foreground">{stat.label}</p>
                    <p className="text-2xl font-bold">{stat.value}</p>
                  </div>
                  <Icon className={cn("h-8 w-8", stat.color)} />
                </div>
              </CardContent>
            </Card>
          );
        })}
      </div>

      {/* Quick Actions */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        {quickActions.map((action, index) => {
          const Icon = action.icon;
          return (
            <Card 
              key={index} 
              className="shadow-soft hover:shadow-medium transition-all duration-300 cursor-pointer hover:scale-105"
              onClick={() => onNavigate(action.action)}
            >
              <CardHeader className="pb-3">
                <div className="flex items-center space-x-3">
                  <div className={cn("p-2 rounded-lg", action.color)}>
                    <Icon className="h-5 w-5" />
                  </div>
                  <div>
                    <CardTitle className="text-lg">{action.title}</CardTitle>
                    <CardDescription className="text-sm">
                      {action.description}
                    </CardDescription>
                  </div>
                </div>
              </CardHeader>
            </Card>
          );
        })}
      </div>

      {/* Recent Activity */}
      <Card className="shadow-soft">
        <CardHeader>
          <CardTitle className="flex items-center space-x-2">
            <Clock className="h-5 w-5" />
            <span>Recent Activity</span>
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="flex items-start space-x-3 p-3 rounded-lg bg-muted/50">
            <div className="p-1 bg-success/10 rounded">
              <FileText className="h-4 w-4 text-success" />
            </div>
            <div className="flex-1">
              <p className="text-sm font-medium">New study material uploaded</p>
              <p className="text-xs text-muted-foreground">Mathematics - Calculus Notes • 2 hours ago</p>
            </div>
          </div>
          
          <div className="flex items-start space-x-3 p-3 rounded-lg bg-muted/50">
            <div className="p-1 bg-warning/10 rounded">
              <Bell className="h-4 w-4 text-warning" />
            </div>
            <div className="flex-1">
              <p className="text-sm font-medium">New notice posted</p>
              <p className="text-xs text-muted-foreground">Mid-term exam schedule announced • 4 hours ago</p>
            </div>
          </div>
          
          <div className="flex items-start space-x-3 p-3 rounded-lg bg-muted/50">
            <div className="p-1 bg-accent-purple/10 rounded">
              <Calendar className="h-4 w-4 text-accent-purple" />
            </div>
            <div className="flex-1">
              <p className="text-sm font-medium">Event registration opened</p>
              <p className="text-xs text-muted-foreground">Tech Fest 2024 • Yesterday</p>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};