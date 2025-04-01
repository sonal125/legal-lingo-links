
import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom";
import { LanguageProvider } from "@/contexts/LanguageContext";
import { AuthProvider } from "@/contexts/AuthContext";
import Index from "./pages/Index";
import NotFound from "./pages/NotFound";
import SignIn from "./pages/SignIn";
import SignUp from "./pages/SignUp";
import Dashboard from "./pages/Dashboard";
import QuizzesList from "./pages/QuizzesList";
import QuizPage from "./pages/QuizPage";
import ShareIssue from "./pages/ShareIssue";
import ReplyClient from "./pages/ReplyClient";
import LegalModules from "./pages/LegalModules";
import Messages from "./pages/Messages";
import { Chatbot } from "./components/Chatbot";

// Protected Route component
const ProtectedRoute = ({ children }: { children: React.ReactNode }) => {
  // Check if user is logged in by looking for the user in localStorage
  const isAuthenticated = localStorage.getItem('user') !== null;
  
  if (!isAuthenticated) {
    // Redirect to login if not authenticated
    return <Navigate to="/sign-in" />;
  }
  
  return <>{children}</>;
};

const queryClient = new QueryClient();

const App = () => (
  <QueryClientProvider client={queryClient}>
    <AuthProvider>
      <LanguageProvider>
        <TooltipProvider>
          <Toaster />
          <Sonner />
          <BrowserRouter>
            <Routes>
              {/* Public routes */}
              <Route path="/" element={<Index />} />
              <Route path="/sign-in" element={<SignIn />} />
              <Route path="/sign-up" element={<SignUp />} />
              <Route path="/chatbot" element={<div className="h-screen"><Chatbot /></div>} />
              
              {/* Protected routes */}
              <Route path="/dashboard" element={<ProtectedRoute><Dashboard /></ProtectedRoute>} />
              <Route path="/quizzes" element={<ProtectedRoute><QuizzesList /></ProtectedRoute>} />
              <Route path="/quizzes/:categoryId/:levelId" element={<ProtectedRoute><QuizPage /></ProtectedRoute>} />
              <Route path="/share-issue" element={<ProtectedRoute><ShareIssue /></ProtectedRoute>} />
              <Route path="/reply-client" element={<ProtectedRoute><ReplyClient /></ProtectedRoute>} />
              <Route path="/legal-modules" element={<ProtectedRoute><LegalModules /></ProtectedRoute>} />
              <Route path="/messages" element={<ProtectedRoute><Messages /></ProtectedRoute>} />
              
              {/* Catch-all route */}
              <Route path="*" element={<NotFound />} />
            </Routes>
          </BrowserRouter>
        </TooltipProvider>
      </LanguageProvider>
    </AuthProvider>
  </QueryClientProvider>
);

export default App;
