//==================================================================================================================
// Radar function
//==================================================================================================================
function RadarChart(id, data, options) {
  var cfg = {
    w: 700,  //radar circle width
    h: 700, //radar circle height
    margin: { top: 20, right: 20, bottom: 20, left: 20 }, //margins of SVG
    levels: 3,  //levels or inner circles
    maxValue: 0,  //value that the biggest circle will represent
    dotRadius: 2, 			//The size of the colored circles of each blob
    strokeWidth: 1, 		//The width of the stroke around each blob
    roundStrokes: true,	//If true the area and stroke will follow a round path (cardinal-closed)
    color: d3.scaleOrdinal(d3.schemeCategory10)	//Color function
  };

  //Put all of the options into a variable called cfg
  if ('undefined' !== typeof options) {
    for (var i in options) {
      if ('undefined' !== typeof options[i]) { cfg[i] = options[i]; }
    }//for i
  }//if

  //If the supplied maxValue is smaller than the actual one, replace by the max in the data
  var maxValue = Math.max(cfg.maxValue + 1, d3.max(data, function (i) { return d3.max(i.map(function (o) { return o.value; })) }));

  var allAxis = (data[0].map(function (i, j) { return i.axis })),	//Names of each axis
    total = allAxis.length,					//The number of different axes
    radius = Math.min(cfg.w / 2, cfg.h / 2), 	//Radius of the outermost circle
    angleSlice = Math.PI * 2 / total;		//The width in radians of each 'slice'

  //Scale for the radius
  var rScale = d3.scaleLinear()
    .range([0, radius])
    .domain([0, maxValue]);

  //////////// Create the container SVG and g /////////////
  //Remove whatever chart with the same id/class was present before
  d3.select(id).select('svg').remove();
  //Initiate the radar chart SVG
  var svg = d3.select(id).append('svg')
    // .attr('width', cfg.w + cfg.margin.left + cfg.margin.right)
    // .attr('height', cfg.h + cfg.margin.top + cfg.margin.bottom)
    .attr("width", '100%')
    .attr("height", '100%')
    .attr('viewBox', '0 0 ' + Math.min(cfg.w + cfg.margin.left + cfg.margin.right, cfg.h + cfg.margin.top + cfg.margin.bottom) + ' ' + Math.min(cfg.w + cfg.margin.left + cfg.margin.right, cfg.h + cfg.margin.top + cfg.margin.bottom))
    .attr('preserveAspectRatio', 'xMinYMin')
    .attr('class', 'radar' + id);
  //Append a g element
  var g = svg.append('g')
    .attr('transform', 'translate(' + (cfg.w / 2 + cfg.margin.left) + ',' + (cfg.h / 2 + cfg.margin.top) + ')');

  /////////////// Draw the Circular grid //////////////////
  //Wrapper for the grid & axes
  var axisGrid = g.append('g').attr('class', 'axisWrapper');
  //Draw the background circles
  axisGrid.selectAll('.levels')
    .data(d3.range(1, (cfg.levels + 1)).reverse())
    .enter()
    .append('circle')
    .attr('class', 'gridCircle')
    .attr('r', function (d, i) { return radius / cfg.levels * d; })
    .style('fill', '#ffffff')
    .style('stroke', '#CDD4D7');

  //////////////////// Draw the axes //////////////////////
  //Create the straight lines radiating outward from the center
  var axis = axisGrid.selectAll('.radarAxis')
    .data(allAxis)
    .enter()
    .append('g')
    .attr('class', function (d, i) { return 'radarAxis radarAxis' + i; });
  //Append the lines
  axis.append('line')
    .attr('x1', 0)
    .attr('y1', 0)
    .attr('x2', function (d, i) { return rScale(maxValue) * Math.cos(angleSlice * i - Math.PI / 2); })
    .attr('y2', function (d, i) { return rScale(maxValue) * Math.sin(angleSlice * i - Math.PI / 2); })
    .attr('class', 'line')
  // circles on end of lines
  axis.append('circle')
    .attr('class', 'axisCircle')
    .attr('r', 4)
    .attr('cx', function (d, i) { return rScale(maxValue) * Math.cos(angleSlice * i - Math.PI / 2); })
    .attr('cy', function (d, i) { return rScale(maxValue) * Math.sin(angleSlice * i - Math.PI / 2); })
  // empty circle in center
  axis.append('circle')
    .attr('class', 'centerCircle')
    .attr('r', 10)
    .style('fill', '#ffffff')
    .style('stroke', '#CDD4D7');

  ///////////// Draw the radar chart blobs ////////////////
  //The radial line function
  var radarLine = d3.lineRadial()
    .curve(d3.curveLinearClosed)
    .radius(function (d) { return rScale(d.value); })
    .angle(function (d, i) { return i * angleSlice; });
  if (cfg.roundStrokes) {
    radarLine.curve(d3.curveCardinalClosed);
  }
  //Create a wrapper for the blobs
  var blobWrapper = g.selectAll('.radarWrapper')
    .data(data)
    .enter().append('g')
    .attr('class', function (d, i) { return 'radarWrapper radarWrapper' + i; })
    .attr('fill', function (d, i) { return cfg.color(i); });
  //Append the backgrounds
  blobWrapper
    .append('path')
    .attr('class', 'radarArea')
    .attr('d', function (d, i) { return radarLine(d); })
    .style('fill', function (d, i) { return cfg.color(i); })
    .style('fill-opacity', 0.1);
  //Create the outlines
  blobWrapper.append('path')
    .attr('class', 'radarStroke')
    .attr('d', function (d, i) { return radarLine(d); })
    .style('stroke-width', cfg.strokeWidth + 'px')
    .style('stroke', function (d, i) { return cfg.color(i); })
    .style('fill', 'none');
  //Append the circles
  blobWrapper.selectAll('.radarCircle')
    .data(function (d, i) { return d; })
    .enter().append('circle')
    .attr('class', 'radarCircle')
    .attr('r', cfg.dotRadius)
    .attr('cx', function (d, i) { return rScale(d.value) * Math.cos(angleSlice * i - Math.PI / 2); })
    .attr('cy', function (d, i) { return rScale(d.value) * Math.sin(angleSlice * i - Math.PI / 2); })
    .style('fill', function () { var j = this.parentNode.getAttribute("fill"); return j; })
    .style('fill-opacity', 1)
    .style('stroke', function () { var j = this.parentNode.getAttribute("fill"); return j; });

  //////// Append tooltips ///////////
  //Wrapper for the tooltips
  var tooltipWrap = g.selectAll('.radarTooltipWrap')
    .data(data)
    .enter().append('g')
    .attr('class', function (d, i) { return 'radarTooltipWrap radarTooltipWrap' + i; })
    .style('opacity', 0)
    .style('color', function (d, i) { return cfg.color(i); });
  //Append boxes for tooltips
  tooltipWrap.selectAll('.radarTooltip')
    .data(function (d, i) { return d; })
    .enter()
    .append('rect')
    .attr('x', function (d, i) { return (rScale(d.value) * Math.cos(angleSlice * i - Math.PI / 2) - 7); })
    .attr('y', function (d, i) { return (rScale(d.value) * Math.sin(angleSlice * i - Math.PI / 2) - 10); })
    .attr('rx', '10px')
    .attr('ry', '10px')
    .style('stroke', 'currentColor')
    .style('width', '40px')
    .style('height', '20px')
    .style('fill', '#ffffff');
  //Append tooltips text
  tooltipWrap.selectAll('.radarTooltipText')
    .data(function (d, i) { return d; })
    .enter()
    .append('text')
    .text(function (d, i) { return d.value; })
    .attr('class', 'radarTooltipText')
    .attr('x', function (d, i) { return (rScale(d.value) * Math.cos(angleSlice * i - Math.PI / 2) + 22); })
    .attr('y', function (d, i) { return (rScale(d.value) * Math.sin(angleSlice * i - Math.PI / 2) + 4); })
    .style('text-anchor', 'end')
    .style('fill', 'currentColor')
    .style('font-size', '12px');
  //Append color dots for tooltips
  tooltipWrap.selectAll('.radarTooltipPin')
    .data(function (d, i) { return d; })
    .enter()
    .append('circle')
    .attr('cx', function (d, i) { return rScale(d.value) * Math.cos(angleSlice * i - Math.PI / 2); })
    .attr('cy', function (d, i) { return rScale(d.value) * Math.sin(angleSlice * i - Math.PI / 2); })
    .attr('r', 2)
    .style('fill', 'currentColor');
} // End Radar Function

// RADAR CHART SETTINGS
var radarMargin = { top: 20, right: 20, bottom: 20, left: 20 },
  radarWidth = +d3.select('.radar__chart').style('width').slice(0, -2) - radarMargin.left - radarMargin.right,
  radarHeight = +d3.select('.radar__chart').style('height').slice(0, -2) - radarMargin.top - radarMargin.bottom,
  radarColor = d3.scaleOrdinal()
    .range(['#2096F3', '#FF5D94', '#26A59A', '#FF5721', '#D44EED', '#795548', '#3F51B5']);

var radarChartOptions = {
  w: radarWidth,
  h: radarHeight,
  margin: radarMargin,
  maxValue: 5,
  levels: 6,
  roundStrokes: true,
  color: radarColor
};

// Radar axes data
var radarData = [
  [// Type 1
    { axis: 'Параметр 1', value: 2.2 },
    { axis: 'Параметр 2', value: 2.8 },
    { axis: 'Параметр 3', value: 2.9 },
    { axis: 'Параметр 4', value: 1.7 },
    { axis: 'Параметр 5', value: 2.2 },
    { axis: 'Параметр 6', value: 4.2 },
    { axis: 'Параметр 7', value: 3 },
    { axis: 'Параметр 8', value: 5 },
    { axis: 'Параметр 9', value: 2 }
  ],
  [// Type 2
    { axis: 'Параметр 1', value: 2.7 },
    { axis: 'Параметр 2', value: 1.6 },
    { axis: 'Параметр 3', value: 3.5 },
    { axis: 'Параметр 4', value: 1.3 },
    { axis: 'Параметр 5', value: 2.0 },
    { axis: 'Параметр 6', value: 1.3 },
    { axis: 'Параметр 7', value: 3.5 },
    { axis: 'Параметр 8', value: 3.5 },
    { axis: 'Параметр 9', value: 3.8 }
  ],
  [// Type 3
    { axis: 'Параметр 1', value: 2.6 },
    { axis: 'Параметр 2', value: 1.0 },
    { axis: 'Параметр 3', value: 3.0 },
    { axis: 'Параметр 4', value: 1.4 },
    { axis: 'Параметр 5', value: 2.2 },
    { axis: 'Параметр 6', value: 0.4 },
    { axis: 'Параметр 7', value: 4.1 },
    { axis: 'Параметр 8', value: 3.0 },
    { axis: 'Параметр 9', value: 3.5 }
  ],
  [// Type 4
    { axis: 'Параметр 1', value: 3 },
    { axis: 'Параметр 2', value: 4 },
    { axis: 'Параметр 3', value: 5 },
    { axis: 'Параметр 4', value: 1 },
    { axis: 'Параметр 5', value: 2 },
    { axis: 'Параметр 6', value: 3 },
    { axis: 'Параметр 7', value: 4 },
    { axis: 'Параметр 8', value: 0 },
    { axis: 'Параметр 9', value: 5 }
  ]
];

//Call function to draw the Radar chart
RadarChart('.radar__chart', radarData, radarChartOptions);

// Create Radar legend
var radarLegendList = ['Тип 1', 'Тип 2', 'Тип 3', 'Тип 4'],
  radarLegendSet = '';
for (var i = 0; i < radarLegendList.length; i++) {
  radarLegendSet += '<li class="radarLegendItem"><span></span>' + radarLegendList[i] + '</li>';
}
document.querySelector('.radar__legend').insertAdjacentHTML('afterBegin', '<ul>' + radarLegendSet + '</ul>');

// Add event handler to Radar legend items
d3.selectAll('.radarLegendItem').on('click', function (d, i) {
  d3.selectAll('.radarWrapper')
    .style('opacity', 0);
  d3.select('.radarWrapper' + i)
    .style('opacity', 1);
  d3.selectAll('.radarTooltipWrap')
    .style('opacity', 0);
  d3.select('.radarTooltipWrap' + i)
    .style('opacity', 1);
  d3.selectAll('.radar__legend .radarLegendItem')
    .style('opacity', .5)
    .style('border-color', 'rgba(0,0,0,0)');
  d3.select(this)
    .style('opacity', 1)
    .style('border-color', 'rgba(0,0,0,0.1)');
});

// Add event handler to Radar legend button
d3.select('.radar__btn').on('click', function (d, i) {
  d3.selectAll('.radarWrapper')
    .style('opacity', 1);
  d3.selectAll('.radarTooltipWrap').style('opacity', 0);
  d3.selectAll('.radar__legend .radarLegendItem')
    .style('opacity', 1)
    .style('border-color', 'rgba(0,0,0,0)');
});

// Create Radar labels and placing it on chart
var circles = document.querySelectorAll('.axisCircle');
for (var m = 0; m < circles.length; m++) {
  var x = Math.round(circles[m].getAttribute('cx')),
    y = Math.round(circles[m].getAttribute('cy')),
    label = '<div class="radarLabel radarLabel' + m + '">' + radarData[0][m].axis + '</div>',
    radarChart = document.querySelector('.radar__chart'),
    radarWidth = radarChart.clientWidth / 2,
    radarHeight = radarChart.clientHeight / 2;

  radarChart.insertAdjacentHTML('beforeend', label);

  var currentLabel = document.querySelector('.radarLabel' + m),
    labelWidth = currentLabel.clientWidth;

  if (x < 0) {
    currentLabel.style.left = (radarWidth + x - labelWidth - 40) + 'px';
  } else if (x > 0) {
    currentLabel.style.left = (radarWidth + x + 20) + 'px';
  }
  if (y < 0) {
    currentLabel.style.top = (radarHeight + y - 20) + 'px';
  } else if (y >= 0) {
    currentLabel.style.top = (radarHeight + y + 10) + 'px';
  }
  if (x === 0) {
    currentLabel.style.left = (radarWidth + x - (labelWidth / 2)) + 'px';
    currentLabel.style.top = (radarHeight + y - 50) + 'px';
  }
}

// Add event handler to Radar labels
d3.selectAll('.radarLabel').on('click', function (d, i) {
  d3.select(this)
    .classed('highlighted', d3.select(this).classed('highlighted') ? false : true);
  d3.select('.radarAxis' + i)
    .classed('highlighted', d3.select('.radarAxis' + i).classed('highlighted') ? false : true);
  d3.selectAll('.radarWrapper circle:nth-of-type(' + (i + 1) + ')')
    .classed('highlighted', d3.selectAll('.radarWrapper circle:nth-of-type(' + (i + 1) + ')').classed('highlighted') ? false : true);
});

// Add competence classes to Radar labels and Radar axes
var paramClassList = ['param1', 'param2', 'param3', 'param2',' param1', 'param4' , 'param4', 'param1', 'param3'];
var labelsCount = document.querySelectorAll('.radarLabel').length;
for (let i = 0; i < labelsCount; i++ ) {
  let currentLabel = document.querySelector('.radarLabel' + i);
  let currentAxis = document.querySelector('.radarAxis' + i);
  addClass(currentLabel, paramClassList[i]);
  addClass(currentAxis, paramClassList[i]);
}

function addClass(el, newClass) {
  el.setAttribute('class', el.getAttribute('class') + ' ' + newClass);
}