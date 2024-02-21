import * as React from "react";
import { createRoot } from "react-dom/client";
import Root from './utils/Root'
import './config';

import "./styles/style.css"

const root = createRoot(document.getElementById("root"));

root.render(
  <React.StrictMode>
    <Root />
  </React.StrictMode>
);


