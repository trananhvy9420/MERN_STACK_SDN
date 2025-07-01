import { Toaster } from "sonner";
import { Toaster as Sonner } from "sonner";
import { TooltipProvider } from "@radix-ui/react-tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import NotFound from "./pages/NotFound";
import Form from "./pages/Form";
import Index from "./pages/Index";
import Dashboard from "./pages/Admin/Dashboard";
import Login from "./pages/AuthPage/LoginForm";
import Register from "./pages/AuthPage/SignUpForm";
import PlayerDetailPage from "./pages/PlayerDetail";
import PlayerListPage from "./pages/PlayerListPage";
import Profile from "./pages/Profile";
import ProfilePage from "./pages/ProfilePage";
const queryClient = new QueryClient();

const App = () => (
  <QueryClientProvider client={queryClient}>
    <TooltipProvider>
      <Toaster />
      <Sonner />
      <BrowserRouter>
        <Routes>
          <Route path="/" element={<Index />} />
          <Route path="/players" element={<PlayerListPage />} />
          <Route path="/form" element={<Form />} />
          {/* ADD ALL CUSTOM ROUTES ABOVE THE CATCH-ALL "*" ROUTE */}
          <Route path="/dashboardadmin" element={<Dashboard />} />
          <Route path="/profile" element={<ProfilePage />} />
          <Route path="/admin" element={<Dashboard />} />
          <Route path="/login" element={<Login />} />
          <Route path="/register" element={<Register />} />
          <Route path="/player/:id" element={<PlayerDetailPage />} />
          {/* <Route path="/forgot-password" element={<ForgotPassword />} /> */}
          <Route path="*" element={<NotFound />} />
        </Routes>
      </BrowserRouter>
    </TooltipProvider>
  </QueryClientProvider>
);

export default App;
