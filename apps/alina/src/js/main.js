$(function() {
	var deltaX = 0;
	var deltaY = 0;
	var step = 95;

	$('.work_images').each(function() {
		$(this).children('.work_image').first().addClass('active');
	});

	$('.work_item').not('.hover')
		.on('mouseenter', function(e) {
			$(this).children('.work_poster').addClass('hide');
		})
		.on('mouseleave', function(e) {
			$(this).children('.work_poster').removeClass('hide');
		});

	$('.work_image')
		.on('slidestep', function(e) {
			var $this = $(this);
			var $stack = $this.parent('.work_images').children('.work_image');

			if ($stack.length > 1 && $this.next().length !== 0) {
				$stack.removeClass('active').filter(this).next().addClass('active');
			} else {
				$stack.removeClass('active').first().addClass('active');
			}
		})
		.on('mousemove', function(e) {
			if (e.pageX >= deltaX || e.pageY >= deltaY) {
				$(this).trigger('slidestep');

				deltaX = e.pageX + step;
				deltaY = e.pageY + step;
			} else if (e.pageX <= deltaX - step * 2 || e.pageY <= deltaY - step * 2) {
				deltaX = e.pageX + step;
				deltaY = e.pageY + step;

				$(this).trigger('slidestep');
			}
		});
});