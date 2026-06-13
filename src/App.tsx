import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Route, Routes } from "react-router-dom";
import { HelmetProvider } from "react-helmet-async";
import ScrollToTop from "./components/ScrollToTop";
import RAGLAChatbot from "./components/RAGLAChatbot";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { Toaster } from "@/components/ui/toaster";
import { TooltipProvider } from "@/components/ui/tooltip";
import Index from "./pages/Index.tsx";
import AboutUs from "./pages/AboutUs.tsx";
import GlobalAmbassador from "./pages/GlobalAmbassador.tsx";
import MembershipBenefits from "./pages/MembershipBenefits.tsx";
import ContactUs from "./pages/ContactUs.tsx";
import SignIn from "./pages/SignIn.tsx";
import Gallery from "./pages/Gallery.tsx";
import Events from "./pages/Events.tsx";
import News from "./pages/News.tsx";
import Posts from "./pages/Posts.tsx";
import NotFound from "./pages/NotFound.tsx";
import AdminLayout from "./layouts/AdminLayout.tsx";
import AdminDashboard from "./pages/admin/AdminDashboard.tsx";
import ManageEvents from "./pages/admin/ManageEvents.tsx";
import ManageGallery from "./pages/admin/ManageGallery.tsx";
import ManageNewsPosts from "./pages/admin/ManageNewsPosts.tsx";
import ManageMessages from "./pages/admin/ManageMessages.tsx";
import ManageRegistrations from "./pages/admin/ManageRegistrations.tsx";
import ManageApplications from "./pages/admin/ManageApplications.tsx";
import EventDetail from "./pages/EventDetail.tsx";
import { ProtectedRoute } from "./components/ProtectedRoute.tsx";
import Apply from "./pages/Apply.tsx";
import ProgrammeApply from "./pages/ProgrammeApply.tsx";
import Programmes from "./pages/Programmes.tsx";
import CourseDetail from "./pages/CourseDetail.tsx";
import { Analytics } from "@vercel/analytics/react";

const queryClient = new QueryClient();

const App = () => (
  <QueryClientProvider client={queryClient}>
    <HelmetProvider>
      <TooltipProvider>
        <Toaster />
        <Sonner />
        <Analytics />
        <BrowserRouter future={{ v7_startTransition: true, v7_relativeSplatPath: true }}>
          <ScrollToTop />
          <RAGLAChatbot />
          <Routes>
            <Route path="/" element={<Index />} />
            <Route path="/global-ambassador" element={<GlobalAmbassador />} />
            <Route path="/ambassador" element={<GlobalAmbassador />} />
            <Route path="/about-us" element={<AboutUs />} />
            <Route path="/membership-benefits" element={<MembershipBenefits />} />
            <Route path="/membership" element={<MembershipBenefits />} />
            <Route path="/apply" element={<Apply />} />
            <Route path="/contact-us" element={<ContactUs />} />
            <Route path="/sign-in" element={<SignIn />} />
            <Route path="/gallery" element={<Gallery />} />
            <Route path="/events" element={<Events />} />
            <Route path="/events/:eventId" element={<EventDetail />} />
            <Route path="/news" element={<News />} />
            <Route path="/posts" element={<Posts />} />
            <Route path="/programmes" element={<Programmes />} />
            <Route path="/programmes/rpcsgl" element={<CourseDetail />} />
            <Route path="/programmes/apply-rpcsgl" element={<ProgrammeApply />} />
            
            <Route path="/admin" element={<ProtectedRoute><AdminLayout /></ProtectedRoute>}>
              <Route index element={<AdminDashboard />} />
              <Route path="events" element={<ManageEvents />} />
              <Route path="events/registrations/:eventId" element={<ManageRegistrations />} />
              <Route path="news-posts" element={<ManageNewsPosts />} />
              <Route path="gallery" element={<ManageGallery />} />
              <Route path="messages" element={<ManageMessages />} />
              <Route path="applications" element={<ManageApplications />} />
            </Route>

            {/* ADD ALL CUSTOM ROUTES ABOVE THE CATCH-ALL "*" ROUTE */}
            <Route path="*" element={<NotFound />} />
          </Routes>
        </BrowserRouter>
      </TooltipProvider>
    </HelmetProvider>
  </QueryClientProvider>
);

export default App;
