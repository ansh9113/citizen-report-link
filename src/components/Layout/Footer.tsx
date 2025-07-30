import React from 'react';
import { useNavigate } from 'react-router-dom';

const Footer: React.FC = () => {
  const navigate = useNavigate();
  return (
    <footer className="bg-card border-t border-border mt-auto">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
          <div className="col-span-1 md:col-span-2">
            <div className="flex items-center space-x-2 mb-4">
              <div className="w-8 h-8 gradient-primary rounded-lg flex items-center justify-center">
                <span className="text-primary-foreground font-bold text-sm">CR</span>
              </div>
              <span className="text-lg font-semibold">Citizen Report</span>
            </div>
            <p className="text-muted-foreground text-sm mb-4">
              Empowering citizens to report issues and track their resolution in real-time. 
              Building better communities through transparent governance.
            </p>
          </div>
          
          <div>
            <h3 className="font-medium mb-3">Quick Links</h3>
            <ul className="space-y-2 text-sm text-muted-foreground">
              <li><button onClick={() => navigate('/complaint')} className="hover:text-primary transition-smooth text-left">Report Issue</button></li>
              <li><button onClick={() => navigate('/track')} className="hover:text-primary transition-smooth text-left">Track Status</button></li>
              <li><button onClick={() => navigate('/admin')} className="hover:text-primary transition-smooth text-left">Admin Panel</button></li>
              <li><a href="mailto:support@citizenreport.com" className="hover:text-primary transition-smooth">Contact Us</a></li>
            </ul>
          </div>
          
          <div>
            <h3 className="font-medium mb-3">Support</h3>
            <ul className="space-y-2 text-sm text-muted-foreground">
              <li><a href="#" className="hover:text-primary transition-smooth">Privacy Policy</a></li>
              <li><a href="#" className="hover:text-primary transition-smooth">Terms of Service</a></li>
              <li><a href="#" className="hover:text-primary transition-smooth">Data Protection</a></li>
              <li><a href="#" className="hover:text-primary transition-smooth">Accessibility</a></li>
            </ul>
          </div>
        </div>
        
        <div className="border-t border-border mt-8 pt-8 text-center text-sm text-muted-foreground">
          <p>&copy; 2024 Citizen Report System. All rights reserved.</p>
        </div>
      </div>
    </footer>
  );
};

export default Footer;