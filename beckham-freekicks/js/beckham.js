// Import Modules --------------------------------------------------------------------------------------------

import data from '../data/beckham.json'

import * as d3 from 'd3';
// d3

// Data
import pitchImage from '../assets/pitch.jpg'

const parsedData = data.map(d => ({
    num: +d.num,
    x: +d.x,
    y: +d.y,
    x2: +d.x2,
    y2: +d.y2,
    curve: +d.curve,
    club: d.club,
    x3: +d.x3,
    y3: +d.y3,
    season: d.season,
    fixture: d.fixture
    }));

// Graph Dimensions ------------------------------------------------------------------------------------------
const margin = {top: 20, right: 30, bottom: 40, left: 50},
      width = 700,
      height = 590;

// SVG -------------------------------------------------------------------------------------------------------
const svgContainer = d3.select("#svg-container")
.style("width", `${width}px`)
.style("height", `${height}px`);

const svg = svgContainer.append("svg")
.attr("width", width)
.attr("height", height);

const g = svg.append("g");

// Pitch Image
g.append("image")
.attr("xlink:href", pitchImage)
.attr("x", 0)
.attr("y", 0)
.attr("width", width)
.attr("height", height)
.attr("class", "pitch");

// Color Scale ------------------------------------------------------------------------------------------------
const colorScale = d3.scaleOrdinal()
.domain(["AC Milan", "England", "LA Galaxy", "Manchester United", "Preston North End", "Real Madrid"])
.range(['#8e0f0f', '#fff', '#2256f1', '#cc3434', '#5cc0f6', '#5f5c5c']);

// Axes --------------------------------------------------------------------------------------------------------
// X Axis
const x = d3.scaleLinear()
.domain([0, 700])
.range([0, 700]);
g.append("g")
.attr("class", "axis")
.call(d3.axisBottom(x).tickSize(0).tickFormat(''));

// Y Axis
const y = d3.scaleLinear()
.domain([0, 590])
.range([590, 0]);
g.append("g")
.attr("class", "axis")
.call(d3.axisLeft(y).tickSize(0).tickFormat(''));

// Data Points --------------------------------------------------------------------------------------------------
const updateDatapoints = filteredData => {
// Bind data to the circle elements
const dataPoints = g.selectAll(".dot")
.data(filteredData, d => d.num); // Ensure 'd.num' is a unique key
  
// Remove data points that no longer exist
dataPoints.exit().remove();
  
// Add new data points and handle transitions
const enteredDataPoints = dataPoints.enter()
.append("circle")
.attr("class", "dot")
.attr("r", 12)
.attr("cx", d => x(d.x))
.attr("cy", d => y(d.y))
.attr("fill", d => colorScale(d.club))
.attr("stroke", '#000')
.attr("stroke-width", 1)
.style("opacity", 0); // Start with opacity 0 for fade-in effect
  
// Merge new and existing data points
enteredDataPoints
.merge(dataPoints)
.transition() // Apply transition for both new and updated dots
.duration(2000) // Adjust duration as needed
.style("opacity", 1) 
.attr("cx", d => x(d.x))
.attr("cy", d => y(d.y))
.attr("fill", d => colorScale(d.club))
.attr("stroke", '#000')
.attr("stroke-width", 1);
  
// Apply event handlers to all data points
g.selectAll(".dot")
.on("mouseover", mouseOver)
.on("mouseout", mouseOut);
};
  

// Hover Events --------------------------------------------------------------------------------------------------
// Mouse Over
const mouseOver = function(event, d) {

const lines = d3.line()
.curve(d3.curveBundle.beta(d.curve))
.x(d => x(d.x))
.y(d => y(d.y));

g.select(".pitch")
.transition()
.duration(200)
.style("opacity",0.3);

d3.select("#tooltip")
.style("display", "inline-block")
.html(`${d.season}</br>${d.fixture}`)
.transition()
.duration(200)
.style("opacity", 1);

const pathData = [
{x: d.x, y: d.y, club: d.club}, 
{x: d.x2, y: d.y2, club: d.club},
{x: d.x3, y: d.y3, club: d.club}
];

const paths = g.selectAll(".goal-path")
.data([pathData]);

paths
.enter()
.append("path")
.merge(paths)
.attr("class", "goal-path")
.attr("d",lines)
.attr("stroke", pathData => {
const club = pathData[0].club;
console.log("Club for color:", club);
return colorScale(club);
})    
.attr("stroke-width", 2)
.attr("fill", "none")
.style("opacity", 0)
.transition()
.duration(300)
.style("opacity", 1);
};

// Mouse Out
const mouseOut = function() {
g.select(".pitch")
.transition()
.duration(100)
.style("opacity",1);

d3.select("#tooltip")
.transition()
.duration(100)
.style("opacity", 0);
g.selectAll(".goal-path")
.transition()
.duration(100)
.style("opacity",0)
};


updateDatapoints(parsedData);

// Filter -----------------------------------------------------------------------------------------------------------
const dropdown = d3.select("#club-filter");
const clubs = Array.from(new Set(parsedData.map(d => d.club)));
clubs.unshift("All Clubs");
clubs.sort((a, b) => a === "All Clubs" ? -1 : b === "All Clubs" ? 1 : a.localeCompare(b));

clubs.forEach(club => {
  dropdown.append("option").attr("value", club).text(club);
});

dropdown.on("change", function() {
  const selectedClub = d3.select(this).property("value");
  const filteredData = selectedClub === "All Clubs" ? parsedData : parsedData.filter(d => d.club === selectedClub);
  updateDatapoints(filteredData);
});

// Legend handling
const legendContainer = d3.select("#legend-container");
colorScale.domain().forEach(club => {
const legendItem = legendContainer
.append("div")
.attr("class", "legend-item");
legendItem
.append("div")
.attr("class", "legend-color")
.style("background-color", colorScale(club));
legendItem
.append("span")
.text(club);
});


