dojo.require("esri.map");
dojo.require("esri.tasks.route");
dojo.require("esri.tasks.locator");


      var map 
	  var routeTask, routeParams;
	  var routeTask2, routeParams2;
	  var routeTask3, routeParams3;
	  var routeTask4, routeParams4;
	  var ptStart, ptStop;
      var stopSymbol, routeSymbol, routeSymbol2, routeSymbol3, routeSymbol4;
	  var graphic;
	  var routeActive1, routeActive2, routeActive3, routeActive4;
	  var routeGraph1, routeGraph2, routeGraph3, routeGraph4, locator;
	  routeActive1 = true;
	  routeActive2 = true;
	  routeActive3 = true;
	  routeActive3 = false;
	  var impedence = "Minutes";
	  var url_locator = "http://sdi.unige.ch/ArcGIS/rest/services/ADRESSE_locV1a/GeocodeServer";
	  var url_route = "http://sdi.unige.ch/ArcGIS/rest/services/itivelo/NAServer/Route";
	  //var url_route = "http://sdi.unige.ch/ArcGIS/rest/services/villecyclette_reel/NAServer/Route";
	  //init
	  var htmlSummary_meter, htmlSummary_time, htmlSummary_secure, htmlSummary_effort;
	  var htmlContent_meter, htmlContent_time, htmlContent_secure, htmlContent_effort; 
	  
	  dojo.addOnLoad(init);


      function init() {
		 toggle("menu");
		  //toggle("block_direction");
		  //toggleV('map');
		  waitingLogoToggle();
        map = new esri.Map("map", {
		  extent: new esri.geometry.Extent({"xmin":492000,"ymin":116000,"xmax":506000,"ymax":120000,"spatialReference":{"wkid":21781}})
        });

        // map.addLayer(new esri.layers.ArcGISTiledMapServiceLayer("http://ge.ch/ags2/rest/services/SITG_CONCOURS/Plan_Velo/MapServer"));
           map.addLayer(new esri.layers.ArcGISTiledMapServiceLayer("http://sdi.unige.ch/ArcGIS/rest/services/geneve/plan_velo_2011_mn03/MapServer"));
	   //map.addLayer(new esri.layers.ArcGISTiledMapServiceLayer("http://ge.ch/ags2/rest/services/Plan_Velo/MapServer"));
		/*
		var imageParameters = new esri.layers.ImageParameters();

        imageParameters.layerIds = [12,13,16,17,19,37];
        imageParameters.layerOption = esri.layers.ImageParameters.LAYER_OPTION_SHOW;
        imageParameters.transparent = true;
		


		var detailmap = new esri.layers.ArcGISDynamicMapServiceLayer("http://etat.geneve.ch/ags1/rest/services/SITG_CONCOURS/Mobilite_espace_routier/MapServer", {"imageParameters":imageParameters});
		map.addLayer(detailmap)
		
		*/
		
		//init locator module
		locator = new esri.tasks.Locator(url_locator);
      	dojo.connect(locator, "onAddressToLocationsComplete", showResults);

		//init route task
		routeTask = new esri.tasks.RouteTask(url_route);
		routeTask2 = new esri.tasks.RouteTask(url_route);
		routeTask3 = new esri.tasks.RouteTask(url_route);
		routeTask4 = new esri.tasks.RouteTask(url_route);
		routeParams = new esri.tasks.RouteParameters();
        routeParams.stops = new esri.tasks.FeatureSet();
        routeParams.outSpatialReference = {"wkid":21781};		
		routeParams.returnDirections = true;
        routeParams.directionsLengthUnits = esri.Units.METERS
		routeParams.impedanceAttribute = "Minutes";
		
		routeParams2 = new esri.tasks.RouteParameters();
        routeParams2.stops = new esri.tasks.FeatureSet();
        routeParams2.outSpatialReference = {"wkid":21781};		
		routeParams2.returnDirections = true;
        routeParams2.directionsLengthUnits = esri.Units.METERS
		routeParams2.impedanceAttribute = "Meters";
		
		routeParams3 = new esri.tasks.RouteParameters();
        routeParams3.stops = new esri.tasks.FeatureSet();
        routeParams3.outSpatialReference = {"wkid":21781};		
		routeParams3.returnDirections = true;
        routeParams3.directionsLengthUnits = esri.Units.METERS
		routeParams3.impedanceAttribute = "Securite";
		
		routeParams4 = new esri.tasks.RouteParameters();
        routeParams4.stops = new esri.tasks.FeatureSet();
        routeParams4.outSpatialReference = {"wkid":21781};		
		routeParams4.returnDirections = true;
        routeParams4.directionsLengthUnits = esri.Units.METERS
		routeParams4.impedanceAttribute = "Effort";
		
		
		dojo.connect(routeTask, "onSolveComplete", showRoute);
        dojo.connect(routeTask, "onError", errorHandler);
		dojo.connect(routeTask2, "onSolveComplete", showRoute2);
        dojo.connect(routeTask2, "onError", errorHandler);
		dojo.connect(routeTask3, "onSolveComplete", showRoute3);
        dojo.connect(routeTask3, "onError", errorHandler);
		dojo.connect(routeTask4, "onSolveComplete", showRoute4);
        dojo.connect(routeTask4, "onError", errorHandler);
		stopSymbol = new esri.symbol.SimpleMarkerSymbol().setStyle(esri.symbol.SimpleMarkerSymbol.STYLE_CROSS).setSize(15);
        stopSymbol.outline.setWidth(4);
        routeSymbol = new esri.symbol.SimpleLineSymbol().setColor(new dojo.Color([0,0,255,0.5])).setWidth(5);
		routeSymbol2 = new esri.symbol.SimpleLineSymbol().setColor(new dojo.Color([255,0,0,0.5])).setWidth(5);
		routeSymbol3 = new esri.symbol.SimpleLineSymbol().setColor(new dojo.Color([0,255,0,0.5])).setWidth(5);
		routeSymbol4 = new esri.symbol.SimpleLineSymbol().setColor(new dojo.Color([255,255,0,0.5])).setWidth(5);

      }
	  
	  function newSearch(){
		  window.location.reload();
		  
	  }
	  
	   function showResults(candidates) {
        var candidate;
		var result = "";
		var scoreMax = false;
        dojo.forEach(candidates,function(candidate, i){
			if (i < 30){
				if (candidate.score > 45) {
		  	//i++;
			if (candidate.score == 100){
				result = "<a class='refRoute' onClick='addStopPoint("+candidate.location.x+","+candidate.location.y+")'>" + candidate.address + " : " + candidate.score + "</a><br />";
				scoreMax = true; 
			} else {
				if (scoreMax === false){
					 result = result+ "<a  class='refRoute' onClick='addStopPoint("+candidate.location.x+","+candidate.location.y+")'>" + candidate.address + " : " + candidate.score + "</a><br />"; 		
				}
			
			}
			}
          }
		  
        });
		
		if (result === ""){
			dojo.byId("listRoute").innerHTML = "Aucun résultat trouvé"
		} else {
			dojo.byId("listRoute").innerHTML = result;	
		}
		
		waitingLogoToggle();
		//alert("blob");
		/*
		var pt = esri.geometry.Point(cand.location.x, cand.location.y);
		var stop = map.graphics.add(new esri.Graphic(pt, stopSymbol));
        routeParams.stops.features.push(stop);
		routeParams2.stops.features.push(stop);
		routeParams3.stops.features.push(stop);
		if(navigator.geolocation){  
          navigator.geolocation.getCurrentPosition(zoomToLocation, locationError);
          
        }
		*/
        //map.centerAndZoom(geom,12);
      }
	  
	  function addStopPoint(x,y){
		  waitingLogoToggle();
		var pt = esri.geometry.Point(x, y);
		ptStop = map.graphics.add(new esri.Graphic(pt, stopSymbol));
        
		toggle('menu');
		toggle('listRoute');
		toggle('main_form');
		toggle("block_direction");
		
		//set up routparam
		
		
		//routeParams.impedanceAttribute = impedence;
		//hide result
		if(navigator.geolocation){  
          navigator.geolocation.getCurrentPosition(zoomToLocation, locationError);
          
        } 
		
	  }
	  
	  function updateLocation (){
	  	map.graphics.remove(routeGraph3);
		map.graphics.remove(routeGraph1);
		map.graphics.remove(routeGraph2);
		map.graphics.remove(routeGraph4);
		
		map.graphics.remove(ptStart);
		
		routeParams.stops.features.splice(1, 0, ptStart);
		routeParams2.stops.features.splice(1, 0, ptStart);
		routeParams3.stops.features.splice(1, 0, ptStart);
		routeParams3.stops.features.splice(1, 0, ptStart);
		
		if(navigator.geolocation){  
          navigator.geolocation.getCurrentPosition(zoomToLocation, locationError);
          
        } 
		
	  }
	  
	  /**
	  Search location based on the input research
	  */
	  function locate() {
		  waitingLogoToggle();
        //map.graphics.clear();
        //var add = dojo.byId("address").value.split(",");
		var add = dojo.byId("adresse").value;
		//alert(add);
        var address = {
          KeyField : add
        };
		//alert("SEARCH");
        locator.addressToLocations(address,["Loc_name"]);
      }
	  
	  
	  
	  function zoomToLocation(location){
	  	
		
		
	  	var loc =  _LtLgtoCH03(location.coords.latitude, location.coords.longitude);
		//alert(loc[0]+ "/" + loc[1]);
		  var pt = esri.geometry.Point(loc[0],loc[1]);  
		ptStart = map.graphics.add(new esri.Graphic(pt, stopSymbol));
        routeParams.stops.features.push(ptStart);
		routeParams2.stops.features.push(ptStart);
		routeParams3.stops.features.push(ptStart);
		routeParams4.stops.features.push(ptStart);
		var symbol = new esri.symbol.PictureMarkerSymbol('bluedot.png', 40, 40);
         var bluedot = new esri.Graphic(pt, symbol);
         map.graphics.add(bluedot);
		 
		 
		 //add adress stop
		 routeParams.stops.features.push(ptStop);
		 routeParams2.stops.features.push(ptStop);
		 routeParams3.stops.features.push(ptStop);
		 routeParams4.stops.features.push(ptStop);
		 
		if (routeParams.stops.features.length >= 2) {
			
          routeTask.solve(routeParams);
		  routeTask2.solve(routeParams2);
		  routeTask3.solve(routeParams3);
		  routeTask4.solve(routeParams4);
          //lastStop = routeParams.stops.features.splice(0, 1)[0];
		  //lastStop2 = routeParams2.stops.features.splice(0, 1)[0];
		  //lastStop3 = routeParams3.stops.features.splice(0, 1)[0];
        }
		//map.centerAndZoom(pt, 16);
        //if (!graphic) {
          //var symbol = new esri.symbol.PictureMarkerSymbol('bluedot.png', 40, 40);
          //graphic = new esri.Graphic(pt, symbol);
          //map.graphics.add(graphic);
        //}
        //else { //move the graphic if it already exists
          //graphic.setGeometry(pt);
        //}
	  }
	
		//function startMap(){
				
		//}
      


	  
	  function locationError(error) {
		toggle('listRoute');
		toggle('main_form');
        switch (error.code) {
        case error.PERMISSION_DENIED:
          alert("Location not provided");
          break;

        case error.POSITION_UNAVAILABLE:
          alert("Current location not available");
          break;

        case error.TIMEOUT:
          alert("Timeout");
          break;

        default:
          alert("unknown error");
          break;
        }

      }
	  
	  function waitingLogoToggle(){
		  if (dojo.byId("wait_logo").style.display == 'none'){
			  dojo.byId("wait_logo").style.display = 'block';
		  } else {
			  dojo.byId("wait_logo").style.display = 'none';
		  }
		  //document.getElementById("wait_logo").style."
	  }
	  
	  function toggle(id){
		   if (dojo.byId(id).style.display == 'none'){
			  dojo.byId(id).style.display = 'block';
		  } else {
			  dojo.byId(id).style.display = 'none';
		  }
	  }
	  
	  function toggleV(id){
		  
		   if (dojo.byId(id).style.visibility == 'hidden'){
			  dojo.byId(id).style.display = 'visible';
		  } else {
			  dojo.byId(id).style.display = 'hidden';
		  }
	  }
	  

	  
	  
	  _LtLgtoCH03 = function(_lt,_lg){
		var phiPrim=(_lt*3600-169028.66)/10000;
		var lambdaPrim=(_lg*3600-26782.5)/10000;
		var _x=600072.37+(211455.93*lambdaPrim)-(10938.51*lambdaPrim*phiPrim)-(0.36*lambdaPrim*Math.pow(lambdaPrim,2))-(44.54*Math.pow(lambdaPrim,3));
		var _y=200147.07+(308807.95*phiPrim)+(3745.25*Math.pow(lambdaPrim,2))+(76.63*Math.pow(phiPrim,2))-(194.56*Math.pow(lambdaPrim,2)*phiPrim)+(119.79*Math.pow(phiPrim,3));
		return[_x,_y];};



      //Adds the solved route to the map as a graphic
      function showRoute(solveResult) {	  	
		
			
        routeGraph1 = solveResult.routeResults[0].route.setSymbol(routeSymbol);
		map.graphics.add(routeGraph1);

		directions = solveResult.routeResults[0].directions;
        directionFeatures = directions.features;
        //Add route to the map
        //map.graphics.add(new esri.Graphic(directions.mergedGeometry, routeSymbol));
		//Display the total time and distance of the route

        //dojo.byId("summary").innerHTML = "<br /> &nbsp; Total distance: " + formatDistance(directions.totalLength, "meters") + "<br /> &nbsp; Total time: " + formatTime(directions.totalTime);
		
		htmlSummary_time = "<br /> &nbsp; Distance total: " + formatDistance(directions.totalLength, "meters") + "<br /> &nbsp; Estimation temps (15 - 25 km/h): " + formatTime2(directions.totalTime);
		
		
		dojo.byId("table_time_time").innerHTML = formatTime2(directions.totalTime);
		dojo.byId("table_time_dist").innerHTML = formatDistance(directions.totalLength, "meters");
		
		
        //List the directions and create hyperlinks for each route segment
        var dirStrings = ["<ol>"];
        dojo.forEach(solveResult.routeResults[0].directions.features, function(feature, i) {
          dirStrings.push("<li onclick='zoomToSegment(" + i + "); return false;' class=\"segment\"><a href=\"#\">" + feature.attributes.text + " (" + formatDistance(feature.attributes.length ,"meters") + ", " + formatTime(feature.attributes.time) + ")</a></li>");
        });
        dirStrings.push("</ol>");
        //dojo.byId("directions").innerHTML = dirStrings.join("");

		htmlContent_time = dirStrings.join("");
        zoomToFullRoute();
		
		
      }
	  
	  function showRoute2(solveResult) {
        routeGraph2 = solveResult.routeResults[0].route.setSymbol(routeSymbol2)
		map.graphics.add(routeGraph2);
		
		directions = solveResult.routeResults[0].directions;
        directionFeatures = directions.features;
		htmlSummary_meter = "<br /> &nbsp; Distance total: " + formatDistance(directions.totalLength, "meters") + "<br /> &nbsp; Estimation temps (15 - 25 km/h): " + formatTime2(directions.totalTime);
		dojo.byId("table_meter_time").innerHTML = formatTime2(directions.totalTime);
		dojo.byId("table_meter_dist").innerHTML = formatDistance(directions.totalLength, "meters");
		
		var dirStrings = ["<ol>"];
        dojo.forEach(solveResult.routeResults[0].directions.features, function(feature, i) {
          dirStrings.push("<li onclick='zoomToSegment(" + i + "); return false;' class=\"segment\"><a href=\"#\">" + feature.attributes.text + " (" + formatDistance(feature.attributes.length ,"meters") + ", " + formatTime(feature.attributes.time) + ")</a></li>");
        });
        dirStrings.push("</ol>");
		htmlContent_meter = dirStrings.join("");
      }
	  
	  
	  function showRoute3(solveResult) {
        routeGraph3 = solveResult.routeResults[0].route.setSymbol(routeSymbol3);
		map.graphics.add(routeGraph3);
		
		directions = solveResult.routeResults[0].directions;
        directionFeatures = directions.features;
		htmlSummary_secure = "<br /> &nbsp; Distance total: " + formatDistance(directions.totalLength, "meters") + "<br /> &nbsp; Estimation temps (15 - 25 km/h): " + formatTime2(directions.totalTime);
		dojo.byId("table_secure_time").innerHTML = formatTime2(directions.totalTime);
		dojo.byId("table_secure_dist").innerHTML = formatDistance(directions.totalLength, "meters");
		var dirStrings = ["<ol>"];
        dojo.forEach(solveResult.routeResults[0].directions.features, function(feature, i) {
          dirStrings.push("<li onclick='zoomToSegment(" + i + "); return false;' class=\"segment\"><a href=\"#\">" + feature.attributes.text + " (" + formatDistance(feature.attributes.length ,"meters") + ", " + formatTime(feature.attributes.time) + ")</a></li>");
        });
        dirStrings.push("</ol>");
		htmlContent_secure = dirStrings.join("");
      }
	  
	  function showRoute4(solveResult) {
        routeGraph4 = solveResult.routeResults[0].route.setSymbol(routeSymbol4);
		map.graphics.add(routeGraph4);
		
		directions = solveResult.routeResults[0].directions;
        directionFeatures = directions.features;
		htmlSummary_effort = "<br /> &nbsp; Distance total: " + formatDistance(directions.totalLength, "meters") + "<br /> &nbsp; Estimation temps (15 - 25 km/h): " + formatTime2(directions.totalTime);
		dojo.byId("table_effort_time").innerHTML = formatTime2(directions.totalTime);
		dojo.byId("table_effort_dist").innerHTML = formatDistance(directions.totalLength, "meters");
		var dirStrings = ["<ol>"];
        dojo.forEach(solveResult.routeResults[0].directions.features, function(feature, i) {
          dirStrings.push("<li onclick='zoomToSegment(" + i + "); return false;' class=\"segment\"><a href=\"#\">" + feature.attributes.text + " (" + formatDistance(feature.attributes.length ,"meters") + ", " + formatTime(feature.attributes.time) + ")</a></li>");
        });
        dirStrings.push("</ol>");
		htmlContent_effort = dirStrings.join("");
		waitingLogoToggle();
      }
	  
	  function changeTab(id){
		  if (id == "time"){
			  dojo.byId("summary").innerHTML = htmlSummary_time;
			  dojo.byId("directions").innerHTML = htmlContent_time;
			  dojo.byId("tab_time").className = "tab_content_select";
			  dojo.byId("tab_meter").className = "tab_content";
			  dojo.byId("tab_secure").className = "tab_content";
			  dojo.byId("tab_effort").className = "tab_content";
			  map.graphics.add(routeGraph1);
			  map.graphics.remove(routeGraph2);
			  map.graphics.remove(routeGraph3);
			  map.graphics.remove(routeGraph4);
		  }
		  if (id == "meter"){
			  dojo.byId("summary").innerHTML = htmlSummary_meter;
			  dojo.byId("directions").innerHTML = htmlContent_meter;
			  dojo.byId("tab_time").className = "tab_content";
			  dojo.byId("tab_meter").className = "tab_content_select";
			  dojo.byId("tab_secure").className = "tab_content";
			  dojo.byId("tab_effort").className = "tab_content";
			  map.graphics.add(routeGraph2);
			  map.graphics.remove(routeGraph1);
			  map.graphics.remove(routeGraph3);
			  map.graphics.remove(routeGraph4);
		  }
		  if (id == "secure"){
			  dojo.byId("summary").innerHTML = htmlSummary_secure;
			  dojo.byId("directions").innerHTML = htmlContent_secure;
			  dojo.byId("tab_time").className = "tab_content";
			  dojo.byId("tab_meter").className = "tab_content";
			  dojo.byId("tab_secure").className = "tab_content_select";
			  dojo.byId("tab_effort").className = "tab_content";
			  map.graphics.add(routeGraph3);
			  map.graphics.remove(routeGraph1);
			  map.graphics.remove(routeGraph2);
			  map.graphics.remove(routeGraph4);
		  }
		  if (id == "effort"){
			  dojo.byId("summary").innerHTML = htmlSummary_effort;
			  dojo.byId("directions").innerHTML = htmlContent_effort;
			  dojo.byId("tab_time").className = "tab_content";
			  dojo.byId("tab_meter").className = "tab_content";
			  dojo.byId("tab_secure").className = "tab_content";
			  dojo.byId("tab_effort").className = "tab_content_select";
			  map.graphics.add(routeGraph4);
			  map.graphics.remove(routeGraph1);
			  map.graphics.remove(routeGraph2);
			  map.graphics.remove(routeGraph3);
		  }
		  
		  
		  
		  
	  }
	  
	  

      //Displays any error returned by the Route Task
      function errorHandler(err) {
        alert("An error occured\n" + err.message + "\n" + err.details.join("\n"));

        routeParams.stops.features.splice(0, 0, lastStop);
		routeParams2.stops.features.splice(0, 0, lastStop2);
		routeParams3.stops.features.splice(0, 0, lastStop3);
		routeParams3.stops.features.splice(0, 0, lastStop3);
        map.graphics.remove(routeParams.stops.features.splice(1, 1)[0]);
		map.graphics.remove(routeParams2.stops.features.splice(1, 1)[0]);
		map.graphics.remove(routeParams3.stops.features.splice(1, 1)[0]);
      }
	  
	  //Zoom to the appropriate segment when the user clicks a hyperlink in the directions list
      function zoomToSegment(index) {
		segmentGraphic = null;
        var segment = directionFeatures[index];
        map.setExtent(segment.geometry.getExtent(), true);
        if (! segmentGraphic) {
          segmentGraphic = map.graphics.add(new esri.Graphic(segment.geometry, segmentSymbol));
        }
        else {
          segmentGraphic.setGeometry(segment.geometry);
        }
      }

      function zoomToFullRoute() {
        map.graphics.remove(segmentGraphic);
        segmentGraphic = null;
        map.setExtent(directions.extent, true);
      }

      //Format the time as hours and minutes
      function formatTime(time) {
        var hr = Math.floor(time / 60), //Important to use math.floor with hours
            min = Math.round(time % 60);

        if (hr < 1 && min < 1) {
          return "";
        }
        else if (hr < 1) {
          return min + " minute(s)";
        }

        return hr + " hour(s) " + min + " minute(s)";
      }
	  
	  function formatTime2(time) {
        
		var time1 = time - (time * 0.15);
		var time2 = time + (time * 0.25);
		
		
        return formatTime(time1) + " - " + formatTime(time2);
      }
	  
	  

      //Round the distance to the nearest hundredth of a unit
      function formatDistance(dist, units) {
        var d = Math.round(dist * 100) / 100;
        if (d === 0) {
          return "";
        }

        return d + " " + units;
      }// JavaScript Document
