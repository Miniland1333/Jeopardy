/**
 * Created by Henry on 2/25/2017.
 */

Meteor.setTimeout(refresh,100);

if (navigator.userAgent.match(/(iPhone|iPad|iPod)/i) && !window.navigator.standalone) {
	$(window).on("orientationchange", function () {
		refresh();
	});
}

export default function refresh() {
	//Android|webOS|iPhone|iPad|iPod|BlackBerry|IEMobile|Opera Mini
	if (navigator.userAgent.match(/(iPhone|iPad|iPod)/i) && !window.navigator.standalone) {
		$("#render-target").css({
			"height": window.innerHeight,
			"width": window.innerWidth,
		});
		$(".Main").css({
			"height": window.innerHeight,
			"width": window.innerWidth,
		});
		$("html").css({
			"height": window.innerHeight,
			"width": window.innerWidth,
		});
		$("body").css({
			"height": window.innerHeight,
			"width": window.innerWidth,
		});
		$("#myModal").css({
			"height": window.innerHeight,
			"width": window.innerWidth,
		});
		$("#optionsModal").css({
			"height": window.innerHeight,
			"width": window.innerWidth,
		});
		
	}
}