import React, { useEffect, useRef } from "react";
import * as d3 from "d3";
import {
  populateAlloc,
  populateRectDimensions,
  drawRects,
  drawTexts,
  addMouseHandlers
} from "./helpers";

export function Treemap(props) {
  const { chartWidth, chartHeight, data } = props;
  const mapRef = useRef(null);
  const rectsRef = useRef(null);
  const textsRef = useRef(null);

  const colorRange = props.colorRange.map(x => d3.rgb(x));

  const paletteScale = d3
    .scaleLinear()
    .interpolate(d3.interpolateHcl)
    .domain(d3.extent(data, d => d.value))
    .range(colorRange);

  useEffect(() => {
    data.sort((a, b) => (a.value <= b.value ? 1 : -1));

    populateAlloc(data);

    populateRectDimensions({ data, chartHeight, chartWidth });

    const svg = d3.select("svg");

    drawRects({
      svg,
      ref: rectsRef,
      dataArray: data,
      colorScale: paletteScale
    });

    drawTexts({ svg, ref: textsRef, dataArray: data });

    addMouseHandlers({
      rects: rectsRef.current,
      colorRange: props.colorRange,
      colorScale: paletteScale,
      mouseEnterHandler: props.onMouseEnter,
      mouseLeaveHandler: props.onMouseLeave
    });

    return () => {
      console.log("cleanup");
    };
  }, [
    chartWidth,
    chartHeight,
    props.colorRange,
    data,
    paletteScale,
    props.onMouseEnter,
    props.onMouseLeave
  ]);
  return <svg ref={mapRef} width={chartWidth} height={chartHeight} />;
}
