
var app = angular.module("signup", []);
app.controller("signup_ctrl", function($scope) {
	$scope.invalid = false;
	$scope.signup = function(){

		if($scope.signup_form.$valid){
			let obj = {
				"user_name":$scope.user_name,
				"user_email":$scope.user_email,
				"client_id":$scope.client_id,
				"user_password":$scope.user_password
			}
			$.ajax({
				url:api_url("login/signup"),
				type:"post",
				data:JSON.stringify(obj),
				contentType: "application/json; charset=utf-8",
	        	dataType   : "json",
	        	xhrFields: { withCredentials: true },
				beforeSend: ()=>{
					showloader();
				},
				success: (data)=>{
					localStorage.setItem('user_cred', JSON.stringify(data));
					localStorage.setItem('logged_in', "true");
					location.href = site_route(['']);
				},
				error: (err)=>{
					hideloader();
					if(err.status == 409)
					{	$scope.invalid = true;
						$scope.heading = "Alert";
						$scope.notice = "Same Email or Same Client Id exists";
						$scope.$apply();
					}
					if(err.status == 500)
					{	$scope.invalid = true;
						$scope.heading = "Oops 500";
						$scope.notice = "Internal Server Error";
						$scope.$apply();
					}
				}
			})
		}
		else{
			$scope.invalid = true;
			$scope.heading = "Invalid Info";
			$scope.notice = "Please Enter Valid Details";
		}
	}
	$scope.refresh = ()=>{
		$scope.invalid = false;
	}
});

