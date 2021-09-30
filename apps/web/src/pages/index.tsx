import {
  FeaturedTeams,
  Footer,
  HowItWorksSection,
  MainPageHero,
  PageBanner,
  SponsorsSection,
  ValuesSection,
} from '../components/landing';

export default function Home() {
  async function authenticate() {
    console.log('e');
  }

  return (
    <div>
      <PageBanner />

      <MainPageHero />

      <SponsorsSection />

      <ValuesSection />

      <HowItWorksSection />

      <FeaturedTeams />

      <Footer />
    </div>
  );
}
