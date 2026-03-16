import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Route, Routes } from "react-router-dom";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { Toaster } from "@/components/ui/toaster";
import { TooltipProvider } from "@/components/ui/tooltip";
import Index from "./pages/Index.tsx";
import AboutUs from "./pages/AboutUs.tsx";
import MembershipBenefits from "./pages/MembershipBenefits.tsx";
import ContactUs from "./pages/ContactUs.tsx";
import SignIn from "./pages/SignIn.tsx";
import Gallery from "./pages/Gallery.tsx";
import NotFound from "./pages/NotFound.tsx";
import AdminLayout from "./layouts/AdminLayout.tsx";
import AdminDashboard from "./pages/admin/AdminDashboard.tsx";
import ManageEvents from "./pages/admin/ManageEvents.tsx";
import ManageGallery from "./pages/admin/ManageGallery.tsx";
import ManageMessages from "./pages/admin/ManageMessages.tsx";
import ManageApplications from "./pages/admin/ManageApplications.tsx";
import { ProtectedRoute } from "./components/ProtectedRoute.tsx";
import Apply from "./pages/Apply.tsx";

const queryClient = new QueryClient();

const App = () => (
  <QueryClientProvider client={queryClient}>
    <TooltipProvider>
      <Toaster />
      <Sonner />
      <BrowserRouter>
        <Routes>
          <Route path="/" element={<Index />} />
          <Route path="/about-us" element={<AboutUs />} />
          <Route path="/membership-benefits" element={<MembershipBenefits />} />
          <Route path="/membership" element={<MembershipBenefits />} />
          <Route path="/apply" element={<Apply />} />
          <Route path="/contact-us" element={<ContactUs />} />
          <Route path="/sign-in" element={<SignIn />} />
          <Route path="/gallery" element={<Gallery />} />
          
          <Route path="/admin" element={<ProtectedRoute><AdminLayout /></ProtectedRoute>}>
            <Route index element={<AdminDashboard />} />
            <Route path="applications" element={<ManageApplications />} />
            <Route path="events" element={<ManageEvents />} />
            <Route path="gallery" element={<ManageGallery />} />
            <Route path="messages" element={<ManageMessages />} />
          </Route>

          {/* ADD ALL CUSTOM ROUTES ABOVE THE CATCH-ALL "*" ROUTE */}
          <Route path="*" element={<NotFound />} />
        </Routes>
      </BrowserRouter>
    </TooltipProvider>
  </QueryClientProvider>
);

export default App;
