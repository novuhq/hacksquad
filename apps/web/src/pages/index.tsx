import styled from 'styled-components';
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
  return (
    <LandingPagWrapper>
      <PageBanner />

      <MainPageHero />

      <SponsorsSection />

      <ValuesSection />

      <HowItWorksSection />

      <FeaturedTeams />

      <Footer />
    </LandingPagWrapper>
  );
}

const LandingPagWrapper = styled.div`
  @media screen and (max-width: 1024px) {
    .header-image {
      display: none;
    }
  }
`;
