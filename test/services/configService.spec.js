describe('ConfigServiceTests', function(){
  var $httpBackend;
  var configService;

    beforeEach(module('app'));

    beforeEach(inject(function (_configService_, _$httpBackend_) {
      configService = _configService_;
      $httpBackend=_$httpBackend_;
    }));

    it('Fetch config from external service', function(){

      $httpBackend.whenGET('/ssoConfig.json').respond(
       {appID:'12342-123dase',oAuthUrl:'https://something.com'});
      var configServicePromise = configService.getConfig();
      configServicePromise.then(function(value){
        var config = value;
        expect(config).toBeDefined();
        expect(config.appID).toEqual('12342-123dase');
        expect(config.oAuthUrl).toEqual('https://something.com');
      });
    });
});
