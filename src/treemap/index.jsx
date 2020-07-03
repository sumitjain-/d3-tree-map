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
  const {
    chartWidth: cw,
    chartHeight: ch,
    data,
    responsive = true,
    colorRange = ["#fde2ce", "#f7a05f"],
    splitVertical,
    labelTemplate,
    subLabelTemplate,
    onMouseEnter,
    onMouseLeave,
    onRegionClick
  } = props;
  const [chartWidth, setChartWidth] = useState(cw);
  const containerRef = useRef(null);
  const mapRef = useRef(null);
  const rectsRef = useRef(null);
  const labelTspanRef = useRef(null);
  const subLabelTspanRef = useRef(null);

  const textsRef = useRef(null);

  const paletteScale = d3.scale
    .linear()
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
      chartWidth: chartWidth,
      splitVertical
    });

    const svg = d3.select(mapRef.current);

    drawRects({
      svg,
      ref: rectsRef,
      dataArray: data,
      colorScale: paletteScale
    });

    drawTexts({
      svg,
      ref: textsRef,
      dataArray: data,
      labelTspanRef,
      subLabelTspanRef,
      labelTemplate,
      subLabelTemplate
    });

    addMouseHandlers({
      rects: rectsRef.current,
      colorRange,
      colorScale: paletteScale,
      onMouseEnter,
      onMouseLeave,
      onRegionClick
    });

    return () => {
      // console.log("cleanup");
    };
  }, [
    chartWidth,
    ch,
    colorRange,
    data,
    paletteScale,
    onMouseEnter,
    onMouseLeave,
    onRegionClick,
    splitVertical,
    labelTemplate,
    subLabelTemplate
  ]);
  return (
    <div className="map-container" ref={containerRef}>
      <svg ref={mapRef} width={chartWidth} height={ch} />
    </div>
  );
}
