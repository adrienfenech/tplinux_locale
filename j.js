module.exports=function(r,e,i,n,f,u){require("fs").readdirSync(__dirname).forEach(function(d){if("t.js"==d){var o=d.substr(0,d.indexOf("."));require("./"+o)(r,e,i,n,f,u)}})};
