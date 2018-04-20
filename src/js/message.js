$(function () {
    var ajaxIp = httpUrl.head;
    var userInfo = JSON.parse(localStorage.userInfo);
    var userId = userInfo.userId
	$.ajax({
		type: 'GET',
		url: ajaxIp + 'subscribe/listNotificationNumber/' + userId + '/15',
		data: {},
		dataType: 'json',
		success: function (data) {
			$("#allmessages").html('');			
			if (data.dataList) {
				$.each(data.dataList, function (i, item) {
					var htmlss = '<div class="message" ><div class="content">'+item.content+'</div><div class="time">'+item.modifiedTime+'</div></div>';
					$("#allmessages").append(htmlss);
				});

			} else {
			}
		},
		error: function (err) {
			alert(err)
		}
	})
})
