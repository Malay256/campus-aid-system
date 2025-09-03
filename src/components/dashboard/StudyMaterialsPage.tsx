import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { FileText, Download, Search, Filter, Upload, BookOpen, Video, FileImage } from "lucide-react";
import { useState } from "react";

const materials = [
  {
    id: 1,
    title: "Calculus - Differentiation Notes",
    subject: "Mathematics",
    type: "PDF",
    size: "2.4 MB",
    uploadedBy: "Dr. Smith",
    uploadDate: "2024-01-15",
    downloads: 45,
    icon: FileText
  },
  {
    id: 2,
    title: "Data Structures - Arrays and Linked Lists",
    subject: "Computer Science",
    type: "PDF", 
    size: "1.8 MB",
    uploadedBy: "Prof. Johnson",
    uploadDate: "2024-01-14",
    downloads: 32,
    icon: FileText
  },
  {
    id: 3,
    title: "Organic Chemistry Lab Manual",
    subject: "Chemistry",
    type: "PDF",
    size: "5.2 MB", 
    uploadedBy: "Dr. Wilson",
    uploadDate: "2024-01-13",
    downloads: 28,
    icon: FileText
  },
  {
    id: 4,
    title: "Physics Practical Video - Wave Motion",
    subject: "Physics", 
    type: "Video",
    size: "125 MB",
    uploadedBy: "Prof. Davis",
    uploadDate: "2024-01-12", 
    downloads: 67,
    icon: Video
  },
  {
    id: 5,
    title: "English Literature - Shakespeare Analysis",
    subject: "English",
    type: "PDF",
    size: "3.1 MB",
    uploadedBy: "Dr. Brown",
    uploadDate: "2024-01-11",
    downloads: 19,
    icon: FileText
  },
  {
    id: 6,
    title: "Circuit Diagrams - Electronics", 
    subject: "Electronics",
    type: "Image",
    size: "950 KB",
    uploadedBy: "Prof. Lee",
    uploadDate: "2024-01-10",
    downloads: 41,
    icon: FileImage
  }
];

const subjects = ["All Subjects", "Mathematics", "Computer Science", "Physics", "Chemistry", "English", "Electronics"];

export const StudyMaterialsPage = () => {
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedSubject, setSelectedSubject] = useState("All Subjects");
  const [filteredMaterials, setFilteredMaterials] = useState(materials);

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
        
        <Button className="bg-gradient-primary border-0">
          <Upload className="h-4 w-4 mr-2" />
          Upload Material
        </Button>
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
                  <p>Uploaded by: <span className="font-medium">{material.uploadedBy}</span></p>
                  <div className="flex items-center justify-between">
                    <span>Size: {material.size}</span>
                    <span>Downloads: {material.downloads}</span>
                  </div>
                  <p>Date: {material.uploadDate}</p>
                </div>
                
                <Button className="w-full" variant="outline">
                  <Download className="h-4 w-4 mr-2" />
                  Download
                </Button>
              </CardContent>
            </Card>
          );
        })}
      </div>

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