// Purpose is to build promotion data
app.directive('adminPromotionForm', ['promotionSubTypes','promotionDataService', 'redemptionMethodTypes', 'DataFactory', 'itemCategorySourceData',
    function(promotionSubTypes,promotionDataService, redemptionMethodTypes, DataFactory, itemCategorySourceData) {

        return {
            restrict: 'E',
            templateUrl: 'adminPromotionForm.html',
            scope: {
                data: '=',
                index: '=',
                preview: '@',
                isDisabled: '=',
                formHolder: "=",
            },
            link: function(scope, $element, attrs) {

                scope.viewProperties = {
                    displayPromoDescription: false,
                    displayStartTime: false,
                    displayEndTime: false
                }

                function getPomoSubTypes(){
                    var getPromotionPromise = promotionDataService.getPromotionSubTypes();
                    getPromotionPromise.then(
                        function(data) {
                            DataFactory.promotionSubTypes = data.promotionSubTypes;
                            scope.promotionSubTypes =  DataFactory.promotionSubTypes;
                        },
                        function(error) {
                            DataFactory.messageModal.message = error;
                            DataFactory.messageModal.title = 'Error';
                            $('#messageModal').popup();

                        });
                }
                scope.formHolder.form = scope.promoForm;
                // scope.promotionSubTypes = new promotionSubTypes();
                scope.promotionSubTypes = (DataFactory.promotionSubTypes) ? DataFactory.promotionSubTypes : getPomoSubTypes();



                function setPromotionSubType(){
                    if(scope.promotionSubTypes && scope.data  && scope.data.promoSubTypeCd){
                        $.each(scope.promotionSubTypes, function(i) {
                            if (scope.promotionSubTypes[i].promoSubTypeCd == scope.data.promoSubTypeCd) {
                                scope.promoSubTypeObject = scope.promotionSubTypes[i];
                            }
                        });
                    }
                }

                scope.$watch('data.promoSubTypeCd',function(){
                    setPromotionSubType();
                    if(scope.promoSubTypeObject && scope.promoSubTypeObject.promoSubTypeObject){
                       scope.getSelectedSubTypes();
                    }
                });
                scope.$watch('promotionSubTypes',function(){
                    setPromotionSubType();
                    if(scope.promoSubTypeObject && scope.promoSubTypeObject.promoSubTypeObject){
                       scope.getSelectedSubTypes();
                    }
                });
                scope.$watch('data.promoCdRqrd', function(model, oldModel){
                    if(model !== oldModel && !model){
                        delete scope.data.promoCdSpec;
                        console.log(scope.data);
                    }
                });
                function addSources(){
                	scope.data.purchaseConds.sources.push(new itemCategorySourceData());
                }


                scope.showMaximumDiscount = false;

                scope.getSelectedSubTypes = function() {
                    scope.data.promoSubTypeCd = scope.promoSubTypeObject.promoSubTypeCd;
                    scope.data.promoSubTypeDesc = scope.promoSubTypeObject.promoSubTypeDesc;
                    scope.data.promoType = scope.promoSubTypeObject.promoType;

                    console.log('getSelectedSubTypes: ', scope.data.promoSubTypeCd);
                    //AP-573-Promo validations - Buy A And B, get % off both
					if (scope.data.promoSubTypeCd.indexOf('MultipleItemsPercentDiscount') != -1 || scope.data.promoSubTypeCd.indexOf('MultipleItemsValueDiscount') != -1) {
                        scope.data.isSitewideDeal =  false;
					    scope.data.reward.type = (scope.data.promoSubTypeCd.indexOf('MultipleItemsPercentDiscount') != -1) ? 'PERCNTOFF' : 'AMTOFF';
    					if(scope.data.purchaseConds.sources.length <= 1){
    						addSources();
    					}
                    }else{
                    	scope.data.purchaseConds.sources.splice(1, 1);
                    }

                    if (scope.data.promoSubTypeCd.indexOf('Percent') != -1) {
                        scope.data.reward.type = 'PERCNTOFF';
                    } else {
                        scope.data.reward.type = 'AMTOFF';
                    }

                    if (scope.data.promoType === 'ORDERPROMO') {
                        if(scope.data.shortDesc || scope.data.longDesc){
                            DataFactory.messageModal.message = 'Short Description and Long Description were removed!';
                            DataFactory.messageModal.title = 'Warning';
                            $('#messageModal').popup();
                            scope.data.shortDesc = '';
                            scope.data.longDesc = '';
                        }
                        scope.data.reward.method = 'WHOLEORDER';
                    }
                }

                // redemtion method types
                scope.redemptionMethodTypes = new redemptionMethodTypes();


            }
        };
    }]);
