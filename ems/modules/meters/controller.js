//add new mete
const app = angular.module('meters', []);


app.controller('meter_ctrl', ['$scope', '$compile', function($scope, $compile){

	//initial values
	$scope.view = true;
	//empty screen
	$scope.empty_screen = false;

	//always set the grid view
	$("input[data-bootstrap-switch]").each(function(){
      $(this).bootstrapSwitch('state', true);
    });

	///general info
	$scope.title = 'meters';
	let user_info = JSON.parse(localStorage.getItem('user_cred'));

	//meter form initial value
	$scope.currency = "usd";

	//delay
	const delay = 10000;
	const error_delay = 15000;


	//add new meter form
	$scope.add_meter = ()=>{
		if($scope.add_meter_form.$valid){
			let obj = {
				meter_id:$scope.meter_id,
				meter_name:$scope.meter_name,
				brand:$scope.meter_maker,
				full_load_i:$scope.full_load_i,
				no_load_i:$scope.no_load_i,
				off_i:$scope.off_load_i,
				unit:$scope.unit_rate,
				currency:$scope.currency
			}
			post(api_url('meter/add_meter'), obj, true)
			.then((data)=>{
				hideloader();
				$scope.reset_meter_form();
				$(".dismiss").click();
				toast('success', 'New Meter Added');
				//s_alert('info', 'info', ' Fetching New Data.. wait a sec');
			})
			.catch((err)=>{
				hideloader();
				if(err.status==409){
					toast('warning', 'Meter ID already exists');
				}
				if(err.status==500){
					toast('error', 'Internal error check your connection or try after a refresh');
				}
			})
		}
	}

	//form validation
	$scope.validate_string = (data, min, max, e)=>{
		if(data!=undefined && data.length>=min && data.length<=max){
			$(`.${e}`).addClass('is-valid');
			$(`.${e}`).removeClass('is-invalid');
		}
		else if(data!=undefined){
			$(`.${e}`).removeClass('is-valid');
			$(`.${e}`).addClass('is-invalid');
		}else{
			$(`.${e}`).removeClass('is-invalid');
			$(`.${e}`).removeClass('is-valid');
		}	
	}
	$scope.validate_integer = (data, min, max, e)=>{
		if(data!=undefined && parseInt(data)>=min){
			$(`.${e}`).addClass('is-valid');
			$(`.${e}`).removeClass('is-invalid');
		}
		else if(data!=undefined){
			$(`.${e}`).removeClass('is-valid');
			$(`.${e}`).addClass('is-invalid');
		}else{
			$(`.${e}`).removeClass('is-invalid');
			$(`.${e}`).removeClass('is-valid');
		}
	}


	//reset meter form from data
	$scope.reset_meter_form = ()=>{
		$scope.meter_id='';
		$scope.meter_name='';
		$scope.meter_maker='';
		$scope.full_load_i='';
		$scope.no_load_i='';
		$scope.off_load_i='';
		$scope.unit_rate='';
		$scope.currency='usd';
		$scope.$apply();
		$('.meter_id').removeClass('is-valid');
		$('.meter-name').removeClass('is-valid');
		$('.meter-maker').removeClass('is-valid');
		$('.full-load-i').removeClass('is-valid');
		$('.no-load-i').removeClass('is-valid');
		$('.off-load-i').removeClass('is-valid');
		$('.unit-rate').removeClass('is-valid');
	}

	//watch meterlist
	$scope.meterlist = new Array();

	//get meter list
	$scope.get_meterlist = function(){
		get(api_url('meter/meter_list'), false).
		then(function(data){
			if(data.length>0){
				$scope.empty_screen = false;
			}else
				$scope.empty_screen = true;

			$scope.$apply(function(){
				$scope.meterlist = data;
			});

			//refresh datatable
			$("#list").DataTable().destroy();
			$("#list").DataTable({
				data:data,
				columns: [
			        { data: 'meter_id',
			        render: function(data, type, row, meta){
			        	return `<a href='/live?meter_id=${data}'>${data}</a>`;
			        }
			    	},
			        { data: 'meter_name' },
			        { data: 'i',
			        render:function(data, type, row, meta){
			        	return `${(parseInt(data)/1000).toFixed(2)} &#13188;`;
			        } },
			        { data: 'f',
			        render:function(data, type, row, meta){
			        	return `${data} &#13200;`;
			        } },
			        {data: 'v_thd',
			    	render:function(data, type, row, meta){
			        	return `${data} &#13200;`;
			        }},
			        {data: 'i_thd',
			    	render:function(data, type, row, meta){
			        	return `${data} &#13200;`;
			        }},
			        {data: 'w_sum',
			    	render:function(data, type, row, meta){
			        	return `${data} &#13246;`;
			        }},
			        { data: 'meter_id',
			        render: function(data, type, full){
			        	return `<button class="btn btn-default text-light" 
			                  style="background-color:#0099cc;"
			                  data-toggle="modal" data-target="#update-meter-form"
			                  ng-click="set_meterid('${data}')"
			                  >
			                    <i class="fas fa-edit"></i>
                  			</button>`;
			        	}
			    	}

			    ],
      			"responsive": true,
      			"autoWidth": false,
      			"createdRow": ( row, data, index )=> {
        			$compile(row)($scope);  //add this to compile the DOM
    			},
    			fixedColumns:   {
            		heightMatch: 'none'
        		}
    		});
    		//$("td").css({'padding':"0 0 0 10px"});

    		///call recursively the meterlist function
			setTimeout(()=>{$scope.get_meterlist();}, delay);
		})
		.catch((err)=>{
			s_alert('error', 'error', 'Internal Server error\n reconnect after 15s');
			setTimeout(()=>{$scope.get_meterlist();}, error_delay);
		})
	}

	//call meter list function
	$scope.get_meterlist();


	//toggle view
	$(".bootstrap-switch-handle-off").click((e)=>{
		$scope.$apply(()=>{
			if($scope.view)
				$scope.view = false;
			else
				$scope.view = true;
		});
		$('#toggle-state-switch').bootstrapSwitch('toggleState'); 
	});
	$(".bootstrap-switch-handle-on").click((e)=>{
		$scope.$apply(()=>{
			if($scope.view)
				$scope.view = false;
			else
				$scope.view = true;
		});
		$('#toggle-state-switch').bootstrapSwitch('toggleState'); 
	});
	$(".bootstrap-switch-label").click((e)=>{
		$scope.$apply(()=>{
			if($scope.view)
				$scope.view = false;
			else
				$scope.view = true;
		});
		$('#toggle-state-switch').bootstrapSwitch('toggleState'); 
	});

	//set meter id of meterupdate from
	$scope.update = {};
	$scope.set_meterid = (data)=>{
		$scope.update.meter_id = data;
		s_alert('info', 'info', ' Fetching Data.. wait a sec');
		get(api_url(`meterconfig/${data}`), false)
		.then((data)=>{
			$scope.update.meter_name=data[0].M_NAME;
			$scope.update.meter_maker=data[0].BRAND;
			$scope.update.full_load_i=data[0].FULL_LOAD_I;
			$scope.update.no_load_i=data[0].NO_LOAD_I;
			$scope.update.off_load_i=data[0].OFF_I;
			$scope.update.unit_rate=data[0].UNIT_RATE;
			$scope.update.currency=data[0].CURRENCY;
			$scope.$apply();
		})
		.catch((err)=>{
			s_alert('error', 'error', 'Internal Server error\n Unable to fetch Data');
		})
	}

	//submit meter update from
	$scope.update_meter = ()=>{
		if($scope.update_meter_form.$valid){
			let obj = {
				meter_id:$scope.update.meter_id,
				meter_name:$scope.update.meter_name,
				brand:$scope.update.meter_maker,
				full_load_i:$scope.update.full_load_i,
				no_load_i:$scope.update.no_load_i,
				off_i:$scope.update.off_load_i,
				unit:$scope.update.unit_rate,
				currency:$scope.update.currency
			}
			put(api_url('meter/meter_config'), obj, true)
			.then((data)=>{
				hideloader();
				$scope.reset_update_meter_form();
				$(".dismiss").click();
				toast('success', 'Meter Data Updated');
			})
			.catch((err)=>{
				hideloader();
				if(err.status==500){
					toast('error', 'Internal error check your connection or try after a refresh');
				}
			})
		}
	}

	//reset update meter form from data
	$scope.reset_update_meter_form = ()=>{
		$scope.update.meter_id='';
		$scope.update.meter_name='';
		$scope.update.meter_maker='';
		$scope.update.full_load_i='';
		$scope.update.no_load_i='';
		$scope.update.off_load_i='';
		$scope.update.unit_rate='';
		$scope.update.currency='usd';
		$scope.$apply();
		$('.meter_id').removeClass('is-valid');
		$('.meter-name').removeClass('is-valid');
		$('.meter-maker').removeClass('is-valid');
		$('.full-load-i').removeClass('is-valid');
		$('.no-load-i').removeClass('is-valid');
		$('.off-load-i').removeClass('is-valid');
		$('.unit-rate').removeClass('is-valid');
	}


}]);

// window.onload = ()=>{
// 	$("#list").DataTable({
//       "responsive": true,
//       "autoWidth": false,
//     });

// }
