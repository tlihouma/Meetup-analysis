queue()
    .defer(d3.json, "/data")
    .await(makeGraphs);

function makeGraphs(error, recordsJson) {
	
	var records = recordsJson;
	var dateFormat = d3.time.format("%Y").parse;

	console.log(records);
	
	_.each(records, function(d) {
		d["year"] = dateFormat(String(d["year"]));
		d["Longitude"] = +d["Longitude"];
		d["Latitude"] = +d["Latitude"];
	});

	

	//Create a Crossfilter instance
	var ndx = crossfilter(records);
   

   //Define Dimensions

	var cityDim = ndx.dimension(function(d) { return d["city"]; });
	var yearDim=ndx.dimension(function (d) { return d["year"];});
	var membersDim = ndx.dimension(function(d) { return d["members"]; });
	var nameGrpDim = ndx.dimension(function(d) { return d["name"]; });
	var locationdDim = ndx.dimension(function(d) { return d["location"]; });
	var allDim = ndx.dimension(function(d) {return d;});


	//Group Data
	
		
	var cityGroup=cityDim.group().reduceCount(function(d) {return d.name;});
	var nameGroup = nameGrpDim.group().reduceSum(function(d) {return d.members/2});
	var citybymembersGroup=cityDim.group().reduceSum(function(d) {return d.members;});
	var meetups = yearDim.group().reduceCount(function(d) {return d.name;}); 
	var all = ndx.groupAll();

	
    //Charts
    
	
	var createdlineChart=dc.lineChart("#chart-line-createdperyear");
	var cityChart = dc.rowChart("#city-row-chart");
	var nameChart = dc.rowChart("#name-row-chart");
	var citybymembersChart=dc.rowChart("#citybymembers-row-chart");

	
	  


	cityChart
       .height(450)
       .width(380)
       .dimension(cityDim)
       .group(cityGroup)
       .rowsCap(20)
       .ordering(function(d) { return -d.value })

	createdlineChart
        .height(450)
        .width(680)
        .transitionDuration(200)
        .renderLabel(true)
        .dimension(yearDim)
        .group(meetups)
        .margins({top: 10, right: 10, bottom: 20, left: 40})
        .elasticY(true)
        .x(d3.time.scale().domain(d3.extent(records, function(d) { return d.year; })))
        .xAxis()
        
	nameChart
       .height(450)
       .width(480)
       .dimension(nameGrpDim)
       .group(nameGroup)
       .rowsCap(10)
       .ordering(function(d) { return -d.value })
    
    citybymembersChart
       .height(950)
       .width(680)
       .dimension(cityDim)
       .group(citybymembersGroup)
       .rowsCap(30)
       .ordering(function(d) { return -d.value })
        ;

	
	//Draw Map

	var map = L.map('map');

	var drawMap = function(){

	    map.setView([47, 2], 5);
		mapLink = '<a href="http://openstreetmap.org">OpenStreetMap</a>';
		L.tileLayer(
			'http://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
				attribution: '&copy; ' + mapLink + ' Contributors',
				maxZoom: 15,
			}).addTo(map);

		//HeatMap
		var geoData = [];
		_.each(allDim.top(Infinity), function (d) {
			geoData.push([d["Latitude"], d["Longitude"], 1]);
	      });
		var heat = L.heatLayer(geoData,{
			radius: 10,
			blur: 20, 
			maxZoom: 1,
		}).addTo(map);

	};

	
	drawMap();

	//Update the heatmap if any dc chart get filtered
	dcCharts = [cityChart,createdlineChart,nameChart,citybymembersChart];

	_.each(dcCharts, function (dcChart) {
		dcChart.on("filtered", function (chart, filter) {
			map.eachLayer(function (layer) {
				map.removeLayer(layer)
			}); 
			drawMap();
		});
	});

	dc.renderAll();

};