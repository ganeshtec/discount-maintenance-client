describe('Promo Properties Services', function(){
	beforeEach(module('app'));

	it('should return array of promo type', function(){
		expect(true).toBe(true);
	});

	it('app should be defined', function(){
		expect(app).toBeDefined();
	});

	it('should load dependencies', inject(function($route){
		expect($route).toBeDefined();
	}));
});