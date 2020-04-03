

const DMT = {};


DMT.active = false;
DMT.currentX;
DMT.currentY;
DMT.initialX;
DMT.initialY;
DMT.xOffset = -50;
DMT.yOffset = -50;


DMT.init = function () {

	document.body.addEventListener( "touchstart", DMT.dragStart, false );
	document.body.addEventListener( "touchend", DMT.dragEnd, false );
	document.body.addEventListener( "touchmove", DMT.drag, false );

	document.body.addEventListener( "mousedown", DMT.dragStart, false );
	document.body.addEventListener( "mouseup", DMT.dragEnd, false );
	document.body.addEventListener( "mousemove", DMT.drag, false );

};



DMT.dragStart = function ( e ) {

	console.log( 'e', e );

	if ( e.type === "touchstart" ) {

		DMT.initialX = e.touches[ 0 ].clientX - DMT.xOffset;
		DMT.initialY = e.touches[ 0 ].clientY - DMT.yOffset;

	} else {

		DMT.initialX = e.clientX - DMT.xOffset;
		DMT.initialY = e.clientY - DMT.yOffset;

	}

	if ( e.target === DMTdragItem ) { DMT.active = true; }

}



DMT.dragEnd = function ( e ) {

	DMT.initialX = DMT.currentX;
	DMT.initialY = DMT.currentY;

	DMT.active = false;

}



DMT.drag = function ( e ) {

	if ( DMT.active ) {

		e.preventDefault();

		if ( e.type === "touchmove" ) {

			DMT.currentX = e.touches[ 0 ].clientX - DMT.initialX;
			DMT.currentY = e.touches[ 0 ].clientY - DMT.initialY;

		} else {

			DMT.currentX = e.clientX - DMT.initialX;
			DMT.currentY = e.clientY - DMT.initialY;

		}

		DMT.xOffset = DMT.currentX;
		DMT.yOffset = DMT.currentY;

		DMT.setTranslate( DMT.currentX, DMT.currentY, DMTdragItem );

	}

}



DMT.setTranslate = function ( xPos, yPos, el ) {

	el.parentNode.style.transform = "translate3d(" + xPos + "px, " + yPos + "px, 0)";

};
