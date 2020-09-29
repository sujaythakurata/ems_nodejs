
function site_route(arr){
	let url = window.location.origin;
	for(let i = 0; i<arr.length; i++){
		url += "/"+arr[i];
	}
	return url;
}
