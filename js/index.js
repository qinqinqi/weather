
$(".btn").click(function(){
    $("#citys").hide()
});

//获得城市IP
$.getScript("http://int.dpool.sina.com.cn/iplookup/iplookup.php?format=js",function(){
    var data=remote_ip_info;
    var city=data.city;
    getWeather(city);
});

//获得天气状况
function getWeather(city){
    $.ajax({
        url:"http://api.jisuapi.com/weather/query?appkey=2e601484516e5a9d&city="+city,
        dataType:"jsonp",
        success:function(r){
            $(".now_city_name").html(city);
            $(".now_temp span").html(r.result.temp);
            $(".now_status").html(r.result.weather);
            $(".now_wind").html(r.result.winddirect);
            $(".now_wind_leavel").html(r.result.windpower);
            let data1=r.result.daily;
            let data2=r.result.hourly;
            let data3=r.result.index;
            let weeks="";
            let hours="";
            let futures="";
            $.each(data1,function(index,val){
                if(index===0){
                    futures+=`
                        <div class="two_today">
			                <div class="two_today1">
				                <p class="today">今天</p>
				                <p class="today today_status">${val.day.weather}/${val.night.weather}</p>
			                </div>
			            <div class="two_today2">
				            <p class="today today_wendu">${val.day.temphigh}/${val.night.templow}°C</p>
				            <div class="today "><img src="weathercn02/${val.day.img}.png" alt=""></div>
			            </div>
		</div>`;
                }
                else if(index===1){
                    futures+=`
                    <div class="two_today two_tomorrow">
							<div class="two_today1">
				                <p class="today">明天</p>
				                <p class="today today_status">${val.day.weather}/${val.night.weather}</p>
			                </div>
			                <div class="two_today2">
				                <p class="today today_wendu">${val.day.temphigh}/${val.night.templow}°C</p>
				                <div class="today "><img src="weathercn02/${val.day.img}.png" alt=""></div>
			                </div>
			         </div>	`;
                }

                // 未来一周的天气
                weeks+=`<li>
                        	<h1 class="week_time">${val.date}</h1>
                        	<h2 class="week_status">${val.day.weather}/${val.night.weather}</h2>
                        	<div class="week_img"><img src="weathercn02/${val.day.img}.png"><img src="weathercn/${val.night.img}.png"></div>
                        	<h3 class="max_temp">${val.day.temphigh}℃</h3>
                        	<h4 class="min_temp">${val.night.templow}℃</h4>
                        	<h5 class="week_feng">${val.day.winddirect}</h5>
                        	<h6 class="week_jishu">${val.day.windpower}</h6>
							</li>
                        `;
            });
            $("#week").html(weeks);
            $("#two").html(futures);
            // 24小时的天气
            $.each(data2,function(index,val){
                hours+=`<li>
							<h1 class="hours_time">${val.time}</h1>
							<div class="hours_img"><img src="weathercn02/${val.img}.png"></div>
							<h2 class="hours_temp"><span>${val.temp}</span>°</h2>
						</li>
                        `;
            });
            $("#hours").html(hours);
            // 提示语
            $.each(data3,function(index,val){
                if(index===1){
                    $(".now_point").html(val.detail);
                }else if(index===5){
                    $(".now_air h2").html(val.ivalue);
                }
            });
        }
    });
}

$(".now_city").click(function(){
    $("#citys").show();
    var data=[];
    var province="";
    var city=[];
    $.ajax({
        url: "http://api.jisuapi.com/weather/city?appkey=9de6d9dd85116e33",
        dataType: "jsonp",
        success: function (r) {
            data=r.result;
            provice=$.grep(data,function(val,index){
                if(val.parentid==="0"){
                    return true;
                }
            });
            let str="";
            $.each(provice,function (index,val) {
                str+=`<ul class="province" id="${val.cityid}">${val.city}</ul>`;
            });
            $(".contect").html(str);
        }
    });

    $(".contect").on("click",".province",function(){
        var id=$(this).attr("id");
        city=$.grep(data,function(val,index){
            if(val.parentid===id){
                return true;
            }
        });
        $(".contect").empty();
        let str="";
        $.each(city,function(index,val){
            str+=`<li class="citys">${val.city}</li>`;
        });
        $(".contect").html(str);
    });
    $(".contect").on("click",".citys",function(){
        $("#citys").hide();
        getWeather($(this).html());
    });
})