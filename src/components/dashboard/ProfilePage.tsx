import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import { User, Mail, Calendar, Settings, Save, Edit } from "lucide-react";
import { useState } from "react";
import { useToast } from "@/hooks/use-toast";

interface ProfilePageProps {
  studentData: any;
}

export const ProfilePage = ({ studentData }: ProfilePageProps) => {
  const [isEditing, setIsEditing] = useState(false);
  const [formData, setFormData] = useState({
    name: studentData?.name || "",
    email: studentData?.email || "",
    age: studentData?.age || "",
    gender: studentData?.gender || ""
  });
  const { toast } = useToast();

  const handleSave = () => {
    // Update localStorage with new data
    const updatedStudent = { ...studentData, ...formData };
    localStorage.setItem("student", JSON.stringify(updatedStudent));
    
    toast({
      title: "Profile Updated",
      description: "Your profile information has been saved successfully.",
    });
    
    setIsEditing(false);
  };

  const handleCancel = () => {
    // Reset form data to original values
    setFormData({
      name: studentData?.name || "",
      email: studentData?.email || "",
      age: studentData?.age || "",
      gender: studentData?.gender || ""
    });
    setIsEditing(false);
  };

  const getInitials = (name: string) => {
    return name
      .split(' ')
      .map(word => word[0])
      .join('')
      .toUpperCase()
      .slice(0, 2);
  };

  return (
    <div className="space-y-6 max-w-2xl">
      {/* Header */}
      <div className="flex items-center space-x-3">
        <div className="p-3 bg-primary/10 rounded-lg">
          <User className="h-6 w-6 text-primary" />
        </div>
        <div>
          <h1 className="text-2xl font-bold">Profile Settings</h1>
          <p className="text-muted-foreground">Manage your account information</p>
        </div>
      </div>

      {/* Profile Card */}
      <Card className="shadow-soft">
        <CardHeader className="pb-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-4">
              <Avatar className="h-16 w-16">
                <AvatarFallback className="bg-gradient-primary text-white text-lg font-semibold">
                  {getInitials(formData.name || "User")}
                </AvatarFallback>
              </Avatar>
              <div>
                <CardTitle className="text-xl">{formData.name || "Student Name"}</CardTitle>
                <CardDescription className="flex items-center space-x-2">
                  <Mail className="h-4 w-4" />
                  <span>{formData.email || "email@example.com"}</span>
                </CardDescription>
              </div>
            </div>
            
            <Button
              variant={isEditing ? "outline" : "default"}
              onClick={() => setIsEditing(!isEditing)}
            >
              {isEditing ? (
                <>
                  <Settings className="h-4 w-4 mr-2" />
                  Cancel
                </>
              ) : (
                <>
                  <Edit className="h-4 w-4 mr-2" />
                  Edit Profile
                </>
              )}
            </Button>
          </div>
        </CardHeader>

        <CardContent className="space-y-6">
          {/* Personal Information */}
          <div className="space-y-4">
            <h3 className="text-lg font-semibold">Personal Information</h3>
            
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor="name">Full Name</Label>
                <Input
                  id="name"
                  type="text"
                  value={formData.name}
                  onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                  disabled={!isEditing}
                  className={!isEditing ? "bg-muted" : ""}
                />
              </div>
              
              <div className="space-y-2">
                <Label htmlFor="email">Email Address</Label>
                <Input
                  id="email"
                  type="email"
                  value={formData.email}
                  onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                  disabled={!isEditing}
                  className={!isEditing ? "bg-muted" : ""}
                />
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor="age">Age</Label>
                <Input
                  id="age"
                  type="number"
                  value={formData.age}
                  onChange={(e) => setFormData({ ...formData, age: e.target.value })}
                  disabled={!isEditing}
                  className={!isEditing ? "bg-muted" : ""}
                  min="16"
                  max="99"
                />
              </div>
              
              <div className="space-y-2">
                <Label htmlFor="gender">Gender</Label>
                <Select 
                  value={formData.gender} 
                  onValueChange={(value) => setFormData({ ...formData, gender: value })}
                  disabled={!isEditing}
                >
                  <SelectTrigger className={!isEditing ? "bg-muted" : ""}>
                    <SelectValue placeholder="Select gender" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="male">Male</SelectItem>
                    <SelectItem value="female">Female</SelectItem>
                    <SelectItem value="other">Other</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </div>
          </div>

          {/* Save Changes */}
          {isEditing && (
            <div className="flex gap-2 pt-4 border-t border-border">
              <Button onClick={handleSave} className="bg-gradient-primary border-0">
                <Save className="h-4 w-4 mr-2" />
                Save Changes
              </Button>
              <Button variant="outline" onClick={handleCancel}>
                Cancel
              </Button>
            </div>
          )}
        </CardContent>
      </Card>

      {/* Account Statistics */}
      <Card className="shadow-soft">
        <CardHeader>
          <CardTitle className="text-lg">Account Statistics</CardTitle>
          <CardDescription>Your activity overview</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4 text-center">
            <div className="space-y-1">
              <p className="text-2xl font-bold text-primary">6</p>
              <p className="text-sm text-muted-foreground">Courses Enrolled</p>
            </div>
            <div className="space-y-1">
              <p className="text-2xl font-bold text-success">12</p>
              <p className="text-sm text-muted-foreground">Materials Downloaded</p>
            </div>
            <div className="space-y-1">
              <p className="text-2xl font-bold text-accent-purple">3</p>
              <p className="text-sm text-muted-foreground">Events Registered</p>
            </div>
            <div className="space-y-1">
              <p className="text-2xl font-bold text-warning">4</p>
              <p className="text-sm text-muted-foreground">Queries Submitted</p>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};