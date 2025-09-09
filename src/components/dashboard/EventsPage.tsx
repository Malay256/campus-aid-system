import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";
import { Calendar, Clock, MapPin, Users, Search, Plus } from "lucide-react";
import { useState, useEffect } from "react";
import { supabase } from "@/integrations/supabase/client";
import { useRole } from "@/hooks/useRole";
import { useAuth } from "@/hooks/useAuth";
import { toast } from "sonner";

type Event = {
  id: string;
  title: string;
  description: string | null;
  date: string;
  time: string;
  location: string;
  category: string;
  max_participants: number | null;
  current_participants: number;
  created_at: string;
};

const getStatusColor = (currentParticipants: number, maxParticipants: number | null) => {
  if (maxParticipants && currentParticipants >= maxParticipants) {
    return "bg-destructive text-destructive-foreground";
  }
  return "bg-success text-success-foreground";
};

const getStatusText = (currentParticipants: number, maxParticipants: number | null) => {
  if (maxParticipants && currentParticipants >= maxParticipants) {
    return "Full";
  }
  return "Open";
};

const getCategoryColor = (category: string) => {
  switch (category.toLowerCase()) {
    case "festival":
      return "bg-accent-purple/10 text-accent-purple";
    case "workshop":
      return "bg-primary/10 text-primary"; 
    case "academic":
      return "bg-success/10 text-success";
    case "cultural":
      return "bg-warning/10 text-warning";
    default:
      return "bg-muted text-muted-foreground";
  }
};

export const EventsPage = () => {
  const [searchQuery, setSearchQuery] = useState("");
  const [events, setEvents] = useState<Event[]>([]);
  const [filteredEvents, setFilteredEvents] = useState<Event[]>([]);
  const [loading, setLoading] = useState(true);
  const { isAdmin } = useRole();
  const { user } = useAuth();

  useEffect(() => {
    fetchEvents();
  }, []);

  const fetchEvents = async () => {
    try {
      const { data, error } = await supabase
        .from('events')
        .select('*')
        .order('date', { ascending: true });

      if (error) throw error;
      setEvents(data || []);
      setFilteredEvents(data || []);
    } catch (error: any) {
      toast.error('Failed to fetch events');
      console.error('Error:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleSearch = (query: string) => {
    setSearchQuery(query);
    const filtered = events.filter(event => 
      event.title.toLowerCase().includes(query.toLowerCase()) ||
      (event.description && event.description.toLowerCase().includes(query.toLowerCase())) ||
      event.category.toLowerCase().includes(query.toLowerCase())
    );
    setFilteredEvents(filtered);
  };

  const handleRegister = async (eventId: string) => {
    if (!user) {
      toast.error('Please login to register for events');
      return;
    }

    try {
      // Check if user is already registered
      const { data: existingRegistration } = await supabase
        .from('event_registrations')
        .select('id')
        .eq('event_id', eventId)
        .eq('user_id', user.id)
        .single();

      if (existingRegistration) {
        toast.error('You are already registered for this event');
        return;
      }

      // Register for event
      const { error: registrationError } = await supabase
        .from('event_registrations')
        .insert({
          event_id: eventId,
          user_id: user.id
        });

      if (registrationError) throw registrationError;

      // Update current participants count
      const event = events.find(e => e.id === eventId);
      if (event) {
        const { error: updateError } = await supabase
          .from('events')
          .update({ current_participants: event.current_participants + 1 })
          .eq('id', eventId);

        if (updateError) throw updateError;
      }

      toast.success('Successfully registered for the event!');
      fetchEvents(); // Refresh events
    } catch (error: any) {
      toast.error('Failed to register for event');
      console.error('Registration error:', error);
    }
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div className="flex items-center space-x-3">
          <div className="p-3 bg-accent-purple/10 rounded-lg">
            <Calendar className="h-6 w-6 text-accent-purple" />
          </div>
          <div>
            <h1 className="text-2xl font-bold">Events</h1>
            <p className="text-muted-foreground">Discover and register for campus events</p>
          </div>
        </div>
        
        {isAdmin && (
          <Button className="bg-gradient-primary border-0">
            <Plus className="h-4 w-4 mr-2" />
            Create Event
          </Button>
        )}
      </div>

      {/* Search */}
      <Card className="shadow-soft">
        <CardContent className="p-4">
          <div className="relative">
            <Search className="absolute left-3 top-3 h-4 w-4 text-muted-foreground" />
            <Input
              placeholder="Search events..."
              value={searchQuery}
              onChange={(e) => handleSearch(e.target.value)}
              className="pl-10"
            />
          </div>
        </CardContent>
      </Card>

      {/* Events Grid */}
      {loading ? (
        <div className="text-center py-8">
          <p className="text-muted-foreground">Loading events...</p>
        </div>
      ) : (
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          {filteredEvents.map((event) => {
            const status = getStatusText(event.current_participants, event.max_participants);
            return (
              <Card key={event.id} className="shadow-soft hover:shadow-medium transition-all duration-300">
                <CardHeader className="pb-3">
                  <div className="flex items-start justify-between">
                    <div className="space-y-2">
                      <CardTitle className="text-xl">{event.title}</CardTitle>
                      <div className="flex items-center gap-2">
                        <Badge className={getCategoryColor(event.category)}>{event.category}</Badge>
                        <Badge className={getStatusColor(event.current_participants, event.max_participants)}>
                          {status}
                        </Badge>
                      </div>
                    </div>
                  </div>
                </CardHeader>
                
                <CardContent className="space-y-4">
                  {event.description && (
                    <p className="text-muted-foreground text-sm leading-relaxed">{event.description}</p>
                  )}
                  
                  <div className="space-y-2 text-sm">
                    <div className="flex items-center space-x-2 text-muted-foreground">
                      <Calendar className="h-4 w-4" />
                      <span>{new Date(event.date).toLocaleDateString()}</span>
                      <Clock className="h-4 w-4 ml-4" />
                      <span>{event.time}</span>
                    </div>
                    
                    <div className="flex items-center space-x-2 text-muted-foreground">
                      <MapPin className="h-4 w-4" />
                      <span>{event.location}</span>
                    </div>
                    
                    <div className="flex items-center space-x-2 text-muted-foreground">
                      <Users className="h-4 w-4" />
                      <span>
                        {event.current_participants}{event.max_participants ? `/${event.max_participants}` : ''} registered
                      </span>
                    </div>
                  </div>
                  
                  <div className="pt-2">
                    {status === "Open" && (
                      <Button 
                        className="w-full"
                        onClick={() => handleRegister(event.id)}
                      >
                        Register Now
                      </Button>
                    )}
                    {status === "Full" && (
                      <Button variant="secondary" className="w-full" disabled>
                        Event Full
                      </Button>
                    )}
                  </div>
                </CardContent>
              </Card>
            );
          })}
        </div>
      )}

      {filteredEvents.length === 0 && !loading && (
        <Card className="shadow-soft">
          <CardContent className="py-12 text-center">
            <Calendar className="h-12 w-12 text-muted-foreground mx-auto mb-4" />
            <p className="text-lg font-medium text-muted-foreground">No events found</p>
            <p className="text-sm text-muted-foreground">Try adjusting your search criteria</p>
          </CardContent>
        </Card>
      )}
    </div>
  );
};