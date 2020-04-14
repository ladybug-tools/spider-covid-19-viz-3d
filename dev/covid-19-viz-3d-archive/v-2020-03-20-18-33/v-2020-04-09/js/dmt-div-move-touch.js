

/* globals THREE, DMTdivContent, DMTdivParent, renderer, camera, group, txt */
// jshint esversion: 6
// jshint loopfunc: true

const DMT = {};

DMT.x = 0;
DMT.y = 0;
DMT.intersected = undefined;



DMT.init = function () {

	DMTdivParent.hidden = true;


	DMTdivParent.style.width = "30ch";

	renderer.domElement.addEventListener( "mouseover", DMT.onEvent );
	renderer.domElement.addEventListener( "touchstart", DMT.onEvent );

	DMT.onEvent(); // for mouse

};



DMT.onEvent = function ( e ) {

	//console.log( 'event', e );

	renderer.domElement.addEventListener( "touchmove", DMT.onMove );
	renderer.domElement.addEventListener( "touchend", DMT.onOut );
	renderer.domElement.addEventListener( "mousemove", DMT.onMove );
	renderer.domElement.addEventListener( "mouseout", DMT.onOut );

	DMT.onMove( e ); // for touch

};



DMT.onMove = function( e ) {
	//console.log( 'e move', e );

	if ( e ) { DMT.checkIntersect ( e ); }

};



DMT.onMouseOverOut = function () {

	renderer.domElement.removeEventListener( "touchmove", DMT.onMove );
	renderer.domElement.removeEventListener( "touchend", DMT.onOut );
	renderer.domElement.removeEventListener( "mousemove", DMT.onMove );
	renderer.domElement.removeEventListener( "mouseup", DMT.onOut );

};



DMT.checkIntersect = function ( event ) {
	//console.log( 'event chkInt ', event );

	if ( event.type === "touchmove" || event.type === "touchstart" ) {

		event.clientX = event.touches[ 0 ].clientX;
		event.clientY = event.touches[ 0 ].clientY;

	}

	const mouse = new THREE.Vector2();
	mouse.x = ( event.clientX / renderer.domElement.clientWidth ) * 2 - 1;
	mouse.y = - ( event.clientY / renderer.domElement.clientHeight ) * 2 + 1;

	const raycaster = new THREE.Raycaster();
	raycaster.setFromCamera( mouse, camera );

	const intersects = raycaster.intersectObjects( groupCases.children );

	if ( intersects.length > 0 ) {

		if ( DMT.intersected !== intersects[ 0 ].object ) {

			DMT.intersected = intersects[ 0 ].object;
			//console.log( "int", DMT.intersected );

			DMTdivParent.hidden = false;
			DMTdivParent.style.left = event.clientX + "px";
			DMTdivParent.style.top = event.clientY + "px";
			DMTdivContainer.scrollTop = 0;

			// DMTdivContent.innerHTML = `
			// <p>${ event.clientX } ${ event.clientY }
			// <p>${ DMT.intersected.name }
			// ${ txt }`;

			const items = DMT.intersected.userData.items;
			const index = DMT.intersected.userData.index;

			displayMessage( items, index );

		}

	} else {

		DMT.intersected = null;
		DMTdivParent.hidden = true;
		DMTdivContent.innerHTML = "";

	}

};




DMT.onMouseDown = function ( e ) {
	//console.log( 'm down', e );

	DMTdivHeader.addEventListener( "touchmove", DMT.onMouseDownMove );
	DMTdivHeader.addEventListener( "touchend", DMT.onMouseDownOut );
	DMTdivHeader.addEventListener( "mousemove", DMT.onMouseDownMove );
	DMTdivHeader.addEventListener( "mouseup", DMT.onMouseDownOut );

	DMT.onMouseDownMove( e ); // for touch


};

DMT.onMouseDownMove = function( e ) {

	let dx, dy;

	if ( e.type === "touchmove" ) {

		dx = e.touches[ 0 ].clientX - DMT.x;
		dy = e.touches[ 0 ].clientY - DMT.y;

		DMT.x = e.touches[ 0 ].clientX;
		DMT.y = e.touches[ 0 ].clientY;

	} else {

		dx = e.clientX - DMT.x;
		dy = e.clientY - DMT.y;

		DMT.x = e.clientX;
		DMT.y = e.clientY;

	}

	//DMTdivParent.style.left = DMTdivHeader.offsetLeft + dx + "px";
	//DMTdivParent.style.top = DMTdivHeader.offsetTop + dy + "px";

	DMTdivParent.style.left = ( event.clientX - 15 ) + "px";
	DMTdivParent.style.top = ( event.clientY - 15 ) + "px";

};



DMT.onMouseDownOut = function() {

	DMTdivHeader.removeEventListener( "touchmove", DMT.onMouseDownMove );
	DMTdivHeader.removeEventListener( "touchend", DMT.onMouseDownOut );
	DMTdivHeader.removeEventListener( "mousemove", DMT.onMouseDownMove );
	DMTdivHeader.removeEventListener( "mouseup", DMT.onMouseDownOut );

};
