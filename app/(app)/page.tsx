import ExamplesSection from "@/components/homepage/Examples";
import HeroSection from "@/components/homepage/HeroSection";


export default function Home() {
  return (
    <section className="h-auto flex flex-col justify-center items-center ">
      <HeroSection />
      <ExamplesSection/>
    </section>
  );
}
