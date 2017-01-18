app.service('modalService', ["$mdDialog","URL_CONFIG",function($mdDialog,URL_CONFIG){
	var publicApi = {};
	var urls = new URL_CONFIG();

	publicApi.savedAlert = function(title,message){
		var options =  {};
		options.onRemoving = function(){
				window.location = "#/promotion-dashboard";
		}              
		$mdDialog.show($mdDialog.alert(options)
                    .title(title)
                    .escapeToClose(false)
                    .clickOutsideToClose(true)
                    .textContent(message)
                    .ok("Go to dashboard"));
	}

	publicApi.showAlert = function(title,message){
		$mdDialog.show($mdDialog.alert()
                    .title(title)
                    .textContent(message)
                    .ok("Ok"));
	}

	return publicApi;
}]);