// Create Compare Tables and Charts
var allData = {};
var tableData = {};
var selectionData = {};
var MAX_TABLE_COLUMNS = 4;
function compareDataLoaded(data) {
	console.log(data);
	allData = data;

		
	// Get unique brand names
	tableData.brands = getUniqueBrands();
	// Get unique KPI names
	tableData.brands.forEach( function(el, i, arr) {
		arr[i].kpis = getUniqueKPIs();	// Even the missing ones
	});
	console.log( tableData );
	// Get data for each kpi
	getBrandKPIData();
	// Add time data
	tableData.time = allData.time;
	// Store Variable Types (in same order as above) separately for easy display as table labels in first columns
	tableData.varTypes = getUniqueKPIs();
	
	selectionData = tableData;
	console.log(tableData);
	
	// Initial Load
	updateSelectionTable();
	
}

// Create the actual chart
function drawSparkLineChart(data) {

	$( '#'+ data.VarNameId ).highcharts({
        chart: {
			type: 'SparkLine',
            zoomType: 'x',
			backgroundColor: null,
			borderWidth: 0,
			type: 'area',
			margin: [2, 0, 2, 0],
			width: 120,
			height: 20,
			style: {
				overflow: 'visible'
			},
			skipClone: true
        },
        title: {
            text: '', //data.VarName + " vs. " + allData.time.VarName,
			align: 'left',
			x: 50
        },
        xAxis: [{
            categories: allData.time.data,
			labels: {
				enabled: false
			},
			title: {
				text: null
			},
			startOnTick: false,
			endOnTick: false,
			tickPositions: []

        }],
        yAxis: { // Primary yAxis
				endOnTick: false,
				startOnTick: false,
				labels: {
					enabled: false
				},
				title: {
					text: null
				},
				tickPositions: [0],
				//title: {
					//text: data.VarName,
				//}
        },
         tooltip: {
                backgroundColor: null,
                borderWidth: 0,
                shadow: false,
                useHTML: true,
                hideDelay: 0,
                shared: true,
                padding: 0,
                positioner: function (w, h, point) {
                    return { x: point.plotX - w / 2, y: point.plotY - h};
                }
		},
        legend: {
                enabled: false
		},
		plotOptions: {
			series: {
				animation: false,
				lineWidth: 1,
				shadow: false,
				states: {
					hover: {
						lineWidth: 1
					}
				},
				marker: {
					radius: 1,
					states: {
						hover: {
							radius: 2
						}
					}
				},
				fillOpacity: 0.25
			},
			column: {
				negativeColor: '#910000',
				borderColor: 'silver'
			}
		},
        series: [{
            name: data.VarName,
            type: 'line',
            data: data.data,
			color: data.color,
			zIndex: 1
        }],
		credits: false
    });
}

// Get all unique brands in the KPI data 
function getUniqueBrands() {
	var brands = [];
	allData.KPI.forEach( function(el) {
		brands.push(el.Brand);
	});
	// Remove duplicates
	brands = brands.filter(function (v, i, a) { return a.indexOf(v) == i });
	var brandsObj = [];
	brands.forEach( function(el) {
		brandsObj.push({brand: el});
	});	
	return brandsObj;
}

// Get all unique KPI across all brands 
function getUniqueKPIs() {
	var kpis = [];
	allData.KPI.forEach( function(el) {
		kpis.push(el.Variable_Type);
	});
	// Remove duplicates
	kpis = kpis.filter(function (v, i, a) { return a.indexOf(v) == i });
	var kpisObj = [];
	kpis.forEach( function(el) {
		kpisObj.push({kpi: el});
	});	
	return kpisObj;
}

// Function get all KPI grouped by Brands
function getBrandKPIData() {
	var brands = [];
	tableData.brands.forEach( function(elem, ind, arr) {
		elem.kpis.forEach( function(el, i, a) {
			arr[ind].kpis[i].info = allData.KPI.filter( function(e) { return (e.Brand == elem.brand && e.Variable_Type == el.kpi); } );
			arr[ind].kpis[i].info.forEach( function(tmp, index, tmpArray) {
				tmpArray[index].VarNameId = tmp.VarName.replace( /[^\w\d]/g, "_");
			});
		});
	});
}

// UI remove a brand from table
function selectionRemoveBrand( varName ) {
	/*
	selectionData.brands = selectionData.brands.filter( function(el) {
		return el.brand != varName;
	});
	*/
	// In place deletion
	selectionData.brands = selectionData.brands.map( function(el) {
		return el.brand == varName ? { brand: false } : el;
	});	
	updateSelectionTable();
}

// UI add a brand to the table
function selectionAddBrand() {
	console.log("ADD");
}
// Update Selection Table
function updateSelectionTable() {

	$('#selectionTableContainer').empty();
	
	if( selectionData.brands.length < MAX_TABLE_COLUMNS ) {
		selectionData.brands.push({ brand: false });
	}
	
	
	// compile the template
	var buildingTemplate = dust.compile($("#selectionTableTemplate").html(), "tableTemplate");
	// load the compiled template into the dust template cache
	dust.loadSource(buildingTemplate);
	// create a function that takes the data object
	// in this case it's a 'building' object
	var template = function(building) {	
		var result;	
		dust.render("tableTemplate", building, function(err, res) {
			result = res;
		});	
		return result;
	};

	// append the template to it's host container
	//$("#someID").html(template(building));
	$("#selectionTableContainer").html(template(selectionData));
		
	// Create individual charts
	selectionData.brands.forEach( function(brand) {
		if(brand.kpis) {
			brand.kpis.forEach( function(kpi) {
				kpi.info.forEach( function(data) {
					drawSparkLineChart(data);
				});
			});
		}
	});
}

/////////////////// INIT
$( document ).ready(function() {

	console.log("edaId " + edaId);
	console.log("projectId " + projectId);

	$.get( "viz/Compare/Compare.php", { edaId: edaId, projectId: projectId }, compareDataLoaded, "json" ).fail( function(err) {
		console.log("Compare KPI Charts ERROR!");
		console.log(err);
	});

});