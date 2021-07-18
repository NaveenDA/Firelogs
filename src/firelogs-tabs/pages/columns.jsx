import "ace-builds/src-noconflict/mode-javascript";
import "ace-builds/src-noconflict/theme-xcode";

import AceEditor from "react-ace";
import beautify from "js-beautify";
import React, { useState } from "react";

import { Section } from "./settings.jsx";

const Column = ({ title, datakey, render, onChange }) => {
  return (
    <div className="columns">
      <div className="col-title">
        <div className="col-6">
          <label htmlFor={"ip" + datakey}>Name</label>
          <input
            id={"ip" + datakey}
            placeholder="Name of the column"
            value={title}
          />
        </div>
        <div className="col-6">
          <label htmlFor={"key" + datakey}>Key</label>
          <input
            id={"key" + datakey}
            placeholder="Key of the column"
            value={datakey}
          />
        </div>
      </div>
      <div className="clearfix" />
      <div className="col-body">
        <p>Render</p>
        <AceEditor
          mode="javascript"
          theme="xcode"
          onChange={onChange}
          value={beautify(render.toString())}
          name={datakey}
          height={150}
        />
      </div>
    </div>
  );
};

const Columns = ({ columns }) => {
  const [ColumnState, setColumnState] = useState(columns);

  const addColumn = () => {
    let len = ColumnState.length;
    let col = ColumnState;
    let newColumn = {
      title: "Column " + (len + 1),
      datakey: "key" + (len + 1),
      render: `function render(row){ return "-"}`
    };
    col.push(newColumn);
    setColumnState(col);
  };
  return (
    <>
      <Section title="Columns">
        {ColumnState &&
          ColumnState.length > 0 &&
          ColumnState.map((item) => (
            <Column
              onChange={() => {
                console.log("arguments");
              }}
              key={item.name}
              {...item}
            />
          ))}
      </Section>
      <div className="new-row" onClick={addColumn}>
        Add new row
      </div>
    </>
  );
};

export default Columns;
