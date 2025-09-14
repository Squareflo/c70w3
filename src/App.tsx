import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import { AuthProvider } from "@/contexts/AuthContext";
import ErrorBoundary from "@/components/ErrorBoundary";
import Index from "./pages/Index";
import SignUp from "./pages/SignUp";
import VerifyEmail from "./pages/VerifyEmail";
import SignUpSuccess from "./pages/SignUpSuccess";
import SignIn from "./pages/SignIn";
import Dashboard from "./pages/Dashboard";
import UploadLogo from "./pages/UploadLogo";
import NotFound from "./pages/NotFound";

const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      retry: 1,
      refetchOnWindowFocus: false,
    },
  },
});

const App = () => (
  <ErrorBoundary>
    <QueryClientProvider client={queryClient}>
      <TooltipProvider>
        <Toaster />
        <Sonner />
        <AuthProvider>
          <BrowserRouter>
            <Routes>
              <Route path="/" element={<Index />} />
              <Route path="/sign-up" element={<SignUp />} />
              <Route path="/verify-email" element={<VerifyEmail />} />
              <Route path="/signup-success" element={<SignUpSuccess />} />
              <Route path="/sign-in" element={<SignIn />} />
              <Route 
                path="/dashboard" 
                element={
                  <ErrorBoundary>
                    <Dashboard />
                  </ErrorBoundary>
                } 
              />
              <Route path="/upload-logo" element={<UploadLogo />} />
              {/* ADD ALL CUSTOM ROUTES ABOVE THE CATCH-ALL "*" ROUTE */}
              <Route path="*" element={<NotFound />} />
            </Routes>
          </BrowserRouter>
        </AuthProvider>
      </TooltipProvider>
    </QueryClientProvider>
  </ErrorBoundary>
);

export default App;
