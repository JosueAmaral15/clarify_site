import HeroSection from '../components/HeroSection';
import FinalCTA from '../components/FinalCTA';
import Testimonials from '../components/Testimonials';
import FeaturesGrid from '../components/FeaturesGrid';
import DownloadSection from '../components/DownloadSection';
import ToolsShowcase from '../components/ToolsShowcase';
import ContactSection from '../components/ContactSection';

export default function HomePage() {
  return (
    <div>
      {/* Hero Section - Task #9 Complete */}
      <HeroSection />

      {/* Features Grid - Task #10 Complete */}
      <FeaturesGrid />

      {/* Tools Showcase - Task #11 Complete */}
      <ToolsShowcase />

      {/* Download Section - Task #12 Complete */}
      <DownloadSection />

      {/* Testimonials Section - Task #13 Complete */}
      <Testimonials />

      {/* Contact Section - Integrated with Backend */}
      <ContactSection />

      {/* Final CTA Section - Task #14 Complete */}
      <FinalCTA />
    </div>
  );
}
