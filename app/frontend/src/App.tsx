import styled from "styled-components";
import "./App.css";
import { Outlet } from "react-router-dom";
import { FooterNavigation } from "./components/layout/Footer";
import { SearchOverlay } from "./features/search/SearchOverlay";
import { AuthProvider } from "@/wrapper/AuthProvider.tsx";

function App() {
  return (
    <>
      <AuthProvider>
        <Container>
          <ContentWrapper>
            <Outlet />
          </ContentWrapper>
          <FooterNavigation />
        </Container>
        <SearchOverlay />
      </AuthProvider>
    </>
  );
}

export default App;

const Container = styled.div`
  min-height: 100vh;
  width: 100%;
  margin: 0 auto;
  display: flex;
  flex-direction: column;
  max-width: 600px;
  padding: 0;
`;

const ContentWrapper = styled.div`
  padding-bottom: 60px;
  display: flex;
  flex-direction: column;
`;
