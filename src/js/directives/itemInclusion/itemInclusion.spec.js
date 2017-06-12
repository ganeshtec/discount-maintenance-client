describe("ItemInclusionComponent", function() {
  var $componentController, ctrl;

  beforeEach(module("app"));

  describe('Skus', function() {

    var ctrl;

    beforeEach(inject(function(_$componentController_) {
      $componentController = _$componentController_;
      var bindings = {};
      ctrl = $componentController('itemInclusion', null, bindings);
    }));

    it("Should reformat sku list to a list of numbers", function() {
      var dirtySkus = "123456 222555";
      var sanitizedSkus = ctrl.sanitizeSkus(dirtySkus);
      expect(sanitizeSkus.length).toEqual(2);
    });

    it("Should remove duplicate skus from pasted sku list", function() {

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

    it('Should call the validateOmsIds() endpoint if oms ids', function() {

    });
  });

  // Check if this component is used for web category
  describe('Category', function() {

  });

});
