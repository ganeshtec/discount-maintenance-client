// Mock data for item level percent off promotion
app.factory('SECTIONS', ['ALLOWED_PERMISSION_IDS', function(ALLOWED_PERMISSION_IDS){    
    var _construct = function SECTIONS(userType){
        var allowedPermissionIDs=ALLOWED_PERMISSION_IDS();
        if (userType == allowedPermissionIDs.STORE) {
            return [
                {name:'Properties',isActive:true,shouldDisplay:true, link: 'promotion-properties', icon: 'fa-gear' },
                {name:'Qualifiers',isActive:false,shouldDisplay:true, link: 'promotion-condition-rewards', icon: 'fa-money'},
                {name:'Rewards',isActive:false,shouldDisplay:true, link: 'promotion-rewards', icon: 'fa-gift'},
                {name:'Labels',isActive:false,shouldDisplay:true, link: 'promo-labels', icon: 'fa-tag' },
                {name:'Summary',isActive:false,shouldDisplay:true, link: 'promotion-summary', icon: 'fa-tag'}

            ];
        } else if (userType == allowedPermissionIDs.ONLINE) {
            return [
                {name:'Properties',isActive:true,shouldDisplay:true, link: 'promotion-properties', icon: 'fa-gear' },
                {name:'Qualifiers',isActive:false,shouldDisplay:true, link: 'promotion-condition-rewards', icon: 'fa-money'},
                {name:'Rewards',isActive:false,shouldDisplay:true, link: 'promotion-rewards', icon: 'fa-gift'},
                {name:'Labels',isActive:false,shouldDisplay:false, link: 'promo-Labels', icon: 'fa-tag' },
                {name:'Summary',isActive:false,shouldDisplay:true, link: 'promotion-summary', icon: 'fa-tag'}

            ];
        } else {
            return [
                {name:'Properties',isActive:true,shouldDisplay:true, link: 'promotion-properties', icon: 'fa-gear' },
                {name:'Qualifiers',isActive:false,shouldDisplay:true, link: 'promotion-condition-rewards', icon: 'fa-money'},
                {name:'Rewards',isActive:false,shouldDisplay:true, link: 'promotion-rewards', icon: 'fa-gift'},
                {name:'Labels',isActive:false,shouldDisplay:false, link: 'promo-Labels', icon: 'fa-tag' },
                {name:'Summary',isActive:false,shouldDisplay:true, link: 'promotion-summary', icon: 'fa-tag'}
            ];
        }
    };
    return _construct;
}]);
