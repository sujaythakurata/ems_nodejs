const b_confirm =(title, msg, size)=>{
	return new Promise((resolve, reject)=>{
		bootbox.confirm({
			title:title,
			message:msg,
			size:size,
			callback:function(result){
				resolve(result);
			}
		});
	});

}