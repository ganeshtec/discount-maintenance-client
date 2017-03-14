describe('Unit testing app.spec.js', function(){
    beforeEach(module('app'));

    it('Checks to ensure the app has tests.', function(){
        expect(true).toBe(true);
    });

    it('Checks to ensure the app is defined.', function(){
        expect(app).toBeDefined();
    });

    it('Checks to ensure the app loads dependencies.', inject(function($route){
        expect($route).toBeDefined();
    }));

})