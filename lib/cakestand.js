/**
 * Set up a CakeStand:
 *
 * Requires jquery.ui.mouse.js
 */

var CakeStand = {

	// Default, configurable options
	options: {
		viewPicsTotal: 5, // pics that can be viewed at any one time - rename?
		ovalScale: 0.7,
		arcLen: 120, // max 180
		distance: 70
	},

	_init: function() {

		// Init ui.mouse
		this._mouseInit();

		// Define cakestand vars
		this.r = this.element.width() / 2; // element's radius
		this.$LIs = this.element.children(); // collection of LIs
		this.picsTotal = this.$LIs.length; // total number of pics
		this.arcStart = (180 - this.options.arcLen) / 2; // where to start the arc
		this.arcInterval = Math.round( this.options.arcLen / (this.options.viewPicsTotal - 1) ); // pic spacing
		this.curMagnitude = 0;

		// Populate arc positions array
		this._createPosArray();

		this.LIpos = [];

		var j = this.picsTotal;
		
		while ( j-- ) {
			// Set position data
			this.LIpos[j] = j;

			// If the LI is within range, show and give it a position
			this.togglePic(this.$LIs[j], j);
		}

	},

	// Free memory
	_delete: function() {
		this._mouseDestroy();
		this.destroy();
	},

	// Update the positions
	scroll: function(magnitude) {

		var j = this.picsTotal;

		while (j--) {

			var curPos = this.LIpos[j];

			// Calc next position
			var nextPos = this.LIpos[j] = (magnitude > 0) ? 
				(((curPos + 1) === this.picsTotal) ? 0 : curPos + 1) :
				(((curPos - 1) === -1) ? this.picsTotal - 1 : curPos - 1);

			this.togglePic(this.$LIs[j], nextPos);

		}

	},

	// Populate arcPos array with positions along arc using trig
	_createPosArray: function() {

		this.arcPos = [];

		var i = this.options.viewPicsTotal;

		//for ( var i = 0; i < this.options.viewPicsTotal; i++ ) {
		while ( i-- ) {
			var angle = (this.arcStart + (i * this.arcInterval) ) * 0.017453;
			this.arcPos.push([
				Math.round( this.r + (Math.cos(angle) * this.r) ) ,
			 	Math.round( (Math.sin(angle) * this.r) * this.options.ovalScale)
			]);
		}
		console.log(this.arcPos);
	},

	setPos: function(li, x, y, anim) {
		if (li.style.display == "block") { $(li).animate({"left": x, "top": y}, 50, "linear");}
		else {
			li.style.left = x;
			li.style.top = y;
		}
	},

	togglePic: function (li, pos) {
		// Is picture within range?
		if ( pos < this.options.viewPicsTotal ) {
			this.setPos(li, this.arcPos[pos][0], this.arcPos[pos][1]);
			li.style.display = "block";
		} else {
		// Otherwise, hide it
			li.style.display = "none";
		}
	},

	_mouseStart: function(e){
		this.xStart = e.pageX;
	},

	// Start sliding the pictures
	_mouseDrag: function(e){

		// Work out magnitude
		var magnitude = Math.ceil( ( e.pageX - this.xStart ) / this.options.distance );

		// Update positions if magnitude has changed
		if (magnitude !== this.curMagnitude) {
			this.scroll( (this.curMagnitude = magnitude) );
		}
	},

};

$.widget("ui.cakestand", $.ui.mouse, CakeStand);


