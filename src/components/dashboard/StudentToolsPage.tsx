import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { ExternalLink, Briefcase, Palette, Bot, Globe, FileText, Calculator, Calendar } from "lucide-react";

const tools = [
  {
    name: "Canva",
    description: "Design presentations, posters, and graphics for your projects",
    url: "https://www.canva.com",
    icon: Palette,
    color: "bg-gradient-to-br from-purple-500 to-pink-500",
    category: "Design"
  },
  {
    name: "ChatGPT",
    description: "AI assistant for research, writing, and problem-solving",
    url: "https://chat.openai.com",
    icon: Bot,
    color: "bg-gradient-to-br from-green-500 to-teal-500",
    category: "AI Tools"
  },
  {
    name: "Gemini AI",
    description: "Google's AI for complex questions and analysis",
    url: "https://gemini.google.com",
    icon: Bot,
    color: "bg-gradient-to-br from-blue-500 to-indigo-500",
    category: "AI Tools"
  },
  {
    name: "Google Docs",
    description: "Collaborative document editing and sharing",
    url: "https://docs.google.com",
    icon: FileText,
    color: "bg-gradient-to-br from-blue-600 to-blue-800",
    category: "Productivity"
  },
  {
    name: "Google Sheets",
    description: "Spreadsheets for data analysis and calculations",
    url: "https://sheets.google.com",
    icon: Calculator,
    color: "bg-gradient-to-br from-green-600 to-green-800",
    category: "Productivity"
  },
  {
    name: "Google Drive",
    description: "Cloud storage for all your academic files",
    url: "https://drive.google.com",
    icon: Globe,
    color: "bg-gradient-to-br from-yellow-500 to-orange-500",
    category: "Storage"
  },
  {
    name: "Google Calendar",
    description: "Schedule management and event planning",
    url: "https://calendar.google.com",
    icon: Calendar,
    color: "bg-gradient-to-br from-red-500 to-pink-500",
    category: "Organization"
  },
  {
    name: "Grammarly",
    description: "Writing assistant for grammar and style improvement",
    url: "https://www.grammarly.com",
    icon: FileText,
    color: "bg-gradient-to-br from-emerald-500 to-teal-600",
    category: "Writing"
  },
  {
    name: "Notion",
    description: "All-in-one workspace for notes and project management",
    url: "https://www.notion.so",
    icon: Globe,
    color: "bg-gradient-to-br from-gray-600 to-gray-800",
    category: "Productivity"
  }
];

const categories = ["All", "AI Tools", "Design", "Productivity", "Storage", "Organization", "Writing"];

export const StudentToolsPage = () => {
  const handleOpenTool = (url: string, name: string) => {
    window.open(url, '_blank', 'noopener,noreferrer');
    console.log(`Opening ${name}`);
  };

  const getToolsByCategory = (category: string) => {
    if (category === "All") return tools;
    return tools.filter(tool => tool.category === category);
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center space-x-3">
        <div className="p-3 bg-muted/50 rounded-lg">
          <Briefcase className="h-6 w-6 text-muted-foreground" />
        </div>
        <div>
          <h1 className="text-2xl font-bold">Student Tools</h1>
          <p className="text-muted-foreground">Quick access to useful educational tools and resources</p>
        </div>
      </div>

      {/* Category Tabs */}
      <div className="flex flex-wrap gap-2">
        {categories.map(category => (
          <Button
            key={category}
            variant="outline"
            size="sm"
            className="rounded-full"
          >
            {category}
          </Button>
        ))}
      </div>

      {/* Tools Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        {tools.map((tool, index) => {
          const Icon = tool.icon;
          return (
            <Card 
              key={index} 
              className="shadow-soft hover:shadow-medium transition-all duration-300 cursor-pointer hover:scale-105 group"
              onClick={() => handleOpenTool(tool.url, tool.name)}
            >
              <CardHeader className="pb-3">
                <div className="flex items-start space-x-3">
                  <div className={`p-3 rounded-lg text-white ${tool.color}`}>
                    <Icon className="h-6 w-6" />
                  </div>
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center justify-between">
                      <CardTitle className="text-lg">{tool.name}</CardTitle>
                      <ExternalLink className="h-4 w-4 text-muted-foreground group-hover:text-primary transition-colors" />
                    </div>
                    <div className="mt-1">
                      <span className="inline-block px-2 py-1 text-xs rounded-full bg-muted text-muted-foreground">
                        {tool.category}
                      </span>
                    </div>
                  </div>
                </div>
              </CardHeader>
              
              <CardContent>
                <CardDescription className="text-sm leading-relaxed">
                  {tool.description}
                </CardDescription>
              </CardContent>
            </Card>
          );
        })}
      </div>

      {/* Quick Access Panel */}
      <Card className="shadow-soft bg-gradient-subtle">
        <CardHeader>
          <CardTitle className="text-lg">Quick Access Tips</CardTitle>
        </CardHeader>
        <CardContent className="space-y-3">
          <div className="flex items-start space-x-3 text-sm">
            <div className="w-2 h-2 bg-primary rounded-full mt-2 flex-shrink-0"></div>
            <p><strong>Bookmark frequently used tools</strong> in your browser for faster access</p>
          </div>
          <div className="flex items-start space-x-3 text-sm">
            <div className="w-2 h-2 bg-primary rounded-full mt-2 flex-shrink-0"></div>
            <p><strong>Use Google Workspace</strong> for seamless collaboration on group projects</p>
          </div>
          <div className="flex items-start space-x-3 text-sm">
            <div className="w-2 h-2 bg-primary rounded-full mt-2 flex-shrink-0"></div>
            <p><strong>AI tools work best</strong> with specific, detailed prompts for your assignments</p>
          </div>
          <div className="flex items-start space-x-3 text-sm">
            <div className="w-2 h-2 bg-primary rounded-full mt-2 flex-shrink-0"></div>
            <p><strong>Always cite AI assistance</strong> when using these tools for academic work</p>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};