var ajaxIp = httpUrl.head;

(function () {
	listFloorWorkStation();
})();
//每个楼层工位列表
function listFloorWorkStation() {
	var ssss = getQueryString('subscribeId')
	// ssss = 'df4c261e-1d1d-44e3-94a3-b74caa38c337';
	if (ssss) {
		$.ajax({
			type: 'GET',
			url: ajaxIp + 'subscribe/detail/' + ssss,
			data: '',
			dataType: 'json',
			success: function (data) {
				$(".station").remove();
				if (data.dataList[0]) {
					var item = data.dataList[0]

					$("#company").html(item.orgName);
					$("#address").html(item.orgAddress);
					$('#start-date').html(item.startTime);
					$('#end-date').html(item.endTime);
					$(".select-type").html(item.floor)
					$("#map").attr('src', 'images/' + item.floorId + '.png');
					if (item.floorId == '0036ec50-304b-4be9-9640-5897d261b99b') {
						$("#map").css("width", '3.6rem');
						$("#map").css("height", '4.5rem');
					} else if (item.floorId == '00583000-825e-46b7-b6b3-5067be01d969') {
						$("#map").css("width", '9.3rem');
						$("#map").css("height", '3.5rem');
					}
					
					var htmlss = '<div class="station station2" id="station' + item.id + '" number="' + item.workstationNum + '" name="station"></div>';
					$(".img-stations").append(htmlss);
					$("#station" + item.id).css("top", item.workstationPoTop + "rem");
					$("#station" + item.id).css("left", item.workstationPoLeft + "rem");
					$('.select-station').html(item.workstationNum)
				}

			},
			error: function (err) {
				alert(err)
			}
		})
	} else {
		alert('未获取到要查询的预约ID')
	}

}

function getQueryString(name) {
	var reg = new RegExp("(^|&)" + name + "=([^&]*)(&|$)", "i");
	var r = window.location.search.substr(1).match(reg);
	if (r != null) return unescape(r[2]);
	return null;
}