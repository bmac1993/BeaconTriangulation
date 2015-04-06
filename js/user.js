"use strict";
var app = app || {};

//user image
app.user= {
	
    radius:2.5 ,
	color: "blue",

	image: undefined,

	draw: function(ctx,x,y){
		
			app.drawLib.circle(ctx, x, y, this.radius, this.color ,1);
	},

};

//user collider
app.userCollider= {
	
    radius:5 ,
	color: "#00FF1E",

	image: undefined,

	draw: function(ctx,rad,x,y){
		
			app.drawLib.circle(ctx, x, y, rad, this.color ,.5);
	},

};