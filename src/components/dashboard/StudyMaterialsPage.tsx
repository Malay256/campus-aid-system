import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { FileText, Download, Search, Filter, Upload, BookOpen, Video, FileImage, Lock, Key } from "lucide-react";
import { useState, useEffect } from "react";
import { supabase } from "@/integrations/supabase/client";
import { useRole } from "@/hooks/useRole";
import { useAuth } from "@/hooks/useAuth";
import { toast } from "sonner";

type StudyMaterial = {
  id: string;
  title: string;
  subject: string;
  type: string;
  size: string;
  file_path: string | null;
  created_at: string;
  downloads: number;
  uploaded_by: string | null;
  is_protected: boolean;
  icon?: any;
};

export const StudyMaterialsPage = () => {
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedSubject, setSelectedSubject] = useState("All Subjects");
  const [materials, setMaterials] = useState<StudyMaterial[]>([]);
  const [filteredMaterials, setFilteredMaterials] = useState<StudyMaterial[]>([]);
  const [subjects, setSubjects] = useState<string[]>(["All Subjects"]);
  const [loading, setLoading] = useState(true);
  const [accessDialog, setAccessDialog] = useState<{ open: boolean, material: StudyMaterial | null }>({
    open: false,
    material: null
  });
  const [accessCredentials, setAccessCredentials] = useState({ id: '', password: '' });
  const [isUploadDialogOpen, setIsUploadDialogOpen] = useState(false);
  const [newMaterial, setNewMaterial] = useState({
    title: '',
    subject: '',
    type: 'PDF',
    file: null as File | null
  });
  const [isUploading, setIsUploading] = useState(false);
  const { user } = useAuth();

  useEffect(() => {
    fetchMaterials();
  }, []);

  const fetchMaterials = async () => {
    try {
      const { data, error } = await supabase
        .from('study_materials_public')
        .select('*')
        .order('created_at', { ascending: false });

      if (error) throw error;

      const materialsWithIcons = data.map(material => ({
        ...material,
        icon: getFileIcon(material.type)
      }));

      setMaterials(materialsWithIcons);
      setFilteredMaterials(materialsWithIcons);

      const uniqueSubjects = ["All Subjects", ...new Set(data.map(m => m.subject))];
      setSubjects(uniqueSubjects);
    } catch (error: any) {
      toast.error('Failed to fetch study materials');
      console.error('Error:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleSearch = (query: string) => {
    setSearchQuery(query);
    filterMaterials(query, selectedSubject);
  };

  const handleSubjectChange = (subject: string) => {
    setSelectedSubject(subject);
    filterMaterials(searchQuery, subject);
  };

  const filterMaterials = (query: string, subject: string) => {
    let filtered = materials;
    
    if (subject !== "All Subjects") {
      filtered = filtered.filter(material => material.subject === subject);
    }
    
    if (query) {
      filtered = filtered.filter(material => 
        material.title.toLowerCase().includes(query.toLowerCase()) ||
        material.subject.toLowerCase().includes(query.toLowerCase())
      );
    }
    
    setFilteredMaterials(filtered);
  };

  const getFileIcon = (type: string) => {
    switch (type.toLowerCase()) {
      case 'video':
        return Video;
      case 'image':
        return FileImage;
      default:
        return FileText;
    }
  };

  const handleDownload = async (material: StudyMaterial) => {
    if (material.is_protected) {
      setAccessDialog({ open: true, material });
      return;
    }

    await downloadFile(material, null, null);
  };

  const downloadFile = async (material: StudyMaterial, accessId?: string | null, accessPassword?: string | null) => {
    try {
      // Use secure function to get file access info
      const { data: accessInfo, error: accessError } = await supabase.rpc(
        'get_file_access_info', 
        {
          material_id: material.id,
          provided_access_id: accessId,
          provided_password: accessPassword
        }
      );

      if (accessError) throw accessError;
      
      const accessData = accessInfo?.[0];
      if (!accessData?.access_granted) {
        toast.error(accessData?.error_message || 'Access denied');
        return;
      }

      if (!accessData.file_path) {
        toast.error('File not available for download');
        return;
      }

      const { data, error } = await supabase.storage
        .from('study-materials')
        .download(accessData.file_path);

      if (error) throw error;

      const url = URL.createObjectURL(data);
      const a = document.createElement('a');
      a.href = url;
      a.download = material.title;
      document.body.appendChild(a);
      a.click();
      document.body.removeChild(a);
      URL.revokeObjectURL(url);

      if (user) {
        await supabase.from('file_access_logs').insert({
          user_id: user.id,
          file_id: material.id,
          access_method: 'download'
        });
      }

      await supabase
        .from('study_materials')
        .update({ downloads: material.downloads + 1 })
        .eq('id', material.id);

      fetchMaterials();
      toast.success('File downloaded successfully!');
    } catch (error: any) {
      toast.error('Failed to download file');
      console.error('Download error:', error);
    }
  };

  const handleCredentialSubmit = async () => {
    if (!accessDialog.material) return;

    const { material } = accessDialog;
    
    setAccessDialog({ open: false, material: null });
    setAccessCredentials({ id: '', password: '' });
    await downloadFile(material, accessCredentials.id, accessCredentials.password);
  };

  const handleUserUploadSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!user || !newMaterial.file) return;

    setIsUploading(true);
    try {
      const file = newMaterial.file;
      const fileExt = file.name.split('.').pop();
      const fileName = `${user.id}-${Date.now()}.${fileExt}`;
      const filePath = `user-uploads/${fileName}`;

      const { error: uploadError } = await supabase.storage
        .from('study-materials')
        .upload(filePath, file);

      if (uploadError) throw uploadError;

      const { error: insertError } = await supabase
        .from('study_materials')
        .insert({
          title: newMaterial.title,
          subject: newMaterial.subject,
          type: newMaterial.type,
          file_path: filePath,
          size: `${(file.size / (1024 * 1024)).toFixed(2)} MB`,
          uploaded_by: user.id,
        });

      if (insertError) throw insertError;

      toast.success('Material uploaded successfully!');
      setNewMaterial({ title: '', subject: '', type: 'PDF', file: null });
      setIsUploadDialogOpen(false);
      fetchMaterials();
    } catch (error: any) {
      toast.error(`Failed to upload material: ${error.message}`);
    } finally {
      setIsUploading(false);
    }
  };

  const getFileTypeColor = (type: string) => {
    switch (type.toLowerCase()) {
      case "pdf":
        return "bg-destructive/10 text-destructive";
      case "video":
        return "bg-accent-purple/10 text-accent-purple";
      case "image":
        return "bg-success/10 text-success";
      default:
        return "bg-muted text-muted-foreground";
    }
  };

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div className="flex items-center space-x-3">
          <div className="p-3 bg-primary/10 rounded-lg">
            <BookOpen className="h-6 w-6 text-primary" />
          </div>
          <div>
            <h1 className="text-2xl font-bold">Study Materials</h1>
            <p className="text-muted-foreground">Access course materials and resources</p>
          </div>
        </div>
        
        <Dialog open={isUploadDialogOpen} onOpenChange={setIsUploadDialogOpen}>
          <DialogTrigger asChild>
            <Button>
              <Upload className="h-4 w-4 mr-2" />
              Upload Material
            </Button>
          </DialogTrigger>
          <DialogContent>
            <DialogHeader>
              <DialogTitle>Upload a New Material</DialogTitle>
              <DialogDescription>
                This material will only be visible to you.
              </DialogDescription>
            </DialogHeader>
            <form onSubmit={handleUserUploadSubmit} className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="title">Title</Label>
                <Input id="title" placeholder="e.g., My Personal Notes" value={newMaterial.title} onChange={(e) => setNewMaterial(prev => ({ ...prev, title: e.target.value }))} required />
              </div>
              <div className="space-y-2">
                <Label htmlFor="subject">Subject</Label>
                <Input id="subject" placeholder="e.g., Personal" value={newMaterial.subject} onChange={(e) => setNewMaterial(prev => ({ ...prev, subject: e.target.value }))} required />
              </div>
              <div className="space-y-2">
                  <Label htmlFor="type">File Type</Label>
                  <Select value={newMaterial.type} onValueChange={(value) => setNewMaterial(prev => ({ ...prev, type: value }))}>
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
                <Label htmlFor="file">File</Label>
                <Input id="file" type="file" onChange={(e) => setNewMaterial(prev => ({ ...prev, file: e.target.files?.[0] || null }))} required />
              </div>
              <Button type="submit" className="w-full" disabled={isUploading}>
                {isUploading ? 'Uploading...' : 'Upload'}
              </Button>
            </form>
          </DialogContent>
        </Dialog>
      </div>

      <Card className="shadow-soft">
        <CardContent className="p-4">
          <div className="flex flex-col md:flex-row gap-4">
            <div className="flex-1 relative">
              <Search className="absolute left-3 top-3 h-4 w-4 text-muted-foreground" />
              <Input
                placeholder="Search materials..."
                value={searchQuery}
                onChange={(e) => handleSearch(e.target.value)}
                className="pl-10"
              />
            </div>
            <Select value={selectedSubject} onValueChange={handleSubjectChange}>
              <SelectTrigger className="w-full md:w-48">
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                {subjects.map(subject => (
                  <SelectItem key={subject} value={subject}>{subject}</SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>
        </CardContent>
      </Card>

      {loading ? (
        <div className="text-center py-8">
          <p className="text-muted-foreground">Loading study materials...</p>
        </div>
      ) : (
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
          {filteredMaterials.map((material) => {
            const Icon = material.icon;
            return (
              <Card key={material.id} className="shadow-soft hover:shadow-medium transition-all duration-300">
                <CardHeader className="pb-3">
                  <div className="flex items-start space-x-3">
                    <div className="p-2 bg-primary/10 rounded-lg">
                      <Icon className="h-5 w-5 text-primary" />
                    </div>
                    <div className="flex-1 min-w-0">
                      <CardTitle className="text-lg leading-tight">{material.title}</CardTitle>
                      <div className="flex items-center gap-2 mt-1">
                        <Badge variant="secondary">{material.subject}</Badge>
                        <Badge className={getFileTypeColor(material.type)}>{material.type}</Badge>
                      </div>
                    </div>
                  </div>
                </CardHeader>
                <CardContent className="space-y-3">
                  <div className="text-sm text-muted-foreground space-y-1">
                    <div className="flex items-center justify-between">
                      <span>Size: {material.size}</span>
                      <span>Downloads: {material.downloads}</span>
                    </div>
                    <p>Date: {new Date(material.created_at).toLocaleDateString()}</p>
                  </div>
                  <div className="flex gap-2">
                    <Button 
                      className="flex-1" 
                      variant="outline"
                      onClick={() => handleDownload(material)}
                      disabled={!material.file_path && !material.is_protected}
                    >
                      <Download className="h-4 w-4 mr-2" />
                      Download
                    </Button>
                    {material.is_protected && (
                      <div className="flex items-center">
                        <Lock className="h-4 w-4 text-muted-foreground" />
                      </div>
                    )}
                  </div>
                </CardContent>
              </Card>
            );
          })}
        </div>
      )}

      {filteredMaterials.length === 0 && !loading && (
        <Card className="shadow-soft">
          <CardContent className="py-12 text-center">
            <BookOpen className="h-12 w-12 text-muted-foreground mx-auto mb-4" />
            <p className="text-lg font-medium text-muted-foreground">No materials found</p>
            <p className="text-sm text-muted-foreground">Try adjusting your search or upload your own!</p>
          </CardContent>
        </Card>
      )}

      <Dialog open={accessDialog.open} onOpenChange={(open) => {
        setAccessDialog({ open, material: accessDialog.material });
        if (!open) setAccessCredentials({ id: '', password: '' });
      }}>
        <DialogContent className="sm:max-w-md">
          <DialogHeader>
            <DialogTitle className="flex items-center gap-2">
              <Key className="h-5 w-5" />
              Access Required
            </DialogTitle>
            <DialogDescription>
              This file requires credentials to download. Please enter the Access ID and Password.
            </DialogDescription>
          </DialogHeader>
          <div className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="credential-id">Access ID</Label>
              <Input
                id="credential-id"
                placeholder="Enter Access ID"
                value={accessCredentials.id}
                onChange={(e) => setAccessCredentials(prev => ({ ...prev, id: e.target.value }))}
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="credential-password">Password</Label>
              <Input
                id="credential-password"
                type="password"
                placeholder="Enter Password"
                value={accessCredentials.password}
                onChange={(e) => setAccessCredentials(prev => ({ ...prev, password: e.target.value }))}
              />
            </div>
            <div className="flex gap-2 pt-4">
              <Button 
                variant="outline" 
                className="flex-1"
                onClick={() => setAccessDialog({ open: false, material: null })}
              >
                Cancel
              </Button>
              <Button 
                className="flex-1"
                onClick={handleCredentialSubmit}
                disabled={!accessCredentials.id || !accessCredentials.password}
              >
                Download
              </Button>
            </div>
          </div>
        </DialogContent>
      </Dialog>
    </div>
  );
};
