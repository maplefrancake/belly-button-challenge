// data provided at following url
const url= "https://2u-data-curriculum-team.s3.amazonaws.com/dataviz-classroom/v1.1/14-Interactive-Web-Visualizations/02-Homework/samples.json"

//initialize
d3.json(url).then(function (data) {
    console.log(data);
    var allGroups = data.names;
    d3.select("#selDataset")
        .selectAll('myOptions')
            .data(allGroups)
        .enter()
            .append('option')
        .text(function (d) {return d; })
        .attr("value", function (d) {return d;})
    var initSample = allGroups[0];
});


// filter is on 'names' - need to grab top 10 OTU for each individual


function filter(name) {
    //return the data for individual name
};
