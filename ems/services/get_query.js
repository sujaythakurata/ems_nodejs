function get_params(name){
	let params = new URLSearchParams(window.location.search);
	return params.get(name);
}