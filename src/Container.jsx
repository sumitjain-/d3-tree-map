import React from "react";
import { Treemap } from "./treemap";
import data from "./data";

import "bootstrap/dist/css/bootstrap.min.css";

export function Container() {
  return (
    <div>
      <h2>Custom Label Template</h2>
      <Treemap
        // chartWidth={400}
        chartHeight={400}
        data={data}
        labelTemplates={[
          function(d) {
            return `Block: ${d.label}`;
          },
          function(d) {
            return `${d.value}`;
          },
          function(d) {
            return `${d.label}`;
          }
        ]}
      />
      <h2>Responsive Map</h2>
      <Treemap
        // chartWidth={400}
        chartHeight={400}
        data={data}
      />
      <h2>Dynamic Width Map (non-responsive)</h2>
      <Treemap
        // chartWidth={400}
        chartHeight={400}
        data={data}
        responsive={false}
      />
      <h2>Fixed Width Map</h2>
      <Treemap chartWidth={400} chartHeight={400} data={data} />
      <h2>Custom Color Range</h2>
      <Treemap
        chartHeight={400}
        colorRange={["rgba(0,0,255, 0.1)", "rgba(0,0,255, 1)"]}
        data={data}
      />
      <h2>Custom Split Direction</h2>
      <Treemap chartHeight={400} data={data} splitVertical={true} />
    </div>
  );
}
