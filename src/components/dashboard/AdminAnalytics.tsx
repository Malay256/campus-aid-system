import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { BarChart3, Users, FileText, Calendar, Download, Eye, TrendingUp } from "lucide-react";
import { useState, useEffect } from "react";
import { supabase } from "@/integrations/supabase/client";
import { toast } from "sonner";

type AnalyticsData = {
  totalUsers: number;
  totalMaterials: number;
  totalEvents: number;
  totalDownloads: number;
  recentDownloads: Array<{
    id: string;
    file_title: string;
    user_email: string;
    accessed_at: string;
  }>;
  popularMaterials: Array<{
    id: string;
    title: string;
    downloads: number;
    subject: string;
  }>;
};

export const AdminAnalytics = () => {
  const [analytics, setAnalytics] = useState<AnalyticsData>({
    totalUsers: 0,
    totalMaterials: 0,
    totalEvents: 0,
    totalDownloads: 0,
    recentDownloads: [],
    popularMaterials: []
  });
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchAnalytics();
  }, []);

  const fetchAnalytics = async () => {
    try {
      // Fetch total counts
      const [usersResult, materialsResult, eventsResult, downloadsResult] = await Promise.all([
        supabase.from('profiles').select('id', { count: 'exact', head: true }),
        supabase.from('study_materials').select('id', { count: 'exact', head: true }),
        supabase.from('events').select('id', { count: 'exact', head: true }),
        supabase.from('study_materials').select('downloads')
      ]);

      // Calculate total downloads
      const totalDownloads = downloadsResult.data?.reduce((sum, item) => sum + (item.downloads || 0), 0) || 0;

      // Fetch recent downloads with user info
      const { data: recentDownloads } = await supabase
        .from('file_access_logs')
        .select(`
          id,
          accessed_at,
          study_materials!inner(title),
          profiles!inner(email)
        `)
        .order('accessed_at', { ascending: false })
        .limit(10);

      // Fetch popular materials
      const { data: popularMaterials } = await supabase
        .from('study_materials')
        .select('id, title, downloads, subject')
        .order('downloads', { ascending: false })
        .limit(5);

      setAnalytics({
        totalUsers: usersResult.count || 0,
        totalMaterials: materialsResult.count || 0,
        totalEvents: eventsResult.count || 0,
        totalDownloads,
        recentDownloads: recentDownloads?.map(item => ({
          id: item.id,
          file_title: (item.study_materials as any)?.title || 'Unknown',
          user_email: (item.profiles as any)?.email || 'Unknown',
          accessed_at: item.accessed_at
        })) || [],
        popularMaterials: popularMaterials || []
      });
    } catch (error: any) {
      toast.error('Failed to fetch analytics');
      console.error('Analytics error:', error);
    } finally {
      setLoading(false);
    }
  };

  const StatCard = ({ title, value, icon: Icon, color }: { 
    title: string; 
    value: number; 
    icon: any; 
    color: string; 
  }) => (
    <Card>
      <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
        <CardTitle className="text-sm font-medium">{title}</CardTitle>
        <Icon className={`h-4 w-4 ${color}`} />
      </CardHeader>
      <CardContent>
        <div className="text-2xl font-bold">{value.toLocaleString()}</div>
      </CardContent>
    </Card>
  );

  if (loading) {
    return (
      <div className="space-y-6">
        <div className="flex items-center space-x-3">
          <div className="p-3 bg-primary/10 rounded-lg">
            <BarChart3 className="h-6 w-6 text-primary" />
          </div>
          <div>
            <h1 className="text-2xl font-bold">Analytics</h1>
            <p className="text-muted-foreground">Loading analytics data...</p>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div className="flex items-center space-x-3">
          <div className="p-3 bg-primary/10 rounded-lg">
            <BarChart3 className="h-6 w-6 text-primary" />
          </div>
          <div>
            <h1 className="text-2xl font-bold">Analytics Dashboard</h1>
            <p className="text-muted-foreground">Monitor platform usage and engagement</p>
          </div>
        </div>
        <Button onClick={fetchAnalytics} variant="outline">
          <TrendingUp className="h-4 w-4 mr-2" />
          Refresh Data
        </Button>
      </div>

      {/* Stats Overview */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        <StatCard
          title="Total Users"
          value={analytics.totalUsers}
          icon={Users}
          color="text-primary"
        />
        <StatCard
          title="Study Materials"
          value={analytics.totalMaterials}
          icon={FileText}
          color="text-success"
        />
        <StatCard
          title="Total Events"
          value={analytics.totalEvents}
          icon={Calendar}
          color="text-accent-purple"
        />
        <StatCard
          title="Total Downloads"
          value={analytics.totalDownloads}
          icon={Download}
          color="text-warning"
        />
      </div>

      {/* Detailed Analytics */}
      <Tabs defaultValue="downloads" className="w-full">
        <TabsList className="grid w-full grid-cols-2">
          <TabsTrigger value="downloads">Recent Downloads</TabsTrigger>
          <TabsTrigger value="popular">Popular Materials</TabsTrigger>
        </TabsList>

        <TabsContent value="downloads" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Download className="h-5 w-5" />
                Recent Downloads
              </CardTitle>
              <CardDescription>
                Latest file downloads by users
              </CardDescription>
            </CardHeader>
            <CardContent>
              {analytics.recentDownloads.length > 0 ? (
                <div className="space-y-3">
                  {analytics.recentDownloads.map((download) => (
                    <div key={download.id} className="flex items-center justify-between p-3 border rounded-lg">
                      <div className="space-y-1">
                        <p className="font-medium">{download.file_title}</p>
                        <p className="text-sm text-muted-foreground">{download.user_email}</p>
                      </div>
                      <div className="text-right">
                        <p className="text-sm text-muted-foreground">
                          {new Date(download.accessed_at).toLocaleString()}
                        </p>
                      </div>
                    </div>
                  ))}
                </div>
              ) : (
                <p className="text-center text-muted-foreground py-8">No downloads recorded yet</p>
              )}
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="popular" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <TrendingUp className="h-5 w-5" />
                Most Popular Materials
              </CardTitle>
              <CardDescription>
                Materials with the highest download counts
              </CardDescription>
            </CardHeader>
            <CardContent>
              {analytics.popularMaterials.length > 0 ? (
                <div className="space-y-3">
                  {analytics.popularMaterials.map((material, index) => (
                    <div key={material.id} className="flex items-center justify-between p-3 border rounded-lg">
                      <div className="flex items-center space-x-3">
                        <div className="flex items-center justify-center w-8 h-8 rounded-full bg-primary/10 text-primary font-bold">
                          {index + 1}
                        </div>
                        <div className="space-y-1">
                          <p className="font-medium">{material.title}</p>
                          <Badge variant="secondary">{material.subject}</Badge>
                        </div>
                      </div>
                      <div className="text-right">
                        <p className="font-semibold">{material.downloads} downloads</p>
                      </div>
                    </div>
                  ))}
                </div>
              ) : (
                <p className="text-center text-muted-foreground py-8">No materials uploaded yet</p>
              )}
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  );
};