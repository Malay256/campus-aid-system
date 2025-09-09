import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { HelpCircle, Plus, CheckCircle, Clock, AlertCircle, MessageSquare } from "lucide-react";
import { useState, useEffect } from "react";
import { supabase } from "@/integrations/supabase/client";
import { useAuth } from "@/hooks/useAuth";
import { toast } from "sonner";

type Query = {
  id: string;
  subject: string;
  description: string;
  category: string;
  status: string;
  priority: string;
  response: string | null;
  created_at: string;
  user_id: string;
};

const getStatusColor = (status: string) => {
  switch (status) {
    case "open":
      return "bg-warning text-warning-foreground";
    case "in-progress":
      return "bg-primary text-primary-foreground";
    case "resolved":
      return "bg-success text-success-foreground";
    default:
      return "bg-muted text-muted-foreground";
  }
};

const getStatusIcon = (status: string) => {
  switch (status) {
    case "open":
      return <Clock className="h-4 w-4" />;
    case "in-progress":
      return <AlertCircle className="h-4 w-4" />;
    case "resolved":
      return <CheckCircle className="h-4 w-4" />;
    default:
      return <HelpCircle className="h-4 w-4" />;
  }
};

export const QueriesPage = () => {
  const [showNewQueryForm, setShowNewQueryForm] = useState(false);
  const [queries, setQueries] = useState<Query[]>([]);
  const [loading, setLoading] = useState(true);
  const { user } = useAuth();
  
  const [newQuery, setNewQuery] = useState({
    subject: '',
    category: '',
    description: ''
  });

  useEffect(() => {
    if (user) {
      fetchQueries();
    }
  }, [user]);

  const fetchQueries = async () => {
    if (!user) return;
    
    try {
      const { data, error } = await supabase
        .from('queries')
        .select('*')
        .eq('user_id', user.id)
        .order('created_at', { ascending: false });

      if (error) throw error;
      setQueries(data || []);
    } catch (error: any) {
      toast.error('Failed to fetch queries');
      console.error('Error:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleSubmitQuery = async () => {
    if (!user || !newQuery.subject || !newQuery.category || !newQuery.description) {
      toast.error('Please fill in all fields');
      return;
    }

    try {
      const { error } = await supabase
        .from('queries')
        .insert({
          subject: newQuery.subject,
          category: newQuery.category,
          description: newQuery.description,
          user_id: user.id
        });

      if (error) throw error;

      toast.success('Query submitted successfully!');
      setNewQuery({ subject: '', category: '', description: '' });
      setShowNewQueryForm(false);
      fetchQueries();
    } catch (error: any) {
      toast.error('Failed to submit query');
      console.error('Error:', error);
    }
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
            <h1 className="text-2xl font-bold">Help Desk</h1>
            <p className="text-muted-foreground">Submit queries and get assistance</p>
          </div>
        </div>
        
        <Button 
          className="bg-gradient-primary border-0"
          onClick={() => setShowNewQueryForm(!showNewQueryForm)}
        >
          <Plus className="h-4 w-4 mr-2" />
          New Query
        </Button>
      </div>

      {/* New Query Form */}
      {showNewQueryForm && (
        <Card className="shadow-soft border-primary/20">
          <CardHeader>
            <CardTitle className="text-lg">Submit New Query</CardTitle>
            <CardDescription>Describe your issue and we'll help you resolve it</CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="subject">Subject</Label>
              <Input
                id="subject"
                placeholder="Enter query title"
                value={newQuery.subject}
                onChange={(e) => setNewQuery(prev => ({ ...prev, subject: e.target.value }))}
              />
            </div>
            
            <div className="space-y-2">
              <Label htmlFor="category">Category</Label>
              <Select value={newQuery.category} onValueChange={(value) => setNewQuery(prev => ({ ...prev, category: value }))}>
                <SelectTrigger>
                  <SelectValue placeholder="Select a category" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="technical">Technical</SelectItem>
                  <SelectItem value="academic">Academic</SelectItem>
                  <SelectItem value="administrative">Administrative</SelectItem>
                  <SelectItem value="general">General</SelectItem>
                </SelectContent>
              </Select>
            </div>
            
            <div className="space-y-2">
              <Label htmlFor="description">Description</Label>
              <Textarea
                id="description"
                placeholder="Describe your query in detail..."
                rows={4}
                value={newQuery.description}
                onChange={(e) => setNewQuery(prev => ({ ...prev, description: e.target.value }))}
              />
            </div>
            
            <div className="flex gap-2">
              <Button onClick={handleSubmitQuery} className="bg-gradient-primary border-0">
                Submit Query
              </Button>
              <Button variant="outline" onClick={() => setShowNewQueryForm(false)}>
                Cancel
              </Button>
            </div>
          </CardContent>
        </Card>
      )}

      {/* Queries List */}
      {loading ? (
        <div className="text-center py-8">
          <p className="text-muted-foreground">Loading queries...</p>
        </div>
      ) : (
        <div className="space-y-4">
          {queries.map((query) => (
            <Card key={query.id} className="shadow-soft hover:shadow-medium transition-all duration-300">
              <CardHeader className="pb-3">
                <div className="flex items-start justify-between">
                  <div className="space-y-2">
                    <CardTitle className="text-lg">{query.subject}</CardTitle>
                    <div className="flex items-center gap-2">
                      <Badge variant="secondary">{query.category}</Badge>
                      <Badge className={getStatusColor(query.status)}>
                        <div className="flex items-center gap-1">
                          {getStatusIcon(query.status)}
                          {query.status}
                        </div>
                      </Badge>
                      <Badge 
                        variant="outline" 
                        className={query.priority === 'high' ? 'border-destructive text-destructive' : ''}
                      >
                        {query.priority} priority
                      </Badge>
                    </div>
                    <p className="text-sm text-muted-foreground">
                      Submitted on {new Date(query.created_at).toLocaleDateString()}
                    </p>
                  </div>
                </div>
              </CardHeader>
              
              <CardContent className="space-y-3">
                <p className="text-muted-foreground leading-relaxed">{query.description}</p>
                
                {query.response && (
                  <div className="border-t pt-3">
                    <div className="flex items-start space-x-2">
                      <MessageSquare className="h-4 w-4 text-primary mt-1" />
                      <div>
                        <p className="text-sm font-medium text-primary">Admin Reply</p>
                        <p className="text-sm text-muted-foreground mt-1">{query.response}</p>
                      </div>
                    </div>
                  </div>
                )}
              </CardContent>
            </Card>
          ))}
          
          {queries.length === 0 && (
            <Card className="shadow-soft">
              <CardContent className="py-12 text-center">
                <HelpCircle className="h-12 w-12 text-muted-foreground mx-auto mb-4" />
                <p className="text-lg font-medium text-muted-foreground">No queries yet</p>
                <p className="text-sm text-muted-foreground">Submit your first query to get help</p>
              </CardContent>
            </Card>
          )}
        </div>
      )}
    </div>
  );
};