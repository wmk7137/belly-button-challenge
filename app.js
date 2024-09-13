// Function to build the metadata panel
function buildMetadata(sample) {
  d3.json("https://raw.githubusercontent.com/wmk7137/belly-button-challenge/main/samples.json").then((data) => {
    const metadata = data.metadata;

    // Filter metadata for the selected sample
    const result = metadata.filter(sampleObj => sampleObj.id == sample);
    const sampleMetadata = result[0];

    // Select the panel with id of `#sample-metadata`
    const panel = d3.select("#sample-metadata");

    // Clear any existing metadata
    panel.html("");

    // Append new tags for each key-value pair in the metadata
    Object.entries(sampleMetadata).forEach(([key, value]) => {
      panel.append("p").text(`${key}: ${value}`);
    });
  });
}

// Function to build both charts
function buildCharts(sample) {
  d3.json("https://raw.githubusercontent.com/wmk7137/belly-button-challenge/main/samples.json").then((data) => {
    // Get the samples field
    const samples = data.samples;

    const sampleData = samples.filter(s => s.id === sample)[0];
  
    const otu_ids = sampleData.otu_ids;
    const otu_labels = sampleData.otu_labels;
    const sample_values = sampleData.sample_values;

    const bubbleTrace = {
      x: otu_ids,
      y: sample_values,
      text: otu_labels,
      mode: 'markers',
      marker: {
        size: sample_values,
        color: otu_ids,
        colorscale: 'Earth'
      },
      type: 'scatter'
    };

    const bubbleLayout = {
      title: `Bacteria Cultures per Sample`,
      xaxis: { title: 'OTU ID' },
      yaxis: { title: 'Number of Bacteria' }
    };

    Plotly.newPlot('bubble', [bubbleTrace], bubbleLayout);

    // Prepare data for the Bar Chart
    const otuData = otu_ids.map((id, index) => ({
      id: `OTU ${id}`,
      value: sample_values[index],
      label: otu_labels[index]
    }));

    otuData.sort((a, b) => b.value - a.value);

    const top10Data = otuData.slice(0, 10);

    const top10Values = top10Data.map(d => d.value);
    const top10IDs = top10Data.map(d => d.id);
    const top10Labels = top10Data.map(d => d.label);

    const barTrace = {
      x: top10Values,
      y: top10IDs,
      text: top10Labels,
      type: 'bar',
      orientation: 'h'
    };

    const barLayout = {
      title: `Top 10 Bacteria Cultures Found`,
      xaxis: { title: 'Number of Bacteria' },
      yaxis: { autorange: 'reversed' }
    };

    Plotly.newPlot('bar', [barTrace], barLayout);
  });
}

// Function to run on page load
function init() {
  d3.json("https://raw.githubusercontent.com/wmk7137/belly-button-challenge/main/samples.json").then((data) => {

    const sampleNames = data.names;

    const dropdown = d3.select("#selDataset");

    sampleNames.forEach(sample => {
      dropdown.append("option").text(sample).property("value", sample);
    });

    const firstSample = sampleNames[0];

    // Build charts and metadata panel with the first sample
    buildCharts(firstSample);
    buildMetadata(firstSample);
  });
}

// Function for event listener
function optionChanged(newSample) {
  // Build charts and metadata panel each time a new sample is selected
  buildCharts(newSample);
  buildMetadata(newSample);
}

// Initialize the dashboard
init();

