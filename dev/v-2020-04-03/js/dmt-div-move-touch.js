
const DMT = {};

DMT.x = 0;
DMT.y = 0;



DMT.init = function () {

	DMTdivParent.hidden = true;

	DMTdivParent.style.width = "30ch";

	renderer.domElement.addEventListener( "mouseover", DMT.onEvent );
	renderer.domElement.addEventListener( "touchstart", DMT.onEvent );

	DMT.onEvent(); // for mouse

}


DMT.onEvent = function( e ) {
	//console.log( '', e );

	renderer.domElement.addEventListener( "touchmove", DMT.onMove );
	renderer.domElement.addEventListener( "touchend", DMT.onOut );
	renderer.domElement.addEventListener( 'mousemove', DMT.onMove );
	//renderer.domElement.addEventListener( 'mouseout', DMT.onOut );

	DMT.onMove( e ); // for touch

}



DMT.onMove = function( e ) {
	//console.log( 'e move', e );

	if ( e ) { DMT.checkIntersect ( e ); }

}



DMT.onMouseOverOut = function () {

	renderer.domElement.removeEventListener( "touchmove", DMT.onMove );
	renderer.domElement.removeEventListener( "touchend", DMT.onOut );
	renderer.domElement.removeEventListener( 'mousemove', DMT.onMove );
	//renderer.domElement.removeEventListener( 'mouseup', DMT.onOut );

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

		if ( intersected !== intersects[ 0 ].object ) {

			intersected = intersects[ 0 ].object;
			//console.log( 'int', intersected );

			DMTdivParent.hidden = false;
			DMTdivParent.style.left = event.clientX + "px";
			DMTdivParent.style.top = event.clientY + "px";

			// DMTdivContent.innerHTML = `
			// <p>${ event.clientX } ${ event.clientY }
			// <p>${ intersected.name }`;

			displayMessage();
		}

	} else {

		intersected = null;
		DMTdivParent.hidden = true;
		DMTdivContent.innerHTML = "";

	}

}