app.service('dashboardDataService', ['$http', '$q', 'dataService',
	function($http, $q, dataService, DataFactory){
	var publicApi = {};

	publicApi.getPromotionFromList= function(promotionData, promoID){
		var promoData;
		var promotion = promotionData.reduce(function(data, promo){
				if(promo.promotion.promoId === parseInt(promoID)){
					promoData = promo.promotion;
				}
				return data;
			}, {});

		return promoData;
	}

	return publicApi;
}]);