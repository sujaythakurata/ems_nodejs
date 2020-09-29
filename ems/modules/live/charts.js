
//zoom plugin for chart
const plugins = {
    zoom: {
        // Container for pan options
        pan: {
            // Boolean to enable panning
            enabled: true,
            mode: 'x',
            // On category scale, factor of pan velocity
            speed: 20,
            // Minimal pan distance required before actually applying pan
            threshold: 10,

        },
        // Container for zoom options
        zoom: {
            // Boolean to enable zooming
            enabled: true,
            // Enable drag-to-zoom behavior
            drag: false,
            mode: 'x',
            speed: 0.1,
            // Minimal zoom distance required before actually applying zoom
            threshold: 2,
            // On category scale, minimal zoom level before actually applying zoom
            sensitivity: 3,
        }
    }
}

	//s_c1
	const s_c1_ctx = document.getElementById('s-c1').getContext('2d');

	//s_c1_dataset
	const s_c1_dataset = {
		labels:[],
		datasets:[
			{	
				data:[],
				label:'Active Power',
				fill:false,
				borderColor:'#9999ff',
				backgroundColor:'#9999ff',
				borderCapStyle:"round",
				borderWidth:2,
				lineTension:0,
				radius:1.5,
				bezierCurve : false,
				pointHitRadius:5,
				hoverRadius:5,
			},
			{
				data:[],
				label:'Reactive Power',
				fill:false,
				borderColor:'#66ccff',
				borderWidth:2,
				lineTension:0,
				backgroundColor:'#66ccff',
				radius:1.5,
				bezierCurve : false,
				pointHitRadius:5,
				hoverRadius:5,

			},
			{
				data:[],
				label:'Apparent Power',
				fill:false,
				borderColor:'#ff9933',
				backgroundColor:'#ff9933',
				borderWidth:2,
				lineTension:0,
				radius:1.5,
				bezierCurve : false,
				pointHitRadius:5,
				hoverRadius:5,

			},

		],

	};

	//s_c1_opt
	const s_c1_opt = {
		maintainAspectRatio:false,
		legend:{
			display:true
		},
		tooltips:{
			mode:'index',
			intersect:false,
			callbacks:{
				label:function(item, data){
					var label = data.datasets[item.datasetIndex].label || '';
					if (label) {
                        label += ': ';
                    }
                    let v =  item.yLabel;
					if(v<Math.pow(10, 6) && v>=1000){
						v =  (v/1000).toFixed(2)+"KW";
					}else if(v>=Math.pow(10, 6)){
						v =  (v/Math.pow(10, 6)).toFixed(2)+"MW";
					}else
						v =  v+"W";
					label += v;
                    return label;
				}
			}
		},
		scales:{
			yAxes:[{
				scaleLabel:{
				display:true,
				labelString:"Power",
				padding:0,
				fontColor:'#000000',
				fontStyle:'bold',
				fontFamily:"Helvetica",


			},
			ticks:{
				callback:function(value, index, values){
					let v  = parseFloat(value);
					if(v<Math.pow(10, 6) && v>=1000){
						return (v/1000).toFixed(2)+"KW";
					}else if(v>=Math.pow(10, 6)){
						return (v/Math.pow(10, 6)).toFixed(2)+"MW";
					}else
						return v+"W";
				
				},
				padding:10,
				fontColor:'#000000',
				fontStyle:'normal',
				fontFamily:"Helvetica",
				stepSize:20,
				autoSkip:true,
				sampleSize:10,
				maxTicksLimit: 20,


			},
			gridLines:{
				drawTicks:false,
				offsetGridLines:true,
				zeroLineColor:"#000000",
				zeroLineWidth:10,
				color:'#f2f2f2',
				lineWidth:1.5
			}
			}],
			xAxes:[{
				type:'time',
				time:{
					unit:'second',
					minUnit:'minute',
     				parser:function(val1, val2, val3){
     					return new Date(val1);
     				},
     				tooltipFormat:'MMMM Do YYYY, h:mm:ss a'
				},
				scaleLabel:{
					display:true,
					labelString:"Time",
					padding:0,
					fontColor:'#000000',
					fontStyle:'bold',
					fontFamily:"Helvetica"

				},
				ticks:{
					padding:10,
					fontColor:'#000000',
					fontStyle:'normal',
					fontFamily:"Helvetica",
					stepSize:100,
					fontSize:10,
					bound:'data',
					//source:'data'
					autoSkip:true,
					sampleSize:10,
					maxTicksLimit: 20
     				//min:new Date(),
     				//min:moment(new Date()).subtract(60, 'minutes').format('YYYY-MM-DD HH:mm:ss'), 
     				
				},
				gridLines:{
					drawTicks:false,
					offsetGridLines:true,
					drawOnChartArea:false,
					color:'#000000'
				}
			}]
		},
		animation: {
            duration: 0 // general animation time
        },
        hover: {
            animationDuration: 0 // duration of animations when hovering an item
        },
        responsiveAnimationDuration: 0, // animation duration after a resize
        plugins:plugins
	};

	//s_c1 chart
	const s_c1 = new Chart(s_c1_ctx, {
		type:'line',
		data:s_c1_dataset,
		options: s_c1_opt,

	});

	//s_c2
	const s_c2_ctx = document.getElementById('s-c2').getContext('2d');

	//s_c2_dataset
	const s_c2_dataset = {
		labels:['Neural Currrent'],
		datasets:[
			{	
				data:[20, 80],
				borderColor:' #b3c6ff',
				backgroundColor:['#4d79ff', "#b3c6ff"],
				borderCapStyle:"round",
				borderWidth:0,
				radius:1.5,
				borderCapStyle:'round',
				weight:5
			}

		],

	};

	//s_c2_opt
	const s_c2_opt = {
		maintainAspectRatio:false,
		circumference:Math.PI,
		rotation:Math.PI,
		legend:{
			display:true
		},
		tooltips:{
			enabled:false
		}

	};

	//s_c2 chart
	const s_c2 = new Chart(s_c2_ctx, {
		type:'doughnut',
		data:s_c2_dataset,
		options: s_c2_opt
	});

	//s_c3
	const s_c3_ctx = document.getElementById('s-c3').getContext('2d');

	//s_c3_dataset
	const s_c3_dataset = {
		labels:['Frequency'],
		datasets:[
			{	
				data:[30, 70],
				backgroundColor:['#ff4d4d', '#ffcccc'],
				borderCapStyle:"round",
				borderWidth:0,
				hoverBackgroundColor:undefined
			}

		],

	};

	//s_c3_opt
	const s_c3_opt = {
		maintainAspectRatio:false,
		cutoutPercentage:60,
		legend:{
			display:true
		},
		tooltips:{
			enabled:false
		}

	};

	//s_c3 chart
	const s_c3 = new Chart(s_c3_ctx, {
		type:'doughnut',
		data:s_c3_dataset,
		options: s_c3_opt
	});


	//t_c1 ctx
	const t_c1_ctx = document.getElementById('t-c1').getContext('2d');
	//t_c1 dataset
	const t_c1_dataset = {
		labels:[],
		datasets:[
			{	
				data:[],
				label:'Phase 1',
				//fill:false,
				borderColor:'#2e5cb8',
				backgroundColor:'#d6e0f5',
				borderCapStyle:"round",
				borderWidth:2,
				//lineTension:0,
				radius:2,
				pointHitRadius:5,
				hoverRadius:5
				//bezierCurve : false,
			},
			{
				data:[],
				label:'Phase 2',
				//fill:false,
				borderColor:'#0099cc',
				backgroundColor:'#ccf2ff',
				borderCapStyle:"round",
				borderWidth:2,
				//lineTension:0,
				radius:2,
				pointHitRadius:5,
				hoverRadius:5
				//bezierCurve : false,


			},
			{
				data:[],
				label:'Phase 3',
				//fill:false,
				borderColor:'#9933ff',
				backgroundColor:'#d9b3ff',
				borderCapStyle:"round",
				borderWidth:2,
				//lineTension:0,
				radius:2,
				pointHitRadius:5,
				hoverRadius:5
				//bezierCurve : false,

			},

		],

	};

	const t_c1_opt = {
		maintainAspectRatio:false,
		legend:{
			display:true
		},
		tooltips:{
			mode:'index',
			intersect:false,
			callbacks:{
				label:function(item, data){
					var label = data.datasets[item.datasetIndex].label || '';
					if (label) {
                        label += ': ';
                    }
                    let v =  item.yLabel;
					if(v<Math.pow(10, 6) && v>=1000){
						v =  (v/1000).toFixed(2)+"KV";
					}else if(v>=Math.pow(10, 6)){
						v =  (v/Math.pow(10, 6)).toFixed(2)+"MV";
					}else
						v =  v+"V";
					label += v;
                    return label;
				}
			}
		},
		scales:{
			yAxes:[{
				scaleLabel:{
				display:true,
				labelString:"Voltage, V",
				padding:0,
				fontColor:'#000000',
				fontStyle:'bold',
				fontFamily:"Helvetica"

			},
			ticks:{
				callback:function(value, index, values){
					let v  = parseFloat(value);
					if(v<Math.pow(10, 6) && v>=1000){
						return (v/1000).toFixed(2)+"KV";
					}else if(v>=Math.pow(10, 6)){
						return (v/Math.pow(10, 6)).toFixed(2)+"MV";
					}else
						return v+"V";
				},
				padding:10,
				fontColor:'#000000',
				fontStyle:'normal',
				fontFamily:"Helvetica",
				stepSize:20,
				autoSkip:true,
				sampleSize:10,
				maxTicksLimit: 20,
			},
			gridLines:{
				drawTicks:false,
				offsetGridLines:true,
				zeroLineColor:"#000000",
				zeroLineWidth:10,
				color:'#f0f5f5'
			}
			}],
			xAxes:[{
				type:'time',
				time:{
					unit:'second',
					minUnit:'minute',
     				parser:function(val1, val2, val3){
     					return new Date(val1);
     				},
     				stepSize:10,
     				tooltipFormat:'MMMM Do YYYY, h:mm:ss a'

				},
				scaleLabel:{
					display:true,
					labelString:"Time",
					padding:0,
					fontColor:'#000000',
					fontStyle:'bold',
					fontFamily:"Helvetica"

				},
				ticks:{
					padding:10,
					fontColor:'#000000',
					fontStyle:'normal',
					fontFamily:"Helvetica",
					stepSize:10,
					autoSkip:true,
					sampleSize:10,
					maxTicksLimit: 20,
					bound:'data',
					fontSize:10
				},
				gridLines:{
					drawTicks:false,
					offsetGridLines:true,
					drawOnChartArea:false,
					color:'#000000'
				}
			}]
		},
		animation: {
            duration: 0 // general animation time
        },
        hover: {
            animationDuration: 0 // duration of animations when hovering an item
        },
        responsiveAnimationDuration: 0, // animation duration after a resize
		plugins:plugins
	};

	const t_c1 = new Chart(t_c1_ctx, {
		type:'line',
		data:t_c1_dataset,
		options:t_c1_opt
	})


	//t_c2
	const t_c2_ctx = document.getElementById('t-c2').getContext('2d');
	//gradient
	t_c2_ctx_p1 = t_c2_ctx.createLinearGradient(0,0,0,200);
	t_c2_ctx_p1.addColorStop(0.3,'#ff9999');
	t_c2_ctx_p1.addColorStop(0.6,'#ff0023');
	t_c2_ctx_p1.addColorStop(.9,'#ffcccc');
	t_c2_ctx_p2 = t_c2_ctx.createLinearGradient(0,0,0,200);
	t_c2_ctx_p2.addColorStop(0.3,'#99ccff');
	t_c2_ctx_p2.addColorStop(0.6,'#4da6ff');
	t_c2_ctx_p2.addColorStop(.9,'#cce6ff');
	t_c2_ctx_p3 = t_c2_ctx.createLinearGradient(0,0,0,200);
	t_c2_ctx_p3.addColorStop(0.3,'#ccffcc');
	t_c2_ctx_p3.addColorStop(0.6,'#80ff80');
	t_c2_ctx_p3.addColorStop(.9,'#e6ffe6');
	const t_c2_dataset = {
		labels:[],
		datasets:[
			{	
				data:[],
				label:'Line 1',
				//fill:false,
				borderColor:'#ff0023',
				backgroundColor:t_c2_ctx_p1,//'#9999ff',
				borderCapStyle:"round",
				borderWidth:1.5,
				radius:0,
				pointHitRadius:5,
				hoverRadius:5,
				lineTension:0,
				bezierCurve : false,
			},
			{
				data:[],
				label:'Line 2',
				//fill:false,
				borderColor:'#4da6ff',
				borderWidth:1.5,
				lineTension:0,
				backgroundColor:t_c2_ctx_p2,//'#66ccff',
				radius:0,
				pointHitRadius:5,
				hoverRadius:5,
				bezierCurve : false,

			},
			{
				data:[],
				label:'Line 3',
				//fill:false,
				borderColor:'#80ff80',
				backgroundColor:t_c2_ctx_p3, //'#ff9933',
				borderWidth:1.5,
				lineTension:0,
				radius:0,
				pointHitRadius:5,
				hoverRadius:5,
				bezierCurve : false,

			},

		],

	};

	const t_c2_opt = {
		maintainAspectRatio:false,
		legend:{
			display:true
		},
		tooltips:{
			mode:'index',
			intersect:false,
			callbacks:{
				label:function(item, data){
					var label = data.datasets[item.datasetIndex].label || '';
					if (label) {
                        label += ': ';
                    }
                    let v =  item.yLabel;
					if(v<Math.pow(10, 6) && v>=1000){
						v =  (v/1000).toFixed(2)+"KV";
					}else if(v>=Math.pow(10, 6)){
						v =  (v/Math.pow(10, 6)).toFixed(2)+"MV";
					}else
						v =  v+"V";
					label += v;
                    return label;
				}
			}
		},
		scales:{
			yAxes:[{
				scaleLabel:{
				display:true,
				labelString:"Voltage, V",
				padding:0,
				fontColor:'#000000',
				fontStyle:'bold',
				fontFamily:"Helvetica",

			},
			ticks:{
				callback:function(value, index, values){
					let v  = parseFloat(value);
					if(v<Math.pow(10, 6) && v>=1000){
						return (v/1000).toFixed(2)+"KV";
					}else if(v>=Math.pow(10, 6)){
						return (v/Math.pow(10, 6)).toFixed(2)+"MV";
					}else
						return v+"V";
				},
				padding:10,
				fontColor:'#000000',
				fontStyle:'normal',
				fontFamily:"Helvetica",
				stepSize:20,
				autoSkip:true,
				sampleSize:10,
				maxTicksLimit: 20,
			},
			gridLines:{
				drawTicks:false,
				offsetGridLines:true,
				zeroLineColor:"#000000",
				zeroLineWidth:10,
				color:'#f0f5f5'
			}
			}],
			xAxes:[{
				type:'time',
				time:{
					unit:'second',
					minUnit:'minute',
     				parser:function(val1, val2, val3){
     					return new Date(val1);
     				},
     				stepSize:10,
     				tooltipFormat:'MMMM Do YYYY, h:mm:ss a'

				},
				scaleLabel:{
					display:true,
					labelString:"Time",
					padding:0,
					fontColor:'#000000',
					fontStyle:'bold',
					fontFamily:"Helvetica"

				},
				ticks:{
					padding:10,
					fontColor:'#000000',
					fontStyle:'normal',
					fontFamily:"Helvetica",
					stepSize:10,
					autoSkip:true,
					sampleSize:10,
					maxTicksLimit: 20,
					bound:'data',
					fontSize:10
				},
				gridLines:{
					drawTicks:false,
					offsetGridLines:true,
					drawOnChartArea:false,
					color:'#000000'
				}
			}]
		},
		animation: {
            duration: 0 // general animation time
        },
        hover: {
            animationDuration: 0 // duration of animations when hovering an item
        },
        responsiveAnimationDuration: 0, // animation duration after a resize
		plugins:plugins
	};

	const t_c2 = new Chart(t_c2_ctx, {
		type:'line',
		data:t_c2_dataset,
		options: t_c2_opt
	})

	//f_c1
	const f_c1_ctx = document.getElementById('f-c1').getContext('2d');

	const f_c1_dataset = {
		labels:[],
		datasets:[
			{	
				data:[],
				label:'I1',
				fill:false,
				borderColor:'#ff1aff',
				backgroundColor:'#ff1aff',
				borderCapStyle:"round",
				borderWidth:1,
				//lineTension:0,
				radius:4,
				pointHitRadius:5,
				hoverRadius:7,
			},
			{
				data:[],
				label:'I2',
				fill:false,
				borderColor:'#3333cc',
				borderWidth:1,
				//lineTension:0,
				backgroundColor:'#3333cc',
				radius:4,
				pointHitRadius:5,
				hoverRadius:7,
				pointStyle:'rect'

			},
			{
				data:[],
				label:'I3',
				fill:false,
				borderColor:'#0066ff',
				backgroundColor:'#0066ff',
				borderWidth:1,
				//lineTension:0,
				radius:4,
				pointHitRadius:5,
				hoverRadius:7,
				pointStyle:'triangle'

			},
		],

	};

	const f_c1_opt = {
		maintainAspectRatio:false,
		legend:{
			display:true
		},
		tooltips:{
			mode:'index',
			intersect:false,
			callbacks:{
				label:function(item, data){
					var label = data.datasets[item.datasetIndex].label || '';
					if (label) {
                        label += ': ';
                    }
                    let v =  item.yLabel;
					if(v<Math.pow(10, 6) && v>=1000){
						v =  (v/1000).toFixed(2)+"KA";
					}else if(v>=Math.pow(10, 6)){
						v =  (v/Math.pow(10, 6)).toFixed(2)+"MA";
					}else
						v =  v+"A";
					label += v;
                    return label;
				}
			}
		},
		scales:{
			yAxes:[{
				scaleLabel:{
				display:true,
				labelString:"Current, A",
				padding:0,
				fontColor:'#000000',
				fontStyle:'bold',
				fontFamily:"Helvetica"

			},
			ticks:{
				callback:function(value, index, values){
					let v  = parseFloat(value);
					if(v<Math.pow(10, 6) && v>=1000){
						return (v/1000).toFixed(2)+"KA";
					}else if(v>=Math.pow(10, 6)){
						return (v/Math.pow(10, 6)).toFixed(2)+"MA";
					}else
						return v+"A";
				},
				padding:10,
				fontColor:'#000000',
				fontStyle:'normal',
				fontFamily:"Helvetica",
				stepSize:20,
				autoSkip:true,
				sampleSize:10,
				maxTicksLimit: 20,
			},
			gridLines:{
				drawTicks:false,
				offsetGridLines:true,
				zeroLineColor:"#000000",
				zeroLineWidth:10,
				color:'#f0f5f5'
			}
			}],
			xAxes:[{
				type:'time',
				time:{
					unit:'second',
					minUnit:'minute',
     				parser:function(val1, val2, val3){
     					return new Date(val1);
     				},
     				stepSize:10,
     				tooltipFormat:'MMMM Do YYYY, h:mm:ss a'

				},
				scaleLabel:{
					display:true,
					labelString:"Time",
					padding:0,
					fontColor:'#000000',
					fontStyle:'bold',
					fontFamily:"Helvetica"

				},
				ticks:{
					padding:10,
					fontColor:'#000000',
					fontStyle:'normal',
					fontFamily:"Helvetica",
					stepSize:20,
					autoSkip:true,
					sampleSize:10,
					maxTicksLimit: 20,
					fontSize:10
				},
				gridLines:{
					drawTicks:false,
					offsetGridLines:true,
					drawOnChartArea:false,
					color:'#000000'
				}
			}]
		},
		animation: {
            duration: 0 // general animation time
        },
        hover: {
            animationDuration: 0 // duration of animations when hovering an item
        },
        responsiveAnimationDuration: 0, // animation duration after a resize
		plugins:plugins
	};

	const f_c1 = new Chart(f_c1_ctx, {
		type:'line',
		data:f_c1_dataset,
		options: f_c1_opt
	})


	//f_c2
	const f_c2_ctx = document.getElementById('f-c2').getContext('2d');

	//create gradiant 
	f_c2_gradiant_1 = f_c2_ctx.createLinearGradient(0,0,0,200);
	f_c2_gradiant_1.addColorStop(0.3,'#ff8800');
	f_c2_gradiant_1.addColorStop(0.6,'#ff0023');
	f_c2_gradiant_1.addColorStop(.9,'#7e001a');
	f_c2_gradiant_2 = f_c2_ctx.createLinearGradient(0,0,0,200);
	f_c2_gradiant_2.addColorStop(0.3,'#036b6a');
	f_c2_gradiant_2.addColorStop(0.6,'#4eff44');
	f_c2_gradiant_2.addColorStop(.9,'#036b6a');

	const f_c2_dataset = {
		labels:[],
		datasets:[
			{	
				data:[],
				label:'Current Harmonics',
				fill:false,
				borderColor:f_c2_gradiant_1,
				backgroundColor:f_c2_gradiant_1,
				borderCapStyle:"round",
				borderWidth:2,
				radius:2,
				pointHitRadius:5,
				hoverRadius:5,
			},
			{
				data:[],
				label:'Voltage Harmonics',
				fill:false,
				borderColor:f_c2_gradiant_2,
				borderWidth:2,
				backgroundColor:f_c2_gradiant_2,
				radius:2,
				pointHitRadius:5,
				hoverRadius:5,

			}

		],

	};

	const f_c2_opt = {
		maintainAspectRatio:false,
		legend:{
			display:true
		},
		tooltips:{
			mode:'index',
			intersect:false,
			callbacks:{
				label:function(item, data){
					var label = data.datasets[item.datasetIndex].label || '';
					if (label) {
                        label += ': ';
                    }
                    let v =  item.yLabel;
					if(v<Math.pow(10, 6) && v>=1000){
						v =  (v/1000).toFixed(2)+"KHz";
					}else if(v>=Math.pow(10, 6)){
						v =  (v/Math.pow(10, 6)).toFixed(2)+"MHz";
					}else
						v =  v+"Hz";
					label += v;
                    return label;
				}
			}
		},
		scales:{
			yAxes:[{
				scaleLabel:{
				display:true,
				labelString:"Frequency",
				padding:0,
				fontColor:'#000000',
				fontStyle:'bold',
				fontFamily:"Helvetica"

			},
			ticks:{
				callback:function(value, index, values){
					let v  = parseFloat(value);
					if(v<Math.pow(10, 6) && v>=1000){
						return (v/1000).toFixed(2)+"KHz";
					}else if(v>=Math.pow(10, 6)){
						return (v/Math.pow(10, 6)).toFixed(2)+"MHz";
					}else
						return v+"Hz";
				},
				padding:10,
				fontColor:'#000000',
				fontStyle:'normal',
				fontFamily:"Helvetica",
				stepSize:20,
				autoSkip:true,
				sampleSize:10,
				maxTicksLimit: 20,
				fontSize:10
			},
			gridLines:{
				drawTicks:false,
				offsetGridLines:true,
				zeroLineColor:"#000000",
				zeroLineWidth:10,
				color:'#f0f5f5'
			}
			}],
			xAxes:[{
				type:'time',
				time:{
					unit:'second',
					minUnit:'minute',
     				parser:function(val1, val2, val3){
     					return new Date(val1);
     				},
     				stepSize:10,
     				tooltipFormat:'MMMM Do YYYY, h:mm:ss a'

				},
				scaleLabel:{
					display:true,
					labelString:"Time",
					padding:0,
					fontColor:'#000000',
					fontStyle:'bold',
					fontFamily:"Helvetica"

				},
				ticks:{
					padding:10,
					fontColor:'#000000',
					fontStyle:'normal',
					fontFamily:"Helvetica",
					stepSize:20,
					autoSkip:true,
					sampleSize:10,
					maxTicksLimit: 20,
					fontSize:10
				},
				gridLines:{
					drawTicks:false,
					offsetGridLines:true,
					drawOnChartArea:false,
					color:'#000000'
				}
			}]
		},
		animation: {
            duration: 0 // general animation time
        },
        hover: {
            animationDuration: 0 // duration of animations when hovering an item
        },
        responsiveAnimationDuration: 0,
        plugins:plugins
	};	

	const f_c2 = new Chart(f_c2_ctx, {
		type:'line',
		data:f_c2_dataset,
		options: f_c2_opt
	});
