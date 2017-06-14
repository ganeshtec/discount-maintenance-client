describe("ItemSearchComponent", function() {
  var $componentController, ctrl;

  beforeEach(module("app"));

  describe('Skus', function() {

    var ctrl;

    beforeEach(inject(function(_$componentController_) {
      $componentController = _$componentController_;
      var bindings = {};
      ctrl = $componentController('itemSearch', null, bindings);
    }));

    it("Should reformat sku list to a list of numbers", function() {
      var dirtySkus = "123456 222555";
      var sanitizedSkus = ctrl.sanitizeSkus(dirtySkus);
      expect(sanitizedSkus.length).toEqual(2);
    });

    it("Should remove duplicate skus from array of skus", function() {
      var duplicateSkuArray = ["123456", "222555", "123456"];
      var uniqueSkuArray = ctrl.removeDuplicateSkus(duplicateSkuArray);
      expect(uniqueSkuArray.length).toEqual(2);
      expect(uniqueSkuArray).toContain("123456");
      expect(uniqueSkuArray).toContain("222555");
    });

    it("Should display error if pasted sku list contains letters", function() {

    });

    it("Should display error if pasted sku list contains punctuation marks", function() {

    });

    it("Should display error if skus aren't 6 or 10 character long", function() {

    });

    it("Should call the validateSkus() endpoint if skus", function() {

    });

    it("Should populate search results after response", function() {

    });

    it("Should emit search results after search() is clicked", function() {

    });
  });

  describe('Oms Ids', function() {
    it('Should reformat oms id list to a list of numbers', function() {

    });

    it("Should remove duplicate oms ids from array of oms ids", function() {

    });

    it('Should call the validateOmsIds() endpoint if oms ids', function() {

    });
  });

  // Check if this component is used for web category
  describe('Category', function() {

  });

});
