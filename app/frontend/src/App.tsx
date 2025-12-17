import styled from "styled-components";
import "./App.css";
import { Outlet } from "react-router-dom";
import { FooterNavigation } from "./components/layout/Footer";
import { ScrollToTop } from "./components/common/ScrollToTop";
import { SearchOverlay } from "./features/search/SearchOverlay";

function App() {
  return (
    <>
      <Container>
        <ContentWrapper>
          <ScrollToTop />
          <Outlet />
        </ContentWrapper>
        <FooterNavigation />
      </Container>
      <SearchOverlay />
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
