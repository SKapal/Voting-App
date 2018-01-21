
//make connection:
var socket = io();

//Bar objects corresponsing to the first and second options
var option1 = {
	x: 75,
	y: 50,
	width: 1, // variable growth/shrink
	height: 225
};

var option2 = {
	x: 75,
	y: 325,
	width: 1, // variable growth/shrink
	height: 225
};

//DOM:
var canvas 	= document.getElementById("myCanvas");
var button1 = document.getElementById("button1").disabled = true;
var button2 = document.getElementById("button2").disabled = true;
var text 	= document.getElementById("text");

//Contains unique usernames
var userBase 	= {
	'student':true
};

//Global variables:
var countB1 	= 0;
var countB2 	= 0;
var countTotal 	= 0;
var ratio1 		= 0;
var ratio2 		= 0;
var barLength 	= 500;

var drawCanvas = function(){
	var ctx 		= canvas.getContext("2d");
	ctx.fillStyle 	="skyblue";
	ctx.fillRect(0,0,canvas.width,canvas.height);

	//Draw bar graph option 1&2 rectangles:
	ctx.rect(option1.x, option1.y, option1.width, option1.height);
	ctx.stroke();
	ctx.rect(option2.x, option2.y, option2.width, option2.height);
	ctx.stroke();
	console.log("The width of bar1: "+option1.width+"\nTheWidth of bar2: "+option2.width);
	
	//Draw Options Text (W and C)
	ctx.font 		= "30px georgia";
	ctx.fillStyle 	= "#286f9b";
	ctx.fillText("W",20,option1.y+(option1.height/2));
	ctx.fillText("C",20,option2.y+(option1.height/2));

	//Draw Percents, Position updates based on votes
	ctx.font 		= "30px georgia";
	ctx.fillStyle 	= "#286f9b";
	ctx.fillText((Math.round(ratio1*100)).toString()+"%",option1.x+option1.width+10,option1.y+(option1.height/2));
	ctx.fillText((Math.round(ratio2*100)).toString()+"%",option2.x+option2.width+10,option2.y+(option1.height/2));
	
	//Draw Divider:
	ctx.beginPath();
	ctx.moveTo(75,0);
	ctx.lineTo(75,600);

	ctx.stroke();
};

//Handles usernames ensuring unique votes
var handleSubmitButton=function(){
	console.log("Username: ", text.value);
	if(userBase[text.value]){
		alert("Sorry, "+text.value+" has already voted.");
		document.getElementById("button1").disabled = true;
		document.getElementById("button2").disabled = true;

	}else if(text.value === ""){
		alert("A name was not entered.")
	}
	else{
		userBase[text.value] = true;
		document.getElementById("button1").innerHTML = "Warriors";
		document.getElementById("button2").innerHTML = "Cavaliers";
		document.getElementById("msg").innerHTML = "Cast your vote, "+text.value+"!";
		document.getElementById("button1").style.background = "#286f9b";
		document.getElementById("button2").style.background = "#286f9b";
		document.getElementById("button1").disabled = false;
		document.getElementById("button2").disabled = false;
		socket.emit('names',userBase);		
	}
};

var handleOption1Button= function(){
	/*
	 *	Calculating the length of bars based on
	 *	vote casted
	 */
	if(userBase[text.value]){
		countB1++;
		countTotal++;
		ratio1 = countB1/countTotal;
		ratio2 = countB2/countTotal;
		option1.width = ratio1*barLength;
		option2.width = ratio2*barLength;
		//Allows only 1 vote per user
		document.getElementById("button1").disabled = true;
		document.getElementById("button2").disabled = true;
		document.getElementById("button1").style.background = "#2AB111";
		document.getElementById("button1").innerHTML = "Vote casted!";
	}


	//emit the vote data to the server
	socket.emit('vote', {
		countB1,countB2,countTotal,ratio1,ratio2,
		width1:option1.width,
		width2:option2.width
	});
	drawCanvas();
};

var handleOption2Button= function(){
	/*
		Calculating the length of bars based on
		vote casted
	*/

	if(userBase[text.value]){
		countB2++;
		countTotal++;
		ratio2 = countB2/countTotal;
		ratio1 = countB1/countTotal;
		option1.width = ratio1*barLength;
		option2.width = ratio2*barLength;
		//Allows only 1 vote per user
		document.getElementById("button1").disabled = true;
		document.getElementById("button2").disabled = true;
		document.getElementById("button2").style.background = "#2AB111";
		document.getElementById("button2").innerHTML = "Vote casted!";
	}


	//emit the vote data to the server
	socket.emit('vote', {
		countB1,countB2,countTotal,ratio1,ratio2,
		width1:option1.width,
		width2:option2.width
	});
	drawCanvas();
};

//listening for events
socket.on('grow', (data)=>{
	console.log("Recieved Data, ",data);
	countTotal 	= data.countTotal;
	countB1 	= data.countB1;
	countB2 	= data.countB2;
	ratio1 		= data.ratio1;
	ratio2 		= data.ratio2;
	option1.width = data.width1;
	option2.width = data.width2;
	drawCanvas();
});

socket.on('users', data=>{
	console.log("Userbase: ",data);
	userBase = data;
});

drawCanvas();