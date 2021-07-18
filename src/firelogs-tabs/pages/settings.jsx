import "ace-builds/src-noconflict/mode-javascript";
import "ace-builds/src-noconflict/theme-xcode";

import AceEditor from "react-ace";
import beautify from "js-beautify";
import styled from "styled-components";
//@ts-check
import React, { useEffect, useState } from "react";

import Columns from "./columns.jsx";

const Styles = styled.div`
  border-radius: 16px;
  /* overflow: hidden; */
  height: 90vh;
  overflow-y: auto;

  .page-title {
    background: #f5f7f9;
    color: #535353;
    line-height: 40px;
    font-weight: bold;
    border-bottom: 1px solid #c7c7c7;

    text-align: center;
  }
  .modes {
    background: #f5f7f9;
    display: inline-block;
    height: 100px;
    border-radius: 6px;
    margin-top: 12px;
    padding: 12px;
    &:after {
      content: "";
      display: table;
      clear: both;
    }
    .mode {
      width: 100px;
      float: left;
      height: 60px;
      border-radius: 6px;
      border: 1px solid #dedeed;
      cursor: pointer;

      margin: 3px 12px;
      text-align: center;
      img {
        height: auto;
        width: 100%;
        border-radius: 6px;
      }
      &.active {
        border: 1px solid #2e4dff;
      }
    }
  }
  .section {
    padding: 12px 45px;
    .title {
      font-size: 1.2em;
    }
    .body {
      min-height: 70px;
    }
  }
  .columns {
    padding: 1.25rem;
    border: 1px solid #e6ecf1;
    border-radius: 0.25rem;
    background-color: #f5f7f9;
    margin-bottom: 1rem;
    input {
      padding: 8px 12px;
      border-radius: 3px;
      border: 1px solid #414141;
      outline: none;
      display: block;
      width: 260px;
      &:focus {
        /* box-shadow: 0 0 5px rgba(81, 203, 238, 1); */
        border: 1px solid rgba(81, 203, 238, 1);
      }
    }
  }
  .new-row {
    background: #f9feff;
    &:hover {
      background: #d9f6fc;
    }
    padding: 12px 45px;
    border-radius: 6px;
    margin: 1rem 3rem;
    border: 1px dashed #b4f0ff;
    cursor: pointer;
    text-align: center;
  }
  .col-6 {
    width: 270px;
    float: left;
  }
  .clearfix {
    &:after,
    &:before {
      display: table;
      content: "";
      clear: both;
    }
  }
`;

export const Section = ({ title, children }) => {
  return (
    <div className="section">
      <div className="title">{title}</div>
      <div className="body">{children}</div>
    </div>
  );
};

const Settings = () => {
  /**
   *  @type {[any, Function]}
   * */
  const [ConFiguration, setConFiguration] = useState({});
  const [Apperenence, setApperenence] = useState("light");
  const [Filter, setFilter] = useState("");
  const [Preset, setPreset] = useState([]);

  useEffect(() => {
    /**
     * @type {*}
     * */
    let config = window.localStorage.getItem("configuration");
    if (config) {
      config = JSON.parse(config);
    } else {
      return;
    }

    let preset = [];
    if (config.selected_presets) {
      config.presets.forEach(
        (/** @type {{ name: any; columns: any[]; }} */ item) => {
          if (item.name === config.selected_presets) {
            preset = item.columns;
          }
        }
      );
    }
    setPreset(preset);
    setApperenence(config.appearance);
    setFilter(config.filter);
    setConFiguration(config);
  }, []);

  useEffect(() => {
    SaveConFiguration(ConFiguration);
  }, [ConFiguration]);

  const SaveConFiguration = (/** @type {any} */ configuration) => {
    const config = JSON.stringify(configuration);
    localStorage.setItem("configuration", config);
  };

  const onFilterChange = (/** @type {any} */ newValue) => {
    /** @type {*}  */
    let newConfig = { ...ConFiguration };
    newConfig.filter = newValue;
    SaveConFiguration(newConfig);
  };
  const onPresetChange = (
    /** @type {{ currentTarget: { value: any; }; }} */ e
  ) => {
    let value = e.currentTarget.value;
    console.log("preset", value);
    /** @type {*}  */
    let config = { ...ConFiguration };
    config.selected_presets = value;
    if (!config.presets) {
      config.presets = [];
    }
    let preset = [];
    config.presets.forEach(
      (/** @type {{ name: any; columns: any[]; }} */ item) => {
        if (item.name === value) {
          preset = item.columns;
        }
      }
    );
    setConFiguration(config);
    setPreset(preset);
  };
  const onChangeApperance = (
    /** @type {React.SetStateAction<string>} */ value
  ) => {
    let newConfig = ConFiguration;
    setApperenence(value);
    SaveConFiguration(newConfig);
  };
  return (
    <Styles>
      <div className="page-title">Settings</div>

      <Section title="Appearence">
        <div className="modes">
          <div
            onClick={() => onChangeApperance("light")}
            className={Apperenence === "light" ? "mode active" : "mode"}
          >
            <img src="https://i0.wp.com/9to5mac.com/wp-content/uploads/sites/6/2018/04/dark-mac.png?w=2000&quality=82&strip=all&ssl=1" />
            Light
          </div>
          <div
            onClick={() => onChangeApperance("dark")}
            className={Apperenence === "dark" ? "mode active" : "mode"}
          >
            <img src="https://i0.wp.com/9to5mac.com/wp-content/uploads/sites/6/2018/04/dark-mac.png?w=2000&quality=82&strip=all&ssl=1" />
            Dark
          </div>
        </div>
      </Section>
      <Section title="Filter">
        <div className="filter">
          <AceEditor
            mode="javascript"
            theme="xcode"
            onChange={onFilterChange}
            name="filter"
            height={"150px"}
            value={
              !!Filter
                ? beautify(Filter.toString())
                : beautify(`function filter(rows){return rows} `)
            }
            editorProps={{ $blockScrolling: true }}
          />
        </div>
      </Section>
      <Section title="Presets">
        <select
          className="select"
          value={
            !ConFiguration.selected_presets
              ? "null"
              : ConFiguration.selected_presets
          }
          data-value={
            !ConFiguration.selected_presets
              ? "null"
              : ConFiguration.selected_presets
          }
          onChange={onPresetChange}
        >
          <option disabled value="null">
            --Select Presets--
          </option>
          {ConFiguration?.presets?.map(
            (
              /** @type {{ name: {}; }} */ preset,
              /** @type {number} */ index
            ) => (
              <option
                // @ts-ignore
                key={preset.name}
                // @ts-ignore
                value={preset.name}
              >
                {preset.name}
              </option>
            )
          )}
          <option key="new" value="new--">
            + Add New Preset
          </option>
        </select>
      </Section>
      <pre>{JSON.stringify(Preset, null, 2)}</pre>
      {ConFiguration?.selected_presets && (
        <>
          <Columns columns={Preset} />
        </>
      )}
    </Styles>
  );
};

export default Settings;
