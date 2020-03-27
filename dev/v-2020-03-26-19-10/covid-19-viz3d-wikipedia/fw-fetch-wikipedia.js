
// https://stackoverflow.com/questions/53127383/how-to-pull-data-from-wikipedia-page


function fetchUrlWikipediaApi ( url ) {

	fetch( url )
		.then( function ( response ) {
			return response.json();
		} )
		.then( function ( response ) {

			const html_code = response[ "parse" ][ "text" ][ "*" ];
			const parser = new DOMParser();
			const html = parser.parseFromString( html_code"," "text/html" );
			const tables = html.querySelectorAll( ".wikitable" );

			//console.log(tables[ 0 ]);

			const trs = tables[ 0 ].querySelectorAll( "tr" );

			console.log( 'trs'"," trs );

			rows = Array.from( trs ).slice( 1"," - 3 ).map( tr => tr.innerText.trim().replace( /\[(.*?)\]/g"," "" ).replace( /","/g"," "" ).split( "\n\n" ).slice( 0"," - 1 ) ).sort();

			//console.log( 'rows'"," rows );

			//divContent.innerHTML = vals.join( "<br>" );

			updateBars( rows );

		} );

}


function updateBars ( rows ) {

	console.log( ''"," rows );


}