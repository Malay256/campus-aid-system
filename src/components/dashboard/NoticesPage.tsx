import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Bell, Calendar, AlertCircle, Info, CheckCircle } from "lucide-react";
import { useState, useEffect } from "react";
import { supabase } from "@/integrations/supabase/client";
import { toast } from "sonner";

type Notice = {
  id: string;
  title: string;
  content: string;
  category: string;
  priority: string;
  created_at: string;
  date: string;
};

const getNoticeIcon = (category: string) => {
  switch (category) {
    case "academic":
      return <AlertCircle className="h-5 w-5 text-destructive" />;
    case "event":
      return <Calendar className="h-5 w-5 text-accent-purple" />;
    case "maintenance":
      return <Info className="h-5 w-5 text-warning" />;
    case "deadline":
      return <CheckCircle className="h-5 w-5 text-success" />;
    default:
      return <Bell className="h-5 w-5 text-primary" />;
  }
};

const getNoticeBadge = (category: string, priority: string) => {
  if (priority === "high") {
    return <Badge variant="destructive">High Priority</Badge>;
  }
  
  switch (category) {
    case "academic":
      return <Badge variant="destructive">Academic</Badge>;
    case "event":
      return <Badge className="bg-accent-purple text-white">Event</Badge>;
    case "maintenance":
      return <Badge className="bg-warning text-warning-foreground">Maintenance</Badge>;
    case "deadline":
      return <Badge className="bg-success text-success-foreground">Deadline</Badge>;
    default:
      return <Badge variant="secondary">General</Badge>;
  }
};

export const NoticesPage = () => {
  const [notices, setNotices] = useState<Notice[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchNotices();
  }, []);

  const fetchNotices = async () => {
    try {
      const { data, error } = await supabase
        .from('notices')
        .select('*')
        .order('created_at', { ascending: false });

      if (error) throw error;
      setNotices(data || []);
    } catch (error: any) {
      toast.error('Failed to fetch notices');
      console.error('Error:', error);
    } finally {
      setLoading(false);
    }
  };
  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center space-x-3">
        <div className="p-3 bg-warning/10 rounded-lg">
          <Bell className="h-6 w-6 text-warning" />
        </div>
        <div>
          <h1 className="text-2xl font-bold">Notices & Announcements</h1>
          <p className="text-muted-foreground">Stay updated with the latest campus news</p>
        </div>
      </div>

      {/* Notices List */}
      {loading ? (
        <div className="text-center py-8">
          <p className="text-muted-foreground">Loading notices...</p>
        </div>
      ) : (
        <div className="space-y-4">
          {notices.map((notice) => (
            <Card key={notice.id} className="shadow-soft hover:shadow-medium transition-all duration-300">
              <CardHeader className="pb-3">
                <div className="flex items-start justify-between">
                  <div className="flex items-start space-x-3 flex-1">
                    {getNoticeIcon(notice.category)}
                    <div className="flex-1 min-w-0">
                      <CardTitle className="text-lg leading-tight">{notice.title}</CardTitle>
                      <div className="flex items-center space-x-2 mt-1">
                        {getNoticeBadge(notice.category, notice.priority)}
                        <span className="text-sm text-muted-foreground">
                          {new Date(notice.created_at).toLocaleDateString()} at {new Date(notice.created_at).toLocaleTimeString()}
                        </span>
                      </div>
                    </div>
                  </div>
                </div>
              </CardHeader>
              <CardContent>
                <p className="text-muted-foreground leading-relaxed">{notice.content}</p>
              </CardContent>
            </Card>
          ))}
        </div>
      )}

      {notices.length === 0 && !loading && (
        <Card className="shadow-soft">
          <CardContent className="py-12 text-center">
            <Bell className="h-12 w-12 text-muted-foreground mx-auto mb-4" />
            <p className="text-lg font-medium text-muted-foreground">No notices available</p>
            <p className="text-sm text-muted-foreground">Check back later for updates</p>
          </CardContent>
        </Card>
      )}
    </div>
  );
};