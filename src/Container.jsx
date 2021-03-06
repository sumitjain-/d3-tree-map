import React, { useState } from "react";
import { Treemap } from "./treemap";
import data from "./data";

import "bootstrap/dist/css/bootstrap.min.css";

export function Container() {
  const [selectedRegion, setSelectedRegion] = useState(null);
  return (
    <div>
      <h2>Handle data updates</h2>
      <Treemap
        // chartWidth={400}
        chartHeight={400}
        data={selectedRegion || data}
        labelTemplate={function(d) {
          return `Block: ${d.label}`;
        }}
        subLabelTemplate={function(d) {
          return `Rs.${d.value}`;
        }}
        onRegionClick={function(d) {
          setSelectedRegion([d]);
        }}
      />
      <button
        onClick={() => {
          setSelectedRegion(null);
        }}
        className="btn btn-primary"
      >
        Reset
      </button>
      <br />
      <br />
      {/* <h2>Custom Label Template</h2>
      <Treemap
        // chartWidth={400}
        chartHeight={400}
        data={data}
        labelTemplate={function(d) {
          return `Block: ${d.label}`;
        }}
        subLabelTemplate={function(d) {
          return `Rs.${d.value}`;
        }}
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
      <Treemap chartHeight={400} data={data} splitVertical={true} /> */}
    </div>
  );
}
