//Server Code

//Requires:
var http 	= require('http');
var fs 		= require('fs');
var url 	= require('url');
var socket 	= require('socket.io');

//Created local module:
var print 	= require('./module.js');

//Objects to emit to clients
var uniqueUsers = {};
var dataEmit = {countTotal:0,countB1:0,countB2:0,ratio1:0,ratio2:0,width1:1,width2:1};

//Server Setup
var server = http.createServer(function(request,response) {
	print("REQUEST URL: "+request.url);
	if (request.url === '/assignment2.js') {
		fs.readFile('public/assignment2.js', (err, contents) => {
			if (err) {
				response.writeHead(404, {"Content-Type": "text"});
				response.end('No file');
			}

			response.writeHead(200, {"Content-Type": "text/javascript"});
			response.end(contents);
		});
	} 

	else if (request.url === '/assignment2.html' || request.url === '/') {
		fs.readFile('public/assignment2.html', (err, contents) => {
			if (err) {
				response.writeHead(404, {"Content-Type": "text"});
				response.end('No file');
			}

			response.writeHead(200, {"Content-Type": "text/html"});
			response.end(contents);
		});
	}else{
		response.writeHead(404, {"content-Type": "text/plain"});
		response.end("Oops, 404 error.");
	}
}).listen(3000);
print('\nServer running at 127.0.0.1 at port 3000');
//socket setup
var io = socket(server);
io.on('connection', (socket) => {
	print("\nmade socket connection", socket.id+"\n");
	//update graph on connection:
	socket.emit('grow',dataEmit);
	socket.emit('users',uniqueUsers);
	//unique names:
	socket.on('names', data =>{
		uniqueUsers = data;
		io.emit('users',uniqueUsers);
	});
	/*
		listening to 'vote' events from clients 
		and broadcasting their data back to other clients
	*/
	socket.on('vote', (data)=>{
		dataEmit = data;
		socket.broadcast.emit('grow',data);
	});
	
});