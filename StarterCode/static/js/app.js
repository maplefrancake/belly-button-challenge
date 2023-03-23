// data provided at following url
const url= "https://2u-data-curriculum-team.s3.amazonaws.com/dataviz-classroom/v1.1/14-Interactive-Web-Visualizations/02-Homework/samples.json"

//initialize
function init(){
    var variablesList = {};
    d3.json(url).then(function (data) {
        var allGroups = data.names;
        d3.select("#selDataset")
            .selectAll('myOptions')
                .data(allGroups)
            .enter()
                .append('option')
            .text(function (d) {return d; })
            .attr("value", function (d) {return d;});
        var initSample = allGroups[0];
        
        // initial bar chart set up
        variablesList = setVariables(data, initSample);
        var data = barChart(variablesList["valuesSliced"],variablesList["idsSliced"],variablesList["labelsSliced"]);
        Plotly.newPlot("bar",data);

        // can use the rest of the variablesList dictionary for set up/initial bubble chart
        var data = bubbleChart(variablesList["sampleValues"],variablesList["otuIDs"],variablesList["otuLabels"]);
        var layout = {
            title: "Bubble Chart of Sample Values",
            xaxis: {
                title: {
                    text: "OTU IDs"
                }
            },
            yaxis: {
                title: {
                    text: "Sample Values"
                }
            }
        }
        Plotly.newPlot("bubble",data,layout);
        demographics(initSample);
    });
};

//change the plot data when the input is changed on the dropdown
function optionChanged() {
    let dropdown = d3.select("#selDataset");
    // need to set a variable to be the selected value from the dropdown menu
    let name = dropdown.property("value");

    d3.json(url).then(function (data) {
        buildPlots(data, name);
    })
    demographics(name);
};

function setVariables(data, sample) {
    var varList = {};
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

    //set the dictionary of variables we need for initial charts + updates
    varList["sampleValues"] = sampleValues;
    varList["otuIDs"] = (otuIDs);
    varList["otuLabels"] = otuLabels;
    varList["valuesSliced"] = valuesSliced;
    varList["idsSliced"] = idsSliced;
    varList["labelsSliced"] = labelsSliced;
    return varList;
};

function barChart(valuesSliced, idsSliced, labelsSliced) {
    console.log(`bar chart ${valuesSliced}`);
    console.log(idsSliced);
    console.log(labelsSliced);
    var barchart = {
        x:valuesSliced,
        y:idsSliced.map(item => `OTU ${item}`),
        type:"bar",
        orientation: "h",
        text: labelsSliced,
    }
    var bardata = [barchart];
    return bardata;
};

function bubbleChart(sampleValues, otuIDs, otuLabels){
    var bubblechart = {
        x:otuIDs,
        y:sampleValues,
        mode:"markers",
        text:otuLabels,
        marker: {
            size:sampleValues,
            color:otuIDs
        }
    }
    var bubbles = [bubblechart];
    return bubbles;
};

function buildPlots(data, sample) {
    console.log(data);
    var variablesList = {};
    // reset our variables
    variablesList = setVariables(data, sample);
    
    // rebuilt the bar chart
    var data = barChart(variablesList["valuesSliced"],variablesList["idsSliced"],variablesList["labelsSliced"]);
    console.log(`rebuild bar data: ${data}`)
    Plotly.restyle("bar",data);
    
    // rebuild the bubble chart
    var data = bubbleChart(variablesList["sampleValues"],variablesList["otuIDs"],variablesList.otuLabels);
    Plotly.restyle("bubble",data);
};

function demographics(sample) {
    var demo = d3.select("#sample-metadata")
    d3.json(url).then(function(data){
        var demographicsData = data.metadata; // all metadata available in samples.json
        var demoFiltered = demographicsData.filter(row => row.id==sample)

        //need to clear what's in there currently to make room for new stuff
        demo.selectAll("p").remove();
        // for each row (should only be 1) and for each value in the list, print it to the paragraph element
        demoFiltered.forEach((row) => {
            for (const [key,value] of Object.entries(row)) {
                demo.append("p").text(`${key}: ${value}`);
            };
        })
    })
};

//need to run init function to start
init();
