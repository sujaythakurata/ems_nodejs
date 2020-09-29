const fs = require('fs');
const path = require('path');

const file_path= path.join(process.env.PWD, 'KWH_MONTHLY_LOG.txt');

exports.log = function(data){
	fs.open(file_path, 'a', function (err, file){
		if(err) console.log(err);
		let today = new Date();
		let date = today.getFullYear()+'-'+(today.getMonth()+1)+'-'+today.getDate();
		let time = today.getHours() + ":" + today.getMinutes() + ":" + today.getSeconds();
		let dateTime = date+' '+time;
		let line = `\n//////////////KWH_MONTHLY TABLE UPDATE: ${dateTime} ////////////////////\n${JSON.stringify(data)}`;

		fs.appendFile(file_path, line, (err)=>{
			if (err) console.log(err);
			console.log("KWH_MONTHLY TABLE UPDATED");
		})
		

	});
}