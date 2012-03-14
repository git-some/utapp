function preload(arrayOfImages) {
    $(arrayOfImages).each(function(){
        $('<img/>')[0].src = this;
        // Alternatively you could use:
        // (new Image()).src = this;
    });
}
preload([
  'img/managed_areas/cypress-dome/info.png'
]);

$(document).ready(function(){
	
	
	//alert($.mobile.media("screen and (max-width: 1024px)"));
	ucf_map.init();
	var ucf_MH =  new google.maps.LatLng(28.598814,-81.202538);
	var ucf_NE = new google.maps.LatLng(28.611749,-81.207433);
	var ucf_SW = new google.maps.LatLng(28.585826,-81.178937);
	var mapOptions = {
		center:ucf_MH,
		zoom:16,  // Put me at MH
		mapTypeId: google.maps.MapTypeId.ROADMAP,
		disableDefaultUI: true, 
		mapTypeControl: false
	};	

	$('#gold_route_list').click(function() {
		
	});

	$('#burnett_honors_college').click(function() {
		$.mobile.changePage({
			url: "transportation.html?test=tt",
			type: 'get',
			data: {
				poi:'Burnett Honors College'
			}
		});
	});

	$('#org').live('pagecreate', function(event){
	//	$('#student_orgs').collapsible({collapse: false});
	//	$('#student_orgs').bind(function() {
	//		collapseList('departments');
	//	});
	
//		$('#departments').click(function() {
	//		collapseList('student_orgs');
	//	});
		/*
		$('#student_orgs').children().click(function() {
			collapseList('departments');
		});
		
		$('#departments').children().click(function() {
			collapseList('student_orgs');
		});*/
	});
	
	$('#map_page').live('pageshow', function(event){

		var map_container = document.getElementById('map');		
		var map = new google.maps.Map(map_container, mapOptions);
		ucf_map.initFullMap();
	});
	
	$('#black_route_page').live('pageshow', function(event){
		
		var map_container = document.getElementById('black_route_map');
		try {
			var map = new google.maps.Map(map_container, mapOptions);
			ucf_map.initRoute('black', 'black_route_map');
								}catch(e){}
		
	});
	
	$('#gold_route_page').live('pageshow', function(event){
		
		var map_container = document.getElementById('gold_route_map');
		var map = new google.maps.Map(map_container, mapOptions);
		ucf_map.initRoute('gold', 'gold_route_map');
	});
	
	$('#pegasus_route_page').live('pageshow', function(event){
		
		var map_container = document.getElementById('pegasus_rote_map');
		var map = new google.maps.Map(map_container, mapOptions);
		ucf_map.initRoute('pegasus', 'pegasus_route_map');
	});
	
	$('#africa_landscape').live('pageshow', function(event){
		
		var map_container = document.getElementById('africa_landscape_map');
		var map = new google.maps.Map(map_container, mapOptions);
		ucf_map.goToLandscapePOI('africa_landscape_map', 'Africa Landscape', 'landscape', 'africa_landscape_map_info');
	});
		
	$('#sago_palms_landscape').live('pageshow', function(event){
		
		var map_container = document.getElementById('sago_palms_landscape_map');
		var map = new google.maps.Map(map_container, mapOptions);
		ucf_map.goToLandscapePOI('sago_palms_landscape_map', 'Sago Palms', 'landscape', 'sago_palms_landscape_map_info');
	});

	$('#arboretum_landscape').live('pageshow', function(event){
		
		var map_container = document.getElementById('arboretum_landscape_map');
		var map = new google.maps.Map(map_container, mapOptions);
		ucf_map.goToLandscapePOI('arboretum_landscape_map', 'UCF Arboretum', 'landscape', 'arboretum_landscape_map_info');
	});
	
	$('#bonsai_house_landscape').live('pageshow', function(event){
		
		var map_container = document.getElementById('bonsai_house_landscape_map');
		var map = new google.maps.Map(map_container, mapOptions);
		ucf_map.goToLandscapePOI('bonsai_house_landscape_map', 'Bonsai House', 'landscape', 'bonsai_house_landscape_map_info');
	});

	$('#community_garden_landscape').live('pageshow', function(event){
		
		var map_container = document.getElementById('community_garden_map');
		var map = new google.maps.Map(map_container, mapOptions);
		ucf_map.goToLandscapePOI('community_garden_map', 'Community Garden', 'landscape', 'community_garden_map_info');
	});
	$('#cypress_dome').live('pageshow', function(event){
		
		var map_container = document.getElementById('cypress_dome_map');
		var map = new google.maps.Map(map_container, mapOptions);
		ucf_map.goToLandscapePOI('cypress_dome_map', 'Cypress Dome', 'landscape', 'cypress_dome_map_info');
	});
	$('#mediterranean_landscape').live('pageshow', function(event){
		
		var map_container = document.getElementById('mediterranean_map');
		var map = new google.maps.Map(map_container, mapOptions);
		ucf_map.goToLandscapePOI('mediterranean_map', 'Mediterranean Landscape', 'landscape', 'mediterranean_map_info');
	});
	$('#nature_pavillion').live('pageshow', function(event){
		
		var map_container = document.getElementById('nature_pavillion_map');
		var map = new google.maps.Map(map_container, mapOptions);
		ucf_map.goToLandscapePOI('nature_pavillion_map', 'Nature Pavillion', 'landscape', 'nature_pavillion_map_info');
	});
	$('#reflections_landscape').live('pageshow', function(event){
		
		var map_container = document.getElementById('reflections_map');
		var map = new google.maps.Map(map_container, mapOptions);
		ucf_map.goToLandscapePOI('reflections_map', 'Reflections Landscape', 'landscape', 'reflections_map_info');
	});
	
	$('#reflections_pond').live('pageshow', function(event){
		
		//var map_container = document.getElementById('reflections_map');
		//var map = new google.maps.Map(map_container, mapOptions);
		//ucf_map.goToLandscapePOI('reflections_map', 'Reflections Landscape', 'landscape', 'reflections_map_info');
	});
	
	$('#skunk_vine').live('pageshow', function(event){
		
		var map_container = document.getElementById('skunk_vine_map');
		var map = new google.maps.Map(map_container, mapOptions);
		ucf_map.goToLandscapePOI('skunk_vine_map', 'Skunk vine (cypress strand)', 'landscape', 'skunk_vine_map_info');
	});

	$('#wild_flower').live('pageshow', function(event){
	
		var map_container = document.getElementById('wild_flower_map');
		var map = new google.maps.Map(map_container, mapOptions);
		ucf_map.goToLandscapePOI('wild_flower_map', 'Nature Trails', 'landscape', 'wild_flower_map_info');
	});
	
	$('#xeric_landscape').live('pageshow', function(event){
		
		var map_container = document.getElementById('xeric_map');
		var map = new google.maps.Map(map_container, mapOptions);
		ucf_map.goToLandscapePOI('xeric_map', 'Xeric Landscape', 'landscape', 'xeric_map_info');
	});
	
	$('#solar-pv').live('pageshow', function(event){
		
		var map_container = document.getElementById('solar-pv_map');
		var map = new google.maps.Map(map_container, mapOptions);
		ucf_map.goToEnergyPOI('solar-pv_map', 'Solar PV', 'energy', 'solar-pv_map_info');
	});
	
	$('#solar-charge').live('pageshow', function(event){
		
		var map_container = document.getElementById('solar-charge_map');
		var map = new google.maps.Map(map_container, mapOptions);
		ucf_map.goToEnergyPOI('solar-charge_map', 'Solar Charge Station', 'energy', 'solar-charge_map_info');
	});

	$('#solar-thermal').live('pageshow', function(event){
		
		var map_container = document.getElementById('solar-thermal_map');
		var map = new google.maps.Map(map_container, mapOptions);
		ucf_map.goToEnergyPOI('solar-thermal_map', 'Solar Hot Water', 'energy', 'solar-thermal_map_info');
	});
	$('#thermal-energy-storage').live('pageshow', function(event){
		
		var map_container = document.getElementById('thermal-energy-storage_map');
		var map = new google.maps.Map(map_container, mapOptions);
		ucf_map.goToEnergyPOI('thermal-energy-storage_map', 'Thermal Energy Storage', 'energy', 'thermal-energy-storage_map_info');
	});
	
	$('#harris-corps').live('pageshow', function(event){
		
		var map_container = document.getElementById('harris-corps_map');
		var map = new google.maps.Map(map_container, mapOptions);
		ucf_map.goToEnergyPOI('harris-corps_map', 'Harris Corps', 'energy', 'harris-corps_map_info');
	});

	$('#green-roof').live('pageshow', function(event){
		
		var map_container = document.getElementById('green-roof_map');
		var map = new google.maps.Map(map_container, mapOptions);
		ucf_map.goToEnergyPOI('green-roof_map', 'Green Roof', 'energy', 'green-roof_map_info');
	});
	
	$('#physical-science').live('pageshow', function(event){
		
		var map_container = document.getElementById('physical-science_map');
		var map = new google.maps.Map(map_container, mapOptions);
		ucf_map.goToEnergyPOI('physical-science_map', 'Physical Sciences', 'energy', 'physical-science_map_info');
	});
	
	$('#barc_page').live('pageshow', function(event){
		
		var map_container = document.getElementById('barc_page_map');
		var map = new google.maps.Map(map_container, mapOptions);
		ucf_map.goToOrgPOI('barc_page_map', 'B.A.R.C.', 'organizations', 'barc_page_map_info');
	});
	
	$('#spokes_council_page').live('pageshow', function(event){
		
		var map_container = document.getElementById('spokes_council_page_map');
		var map = new google.maps.Map(map_container, mapOptions);
		ucf_map.goToOrgPOI('spokes_council_page_map', 'Spokes Council', 'organizations', 'spokes_council_page_map_info');
	});

	$('#volunteer_ucf_page').live('pageshow', function(event){
		console.log('bboo');
		var map_container = document.getElementById('volunteer_ucf_page_map');
		var map = new google.maps.Map(map_container, mapOptions);
		ucf_map.goToOrgPOI('volunteer_ucf_page_map', 'Volunteer UCF', 'organizations', 'volunteer_ucf_page_map_info');
	});
	
	$('#eco_advocates_page').live('pageshow', function(event){
				
		var map_container = document.getElementById('eco_advocates_page_map');
		var map = new google.maps.Map(map_container, mapOptions);
		ucf_map.goToOrgPOI('eco_advocates_page_map', 'Eco - Advocates', 'organizations', 'eco_advocates_page_map_info');
	});
	
	$('#ideas_page').live('pageshow', function(event){
		
		var map_container = document.getElementById('ideas_page_map');
		var map = new google.maps.Map(map_container, mapOptions);
		ucf_map.goToOrgPOI('ideas_page_map', 'I.D.E.A.S.', 'organizations', 'ideas_page_map_info');
	});
	/*
	$('#racoon_page').live('pageshow', function(event){
		
		var map_container = document.getElementById('racoon_page_map');
		var map = new google.maps.Map(map_container, mapOptions);
		ucf_map.goToOrgPOI('racoon_page_map', 'R.A.C.O.O.N.', 'organizations', 'racoon_page_map_info');
	});
	*/
	$('#ssa_page').live('pageshow', function(event){
		
		var map_container = document.getElementById('ssa_page_map');
		var map = new google.maps.Map(map_container, mapOptions);
		ucf_map.goToOrgPOI('ssa_page_map', 'Student Sustainability Alliance', 'organizations', 'ssa_page_map_info');
	});
	
	$('#ucf_green_team_page').live('pageshow', function(event){
		
		var map_container = document.getElementById('ucf_green_team_page_map');
		var map = new google.maps.Map(map_container, mapOptions);
		ucf_map.goToOrgPOI('ucf_green_team_page_map', 'UCF Green Team', 'organizations', 'ucf_green_team_page_map_info');
	});
	
	$('#sem_page').live('pageshow', function(event){
		
		var map_container = document.getElementById('sem_page_map');
		var map = new google.maps.Map(map_container, mapOptions);
		ucf_map.goToOrgPOI('sem_page_map', 'Sustainability and Energy Management', 'organizations', 'sem_page_map_info');
	})
	
	$('#landscapes_NR_page').live('pageshow', function(event){
		
		var map_container = document.getElementById('landscapes_NR_page_map');
		var map = new google.maps.Map(map_container, mapOptions);
		ucf_map.goToOrgPOI('landscapes_NR_page_map', 'Landscapes & Natural Resources', 'organizations', 'landscapes_NR_page_map_info');
	});
	
	$('#sga_environment_page').live('pageshow', function(event){
		
		var map_container = document.getElementById('sga_environment_page_map');
		var map = new google.maps.Map(map_container, mapOptions);
		ucf_map.goToOrgPOI('sga_environment_page_map', 'SGA Environment & Sustainability Specialists', 'organizations', 'sga_environment_page_map_info');
	});
	
	$('#dining_services_page').live('pageshow', function(event){
		
		var map_container = document.getElementById('dining_services_page_map');
		var map = new google.maps.Map(map_container, mapOptions);
		ucf_map.goToOrgPOI('dining_services_page_map', 'UCF Dining Services', 'organizations', 'dining_services_page_map_info');
	});
	
});
/*ssa_page
function collapseList(id)
{
	var el = $('#'+id);
	console.log(el);
	// Get all of the childen panes.
	//var children = el.children('div');
	
	//console.log(children);
	
	// Collapse each one.
//	children.collapsible({collapsed: true});
	
	// Collapse parent.
	el.collapsible({colldapsed: true});
}
*/
