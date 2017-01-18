/* 
	State Service 
	Services that will handle setting common state of ui properties
*/

app.service('adminSubnavService', ['SECTIONS', function(SECTIONS){
	var publicApi = {};
	var activeNav = 0;

	// Method to deactivate all sections, expected to have property .isActive
	publicApi.deactivateSection = function(data){
		$(data).each(function(i, val){
			val.isActive = false;
			activeNav = i;
		});
		return data;
	}

	publicApi.getActivateSection = function(){
		return activeNav;
	}
	publicApi.setActivateSection = function(index){
		publicApi.deactivateSection(SECTIONS);
		SECTIONS[index] = true;
	}

	publicApi.getSections = function(){
		return SECTIONS;
	}
	// Takes sections, Test return section flagged as active
	// publicApi.getSection = function(sections){
	// 	var section = $.grep(sections, function(e){return e.isActive === true;});
	// 	return section[0] || {};
	// }

	return publicApi;
	
}]);