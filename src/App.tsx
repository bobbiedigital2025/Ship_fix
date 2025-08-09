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
import { Suspense, lazy } from "react";
import { Loader2 } from "lucide-react";

// Critical pages - load immediately
import Index from "./pages/Index";

// Non-critical pages - lazy load for faster initial loading
const Configuration = lazy(() => import("./pages/Configuration"));
const MCPDashboard = lazy(() => import("./pages/MCPDashboard"));
const Support = lazy(() => import("./pages/Support"));
const Profile = lazy(() => import("./pages/Profile"));
const Documentation = lazy(() => import("./pages/Documentation"));
const AIAssistant = lazy(() => import("./pages/AIAssistant"));
const PrivacyPolicy = lazy(() => import("./pages/PrivacyPolicy"));
const TermsOfService = lazy(() => import("./pages/TermsOfService"));
const NotFound = lazy(() => import("./pages/NotFound"));
const FileManagement = lazy(() => import("./pages/FileManagement"));

// Enhanced query client with optimizations
const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      // Cache queries for 5 minutes by default
      staleTime: 5 * 60 * 1000,
      // Keep cache for 10 minutes
      gcTime: 10 * 60 * 1000,
      // Retry failed queries
      retry: 3,
      // Retry with exponential backoff
      retryDelay: attemptIndex => Math.min(1000 * 2 ** attemptIndex, 30000),
    },
    mutations: {
      // Retry mutations once
      retry: 1,
    },
  },
});

// Loading component for Suspense fallback
const LoadingSpinner = () => (
  <div className="flex items-center justify-center min-h-screen">
    <div className="flex flex-col items-center space-y-4">
      <Loader2 className="w-8 h-8 animate-spin text-primary" />
      <p className="text-sm text-muted-foreground">Loading...</p>
    </div>
  </div>
);

const App = () => (
  <ThemeProvider defaultTheme="light">
    <QueryClientProvider client={queryClient}>
      <TooltipProvider>
        <Toaster />
        <Sonner />
        <BrowserRouter>
          <Suspense fallback={<LoadingSpinner />}>
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
              <Route path="/file-management" element={<FileManagement />} />
              
              {/* Legal pages - publicly accessible */}
              <Route path="/privacy" element={<PrivacyPolicy />} />
              <Route path="/terms" element={<TermsOfService />} />
              
              <Route path="*" element={<NotFound />} />
            </Routes>
          </Suspense>
        </BrowserRouter>
        <CookieConsentBanner />
        <GoogleAdsIntegration />
        <PWAInstallPrompt />
      </TooltipProvider>
    </QueryClientProvider>
  </ThemeProvider>
);

export default App;