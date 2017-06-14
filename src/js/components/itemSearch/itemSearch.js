app.component('itemSearch', {
    templateUrl: 'itemSearch.html',
    bindings: {

    },
    controller: itemSearchController
});

function itemSearchController() {

    this.sanitizeSkus = function(skuList) {
        return skuList.split(' ');
    }

    this.removeDuplicateSkus = function(arr) {
        var seen = {};
        var out = [];
        var j = 0;
        for (var i in arr) {
            var item = arr[i];
            if (seen[item] !== 1) {
                seen[item] = 1;
                out[j++] = item;
            }
        }
        return out;
    }

}