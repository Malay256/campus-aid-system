import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";
import { Calendar, Clock, MapPin, Users, Search, Plus } from "lucide-react";
import { useState } from "react";

const events = [
  {
    id: 1,
    title: "Tech Fest 2024",
    description: "Annual technology festival featuring workshops, competitions, and networking opportunities with industry professionals.",
    date: "2024-02-15",
    time: "09:00 AM",
    venue: "Main Auditorium",
    category: "Festival",
    registrations: 245,
    maxCapacity: 500,
    status: "open"
  },
  {
    id: 2,
    title: "Career Guidance Workshop",
    description: "Interactive session on career planning, resume building, and interview preparation with HR experts.",
    date: "2024-02-08", 
    time: "02:00 PM",
    venue: "Conference Hall A",
    category: "Workshop",
    registrations: 89,
    maxCapacity: 100,
    status: "open"
  },
  {
    id: 3,
    title: "Science Symposium",
    description: "Research presentations by students and faculty members on latest scientific developments and innovations.",
    date: "2024-02-22",
    time: "10:30 AM", 
    venue: "Science Block",
    category: "Academic",
    registrations: 156,
    maxCapacity: 200,
    status: "open"
  },
  {
    id: 4,
    title: "Cultural Night",
    description: "Evening of music, dance, and cultural performances by students from various departments.",
    date: "2024-01-30",
    time: "07:00 PM",
    venue: "Open Air Theatre", 
    category: "Cultural",
    registrations: 320,
    maxCapacity: 300,
    status: "closed"
  },
  {
    id: 5,
    title: "Entrepreneurship Bootcamp",
    description: "Three-day intensive program on startup fundamentals, business planning, and investor pitching.",
    date: "2024-02-12",
    time: "09:00 AM",
    venue: "Innovation Hub",
    category: "Workshop", 
    registrations: 67,
    maxCapacity: 80,
    status: "open"
  }
];

const getStatusColor = (status: string) => {
  switch (status) {
    case "open":
      return "bg-success text-success-foreground";
    case "closed": 
      return "bg-destructive text-destructive-foreground";
    case "full":
      return "bg-warning text-warning-foreground";
    default:
      return "bg-muted text-muted-foreground";
  }
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
  const [filteredEvents, setFilteredEvents] = useState(events);

  const handleSearch = (query: string) => {
    setSearchQuery(query);
    const filtered = events.filter(event => 
      event.title.toLowerCase().includes(query.toLowerCase()) ||
      event.description.toLowerCase().includes(query.toLowerCase()) ||
      event.category.toLowerCase().includes(query.toLowerCase())
    );
    setFilteredEvents(filtered);
  };

  const handleRegister = (eventId: number) => {
    // Here you would implement the registration logic
    console.log(`Registering for event ${eventId}`);
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
        
        <Button className="bg-gradient-primary border-0">
          <Plus className="h-4 w-4 mr-2" />
          Create Event
        </Button>
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
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {filteredEvents.map((event) => (
          <Card key={event.id} className="shadow-soft hover:shadow-medium transition-all duration-300">
            <CardHeader className="pb-3">
              <div className="flex items-start justify-between">
                <div className="space-y-2">
                  <CardTitle className="text-xl">{event.title}</CardTitle>
                  <div className="flex items-center gap-2">
                    <Badge className={getCategoryColor(event.category)}>{event.category}</Badge>
                    <Badge className={getStatusColor(event.status)}>
                      {event.status === "open" ? "Open" : event.status === "closed" ? "Registration Closed" : "Full"}
                    </Badge>
                  </div>
                </div>
              </div>
            </CardHeader>
            
            <CardContent className="space-y-4">
              <p className="text-muted-foreground text-sm leading-relaxed">{event.description}</p>
              
              <div className="space-y-2 text-sm">
                <div className="flex items-center space-x-2 text-muted-foreground">
                  <Calendar className="h-4 w-4" />
                  <span>{event.date}</span>
                  <Clock className="h-4 w-4 ml-4" />
                  <span>{event.time}</span>
                </div>
                
                <div className="flex items-center space-x-2 text-muted-foreground">
                  <MapPin className="h-4 w-4" />
                  <span>{event.venue}</span>
                </div>
                
                <div className="flex items-center space-x-2 text-muted-foreground">
                  <Users className="h-4 w-4" />
                  <span>{event.registrations}/{event.maxCapacity} registered</span>
                </div>
              </div>
              
              <div className="pt-2">
                {event.status === "open" && (
                  <Button 
                    className="w-full"
                    onClick={() => handleRegister(event.id)}
                  >
                    Register Now
                  </Button>
                )}
                {event.status === "closed" && (
                  <Button variant="secondary" className="w-full" disabled>
                    Registration Closed
                  </Button>
                )}
                {event.status === "full" && (
                  <Button variant="secondary" className="w-full" disabled>
                    Event Full
                  </Button>
                )}
              </div>
            </CardContent>
          </Card>
        ))}
      </div>

      {filteredEvents.length === 0 && (
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