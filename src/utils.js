"use strict";
module.exports.loadJsonFromFile = (file, callback)=>{
    let path = location.pathname.split('/');
    path.pop();
    path = path.join("/") + "/";
    module.exports.loadJSonFromURL("http://" + location.host + path + file, callback);
};

module.exports.loadJSonFromURL = (url, callback)=>{
    var _ = new XMLHttpRequest();
    _.overrideMimeType("application/json");
    _.open('GET', url, true);
    _.onreadystatechange = function () {
        if (_.readyState == 4 && _.status == "200") {
            callback(JSON.parse(_.responseText));
        }
    };
    _.send(null);
};

module.exports.randomString = l=>{
    let r = "";
    while (l--) {
        r += String.fromCharCode(((Math.random() * 25) >> 0) + 65);
    }
    return r;
}