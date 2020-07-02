import React from "react";
import { Treemap } from "./treemap";
import data from "./data";

export function Container() {
  return (
    <Treemap
      chartWidth={400}
      chartHeight={400}
      colorRange={["#fde2ce", "#f7a05f"]}
      data={data}
    />
  );
}
