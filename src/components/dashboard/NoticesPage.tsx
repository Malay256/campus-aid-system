import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Bell, Calendar, AlertCircle, Info, CheckCircle } from "lucide-react";

const notices = [
  {
    id: 1,
    title: "Mid-term Examination Schedule Released",
    content: "The mid-term examination schedule for all courses has been published. Please check the detailed timetable in the examination section.",
    type: "important",
    date: "2024-01-15",
    time: "09:30 AM"
  },
  {
    id: 2,
    title: "Library Hours Extended During Exams", 
    content: "The library will remain open 24/7 starting from January 20th to support students during the examination period.",
    type: "info",
    date: "2024-01-14",
    time: "02:15 PM"
  },
  {
    id: 3,
    title: "Tech Fest 2024 Registration Open",
    content: "Annual Tech Fest registration is now open! Join us for workshops, competitions, and networking opportunities. Limited seats available.",
    type: "event",
    date: "2024-01-13",
    time: "11:45 AM"
  },
  {
    id: 4,
    title: "Campus WiFi Maintenance",
    content: "The campus WiFi will undergo maintenance on January 18th from 2 AM to 6 AM. Alternative connection points will be available.",
    type: "maintenance",
    date: "2024-01-12",
    time: "04:20 PM"
  },
  {
    id: 5,
    title: "New Course Registration Deadline Extended",
    content: "Due to popular demand, the deadline for new course registration has been extended to January 25th. Contact academic office for assistance.",
    type: "deadline",
    date: "2024-01-11",
    time: "01:30 PM"
  }
];

const getNoticeIcon = (type: string) => {
  switch (type) {
    case "important":
      return <AlertCircle className="h-5 w-5 text-destructive" />;
    case "event":
      return <Calendar className="h-5 w-5 text-accent-purple" />;
    case "maintenance":
      return <Info className="h-5 w-5 text-warning" />;
    case "deadline":
      return <CheckCircle className="h-5 w-5 text-success" />;
    default:
      return <Bell className="h-5 w-5 text-primary" />;
  }
};

const getNoticeBadge = (type: string) => {
  switch (type) {
    case "important":
      return <Badge variant="destructive">Important</Badge>;
    case "event":
      return <Badge className="bg-accent-purple text-white">Event</Badge>;
    case "maintenance":
      return <Badge className="bg-warning text-warning-foreground">Maintenance</Badge>;
    case "deadline":
      return <Badge className="bg-success text-success-foreground">Deadline</Badge>;
    default:
      return <Badge variant="secondary">Info</Badge>;
  }
};

export const NoticesPage = () => {
  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center space-x-3">
        <div className="p-3 bg-warning/10 rounded-lg">
          <Bell className="h-6 w-6 text-warning" />
        </div>
        <div>
          <h1 className="text-2xl font-bold">Notices & Announcements</h1>
          <p className="text-muted-foreground">Stay updated with the latest campus news</p>
        </div>
      </div>

      {/* Notices List */}
      <div className="space-y-4">
        {notices.map((notice) => (
          <Card key={notice.id} className="shadow-soft hover:shadow-medium transition-all duration-300">
            <CardHeader className="pb-3">
              <div className="flex items-start justify-between">
                <div className="flex items-start space-x-3 flex-1">
                  {getNoticeIcon(notice.type)}
                  <div className="flex-1 min-w-0">
                    <CardTitle className="text-lg leading-tight">{notice.title}</CardTitle>
                    <div className="flex items-center space-x-2 mt-1">
                      {getNoticeBadge(notice.type)}
                      <span className="text-sm text-muted-foreground">
                        {notice.date} at {notice.time}
                      </span>
                    </div>
                  </div>
                </div>
              </div>
            </CardHeader>
            <CardContent>
              <p className="text-muted-foreground leading-relaxed">{notice.content}</p>
            </CardContent>
          </Card>
        ))}
      </div>

      {/* Load More */}
      <div className="text-center py-4">
        <p className="text-sm text-muted-foreground">
          Showing 5 most recent notices • <span className="text-primary cursor-pointer hover:underline">View all notices</span>
        </p>
      </div>
    </div>
  );
};