var ucf_map = function(){
	
	var map = null;
	var coordinates = null;
	//var directionDisplay;
	//var directionsService = new google.maps.DirectionsService();
	//var transportation_route = null;
	var current_pos = null; // Users position.
	var markerArray = [];  // Used to store navigation marks when getting a route.
	var nav_route = [];	
	var custom_icons = [];
	
	var groups = [];
	
	var plotted = []; // Currently showing markers on the map.
	var all_marks = [];	 // All avaiable marks on the map.
	var all_routes = [];
	
	var route_names = []; // List of route names.
	
	var map_container;
	var infowindow;
	var ucf_MH =  new google.maps.LatLng(28.598814,-81.202538);
	var ucf_NE = new google.maps.LatLng(28.611749,-81.207433);
	var ucf_SW = new google.maps.LatLng(28.585826,-81.178937);
	var active;
	
	var loadCoordinates = function()
	{
		downloadUrl("./markers.xml", function(data) { 
			coordinates = data;
		});
	}
	
	var init = function()
	{
		loadCoordinates();		
	}
	
	var initFullMap = function()
	{
		createMap();
	}
	
	var goToPOI = function(map_id, poi, group, info, type)
	{
		createMap(map_id);
		var coords = getPOICoords(poi, group, info, true, type);
	}
	
	var goToLandscapePOI = function(map_id, poi, group, info)
	{
		goToPOI(map_id, poi, group, info, 'landscape');
	}
	
	var goToEnergyPOI = function(map_id, poi, group, info)
	{
		goToPOI(map_id, poi, group, info, 'energy');
	}
	
	var goToOrgPOI = function(map_id, poi, group, info)
	{
		goToPOI(map_id, poi, group, info, 'organizations');
	}
	
	var getPOICoords = function(poi, group, info, showInfo, type)
	{
		groups = coordinates.documentElement.getElementsByTagName("group");
		for(var i=0;i<groups.length;i++){							
			if($(groups[i]).attr('name') == group) {		
				removePlottedMarkers();
				removePlottedRoutes();
				var markers = groups[i].getElementsByTagName('marker');		
				for(var j=0;j<markers.length;j++){
					if($(markers[j]).attr('name') == poi){
						displayMarkers(type, info, showInfo, poi);
						calcPOIRoute($(markers[j]).attr('lat'), $(markers[j]).attr('lng'))
						break;
					}
				}					
			}
		}
	}
	
	var createMap = function(map_id)
	{
		if(map_id == null) map_id = 'map';
		var self = this;
		map_container = document.getElementById(map_id);
		
		var mapOptions = {
			center:ucf_MH,
			zoom:16,  // Put me at MH
			mapTypeId: google.maps.MapTypeId.ROADMAP,
			disableDefaultUI: true, 
			mapTypeControl: false
		};	
		
		map = new google.maps.Map(map_container, mapOptions);
		var bounds = new google.maps.LatLngBounds(
			new google.maps.LatLng(ucf_NE),
			new google.maps.LatLng(ucf_SW)
		);
		
		initButtons();
		initIcons();
		createMarkers();
		markUserPosition();
	}
	
	var initRoute = function(name, map_id, poi)
	{
		createMap(map_id);
		createRoute(name);
	}
	
	var createRoute = function(route_id)
	{				

		//downloadUrl("markers.xml", function(data) { 
			groups = coordinates.documentElement.getElementsByTagName("group");
			for(var i=0;i<groups.length;i++){							
				if($(groups[i]).attr('name') == 'transportation') {		
					var routes = groups[i].getElementsByTagName('route');		
					for(var j=0;j<routes.length;j++){
						if($(routes[j]).attr('id') == route_id){
							removePlottedMarkers();
							removePlottedRoutes();
							 makeRoutes(routes[j]);				
							 makeGroupMarkers(routes[j].getElementsByTagName('marker'), 'transportation');
							 break;
						}
					}					
				}
			}
//		});	
	}
	
	var initButtons = function()
	{
		initLandscape();
		initEnergy();
		initTransportation();
		initStudentOrgs();
		initSmartBuildings();
	}	

	var initLandscape = function(){$('#landscape').click(function(){toggleActive(this);});}
	var initEnergy = function(){$('#energy').click(function(){toggleActive(this);});}
	var initTransportation = function(){$('#transportation').click(function(){toggleActive(this);});}
	var initStudentOrgs = function(){$('#organizations').click(function(){toggleActive(this);});}
	var initSmartBuildings = function(){$('#smart').click(function(){toggleActive(this);});}

	var toggleActive = function(el)
	{
		$(active).css('background-image', 'url(./themes/main/img/buttons/'+$(active).attr('id')+'.png)');
		$(el).css('background-image', 'url(./themes/main/img/buttons/'+$(el).attr('id')+'_active.PNG)');
		active = el;
		
		diplayActiveMarkers(el);	

		// If transportation, display the user with a choice of what route they want to see.
		if($(el).attr('id') == 'transportation'){		
			// Find transportation group
			for(var i=0;i<groups.length;i++){
				if($(groups[i]).attr('name') == 'transportation') {
					// Display loist of routes to user.
					displayRoutesList(groups[i]);
				}
			}
		}
	//	else if($(el).attr('id') == 'organizations'){
	//		for(var i=0;i<groups.length;i++){
	//			if($(groups[i]).attr('name') == 'organizations') {
	//				displayList(groups[i], 'organization', 'Please choose an organization:');
	//			}
	//		}
	//	}
	}
	
	var displayList = function(group, list_name, header)
	{
		var div = $('<div id="progress"></div>');
		div.append($('<h3>'+header+'</h3>'));
		var ul = $('<ul></ul>');
		
		var routes = group.getElementsByTagName(list_name);
		
		for(var i=0;i<routes.length;i++){
			var li = $('<li id="'+list_name+'_'+i+'">'+$(routes[i]).attr('name')+'</li>');
			
			// add listener
			li.click(function() {
					 var route = routes[i];
					 return function(){
					 makeRoutes(route);
					 $('#progress').remove();
					 }
					 }());
			ul.append(li);
			
		}
		div.append(ul);
		$('body').append(div);
	}
	
	var displayRoutesList = function(group)
	{		
		displayList(group, 'route', 'Please choose a route to view:');
	}
	
	var removePlottedMarkers = function()
	{
		// Remove all current markers.
		for(var i =0; i<plotted.length;i++){
			plotted[i].marker.setMap(null);	
		}
		plotted.length = 0;	
	}
	
	var removePlottedRoutes = function()
	{
		for(i=0; i < all_routes.length; i++){
			all_routes[i].setMap(null);
		}
	}
	
	var diplayActiveMarkers = function(el)
	{
		$('#progress').remove();
		removePlottedMarkers();
		removePlottedRoutes();
		var id = $(el).attr('id');
		displayMarkers(id);
		
	}
	
	var displayMarkers = function(id, info_id, showInfo, poi)
	{
		//console.log(all_marks);
		//console.log(id);
		// Create new markers of the type chosen.	
		if(info_id)
			info_id = $('#'+info_id).html();
		else info_id = '';
		
		if(poi)
			poi = poi;
		else poi = '';
		
		for (var i = 0; i < all_marks[id].length; i++) {
			//console.log(mark.marker.icon);
			var mark = all_marks[id][i];						
			var marker = new google.maps.Marker({
				position:mark.marker.position, 
				map:map, 
				title: mark.marker.title,
				icon: mark.marker.icon				
			});								
			// Remeber the marker
			plotted[i] = {marker:marker, type:id};
			// Add window.				
			mark.window_info.marker = marker;
			
			if(poi == mark.window_info.name){
				mark.window_info.info = info_id;
				mark.window_info.display = showInfo;
			}
			makeInfoWindow(mark.window_info);		
		}
	}
	
	var initIcons = function()
	{				
	    custom_icons["landscape"] = './themes/main/img/markers/landscape.png';
		custom_icons["transportation"] = './themes/main/img/markers/transportation.png';
		custom_icons["organizations"] = './themes/main/img/markers/organizations.png';
	    custom_icons["coalitions"] = './themes/main/img/markers/coalitions.png';
		custom_icons["academic"] = './themes/main/img/markers/academic.png';
		custom_icons["energy"] = './themes/main/img/markers/energy.png';
		custom_icons["regional"] = './themes/main/img/markers/regional.png';
		custom_icons["smart"] = './themes/main/img/markers/smart.png';
	}
	
	var createMarkers = function()
	{
		
	//	downloadUrl("markers.xml", function(data) { 
			groups = coordinates.documentElement.getElementsByTagName("group");
			for(var i=0;i<groups.length;i++){								
				var group_name = $(groups[i]).attr('name');
				var markers = groups[i].getElementsByTagName('marker');
				all_marks[group_name] = [];								
				makeGroupMarkers(markers, group_name);
				//makeRoutes(groups[i]);
			}
	//	});	
	}
	
	/**
	 * route is an xml element of a route.
	 */
	var makeRoutes = function(route)
	{
		var route_name = $(route).attr('name');					
		var points = [];
		var start;
		var end;
		
		// Get all the stops on the route.
		var markers = route.getElementsByTagName('marker');
		
		for(var j=0;j<markers.length;j++){
		
			var lat = parseFloat(markers[j].getAttribute("lat"));
			var lng = parseFloat(markers[j].getAttribute("lng"));
			var p = new google.maps.LatLng(lat,lng);
			
			// Test for starting point.
			if(j==0){
				start = p;
				continue;		
			}
			// Test for ending point.
			else if(j+1 == markers.length){
				end = p;
				break;	
			}
			// Middle points.
			else
				points.push({location: p});
		}
		
		// Create a line that goes through all the markers on the route using custom icons.
		var directionsDisplayOptions = {
			suppressMarkers: true, // Don't use default info.
			polylineOptions: {
				strokeColor:$(route).attr('color')
			},
			markerOptions: {
				icon: custom_icons['transportation']	
			}
		}
		var directionsDisplay = new google.maps.DirectionsRenderer(); 
		directionsDisplay.setOptions(directionsDisplayOptions);					

		// Retrieve the start and end locations and create
		// a DirectionsRequest using WALKING directions.
		var request = {
			origin: start,
			destination: end,
			travelMode: google.maps.DirectionsTravelMode.DRIVING,
			waypoints: points
		};

		var directionsService = new google.maps.DirectionsService();
		all_routes.push(directionsDisplay);
		directionsDisplay.setMap(map);
		
		directionsService.route(request, function(response, status) {
			if (status == google.maps.DirectionsStatus.OK) {
				directionsDisplay.setDirections(response);
				//transportation_route = response.routes; // set global transport route
			}
		});
	}
	
	var makeGroupMarkers = function(marks, group_name)
	{
		var markers = marks;
		var properties = "";

		for (var i = 0; i < markers.length; i++) {
			var type = markers[i].getAttribute("type");
			var lat = parseFloat(markers[i].getAttribute("lat"));
			var lng = parseFloat(markers[i].getAttribute("lng"));
			var mark = markers[i];
			var point = new google.maps.LatLng(lat,lng);		
			//mark.latlng = point;	
			var marker = new google.maps.Marker({
				position:point, 
				map:map, 
				title: mark.getAttribute("name")+' (click for more info)',
				icon: custom_icons[type]
			});		
			
			var html = $("#" + mark.getAttribute("info_page")).html();
			if(html == null) html = '';
			plotted.push({marker:marker, type:type});
			var info = {
				marker:marker, 
				name:mark.getAttribute("name"),
				info:html,//mark.getAttribute("info"),
				info_page:mark.getAttribute("info_page"),
				lat:lat,
				lng:lng,
				count:i
			};
			makeInfoWindow(info);
			all_marks[group_name].push({marker:marker, window_info:info});
		}
	}
	
	var makeInfoWindow = function(data)//marker, mark, lat, lng, i)
	{
		var d = data;
		var marker = data.marker;
		var name = data.name;
		var info = data.info;
		var lat = data.lat;
		var lng = data.lng;
		var info_page = data.info_page;
		var i = data.count;
	
		if(data.display){
			
			if(!infowindow){
				infowindow = new google.maps.InfoWindow();
			}
//<p><a onclick="ucf_map.displayInfo(\''+info_page+'\');" style="cursor:pointer;text-decoration:underline;color:blue;">Read More</a><a onclick="ucf_map.calcRoute('+lat+','+lng+')" style="cursor:pointer;text-decoration:underline;color:blue;">Get Route</a></p>
//<p><a onclick="ucf_map.displayInfo(\''+info_page+'\');" style="cursor:pointer;text-decoration:underline;color:blue;">Read More</a><a onclick="ucf_map.calcRoute('+lat+','+lng+')" style="cursor:pointer;text-decoration:underline;color:blue;">Get Route</a></p>
			infowindow.setContent('<div id="infowindow_'+i+'" class="info"><h4>'+name+'</h4>'+info+'</div>');
			infowindow.open(map, marker);
		}
		google.maps.event.addListener(marker, 'click', function() {
			// Only allow 1 window.
			if(!infowindow){
				infowindow = new google.maps.InfoWindow();
			}

			infowindow.setContent('<div id="infowindow_'+i+'" class="info"><h4>'+name+'</h4>'+info+'</div>');
			infowindow.open(map, marker);
		});
	}
	
	var displayInfo = function(page)
	{
		$.get(page, function(data){			
			$('#advanced_info').html('<div class="back_button" onclick="$(this).hide(); $(\'#advanced_info\').hide(); $(\'#back_button\').hide(); $(\'#map\').show(); $(\'#footer\').show(); $(\'#header\').show();">Back</div>' + data);
			$('#map').hide();		
			$('#header').hide();
			$('#footer').hide();
			$('#back_button').show();
						
			$('#advanced_info').show();
		});
	}
	
	var viewInfo = function(page)
	{
		if(!page){
			displayInfo('information/managed_areas/index.html');
		}
		else {
			displayInfo(page);	
		}
	}
	
	var markUserPosition = function()
	{
		if(geo_position_js.init()){
			var settings = {
				enableHighAccuracy: true
			};
			
			geo_position_js.getCurrentPosition(setPosition, handleError, settings);
			
			var rendererOptions = {
			    map: map
			}
			
			directionsDisplay = new google.maps.DirectionsRenderer(rendererOptions)
    
		   	// Instantiate an info window to hold step text.
		   	stepDisplay = new google.maps.InfoWindow();
		   	//geo_position_js.watchPosition(obj.setPosition);
		}
		else {
			;//alert('Cannot location your position.');
		}
	}
	
	var calcPOIRoute = function(lat, lng)
	{
		
		if(geo_position_js.init()){
			var settings = {
				enableHighAccuracy: true
			};
			
			geo_position_js.getCurrentPosition(function(position){
				var latLng = new google.maps.LatLng(position.coords.latitude, position.coords.longitude);
				currentPos = latLng;
				//var end = new google.maps.LatLng("28.600652", "-81.197957");
				var marker = new google.maps.Marker({
					position:latLng,
					map:map
				});
				
				var infoWindow = new google.maps.InfoWindow({
					content: 'You are here.'
				});
				
				infoWindow.open(map, marker);
				
				map.setZoom(16);
				calcRoute(lat, lng);	
			}, handleError, settings);
			
			var rendererOptions = {
			    map: map
			}
			
			directionsDisplay = new google.maps.DirectionsRenderer(rendererOptions)
    
		   	// Instantiate an info window to hold step text.
		   	stepDisplay = new google.maps.InfoWindow();
		   	//geo_position_js.watchPosition(obj.setPosition);
		}
		else {
			;//alert('Cannot location your position.');
		}
		
	}
	
	
	var calcRoute = function(lat, lng)
	{
		var self = this;
		// First, clear out any existing markerArray
	 	// from previous calculations.
	  	for (i = 0; i < markerArray.length; i++) {
	    	markerArray[i].setMap(null);
  		}
		var end = new google.maps.LatLng(lat,lng);	
		// Retrieve the start and end locations and create
	  	// a DirectionsRequest using WALKING directions.
	  	var request = {
			origin: currentPos,
		  	destination: end,
		  	travelMode: google.maps.DirectionsTravelMode.WALKING
	  	};

		// Route the directions and pass the response to a
		// function to create markers for each step.
		var directionsService = new google.maps.DirectionsService();
		
		directionsService.route(request, function(response, status) {
			if (status == google.maps.DirectionsStatus.OK) {
				//  var warnings = document.getElementById("warnings_panel");
				//  warnings.innerHTML = "" + response.routes[0].warnings + "";
				directionsDisplay.setDirections(response);
				showSteps(response);
			}
		});
	}
	
	var showSteps = function(directionResult) {

  		// For each step, place a marker, and add the text to the marker's
  		// info window. Also attach the marker to an array so we
  		// can keep track of it and remove it when calculating new
  		// routes.
  		var myRoute = directionResult.routes[0].legs[0];
  		for (var i = 0; i < myRoute.steps.length; i++) {
      		var marker = new google.maps.Marker({
        		position: myRoute.steps[i].start_point, 
        		map:map
      		});
      		//attachInstructionText(marker, myRoute.steps[i].instructions);
     		markerArray[i] = marker;
  		}
	}
	
	var handleError = function(error)
	{
		;//alert('Error = ' + error.message);
	}
	
	
	
	var setPosition = function(position)
	{		
		var latLng = new google.maps.LatLng(position.coords.latitude, position.coords.longitude);
		currentPos = latLng;
		//var end = new google.maps.LatLng("28.600652", "-81.197957");
		var marker = new google.maps.Marker({
			position:latLng,
			map:map
		});
		
		var infoWindow = new google.maps.InfoWindow({
			content: 'You are here.'
		});
		
		infoWindow.open(map, marker);
		
		map.setZoom(16);
		//calcRoute(end);
	}
	
	return {
		init:init,
		calcRoute:calcRoute,
		displayInfo:displayInfo,
		viewInfo:viewInfo,
		initRoute:initRoute,
		coordinates:coordinates, 
		goToLandscapePOI:goToLandscapePOI,
		goToEnergyPOI:goToEnergyPOI,
		goToOrgPOI:goToOrgPOI,
		initFullMap:initFullMap
	};
}();