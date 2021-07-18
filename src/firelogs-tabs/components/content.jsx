import React from "react";
import styled from "styled-components";

const Styles = styled.div`
  width: 90vw;
  height: CALC(100vh - 60px);
  background: #fff;
  border-radius: 16px;
  margin: 0 auto;
  margin-top: 8px;
  box-shadow: 0 3px 6px rgba(0, 0, 0, 0.16), 0 3px 6px rgba(0, 0, 0, 0.23);
  /* &:hover ::-webkit-scrollbar {
    width: 10px;
    background-color: #f5f5f5;
  } */
`;

const Content = ({ children }) => {
  return <Styles>{children}</Styles>;
};

export default Content;
