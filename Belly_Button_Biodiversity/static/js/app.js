function buildMetadata(sample) {

  // @TODO: Complete the following function that builds the metadata panel
  d3.json(`/metadata/${sample}`).then((data) => {
    // Use d3 to select the panel with id of `#sample-metadata`
    let selectManipulatePanel = d3.select("#sample-metadata");
    // Use `.html("") to clear any existing metadata
    selectManipulatePanel.html("");
    // Use `Object.entries` to add each key and value pair to the panel
    // Hint: Inside the loop, you will need to use d3 to append new tags for each key-value in the metadata
    Object.entries(data).forEach(([key, value]) => {
        selectManipulatePanel.append("h6").text(`${key}:${value}`);
    
    // let gaugeChartData = [
    //   {
    //     domain: {x: min(data.WFREQ), y: max(data.WFREQ)},
    //     value: data.WFREQ,
    //     title: {text:"Belly Button Washing Frequency"},
    //     type:  "indicator",
    //     mode: "gauge+number"
    //   }
    // ];
    // let gaugeChartLayout = {
    //   width: 600, 
    //   height: 500, 
    //   margin: { t: 0, b: 0 } 
    // };
    // Plotly.newPlot("gauge", gaugeChartData, gaugeChartLayout);
    var dataGauge = [{domain: {x: [0, 1], y: [0, 1]}, value: data.WFREQ,
    title: {text: "Belly Button Washing Frequency Scrubs Per Week", font: {size: 14}},
    type: "indicator", mode: "gauge+number+delta",
    delta: {reference: 9, increasing: {color: "green"}},
    gauge:
      {axis: {range: [0, 10]}, steps: [{range: [0, 5], color: "lightgray"},
      {range: [5, 8], color: "gray"}], threshold: {line: {color: "red", width: 4},
      thickness: 0.75, value: 9}}}];

    var gaugeLayout = {width: 400, height: 500, margin: {t: 0, b: 0}};
    Plotly.newPlot("gauge", dataGauge, gaugeLayout);
    });
});
  
    // BONUS: Build the Gauge Chart
    // buildGauge(data.WFREQ);
    
}

function buildCharts(sample) {

  // @TODO: Use `d3.json`to fetch the sample data for the plots
  var url = "/samples/"+sample;
  d3.json(url).then(function(response) {

    console.log(response);
    var data = [response];
    let otu_ids = response.otu_ids.slice(0,10);
    let otu_labels = response.otu_labels.slice(0,10);
    let sample_values = response.sample_values.slice(0,10);   
    let pieChartData = [
      {
        values: sample_values,
        labels: otu_ids,
        hovertext: otu_labels,
        hoverinfo: "hovertext",
        colorscale: "Picnic",
        type: "pie"
      }
    ];
  

    let pieChartLayout = {

      margin: { t: 0, l: 0 }

    };
    

    Plotly.newPlot("pie", pieChartData, pieChartLayout);

    let bubbleChartData = [
      {
        x: otu_ids,
        y: sample_values,
        text: otu_labels,
        mode: "markers",
        marker: {
          size: sample_values,
          color: otu_ids,
          colorscale: "Picnic"
        }
      }
    ];
    let bubbleChartLayout = {
      margin: { t: 0 },
      hovermode: "closests",
      xaxis: { title: "OTU ID"}
    };
    Plotly.newPlot("bubble", bubbleChartData, bubbleChartLayout);

    
  });
    // @TODO: Build a Bubble Chart using the sample data
    
    // @TODO: Build a Pie Chart
    // HINT: You will need to use slice() to grab the top 10 sample_values,
    // otu_ids, and labels (10 each).
}

function init() {
  // Grab a reference to the dropdown select element
  var selector = d3.select("#selDataset");

  // Use the list of sample names to populate the select options
  d3.json("/names").then((sampleNames) => {
    sampleNames.forEach((sample) => {
      selector
        .append("option")
        .text(sample)
        .property("value", sample);
    });

    // Use the first sample from the list to build the initial plots
    const firstSample = sampleNames[0];
    buildCharts(firstSample);
    buildMetadata(firstSample);
  });
}

function optionChanged(newSample) {
  // Fetch new data each time a new sample is selected
  buildCharts(newSample);
  buildMetadata(newSample);
}

// Initialize the dashboard
init();
