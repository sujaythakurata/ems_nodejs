var refresh = null;
function showloader() {
	let tag = `
	<div class="loader">
		<i class="fas fa-2x fa-sync-alt fa-spin loader-icon"></i>
	</div>
	<style>
	.loader{
	position: absolute;
	top:0;
	bottom:0;
	background-color: #000000;
	opacity: .3;
	z-index: 5;
	}
	.loader-icon{
		position: absolute;
	}
	</style>
	`;

	$('body').append(tag);
	$(".loader").css({"height":window.innerHeight, "width": window.innerWidth});
	$(".loader>.loader-icon").css({"top":Math.floor(window.innerHeight/2)-10, "left": Math.floor(window.innerWidth/2)});
	refresh = setInterval(()=>{
		$(".loader").css({"height":window.innerHeight, "width": window.innerWidth});
		$(".loader>.loader-icon").css({"top":Math.floor(window.innerHeight/2)-10, "left": Math.floor(window.innerWidth/2)});
	}, 500);
	
}


function hideloader() {
	clearInterval(refresh);
	$(".loader").remove();
}