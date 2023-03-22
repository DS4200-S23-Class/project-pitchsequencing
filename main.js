
function build_location_vis() {

    var margin = 50,
    width = 400,
    height = 400;

    var svg = d3.select("#location_vis")
        .append("svg")
            .attr("width", width+margin+margin)
            .attr("height", height+margin+margin)
        .append("g")
            .attr("transform", "translate("+50+","+50+")");

    d3.csv("2021_statcast.csv").then((data) => {

        var xScale = d3.scaleLinear()
            .range([0,width])
            .domain([-10, 10]);

        svg.append("g")
            .attr("transform", "translate(0,"+height+")")
            .call(d3.axisBottom(xScale));

        var yScale = d3.scaleLinear()
            .range([height,0])
            .domain([-10,10]);

        svg.append("g")
            .call(d3.axisLeft(yScale));

        svg.append("g")
            .selectAll("dot")
            .data(data)
            .enter()
            .append("circle")
                .attr("cx", function(d){return xScale(d.plate_x);})
                .attr("cy", function(d){return yScale(d.plate_z);})
                .attr("r", 1.5)
                .attr("opacity", .05)
                .attr("fill", "#FF2E2E")
                

    });
}
build_location_vis()