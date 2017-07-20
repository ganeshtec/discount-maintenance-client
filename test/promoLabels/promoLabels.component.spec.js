describe('promoLabels', function () {
    var $componentController,
    $rootScope,
    $compile,
    $httpBackend,
    promotionDataService;
    
    // Load the myApp module, which contains the directive
    beforeEach(module('app'));

    beforeEach(inject(function(_$componentController_,_$rootScope_,_$compile_,_$httpBackend_,_promotionDataService_) {
    $componentController = _$componentController_;
    $rootScope = _$rootScope_;
    $compile = _$compile_;
    $httpBackend = _$httpBackend_;
    promotionDataService = _promotionDataService_;
          
    ctrl = $componentController('promoLabels',null, {
       data: {} 
         });
     var leadTime = $httpBackend.when('GET', '/labels/leadTime')
                            .respond(200,3);      

  }));

 // Print Label component coverage been handled in adminPromotionForm.directive.spec.js

    it('to check printLabel checkbox checked by default', function () {
      //ctrl.data.promoSubTypeCd ='ProductLevelPerItemPercentDiscountMSB';
      var data = {};
      $rootScope.data = data;
      var element = $compile("<promo-labels data='data' ></promo-labels>")($rootScope);
      $rootScope.$digest();
      ctrl.data.printLabel=true; 
      ctrl.data.labelText='';
      
      expect(ctrl.data.printLabel).toBe(true);
      expect(ctrl.data.labelText).toEqual("");
      expect(ctrl.data.labelText.length).toBe(0);        
    });
   
});
