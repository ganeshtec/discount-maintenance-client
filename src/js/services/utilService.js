/* 
	State Service 
	Services that will handle setting common state of ui properties
*/

app.service('utilService', ['$filter', function($filter){
	var publicApi = {};
    var rewardMethodMappoing = {
        "ProductLevelPercentDiscount":"ALLAFFECTEDITMS",
        "CategoryLevelValueDiscount":"ALLAFFECTEDITMS",
        "ProductLevelValueDiscount":"ALLAFFECTEDITMS",
        "CategoryLevelPercentDiscount":"ALLAFFECTEDITMS",
        "MultipleItemsPercentDiscount":"ALLAFFECTEDITMS",
        "ProductLevelPWPPercentDiscount":"ALLAFFECTEDITMS",
        "ProductLevelSameItemPercentDiscount":"ALLAFFECTEDITMS",
        "ProductLevelBuyXGetYFree":"ALLAFFECTEDITMS",
        "OrderLevelValueDiscount":"WHOLEORDER",
        "OrderLevelPercentDiscount":"WHOLEORDER",
        "ProductLevelPerItemValueDiscount":"INDVDLAFFECTEDITMS",
        "ProductLevelPerItemPercentDiscount":"INDVDLAFFECTEDITMS",
        "MultipleItemsValueDiscount":"ALLAFFECTEDITMS"
        
    }

    publicApi.canSaveAsDraft = function(promotion){
        //these promotions can be saved as draft
        var save = {
            "20" : true, // draft
            "72" : true, // complete with erros/warning
        }
        return save[promotion.status]
    } 
    publicApi.canApprove = function(promotion){
        //these promotions can be submitted for apporval
        var approve = {
            "20" : true, // draft
            "72" : true, // complete with erros/warning
            "61" : true, // active
            "57" : true, // pending
        }
        return approve[promotion.status]
    }           
    publicApi.needsValidation = function(promotion){
        //these promoitons need to be validated before being saved as draftand submitted 
        var validate = {
            "61" : true, // active
            "57" : true, // pending
        }
        return validate[promotion.status]
    }  
    //Massage data to match the promotion request
    publicApi.transformPromotionRequest = function(promotion){
        if(promotion.promoCdSpec) {
            if(!promotion.promoCdSpec.systemGen && !promotion.promoCdSpec.promoCodes){
                 delete promotion.promoCdSpec;
            }   
        }
        /**
        if(!promotion.meta.createdBy || promotion.meta.createdBy == null){
            promotion.meta.createdBy = "PROMO_ADMIN_UI"
        }
        **/
        if(!promotion.meta.action || promotion.meta.action == null){
            promotion.meta.action = "create";
        }else if(promotion.meta.action ){
            if(promotion.meta.action !="create" &&promotion.meta.action !="update"  && promotion.meta.action !="update"){
                //this bolckis to correct old data in QA , should not happen in production       
                if(promotion.promoId){
                     promotion.meta.action = "update";
                }else{
                    promotion.meta.action = "create";
                }        
            }
        }        
        //TODO:  move this to backend this field is not showed anywhere in the UI
        if(promotion.reward){
            promotion.reward.method = rewardMethodMappoing[promotion.promoSubTypeCd];
        }
        /**
        //TODO: check if this is right
        if((promotion.meta && promotion.meta.lastUpdatedTS) == null){
            promotion.meta.lastUpdatedTS = new Date();
        }
        //TODO set from cookie
        if((promotion.meta && promotion.meta.lastupdatedUser) == null){
            promotion.meta.lastupdatedUser = "PROMO_ADMIN_UI";
        }
        **/
        if (promotion.promoSubTypeCd.indexOf('Percent') != -1) {
                promotion.reward.type = 'PERCNTOFF';
        } else {
                promotion.reward.type = 'AMTOFF';
        }
           
        /**
        if(promotion.purchaseConds && !promotion.purchaseConds.qualUOM){
            promotion.purchaseConds.qualUOM = "Amount";
        }
        **/
        if(promotion.purchaseConds){
            if(promotion.purchaseConds.targets && promotion.purchaseConds.targets.length == 0){
                delete promotion.purchaseConds.targets;
            }
            if(promotion.purchaseConds.sources && promotion.purchaseConds.sources.length == 0){
                delete promotion.purchaseConds.sources;
            }
        }
        if(promotion.purchaseConds){
            promotion.purchaseConds.isInclusionsOrExclusionsExist = false;
            //No promotions with targets for now
            promotion.purchaseConds.isTargetExist = false;
            var sources = promotion.purchaseConds.sources;  
            if(sources && sources[0]){ 
                if(sources[0].inclusions){
                    var hasInc = false;
                    if(sources[0].inclusions.partnumbers && sources[0].inclusions.partnumbers.length>0){
                        promotion.purchaseConds.isInclusionsOrExclusionsExist = true;
                        hasInc = true;
                    }
                    if(sources[0].inclusions.hierarchies && sources[0].inclusions.hierarchies.length>0){
                        promotion.purchaseConds.isInclusionsOrExclusionsExist = true;
                        hasInc = true; 
                    }
                     if(!hasInc){
                        delete sources[0].inclusions;
                    }
                }
                if(sources && sources[0].exclusions){
                    var hasExc = false;
                    if(sources[0].exclusions.partnumbers && sources[0].exclusions.partnumbers.length>0){
                        promotion.purchaseConds.isInclusionsOrExclusionsExist = true;
                        hasExc = true;
                    }
                    if(sources[0].exclusions.hierarchies && sources[0].exclusions.hierarchies.length>0){
                        promotion.purchaseConds.isInclusionsOrExclusionsExist = true;
                        hasExc = true;
                    }
                    if(!hasExc){
                        delete sources[0].exclusions;
                    }
                }
            }
            //No promotions with targets for now
            delete promotion.purchaseConds.targets
    }
        if (promotion.reward && promotion.reward.details) {
            publicApi.calculatePurchaseCondition(promotion);
        }
        
        //check to validate items and category
        
        if(promotion.startDt){
            promotion.startDt=promotion.startDt.split(" ")[0] + " 03:00:00";
        }
          if(promotion.endDt){
            promotion.endDt=promotion.endDt.split(" ")[0] + " 02:59:59";
        }
       
        publicApi.validateItemCategory(promotion);

    }  
    
    
    publicApi.validateItemCategory = function(data) {


        var sources = data.purchaseConds.sources;
        if (sources && sources.length > 0 ) {
            for (var i = 0; i < sources.length; i++) {
                var purchaseOption = sources[i].purchaseoption;
                
                if ( sources[i].inclusions && sources[i].inclusions.partnumbers && purchaseOption == 'category') {
                    sources[i].inclusions.partnumbers = []; //setting Item OMS id empty if user select category radio button
                } else  if ( sources[i].inclusions && sources[i].inclusions.partnumbers && purchaseOption == 'itemoms'){
                    sources[i].inclusions.hierarchies = []; //setting Item OMS id empty if user select Item OMS radio button
                }
               // delete sources[i].purchaseoption;

            }



        }


    }
    
    publicApi.convertStringToInteger = function(data) {

        $(data.reward.details).each(function(i, val) {
            data.reward.details[i].min = parseFloat(data.reward.details[i].min);

        });


    }


	// Method to deactivate all sections, expected to have property .isActive
	publicApi.calculatePurchaseCondition = function(data){
        publicApi.convertStringToInteger(data);
        console.log("cal rewards ==>", data.reward.details);
        data.reward.details = $filter('orderBy')(data.reward.details, 'min');
        console.log("cal rewards after sort==>", data.reward.details);

        var minPurchaseQty= -1;
		$(data.reward.details).each(function(i, val){
            
            var detailsObject1 = data.reward.details[i];
            
            minPurchaseQty = data.reward.details[0].min;
            // if( detailsObject1.min <minPurchaseQty  || minPurchaseQty == -1 ){
            //     console.log(" the min prucahse qts --->"+detailsObject1.min);
            //     console.log(" the min prucahse qtsminPurchaseQty --->"+minPurchaseQty);
            //     minPurchaseQty = detailsObject1.min;
            // }
            var maxValue ;
            if(data.reward.details.length == (i+1)){
                maxValue = -1;
                //detailsObject1.seq = i+1; // to set seq only for last element in array
            } else {
              
            var detailsObject2 = data.reward.details[i+1];
            var currValue = detailsObject1.min;
            var nextValue = detailsObject2.min;
             maxValue = nextValue -1 ;
            if(data.purchaseConds.qualUOM == 'Amount'){
               
                 maxValue = Math.round((nextValue - 0.01) *100) /100;
                
            }
            
            }
           
                        //TODO: remove for testing
            //detailsObject1.min = 1;
            
            detailsObject1.max = maxValue;
            detailsObject1.seq = i+1;
            detailsObject1.qualUOM = data.purchaseConds.qualUOM;
            console.log("cal details ==>",data.reward.details);
		});
        
         

        if(data.purchaseConds && data.purchaseConds.sources){
            $(data.purchaseConds.sources).each(function(i, source){
                if (data.purchaseConds.qualUOM == "Quantity") {
                    delete source.minTotalPrice;

                    if (source.minPurchaseQty == null) {
                        source.minPurchaseQty = minPurchaseQty;
                    }

                }else{
                    delete  source.minPurchaseQty;
                    source.minTotalPrice = minPurchaseQty; 
                }
            } )
        }
        
        
        if (data.promoSubTypeCd === 'MultipleItemsValueDiscount' || data.promoSubTypeCd === 'MultipleItemsPercentDiscount') {
            if (data.purchaseConds.sources && data.purchaseConds.sources.length > 0) {

                if (data.purchaseConds.sources[0].minPurchaseQty && data.purchaseConds.sources[1].minPurchaseQty) {
                    data.reward.details[0].min = data.purchaseConds.sources[0].minPurchaseQty + data.purchaseConds.sources[1].minPurchaseQty;
                    data.reward.details[0].max = -1;
                }
            }

        }
        
        
		return data;
	}

    var checkEmpty = function(field){
        if(!field || !field.trim(0))
            return true
        return false;
    } 

    publicApi.requiredFieldsMissing = function(promotion){
        return checkEmpty(promotion.name) || checkEmpty(promotion.startDt)|| checkEmpty(promotion.endDt)||  checkEmpty(promotion.promoSubTypeCd) || promotion.purchaseConds.locations.length == 0; 
    }
    publicApi.invalidSysGenCode = function(promotion){
        if(promotion && promotion.promoCdSpec && promotion.promoCdSpec.systemGen){
            var syscode = promotion.promoCdSpec.systemGen;
            var len = promotion.promoCdSpec.cdLength || '0';
            var cdPrefix = syscode.cdPrefix || '';
            var cdSuffix = syscode.cdSuffix || '';
            var total = parseInt(len) + cdPrefix.length +cdSuffix.length;
            if(total <9){
                return true;
            }
        }
        return false;
    }

    publicApi.validateBuyAandB = function(promotion) {
       
       if(promotion.promoSubTypeCd != 'MultipleItemsValueDiscount' && promotion.promoSubTypeCd != 'MultipleItemsPercentDiscount') {
           return null;
       }
       
        var iserror = false;
        for (var i = 0; i < promotion.purchaseConds.sources.length; i++) {


            if (promotion.purchaseConds.sources[i].inclusions && promotion.purchaseConds.sources[i].inclusions.partnumbers && promotion.purchaseConds.sources[i].inclusions.partnumbers.length === 0 && promotion.purchaseConds.sources[i].inclusions.hierarchies && promotion.purchaseConds.sources[i].inclusions.hierarchies.length === 0) {

                if (promotion.purchaseConds.sources[i].exclusions && promotion.purchaseConds.sources[i].exclusions.partnumbers && promotion.purchaseConds.sources[i].exclusions.partnumbers.length === 0 && promotion.purchaseConds.sources[i].exclusions.hierarchies && promotion.purchaseConds.sources[i].exclusions.hierarchies.length === 0) {
                    iserror = true;
                }
            }
        }

        if (iserror) {
            return 'ERROR: Item A and Item B is mandatory ,Please add atleast 1 item or 1 category that qualifies for promotion.';
        } else {
            return null;
        }


    }

    publicApi.setDefaultsForSaveAsDraft = function(promotion){
        if(promotion.promoCdRqrd == null){
            promotion.promoCdRqrd = true;
        }
        if(promotion.isSitewideDeal == null){
            promotion.isSitewideDeal = true;
        }               
        if(promotion.exclsve == null){
            promotion.exclsve = 0;
        }
        if(promotion.expireDtExtDays == null){
            promotion.expireDtExtDays = 0;
        }
        //  set status as draft expect when status is pending or active
        if( !publicApi.needsValidation(promotion) ){
            promotion.status = 20;
        }
        if(promotion.promoSubTypeCd == null){
            promotion.promoSubTypeCd = 20;
        }               
        if(promotion.promoTypeCd == null){
            promotion.promoTypeCd = 10;
        } 
    }
	return publicApi;
	
}]);