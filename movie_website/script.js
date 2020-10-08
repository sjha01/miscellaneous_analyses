d3.csv('movie_database_1.csv', function (data) {

    // List of groups (here I have one group per column)
    
    //var categories = ['Happy', 'Inspiring', 'Mind-fucking',
    //    'Exciting', 'Fast-paced', 'Thought-provoking',
    //    'Funny', 'Silly', 'Romantic']
    
    var categories = Object.keys(d3.values(data)[0]);
    categories.shift(); // removes first element from categories
    
    // randomize starting plotted variables.
    var x_start_ind = Math.floor(Math.random() * categories.length);
    var y_start_ind = Math.floor(Math.random() * (categories.length - 1));
    if (y_start_ind == x_start_ind) {
      y_start_ind = y_start_ind + 1;
    }
    var selectedOption_x = categories[x_start_ind];
    var selectedOption_y = categories[y_start_ind];
    var data_xy = data.map(function(d) {return {value_movie: d['Movie'], value_x:d[selectedOption_x], value_y:d[selectedOption_y]} })
    
    var is_scatter_point_clicked = new Array(d3.values(data).length); // empty array with length == number of rows.
    for (var i =0; i < is_scatter_point_clicked.length; i++) {
        is_scatter_point_clicked[i] = false;
    }
    
    // add the options to the button
    d3.select("#selectButton_x")
        .selectAll('myOptions')
        .data(categories)
        .enter()
        .append('option')
        .attr("value", function (d) { return d; }) // corresponding value returned by the button
        .property("selected", function(d) { return d === selectedOption_x; }) // set starting value
        .text(function (d) { return d; }) // text showed in the menu

    d3.select("#selectButton_y")
        .selectAll('myOptions')
        .data(categories)
        .enter()
        .append('option')
        .attr("value", function (d) { return d; }) // corresponding value returned by the button
        .property("selected", function(d) { return d === selectedOption_y; }) // set starting value
        .text(function (d) { return d; }) // text showed in the menu

    var body = d3.select('body')
    var margin = { top: 50, right: 50, bottom: 50, left: 50 }
    var h = 500 - margin.top - margin.bottom
    var w = 500 - margin.left - margin.right
    var formatDecimal = d3.format('.2f')
    
    // scatter plot variables
    
    var colorScale = d3.scale.category20()
    var xScale = d3.scale.linear()
      .domain([0,5])
      .range([0,w])
    var yScale = d3.scale.linear()
      .domain([0,5])
      .range([h,0])
	  
	var svg_scatter = d3.select("#scatter_plot_1")
        .append("svg")
	    .attr('height', h + margin.top + margin.bottom)
	    .attr('width', w + margin.left + margin.right)
	    .append('g')
	    .attr('transform','translate(' + margin.left + ',' + margin.top + ')')
        
	var xAxis = d3.svg.axis()
	  .scale(xScale)
	  .tickFormat(formatDecimal)
	  .ticks(5)
	  .orient('bottom');
      
	var yAxis = d3.svg.axis()
	  .scale(yScale)
	  .tickFormat(formatDecimal)
	  .ticks(5)
	  .orient('left');
    
    // radial line variables
    
    var svg_radial = d3.select("#radial_line_1")
        .append("svg")
	    .attr('height',h + margin.top + margin.bottom)
	    .attr('width',w + margin.left + margin.right)
	    .append('g')
	    .attr('transform','translate(' + margin.left + ',' + margin.top + ')');
    var innerRadius = 100 / 2;
    var outerRadius = 500 / 2;
    var fullCircle = 2 * Math.PI;
    
    var fakedata = [
      [
        {axis:'category1',value:.43},
        {axis:'category2',value:.21},
        {axis:'category3',value:.57},
        {axis:'category4',value:.84},
        {axis:'category5',value:.13},
        {axis:'category6',value:.50},
        {axis:'category7',value:.60},
        {axis:'category8',value:.76},
        {axis:'category9',value:.34},
        {axis:'category10',value:.92},
        {axis:'category11',value:.34}
      ],
      [
        {axis:'category1',value:.10},
        {axis:'category2',value:.92},
        {axis:'category3',value:.41},
        {axis:'category4',value:.39},
        {axis:'category5',value:.86},
        {axis:'category6',value:.74},
        {axis:'category7',value:.41},
        {axis:'category8',value:.74},
        {axis:'category9',value:.15},
        {axis:'category10',value:.26},
        {axis:'category11',value:.47}
      ],
      [
        {axis:'category1',value:.12},
        {axis:'category2',value:.56},
        {axis:'category3',value:.72},
        {axis:'category4',value:.30},
        {axis:'category5',value:.61},
        {axis:'category6',value:.63},
        {axis:'category7',value:.45},
        {axis:'category8',value:.19},
        {axis:'category9',value:.37},
        {axis:'category10',value:.50},
        {axis:'category11',value:.21}
      ]
    ]
    //Options for the Radar chart, other than default
    var mycfg = {
      w: w,
      h: h,
      maxValue: 1.2,
      levels: 6,
      ExtraWidthX: 300
    }
    
    RadarChart.draw("#radial_line_1", fakedata, mycfg);
    
    // Scatter plot
    var circles = svg_scatter
      .selectAll('circle')
      .data(data_xy)
      .enter()
      .append('circle')
      .attr('class', 'scatter_point')
      .attr('cx', function (d) { return xScale(+d.value_x) })
      .attr('cy', function (d) { return yScale(+d.value_y) })
      .attr('r','5')
      .attr('stroke','black')
      .attr('stroke-width',1)
      .attr('fill', function (d,i) { return colorScale(i) })
      .on('mouseover', function (d, i) {
        if (is_scatter_point_clicked[i] == false) {
          d3.select(this)
            .transition()
            .duration(200)
            .attr('r',10)
            .attr('stroke-width',3)
        }
      })
      .on('mouseout', function (d, i) {
        if (is_scatter_point_clicked[i] == false) {
          d3.select(this)
            .transition()
            .duration(200)
            .attr('r',5)
            .attr('stroke-width',1)
        }
      })
      .on('click', function (d, i) {
        if (is_scatter_point_clicked[i] == false) {
          
          d3.selectAll('.scatter_point')
          .attr('r',5)
          .attr('stroke-width',1);
          
          d3.select(this)
            .attr('r',15)
            .attr('stroke-width',3)
        }
        if (is_scatter_point_clicked[i] == true) {
          d3.select(this)
            .attr('r',10)
            .attr('stroke-width',3)
        }
        is_scatter_point_clicked[i] = !is_scatter_point_clicked[i];
      })
    .append('title') // tooltip
    .text(function (d) { return d.Movie +
        '\n' + selectedOption_x + ': ' + formatDecimal(d.Happy) +
        '\n' + selectedOption_y + ': ' + formatDecimal(d.Happy) })
  
  // Plot title
  svg_scatter.append('text')
      .attr('x', (w / 2))             
      .attr('y', 0 - (margin.top / 2))
      .attr('text-anchor', 'middle')  
      .style('font-size', '20px') 
      .style('text-decoration', 'underline')  
      .text('Movies');
  // Plot x-axis
  svg_scatter.append('g')
      .attr('class','axis')
      .attr('transform', 'translate(0,' + h + ')')
      .call(xAxis)
      .append('text') // X-axis Label
      .attr('class','label')
      .attr('y',-10)
      .attr('x',w)
      .attr('dy','.25em')
      .style('text-anchor','end')
      .attr('class', 'x_axis_label')
      .text(selectedOption_x)
  // Plot y-axis
  svg_scatter.append('g')
      .attr('class', 'axis')
      .call(yAxis)
      .append('text') // y-axis Label
      .attr('class','label')
      .attr('transform','rotate(-90)')
      .attr('x',0)
      .attr('y',5)
      .attr('dy','.60em')
      .style('text-anchor','end')
      .text(selectedOption_y)
      .attr('class', 'y_axis_label')
  
    svg_scatter
      .selectAll(".axis")
      .selectAll("text")
      .filter(function(d, i) { return i <= 5; })
      .style("font-size","14px");
    svg_scatter
      .selectAll(".axis")
      .selectAll("text")
      .filter(function(d, i) { return i == 6; })
      .style("font-size","16px");
    
    // End scatter plot
    
    // Radial line plot
    
    
    
    //End radial line plot
    
  // A function that updates the scatter plot
  
  function update(selectedGroup_x, selectedGroup_y) {

      // Create new data with the selection
      data_xy = data.map(function(d) {return {value_movie: d['Movie'], value_x:d[selectedGroup_x], value_y:d[selectedGroup_y]} })
      //Update circle locations
      svg_scatter
        .selectAll('circle')
        .data(data_xy)
        .transition()
        .duration(1000)
        .attr("cx", function(d) { return xScale(+d.value_x) })
        .attr("cy", function(d) { return yScale(+d.value_y) })
      svg_scatter
        .selectAll('title') // Tooltip
        .data(data_xy)
        .text(function (d) { return d.value_movie +
            '\n' + selectedOption_x + ': ' + formatDecimal(+d.value_x) +
            '\n' + selectedOption_y + ': ' + formatDecimal(+d.value_y) });
      
      svg_scatter.
        selectAll('.x_axis_label')
        .text(selectedOption_x);
      svg_scatter.
        selectAll('.y_axis_label')
        .text(selectedOption_y);
    }
    
    // When the button is changed, run the updateChart function
    d3.select("#selectButton_x").on("change", function(d) {
        // recover the option that has been chosen
        selectedOption_x = d3.select(this).property("value")
        // run the updateChart function with this selected option
        update(selectedOption_x, selectedOption_y)
        // console.log(selectedOption_x);
        // console.log(selectedOption_y);
    })
    d3.select("#selectButton_y").on("change", function(d) {
        // recover the option that has been chosen
        selectedOption_y = d3.select(this).property("value")
        // run the updateChart function with this selected option
        update(selectedOption_x, selectedOption_y)
        // console.log(selectedOption_x);
        // console.log(selectedOption_y);
    })
})

function drawRadialLine() {

}