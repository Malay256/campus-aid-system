import { Button } from "@/components/ui/button";
import { BookOpen, Menu, X } from "lucide-react";
import { useState } from "react";

interface NavbarProps {
  onLoginClick?: () => void;
  onSignupClick?: () => void;
}

export const Navbar = ({ onLoginClick, onSignupClick }: NavbarProps) => {
  const [isMenuOpen, setIsMenuOpen] = useState(false);

  return (
    <nav className="bg-white/95 backdrop-blur-md border-b border-border sticky top-0 z-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center h-16">
          {/* Logo */}
          <div className="flex items-center space-x-2">
            <div className="p-2 bg-gradient-primary rounded-lg">
              <BookOpen className="h-6 w-6 text-white" />
            </div>
            <span className="text-xl font-bold text-foreground">EduPortal</span>
          </div>

          {/* Desktop Navigation */}
          <div className="hidden md:flex items-center space-x-4">
            <Button variant="ghost" className="text-muted-foreground hover:text-foreground">
              About
            </Button>
            <Button variant="ghost" className="text-muted-foreground hover:text-foreground">
              Services
            </Button>
            <Button variant="ghost" className="text-muted-foreground hover:text-foreground">
              Contact
            </Button>
            <Button variant="outline" onClick={onLoginClick}>
              Login
            </Button>
            <Button variant="default" onClick={onSignupClick} className="bg-gradient-primary border-0">
              Sign Up
            </Button>
          </div>

          {/* Mobile menu button */}
          <div className="md:hidden">
            <Button
              variant="ghost"
              size="sm"
              onClick={() => setIsMenuOpen(!isMenuOpen)}
            >
              {isMenuOpen ? <X className="h-5 w-5" /> : <Menu className="h-5 w-5" />}
            </Button>
          </div>
        </div>

        {/* Mobile Navigation */}
        {isMenuOpen && (
          <div className="md:hidden py-4 border-t border-border">
            <div className="flex flex-col space-y-2">
              <Button variant="ghost" className="justify-start text-muted-foreground">
                About
              </Button>
              <Button variant="ghost" className="justify-start text-muted-foreground">
                Services
              </Button>
              <Button variant="ghost" className="justify-start text-muted-foreground">
                Contact
              </Button>
              <div className="pt-2 space-y-2">
                <Button variant="outline" className="w-full" onClick={onLoginClick}>
                  Login
                </Button>
                <Button variant="default" className="w-full bg-gradient-primary border-0" onClick={onSignupClick}>
                  Sign Up
                </Button>
              </div>
            </div>
          </div>
        )}
      </div>
    </nav>
  );
};