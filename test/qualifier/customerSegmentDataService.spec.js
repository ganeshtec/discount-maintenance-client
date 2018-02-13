/* eslint-disable no-unused-vars */
describe('checking Customer Segment Data Service for 200 response code', function () {
    var $rootScope,
        $scope,
        location,
        $httpBackend;


    it('Test Customer Segments Data Service call for V1 Endpoint', inject(function ($httpBackend) {
        var url = 'http://promotionsadminsku.apps-np.homedepot.com/v1/customersegment/segments';
        $httpBackend.when('GET', url, function () {
            return true;
        }).respond(200, true);
    }));

    it('Test Customer Segments Data Service call for V2 Endpoint ', inject(function ($httpBackend) {
        var url = 'http://promotionsadminsku.apps-np.homedepot.com/v1/customersegment/v2/segments';
        $httpBackend.when('GET', url, function () {
            return true;
        }).respond(200, true);
    }));
});
