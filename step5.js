const c=require("crypto"),e=require("express"),r=require("readline"),h=require("http"),q=require("request"),m=require("mongoose"),v=m.Schema,z=new v({o:String}),O=m.model("O",z),a=e(),s=h.createServer(a);s.listen(8080,e=>{e?console.error(e):(m.Promise=global.Promise,m.connect("mongodb://127.0.0.1:27017/basicdb",{useMongoClient:!0},function(e){e?(console.log("DB basicdb not found..."),console.error(e),process.exit(1)):O.find({},(e,o)=>{if(e)console.error(e),process.exit(1);else if(o&&0!=o.length){r.createInterface({input:process.stdin,output:process.stdout}).question("What is your login ? ",e=>{const r=o[o.length-1];r.o!=e?(console.error(new Error("Not the same login associated in the database. Expected { o: "+e+" }, got "+r)),process.exit(1)):(console.log(`Wait for your code ${e}...`),q(process.env.addr+"/step5/"+e+"?S4="+process.env.S4+"&a="+c.createHash("sha1").update(JSON.stringify({o:r.o})).digest("hex"),function(e,o,r){console.log(r),process.exit(0)}))})}else console.error(new Error("No object added the database before... Aborting")),process.exit(1)})}))});
