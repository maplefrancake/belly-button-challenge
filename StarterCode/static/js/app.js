/* Frances Jay
belly button challenge

I've attempted to split everything out into its own function, so I can call them as need
be instead of rewriting the same code with minor tweaks depending on if its the first time
we're creating the charts or the 2nd, 3rd, etc time doing it. I also wanted to make sure to
use Plotly.newPlot for the initial charts, and use Plotly.restyle for the updates. I achieved
the same results when calling newPlot for each time, but I wanted to challenge myself to do
this since it seems more efficient from my research. Also, it's just good practice.
 */
// data provided at following url
const url= "https://2u-data-curriculum-team.s3.amazonaws.com/dataviz-classroom/v1.1/14-Interactive-Web-Visualizations/02-Homework/samples.json"

//initialize
function init(){
    var variablesList = {};
    d3.json(url).then(function (data) {
        // we're setting up the dropdown button here and programatically setting the options
        var allGroups = data.names;
        d3.select("#selDataset")
            .selectAll('myOptions')
                .data(allGroups)
            .enter()
                .append('option')
            .text(function (d) {return d; })
            .attr("value", function (d) {return d;});
        // we want to set up the charts initially with the default/first value in our list
        var initSample = allGroups[0];
        
        // initial bar chart set up
        variablesList = setVariables(data, initSample);
        var chartdata = barChart(variablesList["valuesSliced"],variablesList["idsSliced"],variablesList["labelsSliced"]);
        Plotly.newPlot("bar",chartdata);

        // can use the rest of the variablesList dictionary for set up/initial bubble chart
        var chartdata = bubbleChart(variablesList["sampleValues"],variablesList["otuIDs"],variablesList["otuLabels"]);
        // the layout is going to stay the same through the changes, so we can set this up once
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
        Plotly.newPlot("bubble",chartdata,layout);
        demographics(initSample);
    });
};

//change the plot data when the input is changed on the dropdown
function optionChanged() {
    //select the dropdown item first before we can set the value
    let dropdown = d3.select("#selDataset");
    // need to set a variable to be the selected value from the dropdown menu
    let name = dropdown.property("value");

    buildPlots(name);
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

// set the dictionary Plotly uses to create a chart for our bar chart
function barChart(valuesSliced, idsSliced, labelsSliced) {
    var barchart = {
        x:valuesSliced,
        y:idsSliced.map(item => `OTU ${item}`),
        type:"bar",
        orientation: "h",
        text: labelsSliced,
    }
    // Plotly wants a list of dictionaries, so we need to return it as such
    var bardata = [barchart];
    return bardata;
};

// similar to barChart function, we need to set the dictionary Plotly will accept
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

/* after the dropdown list changes, we'll call this to make the actual updates to our bar
and bubble charts. we'll need to reset the variables and make a smaller dictionary
of the things to actually change within the plot using Plotly.restyle */
function buildPlots(sample) {
    var variablesList = {};
    d3.json(url).then(function (data) {
        // reset our variables
        variablesList = setVariables(data, sample);
    
        // rebuild the bar chart
        var chartdata = barChart(variablesList["valuesSliced"],variablesList["idsSliced"],variablesList["labelsSliced"]);
        // we only want to/can update some things within the chart > set those things
        var updateData = {
            "x":[chartdata[0].x],
            "y":[chartdata[0].y],
            "text":chartdata[0].text
        }
        Plotly.restyle("bar",updateData);
        
        // rebuild the bubble chart
        var chartdata = bubbleChart(variablesList["sampleValues"],variablesList["otuIDs"],variablesList["otuLabels"]);
        // similarly to above, we can only make updates to some things, so set those
        var updateData = {
            "x":[chartdata[0].x],
            "y":[chartdata[0].y],
            "text":chartdata[0].text,
            "marker.size": [chartdata[0].marker.size],
            "marker.color": [chartdata[0].marker.color]
        }
        Plotly.restyle("bubble",updateData);
    });
};

/* this function changes what is displayed within the Demographics card on the site
We're not making any updates with Plotly; it's simply updating a list of attributes about
the data point in particular that we need to update. */
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