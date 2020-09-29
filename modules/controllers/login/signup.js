const token = require('crypto');
const jwt = require("jsonwebtoken");



exports.handel = (req, res)=>{
	let user_name = req.body.user_name;
	let user_email = req.body.user_email;
	let user_password = req.body.user_password;
	let client_id = req.body.client_id;
	//let client_id = token.randomBytes(3).toString('hex');

	let query = `SELECT USER_EMAIL FROM USERS WHERE USER_EMAIL = '${user_email}'; SELECT CLIENT_ID FROM USERS WHERE CLIENT_ID = '${client_id}';`;
	global.pool.getConnection((err, conn)=>{
		if(err){
			global.logerr.log(err);
			conn.release();
			res.status(500).end();
		}

		conn.query(query, (err, result)=>{
			if(err){
				global.logerr.log(err);
				conn.release();
				res.status(500).end();
			}
			if(result[0].length == 0 && result[1].length == 0){
				let query = `INSERT INTO USERS(USER_NAME, USER_EMAIL, USER_PASSWORD, CLIENT_ID)
				VALUES(
				'${user_name}',
				'${user_email}',
				'${user_password}',
				'${client_id}'
				)
				`;

				conn.query(query, (err, result)=>{
					conn.release();
					if(err){
						global.logerr.log(err);
						res.status(500).end();
					}
					let obj = {
						"user_name":user_name,
						"user_email":user_email,
						"client_id":client_id
					};
					let token = jwt.sign({obj},process.env.key,{ expiresIn: "24h"});
					res.status(201).cookie('access_token', token, {
						httpOnly:true,
						expires: new Date(Date.now() + 24 * 3600000),
					}).json(obj);
				});
			}
			else{
				res.status(409).send("SAME USER EXISTS");
			}

			
			
		})
	});

}