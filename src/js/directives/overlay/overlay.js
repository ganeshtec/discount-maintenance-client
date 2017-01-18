
app.directive('overlay',
	function (){
	return {
		restrict : 'E',
		templateUrl: 'overlay.html',
		transclude:{
			'headerSlot':'?header',
			'contentSlot': '?content',
			'footerSlot': '?footer'
		},
		scope:{
			overlayConfig :"="
		},
		replace: true,
		link: function(scope, $element, attrs){
			var tempData = $.extend(true, {}, scope.data),$mask;
			var $popup = $element.find('.Popup');
			var adjust = function(){
				var content = $element.find('.Popup_content');	
				content.css('height',window.innerHeight-350 +'px');				//when opening
				$popup.css('margin-left', (($popup.outerWidth() / 2) * - 1));
				$popup.css('margin-top', (($popup.outerHeight() / 2) * - 1));
			}
			scope.$watch("overlayConfig.isOpen",function(newVal,oldVal){
				adjust();	  
			});
		}
	};
});
