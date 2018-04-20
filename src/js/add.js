var ajaxIp = httpUrl.head;
	; (function () {
		var Page = {
			init: function () {
				var that = this;
				//防止300毫秒点击延迟
				FastClick.attach(document.body);
				//绑定事件
				this.bind();
				//绑定左上角返回事件
				this.setLeft();
				//初始化导航的title,采用事件的方式实现解耦
				$('body').trigger('navigation.title.change', [{
					"title": "选择工作地址"
				}]);
				
			
			},
			bind: function () {
				//采用事件监听的方式是为了能够在统一一个地方设置导航的Title
				$('body').on('navigation.title.change', function (e, res) {
					dd.biz.navigation.setTitle({
						title: res.title
					});
				});
				//采用事件监听的方式是为了能够在统一一个地方设置导航的右上角按钮文案及点击事件
				$('body').on('navigation.rightButton.change', function (e, res) {
					dd.biz.navigation.setRight({
						show: res.show,//控制按钮显示， true 显示， false 隐藏， 默认true
						control: true,//是否控制点击事件，true 控制，false 不控制， 默认false
						showIcon: true,//是否显示icon，true 显示， false 不显示，默认true； 注：具体UI以客户端为准
						text: res.text,
						onSuccess: function () {
							res.callback && res.callback();
						}
					});
				});
				$('#task-add .datepicker').on('click', function () {
					var node = $(this).find('.date');
					var v = node.html().trim();
					dd.biz.util.datepicker({
						format: 'yyyy-MM-dd',
						value: v, //默认显示日期
						onSuccess: function (result) {
							/*{
								value: "2015-02-10"
							}
							*/
							var dateStart = result.value;
							var timeStart = '08:30';
							dd.device.notification.confirm({
								message: "请选择具体签到时间：",
								title: "提示",
								buttonLabels: ['08:30', '13:30'],
								onSuccess: function (result) {
									// alert(JSON.stringify(result))
									timeStart = result.buttonIndex == 0 ? '08:30' : '13:30';
									node.html(dateStart + ' ' + timeStart);
									
								},
								onFail: function (err) { }
							});

						},
						onFail: function () { }
					});
				});

				$('#task-add .select-type').on('click', function () {
					var node = $(this).find('.select');
					var s = $(this).find('input[name=taskType]');
					var v = node.html().trim();
					dd.biz.util.chosen({
						source: [{
							key: '非常紧急', //显示文本
							value: 1
						}, {
							key: '紧急',
							value: 2
						}, {
							key: '一般',
							value: 3
						}],
						selectedKey: v,
						onSuccess: function (result) {
							
							node.html(result.key);
							s.val(result.value);
						},
						onFail: function () { }
					})
				});
			},
			setLeft: function () {
				var that = this;
				dd.biz.navigation.setLeft({
					show: true,//控制按钮显示， true 显示， false 隐藏， 默认true
					control: true,//是否控制点击事件，true 控制，false 不控制， 默认false
					showIcon: true,//是否显示icon，true 显示， false 不显示，默认true； 注：具体UI以客户端为准       
					onSuccess: function (result) {
						dd.device.notification.confirm({
							message: "新增任务还未保存",
							title: "提示",
							buttonLabels: ['不保存', '继续'],
							onSuccess: function (result) {
								/*
								{
									buttonIndex: 0 //被点击按钮的索引值，Number类型，从0开始
								}
								*/
								if (result.buttonIndex == 0) {
									// alert(44)
									dd.biz.navigation.close();
								}
							},
							onFail: function (err) { }
						});
					},
					onFail: function (err) { }
				});


			}
		};
		getOrgList();
		//为了能够在PC端进行测试
		if (dd.version) {
			dd.ready(function () {
				Page.init();
			});
		} else {
			Page.init();
		}
	})();
function getOrgList() {
	$.ajax({
		type: 'GET',
		url: ajaxIp + 'org/list',
		data: {},
		dataType: 'json',
		success: function (data) {
			if (data.dataList.length > 0) {
				$(".addresses").html("");
				$.each(data.dataList, function (i, item) {
					var htmlStr = '<div class="address" key="'+item.id+'"><img src="' + item.pictureUrl + '" class="a-image"><div>';
					htmlStr += '<div class ="a-name">' + item.name + '</div>';
					htmlStr += '<div class ="a-address">' + item.address + '</div></div></div>'
					$(".addresses").append(htmlStr)
				})

				$(".address").on('click', function () {
					// if ($(event.target).attr('class') === 'a-image'||$(event.target).attr('class') === 'address'||$(event.target).attr('class') === 'a-address'||$(event.target).attr('class') === 'a-name'){
						var aname = $('.a-name',this).text();
						var aaddress = $('.a-address',this).text();
						var obj ={
							name:aname,
							id:$(this).attr('key'),
							address:aaddress
						}
						localStorage.setItem('addressData',JSON.stringify(obj));
						dd.biz.util.openLink({
							url: location.protocol + '//' + location.host + '/' +'picture.html'
						});
					// }
					
				})

			} else {

			}


		},
		error: function (err) {
			alert(err)
		}
	})
}