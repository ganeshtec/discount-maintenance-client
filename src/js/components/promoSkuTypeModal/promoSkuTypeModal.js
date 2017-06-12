app.component('promoSkuTypeModal', {
    bindings: {
        data: '=',
        filteredSkuListCallback: '&'
    },
    templateUrl: 'promoSkuTypeModal.html',
    controller: PromoSkuTypeModalController,
});

function PromoSkuTypeModalController(skuTypesDataService, $mdDialog) {
    var ctrl = this;
    ctrl.$onInit = function () {
        skuTypesDataService.fetchSkuTypes().then(function (skuTypes) {
            ctrl.skuTypes = skuTypes;
            //var ctr = 0;
            var skuTypeCode;
            var skuCountList = ctrl.data.itemPromiseResult.skuCountList;
            ctrl.skuSelectionMap = {}
            for (var i = 0, len = ctrl.skuTypes.length; i < len; i++) {
                skuTypeCode = ctrl.skuTypes[i].skuTypeCode;
                ctrl.skuSelectionMap[skuTypeCode] = { count: 0, selected: false };
            }
            for (var j = 0; j < skuCountList.length; j++) {
                skuTypeCode = skuCountList[j].skuTypeCode;
                ctrl.skuSelectionMap[skuTypeCode].count = skuCountList[j].skuCount;
                ctrl.skuSelectionMap[skuTypeCode].selected = true;
            }
        });
    }

    ctrl.closeSkuTypeModal = function () {
        $mdDialog.hide();
    }

    ctrl.filterSkuTypesUnchecked = function () {
        var filteredList = [];
        for (var i = 0; i < ctrl.data.itemPromiseResult.validSkuInfo.length; i++) {
            var skuInfo = ctrl.data.itemPromiseResult.validSkuInfo[i];
            if (ctrl.skuSelectionMap[skuInfo.skuTypeCode].selected) {
                filteredList.push(skuInfo);
            }
        }
        ctrl.filteredSkuListCallback({ filteredSkuList: filteredList });
        $mdDialog.hide();
        //ctrl.data.validSkuInfo=filteredList;       

    }
    // function setSkuValidData() {
    //     existingID = '';

    //     if (!scope.validSkuInfo.length && scope.data && !scope.itemSkuSearch) {
    //         $.extend(true, scope.validSkuInfo, data.validSkuInfo);
    //     }

    //     if (data.validSkuInfo && scope.itemSkuSearch) {
    //         for (var i = 0; i < data.validSkuInfo.length; i++) {
    //             addSku(data.validSkuInfo[i]);
    //         }
    //     }
    //     // if invalid Data set to item search
    //     scope.itemSkuSearch = (data.inValidSkuInfo) ? [data.inValidSkuInfo.toString().replace(/,/g, ' ')] : [];
    //     scope.inValidSkuInfo = (scope.itemSkuSearch.length > 0);
    //     var invalidIds = data.inValidSkuInfo;
    //     if (invalidIds && invalidIds.length > 0) {
    //         scope.showInvalidError = true;
    //     }
    // }

}