app.component('itemInclusion', {
    templateUrl: 'itemInclusion.html',
    bindings: {

    },
    controller: ItemInclusionController
});

function ItemInclusionController() {

    this.sanitizeSkus = function(skuList) {
        return [];
    }

}
