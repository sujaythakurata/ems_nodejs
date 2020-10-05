
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
				label:'Kwh',
				backgroundColor:['#00cc00', '#999999', '#ff471a'],
				borderCapStyle:"round",
			},

		],

	};

	//s_c1_opt
	const s_c1_opt = {
		maintainAspectRatio:false,
		cutoutPercentage:70,
		legend:{
			display:true
		},
		tooltips:{
			position:"nearest",
			bodyAlign:"right",
			titleAlign:'right',
			yAlign: 'bottom',
			xAlign: 'center'
		},
		animation: {
            duration: 0 // general animation time
        },
        hover: {
            animationDuration: 0 // duration of animations when hovering an item
        },
        responsiveAnimationDuration: 0, // animation duration after a resize
	};

	//s_c1 chart
	const s_c1 = new Chart(s_c1_ctx, {
		type:'doughnut',
		data:s_c1_dataset,
		options: s_c1_opt,

	});

	//s_c2
	const s_c2_ctx = document.getElementById('s-c2').getContext('2d');

	//s_c2_dataset
	const s_c2_dataset = {
		labels:[],
		datasets:[
			{	
				data:[],
				label:'FULL LOAD HOUR',
				borderColor:'#00cc00',
				backgroundColor:'#00cc00',
				borderCapStyle:"round",
				borderWidth:0,
			},
			{	
				data:[],
				label:'NO LOAD HOUR',
				borderColor:'#999999',
				backgroundColor:'#999999',
				borderCapStyle:"round",
				borderWidth:0,
			},
			{	
				data:[],
				label:'OFF LOAD HOUR',
				borderColor:'#ff471a',
				backgroundColor:'#ff471a',
				borderCapStyle:"round",
				borderWidth:0,
			}

		],

	};

	//s_c2_opt
	const s_c2_opt = {
		maintainAspectRatio:false,
		legend:{
			display:false
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
                    let v =  item.xLabel+" Hrs.";
					label += v;
                    return label;
				}
			}
		 },
		scales:{
			yAxes:[{
				stacked:true,
				scaleLabel:{
				display:true,
				labelString:"Power",
				padding:0,
				fontColor:'#000000',
				fontStyle:'bold',
				fontFamily:"Helvetica",


			},
			gridLines:{
				drawTicks:false,
				drawOnChartArea:false,
				color:'#000000',//'#f0f5f5',
				zeroLineColor:"#002633",
				zeroLineWidth:1,
				
			},
			ticks:{
				padding:10,
				fontColor:'#000000',
				fontStyle:'normal',
				fontFamily:"Helvetica",
				stepSize:20,
				autoSkip:true,
				sampleSize:10,
			}
			}],
			xAxes:[{
				stacked:true,
				scaleLabel:{
					display:true,
					labelString:"Date",
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
					autoSkip:true,
					sampleSize:10,
					maxTicksLimit: 12,
					callback:function(value, index, values){
						return value+" hrs.";
					},
				},
				gridLines:{
					drawTicks:false,
					drawOnChartArea:false,
					color:'#000000',
				},

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

	//s_c2 chart
	const s_c2 = new Chart(s_c2_ctx, {
		type:'horizontalBar',
		data:s_c2_dataset,
		options: s_c2_opt,

	});

	//s_c3
	const s_c3_ctx = document.getElementById('s-c3').getContext('2d');

	//s_c3_dataset
	const s_c3_dataset = {
		labels:[],
		datasets:[
			{	
				data:[],
				label:'Kwh',
				borderColor:'#9999ff',
				backgroundColor:'#9999ff',
				borderCapStyle:"round",
				borderWidth:0,
			},

		],

	};

	//s_c3_opt
	const s_c3_opt = {
		maintainAspectRatio:false,
		legend:{
			display:false
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
				maxTicksLimit: 12,
				beginAtZero:true


			},
			gridLines:{
				drawTicks:false,
				drawOnChartArea:true,
				color:'#f0f5f5',
				zeroLineColor:"#002633",
				zeroLineWidth:1,
				
			}
			}],
			xAxes:[{
				scaleLabel:{
					display:true,
					labelString:"Date",
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
					autoSkip:true,
					sampleSize:10,
					maxTicksLimit: 31
				},
				gridLines:{
					drawTicks:false,
					drawOnChartArea:false,
					color:'#000000',
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

	//s_c3 chart
	const s_c3 = new Chart(s_c3_ctx, {
		type:'bar',
		data:s_c3_dataset,
		options: s_c3_opt,

	});


	//t_c1 ctx
	const t_c1_ctx = document.getElementById('t-c1').getContext('2d');
	//t_c1 dataset
	const t_c1_dataset = {
		labels:[],
		datasets:[
			{	
				data:[],
				label:'W_sum',
				borderColor:'#9999ff',
				backgroundColor:'#9999ff',
				borderCapStyle:"round",
				borderWidth:0,
			},

		],

	};

	//t_c1_opt
	const t_c1_opt = {
		maintainAspectRatio:false,
		legend:{
			display:false
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
				maxTicksLimit: 12,
				beginAtZero:true


			},
			gridLines:{
				drawTicks:false,
				drawOnChartArea:true,
				color:'#f0f5f5',
				zeroLineColor:"#002633",
				zeroLineWidth:1,
				
			}
			}],
			xAxes:[{
				scaleLabel:{
					display:true,
					labelString:"Date",
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
					autoSkip:true,
					sampleSize:10,
					maxTicksLimit: 31
				},
				gridLines:{
					drawTicks:false,
					drawOnChartArea:false,
					color:'#000000',
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
		type:'bar',
		data:t_c1_dataset,
		options:t_c1_opt
	})


	//t_c2
	const t_c2_ctx = document.getElementById('t-c2').getContext('2d');

	//t_c2_dataset
	const t_c2_dataset = {
		labels:[],
		datasets:[
			{	
				data:[],
				label:'FULL LOAD HOUR',
				borderColor:'#9999ff',
				backgroundColor:'#9999ff',
				borderCapStyle:"round",
				borderWidth:0,
			},

		],

	};

	//t_c2_opt
	const t_c2_opt = {
		maintainAspectRatio:false,
		legend:{
			display:false
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
                    let v =  item.yLabel + "%";
					label += v;
                    return label;
				}
			}
		},
		scales:{
			yAxes:[{
				scaleLabel:{
				display:true,
				labelString:"FULL LOAD HOUR",
				padding:0,
				fontColor:'#000000',
				fontStyle:'bold',
				fontFamily:"Helvetica",


			},
			ticks:{
				callback:function(value, index, values){
					return value+"%";
				
				},
				padding:10,
				fontColor:'#000000',
				fontStyle:'normal',
				fontFamily:"Helvetica",
				stepSize:20,
				autoSkip:true,
				sampleSize:10,
				maxTicksLimit: 12,
				beginAtZero:true


			},
			gridLines:{
				drawTicks:false,
				drawOnChartArea:true,
				color:'#f0f5f5',
				zeroLineColor:"#002633",
				zeroLineWidth:1,
				
			}
			}],
			xAxes:[{
				scaleLabel:{
					display:true,
					labelString:"Date",
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
					autoSkip:true,
					sampleSize:10,
					maxTicksLimit: 31
				},
				gridLines:{
					drawTicks:false,
					drawOnChartArea:false,
					color:'#000000',
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
		type:'bar',
		data:t_c2_dataset,
		options: t_c2_opt
	})


