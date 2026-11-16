import CallToAction from "@/components/Universal/CallToAction";
import Hero from "@/components/Home/hero/Hero";
import BookConsultation from "@/components/Home/home-sections/BookConsultation";
import Process from "@/components/Home/home-sections/OurProcess";
import Services from "@/components/Home/home-sections/Services";
import SolutionsBySpace from "@/components/Home/home-sections/SolutionsBySpace";
import SystemOverview from "@/components/Home/home-sections/SystemOverview";
import Testimonials from "@/components/Home/home-sections/Testimonials";
import TrustStrip from "@/components/Home/home-sections/TrustStrip";
import WhyChooseUs from "@/components/Home/home-sections/WhyChooseUs";
import FaqSection from "@/components/Universal/FAQSection";

export default function Home() {
  return (
    <main>
    <Hero/>
    <TrustStrip/>
    <Services/>
    <BookConsultation/>
    <WhyChooseUs/>
    <Process/>
    <SolutionsBySpace/>
    <SystemOverview/>
    <Testimonials/>
    <CallToAction/>
    <FaqSection/>
    </main>
  );
}