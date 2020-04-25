
var synth = window.speechSynthesis;
var voices = [];


function sayThis( text = "Hello world! My fingers are crossed. I hope you will be here tomorrow") {

	synth.cancel();

	const utterThis = new SpeechSynthesisUtterance( text );

	voices = voices.length ? voices : window.speechSynthesis.getVoices();

	if ( voices.length > 0 ) {

		const voice = voices.find( item => item.name === "Google UK English Female" );

		const theDefault =  voices.find( item => item.default === true );

		utterThis.voice = voice ? voice : theDefault;

	}

	synth.speak( utterThis );

}

