app.factory('promotionSubTypes', [function(){	
	var _construct = function promotionSubTypes(){
		var data = {
    "promotionSubTypes": [
        {
            "promoSubTypeCd": "ProductLevelPercentDiscount",
            "promoSubTypeDesc": "Percentage off the subtotal of items",
            "promoTypeCd": "ITEMPROMO"
        },
        {
            "promoSubTypeCd": "MultipleItemsPercentDiscount",
            "promoSubTypeDesc": "Buy A and B, get a percentage off both",
            "promoTypeCd": "ITEMPROMO"
        },
        {
            "promoSubTypeCd": "ProductLevelBuyXGetYFree",
            "promoSubTypeDesc": "Buy item X, get item Y free",
            "promoTypeCd": "ITEMPROMO"
        },
        {
            "promoSubTypeCd": "ProductLevelPWPPercentDiscount",
            "promoSubTypeDesc": "Buy item X, get a percentage off item Y",
            "promoTypeCd": "ITEMPROMO"
        },
        {
            "promoSubTypeCd": "ProductLevelSameItemPercentDiscount",
           "promoSubTypeDesc": "Buy item X, get additional X at a percentage off",
            "promoTypeCd": "ITEMPROMO"
        },
        {
            "promoSubTypeCd": "ProductLevelPerItemValueDiscount",
            "promoSubTypeDesc": "Amount off individual items",
            "promoTypeCd": "ITEMPROMO"
        },
        {
            "promoSubTypeCd": "OrderLevelValueDiscount",
            "promoSubTypeDesc": "Amount off an order",
            "promoTypeCd": "ORDERPROMO"
        },
        {
            "promoSubTypeCd": "CategoryLevelValueDiscount",
            "promoSubTypeDesc": "Amount off the subtotal of items from a category",
            "promoTypeCd": "ITEMPROMO"
        },
        {
            "promoSubTypeCd": "ProductLevelValueDiscount",
            "promoSubTypeDesc": "Amount off the subtotal of items",
            "promoTypeCd": "ITEMPROMO"
        },
        {
            "promoSubTypeCd": "CategoryLevelPercentDiscount",
            "promoSubTypeDesc": "Percentage off the subtotal of items from a category",
            "promoTypeCd": "ITEMPROMO"
        },
        {
            "promoSubTypeCd": "OrderLevelPercentDiscount",
            "promoSubTypeDesc": "Percentage off an order",
            "promoTypeCd": "ORDERPROMO"
        },
        {
            "promoSubTypeCd": "ProductLevelPerItemPercentDiscount",
            "promoSubTypeDesc": "Percentage off individual items",
            "promoTypeCd": "ITEMPROMO"
        }
    ]
}
;
		return data;
	};
	return _construct;
}]);