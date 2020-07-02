import React from "react";
import { Treemap } from "./treemap";
import data from "./data";

export function Container() {
  return (
    <div>
      <h2>Responsive Map</h2>
      <Treemap
        // chartWidth={400}
        chartHeight={400}
        colorRange={["#fde2ce", "#f7a05f"]}
        data={data}
      />
      <h2>Dynamic Width Map (non-responsive)</h2>
      <Treemap
        // chartWidth={400}
        chartHeight={400}
        colorRange={["#fde2ce", "#f7a05f"]}
        data={data}
        responsive={false}
      />
      <h2>Dynamic Width Responsive Map</h2>
      <Treemap
        chartWidth={400}
        chartHeight={400}
        colorRange={["#fde2ce", "#f7a05f"]}
        data={data}
        responsive={false}
      />
    </div>
  );
}
