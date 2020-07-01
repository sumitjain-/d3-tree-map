import React, { useEffect, useRef } from "react";
import * as d3 from "d3";
import data from "./data";

const chartWidth = 400;
const chartHeight = 400;

export function Container(props) {
  const mapRef = useRef(null);
  useEffect(() => {
    const treeData = [...data];
    treeData.sort((a, b) => (a.value <= b.value ? 1 : -1));
    const total = treeData.reduce((outp, curr) => {
      outp += curr.value;
      return outp;
    }, 0);

    treeData.forEach(node => {
      node.alloc = node.value / total;
    });

    let ptr = 0;
    let ox = 0;
    let oy = 0;
    let allocLeft = 1;

    while (ptr < treeData.length) {
      const dim = {};
      if (!(ptr % 2)) {
        // partition horizontal
        // console.log("h ---");
        dim.x = ox;
        dim.y = oy;
        dim.width = (chartWidth - ox) * (treeData[ptr].alloc / allocLeft);
        dim.height = chartHeight - oy;
        ox = ox + dim.width;
        allocLeft = allocLeft - treeData[ptr].alloc;
        // console.log(dim);
      } else {
        // partition vertical
        // console.log("v ---");
        dim.x = ox;
        dim.y = oy;
        dim.width = chartWidth - ox;
        dim.height = (chartHeight - oy) * (treeData[ptr].alloc / allocLeft);
        // console.log(dim.height);
        oy = oy + dim.height;
        allocLeft = allocLeft - treeData[ptr].alloc;
        // console.log(dim);
      }
      // console.log(allocLeft);
      Object.assign(treeData[ptr], dim);
      ptr++;
    }
    const colorRange = [
      d3.rgb("rgb(242, 222, 206)"),
      d3.rgb("rgb(247, 161, 95)")
    ];
    // console.log(d3);
    const paletteScale = d3
      .scaleLinear()
      .interpolate(d3.interpolateHcl)
      .domain(d3.extent(treeData, d => d.alloc))
      .range(colorRange);
    const svg = d3.select("svg");

    const selection = svg
      .selectAll("rect")
      .data(treeData)
      .enter()
      .append("rect")
      .attr("x", d => d.x)
      .attr("y", d => d.y)
      .attr("width", d => d.width)
      .attr("height", d => d.height)
      .attr("fill", d => paletteScale(d.alloc))
      .attr("stroke", "#fff");

    console.log(selection);

    console.table(treeData);

    return () => {
      console.log("unmount");
    };
  }, []);
  return (
    <div>
      <svg ref={mapRef} width="400" height="400" />
    </div>
  );
}
