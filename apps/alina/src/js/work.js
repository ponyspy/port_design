$(function() {

	$('.gallery-block').each(function() {
		var $gallery_top = $(this).children('.gallery-top');
		var $gallery_thumbs = $(this).children('.gallery-thumbs');

		var galleryTop = new Swiper($gallery_top, {
			initialSlide: 2000,
			// nextButton: '.swiper-button-next',
			// prevButton: '.swiper-button-prev',
			spaceBetween: 10,
		});

		var galleryThumbs = new Swiper($gallery_thumbs, {
			spaceBetween: 10,
			centeredSlides: true,
			initialSlide: 2000,
			slidesPerView: 'auto',
			touchRatio: 0.2,
			slideToClickedSlide: true
		});

		galleryTop.params.control = galleryThumbs;
		galleryThumbs.params.control = galleryTop;

	});

});