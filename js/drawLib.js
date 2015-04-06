//drawLib.js
"use strict"

var app = app || {};

app.drawLib = {
	clear : function(ctx, x,y,w,h)
	{
		ctx.clearRect(x,y,w,h); 
	},
	scaleCanvas : function(ctx, w, h){
		
		//ctx.save();
			ctx.scale(	w,h);
		//ctx.restore();
	},
	
	rect : function(ctx, x, y, w, h, col)
	{
		ctx.save();
		ctx.fillStyle = col;
		ctx.fillRect(x,y,w,h);
		ctx.restore();
	},
	circle: function(ctx,centerX, centerY, radius,col,alph){

		ctx.save();
		ctx.beginPath();
		ctx.globalAlpha=alph;
      	ctx.arc(centerX, centerY, radius, 0, 2 * Math.PI, false);
      	ctx.fillStyle = col;
      	ctx.fill();
      	ctx.restore();
	},
	
	text: function(ctx, string, x, y, size, col)
	{
		ctx.save();
		ctx.font = 'bold ' + size + 'px Monospace';
		ctx.fillStyle = col;
		ctx.fillText(string, x, y);
		ctx.restore();
	},
	fadeText: function(ctx, string, x, y, size, col,alph)
	{
		ctx.save();
		ctx.globalAlpha=alph;
		ctx.font = 'bold ' + size + 'px Monospace';
		ctx.fillStyle = col;
		ctx.fillText(string, x, y);
		ctx.restore();
	},
	fadeGradient: function(ctx, alph, img)
	{
		ctx.save();
		ctx.globalAlpha=alph;
		ctx.drawImage(img,0,0);
		ctx.restore();
	},
	outlinedText: function(ctx, string, x, y, size, col, out)
	{
		ctx.save();
		ctx.font = 'bold ' + size + 'px Monospace';
		
		
		ctx.fillStyle = col;
		ctx.strokeStyle = out;
		ctx.fillText(string, x, y);
		ctx.strokeText(string,x,y);
		ctx.restore();
	},
	outRect : function(ctx, x, y, w, h, col, out)
	{
		ctx.save();
		
		ctx.fillStyle = col;
		ctx.strokeStyle = out;
		ctx.lineWidth = 5;
		
		
		ctx.fillRect(x,y,w,h);
		ctx.strokeRect(x,y,w,h);
		ctx.restore();
	},
	backgroundGradient : function(ctx, width, height)
	{
		ctx.save();
		ctx.fillStyle = "rgba(0.0,0.0,0.0,0.0)";
		ctx.fillRect(0,0,width,height) //what's the point of the rect function if we're just going to do this?
		ctx.restore();
	},
	Shadowrect : function(ctx, x, y, w, h, col)
	{
		ctx.save();
		ctx.shadowOffsetX = 0;
		ctx.shadowOffsetY = 5;
		ctx.shadowBlur = 10;
		ctx.shadowColor ="#000"
		ctx.fillStyle = col;
		ctx.fillRect(x,y,w,h);
		ctx.restore();
	},
	alpharect : function(ctx, x, y, w, h, col,alph)
	{
		ctx.save();
		ctx.globalAlpha=alph;
		ctx.fillStyle = col;
		ctx.fillRect(x,y,w,h);
		ctx.restore();
	},
	drawImage : function(ctx,image, x, y,w,h){
		ctx.save();
		ctx.drawImage(image, x, y, w, h);
		ctx.restore();
	},
};