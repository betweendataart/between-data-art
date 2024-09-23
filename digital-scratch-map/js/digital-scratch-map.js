import * as d3 from 'd3';
import featureCollection from '../data/countries.json';

const visitedCountries = ["Belgium", "Egypt", "France", "Germany", "Greece", "Italy", "Ireland", "Mauritius",
    "Netherlands", "Spain", "Turkey", "Uganda", "UK", "USA"];

const rowOne = ["Belgium", "Egypt", "France", "Germany", "Greece", "Italy", "Ireland"];
const rowTwo = ["Mauritius", "Netherlands", "Spain", "Turkey", "Uganda", "UK", "USA"];

const visitedSet = new Set(visitedCountries);

document.addEventListener('DOMContentLoaded', () => {
    // Populate the country lists
    createCountryList('rowOne', rowOne);
    createCountryList('rowTwo', rowTwo);

    // Map setup
    const fixedWidth = 800;
    const fixedHeight = 600;
    const svg = d3.select('#map')
        .attr('width', fixedWidth)
        .attr('height', fixedHeight)
        .style('opacity', 0);

    renderMap(svg, fixedWidth, fixedHeight);
    highlightCountries(svg);
});

// Function to create a list of countries in the specified container
function createCountryList(containerId, countryArray) {
    const listContainer = document.getElementById(containerId);
    countryArray.forEach(country => {
        const listItem = document.createElement('li');
        listItem.textContent = country;
        listContainer.appendChild(listItem);
    });
}

// Function to render the map
function renderMap(svg, width, height) {
    const projection = d3.geoMercator()
        .scale(width / 1.8 / Math.PI)
        .translate([width / 1.635, height / 1.425]);

    const path = d3.geoPath().projection(projection);

    // Render map paths
    svg.selectAll('path')
        .data(featureCollection.features)
        .enter().append('path')
        .attr('d', path)
        .attr('fill', '#f5f5f5')
        .attr('stroke', '#757e63')
        .attr('stroke-width', 0.75);

    // Fade-in effect
    svg.transition()
        .duration(2000)
        .style('opacity', 1);

    // Highlight visited countries
    svg.selectAll('path')
        .filter(d => visitedSet.has(d.properties.ADMIN))
        .attr('fill', '#bac2aa');
}

// Function to highlight countries sequentially
function highlightCountries(svg) {
const countries = rowOne.concat(rowTwo);
let currentIndex = 0;

function highlightNext() {
const country = countries[currentIndex];

// Highlight the corresponding list item
highlightListItem(country);

// Highlight the country on the map
svg.selectAll('path')
.filter(d => d.properties.ADMIN === country)
.attr('fill', '#4ca55f');

if (currentIndex > 0) {
    const prevCountry = countries[currentIndex - 1];
    unhighlightListItem(prevCountry);
    svg.selectAll('path')
    .filter(d => d.properties.ADMIN === prevCountry)
    .attr('fill', visitedSet.has(prevCountry) ? '#bac2aa' : '#f5f5f5');
}

if (currentIndex === 0 && countries.length > 1) {
    const lastCountry = countries[countries.length -1];
    unhighlightListItem(lastCountry);
    svg.selectAll('path')
    .filter(d => d.properties.ADMIN === lastCountry)
    .attr('fill', visitedSet.has(lastCountry) ? '#bac2aa' : '#f5f5f5')
}

currentIndex++;

if (currentIndex >= countries.length) {
    currentIndex = 0;
}


setTimeout(highlightNext, 1500);
}
    

    highlightNext();
}
// Function to highlight a specific list item
function highlightListItem(country) {
    const listItems = document.querySelectorAll('#rowOne li, #rowTwo li');
    listItems.forEach(listElement => {
        if (listElement.textContent.trim() === country) {
            listElement.style.textDecoration = 'underline';
            listElement.style.textDecorationThickness = '2px';

        }
    });
}

// Function to unhighlight a specific list item
function unhighlightListItem(country) {
    const listItems = document.querySelectorAll('#rowOne li, #rowTwo li');
    listItems.forEach(listElement => {
        if (listElement.textContent.trim() === country) {
            listElement.style.textDecoration = 'none';

        }
    });
}
