

"use strict"

var app = app || {};

app.Exhibit = function()
{
	
	function Exhibit(radius, x, y, name,ro)
	{
	
		this.radius = radius;
		this.x = x; 
		this.y = y;
		this.color = "#ff0000";
		this.name  = name;
		this.rotate = ro;
		//console.log(ro);
		
	}
	
	var p = Exhibit.prototype;
	
	p.constructor = function()
	{
		
	}
	
	p.update = function()
	{
		
	};
	
	p.draw = function(ctx)
	{
		//console.log(this.rotate)
		var longer = 40;
		var shorter = 20;
		var W;
		var H;
		if(this.rotate == 2){
			 W = shorter;
			 H = longer;
			//console.log("rotate = two");
		}
		else{
			W = longer;
		    H = shorter;
		}
		
		app.drawLib.circle(ctx, this.x, this.y, this.radius, this.color,1);
		//app.drawLib.outRect(ctx, this.x - W/2, this.y - H/2, W, H, "#fff" ,5);
		
	};
	
	return Exhibit;
}();

app.ExhibitCollider = function()
{
	
	function ExhibitCollider(radius, x, y, name)
	{
	
		this.radius = radius;
		this.x = x; 
		this.y = y;
		this.color = "#00BFFF";
		this.name  = name;
		}
	
	var ec = ExhibitCollider.prototype;
	
	
	ec.update = function()
	{
		
	};
	
	ec.draw = function(ctx)
	{
		
		app.drawLib.circle(ctx, this.x, this.y, this.radius, this.color, 0.3);
		
	};
	
	return ExhibitCollider;
}();