$(function() {
	var deltaX = 0;
	var deltaY = 0;
	var step = 90;

	$('.work_image').on('slidestep', function(e) {
		var $stack = $(this).parent('.work_images').children('.work_image');

		$(this).index('.work_image') < $stack.length - 1
			? $stack.removeClass('active').filter(this).next().addClass('active')
			: $stack.removeClass('active').first().addClass('active');
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