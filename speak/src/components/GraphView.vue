<template>
    <div ref="graph" class="graph-container"></div>
  </template>
  
  <script>
  import * as d3 from "d3";
  
  export default {
    props: ["messages"],
    watch: {
      messages() {
        this.drawGraph();
      }
    },
    methods: {
      drawGraph() {
        d3.select(this.$refs.graph).selectAll("*").remove(); // Clear previous graph
  
        const svg = d3.select(this.$refs.graph)
          .append("svg")
          .attr("width", "100%")
          .attr("height", "100%");
  
        const svgGroup = svg.append("g");
  
        // Add a background rect for handling zoom/pan and place it at the very start
        svg.insert("rect", ":first-child")  // Ensure it's added as the first element
          .attr("width", "100%")
          .attr("height", "100%")
          .attr("fill", "transparent")
          .style("cursor", "move")
          .call(d3.zoom()
            .scaleExtent([0.5, 5]) // Set minimum and maximum zoom levels
            .on("zoom", (event) => {
              svgGroup.attr("transform", event.transform); // Apply zoom/pan to the graph group
            }));
  
        const width = window.innerWidth;  // Get full window width
        const height = window.innerHeight; // Get full window height
  
        const links = this.messages.flatMap((message) =>
          message.links.map((link) => ({
            source: message.id,
            target: link
          }))
        );
  
        const nodes = this.messages.map((message) => ({
          id: message.id,
          name: message.name,
          message: message.message
        }));
  
        const maxWidth = 150; // Maximum width for wrapping text
  
        // Create the force simulation with collision detection
        const simulation = d3.forceSimulation(nodes)
          .force("link", d3.forceLink(links).id(d => d.id))
          .force("charge", d3.forceManyBody().strength(-50)) // Push nodes apart
          .force("center", d3.forceCenter(width / 2, height / 2))
          .force("collision", d3.forceCollide().radius(50)); // Fixed radius for collision detection
  
        // Draw links between nodes
        const link = svgGroup.append("g")
          .attr("class", "links")
          .selectAll("line")
          .data(links)
          .enter().append("line")
          .attr("stroke-width", 2)
          .attr("stroke", "#999");
  
        // Draw node boxes with wrapped text
        const node = svgGroup.append("g")
          .attr("class", "nodes")
          .selectAll("g")
          .data(nodes)
          .enter()
          .append("g");
  
        // Disable zoom on the node elements
        node.on("mousedown.zoom", null);
  
        // Append rectangles and wrapped text
        node.each(function(d) {
          const g = d3.select(this);
          const textContent = `${d.name}: ${d.message}`;
  
          // Create a rectangle to dynamically fit the text height
          const rect = g.insert("rect", "text")
            .attr("x", -10)
            .attr("y", -10)
            .attr("width", maxWidth)  // Fixed width
            .attr("height", 50)  // Temporary fixed height (will adjust later)
            .attr("rx", 10)
            .attr("ry", 10)
            .attr("fill", "#69b3a2")
            .attr("stroke", "#333")
            .attr("stroke-width", 2);
  
          // Append the text with wrapping
          const text = g.append("text")
            .attr("x", 0)
            .attr("y", 0)
            .attr("font-size", "12px")
            .attr("fill", "black");
  
          const words = textContent.split(" ");
          let line = [];
          let lineHeight = 1.2; // Line height in em
          let currentHeight = 0; // Track height for rectangle
  
          // Create a test tspan to measure width dynamically
          let tspan = text.append("tspan").attr("x", 0).attr("y", 0);
  
          words.forEach((word) => {
            line.push(word);
            tspan.text(line.join(" "));
            const testWidth = tspan.node().getComputedTextLength();
  
            // Check if the word fits in the current line
            if (testWidth > maxWidth && line.length > 1) {
              // Append the current line as a tspan
              text.append("tspan")
                .attr("x", 0)
                .attr("dy", `${lineHeight}em`)
                .text(line.slice(0, -1).join(" "));
              currentHeight += 1.2 * 12; // Increment height for each new line
              line = [word]; // Start a new line with the current word
              tspan.text(word); // Set the current word as the first word in new line
            }
          });
  
          // Append the last line as a tspan
          if (line.length > 0) {
            text.append("tspan")
              .attr("x", 0)
              .attr("dy", `${lineHeight}em`)
              .text(line.join(" "));
            currentHeight += 1.2 * 12; // Increment height for the last line
          }
  
          // Remove the test tspan after computation
          tspan.remove();
  
          // Adjust the rectangle height based on text height
          rect.attr("height", currentHeight + 20);
        });
  
        simulation.on("tick", () => {
          // Update link positions
          link
            .attr("x1", d => d.source.x)
            .attr("y1", d => d.source.y)
            .attr("x2", d => d.target.x)
            .attr("y2", d => d.target.y);
  
          // Update node positions
          node.attr("transform", d => `translate(${d.x - 75},${d.y - 25})`);
        });
      }
    },
    mounted() {
      this.drawGraph();
    }
  };
  </script>
  
  <style scoped>
  .graph-container {
    width: 100vw;
    height: 100vh;
  }
  
  svg {
    width: 100%;
    height: 100%;
  }
  
  rect {
    cursor: pointer;
  }
  
  text {
    fill: black;
    user-select: text;
    -webkit-user-select: text;
    -moz-user-select: text;
    -ms-user-select: text;
  }
  </style>
  