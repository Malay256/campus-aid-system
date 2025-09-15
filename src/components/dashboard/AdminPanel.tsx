import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { useState } from "react";
import { Upload, FileText, Calendar, Bell, Users, Settings, Eye, EyeOff, BarChart3 } from "lucide-react";
import { supabase } from "@/integrations/supabase/client";
import { useAuth } from "@/hooks/useAuth";
import { toast } from "sonner";
import { Switch } from "@/components/ui/switch";
import { AdminAnalytics } from "./AdminAnalytics";

export const AdminPanel = () => {
  const [activeUpload, setActiveUpload] = useState<string | null>(null);
  const [showPassword, setShowPassword] = useState(false);
  const { user } = useAuth();

  // Study Material Upload
  const [materialForm, setMaterialForm] = useState({
    title: '',
    subject: '',
    type: 'PDF',
    file: null as File | null,
    access_id: '',
    access_password: '',
    require_credentials: false
  });

  // Notice Form
  const [noticeForm, setNoticeForm] = useState({
    title: '',
    content: '',
    category: 'general',
    priority: 'medium'
  });

  // Event Form
  const [eventForm, setEventForm] = useState({
    title: '',
    description: '',
    date: '',
    time: '',
    location: '',
    category: 'Academic',
    max_participants: ''
  });

  const handleFileUpload = async (file: File, folder: string) => {
    if (!user) return null;

    const fileExt = file.name.split('.').pop();
    const fileName = `${Date.now()}-${Math.random().toString(36).substring(7)}.${fileExt}`;
    const filePath = `${folder}/${fileName}`;

    const { error: uploadError } = await supabase.storage
      .from('study-materials')
      .upload(filePath, file);

    if (uploadError) {
      throw uploadError;
    }

    return filePath;
  };

  const handleMaterialSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!user || !materialForm.file) return;

    setActiveUpload('material');
    try {
      const filePath = await handleFileUpload(materialForm.file, 'materials');
      if (!filePath) throw new Error('File upload failed');

      const { error } = await supabase
        .from('study_materials')
        .insert({
          title: materialForm.title,
          subject: materialForm.subject,
          type: materialForm.type,
          file_path: filePath,
          size: `${(materialForm.file.size / (1024 * 1024)).toFixed(1)} MB`,
          uploaded_by: user.id,
          access_id: materialForm.require_credentials ? materialForm.access_id : null,
          access_password: materialForm.require_credentials ? materialForm.access_password : null
        });

      if (error) throw error;

      toast.success('Study material uploaded successfully!');
      setMaterialForm({ 
        title: '', 
        subject: '', 
        type: 'PDF', 
        file: null, 
        access_id: '', 
        access_password: '', 
        require_credentials: false 
      });
    } catch (error: any) {
      toast.error(`Failed to upload material: ${error.message}`);
    } finally {
      setActiveUpload(null);
    }
  };

  const handleNoticeSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!user) return;

    setActiveUpload('notice');
    try {
      const { error } = await supabase
        .from('notices')
        .insert({
          title: noticeForm.title,
          content: noticeForm.content,
          category: noticeForm.category,
          priority: noticeForm.priority
        });

      if (error) throw error;

      toast.success('Notice created successfully!');
      setNoticeForm({ title: '', content: '', category: 'general', priority: 'medium' });
    } catch (error: any) {
      toast.error(`Failed to create notice: ${error.message}`);
    } finally {
      setActiveUpload(null);
    }
  };

  const handleEventSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!user) return;

    setActiveUpload('event');
    try {
      const { error } = await supabase
        .from('events')
        .insert({
          title: eventForm.title,
          description: eventForm.description,
          date: eventForm.date,
          time: eventForm.time,
          location: eventForm.location,
          category: eventForm.category,
          max_participants: eventForm.max_participants ? parseInt(eventForm.max_participants) : null
        });

      if (error) throw error;

      toast.success('Event created successfully!');
      setEventForm({
        title: '',
        description: '',
        date: '',
        time: '',
        location: '',
        category: 'Academic',
        max_participants: ''
      });
    } catch (error: any) {
      toast.error(`Failed to create event: ${error.message}`);
    } finally {
      setActiveUpload(null);
    }
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center space-x-3">
        <div className="p-3 bg-primary/10 rounded-lg">
          <Settings className="h-6 w-6 text-primary" />
        </div>
        <div>
          <h1 className="text-2xl font-bold">Admin Panel</h1>
          <p className="text-muted-foreground">Manage content and upload resources</p>
        </div>
      </div>

      <Tabs defaultValue="materials" className="w-full">
        <TabsList className="grid w-full grid-cols-4">
          <TabsTrigger value="materials">Study Materials</TabsTrigger>
          <TabsTrigger value="notices">Notices</TabsTrigger>
          <TabsTrigger value="events">Events</TabsTrigger>
          <TabsTrigger value="analytics">Analytics</TabsTrigger>
        </TabsList>

        <TabsContent value="materials" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <FileText className="h-5 w-5" />
                Upload Study Material
              </CardTitle>
              <CardDescription>
                Upload files that students can access and download
              </CardDescription>
            </CardHeader>
            <CardContent>
              <form onSubmit={handleMaterialSubmit} className="space-y-4">
                <div className="grid grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <Label htmlFor="title">Title</Label>
                    <Input
                      id="title"
                      placeholder="e.g., Calculus - Differentiation Notes"
                      value={materialForm.title}
                      onChange={(e) => setMaterialForm(prev => ({ ...prev, title: e.target.value }))}
                      required
                    />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="subject">Subject</Label>
                    <Input
                      id="subject"
                      placeholder="e.g., Mathematics"
                      value={materialForm.subject}
                      onChange={(e) => setMaterialForm(prev => ({ ...prev, subject: e.target.value }))}
                      required
                    />
                  </div>
                </div>
                
                <div className="space-y-2">
                  <Label htmlFor="type">File Type</Label>
                  <Select value={materialForm.type} onValueChange={(value) => setMaterialForm(prev => ({ ...prev, type: value }))}>
                    <SelectTrigger>
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="PDF">PDF</SelectItem>
                      <SelectItem value="Video">Video</SelectItem>
                      <SelectItem value="Image">Image</SelectItem>
                      <SelectItem value="Document">Document</SelectItem>
                    </SelectContent>
                  </Select>
                </div>

                <div className="space-y-2">
                  <Label htmlFor="file">Upload File</Label>
                  <Input
                    id="file"
                    type="file"
                    onChange={(e) => setMaterialForm(prev => ({ ...prev, file: e.target.files?.[0] || null }))}
                    required
                  />
                </div>

                {/* Access Control Section */}
                <div className="space-y-4 border-t pt-4">
                  <div className="flex items-center justify-between">
                    <div className="space-y-0.5">
                      <Label className="text-base">Require Access Credentials</Label>
                      <p className="text-sm text-muted-foreground">
                        Students will need ID and password to access this file
                      </p>
                    </div>
                    <Switch
                      checked={materialForm.require_credentials}
                      onCheckedChange={(checked) => setMaterialForm(prev => ({ ...prev, require_credentials: checked }))}
                    />
                  </div>

                  {materialForm.require_credentials && (
                    <div className="space-y-4 pl-4 border-l border-border">
                      <div className="grid grid-cols-2 gap-4">
                        <div className="space-y-2">
                          <Label htmlFor="access_id">Access ID</Label>
                          <Input
                            id="access_id"
                            placeholder="e.g., MATH101"
                            value={materialForm.access_id}
                            onChange={(e) => setMaterialForm(prev => ({ ...prev, access_id: e.target.value }))}
                            required={materialForm.require_credentials}
                          />
                        </div>
                        <div className="space-y-2">
                          <Label htmlFor="access_password">Access Password</Label>
                          <div className="relative">
                            <Input
                              id="access_password"
                              type={showPassword ? "text" : "password"}
                              placeholder="Enter password"
                              value={materialForm.access_password}
                              onChange={(e) => setMaterialForm(prev => ({ ...prev, access_password: e.target.value }))}
                              required={materialForm.require_credentials}
                            />
                            <Button
                              type="button"
                              variant="ghost"
                              size="sm"
                              className="absolute right-0 top-0 h-full px-3 py-2 hover:bg-transparent"
                              onClick={() => setShowPassword(!showPassword)}
                            >
                              {showPassword ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
                            </Button>
                          </div>
                        </div>
                      </div>
                      <p className="text-sm text-muted-foreground">
                        Students will need both the Access ID and Password to download this file.
                      </p>
                    </div>
                  )}
                </div>

                <Button 
                  type="submit" 
                  className="w-full" 
                  disabled={activeUpload === 'material'}
                >
                  {activeUpload === 'material' ? 'Uploading...' : 'Upload Material'}
                </Button>
              </form>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="notices" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Bell className="h-5 w-5" />
                Create Notice
              </CardTitle>
              <CardDescription>
                Post announcements and notifications for students
              </CardDescription>
            </CardHeader>
            <CardContent>
              <form onSubmit={handleNoticeSubmit} className="space-y-4">
                <div className="space-y-2">
                  <Label htmlFor="notice-title">Title</Label>
                  <Input
                    id="notice-title"
                    placeholder="e.g., Mid-term Examination Schedule Released"
                    value={noticeForm.title}
                    onChange={(e) => setNoticeForm(prev => ({ ...prev, title: e.target.value }))}
                    required
                  />
                </div>

                <div className="grid grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <Label htmlFor="category">Category</Label>
                    <Select value={noticeForm.category} onValueChange={(value) => setNoticeForm(prev => ({ ...prev, category: value }))}>
                      <SelectTrigger>
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="general">General</SelectItem>
                        <SelectItem value="academic">Academic</SelectItem>
                        <SelectItem value="event">Event</SelectItem>
                        <SelectItem value="maintenance">Maintenance</SelectItem>
                        <SelectItem value="deadline">Deadline</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="priority">Priority</Label>
                    <Select value={noticeForm.priority} onValueChange={(value) => setNoticeForm(prev => ({ ...prev, priority: value }))}>
                      <SelectTrigger>
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="low">Low</SelectItem>
                        <SelectItem value="medium">Medium</SelectItem>
                        <SelectItem value="high">High</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                </div>

                <div className="space-y-2">
                  <Label htmlFor="content">Content</Label>
                  <Textarea
                    id="content"
                    placeholder="Enter the notice content..."
                    value={noticeForm.content}
                    onChange={(e) => setNoticeForm(prev => ({ ...prev, content: e.target.value }))}
                    required
                    rows={4}
                  />
                </div>

                <Button 
                  type="submit" 
                  className="w-full" 
                  disabled={activeUpload === 'notice'}
                >
                  {activeUpload === 'notice' ? 'Creating...' : 'Create Notice'}
                </Button>
              </form>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="events" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Calendar className="h-5 w-5" />
                Create Event
              </CardTitle>
              <CardDescription>
                Create events that students can register for
              </CardDescription>
            </CardHeader>
            <CardContent>
              <form onSubmit={handleEventSubmit} className="space-y-4">
                <div className="space-y-2">
                  <Label htmlFor="event-title">Title</Label>
                  <Input
                    id="event-title"
                    placeholder="e.g., Tech Fest 2024"
                    value={eventForm.title}
                    onChange={(e) => setEventForm(prev => ({ ...prev, title: e.target.value }))}
                    required
                  />
                </div>

                <div className="space-y-2">
                  <Label htmlFor="event-description">Description</Label>
                  <Textarea
                    id="event-description"
                    placeholder="Event description..."
                    value={eventForm.description}
                    onChange={(e) => setEventForm(prev => ({ ...prev, description: e.target.value }))}
                    rows={3}
                  />
                </div>

                <div className="grid grid-cols-3 gap-4">
                  <div className="space-y-2">
                    <Label htmlFor="date">Date</Label>
                    <Input
                      id="date"
                      type="date"
                      value={eventForm.date}
                      onChange={(e) => setEventForm(prev => ({ ...prev, date: e.target.value }))}
                      required
                    />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="time">Time</Label>
                    <Input
                      id="time"
                      placeholder="e.g., 09:00 AM"
                      value={eventForm.time}
                      onChange={(e) => setEventForm(prev => ({ ...prev, time: e.target.value }))}
                      required
                    />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="location">Location</Label>
                    <Input
                      id="location"
                      placeholder="e.g., Main Auditorium"
                      value={eventForm.location}
                      onChange={(e) => setEventForm(prev => ({ ...prev, location: e.target.value }))}
                      required
                    />
                  </div>
                </div>

                <div className="grid grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <Label htmlFor="event-category">Category</Label>
                    <Select value={eventForm.category} onValueChange={(value) => setEventForm(prev => ({ ...prev, category: value }))}>
                      <SelectTrigger>
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="Academic">Academic</SelectItem>
                        <SelectItem value="Cultural">Cultural</SelectItem>
                        <SelectItem value="Workshop">Workshop</SelectItem>
                        <SelectItem value="Festival">Festival</SelectItem>
                        <SelectItem value="Sports">Sports</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="max-participants">Max Participants (Optional)</Label>
                    <Input
                      id="max-participants"
                      type="number"
                      placeholder="e.g., 100"
                      value={eventForm.max_participants}
                      onChange={(e) => setEventForm(prev => ({ ...prev, max_participants: e.target.value }))}
                    />
                  </div>
                </div>

                <Button 
                  type="submit" 
                  className="w-full" 
                  disabled={activeUpload === 'event'}
                >
                  {activeUpload === 'event' ? 'Creating...' : 'Create Event'}
                </Button>
              </form>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="analytics" className="space-y-4">
          <AdminAnalytics />
        </TabsContent>
      </Tabs>
    </div>
  );
};