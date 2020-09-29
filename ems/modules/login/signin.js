
var app = angular.module("signin", []);
app.controller("signin_ctrl", function($scope) {
	$scope.invalid = false;
	$scope.signin = function(){
		if($scope.signin_form.$valid){
			let obj = {
				"user_email":$scope.user_email,
				"user_password":$scope.user_password
			}
			$.ajax({
				url:api_url("login/signin"),
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
					if(err.status == 404)
					{	$scope.invalid = true;
						$scope.heading = "404!";
						$scope.notice = "email or password is invalid";
						$scope.$apply();
					}
					if(err.status == 500)
					{	$scope.invalid = true;
						$scope.heading = "Oops 500";
						$scope.notice = "Internal Server Error";
						$scope.$apply();
					}
				}
			});
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

