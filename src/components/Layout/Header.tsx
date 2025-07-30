import React from 'react';
import { Button } from '@/components/ui/button';
import { Bell, User, ArrowLeft, Home } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import MobileNav from '@/components/ui/mobile-nav';

interface HeaderProps {
  onMenuClick?: () => void;
  title?: string;
  showBackButton?: boolean;
}

const Header: React.FC<HeaderProps> = ({ onMenuClick, title = "Citizen Report", showBackButton = false }) => {
  const navigate = useNavigate();

  const handleLogoClick = () => {
    navigate('/');
  };

  const handleBackClick = () => {
    navigate(-1);
  };

  const handleProfileClick = () => {
    navigate('/admin');
  };

  return (
    <header className="bg-card border-b border-border shadow-elegant sticky top-0 z-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center h-16">
          <div className="flex items-center space-x-4">
            {showBackButton && (
              <Button
                variant="ghost"
                size="sm"
                onClick={handleBackClick}
                className="mr-2"
              >
                <ArrowLeft className="h-5 w-5" />
              </Button>
            )}
            <MobileNav />
            <div className="flex items-center space-x-2 cursor-pointer" onClick={handleLogoClick}>
              <div className="w-8 h-8 gradient-primary rounded-lg flex items-center justify-center">
                <span className="text-primary-foreground font-bold text-sm">CR</span>
              </div>
              <h1 className="text-xl font-semibold text-foreground">{title}</h1>
            </div>
          </div>
          
          {/* Navigation Menu */}
          <nav className="hidden md:flex items-center space-x-6">
            <Button variant="ghost" onClick={() => navigate('/')}>
              <Home className="h-4 w-4 mr-2" />
              Home
            </Button>
            <Button variant="ghost" onClick={() => navigate('/complaint')}>
              Report Issue
            </Button>
            <Button variant="ghost" onClick={() => navigate('/track')}>
              Track Status
            </Button>
          </nav>
          
          <div className="flex items-center space-x-4">
            <Button variant="ghost" size="sm" className="relative">
              <Bell className="h-5 w-5" />
              <span className="absolute -top-1 -right-1 bg-destructive text-destructive-foreground text-xs rounded-full h-4 w-4 flex items-center justify-center">3</span>
            </Button>
            
            <Button variant="ghost" size="sm" onClick={handleProfileClick}>
              <User className="h-5 w-5" />
            </Button>
          </div>
        </div>
      </div>
    </header>
  );
};

export default Header;