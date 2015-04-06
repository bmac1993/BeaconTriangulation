
"use strict";



var app = app || {};

app.keydown = [];

app.main = {
	//variables
	WIDHT:undefined,
    HEIGHT:undefined,
	
	dt:1/60.0,
	canvas:undefined,
    ctx:undefined,

	canvasWidth:undefined,
    canvasHeight:undefined,

	drawLib:undefined,
	user:undefined,
	userCollider:undefined,

	MapImg:undefined,
	golFirst:undefined,
	


	userLong:undefined,
	useLat:undefined,
	userX:undefined,
	userY:undefined,
	userColRad:undefined,

	exhibits:[],
	exColliders:[],
	exLong:[],
	exLat:[],
	exName:[],
	exRad:[],
	
	beacons:[],
	beacLon:[],
	beacLat:[],
	beacID:[],
	beacFloor:[],
	
	panSides: undefined,
	panTopBot: undefined,
	
	angle:undefined,
	orginLong:undefined,
	originLat:undefined,

	zoomtick:undefined,

	zoomLevel:undefined,
	floor:undefined,
	building:undefined, 

	panspeed:undefined,
	
	zoomH:undefined,
	zoomW:undefined,

	trilat:undefined,

//nw 43.086354,-77.681498
//se 	43.081586,-77.670863

//Width Points
//43.083168, -77.685272
//43.083168 ,-77.665784

//Height Points
//43.088647, -77.675077
//43.080071, -77.675077
    
// west 43.083130, -77.681498
// east  43.083130,  -77.670863
// north 43.086354, -77.675766
// south 43.081586, -77.675766
    
	// methods
	init : function() {
	
	//var c = document.createElement("canvas");
   // document.body.appendChild(c);
	this.canvas = document.querySelector('canvas');
	
	// Sets up search for beacons
	app.trilateration.initialize();
	
	//set up array values
    this.exLong =[-77.679945,-77.676694, -77.671845];
    this.exLat = [43.083855,43.084232, 43.085096];
    this.exName = ["GOL","QM", "GFH"];
	this.exRad = [40,20,30];

   //set up static values
    this.angle = 0;
	this.orginLong = -77.681498;
    this.originLat = 43.086354;
	//set image src's
   
   
  
	//set canvas width and height
	this.WIDTH = this.getDistance(43.083130, -77.681498,43.083130,  -77.670863,'M')  ;
    this.HEIGHT = this.getDistance(43.086354, -77.675766,43.081586, -77.675766,'M')  ;
	
	this.canvas.width = window.innerWidth;
    this.canvas.height = window.innerHeight;
    
	//set up this.ctx
	this.ctx = this.canvas.getContext('2d');
	//initiate exhibits array
    for(var i = 0; i < this.exName.length; i++){
			var radius = 10;
			var Lat = this.exLat[i];
			var Long = this.exLong[i];
			var x = this.getDistance(Lat,this.orginLong,Lat,Long,'M') ;
			var y = this.getDistance(this.originLat,Long,Lat,Long,'M') ;
			var name = this.exName[i];
			var ro = 2;
			this.createExhibits(radius,x,y,name,ro);
		}
	 //initiate exhibit colliders array
	 for(var i = 0; i < this.exhibits.length; i++){
			var radius = this.exRad[i];
			var Lat = this.exLat[i];
			var Long = this.exLong[i];
			var x = this.getDistance(Lat,this.orginLong,Lat,Long,'M') ;
			var y = this.getDistance(this.originLat,Long,Lat,Long,'M') ;
			var name = this.exName[i];
			this.createExhibitsColliders(radius,x,y,name);
		}
    
	//set up classes to be called this.class instead of app.class (not really necessary I just prefer it)
    this.drawLib= app.drawLib;
	this.user = app.user;
	this.userCollider = app.userCollider;
	this.trilaterate = app.trilateration; 
	
	
	this.zoomtick = 30;

	this.floor = 2;
	this.building = '';

	this.zoomW = this.WIDTH;
	this.zoomH = this.HEIGHT;

	//this.ctx.scale(.5,.5);
	
	//initalize users location (must be called in update when keyboard controls are no longer needed for testing)
	this.updateUserLocation();
    //call the update function update
	this.panSides = 0;
	this.panTopBot = 0;
	this.zoomLevel = 0;
	this.panspeed = 15;
	this.loadImages();
	this.snap();
    this.update();
	},
	//create new exhibit
	createExhibits: function (radius, x, y, name,ro) {
        this.exhibits.push(new app.Exhibit(radius, x, y, name,ro));
    },
	//create new exhibit collider
	createExhibitsColliders: function (radius, x, y, name) {
        this.exColliders.push(new app.ExhibitCollider(radius, x, y, name));
    },
	
	
	
	//get the distance in feet from two lat/lon points
	getDistance: function(lat1, lon1, lat2, lon2, unit){
		var radlat1 = Math.PI * lat1/180;
		var radlat2 = Math.PI * lat2/180;
		var radlon1 = Math.PI * lon1/180;
		var radlon2 = Math.PI * lon2/180;
		var theta = lon1-lon2;
		var radtheta = Math.PI * theta/180;
		var dist = Math.sin(radlat1) * Math.sin(radlat2) + Math.cos(radlat1) * Math.cos(radlat2) * Math.cos(radtheta);
		dist = Math.acos(dist);
		dist = dist * 180/Math.PI;
		dist = dist * 60 * 1.1515;
		dist = dist * 5280;
		
		dist = Math.floor(dist);

		if (unit=="K") { dist = dist * 1.609344 };

		if (unit=="N") { dist = dist * 0.8684 };

		return dist;
    },
	//draw on the canvas
	draw: function()
	{
		
	
		//Draw Background Image
		this.drawLib.clear(this.ctx,0 , 0 , this.HEIGHT, this.WIDTH);
		
		//this.drawLib.rect(this.ctx,-1000,-1000,5000,5000, "#FFF");
		
		
		
		if(this.zoomLevel > -2){
			this.drawLib.drawImage(this.ctx, this.Mapimage , 0, 0, this.WIDTH, this.HEIGHT);

			/*if(this.building == 'GOL'){
				consle.log("GOL");
				if(this.floor == 1){
				this.drawLib.drawImage(this.ctx, this.golFirst ,181, 558 , 321, 431);
				}
				if(this.floor == 2){
				this.drawLib.drawImage(this.ctx, this.golSecond ,181, 558 , 321, 431);
				}
				if(this.floor == 3){
				this.drawLib.drawImage(this.ctx, this.golThird ,181, 558 , 321, 431);
				}
			}
		    if(this.building == 'CIAS'){
				if(this.floor == 1){
				this.drawLib.drawImage(this.ctx, this.ciasFirst ,950, 283, 642, 380);
				}
				if(this.floor == 2){
				this.drawLib.drawImage(this.ctx, this.ciasSecond ,950, 298, 642, 368);
				}
				if(this.floor == 3){
				this.drawLib.drawImage(this.ctx, this.ciasThird ,950, 298, 642, 368);	
				}
				if(this.floor == 4){
				this.drawLib.drawImage(this.ctx, this.ciasFourth ,950, 298, 642, 368);	
				}
			}*/
		}
		if(this.zoomLevel <= -2){
			//this.drawLib.drawImage(this.ctx, this.MapSolid , 0, 0, this.WIDTH, this.HEIGHT);
		}

		//Draw User
		this.userCollider.draw(this.ctx,this.userColRad, this.userX, this.userY);
	    this.user.draw(this.ctx,  this.userX, this.userY);
		
		//Draw Exhibits
	    for(var i = 0; i < this.exhibits.length; i++)
		{
			this.exColliders[i].draw(this.ctx);
			this.exhibits[i].draw(this.ctx);
			
		}
		this.heatmap(20);
    
		
	},
	heatmap: function(amt){
		
	},

	//rotate the entire canvas
	rotate: function(){
	//rotate right : right arrow
		if(app.keydown[39]){
			this.angle = 1;
			this.angle = (this.angle + .05) % 360;	
			this.drawLib.clear(this.ctx,0, 0, this.canvas.width, this.canvas.height);
			this.ctx.translate(this.WIDTH/2, this.HEIGHT/2);
			this.ctx.rotate(this.angle*Math.PI/180);
			this.ctx.translate(this.WIDTH/2 * -1 , this.HEIGHT/2 * -1);
		}
	//rotate left : left arrow
		if(app.keydown[37]){
			this.angle = -1;
			this.angle = (this.angle - .05) % 360;	
			this.drawLib.clear(this.ctx,0, 0, this.canvas.width, this.canvas.height);
			this.ctx.translate(this.WIDTH/2, this.HEIGHT/2);
			this.ctx.rotate(this.angle*Math.PI/180);
			this.ctx.translate(this.WIDTH/2 * -1 , this.HEIGHT/2 * -1);
		}
		//restet rotation : enter
		if(app.keydown[13]){
			this.ctx.setTransform(1, 0, 0, 1, 0, 0);
		}
	},
	
	snap: function(){
			this.clear();
			this.ctx.setTransform(1, 0, 0, 1, 0, 0);
			var subject = this.user;
			var xtrans = subject.x - (window.innerWidth/2);
			var ytrans = subject.y - (window.innerHeight/2);
			xtrans = xtrans * -1;
			ytrans = ytrans * -1;
			this.ctx.translate( xtrans, ytrans);
			this.zoomLevel = 0;
			this.zoomH = this.HEIGHT;
			this.zoomW = this.WIDTH;
	},
	//check collisons between the user's circle collider and a circle a
	checkCol: function (a){
		var circle1 = {radius: a.radius, x: a.x, y: a.y};
		var circle2 = {radius: this.userColRad, x: this.userX, y: this.userY};
		var dx = (circle1.x  ) - (circle2.x  );
		var dy = (circle1.y ) - (circle2.y );
		var distance = Math.sqrt(dx * dx + dy * dy);
		if (distance < circle1.radius + circle2.radius) {return true;}
		else{ return false;}
	},
	//initiate collisions to be called in update
	Collisions: function (){
		for(var i = 0; i < this.exColliders.length; i++)
		{
			if(this.checkCol(this.exColliders[i]) ){
				//Colision has been deteced here! do something
				console.log(this.exColliders[i].name);
			}
		}
	}, 
	getLocation: function () {
		var self = this;
		if (navigator.geolocation) {
			navigator.geolocation.getCurrentPosition(function(position){
			self.userLat =  position.coords.latitude;
			self.userLong =  position.coords.longitude;
		});
		} else {
		console.log("didnt work");
		}
	},
	
	updateUserLocation: function (){
		//set collison radius for user
		this.userColRad = 5;
		//set these variables to the geolcation lon/lat
		
		var userPosition = app.trilateration.getLocation();
		
		if(userPosition != null)
		{
			this.userX = userPosition.x;
			this.userY = userPosition.y;
			
			console.log(JSON.stringify(userPosition));
		}
		
	},
	
	update: function(){
		requestAnimationFrame(this.update.bind(this));
		
		//this.handleZoom(this.ctx);
		
		this.zoomtick -- ;
		//console.log(this.userLat);
		this.getLocation();
		this.updateUserLocation();
		
		this.rotate();
		
		this.Collisions();
		
		this.pan();
		//this.zoomCanvas();
		this.changeFloor();
		//this.clear();
		//this.moveUser();
		this.draw();
		
			
	},
	loadImages: function(){

		 this.Mapimage = new Image();
		 this.Mapimage.src = "img/map.png";

		 this.MapSolid = new Image();
		 this.MapSolid.src = "img/map_solid.png";
	
		 this.golFirst = new Image();
		 this.golFirst.src = "img/gol_floor_1.png";

		 this.golSecond = new Image();
		 this.golSecond.src = "img/gol_floor_2.png";

		 this.golThird = new Image();
		 this.golThird.src = "img/gol_floor_3.png";

		 this.ciasFirst = new Image();
		 this.ciasFirst.src = "img/cias_floor_1.png";

		 this.ciasSecond = new Image();
		 this.ciasSecond.src = "img/cias_floor_2.png";

		 this.ciasThird = new Image();
		 this.ciasThird.src = "img/cias_floor_3.png";

		 this.ciasFourth = new Image();
		 this.ciasFourth.src = "img/cias_floor_4.png";

		
	},
	
	
	moveUser: function(){
		var speed = 5;
		//right
		if(app.keydown[39]){
			this.userX += speed;
		}
		//left
		if(app.keydown[37]){
			this.userX -= speed;
		}
		//up
		if(app.keydown[38]){
			this.userY -= speed;
		}
		//down
		if(app.keydown[40]){
			this.userY += speed;
			
		}
    },
    changeFloor: function (){

    	//up
		if(app.keydown[38]){
			if(this.floor == 5){

			 this.floor = 1;
			}
			else{
			this.floor += 1;
			}
		}
		//down
		if(app.keydown[40]){
			if(this.floor == 1){
				this.floor == 5;
			}
			else{this.floor -= 1;}

			
		}


    },
	
		zoomCanvas: function(z){
			//this.clear();
		
			if(this.zoomtick < 0){
			
					if(z =='IN' /*&& this.zoomLevel < 6*/){
							this.zoomtick = 10;
							this.clear();
							this.zoomLevel += 1;
							if(this.zoomLevel > 0){
								//this.panspeed -= 1;
							}
							var amt = 1.20;
							this.drawLib.scaleCanvas(this.ctx, amt,amt);
							
							
						}

					if(z == 'OUT' /*&& this.zoomLevel > -4 */){
							this.zoomtick = 10;
							this.clear();
							this.zoomLevel -= 1;

							if(this.panspeed < 15){
								this.panspeed +=1;
								}
							var amt = .80;
							this.drawLib.scaleCanvas(this.ctx, amt,amt);
							
					}
				//this.handleZoom(this.ctx);
			
				}
		},
		handleZoom: function(context){
				
			this.ctx.setTransform(1, 0, 0, 1, 0, 0);
			//context.restore();
			var zL = this.zoomLevel;
			
			this.zoomH = this.HEIGHT;
			this.zoomW = this.WIDTH;
			
			var amounts = new Array();
			var levels = new Array();
			var transX = new Array();
			var transY = new Array();
			
			var WH = window.innerHeight;
			var WW = window.innerWidth;
			amounts = [-4,-3,-2,-1,0,1,2,3,4,5,6];
			levels = [.30,.40,.60,.80,1,1.15,1.20,1.45,1.60,1.75,2];
			transX = [WW/4,WW/6,WW/8,WW/10,0,-10,WW/-10];
			transY = [WH,WH/2,WH/4,WH/8,0,-50,0,0,0,0,0];	

			 for(var i = 0; i < amounts.length; i++){
			 	if(zL == amounts[i]){
			 		var amt = levels[i];
			 		//context.save();
					this.drawLib.scaleCanvas(context, amt,amt);
					this.zoomW = this.zoomW * (amt);
					this.zoomH = this.zoomH * (amt);
					context.translate(transX[i],transY[i]);
					

			 	}
			}

			//console.log(zL);
			//console.log(this.zoomW);
					
		},

		pan:function(dir){
			
			//console.log(this.panSides);
			var panspeed = this.panspeed;
			
						//right
						if(dir == "RIGHT"){
							this.clear();
							this.ctx.translate(panspeed,0);
							
						
								
								this.panSides += 1;
							
						}

				
		
						//right
						//left
						if(dir == "LEFT"){
							this.clear();
							this.ctx.translate(panspeed* (-1),0);
							
							
							this.panSides -= 1;
						
						}
				
				
			
						//up
						if(dir =="UP"){
							this.clear();
							this.ctx.translate(0,panspeed*(-1));
							this.panTopBot += 1;
						}
						//down
						if(dir == "DOWN"){
							this.clear();
							this.ctx.translate(0,panspeed);
							this.panTopBot -= 1;
						}
				
			
			
		},
		
		
		clear: function(){

			var iw = window.innerWidth;
			var ih = window.innerHeight;
			this.drawLib.clear(this.ctx,0,0, this.WIDTH, this.HEIGHT);
			this.drawLib.clear(this.ctx,0,0,iw,ih);
		},
		
	
};



  var el = document.getElementsByTagName("canvas")[0];
  var mc = new Hammer(el);
  mc.get('pan').set({direction: Hammer.DIRECTION_ALL});
  mc.get('pinch').set({enable: true});


  mc.on("panleft panright panup pandown pinchin pinchout", function(ev){
  	 switch(ev.type){
	  	 case "panleft":
	  		app.main.pan("LEFT");
	  		 break; 
	  	 case "panright":
	  		app.main.pan("RIGHT");
	  	 	break;
	  	 case "panup":
	  		app.main.pan("UP");
	  	 	break;
	  	 case "pandown":
	  	 	app.main.pan("DOWN");
	  		 break;
	  	 case "pinchin":
	  	 	app.main.zoomCanvas("OUT");
	  	 	break;
	  	 case "pinchout":
	  	 	app.main.zoomCanvas("IN");
	  	 	break;
	  }
});
 

  





window.onload = function() {

//startup();



	window.addEventListener("keydown", function(e){
		//console.log("keydown " + e.keyCode);
		app.keydown[e.keyCode] = true;
	});
	
	window.addEventListener("keyup", function(e){
		//console.log("keyup");
		app.keydown[e.keyCode] = false;
	});
	

	app.main.init();
}