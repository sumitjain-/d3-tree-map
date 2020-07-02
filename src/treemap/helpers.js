export function populateAlloc(baseData) {
  const total = baseData.reduce((outp, curr) => {
    outp += curr.value;
    return outp;
  }, 0);

  baseData.forEach(node => {
    node.alloc = node.value / total;
  });
}

export function populateRectDimensions({ data, chartHeight, chartWidth }) {
  let ptr = 0;
  let ox = 0;
  let oy = 0;
  let allocLeft = 1;

  while (ptr < data.length) {
    const dim = {};
    if (!(ptr % 2)) {
      dim.x = ox;
      dim.y = oy;
      dim.width = (chartWidth - ox) * (data[ptr].alloc / allocLeft);
      dim.height = chartHeight - oy;
      ox = ox + dim.width;
      allocLeft = allocLeft - data[ptr].alloc;
    } else {
      dim.x = ox;
      dim.y = oy;
      dim.width = chartWidth - ox;
      dim.height = (chartHeight - oy) * (data[ptr].alloc / allocLeft);
      oy = oy + dim.height;
      allocLeft = allocLeft - data[ptr].alloc;
    }
    Object.assign(data[ptr], dim);
    ptr++;
  }

  return data;
}

export function drawRects({ svg, ref, dataArray, colorScale }) {
  ref.current = svg
    .selectAll("rect")
    .data(dataArray)
    .enter()
    .append("rect")
    .attr("stroke", "#fff")
    .attr("x", d => d.x)
    .attr("y", d => d.y)
    .attr("width", d => d.width)
    .attr("height", d => d.height)
    .attr("fill", d => colorScale(d.value));
}

export function drawTexts({ svg, ref, dataArray }) {
  ref.current = svg
    .selectAll("text")
    .data(dataArray)
    .enter()
    .append("text")
    .attr("pointer-events", "none")
    .attr("text-anchor", "middle")
    .attr("stroke", "none")
    // .attr("stroke-width", "1")
    .attr("fill", "#fff")
    .text(d => d.label)
    .attr("x", d => d.x + d.width / 2)
    .attr("y", d => d.y + d.height / 2)
    .attr("width", d => d.width);
}

export function addMouseHandlers({
  rects,
  colorRange,
  colorScale,
  onMouseEnter,
  onMouseLeave
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
}
