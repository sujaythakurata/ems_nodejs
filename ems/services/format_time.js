
//format date time
format = (date, type)=>{
	let d = new Date(date);
	switch(type){
		case 'year':{
			return d.getFullYear();
		}
		break;
		case 'month':{
			return d.getMonth()+1;
		}
		break;
		case 'day':{
			return d.getDate()+1;
		}
		break;
		case 'date':{
			return `${d.getFullYear()}-${d.getMonth()+1}-${d.getDate()}`;
		}
		break;
		default:{
			return `${d.getFullYear()}-${d.getMonth()+1}-${d.getDate()} ${d.getHours()}:${d.getMinutes()}:${d.getSeconds()}`;
		}

	}
}


//get current date time
current_datetime = (type)=>{
	let d = new Date();
	switch(type){
		case 'year':{
			return d.getFullYear();
		}
		break;
		case 'month':{
			return d.getMonth()+1;
		}
		break;
		case 'day':{
			return d.getDate()+1;
		}
		break;
		case 'date':{
			return `${d.getFullYear()}-${d.getMonth()+1}-${d.getDate()}`;
		}
		break;
		default:{
			return `${d.getFullYear()}-${d.getMonth()+1}-${d.getDate()} ${d.getHours()}:${d.getMinutes()}:${d.getSeconds()}`;
		}

	}
}