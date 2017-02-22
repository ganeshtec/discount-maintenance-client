/* 
	Data Service 
	Services that will handle data http request to web services
*/

app.service('promotionDataService', ['$http', '$q', 'dataService', 'DataFactory', 'itemLevelPercentOffData', 'itemLevelDollarOffData', 'promotionSubTypes', 'redemptionMethodTypes','SourceData',
	function($http, $q, dataService, DataFactory, itemLevelPercentOffData, itemLevelDollarOffData, promotionSubTypes, redemptionMethodTypes,SourceData){
	var publicApi = {};

	// Takes type to get promotion
	publicApi.getPromotionTest = function(type){
		var result = (type === 1) ? new itemLevelPercentOffData() : new itemLevelDollarOffData();
			return result;
	}

	// TODO We need service to get promotion subtypes
	publicApi.getPromotionSubTypes = function(){
		var config = {
				method: 'GET',
				url: '/promotionTypes/promotionSubTypes/adminUI.json',

			},
			result = $q.defer();
		dataService.httpRequest(config).then(
			function(response){
	
				result.resolve(response.data);
			},function(error){

				result.reject(error);
		});
		// result.resolve(new promotionSubTypes());
		return result.promise;
	}

	// TODO We need service to get redemtion types
	publicApi.getRedemptionMethodTypes = function(){
		return new redemptionMethodTypes();
	}

	// Takes data to get promotion, Test if recieves data and promise resolve
	publicApi.getPromotionByID = function(id){
		var config = {
				method: 'GET',
				url: '/cartPromotions/' + id,
			},
			result = $q.defer();
			dataService.httpRequest(config).then(
				function(response){

					result.resolve(response.data);
					//result.resolve(new SourceData());
				},function(error){

					result.reject(error);
			});
			return result.promise;
	}

	// Takes sections, Test return section flagged as active
	publicApi.getSection = function(sections){
		var section = $.grep(sections, function(e){return e.isActive === true;});
		return section[0] || {};
	}

	publicApi.getSystemGenrateCodes = function(data){
		var config = {
				method: 'POST',
				url: '/couponRequest/preview',
				data: data
				
			},
			result = $q.defer();
			dataService.httpRequest(config).then(
				function(response){

					result.resolve(response);
				},function(error){

					result.reject(error);
			});
			return result.promise;
	}

		// Takes data to get promotion, Test if recieves data and promise resolve
	publicApi.saveAsDraft = function(data){
		var config = {
				method: 'POST',
				url: '/cartPromotionsRequest',
				data: data
			},
			result = $q.defer();
			dataService.httpRequest(config).then(
				function(response){

					result.resolve(response);
				},function(error){

					result.reject(error);
			});
			return result.promise;
	}
	
	publicApi.validate = function(data){
		var config = {
			method: 'POST',
			url: '/cartPromotionsRequest/validate',
			data: data
		},
		result = $q.defer();
		dataService.httpRequest(config).then(
			function(response){

				result.resolve(response);
			},function(error){

				result.reject(error);
		});
		return result.promise;
	}
	// sumit promotion
 	publicApi.submit = function(data){

 

 		var config = {
 				method: 'POST',
 				url: '/cartPromotionsRequest/approve',
 				data: data
 			},
 			result = $q.defer();
 
 		dataService.httpRequest(config).then(
 			function(response){

   				    result.resolve(response);
 				},function(error){

 					result.reject(error);
 			});
 			return result.promise;
 	}

		// sumit promotion
	publicApi.submit = function(data){


		var config = {
				method: 'POST',
				url: '/cartPromotionsRequest/approve',
				data: data
			},
			result = $q.defer();

			dataService.httpRequest(config).then(
				function(response){

					result.resolve(response);
				},function(error){

					result.reject(error);
			});
			return result.promise;
	}

	publicApi.getPromotions = function(promoname , page ,size,status,promoTypeCd,sortby,order){
		var query = {};
		query.criteria = {};
		query.criteria.term = promoname;
		query.criteria.page ={};
		query.criteria.page.page = page || 0;
		query.criteria.page.size = size || 5;
		if(status && status!= "all"){
			query.criteria.status = status;
		}
		if(promoTypeCd && promoTypeCd!="all"){
			query.criteria.promoSubTypeCd = promoTypeCd; 	
		}
		if(sortby && sortby!="none"){
			query.criteria.sort = {};
			query.criteria.sort.sortBy = sortby;
			query.criteria.sort.isAsc = (order =='asc');
		}
		var config = {
				method: 'POST',
				url: "/search", 
				data: query
			},
			result = $q.defer();
		dataService.httpRequest(config).then(
			function(response){
			
				result.resolve(response.data);
			},function(error){

				result.reject(error);
		});

		return result.promise;
	},
	publicApi.deactivate = function(id){ 
		var payload = {
  			"content": [id]
		} 
		var config = {
			method: 'POST', 
			url: "/cartPromotions/deactivate",
			data : payload
		},
		result = $q.defer();
		dataService.httpRequest(config).then(
			function(response){
				
				result.resolve(response.data);
			}, function(error){
				
				result.reject(error);
			}
		);
		return result.promise;
	},
 	publicApi.getPromotionSubTypes = function(){
		var config = {
				method: 'GET',
				url: '/promotionTypes/promotionSubTypes/adminUI.json',

			},
			result = $q.defer();
		dataService.httpRequest(config).then(
			function(response){
				
				result.resolve(response.data);
			},function(error){

				result.reject(error);
		});
		// result.resolve(new promotionSubTypes());
		return result.promise;
	},
	publicApi.savePromotions = function(promotions){
		var request = {};
		request.content = promotions;
		var config = {
				method: 'POST',
				url: "/multipleCartPromotionRequests",
				data: request
			},
			result = $q.defer();
		dataService.httpRequest(config).then(
			function(response){
				
				result.resolve(response.data);
			},function(error){
				
				result.reject(error);
		});
		return result.promise;
	},
	publicApi.delete = function(promotions){
		var request = {};
		request.content = promotions;
		var config = {
				method: 'POST',
				url: "/delete",
				data: request
			},
			result = $q.defer();
		dataService.httpRequest(config).then(
			function(response){

				result.resolve(response.data);
			},function(error){

				result.reject(error);
		});
		return result.promise;
	},
	publicApi.getAllStatus = function(){
		var config = {
				method: 'GET',
				url: "/promotionStatus/all.json",
			},
			result = $q.defer();
		dataService.httpRequest(config).then(
			function(response){
				result.resolve(response.data);
			},function(error){
				result.reject(error);
		});
		return result.promise;
	},
	publicApi.codeGenStatus = function(id){
		var config = {
				method: 'GET',
				url: "/couponRequestStatus/"+id,
			},
			result = $q.defer();
		dataService.httpRequest(config).then(
			function(response){
				result.resolve(response.data);
			},function(error){
				result.reject(error);
		});
		return result.promise;
	}

	return publicApi;
}]);