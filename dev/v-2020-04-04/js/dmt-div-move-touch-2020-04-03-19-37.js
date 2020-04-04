
const DMT = {};

DMT.x = 0;
DMT.y = 0;


DMT.init = function () {

	DMTdragParent.hidden = true;

	renderer.domElement.addEventListener( "mouseover", DMT.onMouseOver, false );
	renderer.domElement.addEventListener( "touchstart", DMT.onMouseOver, false );
	console.log( '', 23 );
};



DMT.onMouseOver = function ( e ) {
	console.log( '', e );

	renderer.domElement.addEventListener( "touchmove", DMT.onMouseOverMove, false );
	renderer.domElement.addEventListener( "touchend", DMT.onMouseOverOut, false );
	renderer.domElement.addEventListener( 'mousemove', DMT.onMouseOverMove );
	renderer.domElement.addEventListener( 'mouseout', DMT.onMouseOverOut );

};


DMT.onMouseOverMove = function ( e ) {

	//console.log( 'e move', e );
	DMT.checkIntersect( e );

};


DMT.onMouseOverOut = function () {

	renderer.domElement.addEventListener( "touchmove", DMT.onMouseOverMove );
	renderer.domElement.addEventListener( "touchend", DMT.onMouseOverOut );
	renderer.domElement.removeEventListener( 'mousemove', DMT.onMouseOverMove );
	renderer.domElement.removeEventListener( 'mouseup', DMT.onMouseOverOut );

};



DMT.checkIntersect = function ( event ) {
	//console.log( 'event THR ', event.target, event.target.id );

	event.preventDefault();

	if ( event.type === "touchmove" ) {

		event.clientX = event.touches[ 0 ].clientX;
		event.clientY = event.touches[ 0 ].clientY;

	}

	const mouse = new THREE.Vector2();
	mouse.x = ( event.clientX / renderer.domElement.clientWidth ) * 2 - 1;
	mouse.y = - ( event.clientY / renderer.domElement.clientHeight ) * 2 + 1;

	const raycaster = new THREE.Raycaster();
	raycaster.setFromCamera( mouse, camera );

	const intersects = raycaster.intersectObjects( groupCases.children  );

	if ( intersects.length > 0 ) {

		if ( intersected !== intersects[ 0 ].object ) {

			intersected = intersects[ 0 ].object;
			//console.log( 'int', intersected );

			DMTdragParent.hidden = false;
			DMTdragParent.style.left = event.clientX + "px";
			DMTdragParent.style.top = event.clientY + "px";

			// DMTdragParent.innerHTML = `
			// <p>${ event.clientX } ${ event.clientY }
			// <p>${ intersected.name }`;

			displayMessage();

		}

	} else {

		intersected = null;
		DMTdragParent.hidden = true;
		divMessage.innerHTML = "";

	}

};