function handel_430(err){
	if(err.status == 403){
		toast('error', 'Token Expires Login Again \n Redirect within 5 sec');
		setTimeout(()=>{location.href = '/meters';}, 5000);
	}
}

function id_missing(m_id){
	console.log(m_id)
	if(m_id == null || m_id == undefined || m_id == '' || m_id== 'null' || m_id=='undefined'){
		toast('error','No meter is Selected \n Select a Meter First \n Redirect within 5 sec.');
		setTimeout(()=>{location.href = '/meters';}, 5000);
	}
}