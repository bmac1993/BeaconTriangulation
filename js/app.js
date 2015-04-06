var app = app || {};

app.BEACONS = {};

app.trilateration = {

	// Timer that displays list of beacons.
	updateTimer: null,
	// Custom timer to get users location
	locationTimer: null,

	startScan: function()
	{
		function onBeaconsRanged(beaconInfo)
		{
			//console.log('onBeaconsRanged: ' + JSON.stringify(beaconInfo))
			for (var i in beaconInfo.beacons)
			{
				// Insert beacon into table of found beacons.
				var beacon = beaconInfo.beacons[i];
				beacon.timeStamp = Date.now();
				var key = beacon.major + ":" + beacon.minor;
				app.BEACONS[key] = beacon;
			}
		}

		function onError(errorMessage)
		{
			console.log('Ranging beacons did fail: ' + errorMessage);
		}

		// Request permission from user to access location info.
		// This is needed on iOS 8.
		estimote.requestAlwaysAuthorization();

		// Start ranging beacons.
		estimote.startRangingBeaconsInRegion(
			{}, // Empty region matches all beacons
			    // with the Estimote factory set UUID.
			onBeaconsRanged,
			onError);
	},
	
	initialize: function()
	{
		document.addEventListener('deviceready', this.onDeviceReady, false);
	},
	
	onDeviceReady: function()
	{
		// Specify a shortcut for the location manager holding the iBeacon functions.
		window.estimote = EstimoteBeacons;
		// Start tracking beacons!
		app.trilateration.startScan();
	},
	
	getLocation: function()
	{
		timeNow = Date.now();
		
		var nearestBeacon;
		var secondNearestBeacon;
		var thirdNearestBeacon;
		
		// Update beacon list.
		$.each(app.BEACONS, function(key, beacon)
		{
			// Only show beacons that are updated during the last 20 seconds.
			if (beacon.timeStamp + 20000 > timeNow)
			{
				// Hardcode x and y values for testing
				if(key == "12350:52257")
				{
					//Window Beacon
					beacon.x = app.main.getDistance(43.084678, app.main.orginLong, 43.084678, -77.679919, 'M');
					beacon.y = app.main.getDistance(app.main.originLat, -77.679919, 43.084678, -77.679919, 'M');
					
					console.log("Window beacon");
					console.log(beacon.x);
					console.log(beacon.y);
				}
				if(key == "56181:59165")
				{
					//Wall Beacon
					beacon.x = app.main.getDistance(43.084589, app.main.orginLong, 43.084589, -77.679931, 'M');
					beacon.y = app.main.getDistance(app.main.originLat, -77.679931, 43.084589, -77.679931, 'M');
					
					console.log("Wall beacon");
					console.log(beacon.x);
					console.log(beacon.y);
				}
				if(key == "41988:60931")
				{
					//Railing beacon
					beacon.x = app.main.getDistance(43.084642, app.main.orginLong, 43.084642, -77.680023, 'M');
					beacon.y = app.main.getDistance(app.main.originLat, -77.680023, 43.084642, -77.680023, 'M');
					
					console.log("Railing beacon");
					console.log(beacon.x);
					console.log(beacon.y);
				}
				
				// Set distance, color, and id
				beacon.id = key;
				//beacon.distance = app.utils.getDistance(beacon);
				if(beacon.color == undefined)
				{
					beacon.color = app.utils.getColor(beacon);
				}
				
				//Set the closest and second closest beacons
				if(nearestBeacon == undefined)
				{
					nearestBeacon = beacon;
				}
				else if(beacon.distance < nearestBeacon.distance)
				{
					thirdNearestBeacon = secondNearestBeacon;
					secondNearestBeacon = nearestBeacon;
					nearestBeacon = beacon;
				}
				else if(secondNearestBeacon == undefined)
				{
					secondNearestBeacon = beacon;
				}
				else if(beacon.distance < secondNearestBeacon.distance)
				{
					thirdNearestBeacon = secondNearestBeacon;
					secondNearestBeacon = beacon;
				}
				else if(thirdNearestBeacon == undefined)
				{
					thirdNearestBeacon = beacon;
				}
				else if(beacon.distance < thirdNearestBeacon.distance)
				{
					thirdNearestBeacon = beacon;
				}
			}
		});
		
		// Check that 3 beacons are found
		if(nearestBeacon == undefined || secondNearestBeacon == undefined || thirdNearestBeacon == undefined){
			console.log("not all beacons defined");
		}
		else{
			return(app.trilateration.calculateLocation(nearestBeacon, secondNearestBeacon, thirdNearestBeacon));
		}
	},
	sqr: function(a) {
		return Math.pow(a, 2);
	},
	calculateLocation: function(a, b, c){
		
		var xa = a.x;
		var ya = a.y;
		var xb = b.x;
		var yb = b.y;
		var xc = c.x;
		var yc = c.y;
		var ra = a.distance * 3;
		var rb = b.distance * 3;
		var rc = c.distance * 3;
	 
		var j, k, x, y;

		k = (this.sqr(xa) + this.sqr(ya) - this.sqr(xb) - this.sqr(yb) - this.sqr(ra) + this.sqr(rb)) / (2 * (ya - yb)) - (this.sqr(xa) + this.sqr(ya) - this.sqr(xc) - this.sqr(yc) - this.sqr(ra) + this.sqr(rc)) / (2 * (ya - yc));
		j = (xc - xa) / (ya - yc) - (xb - xa) / (ya - yb);
		x = k / j;
		y = ((xb - xa) / (ya - yb)) * x + (this.sqr(xa) + this.sqr(ya) - this.sqr(xb) - this.sqr(yb) - this.sqr(ra) + this.sqr(rb)) / (2 * (ya - yb));

		var pos = {};
		pos.x = x;
		pos.y = y;
		
		return pos;
	}
};
