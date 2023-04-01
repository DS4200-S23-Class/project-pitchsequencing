// linking between vizs with data filtering will be implemented in final design
// VISUALIZATIONS ONLY APPEAR IN LOCALHOST (likely do to massive csv)

// vis 1
// we changed vis 1 to show the placements of pitches in similar situations as the
// area vs likelihood graph would likely have many blank areas with specific filtering

// HERE make dropdowns to change pitch_data and filter for user inputs such as pitch count, batter handedness, inning, etc.

function build_location_vis(pitch_data) {

    const margin = 50;
    const width = 400;
    const height = 400;

    const LOC_FRAME = d3.select("#location_vis")
        .append("svg")
            .attr("width", width+margin+margin)
            .attr("height", height+margin+margin)
            .attr("class", "frame")
        .append("g")
            .attr("transform", "translate(" + margin + "," + margin + ")");

    d3.csv(pitch_data).then((data) => {

        // potential color mapping for location_vis (not working)
        const COLOR = d3
            .scaleOrdinal()
            .domain(["FF", "SL", "CU", "SI", "CH", "FC", "KC", "FS"])
            .range(["blue", "orange", "green", "red", "purple", "brown", "pink", "gray"]);

        const xScale = d3.scaleLinear()
            .range([0,width])
            .domain([-4,4]);

        LOC_FRAME.append("g")
            .attr("transform", "translate(0,"+height+")")
            .call(d3.axisBottom(xScale));

        LOC_FRAME.append("text")
        .attr("transform", "translate(" + (width/2) + "," + (height + margin - 10) + ")")
        .style("text-anchor", "middle")
        .text("Horizontal Location (feet)");

        const yScale = d3.scaleLinear()
            .range([height,0])
            .domain([-2, 6]);

        LOC_FRAME.append("g")
            .call(d3.axisLeft(yScale));
        
        LOC_FRAME.append("text")
        .attr("transform", "rotate(-90)")
        .attr("y", 0 - margin)
        .attr("x", 0 - (height / 2))
        .attr("dy", "1em")
        .style("text-anchor", "middle")
        .text("Vertical Location (feet)");

        // append lines for strike zone boxes
        // LOC_FRAME.append("g")
            // .selectAll("dot")
            // .enter()
            // .append("line")
                // .attr("class", "k-zone")
                // .attr("x1", function(d) {return xScale(-.708)})
                // .attr("x2", function(d) {return xScale(-.708)})
                // .attr("y1", function(d) {return yScale(0)})
                // .attr("y2", function(d) {return yScale(4)})
                // .attr("stroke", "black")

        // plot the points for the location visualization
        LOC_FRAME.selectAll("dot")
            .data(data)
            .enter()
            .append("circle")
                .attr("cx", function(d){return xScale(d.plate_x);})
                .attr("cy", function(d){return yScale(d.plate_z);})
                .attr("r", 2)
                .attr("opacity", .5)
                .attr("class", "point")
                .attr("fill", function(d) {return COLOR(d.pitch_type)}); // this is where color function would go if working

        // title for location visualization
        LOC_FRAME.append("g")
                .append("text")
                .attr("x", (width/2))
                .attr("y", 0 - (margin/2))
                .attr("text-anchor", "middle")
                .style("font-size", "20px")
                .text("Most probable pitch location");

        const tooltip = d3.select("#location_vis")
        .append("div")
        .attr("class", "tooltip")
        .style("opacity", 0);

         // Define event handler functions for tooltips
        function handleMouseover(event, d) {
          // on mouseover, make opaque
          tooltip.style("opacity", 1);
          // when hovering over a point make more opaque and highlight
          d3.select(this).attr("opacity", .9)
          d3.select(this).attr("fill", "yellow");
        }

        function handleMousemove(event, d) {
          // position the tooltip and fill in information
          tooltip.html("Pitch Type: " + d.pitch_type + "<br>x: " + d.plate_x + "<br>z: " + d.plate_z)
            .style("left", event.pageX + 10 + "px") //add offset
            // from mouse
            .style("top", event.pageY - 50 + "px");
        }

        function handleMouseleave(event, d) {
          // on mouseleave, make transparent again
          tooltip.style("opacity", 0);
          // when you have gone over a point change it to black
          d3.select(this).attr("fill", "black");
        }

        // Add event listeners
        LOC_FRAME.selectAll(".point")
          .on("mouseover", handleMouseover) //add event listeners
          .on("mousemove", handleMousemove)
          .on("mouseleave", handleMouseleave);

        console.log('colorFF' + COLOR('FF'));
        console.log('colorSL' + COLOR('SL'));
    });

    
}
// used first 5000 rows as sample data
build_location_vis("data/first5k.csv")

// vis 2 (needs work)
function build_type_vis(pitch_data) {
    // define height, width and margin
    const h = 400;
    const w = 400;
    const margin = 50;
    const radius = Math.min(w, h) / 2;

    const TYPE_FRAME = d3.select("#type_vis")
        .append("svg")
        .attr("height", h)
        .attr("width", w)
        .append("g")
        .attr("transform", "translate(" + h / 2 + "," + w / 2 + ")");

    
        d3.csv(pitch_data).then((data) => {
        const counts = {};
        data.forEach(d => {
        if (!counts[d.pitch_type]) {
            counts[d.pitch_type] = 0;
            };
        counts[d.pitch_type]++;
        });

        console.log(counts)

        const countsArray = Object.keys(counts).map(key => {
            return { label: key, value: counts[key] };
        });

        const pie = d3.pie()
            .value(d => d.value)
            .sort(null);
        
        const slices = TYPE_FRAME.selectAll('slice')
            .data(pie(countsArray))
            .enter()
            .append('g')
            .attr('class', 'slice')

        const PITCH_NAME = d3
            .scaleOrdinal()
            .domain(["FF", "SL", "CU", "SI", "CH", "FC", "KC", "FS"])
            .range(["Fastball", "Slider", "Curveball", "Sinker", "Changeup", "Cut Fastball", "Knuckle Curve", "Sinking Fastball"]);

        console.log(PITCH_NAME("SL"))


        const tooltip = d3.select("#type_vis")
        .append("div")
        .attr("class", "tooltip")
        .style("opacity", 0);

         // Define event handler functions for tooltips
        function handleMouseover(event, d) {
          // on mouseover, make opaque
          tooltip.style("opacity", 1);
          d3.select(this).attr("border", "black");
        }

        function handleMousemove(event, d) {
          // position the tooltip and fill in information
          tooltip.html(`Pitch Name: ${PITCH_NAME(d.data.label)}<br>Count: ${d.data.value}`)
            .style("left", event.pageX + 10 + "px") //add offset
            // from mouse
            .style("top", event.pageY - 50 + "px");
        }

        function handleMouseleave(event, d) {
          // on mouseleave, make transparent again
          tooltip.style("opacity", 0);
          d3.select(this).attr("fill", "black");
        }

        // Add event listeners
        TYPE_FRAME.selectAll(".slice")
          .on("mouseover", handleMouseover) //add event listeners
          .on("mousemove", handleMousemove)
          .on("mouseleave", handleMouseleave);

        slices.append('path')
            .attr('d', d3.arc()
                .innerRadius(0)
                .outerRadius(radius)
            )
            .attr('fill', d => d3.schemeCategory10[d.index]);

        slices.append("text")
          .attr("transform", function(d){
                  d.innerRadius = 0;
                  d.outerRadius = radius;
                  return "translate(" + d3.arc().centroid(d) + ")";
            })
                .attr("text-anchor", "middle")
                .text(d => `${d.data.label}`);
    });

    }

build_type_vis("data/first5k.csv");
