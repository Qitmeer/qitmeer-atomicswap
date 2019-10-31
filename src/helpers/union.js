const convert = require('convert-hex')

//时间戳
Date.prototype.Format = function (fmt) { //author: meizz 
    var o = {
        "M+": this.getMonth() + 1, //月份 
        "d+": this.getDate(), //日 
        "h+": this.getHours(), //小时 
        "m+": this.getMinutes(), //分 
        "s+": this.getSeconds(), //秒 
        "q+": Math.floor((this.getMonth() + 3) / 3), //季度 
        "S": this.getMilliseconds() //毫秒 
    };
    if (/(y+)/.test(fmt)) fmt = fmt.replace(RegExp.$1, (this.getFullYear() + "").substr(4 - RegExp.$1.length));
    for (var k in o)
    if (new RegExp("(" + k + ")").test(fmt)) fmt = fmt.replace(RegExp.$1, (RegExp.$1.length == 1) ? (o[k]) : (("00" + o[k]).substr(("" + o[k]).length)));
    return fmt;
}

const numToByteArray = function(num) {
    if (num <= 256) { 
        return [num];
    } else {
        return [num % 256].concat(numToByteArray(Math.floor(num / 256)));
    }
}

const bytesToNum = function(bytes) {
    if (bytes.length == 0) return 0;
    else return bytes[0] + 256 * bytesToNum(bytes.slice(1));
}


const hexToTime = hex => bytesToNum(hex.match(/(..)/g).map( v => parseInt( v,16 ) ))
const timeToHex = num => {
    if ( isNaN(num*1) ) throw 'timeToHex time type need number'
    const byteArr = numToByteArray(num)
    return convert.bytesToHex(byteArr)
}

module.exports = { hexToTime, timeToHex }

