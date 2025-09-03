import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { HelpCircle, Plus, MessageSquare, Clock, CheckCircle, AlertCircle } from "lucide-react";
import { useState } from "react";

const queries = [
  {
    id: 1,
    title: "Assignment Submission Issue",
    description: "I'm unable to submit my assignment through the portal. Getting an error message about file size.",
    category: "Technical",
    status: "pending",
    submitDate: "2024-01-15",
    reply: null
  },
  {
    id: 2,
    title: "Course Registration Query", 
    description: "Can I still register for the Advanced Mathematics course? The deadline shows as passed but I heard it was extended.",
    category: "Academic",
    status: "resolved",
    submitDate: "2024-01-14",
    reply: "Yes, the deadline has been extended to January 25th. Please visit the academic office to complete your registration."
  },
  {
    id: 3,
    title: "Library Book Renewal",
    description: "I need to renew my library books but the online system is not allowing me to do so. My student ID is working fine elsewhere.",
    category: "Library", 
    status: "pending",
    submitDate: "2024-01-13",
    reply: null
  },
  {
    id: 4,
    title: "Exam Hall Ticket",
    description: "I haven't received my exam hall ticket yet. My classmates have already got theirs. Should I be worried?",
    category: "Examination",
    status: "resolved", 
    submitDate: "2024-01-12",
    reply: "Hall tickets are sent in batches. Yours will be available by January 18th. You can also download it from the student portal."
  }
];

const getStatusColor = (status: string) => {
  switch (status) {
    case "resolved":
      return "bg-success text-success-foreground";
    case "pending":
      return "bg-warning text-warning-foreground";
    case "in-progress":
      return "bg-primary text-primary-foreground";
    default:
      return "bg-muted text-muted-foreground";
  }
};

const getStatusIcon = (status: string) => {
  switch (status) {
    case "resolved":
      return <CheckCircle className="h-4 w-4" />;
    case "pending":
      return <Clock className="h-4 w-4" />;
    case "in-progress":
      return <AlertCircle className="h-4 w-4" />;
    default:
      return <MessageSquare className="h-4 w-4" />;
  }
};

export const QueriesPage = () => {
  const [showNewQuery, setShowNewQuery] = useState(false);
  const [newQuery, setNewQuery] = useState({
    title: "",
    description: "",
    category: ""
  });

  const handleSubmitQuery = () => {
    // Here you would implement the query submission logic
    console.log("Submitting query:", newQuery);
    setShowNewQuery(false);
    setNewQuery({ title: "", description: "", category: "" });
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div className="flex items-center space-x-3">
          <div className="p-3 bg-success/10 rounded-lg">
            <HelpCircle className="h-6 w-6 text-success" />
          </div>
          <div>
            <h1 className="text-2xl font-bold">Query Help Desk</h1>
            <p className="text-muted-foreground">Submit queries and get assistance</p>
          </div>
        </div>
        
        <Button 
          className="bg-gradient-primary border-0"
          onClick={() => setShowNewQuery(!showNewQuery)}
        >
          <Plus className="h-4 w-4 mr-2" />
          New Query
        </Button>
      </div>

      {/* New Query Form */}
      {showNewQuery && (
        <Card className="shadow-soft border-primary/20">
          <CardHeader>
            <CardTitle className="text-lg">Submit New Query</CardTitle>
            <CardDescription>Describe your issue and we'll help you resolve it</CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="space-y-2">
              <label className="text-sm font-medium">Subject</label>
              <Input
                placeholder="Brief title for your query"
                value={newQuery.title}
                onChange={(e) => setNewQuery({ ...newQuery, title: e.target.value })}
              />
            </div>
            
            <div className="space-y-2">
              <label className="text-sm font-medium">Category</label>
              <Select onValueChange={(value) => setNewQuery({ ...newQuery, category: value })}>
                <SelectTrigger>
                  <SelectValue placeholder="Select category" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="academic">Academic</SelectItem>
                  <SelectItem value="technical">Technical</SelectItem>
                  <SelectItem value="library">Library</SelectItem>
                  <SelectItem value="examination">Examination</SelectItem>
                  <SelectItem value="fees">Fees & Finance</SelectItem>
                  <SelectItem value="other">Other</SelectItem>
                </SelectContent>
              </Select>
            </div>
            
            <div className="space-y-2">
              <label className="text-sm font-medium">Description</label>
              <Textarea
                placeholder="Provide detailed information about your query"
                value={newQuery.description}
                onChange={(e) => setNewQuery({ ...newQuery, description: e.target.value })}
                rows={4}
              />
            </div>
            
            <div className="flex gap-2">
              <Button onClick={handleSubmitQuery} className="bg-gradient-primary border-0">
                Submit Query
              </Button>
              <Button variant="outline" onClick={() => setShowNewQuery(false)}>
                Cancel
              </Button>
            </div>
          </CardContent>
        </Card>
      )}

      {/* Queries List */}
      <div className="space-y-4">
        {queries.map((query) => (
          <Card key={query.id} className="shadow-soft hover:shadow-medium transition-all duration-300">
            <CardHeader className="pb-3">
              <div className="flex items-start justify-between">
                <div className="space-y-2">
                  <CardTitle className="text-lg">{query.title}</CardTitle>
                  <div className="flex items-center gap-2">
                    <Badge variant="secondary">{query.category}</Badge>
                    <Badge className={getStatusColor(query.status)}>
                      {getStatusIcon(query.status)}
                      <span className="ml-1 capitalize">{query.status}</span>
                    </Badge>
                  </div>
                </div>
                <span className="text-sm text-muted-foreground">{query.submitDate}</span>
              </div>
            </CardHeader>
            
            <CardContent className="space-y-4">
              <div>
                <h4 className="font-medium text-sm mb-1">Your Query:</h4>
                <p className="text-muted-foreground text-sm leading-relaxed">{query.description}</p>
              </div>
              
              {query.reply && (
                <div className="bg-success/5 border border-success/20 rounded-lg p-3">
                  <h4 className="font-medium text-sm mb-1 text-success">Response:</h4>
                  <p className="text-sm leading-relaxed">{query.reply}</p>
                </div>
              )}
              
              {query.status === "pending" && (
                <div className="bg-warning/5 border border-warning/20 rounded-lg p-3">
                  <p className="text-sm text-warning">⏳ Your query is being reviewed. We'll respond within 24-48 hours.</p>
                </div>
              )}
            </CardContent>
          </Card>
        ))}
      </div>

      {queries.length === 0 && (
        <Card className="shadow-soft">
          <CardContent className="py-12 text-center">
            <HelpCircle className="h-12 w-12 text-muted-foreground mx-auto mb-4" />
            <p className="text-lg font-medium text-muted-foreground">No queries yet</p>
            <p className="text-sm text-muted-foreground">Click "New Query" to submit your first question</p>
          </CardContent>
        </Card>
      )}
    </div>
  );
};