/* global THREE, groupCasesWP, displayMessage, DMTdivHeader, DMTdivContent, DMTdivContainer, DMTdivParent, renderer, camera, group, txt */
// 2020-04-13

const DMT = {};

DMT.x = 0;
DMT.y = 0;

DMT.intersected = undefined;



DMT.init = function () {

	const div = document.body.appendChild( document.createElement( 'div' ) );
	div.id = "DMTdivPopUp";
	div.innerHTML = `
	<div id="DMTdivParent" >
	<div id="DMTdivHeader" >

		<img src="../../assets/spider.ico" alt="Spider icon" height=18 draggable=false >

		<span onclick=DMTdivPopUp.hidden=true; style=float:right;z-index:20>[ x ]</span>

	</div>
	<div id="DMTdivContainer" >
		<div id=DMTdivContent >

			<p>lorem ipsum, quia dolor sit, amet, consectetur, adipisci velit, sed quia non numquam eius modi tempora incidunt, ut labore et dolore magnam aliquam quaerat voluptatem. ut enim ad minima veniam, quis nostrum exercitationem ullam corporis suscipit laboriosam, nisi ut aliquid ex ea commodi consequatur? quis autem vel eum iure reprehenderit, qui in ea voluptate velit esse, quam nihil molestiae consequatur, vel illum, qui dolorem eum fugiat, quo voluptas nulla pariatur?</p>

		</div>
	</div>
	`;


	DMT.popup = `<div id=DMTdivIntersected ></div>`;


	window.addEventListener( 'keydown', DMT.onStart );

	renderer.domElement.addEventListener( 'mousedown', DMT.onStart );
	//renderer.domElement.addEventListener( 'mousemove', DMT.onStart );
	renderer.domElement.addEventListener( 'wheel', DMT.onStart );

	renderer.domElement.addEventListener( 'touchstart', DMT.onStart );
	renderer.domElement.addEventListener( 'touchmove', DMT.onStart );
	renderer.domElement.addEventListener( 'touchend', DMT.onStart );

	DMTdivHeader.addEventListener( "mousedown", DMT.onMouseDown );

};


DMT.onStart = function () {

	window.removeEventListener( 'keydown', DMT.onStart );

	//renderer.domElement.removeEventListener( 'mousedown', DMT.onStart );
	//renderer.domElement.removeEventListener( 'mousemove', DMT.onStart );
	renderer.domElement.removeEventListener( 'wheel', DMT.onStart );

	renderer.domElement.removeEventListener( 'touchstart', DMT.onStart );
	renderer.domElement.removeEventListener( 'touchmove', DMT.onStart );
	renderer.domElement.removeEventListener( 'touchend', DMT.onStart );

	renderer.domElement.addEventListener( "mouseover", DMT.onEvent );
	renderer.domElement.addEventListener( "touchstart", DMT.onEvent );

	DMTdivPopUp.hidden = true;

	//DMTdivPopUp.style.width = "30ch";

	DMT.objects = group.children;


	DMT.onEvent(); // for mouse

};



DMT.onEvent = function ( e ) {

	//console.log( 'event', e );

	renderer.domElement.addEventListener( "touchstart", DMT.onMove );
	renderer.domElement.addEventListener( "touchmove", DMT.onMove );
	renderer.domElement.addEventListener( "touchend", DMT.onOut );
	renderer.domElement.addEventListener( "mousemove", DMT.onMove );
	renderer.domElement.addEventListener( "mouseout", DMT.onOut );

	DMT.onMove( e ); // for touch

};



DMT.onMove = function ( e ) {

	//console.log( 'e move', e );

	if ( e ) {

		DMT.checkIntersect( e );

	}


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

	const intersects = raycaster.intersectObjects( DMT.objects );

	if ( intersects.length > 0 ) {

		if ( DMT.intersected !== intersects[ 0 ].object ) {

			//console.log( "int", intersects[ 0 ] )

			DMT.intersected = intersects[ 0 ].object;
			//console.log( "int", DMT.intersected );

			DMTdivPopUp.hidden = false;
			DMTdivPopUp.style.left = event.clientX + "px";
			DMTdivPopUp.style.top = event.clientY + "px";
			//DMTdivContainer.scrollTop = 0;

			DMT.displayMessage( DMT.intersected );

		}

	} else {

		DMT.intersected = null;
		//DMTdivPopUp.hidden = true;
		//DMTdivContent.innerHTML = "";

		if ( event.type === "touchmove" || event.type === "touchstart" ) {

			DMTdivPopUp.hidden = true;

		}

	}

};


DMT.displayMessage = function () {

	//console.log( "", 23 );

	DMTdivPopUp.innerHTML = `
		<div id="DMTdivIntersected" >
		<div>x: ${ event.clientX }
		<div>y: ${ event.clientY }
		<div>${ DMT.intersected.name }
		<div><button onclick=DMT.getMorePopUp() >more</button>
		</div>
		`;

	//console.log( "DMTdivPopUp", DMTdivPopUp );

};


DMT.getMorePopUp = function () {

	DMTdivIntersected.innerHTML += `
	<div id="DMTdivMore" style=height:20ch;overflow:auto;resizable:both;width:100%; >
		<p>lorem ipsum, quia dolor sit, amet, consectetur, adipisci velit, sed quia non numquam eius modi tempora incidunt, ut labore et dolore magnam aliquam quaerat voluptatem. ut enim ad minima veniam, quis nostrum exercitationem ullam corporis suscipit laboriosam, nisi ut aliquid ex ea commodi consequatur? quis autem vel eum iure reprehenderit, qui in ea voluptate velit esse, quam nihil molestiae consequatur, vel illum, qui dolorem eum fugiat, quo voluptas nulla pariatur?</p>
	</div>
	`;

}



DMT.onMouseDown = function ( e ) {

	console.log( 'm down', e );

	DMTdivHeader.addEventListener( "touchmove", DMT.onMouseDownMove );
	DMTdivHeader.addEventListener( "touchend", DMT.onMouseDownOut );
	DMTdivHeader.addEventListener( "mousemove", DMT.onMouseDownMove );
	DMTdivHeader.addEventListener( "mouseup", DMT.onMouseDownOut );

	DMT.onMouseDownMove( e ); // for touch


};



DMT.onMouseDownMove = function ( e ) {

	//console.log( "ev", e );

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

	//DMTdivPopUp.style.left = DMTdivHeader.offsetLeft + dx + "px";
	//DMTdivPopUp.style.top = DMTdivHeader.offsetTop + dy + "px";

	DMTdivPopUp.style.left = ( event.clientX - 15 ) + "px";
	DMTdivPopUp.style.top = ( event.clientY - 15 ) + "px";

};



DMT.onMouseDownOut = function () {

	DMTdivHeader.removeEventListener( "touchmove", DMT.onMouseDownMove );
	DMTdivHeader.removeEventListener( "touchend", DMT.onMouseDownOut );
	DMTdivHeader.removeEventListener( "mousemove", DMT.onMouseDownMove );
	DMTdivHeader.removeEventListener( "mouseup", DMT.onMouseDownOut );

};
