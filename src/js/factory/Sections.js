// Mock data for item level percent off promotion
app.factory('SECTIONS', ['ALLOWED_PERMISSION_IDS', function(ALLOWED_PERMISSION_IDS){    
    var _construct = function SECTIONS(userType){
        var allowedPermissionIDs=ALLOWED_PERMISSION_IDS();
        if (userType == allowedPermissionIDs.STORE) {
            return [
                {name:'Properties',isActive:true,shouldDisplay:true, link: 'promotion-properties', icon: 'fa-gear' },
                {name:'Qualifiers',isActive:false,shouldDisplay:true, link: 'promotion-condition-rewards', icon: 'fa-money'},
                {name:'Location',isActive:false,shouldDisplay:true, link: 'promotion-location', icon: 'fa-globe'},
                {name:'Rewards',isActive:false,shouldDisplay:true, link: 'promotion-rewards', icon: 'fa-gift'},
                {name:'Descriptions',isActive:false,shouldDisplay:false, link: 'promotion-descriptions', icon: 'fa-pencil-square-o'},
                {name:'Redemption Limits',isActive:false,shouldDisplay:false, link: 'promotion-redemtion-limits', icon: 'fa-tachometer' },
                {name:'Labels',isActive:false,shouldDisplay:true, link: 'promo-labels', icon: 'fa-tag' },
                {name:'Schedule',isActive:false,shouldDisplay:true, link: 'promotion-schedule', icon: 'fa-calendar'}
            ];
        } else if (userType == allowedPermissionIDs.ONLINE) {
            return [
                {name:'Properties',isActive:true,shouldDisplay:true, link: 'promotion-properties', icon: 'fa-gear' },
                {name:'Qualifiers',isActive:false,shouldDisplay:true, link: 'promotion-condition-rewards', icon: 'fa-money'},
                {name:'Location',isActive:false,shouldDisplay:false, link: 'promotion-location', icon: 'fa-globe'},
                {name:'Rewards',isActive:false,shouldDisplay:true, link: 'promotion-rewards', icon: 'fa-gift'},
                {name:'Descriptions',isActive:false,shouldDisplay:true, link: 'promotion-descriptions', icon: 'fa-pencil-square-o'},
                {name:'Redemption Limits',isActive:false,shouldDisplay:true, link: 'promotion-redemtion-limits', icon: 'fa-tachometer' },
                {name:'Labels',isActive:false,shouldDisplay:false, link: 'promo-Labels', icon: 'fa-tag' },
                {name:'Schedule',isActive:false,shouldDisplay:true, link: 'promotion-schedule', icon: 'fa-calendar'}
            ];
        } else {
            return [
                {name:'Properties',isActive:true,shouldDisplay:true, link: 'promotion-properties', icon: 'fa-gear' },
                {name:'Qualifiers',isActive:false,shouldDisplay:true, link: 'promotion-condition-rewards', icon: 'fa-money'},
                {name:'Location',isActive:false,shouldDisplay:true, link: 'promotion-location', icon: 'fa-globe'},
                {name:'Rewards',isActive:false,shouldDisplay:true, link: 'promotion-rewards', icon: 'fa-gift'},
                {name:'Descriptions',isActive:false,shouldDisplay:true, link: 'promotion-descriptions', icon: 'fa-pencil-square-o'},
                {name:'Redemption Limits',isActive:false,shouldDisplay:true, link: 'promotion-redemtion-limits', icon: 'fa-tachometer' },
                {name:'Labels',isActive:false,shouldDisplay:false, link: 'promo-Labels', icon: 'fa-tag' },
                {name:'Schedule',isActive:false,shouldDisplay:true, link: 'promotion-schedule', icon: 'fa-calendar'}
            ];
        }
    };
    return _construct;
}]);
