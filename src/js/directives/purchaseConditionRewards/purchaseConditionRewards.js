// Purpose is to build promotion code spec.
app.directive('purchaseConditionRewards', [ 'SourceData',
    function(SourceData) {
        return {
            restrict: 'E',
            templateUrl: 'purchaseConditionRewards.html',
            scope: {
                data: '=',
                promoform: '=',
                preview: '=',
                isDisabled: '='
            },
            
            link: function(scope, elem, attr) {

                scope.alphabet = "ABCDEFGHIJKLMNOPQRSTUVWXYZ".split('');
                
                if (scope.data && scope.data.purchaseConds && scope.data.purchaseConds.sources && scope.data.purchaseConds.sources.length === 0) {
                    
                    if(scope.data.promoSubTypeCd === 'MultipleItemsPercentDiscount' || scope.data.promoSubTypeCd === 'MultipleItemsValueDiscount') {
                         scope.data.purchaseConds.sources.push(new SourceData());
                        scope.data.purchaseConds.sources.push(new SourceData());
                    } else{
                        scope.data.purchaseConds.sources.push(new SourceData());
                    }
                   
                }
                
                if (scope.data && scope.data.purchaseConds && scope.data.purchaseConds.sources && scope.data.purchaseConds.sources.length === 1) {
                    if(scope.data.promoSubTypeCd === 'MultipleItemsPercentDiscount' || scope.data.promoSubTypeCd === 'MultipleItemsValueDiscount') {
                         scope.data.purchaseConds.sources.push(new SourceData());
                        
                    }
                   
                }
               

               
                
                scope.initializePurchaseOption = function(index,item,data){                	
                     
                    if(data.purchaseConds.sources[index].purchaseoption == 'category'){
                         
                    	data.purchaseConds.sources[index].purchaseoption =  'category'
                    }
                    else if(data.purchaseConds.sources[index].purchaseoption == 'itemoms'){

                          
                    	data.purchaseConds.sources[index].purchaseoption = 'itemoms'
                    }
                     else if(item.inclusions.partnumbers != null && item.inclusions.partnumbers.length > 0){
                          
                           if(item.inclusions.itemtype == 'OMS') {
                               data.purchaseConds.sources[index].purchaseoption = 'itemoms'
                           } else  if(item.inclusions.itemtype == 'SKU') {
                               data.purchaseConds.sources[index].purchaseoption = 'itemsku'
                           } else{
                                
                    	        data.purchaseConds.sources[index].purchaseoption =  'category'
                            }   
                    	
                     }
                    else if(item.inclusions.hierarchies != null && item.inclusions.hierarchies.length > 0){
                          
                    	data.purchaseConds.sources[index].purchaseoption = 'category'
                    } 
                    else{
                         
                    	data.purchaseConds.sources[index].purchaseoption =  'category'
                    }                   

                }
                
                if (scope.data) {
                    

                    if (scope.data.purchaseConds.qualUOM == null && scope.data.reward.details && scope.data.reward.details.length > 0) {
                        scope.data.purchaseConds.qualUOM = scope.data.reward.details[0].qualUOM;
                    }
                }

            }
        }
    }]);

