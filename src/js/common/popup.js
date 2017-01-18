// Popup Utility
$.fn.popup = function (_action) {
	var action = (_action || 'open');
	
	return this.each(function () {
		var $panel = $(this).closest('.MaskPanel'),
			$popup = $panel.find('.Popup'),
			$close = $panel.find('.Popup__Close'),
			$mask = $panel.find('.MaskPanel__Mask');

		if ($mask.length === 0) {
			$mask = $('<div class="MaskPanel__Mask"></div>').insertBefore($popup);
			
			$mask.on('click', function (event) {
				$panel.addClass('isClosed');
				event.preventDefault();
			});
		}
		
		if ($close.length === 0) {
			$close = $('<div class="Popup__Close">&times;</div>');
			
			$close.on('click', function () {
				$panel.addClass('isClosed');
			});
			
			$close.appendTo($popup);
		}
		
		$panel.toggleClass('isClosed', (action === 'close'));
		
		setTimeout(function(){
			// Adjust margins
			$popup.css('margin-left', (($popup.outerWidth() / 2) * - 1));
			$popup.css('margin-top', (($popup.outerHeight() / 2) * - 1));
		},10);
	});
};