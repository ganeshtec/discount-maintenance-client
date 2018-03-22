app.service('utilService', ['$filter', 'leadTimeService','loginService', function ($filter, leadTimeService,loginService) {
    var publicApi = {};
    this.leadTime;
    publicApi.rewardMethodMapping = {
        'ProductLevelPercentDiscount': 'ALLAFFECTEDITMS',
        'CategoryLevelValueDiscount': 'ALLAFFECTEDITMS',
        'ProductLevelValueDiscount': 'ALLAFFECTEDITMS',
        'CategoryLevelPercentDiscount': 'ALLAFFECTEDITMS',
        'MultipleItemsPercentDiscount': 'ALLAFFECTEDITMS',
        'ProductLevelPWPPercentDiscount': 'ALLAFFECTEDITMS',
        'ProductLevelSameItemPercentDiscount': 'ALLAFFECTEDITMS',
        'ProductLevelBuyXGetYFree': 'ALLAFFECTEDITMS',
        'OrderLevelValueDiscount': 'WHOLEORDER',
        'OrderLevelPercentDiscount': 'WHOLEORDER',
        'ProductLevelPerItemValueDiscount': 'INDVDLAFFECTEDITMS',
        'ProductLevelPerItemPercentDiscount': 'INDVDLAFFECTEDITMS',
        'MultipleItemsValueDiscount': 'ALLAFFECTEDITMS'
    }

    publicApi.canSaveAsDraft = function (promotion) {
        //these promotions can be saved as draft
        var save = {
            '20': true, // draft
            '72': true, // complete with erros/warning
        }
        return save[promotion.status]
    }
    publicApi.canApprove = function (promotion) {
        //these promotions can be submitted for apporval
        var approve = {
            '20': true, // draft
            '72': true, // complete with erros/warning
            '61': true, // active
            '57': true, // pending
        }
        return approve[promotion.status]
    }
    publicApi.convertDateStringToDate = function (dateString) {
        return dateString ? moment(dateString).startOf('date').toDate() : undefined;
    }

    publicApi.convertDateToDateString = function (date) {
        return date ? moment(date).format('YYYY-MM-DD') : undefined;
    }

    publicApi.needsValidation = function (promotion) {
        //these promoitons need to be validated before being saved as draftand submitted
        var validate = {
            '61': true, // active
            '57': true, // pending
        }
        return validate[promotion.status]
    }
    publicApi.isPromotionActive = function (promotion) {
        // Checks if promotion has status 61: active
        return promotion.status === 61 ? true : false;
    }
    //Massage data to match the promotion request
    publicApi.transformPromotionRequest = function (promotion) {
        if (promotion.promoCdSpec) {
            if (!promotion.promoCdSpec.systemGen && !promotion.promoCdSpec.promoCodes) {
                delete promotion.promoCdSpec;
            }
        }

        if (!promotion.meta.action || promotion.meta.action == null) {
            promotion.meta.action = 'create';
        } else if (promotion.meta.action) {
            if (promotion.meta.action != 'create' && promotion.meta.action != 'update' && promotion.meta.action != 'update') {
                //this bolckis to correct old data in QA , should not happen in production
                if (promotion.promoId) {
                    promotion.meta.action = 'update';
                } else {
                    promotion.meta.action = 'create';
                }
            }
        }
        //TODO:  move this to backend this field is not showed anywhere in the UI
        if (promotion.reward && !promotion.reward.method) {
            promotion.reward.method = publicApi.rewardMethodMapping[promotion.promoSubTypeCd];
        }

        if (loginService.getCurrentUserRole() === 229) {
            if (promotion.promoSubTypeCd.indexOf('Percent') != -1) {
                promotion.reward.type = 'PERCNTOFF';
            } else {
                promotion.reward.type = 'AMTOFF';
            }
        }

        if (promotion.purchaseConds) {
            if (promotion.purchaseConds.targets && promotion.purchaseConds.targets.length === 0) {
                delete promotion.purchaseConds.targets;
            }
            if (promotion.purchaseConds.sources && promotion.purchaseConds.sources.length === 0) {
                delete promotion.purchaseConds.sources;
            }
        }
        if (promotion.purchaseConds) {
            promotion.purchaseConds.isInclusionsOrExclusionsExist = false;
            //No promotions with targets for now
            promotion.purchaseConds.isTargetExist = false;
            var sources = promotion.purchaseConds.sources;
            if (sources && sources[0]) {
                if (sources[0].inclusions) {
                    var hasInc = false;
                    if (sources[0].inclusions.partnumbers && sources[0].inclusions.partnumbers.length > 0) {
                        promotion.purchaseConds.isInclusionsOrExclusionsExist = true;
                        hasInc = true;
                    }
                    if (sources[0].inclusions.hierarchies && sources[0].inclusions.hierarchies.length > 0) {
                        promotion.purchaseConds.isInclusionsOrExclusionsExist = true;
                        hasInc = true;
                    }
                    if (!hasInc) {
                        delete sources[0].inclusions;
                    }
                }
                if (sources && sources[0].exclusions) {
                    var hasExc = false;
                    if (sources[0].exclusions.partnumbers && sources[0].exclusions.partnumbers.length > 0) {
                        promotion.purchaseConds.isInclusionsOrExclusionsExist = true;
                        hasExc = true;
                    }
                    if (sources[0].exclusions.hierarchies && sources[0].exclusions.hierarchies.length > 0) {
                        promotion.purchaseConds.isInclusionsOrExclusionsExist = true;
                        hasExc = true;
                    }
                    if (sources[0].exclusions.attrs && sources[0].exclusions.attrs.length > 0) {
                        promotion.purchaseConds.isInclusionsOrExclusionsExist = true;
                        hasExc = true;
                    }
                    if (!hasExc) {
                        delete sources[0].exclusions;
                    } else {
                        delete sources[0].exclusions.initializeSkuTypeExclusions;
                    }
                }
            }

            //No promotions with targets for now
            delete promotion.purchaseConds.targets
        }
        if (promotion.reward && promotion.reward.details) {
            publicApi.calculatePurchaseCondition(promotion);
        }

        if (promotion.startDt) {
            promotion.startDt = publicApi.convertDateToDateString(promotion.startDt) + ' 03:00:00';
        }

        if (promotion.endDt) {
            promotion.endDt = publicApi.convertDateToDateString(promotion.endDt) + ' 02:59:59';

        }

        publicApi.validateItemCategory(promotion);

    }

    publicApi.convertDateToDateString = function (date) {
        return date ? moment(date).format('YYYY-MM-DD') : undefined;
    }

    publicApi.validateItemCategory = function (data) {


        var sources = data.purchaseConds.sources;
        if (sources && sources.length > 0) {
            for (var i = 0; i < sources.length; i++) {
                var purchaseOption = sources[i].purchaseoption;
                if (sources[i].exclusions && sources[i].exclusions.attrs && purchaseOption != 'category') {
                    sources[i].exclusions.attrs = []; //Setting attrs to empty if user does not select category
                }
                if (sources[i].inclusions && sources[i].inclusions.partnumbers && purchaseOption == 'category') {
                    sources[i].inclusions.partnumbers = []; //setting Item OMS id empty if user select category radio button
                } else if (sources[i].inclusions && sources[i].inclusions.hierarchies && purchaseOption != 'category') {
                    sources[i].inclusions.hierarchies = []; //setting Item OMS id empty if user selection is not category radio button
                }

            }
        }
    }

    publicApi.convertStringToInteger = function (data) {

        $(data.reward.details).each(function (i) {
            data.reward.details[i].min = parseFloat(data.reward.details[i].min);

        });


    }


    // Method to deactivate all sections, expected to have property .isActive
    publicApi.calculatePurchaseCondition = function (data) {
        publicApi.convertStringToInteger(data);

        data.reward.details = $filter('orderBy')(data.reward.details, 'min');


        var minPurchaseQty = -1;
        $(data.reward.details).each(function (i) {

            var detailsObject1 = data.reward.details[i];

            minPurchaseQty = data.reward.details[0].min;

            var maxValue;
            if (data.reward.details.length == (i + 1)) {
                maxValue = -1;

            } else {

                var detailsObject2 = data.reward.details[i + 1];
                var nextValue = detailsObject2.min;
                maxValue = nextValue - 1;
                if (data.purchaseConds.qualUOM == 'Amount') {
                    maxValue = Math.round((nextValue - 0.01) * 100) / 100;
                }
            }

            detailsObject1.max = maxValue;
            detailsObject1.seq = i + 1;
            detailsObject1.qualUOM = data.purchaseConds.qualUOM;

        });

        if (data.purchaseConds && data.purchaseConds.sources) {
            $(data.purchaseConds.sources).each(function (i, source) {
                if (data.purchaseConds.qualUOM == 'Quantity') {
                    delete source.minTotalPrice;
                    if (data.promoSubTypeCd != 'MultipleItemsPercentDiscount' && data.promoSubTypeCd != 'MultipleItemsValueDiscount') {
                        source.minPurchaseQty = minPurchaseQty;
                    }
                } else {
                    delete source.minPurchaseQty;
                    source.minTotalPrice = minPurchaseQty;
                }
            })
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
    var checkEmpty = function (field) {
        if (!field || field.toString().trim().length == 0) {
            return true
        } else {
            return false;
        }
    }

    publicApi.requiredLocationsOrMarkets = function (promotion) {
        return ((promotion.purchaseConds.locations === null || promotion.purchaseConds.locations.length == 0)
            && (promotion.purchaseConds.markets === null || promotion.purchaseConds.markets.length == 0));
    }


    publicApi.requiredFieldsMissing = function (promotion) {
        if (loginService.getCurrentUserRole() === 229) {
            if (checkEmpty(promotion.name) || checkEmpty(promotion.startDt) || checkEmpty(promotion.endDt) || checkEmpty(promotion.promoSubTypeCd)) {
                return true;
            }
        }
        else {
            if (checkEmpty(promotion.name) || checkEmpty(promotion.startDt) || checkEmpty(promotion.endDt)) {
                return true;
            }
        }
        return false;

    }

    publicApi.invalidSysGenCode = function (promotion) {
        if (promotion && promotion.promoCdSpec && promotion.promoCdSpec.systemGen) {
            var syscode = promotion.promoCdSpec.systemGen;
            var len = promotion.promoCdSpec.cdLength || '0';
            var cdPrefix = syscode.cdPrefix || '';
            var cdSuffix = syscode.cdSuffix || '';
            var total = parseInt(len) + cdPrefix.length + cdSuffix.length;
            if (total < 9) {
                return true;
            }
        }
        return false;
    }

    publicApi.validateBuyAandB = function (promotion) {

        if (promotion.promoSubTypeCd != 'MultipleItemsValueDiscount' && promotion.promoSubTypeCd != 'MultipleItemsPercentDiscount') {
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

    publicApi.validateBuyAandBOverlap = function (promotion) {

        function intersect(a, b) {
            var t;
            if (b.length > a.length) t = b, b = a, a = t; // indexOf to loop over shorter
            return a.filter(function (e) {
                return b.indexOf(e) > -1;
            });
        }

        if (promotion.promoSubTypeCd != 'MultipleItemsValueDiscount' && promotion.promoSubTypeCd != 'MultipleItemsPercentDiscount') {
            return null;
        }

        if (promotion.purchaseConds.sources.length > 1) {
            if (promotion.purchaseConds.sources[0].inclusions && promotion.purchaseConds.sources[1].inclusions) {

                //Check products for overlap
                if (promotion.purchaseConds.sources[0].inclusions.partnumbers && promotion.purchaseConds.sources[0].inclusions.partnumbers.length > 0) {
                    if (promotion.purchaseConds.sources[1].inclusions.partnumbers && promotion.purchaseConds.sources[1].inclusions.partnumbers.length > 0) {
                        var itemsOverlap = intersect(promotion.purchaseConds.sources[0].inclusions.partnumbers, promotion.purchaseConds.sources[1].inclusions.partnumbers);
                        if (itemsOverlap.length > 0) {
                            return 'ERROR: A and B groups cannot contain the same products';
                        }
                    }
                }

                //Check categories for overlap
                if (promotion.purchaseConds.sources[0].inclusions.hierarchies && promotion.purchaseConds.sources[0].inclusions.hierarchies.length > 0) {
                    if (promotion.purchaseConds.sources[1].inclusions.hierarchies && promotion.purchaseConds.sources[1].inclusions.hierarchies.length > 0) {

                        var h1 = promotion.purchaseConds.sources[0].inclusions.hierarchies.map(function (a) { return a.id; });
                        var h2 = promotion.purchaseConds.sources[1].inclusions.hierarchies.map(function (a) { return a.id; });

                        var overlap = intersect(h1, h2);
                        if (overlap.length > 0) {
                            return 'ERROR: A and B groups cannot contain the same product categories';
                        }
                    }
                }
            }
        }

        return null;
    }


    publicApi.setDefaultsForSaveAsDraft = function (promotion) {
        if (promotion.promoCdRqrd == null) {
            promotion.promoCdRqrd = true;
        }
        if (promotion.isSitewideDeal == null) {
            promotion.isSitewideDeal = true;
        }
        if (promotion.exclsve == null) {
            promotion.exclsve = 0;
        }
        if (promotion.expireDtExtDays == null) {
            promotion.expireDtExtDays = 0;
        }
        //  set status as draft expect when status is pending or active
        if (!publicApi.needsValidation(promotion)) {
            promotion.status = 20;
        }
        if (promotion.promoSubTypeCd == null) {
            promotion.promoSubTypeCd = 20;
        }
        if (promotion.promoTypeCd == null) {
            promotion.promoTypeCd = 10;
        }
        if (loginService.getCurrentUserRole() === 228) {
            if (promotion.reward.reasonCode != 70) {
                promotion.reward.reasonCode = 49;
            }
            promotion.promoSubTypeCd = 'TypeLessDiscount';
            promotion.promoSubTypeDesc = 'TypeLess-Discounts';
        }
    }

    publicApi.isSubmitEligibleForDisable = function (promotion) {

        var leadTimePromise = leadTimeService.fetchLeadTime();
        return leadTimePromise.then(function (leadTime) {
            var minDt = moment(promotion.endDt).subtract(leadTime, 'days');
            if (moment().isAfter(minDt) && promotion.status == 61 && promotion.printLabel === true) {
                return true;
            }
            return false;
        });
    }

    publicApi.isPreviewSubmitClickDisabled = function (promotion) {

        //  var leadTimePromise = leadTimeService.fetchLeadTime();
        // return leadTimePromise.then(function (leadTime) {
        //      var minDt = moment(promotion.endDt).subtract(leadTime, 'days');
        if (promotion.status == 61 && promotion.originalPrintLabel === true) {
            return true;
        }
        return false;

    }

    publicApi.getLeadTime = function () {
        return leadTimeService.fetchLeadTime();
    }

    publicApi.isLabelLocked = function (promotion) {
        return publicApi.isPromotionActive(promotion) && promotion.originalPrintLabel == true;
    }

    publicApi.updatePrintLabel = function (promotion) {
        /* Code to fix clearing of label text while editing active promotion that has an active label
           pending bug fix request.

        if ((!publicApi.isLabelLocked(promotion)) && publicApi.isPrintLabelDisabled(promotion)) {
        */
        if (publicApi.isPrintLabelDisabled(promotion) && !publicApi.isLabelLocked(promotion)) {
            promotion.printLabel = false;
            promotion.labelText = '';
        }
    }

    publicApi.hasPosChannel = function (promotion){
        return promotion.channels && (promotion.channels.indexOf(87) > -1);
    }

    publicApi.isPrintLabelDisabled = function (promotion) {

        var disabled = false;

        if (publicApi.isLabelLocked(promotion)) {
            disabled = true;
        }

        if(!publicApi.hasPosChannel(promotion)){
            disabled = true;
        }

        if (promotion.purchaseConds && promotion.purchaseConds.sources && promotion.purchaseConds.sources[0]
            && promotion.purchaseConds.sources[0].purchaseoption != 'itemsku') {
            disabled = true;
        }

        if (promotion.segment && promotion.segment.id != 0) {
            disabled = true;
        }

        if (promotion.reward && promotion.reward.details[0] && promotion.reward.details[0].qualUOM != 'Quantity') {
            disabled = true;
        }

        if (promotion.reward && promotion.reward.details.length > 1) {
            disabled = true;
        }

        if (promotion.reward && promotion.reward.type != 'PERCNTOFF') {
            disabled = true;
        }

        return disabled;
    }

    return publicApi;
}]);
