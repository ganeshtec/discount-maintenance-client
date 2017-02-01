// Purpose is to build promotion code spec.
app.directive('purchaseConditionRewards', [ 'SourceData','customerSegmentDataService','DataFactory',
    function(SourceData,customerSegmentDataService,DataFactory) {
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
            	// Customer Segment JS code
            	console.log("Customer Segment");
            	var getCusSegmentPromise=customerSegmentDataService.getAllSegments();
				getCusSegmentPromise.then(
						function(data){
							scope.segmentListfromWebservice=data.segments;
							// START
							var objearraySize=scope.segmentListfromWebservice.length;
							scope.segmentDetails = [];
				        	for (var i = 0; i < objearraySize; i++) { 
				        		var segment = {};
				        			segment.name = scope.segmentListfromWebservice[i].name;
				        			segment.id = scope.segmentListfromWebservice[i].id;
				        			scope.segmentDetails.push(segment);
				        	}
				        	
							//END
						},
						function(error) {
							//scope.merchDataLoading=false;
							console.log("Segment Data not found from WS Call");
						}
				);
				
                scope.locationChange = function(){
                    if(scope.data.custSegment) {
                        console.log(scope.data.custSegment);
                    } else {
                        console.log("no customer segment selected")
                    }
                }

                scope.$watch('data.custSegment',function (){
                    if(scope.data.custSegment){
                    return scope.data.custSegment;
                    }

                });
				// End of Customer Segment

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
                	console.log("_______Before Method exceution Condition Rewards data in ::"+JSON.stringify(scope.data));
                	 if (scope.data.reward.details && scope.data.reward.details.length > 0) {
                    	console.log("_______in PCR.js execution :: scope.data.reward.details[0].qualUOM ::"+scope.data.reward.details[0].qualUOM);
                        scope.data.purchaseConds.qualUOM = scope.data.reward.details[0].qualUOM;
                        console.log("_______AFTER method exeution  Rewards  data in ::"+JSON.stringify(scope.data));
                    }
                }
                
              
                
                	
                
                 /*
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
                }*/
                	
              //  scope.promotionSubTypes = (DataFactory.promotionSubTypes) ? DataFactory.promotionSubTypes : getCustomerSegment();
             /*   
                function setCustomerSeg(){
                    if(scope.promotionSubTypes && scope.data  && scope.data.promoSubTypeCd){
                        $.each(scope.promotionSubTypes, function(i) {
                            if (scope.promotionSubTypes[i].promoSubTypeCd == scope.data.promoSubTypeCd) {
                                scope.promoSubTypeObject = scope.promotionSubTypes[i];
                            }
                        });
                    }
                }*/
                	
                
                

            }
        }
    }]);

