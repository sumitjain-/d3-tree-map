import React, { useEffect, useRef, useState } from "react";
import * as d3 from "d3";
import {
  populateAlloc,
  populateRectDimensions,
  drawRects,
  drawTexts,
  addMouseHandlers
} from "./helpers";

export function Treemap(props) {
  const { chartWidth: cw, chartHeight: ch, data, responsive = true } = props;
  const [chartWidth, setChartWidth] = useState(cw);
  const containerRef = useRef(null);
  const mapRef = useRef(null);
  const rectsRef = useRef(null);
  const textsRef = useRef(null);

  const colorRange = props.colorRange.map(x => d3.rgb(x));

  const paletteScale = d3
    .scaleLinear()
    .interpolate(d3.interpolateHcl)
    .domain(d3.extent(data, d => d.value))
    .range(colorRange);

  function resizeHandler() {
    const rect = containerRef.current.getBoundingClientRect();
    setChartWidth(rect.width);
  }

  useEffect(() => {
    if (!cw && responsive) {
      window.addEventListener("resize", resizeHandler);
      return () => {
        window.removeEventListener("resize", resizeHandler);
      };
    }
  }, [cw, responsive]);

  useEffect(() => {
    if (!(cw || chartWidth)) {
      if (containerRef.current) {
        resizeHandler();
      }
    }
  }, [cw, chartWidth]);

  useEffect(() => {
    data.sort((a, b) => (a.value <= b.value ? 1 : -1));

    populateAlloc(data);

    populateRectDimensions({
      data,
      chartHeight: ch,
      chartWidth: chartWidth
    });

    const svg = d3.select(mapRef.current);

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
      // console.log("cleanup");
    };
  }, [
    chartWidth,
    ch,
    props.colorRange,
    data,
    paletteScale,
    props.onMouseEnter,
    props.onMouseLeave
  ]);
  return (
    <div className="map-container" ref={containerRef}>
      <svg ref={mapRef} width={chartWidth} height={ch} />
    </div>
  );
}
