import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import { ThemeProvider } from "@/components/theme-provider";
import { RoleGuard } from "@/components/auth/RoleGuard";
import { CookieConsentBanner } from "@/components/ui/CookieConsentBanner";
import { GoogleAdsIntegration } from "@/components/ads/GoogleAdsIntegration";
import { PWAInstallPrompt } from "@/components/ui/PWAInstallPrompt";

// Import pages directly (temporarily removing lazy loading for debugging)
import Index from "./pages/Index";
import Configuration from "./pages/Configuration";
import MCPDashboard from "./pages/MCPDashboard";
import Support from "./pages/Support";
import Profile from "./pages/Profile";
import Documentation from "./pages/Documentation";
import AIAssistant from "./pages/AIAssistant";
import PrivacyPolicy from "./pages/PrivacyPolicy";
import TermsOfService from "./pages/TermsOfService";
import NotFound from "./pages/NotFound";

const queryClient = new QueryClient();

const App = () => (
  <ThemeProvider defaultTheme="light">
    <QueryClientProvider client={queryClient}>
      <TooltipProvider>
        <Toaster />
        <Sonner />
        <BrowserRouter>
          <Routes>
            <Route path="/" element={<Index />} />
            
            {/* Configuration accessible to all authenticated users */}
            <Route path="/configuration" element={<Configuration />} />
            
            {/* Admin-only routes */}
            <Route 
              path="/mcp" 
              element={
                <RoleGuard allowedRoles={['admin']} fallback={<NotFound />}>
                  <MCPDashboard />
                </RoleGuard>
              } 
            />
            
            {/* Available to all authenticated users */}
            <Route path="/support" element={<Support />} />
            <Route path="/profile" element={<Profile />} />
            <Route path="/documentation" element={<Documentation />} />
            <Route path="/ai-assistant" element={<AIAssistant />} />
            
            {/* Legal pages - publicly accessible */}
            <Route path="/privacy" element={<PrivacyPolicy />} />
            <Route path="/terms" element={<TermsOfService />} />
            
            <Route path="*" element={<NotFound />} />
          </Routes>
        </BrowserRouter>
        <CookieConsentBanner />
        <GoogleAdsIntegration />
        <PWAInstallPrompt />
      </TooltipProvider>
    </QueryClientProvider>
  </ThemeProvider>
);

export default App;