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
import { useState, useEffect } from "react";
import { supabase } from "@/integrations/supabase/client";
import { useAuth } from "@/hooks/useAuth";

interface DashboardHomeProps {
  studentName: string;
  onNavigate: (section: string) => void;
}

export const DashboardHome = ({ studentName, onNavigate }: DashboardHomeProps) => {
  const { user } = useAuth();
  const [stats, setStats] = useState({
    materialsCount: 0,
    eventsCount: 0,
    noticesCount: 0,
    queriesCount: 0
  });
  const [recentActivity, setRecentActivity] = useState<Array<{
    id: string;
    type: 'material' | 'notice' | 'event';
    title: string;
    description: string;
    timestamp: string;
    icon: any;
    color: string;
  }>>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (user) {
      fetchDashboardData();
    }
  }, [user]);

  const fetchDashboardData = async () => {
    if (!user) return;

    try {
      // Fetch user's materials count
      const { count: materialsCount } = await supabase
        .from('study_materials')
        .select('id', { count: 'exact', head: true })
        .eq('uploaded_by', user.id);

      // Fetch total events count  
      const { count: eventsCount } = await supabase
        .from('events')
        .select('id', { count: 'exact', head: true });

      // Fetch recent notices count (last 7 days)
      const weekAgo = new Date();
      weekAgo.setDate(weekAgo.getDate() - 7);
      const { count: noticesCount } = await supabase
        .from('notices')
        .select('id', { count: 'exact', head: true })
        .gte('created_at', weekAgo.toISOString());

      // Fetch user's open queries count
      const { count: queriesCount } = await supabase
        .from('queries')
        .select('id', { count: 'exact', head: true })
        .eq('user_id', user.id)
        .eq('status', 'open');

      setStats({
        materialsCount: materialsCount || 0,
        eventsCount: eventsCount || 0,
        noticesCount: noticesCount || 0,
        queriesCount: queriesCount || 0
      });

      // Fetch recent activity
      const activities: Array<{
        id: string;
        type: 'material' | 'notice' | 'event';
        title: string;
        description: string;
        timestamp: string;
        icon: any;
        color: string;
      }> = [];

      // Get recent user materials
      const { data: recentMaterials } = await supabase
        .from('study_materials')
        .select('id, title, subject, created_at')
        .eq('uploaded_by', user.id)
        .order('created_at', { ascending: false })
        .limit(2);

      recentMaterials?.forEach(material => {
        activities.push({
          id: material.id,
          type: 'material',
          title: 'Material uploaded',
          description: `${material.subject} - ${material.title}`,
          timestamp: material.created_at,
          icon: FileText,
          color: 'bg-success/10 text-success'
        });
      });

      // Get recent notices
      const { data: recentNotices } = await supabase
        .from('notices')
        .select('id, title, category, created_at')
        .order('created_at', { ascending: false })
        .limit(2);

      recentNotices?.forEach(notice => {
        activities.push({
          id: notice.id,
          type: 'notice', 
          title: 'New notice posted',
          description: notice.title,
          timestamp: notice.created_at,
          icon: Bell,
          color: 'bg-warning/10 text-warning'
        });
      });

      // Get recent events
      const { data: recentEvents } = await supabase
        .from('events')
        .select('id, title, category, created_at')
        .order('created_at', { ascending: false })
        .limit(2);

      recentEvents?.forEach(event => {
        activities.push({
          id: event.id,
          type: 'event',
          title: 'New event available',
          description: event.title,
          timestamp: event.created_at,
          icon: Calendar,
          color: 'bg-accent-purple/10 text-accent-purple'
        });
      });

      // Sort by timestamp and take latest 3
      activities.sort((a, b) => new Date(b.timestamp).getTime() - new Date(a.timestamp).getTime());
      setRecentActivity(activities.slice(0, 3));

    } catch (error: any) {
      console.error('Error fetching dashboard data:', error);
    } finally {
      setLoading(false);
    }
  };

  const quickStats = [
    { label: "My Materials", value: stats.materialsCount.toString(), icon: BookOpen, color: "text-primary" },
    { label: "Available Events", value: stats.eventsCount.toString(), icon: Calendar, color: "text-accent-purple" },
    { label: "New Notices", value: stats.noticesCount.toString(), icon: Bell, color: "text-warning" },
    { label: "Open Queries", value: stats.queriesCount.toString(), icon: HelpCircle, color: "text-success" },
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

  const formatTimeAgo = (timestamp: string) => {
    const now = new Date();
    const past = new Date(timestamp);
    const diffHours = Math.floor((now.getTime() - past.getTime()) / (1000 * 60 * 60));
    
    if (diffHours < 1) return 'Less than an hour ago';
    if (diffHours === 1) return '1 hour ago';
    if (diffHours < 24) return `${diffHours} hours ago`;
    
    const diffDays = Math.floor(diffHours / 24);
    if (diffDays === 1) return 'Yesterday';
    if (diffDays < 7) return `${diffDays} days ago`;
    
    return past.toLocaleDateString();
  };

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
          {loading ? (
            <div className="text-center py-4">
              <p className="text-muted-foreground">Loading recent activity...</p>
            </div>
          ) : recentActivity.length > 0 ? (
            recentActivity.map((activity) => {
              const Icon = activity.icon;
              return (
                <div key={activity.id} className="flex items-start space-x-3 p-3 rounded-lg bg-muted/50">
                  <div className={cn("p-1 rounded", activity.color)}>
                    <Icon className="h-4 w-4" />
                  </div>
                  <div className="flex-1">
                    <p className="text-sm font-medium">{activity.title}</p>
                    <p className="text-xs text-muted-foreground">{activity.description} • {formatTimeAgo(activity.timestamp)}</p>
                  </div>
                </div>
              );
            })
          ) : (
            <div className="text-center py-8">
              <p className="text-sm text-muted-foreground">No recent activity</p>
              <p className="text-xs text-muted-foreground">Start by uploading materials or participating in events</p>
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  );
};