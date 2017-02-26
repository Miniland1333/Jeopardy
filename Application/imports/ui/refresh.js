/**
 * Created by Henry on 2/25/2017.
 */

export default function refresh(){
	if (navigator.userAgent.match(/(Android|webOS|iPhone|iPad|iPod|BlackBerry|IEMobile|Opera Mini)/i)) {
		$(".Main").css({
			"height": window.innerHeight,
		});
		$("body").css({
			"height": window.innerHeight,
		});
		$("#myModal").css({
			"height": window.innerHeight,
		});
		$("#optionsModal").css({
			"height": window.innerHeight,
		});
	}
}