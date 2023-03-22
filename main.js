/*
d3.csv("data/first5k.csv", function(data) {
    // Print the first 10 rows of the data to the console
    for (var i = 0; i < 10; i++) {
        console.log(data[i]);
    }
});
*/

// first vis
function build_type_vis(pitch_data) {
    // define height, width and margin
    const h = 400;
    const w = 400;
    const margin = 50;
    const radius = Math.min(w, h) / 2;

    const type_frame = d3.select("#type_vis")
        .append("svg")
        .attr("height", h)
        .attr("width", w)
        .append("g")
        .attr("transform", "translate(" + margin + "," + margin + ")");

    d3.csv(pitch_data).then((data) => {
        const counts = {};
        data.forEach(d => {
        if (!counts[d.pitch_count]) {
            counts[d.pitch_count] = 0;
        }
        counts[d.pitch_count]++;

        const countsArray = Object.keys(counts).map(key => {
            return { label: key, value: counts[key] };
        });

        const pie = d3.pie()
            .value(d => d.value)
            .sort(null);

        const slices = type_frame.selectAll('slice')
        .data(pie(countsArray))
        .enter()
        .append('g')
        .attr('class', 'slice');

        slices.append('path')
        .attr('d', d3.arc()
            .innerRadius(0)
            .outerRadius(radius)
        )
        .attr('fill', d => d3.schemeCategory10[d.index]);

        slices.append('text')
            .text(d => `${d.data.label}: ${d.data.value}`)
            .attr('transform', d => `translate(${d3.arc().centroid(d)})`)
            .attr('text-anchor', 'middle');
    });


});
}
build_type_vis("data/2021_statcast.csv")

// second vis--needs work
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

    d3.csv("data/2021_statcast.csv").then((data) => {

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