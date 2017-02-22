// Mock data for item level percent off promotion
app.factory('SECTIONS', [function(){	
	var _construct = function SECTIONS(userType){

		if (userType === "store") {
			return [
				{name:"Promotion Properties",isActive:true,shouldDisplay:true, link: 'promotion-properties', icon: 'fa-gear' },
				{name:"Purchase Conditions",isActive:false,shouldDisplay:true, link: 'promotion-condition-rewards', icon: 'fa-money'},
				{name:"Location",isActive:false,shouldDisplay:true, link: 'promotion-location', icon: 'fa-globe'},
				{name:"Rewards",isActive:false,shouldDisplay:true, link: 'promotion-rewards', icon: 'fa-gift'},
				{name:"Descriptions",isActive:false,shouldDisplay:false, link: 'promotion-descriptions', icon: 'fa-pencil-square-o'},
				{name:"Redemption Limits",isActive:false,shouldDisplay:true, link: 'promotion-redemtion-limits', icon: 'fa-tachometer' },
				{name:"Schedule",isActive:false,shouldDisplay:true, link: 'promotion-schedule', icon: 'fa-calendar'}
			];
		} else if (userType === "online") {
			return [
				{name:"Promotion Properties",isActive:true,shouldDisplay:true, link: 'promotion-properties', icon: 'fa-gear' },
				{name:"Purchase Conditions",isActive:false,shouldDisplay:true, link: 'promotion-condition-rewards', icon: 'fa-money'},
				{name:"Location",isActive:false,shouldDisplay:true, link: 'promotion-location', icon: 'fa-globe'},
				{name:"Rewards",isActive:false,shouldDisplay:true, link: 'promotion-rewards', icon: 'fa-gift'},
				{name:"Descriptions",isActive:false,shouldDisplay:true, link: 'promotion-descriptions', icon: 'fa-pencil-square-o'},
				{name:"Redemption Limits",isActive:false,shouldDisplay:true, link: 'promotion-redemtion-limits', icon: 'fa-tachometer' },
				{name:"Schedule",isActive:false,shouldDisplay:true, link: 'promotion-schedule', icon: 'fa-calendar'}
			];
		} else {
			return [
				{name:"Promotion Properties",isActive:true,shouldDisplay:true, link: 'promotion-properties', icon: 'fa-gear' },
				{name:"Purchase Conditions",isActive:false,shouldDisplay:true, link: 'promotion-condition-rewards', icon: 'fa-money'},
				{name:"Location",isActive:false,shouldDisplay:true, link: 'promotion-location', icon: 'fa-globe'},
				{name:"Rewards",isActive:false,shouldDisplay:true, link: 'promotion-rewards', icon: 'fa-gift'},
				{name:"Descriptions",isActive:false,shouldDisplay:true, link: 'promotion-descriptions', icon: 'fa-pencil-square-o'},
				{name:"Redemption Limits",isActive:false,shouldDisplay:true, link: 'promotion-redemtion-limits', icon: 'fa-tachometer' },
				{name:"Schedule",isActive:false,shouldDisplay:true, link: 'promotion-schedule', icon: 'fa-calendar'}
			];
		}
	};
	return _construct;
}]);