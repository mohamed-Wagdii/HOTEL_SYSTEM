import { Box } from "@mui/material";
import AuthNavBar from "../components/onBoardingComponents/authNavBar";
import HeaderSection from "../components/onBoardingComponents/headerSection";
import ServicesSection from "../components/onBoardingComponents/serviceSection";
import TopPlacesSection from "../components/onBoardingComponents/topPlacesSection";
import FooterComponent from "../components/onBoardingComponents/footer";


export default function OnboardingPage() {
  return (
    <Box>
      <AuthNavBar />
      
      <Box sx={{ position: "relative", overflow: "hidden" }}>
        <HeaderSection />
      </Box>

      <Box sx={{ position: "relative" }}>
        <ServicesSection />
      </Box>

      <TopPlacesSection />
      <FooterComponent />
    </Box>
  );
}


