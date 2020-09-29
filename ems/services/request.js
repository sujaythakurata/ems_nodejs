
//AJAX CALL GET REQUEST
function get(url, loader) {
	return new Promise((resolve, reject)=>{
		let loading = null;
		if(loader){
			loading  = showloader();
		}	
		$.ajax({
			url: url,
			method: 'GET',
			xhrFields: { withCredentials: true },
			beforeSend:loading,
			success:(data)=>{
				hideloader();
				resolve(data);},
			error:(err)=>{reject(err);}
		});
	});
}

//AJAX CALL POST REQUEST
function post(url, data, loader) {
	return new Promise((resolve, reject)=>{
		let loading = null;
		if(loader){
			loading  = showloader();
		}	
		$.ajax({
			url: url,
			method: 'POST',
			data: JSON.stringify(data),
			contentType: "application/json; charset=utf-8",
	        dataType   : "json",
	        xhrFields: { withCredentials: true },
			beforeSend:loading,
			success:(data)=>{hideloader();resolve(data);},
			error:(err)=>{reject(err);}
		});
	});
}

//AJAX CALL PUT REQUEST
function put(url, data, loader) {
	return new Promise((resolve, reject)=>{
		let loading = null;
		if(loader){
			loading  = showloader();
		}	
		$.ajax({
			url: url,
			method: 'PUT',
			data: JSON.stringify(data),
			contentType: "application/json; charset=utf-8",
	        dataType   : "json",
	        xhrFields: { withCredentials: true },
			beforeSend:loading,
			success:(data)=>{hideloader();resolve(data);},
			error:(err)=>{reject(err);}
		});
	});
}