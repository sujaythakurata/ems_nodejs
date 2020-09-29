const token = require('crypto');
const jwt = require("jsonwebtoken");



exports.handel = (req, res)=>{
	let user_email = req.body.user_email;
	let user_password = req.body.user_password;

	let query = `SELECT USER_NAME, USER_EMAIL, CLIENT_ID FROM USERS WHERE USER_EMAIL = '${user_email}' AND USER_PASSWORD = '${user_password}' `;
	
	global.call.make_call(query)
	.then((result)=>{
		if(result.length >0){
			let obj = {
				"user_name":result[0].USER_NAME,
				"user_email":result[0].USER_EMAIL,
				"client_id":result[0].CLIENT_ID,
			};
			let token = jwt.sign({obj},process.env.key,{ expiresIn: "24h"});
			res.status(200).cookie('access_token', token, {
				httpOnly:true,
				expires: new Date(Date.now() + 24 * 3600000),
				sameSite:"Strict"
			}).json(obj);
			}
		else{
				res.status(404).end();
			}
	})
	.catch((err)=>{
		res.status(500).end();
	})

	// global.pool.getConnection((err, conn)=>{
	// 	if(err){
	// 		global.logerr.log(err);
	// 		conn.release();
	// 		res.status(500).end();
	// 	}

	// 	conn.query(query, (err, result)=>{
	// 		conn.release();
	// 		if(err){
	// 			global.logerr.log(err);
	// 			res.status(500).end();
	// 		}
	// 		if(result.length >0){
	// 			let obj = {
	// 				"user_name":result[0].USER_NAME,
	// 				"user_email":result[0].USER_EMAIL,
	// 				"client_id":result[0].CLIENT_ID,
	// 			};
	// 			let token = jwt.sign({obj},process.env.key,{ expiresIn: "24h"});
	// 			res.status(200).cookie('access_token', token, {
	// 				httpOnly:true,
	// 				expires: new Date(Date.now() + 24 * 3600000),
	// 				sameSite:"Strict"
	// 			}).json(obj);
	// 		}
	// 		else{
	// 			res.status(404).end();
	// 		}		
	// 	})
	// });

}