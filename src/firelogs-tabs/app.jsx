import React, { useState } from "react";

import Content from "./components/content.jsx";
import Header from "./components/header.jsx";
import Routes from "./routes.jsx";

window.configuartion = {
  filter: `function filter(rows){ 
    var _rows = rows;
    _rows = _rows.filter(function(row) {
      // Filterout the row with only contains /api/v3 
      if(row.url.indexOf("/api/v3/") === 0) {
        return true;
      }else {
        return false;
      }
    });
    return _rows;}`,
  apperence: "light",
  selected_presets: false,
  presets: [
    {
      name: "API Automation",
      description: "API Automation",
      columns: [
        {
          title: "AGE",
          datakey: "age",
          render: (row) => {
            return row.age || "";
          }
        },
        {
          title: "Visits",
          datakey: "visits",
          render: (row) => {
            return row.visits;
          }
        },
        {
          title: "Status",
          datakey: "status",
          render: (row) => {
            return row.status;
          }
        },
        {
          title: "Profile Progress",
          datakey: "progress",
          render: (row) => {
            return row.progress;
          }
        }
      ]
    }
  ]
};

const App = () => {
  const [path, setpath] = useState("/settings");

  return (
    <div>
      <Header path={path} onChange={setpath} />
      <Content>
        <Routes path={path} />
      </Content>
    </div>
  );
};

export default App;
