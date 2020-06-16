// copyright 2020 Theo Armour. MIT license.
/* global GFO, JTVdivJsonTreeView, JTVdivJsonTree */
// jshint esversion: 6
// jshint loopfunc: true



const JTV = {};

JTV.root = undefined;
JTV.json = undefined;


JTV.onLoad = function () {

	JTV.root = "THR.group userData";
	JTV.json =  THR.group.children.map( child => ( { data: child.userData, geometry: child.geometry, 
		color: child.material.color } ) );
	
	JTH.init();
	JTF.init();
	//JTE.init();

	JTVdivJsonTree.innerHTML = JTV.parseJson( JTV.root, JTV.json, 0 );

	const details = JTVdivJsonTree.querySelectorAll( "details" );

	details[ 0 ].open = true;

};



JTV.parseJson = function ( key = "", item = {}, index = 0 ) { //console.log( '', key, item, index );
	const type = typeof item;

	if ( [ "string", "number", "boolean", "null", "bigint" ].includes( type ) || !item ) {

		return `<div>${ key }: <span style=color:green >${ item }<span></div>`;

	} else if ( type === 'object' ) {

		return Array.isArray( item ) ? JTV.getArray( key, item, index ) : JTV.getObject( key, item, index );

	}

};



JTV.getArray = function ( key, array, index ) { //console.log( 'Array', key, array );

	const htm = array.map( ( item, index ) => JTV.parseJson( key, item, index ) ).join( "" );

	return `<details style="margin: 1ch 0 1ch 1ch;" >
		<summary>${ key } [ ${ array.length } ]</summary>${ htm }
	</details>`;

};



JTV.getObject = function ( key, item, index ) {

	//if ( !item ) { console.log( 'error:', key, item, index ); return; }

	const keys = Object.keys( item );
	const htm = keys.map( key => JTV.parseJson( key, item[ key ] ) ).join( "" );

	return `<details style="margin: 1ch 0 1ch 1ch;" >
		<summary>${ key } ${ index }: { ${ keys.length } }</summary>${ htm }
	</details>`;

};
