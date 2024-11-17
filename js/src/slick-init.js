import $ from "jquery";
import "slick-carousel/slick/slick.css";
import "slick-carousel/slick/slick-theme.css";
import "slick-carousel";

export function initSlickCarousels() {
	$(".slick0").slick({
		dots: false,
		infinite: true,
		slidesToShow: 3,
		slidesToScroll: 1,
		navigation: {
			nextEl: ".swiper-button-next-0",
			prevEl: ".swiper-button-prev-0",
		},
		responsive: [
			{
				breakpoint: 1024,
				settings: {
					slidesToShow: 2,
					slidesToScroll: 1,
				},
			},
			{
				breakpoint: 680,
				settings: {
					slidesToShow: 1,
					slidesToScroll: 1,
				},
			},
		],
	});
  
	$(".slickPlaces").slick({
		dots: false,
		slidesToShow: 3,
		navigation: {
			nextEl: ".swiper-button-next-0",
			prevEl: ".swiper-button-prev-0",
		},
		responsive: [
			{
				breakpoint: 1024,
				settings: {
					slidesToShow: 2,
					slidesToScroll: 2,
				},
			},
			{
				breakpoint: 680,
				settings: {
					slidesToShow: 1,
					slidesToScroll: 1,
				},
			},
		],
	});
}
