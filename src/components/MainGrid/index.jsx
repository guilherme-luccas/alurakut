import styled from "styled-components";

export const MainGrid = styled.main`
  width: 100%;
  grid-gap: 0.52vw;
  margin-left: auto;
  margin-right: auto;
  max-width: 600px;
  padding: 0.83vw;
  .profileArea {
    display: none;
    @media (min-width: 860px) {
      display: block;
    }
  }
  @media (min-width: 860px) {
    max-width: 1110px;
    display: grid;
    grid-template-areas: "profileArea welcomeArea profileRelationsArea";
    grid-template-columns: 8.33vw 1fr 16.25vw;
  }
`;
