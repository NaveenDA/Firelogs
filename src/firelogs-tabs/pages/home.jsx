import React, { useEffect, useState } from "react";

import Table from "../components/table.jsx";
import makeData from "../components/make-data";

const Home = () => {
  const [columns, setcolumns] = useState([]);
  useEffect(() => {
    let _columns = [];
    let config = window.configuartion;
    let configLen = config.length;
    for (let index = 0; index < configLen; index++) {
      _columns.push({
        Header: config[index].title || "",
        accessor: config[index].key,
        Cell: ({ row: { original } }) => {
          if (config[index].render) {
            let val = config[index].render(original);
            if (typeof val !== "undefined") {
              return val;
            } else {
              return "";
            }
          }
          return original[config[index].key];
        }
      });
    }
    console.log(_columns);
    setcolumns(_columns);
  }, []);
  // const columns = React.useMemo(
  //   () => [
  //     {
  //       Header: "Age",
  //       accessor: "age"
  //     },
  //     {
  //       Header: "Visits",
  //       accessor: "visits"
  //     },
  //     {
  //       Header: "Status",
  //       accessor: "status"
  //     },
  //     {
  //       Header: "Profile Progress",
  //       accessor: "progress"
  //     }
  //   ],
  //   []
  // );

  const data = React.useMemo(() => makeData(20), []);

  return (
    <div>{columns.length > 0 && <Table columns={columns} data={data} />}</div>
  );
};

export default Home;
