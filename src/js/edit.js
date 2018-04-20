var ajaxIp =  httpUrl.head;
var orgList = []
var floorList =[]
var stationList =[]
var stateList =[{key:'可预约',value:'1'},{key:'固定工位',value:'3'},{key:'故障工位',value:'0'}]

;(function(){
	// var addressData = JSON.parse(localStorage.addressData);
	// $("#company").html(addressData.name);
	// $("#address").html(addressData.address);
	var Page = { 
		init:function(){
			
			var that = this;
			//防止300毫秒点击延迟
			FastClick.attach(document.body);
			//绑定事件
			this.bind();
			//绑定左上角返回事件
			this.setLeft();
			//初始化导航的title,采用事件的方式实现解耦
			$('body').trigger('navigation.title.change',[{
				"title":"编辑工位"
			}]);
			//图上的座位点击
			$(".img-stations").on('click', function (event) {
				// console.log($(event.target).attr('id'));
				if($(event.target).attr('name')==='station'){
					$(".img-stations div").removeClass('station-active')
					$(event.target).addClass('station-active');
					$('.select-station .select').html($(event.target).attr('number'))
                    $("#taskStation").val($(event.target).attr('id'))
                    var stateName='可预约'
                    switch($(event.target).attr('status')){
                        case '1':stateName='可预约';break;
                        case '0':stateName='故障工位';break;
                        case '3':stateName='固定工位';break;
                    }
                    $('.select-state .select').html(stateName)
					$("#taskState").val($(event.target).attr('status'))
				}
				
			})
			//右上角变为提交
			$('body').trigger('navigation.rightButton.change',[{
				"text":"提交",
				"callback":function(){
					var obj = {};
				
					obj.stationId = $('#taskStation').val().replace('station','');
					obj.status = $('#taskState').val();
					if(!obj.stationId){
						dd.device.notification.toast({
							icon: 'error', //icon样式，有success和error，默认为空 0.0.2
							text: "请选择座位", //提示信息
							duration: 2, //显示持续时间，单位秒，默认按系统规范[android只有两种(<=2s >2s)]
							delay: 0, //延迟显示，单位秒，默认0
							onSuccess : function(result) {
								listFloorWorkStation()
							},
							onFail : function(err) {}
						}); 
						return;
					}
					$.ajax({
                        type: 'GET',
                        url: ajaxIp + 'workStation/updateWorkStationStatus/'+obj.stationId+'/'+obj.status,
                        data: {},
                        dataType: 'json',
                        success: function (data) {
                            // alert(JSON.stringify(data))
                            if(data.errorCode==='200'){
                                dd.device.notification.toast({
                                    icon: 'success', //icon样式，有success和error，默认为空 0.0.2
                                    text: '操作成功', //提示信息
                                    duration: 2, //显示持续时间，单位秒，默认按系统规范[android只有两种(<=2s >2s)]
                                    delay: 0, //延迟显示，单位秒，默认0
                                    onSuccess: function (result) {
                                        listFloorWorkStation()
                                    },
                                    onFail: function (err) { }
                                });
                            }else{
                                dd.device.notification.alert({
									message: data.errorMsg,
									title: "提示",//可传空
									buttonName: "收到",
                                    onSuccess: function (result) {
                                        // listFloorWorkStation()
                                    },
                                    onFail: function (err) { }
                                });
                            }
                            
                        },
                        error: function (err) {
                            alert(err)
                        }
                    })
					// localStorage.setItem('taskData',JSON.stringify(obj));
					// dd.biz.navigation.close();
					// dd.biz.util.openLink({
					// 	url: location.protocol + '//' + location.host + '/' +'confirm.html'
					// });
				}
			}]);
		},
		bind:function(){
			//采用事件监听的方式是为了能够在统一一个地方设置导航的Title
			$('body').on('navigation.title.change',function(e,res){
				dd.biz.navigation.setTitle({
				    title : res.title
				});
			});
			//采用事件监听的方式是为了能够在统一一个地方设置导航的右上角按钮文案及点击事件
			$('body').on('navigation.rightButton.change',function(e,res){
				dd.biz.navigation.setRight({
					show: res.show,//控制按钮显示， true 显示， false 隐藏， 默认true
					control: true,//是否控制点击事件，true 控制，false 不控制， 默认false
					showIcon: true,//是否显示icon，true 显示， false 不显示，默认true； 注：具体UI以客户端为准
					text: res.text,
					onSuccess:function(){
						res.callback&&res.callback();
					}
				});
			});
			//公司下拉列表
			$('#task-add .select-company').on('click',function(){
				var node = $(this).find('.select');
				var s = $(this).find('input[name=taskType]');
				var v = node.html().trim();
				dd.biz.util.chosen({
				    source:orgList,
				    selectedKey:v,
				    onSuccess : function(result) {
				        node.html(result.key);
						s.val(result.value);
						getFloorList(result.value)
				    },
				    onFail : function() {}
				})
			});
			//楼层下拉列表
			$('#task-add .select-floor').on('click',function(){
				var node = $(this).find('.select');
				var s = $(this).find('input[name=taskType]');
				var v = node.html().trim();
				dd.biz.util.chosen({
				    source:floorList,
				    selectedKey:v,
				    onSuccess : function(result) {
				        node.html(result.key);
						s.val(result.value);
						$("#map").attr('src','images/'+result.value+'.png');
						if(result.value=='0036ec50-304b-4be9-9640-5897d261b99b'){
							$("#map").css("width",'3.6rem');
							$("#map").css("height",'4.5rem');
						}else if(result.value=='00583000-825e-46b7-b6b3-5067be01d969'){
							$("#map").css("width",'9.3rem');
							$("#map").css("height",'3.5rem');
						}
						
						listFloorWorkStation();
				    },
				    onFail : function() {}
				})
			});
			//工位下拉列表
			$('#task-add .select-station').on('click',function(){
				var node = $(this).find('.select');
				var s = $(this).find('input[name=taskStation]');
				var v = node.html().trim();
				dd.biz.util.chosen({
				    source:stationList,
				    selectedKey:v,
				    onSuccess : function(result) {
				        node.html(result.key);
				        s.val(result.value);
				    },
				    onFail : function() {}
				})
            });
            //工位状态下拉列表
			$('#task-add .select-state').on('click',function(){
				var node = $(this).find('.select');
				var s = $(this).find('input[name=taskState]');
				var v = node.html().trim();
				dd.biz.util.chosen({
				    source:stateList,
				    selectedKey:v,
				    onSuccess : function(result) {
				        node.html(result.key);
				        s.val(result.value);
				    },
				    onFail : function() {}
				})
			});
		},
		setLeft:function(){
			var that = this;
			dd.biz.navigation.setLeft({
			    show: true,//控制按钮显示， true 显示， false 隐藏， 默认true
			    control: true,//是否控制点击事件，true 控制，false 不控制， 默认false
			    showIcon: true,//是否显示icon，true 显示， false 不显示，默认true； 注：具体UI以客户端为准       
			    onSuccess : function(result) {
			        dd.device.notification.confirm({
					    message: "新增任务还未保存",
					    title: "提示",
					    buttonLabels: ['不保存', '继续'],
					    onSuccess : function(result) {
					        /*
					        {
					            buttonIndex: 0 //被点击按钮的索引值，Number类型，从0开始
					        }
					        */
					        if(result.buttonIndex==0){
								alert(44)
					        	dd.biz.navigation.close();
					        }
					    },
					    onFail : function(err) {}
					});
			    },
			    onFail : function(err) {}
			});


		}
    };
    //获取单位
    getOrgList();
	// getOrgList(addressData.id);
	//为了能够在PC端进行测试
	if(dd.version){
		dd.ready(function(){
			Page.init();
		});
	}else{
		Page.init();
	}
})();
//获取单位内的楼层
function getFloorList(orgId){
	$.ajax({
		type: 'GET',
		url: ajaxIp+'org/listFloor/'+orgId,
		data: {},
		dataType: 'json',
		success: function (data) {
			var changeList = [];
			$.each(data.dataList,function(i,item){
				var ss = {};
				ss.value = item.id;
				ss.key = item.number;
				changeList.push(ss)
			})
			floorList = changeList
			console.log('THIS IS FLOOR',floorList);
            $(".select-floor .select").html(floorList[0].key)
            $("#map").attr('src', 'images/' + floorList[0].value + '.png');
			$("#taskFloor").val(floorList[0].value)
			listFloorWorkStation();
		},
		error: function (err) {
			alert(err)
		}
	})
}
//每个楼层工位列表
function listFloorWorkStation(){
	$.ajax({
		type: 'GET',
		url: ajaxIp+'workStation/listFloorWorkStation/'+$('#taskFloor').val(),
		data: '',
		dataType: 'json',
		success: function (data) {
            console.log('THIS IS STATIONS',data);
			var changeList = [];
			$(".station").remove();
			if(data.errorCode==='10003'){
				if(data.subscribe){
					// $('#start-date').html(data.subscribe.startTime)
					// $('#end-date').html(data.subscribe.endTime)
					var item = data.subscribe.workStationInfo
					var htmlss = '<div class="station station2" id="station'+item.id+'" number="'+item.number+'" name="station"></div>';
					$(".img-stations").append(htmlss);
					$("#station"+item.id).css("top",item.positiontop+"rem");
					$("#station"+item.id).css("left",item.positionleft+"rem");
					$('.select-station .select').html(item.number)
					$("#taskStation").val(item.id)
				}
			}else if(data.errorCode==='200'){
				$.each(data.dataList,function(i,item){
					
					if(item.status=='1'){
						var ss = {};
						ss.value = item.id;
						ss.key = item.number;
						changeList.push(ss)
					}
					
					//故障0 可用1 使用中2 固定3
					var htmlss = '<div class="station station'+item.status+'" id="station'+item.id+'" status="'+item.status+'" number="'+item.number+'" name="station"></div>';
					$(".img-stations").append(htmlss);
					$("#station"+item.id).css("top",item.positiontop+"rem");
					$("#station"+item.id).css("left",item.positionleft+"rem");
				})
				stationList = changeList
				// alert(JSON.stringify(data))
			}
			
		},
		error: function (err) {
			alert(err)
		}
	})
}
function getOrgList() {
	$.ajax({
		type: 'GET',
		url: ajaxIp + 'org/list',
		data: {},
		dataType: 'json',
		success: function (data) {
            console.log('THIS IS ORG ',data);
            var changeList = [];
			if (data.dataList.length > 0) {
                $.each(data.dataList,function(i,item){
						var ss = {};
						ss.value = item.id;
						ss.key = item.name +'('+item.address+')';
						changeList.push(ss)
                })
                orgList = changeList;
                console.log(orgList);
                getFloorList(orgList[0].value)
                $(".select-company .select").html(orgList[0].key)
                $("#taskCompany").val(orgList[0].value)
			} else {
			}


		},
		error: function (err) {
			alert(err)
		}
	})
}