const jwt = require('jsonwebtoken');

exports.auth = (req, res, next)=>{
	let token = req.cookies.access_token;
	if(token){
		jwt.verify(token, process.env.key, (err, data)=>{
			if(err){
				global.logerr.log(err);
				res.status(500).end();
			}
			req.user_name = data.obj.user_name;
			req.user_email = data.obj.user_email;
			req.client_id = data.obj.client_id;
			next();

		})

	}else{
		res.status(403).json({"status":'FORBIDDEN ACCESS'});
	}
}


exports.route_auth = (req, res, next)=>{
	let token = req.cookies.access_token;
	if(token){
		jwt.verify(token, process.env.key, (err, data)=>{
			if(err){
				global.logerr.log(err);
				res.redirect("/signin");
			}
			req.user_name = data.obj.user_name;
			req.user_email = data.obj.user_email;
			req.client_id = data.obj.client_id;
			next();

		})

	}else{
		res.redirect("/signin");
	}
}