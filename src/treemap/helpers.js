export function populateAlloc(baseData) {
  const total = baseData.reduce((outp, curr) => {
    outp += curr.value;
    return outp;
  }, 0);

  baseData.forEach(node => {
    node.alloc = node.value / total;
  });
}

export function populateRectDimensions({
  data,
  chartHeight,
  chartWidth,
  splitVertical = false
}) {
  let ptr = 0;
  let ox = 0;
  let oy = 0;
  let allocLeft = 1;

  while (ptr < data.length) {
    const dim = {};
    if (!((ptr + (splitVertical ? 1 : 0)) % 2)) {
      dim.x = ox;
      dim.y = oy;
      dim.width = chartWidth - ox;
      dim.height = (chartHeight - oy) * (data[ptr].alloc / allocLeft);
      oy = oy + dim.height;
      allocLeft = allocLeft - data[ptr].alloc;
    } else {
      dim.x = ox;
      dim.y = oy;
      dim.width = (chartWidth - ox) * (data[ptr].alloc / allocLeft);
      dim.height = chartHeight - oy;
      ox = ox + dim.width;
      allocLeft = allocLeft - data[ptr].alloc;
    }
    Object.assign(data[ptr], dim);
    ptr++;
  }

  return data;
}

export function drawRects({ svg, ref, dataArray, colorScale }) {
  const selection = svg.selectAll("rect").data(dataArray, d => d.label);
  selection.exit().remove();

  ref.current = selection;

  ref.current.enter().insert("rect", "text");

  ref.current
    .attr("fill", d => colorScale(d.value))
    .attr("stroke", "#fff")
    .transition()
    .duration(350)
    .attr("x", d => d.x)
    .attr("y", d => d.y)
    .attr("width", d => d.width)
    .attr("height", d => d.height);
}

export function drawTexts({
  svg,
  ref,
  dataArray,
  labelTspanRef,
  subLabelTspanRef,
  labelTemplate,
  subLabelTemplate
}) {
  const selection = svg.selectAll("text").data(dataArray, d => d.label);

  selection.exit().remove();

  ref.current = selection;

  ref.current.enter().append("text");

  ref.current.selectAll("tspan").remove();

  labelTspanRef.current = ref.current.append("tspan");
  labelTspanRef.current.classed("label", true);

  ref.current
    .attr("pointer-events", "none")
    .attr("text-anchor", "middle")
    .attr("stroke", "none")
    .attr("font-size", "1.25em")
    .attr("fill", "#fff")
    .transition()
    .duration(350)
    .attr("x", d => d.x + d.width / 2)
    .attr("y", d => d.y + d.height / 2)
    .attr("width", d => d.width);

  labelTspanRef.current.text(
    typeof labelTemplate === "function" ? labelTemplate : d => d.label
  );

  if (typeof subLabelTemplate === "function") {
    subLabelTspanRef.current = ref.current.append("tspan");
    subLabelTspanRef.current.classed("sub-label", true);

    subLabelTspanRef.current
      .text(subLabelTemplate)
      .attr("pointer-events", "none")
      .attr("text-anchor", "middle")
      .attr("stroke", "none")
      .attr("font-size", "1.25em")
      .attr("fill", "#fff")
      .transition()
      .duration(350)
      .attr("x", d => d.x + d.width / 2)
      .attr("dy", "1.25em");
  }
}

export function addMouseHandlers({
  rects,
  colorRange,
  colorScale,
  onMouseEnter,
  onMouseLeave,
  onRegionClick
}) {
  rects.on("mouseenter", function(d, idx, items) {
    rects
      .transition()
      .duration(150)
      .attr("fill-opacity", elem => {
        return elem.label === d.label ? "1" : "0.3";
      })
      .attr("fill", elem =>
        elem.label === d.label ? colorRange[1] : colorScale(d.value)
      );

    if (typeof onMouseEnter === "function") {
      onMouseEnter(d, rects);
    }
  });

  rects.on("mouseleave", function(d, idx, items) {
    rects
      .transition()
      .duration(150)
      .attr("fill-opacity", "1")
      .attr("fill", elem => colorScale(elem.value));

    if (typeof onMouseLeave === "function") {
      onMouseLeave(d, rects);
    }
  });

  rects.on("click", function(d, idx, items) {
    if (typeof onRegionClick === "function") {
      onRegionClick(d, rects);
    }
  });
}
