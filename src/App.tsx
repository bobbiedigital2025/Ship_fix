import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import { ThemeProvider } from "@/components/theme-provider";
import { RoleGuard } from "@/components/auth/RoleGuard";
import AuthGuard from "@/components/auth/AuthGuard";
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
            {/* Legal pages - publicly accessible */}
            <Route path="/privacy" element={<PrivacyPolicy />} />
            <Route path="/terms" element={<TermsOfService />} />
            
            {/* Protected routes */}
            <Route 
              path="/" 
              element={
                <AuthGuard>
                  <Index />
                </AuthGuard>
              } 
            />
            <Route 
              path="/configuration" 
              element={
                <AuthGuard>
                  <Configuration />
                </AuthGuard>
              } 
            />
            <Route 
              path="/mcp" 
              element={
                <AuthGuard>
                  <RoleGuard allowedRoles={['admin']} fallback={<NotFound />}>
                    <MCPDashboard />
                  </RoleGuard>
                </AuthGuard>
              } 
            />
            <Route 
              path="/support" 
              element={
                <AuthGuard>
                  <Support />
                </AuthGuard>
              } 
            />
            <Route 
              path="/profile" 
              element={
                <AuthGuard>
                  <Profile />
                </AuthGuard>
              } 
            />
            <Route 
              path="/documentation" 
              element={
                <AuthGuard>
                  <Documentation />
                </AuthGuard>
              } 
            />
            <Route 
              path="/ai-assistant" 
              element={
                <AuthGuard>
                  <AIAssistant />
                </AuthGuard>
              } 
            />
            
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