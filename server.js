var http=require('http');
var router=require('./router');

http.createServer(function(req,res){
	router.router(req,res);
}).listen(3000);
