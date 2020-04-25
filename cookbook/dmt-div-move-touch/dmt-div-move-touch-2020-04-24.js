// Copyright 2020 Spider contributors. MIT License
// 2020-04-21

/* global THREE, groupCasesWP, displayMessage, DMTdivPopUp, DMTdivHeader, DMTdivContent, DMTdivContainer */

const DMT = {};

DMT.x = 0;
DMT.y = 0;

DMT.intersected = undefined;

DMT.htmlPopUp = `
	<div id="DMTdivContainer" >
		<div id="DMTdivHeader">
			🕷 <span ontouchstart=DMTdivPopUp.hidden=true; onclick=DMTdivPopUp.hidden=true; style=cursor:pointer;float:right;z-index:20; >[ x ]</span>
		</div>
		<div id="DMTdivContent" >

			<p>${ ( new Date() ) }</p>

			<p>hardwareConcurrency ${ navigator.hardwareConcurrency }</p>

			<p>aaa bbb ccc 123 456 789</p>
<!--
			<p>
				image below for testing scrolling
				<img src=../../assets/cube-textures/f4.jpg >
			</p>
-->
		</div>
	</div>`;



DMT.init = function () {

	// Update to what objects you need monitored
	DMT.objects = group.children;

	const div = document.body.appendChild( document.createElement( 'div' ) );
	div.id = "DMTdivPopUp";

	DMTdivPopUp.innerHTML = DMT.htmlPopUp;

	window.addEventListener( 'keydown', DMT.onStart );

	THR.renderer.domElement.addEventListener( 'mousedown', DMT.onStart );
	//THR.renderer.domElement.addEventListener( 'mousemove', DMT.onStart );
	THR.renderer.domElement.addEventListener( 'wheel', DMT.onStart );

	THR.renderer.domElement.addEventListener( 'touchstart', DMT.onStart );
	THR.renderer.domElement.addEventListener( 'touchmove', DMT.onStart );
	THR.renderer.domElement.addEventListener( 'touchend', DMT.onStart );

	DMTdivHeader.addEventListener( "mousedown", DMT.onMouseDown );
	DMTdivHeader.addEventListener( "touchstart", DMT.onMouseDown );

	DMTdivContent.scrollTop = 800;

};


DMT.onStart = function () {

	window.removeEventListener( 'keydown', DMT.onStart );

	//THR.renderer.domElement.removeEventListener( 'mousedown', DMT.onStart );
	//THR.renderer.domElement.removeEventListener( 'mousemove', DMT.onStart );
	THR.renderer.domElement.removeEventListener( 'wheel', DMT.onStart );

	THR.renderer.domElement.removeEventListener( 'touchstart', DMT.onStart );
	THR.renderer.domElement.removeEventListener( 'touchmove', DMT.onStart );
	THR.renderer.domElement.removeEventListener( 'touchend', DMT.onStart );

	THR.renderer.domElement.addEventListener( "mouseover", DMT.onEvent );
	THR.renderer.domElement.addEventListener( "touchstart", DMT.onEvent );

	DMTdivPopUp.hidden = true;

	DMT.onEvent(); // activates onMove

};



DMT.onEvent = function ( e ) {

	THR.renderer.domElement.addEventListener( "touchstart", DMT.onMove );
	THR.renderer.domElement.addEventListener( "touchmove", DMT.onMove );
	THR.renderer.domElement.addEventListener( "touchend", DMT.onOut );
	THR.renderer.domElement.addEventListener( "mousemove", DMT.onMove );
	THR.renderer.domElement.addEventListener( "mouseout", DMT.onOut );

	DMT.onMove( e ); // activates touch

};



DMT.onMove = function ( e ) {

	if ( e ) {

		DMT.checkIntersect( e );

	}

};



DMT.onMouseOverOut = function () {

	THR.renderer.domElement.removeEventListener( "touchmove", DMT.onMove );
	THR.renderer.domElement.removeEventListener( "touchend", DMT.onOut );
	THR.renderer.domElement.removeEventListener( "mousemove", DMT.onMove );
	THR.renderer.domElement.removeEventListener( "mouseup", DMT.onOut );

};



DMT.checkIntersect = function ( event ) {

	if ( event.type === "touchmove" || event.type === "touchstart" ) {

		event.clientX = event.touches[ 0 ].clientX;
		event.clientY = event.touches[ 0 ].clientY;

	}

	const mouse = new THREE.Vector2();
	mouse.x = ( event.clientX / THR.renderer.domElement.clientWidth ) * 2 - 1;
	mouse.y = - ( event.clientY / THR.renderer.domElement.clientHeight ) * 2 + 1;

	const raycaster = new THREE.Raycaster();
	raycaster.setFromCamera( mouse, THR.camera );

	const intersects = raycaster.intersectObjects( DMT.objects );
	const cutOff = THR.camera.position.distanceTo( THR.scene.position );

	if ( intersects.length > 0 ) {

		if ( DMT.intersected !== intersects[ 0 ].object && intersects[ 0 ].distance < cutOff ) {

			//console.log( "int", intersects[ 0 ] )

			DMT.intersects = intersects;
			DMT.intersected = intersects[ 0 ].object;

			DMT.displayYourMessage( DMT.intersected );

		}

	} else {

		DMT.intersected = null;

		if ( event.type === "touchmove" || event.type === "touchstart" ) {

			DMTdivPopUp.hidden = true;

		}

	}

};



////////// DMTdivHeader

DMT.onMouseDown = function ( e ) {

	DMT.x = e.clientX;
	DMT.y = e.clientY;

	DMTdivHeader.addEventListener( "touchmove", DMT.onMouseDownMove );
	DMTdivHeader.addEventListener( "touchend", DMT.onMouseDownOut );
	DMTdivHeader.addEventListener( "mousemove", DMT.onMouseDownMove );
	DMTdivHeader.addEventListener( "mouseup", DMT.onMouseDownOut );

	DMT.onMouseDownMove( e ); // for touch

};



DMT.onMouseDownMove = function ( e ) {


	let dx, dy;

	if ( e.type === "touchmove" || event.type === "touchstart" ) {

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

	DMTdivPopUp.style.left = DMTdivPopUp.offsetLeft + dx + "px";
	DMTdivPopUp.style.top = DMTdivPopUp.offsetTop + dy + "px";

};



DMT.onMouseDownOut = function () {

	DMTdivHeader.removeEventListener( "touchmove", DMT.onMouseDownMove );
	DMTdivHeader.removeEventListener( "touchend", DMT.onMouseDownOut );
	DMTdivHeader.removeEventListener( "mousemove", DMT.onMouseDownMove );
	DMTdivHeader.removeEventListener( "mouseup", DMT.onMouseDownOut );

};



DMT.onLoadMore = function () {

	const maxHeadroom = window.innerHeight - DMTdivPopUp.offsetTop - 15;

	DMTdivContainer.style.height = DMTdivPopUp.clientHeight < maxHeadroom ? "100%" : maxHeadroom + "px";

	const maxLegroom = window.innerWidth - DMTdivPopUp.offsetLeft - 15;

	DMTdivContainer.style.width = DMTdivPopUp.clientWidth < maxLegroom ? "100%" : maxLegroom + "px";

	//DMTdivMoreGraph.style.height = DMTdivContainer.clientHeight - DMTdivMoreGraph.offsetTop - 15 + "px";
	//DMTdivContent.scrollTop = 88888;


};


//////////

DMT.displayYourMessage = function ( intersected ) {

	console.log( "event", event );
	console.log( "DMT.intersects", DMT.intersects );

	DMTdivPopUp.hidden = false;
	DMTdivPopUp.style.left = event.clientX + "px";
	DMTdivPopUp.style.top = event.clientY + "px";
	//DMTdivContent.scrollTop = 0;

	DMTdivPopUp.innerHTML = `
	<div id="DMTdivIntersected" >
		DOM x: ${ event.clientX }<br>
		DOM y: ${ event.clientY }<br>
		DOM ms: ${ event.timeStamp.toLocaleString() }<br>
		Ray found ${ DMT.intersects.length }<br>
		<button onclick=DMT.getMorePopUp() >⚡️ details ${ DMT.intersects.length } found</button>
	</div>`;

};



DMT.getMorePopUp = function () {

	const htm = DMT.intersects.map( ( obj, i ) => `
	<p>
		Object ${ i }: ${ obj.object.name }<br>
		uuid: ${ obj.object.uuid }<br>
		distance: ${ obj.distance.toLocaleString() }<br>
		point: x${ obj.point.x.toLocaleString() }, y${ obj.point.y.toLocaleString() }, z${ obj.point.z.toLocaleString() }<br>
	</p>`
	).join( "" );

	DMTdivPopUp.innerHTML = DMT.htmlPopUp;

	DMTdivContent.innerHTML = `
<div id=DMTdivMore>${ htm }</div>
<div id="DMTdivMoreButtons" ></div>
<div id=DMTdivMoreGraph  >
</div>
`;

	DMTdivMoreButtons.innerHTML = `
<button onclick=DMTimg.src="../../assets/cube-textures/f4.jpg" >button 1</button>
<button onclick=DMTimg.src="../../assets/cube-textures/f1.jpg" >button2 </button>
<button onclick=DMTimg.src="../../assets/cube-textures/f2.jpg" >button 3</button>
`;


	DMTdivMoreGraph.innerHTML = `
<p>
image below for testing scrolling
<img id=DMTimg  src=../../assets/cube-textures/f4.jpg >
</p>
`;

	DMT.onLoadMore();

	setTimeout( DMT.onLoadMore(), 200 );

	DMTdivHeader.addEventListener( "mousedown", DMT.onMouseDown );
	DMTdivHeader.addEventListener( "touchstart", DMT.onMouseDown );

};


