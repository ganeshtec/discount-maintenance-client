// Purpose is to build promotion data.
app.directive('systemGeneratedCodes', ['$filter', 'promotionDataService', 'DataFactory',
	function ($filter, promotionDataService, DataFactory){
	return {
		restrict: 'E',
		templateUrl: 'systemGeneratedCodes.html',
		scope: {
			data: '=',
			cdlength: '=',
			status: '=',
     		promoform: '=',
     		completed:"="
		},
		link: function(scope, $element, attrs){ 

			function getSystemGenrateCodes(data){
				var getPromotionPromise = promotionDataService.getSystemGenrateCodes(data);
				getPromotionPromise.then(
					function(data){
						scope.systemGenCodes = data.data.promoCodes;
						scope.uniquenumbercode = data.data.systemGen.numberOfUniqueCodes;
					},
					function(error){
						DataFactory.messageModal.message = error;
						DataFactory.messageModal.title = 'Error';
						$('#messageModal').popup();
					});
			}
		

			scope.getRequestData = function(data, cdlength){
				var requestData = {};
				if(!data.cdPrefix){
					data.cdPrefix = "";
				}
				if(!data.cdSuffix){
					data.cdSuffix = "";
				}
				if(!cdlength){
					cdlength = 1;
				}
			
				if(data && cdlength && data.uniqueCdCnt){
					data.cdPrefix = data.cdPrefix.toUpperCase();
					data.cdSuffix = data.cdSuffix.toUpperCase();
					requestData.systemGen = data;
					requestData.cdLength = cdlength;
					getSystemGenrateCodes(requestData)
				}
				return requestData;
			}
			// If has data get codes
  		    if (scope.data) {
		        scope.getRequestData(scope.data, scope.cdlength);
		    }

	}
}}])