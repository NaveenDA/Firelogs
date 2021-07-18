import React from "react";

import Home from "./pages/home.jsx";
import Settings from "./pages/settings.jsx";

const Routes = ({ path }) => {
  return (
    <>
      {path === "/" && <Home />}
      {path === "/settings" && <Settings />}
    </>
  );
};

export default Routes;
