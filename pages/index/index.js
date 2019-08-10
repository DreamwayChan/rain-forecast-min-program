//index.js
var amapFile = require('../../libs/amap-wx.js');//高德地图api


var markersData = [];
Page({
  data: {
    markers: [],
    latitude: '',
    longitude: '',
    textData: {},
    description: '',
    tem: '',
    wind: '',
    rain: ''
  },
  makertap: function (e) {
    // console.log(e);
    // var id = e.markerId;
    // var that = this;
    // that.showMarkerInfo(markersData, id);
    // that.changeMarkerColor(markersData, id);
  },
  maptrap: function(e){
    // console.log(e);
    // var id = e.markerId;
    // var that = this;
    // that.showMarkerInfo(markersData, id);
  },
  onLoad: function () {
    var that = this;
    var myAmapFun = new amapFile.AMapWX({ key: 'a0f33821f19788a62ccf364e57abba3c' });
    //构造 AMapWX 对象，并调用 getPoiAround
    myAmapFun.getRegeo({
      success: function (data) {
        //成功回调
        console.log(data);
        markersData = data;
        // that.setData({
        //   markers: markersData
        // });
        that.setData({
          latitude: markersData[0].latitude
        });
        that.setData({
          longitude: markersData[0].longitude
        });
        that.showMarkerInfo(markersData, 0);
        that.getCaiyunData(markersData[0].name, markersData[0].desc, markersData[0].longitude, markersData[0].latitude);
      },
      fail: function (info) {
        //失败回调
        wx.showModal({ title: info.errMsg })
      }
    })
  },
  showMarkerInfo: function (data, i) {
    var that = this;
    that.setData({
      textData: {
        name: data[i].name,
        desc: data[i].desc
      }
    });
  },
  getCaiyunData: function (name, desc, lng, lat) {
    var that = this;
    var url = "https://api.caiyunapp.com/v2/KvaklupbrejdYXAl/" + lng + "," + lat + "/forecast";
    // console.log(url);
    wx.request({
      url: url,
      data: {
      },
      header: {
        'content-type': 'application/json' // 默认值
      },
      success(data) {
        // console.log(data.data);
        var res = data.data;
        if (res['status'] == "ok") {
          var result = res['result'];
          var description = result.hourly.description;
          var rain = result['minutely'].description;
          var tem = result.hourly.temperature[0].value + "℃";
          var windObj = result.hourly.wind[0];
          var wind_dir = that.getWindDirection(windObj.direction);
          var speed = windObj.speed;
          var wind_speed = speed * 1000 / 3600;
          var wind = wind_dir + "风" + wind_speed.toFixed(2) + "m/s";

          // console.log(tem);
          // console.log(wind);

          that.setData({
            textData: {
              name: name,
              desc: desc,
              description: description,
              tem: tem,
              wind: wind,
              rain: rain
            }
          });
        } else {
          console.log('load forecast error!');
        }
      }
    })
  },
  getWindDirection: function(win) {
    if (win > 348.75 || win <= 11.25) {
      return "北风";
    } else if (win > 11.25 && win <= 33.75) {
      return "北东北";
    } else if (win > 33.75 && win <= 56.25) {
      return "东北";
    } else if (win > 56.25 && win <= 78.75) {
      return "东东北";
    } else if (win > 78.75 && win <= 101.25) {
      return "东";
    } else if (win > 101.25 && win <= 123.75) {
      return "东东南";
    } else if (win > 123.75 && win <= 146.25) {
      return "东南";
    } else if (win > 146.25 && win <= 168.75) {
      return "南东南";
    } else if (win > 168.75 && win <= 191.25) {
      return "南";
    } else if (win > 191.25 && win <= 213.75) {
      return "南西南";
    } else if (win > 213.75 && win <= 236.25) {
      return "西南";
    } else if (win > 236.25 && win <= 258.75) {
      return "西西南";
    } else if (win > 258.75 && win <= 281.25) {
      return "西";
    } else if (win > 281.25 && win <= 303.75) {
      return "西西北";
    } else if (win > 303.75 && win <= 326.25) {
      return "西北";
    } else {
      return "北西北";
    }
  }
})
