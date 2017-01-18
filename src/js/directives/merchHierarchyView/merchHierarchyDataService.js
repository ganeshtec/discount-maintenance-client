/**
 * 
 */
app.service('merchHierarchyDataService', ['$http', '$q', 'dataService', 'DataFactory','URL_CONFIG',
	function($http, $q, dataService, DataFactory,URL_CONFIG){
	var publicApi = {};
	var resourceUrl =  '';

	/*Departments - START*/
	
	publicApi.getAllDepartments = function() {
		console.log('getAllDepartments Function in Merch Hierarchy DataService');
		var config= {
				method: 'GET',
				url: '/merchHierarchy/departments',
				
		},
		result=$q.defer();
		
		dataService.httpRequest(config).then(
				function(response){
					console.log('getDepartments ', response.data);
					result.resolve(response.data);
				},function(error){
					console.log(error);
					result.reject(error);
			});
	
		return result.promise;
	}
	/*Departments - END*/
	
	/*Classes - START*/
	publicApi.getAllClasses = function(dept) {
		console.log('getAllClasses Function in Merch Hierarchy DataService');
		var config= {
				method: 'GET',
				url:'/merchHierarchy/classes/'+dept,
		}
		result=$q.defer();
		
		dataService.httpRequest(config).then(
				function(response){
					console.log('getClasses ', response.data);
					result.resolve(response.data);
				},function(error){
					console.log(error);
					result.reject(error);
			});
		
		return result.promise
	}
	/*Classes - END*/
	
	
	/*Subclasses - START*/
	publicApi.getSubClasses = function(deptId,ClassId) {
		console.log('getSubClasses Function in Merch Hierarchy DataService');
		
		var config= {
				method: 'GET',
				url:'/merchHierarchy/subclasses/'+deptId+'/'+ClassId,
		}
		result=$q.defer();
		dataService.httpRequest(config).then(
				function(response){
					console.log('getSubClasses ', response.data);
					result.resolve(response.data);
				},function(error){
					console.log(error);
					result.reject(error);
			});
		return result.promise
	}
	/*Subclasses - END*/
	return publicApi;
}]);