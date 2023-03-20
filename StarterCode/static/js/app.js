// data provided at following url
const url= "https://2u-data-curriculum-team.s3.amazonaws.com/dataviz-classroom/v1.1/14-Interactive-Web-Visualizations/02-Homework/samples.json"

//initialize
function init(){
    d3.json(url).then(function (data) {
        console.log(data);
        var allGroups = data.names;
        d3.select("#selDataset")
            .selectAll('myOptions')
                .data(allGroups)
            .enter()
                .append('option')
            .text(function (d) {return d; })
            .attr("value", function (d) {return d;});
        var initSample = allGroups[0];

        buildPlots(initSample);
        demographics(initSample);
    });
};

//change the plot data when the input is changed on the dropdown
function optionChanged() {
    let dropdown = d3.select("#selDataset");
    // need to set a variable to be the selected value from the dropdown menu
    let name = dropdown.property("value");

    buildPlots(name);
    demographics(name);
};

function buildPlots(sample) {
    d3.json(url).then(function(data) {
        // need the following variables
        var samplesData = data.samples // enter dataset
        var samplesFiltered = samplesData.filter(row => row.id == sample) // dataset filtered on selected value
        var sampleValues = samplesFiltered[0].sample_values //selected value's Sample Values
        var otuIDs = samplesFiltered[0].otu_ids; //selected value's otu IDs
        var otuLabels = samplesFiltered[0].otu_labels; //selected value's otu Labels

        // need to slice and reverse the above three to select the top 10 OTUs
        var valuesSliced = sampleValues.slice(0,10).reverse();
        var idsSliced = otuIDs.slice(0,10).reverse();
        var labelsSliced = otuLabels.slice(0.10).reverse();

        //now that we have our variables, we need to build the plots
        // BAR CHART ------------------------------------------------------------------
        var barchart = {
            x:valuesSliced,
            y:idsSliced.map(item => `OTU ${item}`),
            type:"bar",
            orientation: "h",
            text: labelsSliced,
        };
        var data = [barchart];
        Plotly.newPlot("bar",data);

        // BUBBLE CHART ----------------------------------------------------------------
        var bubblechart = {
            x:otuIDs,
            y:sampleValues,
            mode:"markers",
            text:otuLabels,
            marker: {
                size:sampleValues,
                color:otuIDs
            }
        };
        var bubbles = [bubblechart];
        // need labels everywhere!!!
        var layout = {
            title: "Bubble Chart of Sample Values",
            xaxis: {
                title:"OTU IDs"
            },
            yaxis: {
                title:"Sample Values"
            }
        };
        Plotly.newPlot("bubble",bubbles,layout);
    })
};

function demographics(sample) {
    var demo = d3.select("#sample-metadata")
    d3.json(url).then(function(data){
        var demographicsData = data.metadata; // all metadata available in samples.json
        var demoFiltered = demographicsData.filter(row => row.id==sample)
        console.log(demoFiltered)

        //need to clear what's in there currently to make room for new stuff
        demo.selectAll("p").remove();
        // for each row (should only be 1) and for each value in the list, print it to the paragraph element
        demoFiltered.forEach((row) => {
            for (const [key,value] of Object.entries(row)) {
                demo.append("p").text(`${key}: ${value}`);
            };
        });
    });
};

//need to run init function to start
init();
