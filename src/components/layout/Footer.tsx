import React from 'react';
import { Link } from 'react-router-dom';
import { Separator } from '@/components/ui/separator';

const Footer: React.FC = () => {
  const currentYear = new Date().getFullYear();

  return (
    <footer className="bg-white border-t border-gray-200 mt-auto">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
          {/* Company Info */}
          <div className="col-span-1 md:col-span-2">
            <h3 className="text-lg font-semibold text-gray-900 mb-4">Ship_fix</h3>
            <p className="text-gray-600 mb-4">
              Advanced supply chain automation and tariff analysis platform powered by MCP technology. 
              Optimize your shipping routes, monitor tariffs, and automate cost mitigation strategies.
            </p>
            <p className="text-sm text-gray-500">
              © {currentYear} Bobbie Digital. All rights reserved.
            </p>
          </div>

          {/* Quick Links */}
          <div>
            <h4 className="text-sm font-semibold text-gray-900 uppercase tracking-wide mb-4">
              Platform
            </h4>
            <ul className="space-y-2">
              <li>
                <Link to="/configuration" className="text-gray-600 hover:text-gray-900 text-sm">
                  Configuration
                </Link>
              </li>
              <li>
                <Link to="/mcp" className="text-gray-600 hover:text-gray-900 text-sm">
                  MCP Dashboard
                </Link>
              </li>
              <li>
                <Link to="/support" className="text-gray-600 hover:text-gray-900 text-sm">
                  Support
                </Link>
              </li>
              <li>
                <Link to="/documentation" className="text-gray-600 hover:text-gray-900 text-sm">
                  Documentation
                </Link>
              </li>
            </ul>
          </div>

          {/* Legal Links */}
          <div>
            <h4 className="text-sm font-semibold text-gray-900 uppercase tracking-wide mb-4">
              Legal
            </h4>
            <ul className="space-y-2">
              <li>
                <Link to="/privacy" className="text-gray-600 hover:text-gray-900 text-sm">
                  Privacy Policy
                </Link>
              </li>
              <li>
                <Link to="/terms" className="text-gray-600 hover:text-gray-900 text-sm">
                  Terms of Service
                </Link>
              </li>
              <li>
                <a 
                  href="mailto:privacy@bobbiedigital.com" 
                  className="text-gray-600 hover:text-gray-900 text-sm"
                >
                  Contact Privacy
                </a>
              </li>
              <li>
                <a 
                  href="mailto:marketing-support@bobbiedigital.com" 
                  className="text-gray-600 hover:text-gray-900 text-sm"
                >
                  Marketing Support
                </a>
              </li>
            </ul>
          </div>
        </div>

        <Separator className="my-6" />
        
        {/* Bottom Row */}
        <div className="flex flex-col md:flex-row justify-between items-center">
          <div className="text-sm text-gray-500">
            Powered by MCP • Supabase • AI Automation
          </div>
          <div className="flex space-x-6 mt-4 md:mt-0">
            <Link to="/privacy" className="text-xs text-gray-500 hover:text-gray-700">
              Privacy
            </Link>
            <Link to="/terms" className="text-xs text-gray-500 hover:text-gray-700">
              Terms
            </Link>
            <span className="text-xs text-gray-500">
              Cookie Settings
            </span>
          </div>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
