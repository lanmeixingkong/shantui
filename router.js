var url=require('url');
var fs=require('fs');
var querystring=require('querystring');
module.exports.router=function(req,res){
	//请求路径
	var pathname=url.parse(req.url).pathname;
	// console.log(pathname);
	if (pathname.indexOf('public')>0) {
		res.writeHead(200);
		var path = __dirname+pathname;
		// console.log(path);
		var c=fs.readFileSync(path);
		res.end(c);
	}else{
		switch(pathname){
			case '/':
				//登录界面
				res.writeHead(200,{'Content-Type':'text/html;charset=utf-8'});
				//全局变量
				var realpath = __dirname+'/page/index.html';
				// console.log(__dirname);
				var content=fs.readFileSync(realpath,'utf8');
				res.end(content);
				break;
			case '/walktost':
				//登录界面
				res.writeHead(200,{'Content-Type':'text/html;charset=utf-8'});
				//全局变量
				var realpath = __dirname+'/page/walktost.html';
				// console.log(__dirname);
				var content=fs.readFileSync(realpath,'utf8');
				res.end(content);
				break;
			case '/mail':
				//登录界面
				res.writeHead(200,{'Content-Type':'text/html;charset=utf-8'});
				//全局变量
				var realpath = __dirname+'/page/mail.html';
				// console.log(__dirname);
				var content=fs.readFileSync(realpath,'utf8');
				res.end(content);
				break;	
			default:
				res.writeHead(200);
				res.end('404');
				break;
		}
	}
	

}