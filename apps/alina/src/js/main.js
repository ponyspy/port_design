$(function() {
	var deltaX = 0;
	var deltaY = 0;
	var step = 95;

	$('.work_image').on('slidestep', function(e) {
		var $this = $(this);
		var $stack = $this.parent('.work_images').children('.work_image');

		if ($stack.length > 1 && $this.index('.work_image') - 1 <= $stack.length) {
			$stack.removeClass('active').filter(this).next().addClass('active');
		} else {
			$stack.removeClass('active').first().addClass('active');
		}
	});

	$('.work_image').on('mousemove', function(e) {
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