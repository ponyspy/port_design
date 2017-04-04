var current = 1;
var stack = [];

$(function() {
	$('.block').each(function() {
		$(this).children('.image_item').eq(0).addClass('active');
	});

	$('.cv').on('click', function(e) {
		window.open('/cv', '', 'width=360, height=500, left=200, top=200');
	});

	$(document)
		.on('click', 'body', function(e) {
			if (e.target.className !== '') {
				$('.block').eq(stack.pop()).find('.image_item.active').removeClass('active').prev().addClass('active');
			}
		})
		.on('mousedown', 'img', function(e) {
			return false;
		})
		.on('click', 'img', function(e) {
			var $active_block = $(this).closest('.block');
			var $active_image = $(this).closest('.image_item');

			if ($active_image.index() < $active_block.children('.image_item').length - 1) {
				stack.push($active_block.index());
				$active_image.removeClass('active').next().addClass('active');
			} else {
				stack = [];
				$.post('', { index: current }).done(function(data) {
					current = data.current;

					$('.content_block').html(data.html).find('.run').delay(300).queue(function() { $(this).addClass('go'); $(this).dequeue(); });
					// $('.current').text(current);

					$('.block').each(function() {
						$(this).children('.image_item').eq(0).addClass('active');
					});
				});
			}
		});

});