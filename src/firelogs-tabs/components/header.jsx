import React from "react";
import styled from "styled-components";

const Styles = styled.div`
  .header {
    padding-top: 8px;
    position: relative;
    .logo {
      width: 100vw;
      text-align: center;
      height: 55px;
      img {
        height: 100%;
        width: auto;
        cursor: pointer;
      }
    }
  }
  .settings {
    position: absolute;
    bottom: 0;
    cursor: pointer;
    right: 7vw;
    transform: scale(0.8);
    &:hover path {
      fill: #fff;
    }
    path {
      fill: #cacaca;
    }
  }
  .back-btn {
    text-decoration: none;
    font-size: 0.8rem;
    position: absolute;
    bottom: 0;
    color: #fff;
    left: 7vw;
  }
`;

const Header = ({ onChange, path }) => {
  return (
    <Styles>
      <div className="header">
        {path !== "/" && (
          <a
            href=""
            onClick={(e) => {
              onChange("/");
              e.preventDefault();
            }}
            className="back-btn"
          >
            {"<"} Back to Home
          </a>
        )}
        <div className="logo">
          <img src="/images/logo.png" onClick={() => onChange("/")} />
        </div>
        <svg
          className="settings"
          width="24"
          height="28"
          viewBox="0 0 24 28"
          fill="none"
          xmlns="http://www.w3.org/2000/svg"
          onClick={() => onChange("/settings")}
        >
          <path
            d="M12 27.75L0.125 20.875V7.125L12 0.25L23.875 7.125V20.875L12 27.75ZM12 3.14L2.625 8.56625V19.4337L12 24.8612L21.375 19.4337V8.56625L12 3.13875V3.14V3.14ZM12 19C10.8432 19.0002 9.72212 18.5994 8.82776 17.8657C7.9334 17.132 7.3211 16.1109 7.0952 14.9764C6.8693 13.8419 7.04376 12.6642 7.58888 11.6439C8.13399 10.6236 9.01602 9.82383 10.0847 9.38095C11.1533 8.93807 12.3425 8.87944 13.4495 9.21504C14.5566 9.55065 15.513 10.2597 16.1558 11.2215C16.7987 12.1832 17.0881 13.3381 16.9749 14.4893C16.8617 15.6405 16.3528 16.7169 15.535 17.535C14.5955 18.4696 13.3252 18.996 12 19V19ZM12 11.5C11.6717 11.4999 11.3466 11.5645 11.0432 11.6901C10.7399 11.8156 10.4643 11.9997 10.232 12.2318C9.99984 12.4639 9.81563 12.7394 9.68991 13.0427C9.5642 13.346 9.49946 13.6711 9.49937 13.9994C9.49929 14.3277 9.56387 14.6528 9.68943 14.9561C9.815 15.2595 9.99908 15.5351 10.2312 15.7673C10.4633 15.9995 10.7388 16.1837 11.0421 16.3095C11.3454 16.4352 11.6704 16.4999 11.9987 16.5C12.6618 16.5002 13.2977 16.2369 13.7667 15.7682C14.2357 15.2995 14.4992 14.6637 14.4994 14.0006C14.4995 13.3376 14.2363 12.7016 13.7676 12.2327C13.2989 11.7637 12.663 11.5002 12 11.5V11.5Z"
            fill="#E5E5E5"
          />
        </svg>
      </div>
    </Styles>
  );
};

export default Header;
