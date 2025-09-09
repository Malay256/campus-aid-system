import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { FileText, Download, Search, Filter, Upload, BookOpen, Video, FileImage } from "lucide-react";
import { useState, useEffect } from "react";
import { supabase } from "@/integrations/supabase/client";
import { useRole } from "@/hooks/useRole";
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
  icon?: any;
};

export const StudyMaterialsPage = () => {
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedSubject, setSelectedSubject] = useState("All Subjects");
  const [materials, setMaterials] = useState<StudyMaterial[]>([]);
  const [filteredMaterials, setFilteredMaterials] = useState<StudyMaterial[]>([]);
  const [subjects, setSubjects] = useState<string[]>(["All Subjects"]);
  const [loading, setLoading] = useState(true);
  const { isAdmin } = useRole();

  useEffect(() => {
    fetchMaterials();
  }, []);

  const fetchMaterials = async () => {
    try {
      const { data, error } = await supabase
        .from('study_materials')
        .select('*')
        .order('created_at', { ascending: false });

      if (error) throw error;

      const materialsWithIcons = data.map(material => ({
        ...material,
        icon: getFileIcon(material.type)
      }));

      setMaterials(materialsWithIcons);
      setFilteredMaterials(materialsWithIcons);

      // Extract unique subjects
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
    if (!material.file_path) {
      toast.error('File not available for download');
      return;
    }

    try {
      const { data, error } = await supabase.storage
        .from('study-materials')
        .download(material.file_path);

      if (error) throw error;

      // Create download link
      const url = URL.createObjectURL(data);
      const a = document.createElement('a');
      a.href = url;
      a.download = material.title;
      document.body.appendChild(a);
      a.click();
      document.body.removeChild(a);
      URL.revokeObjectURL(url);

      // Increment download count
      await supabase
        .from('study_materials')
        .update({ downloads: material.downloads + 1 })
        .eq('id', material.id);

      // Refresh materials
      fetchMaterials();
    } catch (error: any) {
      toast.error('Failed to download file');
      console.error('Download error:', error);
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
      {/* Header */}
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
        
        {isAdmin && (
          <Button className="bg-gradient-primary border-0">
            <Upload className="h-4 w-4 mr-2" />
            Upload Material
          </Button>
        )}
      </div>

      {/* Search and Filter */}
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

      {/* Materials Grid */}
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
                  
                  <Button 
                    className="w-full" 
                    variant="outline"
                    onClick={() => handleDownload(material)}
                    disabled={!material.file_path}
                  >
                    <Download className="h-4 w-4 mr-2" />
                    Download
                  </Button>
                </CardContent>
              </Card>
            );
          })}
        </div>
      )}

      {filteredMaterials.length === 0 && (
        <Card className="shadow-soft">
          <CardContent className="py-12 text-center">
            <BookOpen className="h-12 w-12 text-muted-foreground mx-auto mb-4" />
            <p className="text-lg font-medium text-muted-foreground">No materials found</p>
            <p className="text-sm text-muted-foreground">Try adjusting your search or filter criteria</p>
          </CardContent>
        </Card>
      )}
    </div>
  );
};