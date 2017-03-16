app.service('dashboardDataService', [
    function () {
        var publicApi = {};

        publicApi.getPromotionFromList = function (promotionData, promoID) {
            var promoData;
            promotionData.reduce(function (data, promo) {
                if (promo.promotion.promoId === parseInt(promoID)) {
                    promoData = promo.promotion;
                }
                return data;
            }, {});

            return promoData;
        }

        return publicApi;
    }
]);