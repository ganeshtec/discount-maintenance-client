describe('Unit testing adminHeader.directive.spec.js', function () {
  var $compile,
    $rootScope,
    utilService,
    $scope;

  // Load the myApp module, which contains the directive
  beforeEach(module('app'));

  // Store references to $rootScope and $compile
  // so they are available to all tests in this describe block
  beforeEach(inject(function (_$compile_, _$rootScope_, _utilService_) {
    // The injector unwraps the underscores (_) from around the parameter names when matching
    $compile = _$compile_;
    $rootScope = _$rootScope_;
    utilService = _utilService_;
    $scope = $rootScope.$new();

    spyOn(utilService, 'getLeadTime').and.callFake(function () {
      return {
        then: function (callback) { return callback(3) }
      }
    })

    spyOn(utilService, 'isSubmitEligibleForDisable').and.callFake(function () {
      return {
        then: function (callback) { return callback(false) }
      }
    })

  }));

  it('Checks if content renders.', function () {

    // Compile a piece of HTML containing the directive
    var element = $compile("<admin-header></admin-header>")($scope);
    $scope.$digest();
    // Check that the compiled element contains the templated content
    expect(element.html()).toContain("Back to Promotions List");

  });

  it('Checks if content is constructed according to input data.', function () {
    // Compile a piece of HTML containing the directive
    $scope.uistate = "Edit";
    $scope.promotype = {};
    $scope.promotype.promoSubTypeDesc = "Promo type";




    var element = $compile("<admin-header uistate='uistate' promotype='promotype'></admin-header>")($scope);
    $rootScope.$digest();
    // Check that the compiled element contains the templated content
    expect(element.html()).toContain("Edit Promotion");
    expect(element.html()).toContain("Promo type");

  });


});