describe('Unit test for Sections factory', function() {
  var SECTIONS;
  var allowedPermissionIds;

  // Load the myApp module, which contains the directive
  beforeEach(module('app'));
  // Store references to $rootScope and $compile
  // so they are available to all tests in this describe block
  beforeEach(inject(function(_SECTIONS_,_ALLOWED_PERMISSION_IDS_){
    // The injector unwraps the underscores (_) from around the parameter names when matching
    SECTIONS = _SECTIONS_;
    allowedPermissionIds = _ALLOWED_PERMISSION_IDS_();
  }));

  it('Verify Sections for Store user', function() {
    var sections=SECTIONS(allowedPermissionIds.STORE);
    expect(sections[0].name).toBe('Properties');
    expect(sections[0].shouldDisplay).toBe(true);
    expect(sections[2].name).toBe('Rewards');
    expect(sections[2].shouldDisplay).toBe(true);
  });
  it('Verify Sections for Online user', function() {
    var sections=SECTIONS(allowedPermissionIds.ONLINE);
    expect(sections[0].name).toBe('Properties');
    expect(sections[0].shouldDisplay).toBe(true);
    expect(sections[2].name).toBe('Rewards');
    expect(sections[2].shouldDisplay).toBe(true);
    expect(sections[3].name).toBe('Labels');
    expect(sections[3].shouldDisplay).toBe(false);
  });
});
