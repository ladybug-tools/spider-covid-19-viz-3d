module.exports = {
	"env": {
		"browser": true,
		"es6": true
	},
	"extends": "mdcs",
	"globals": {
		"Atomics": "readonly",
		"SharedArrayBuffer": "readonly"
	},
	"parserOptions": {
		"ecmaVersion": 2018,
		"sourceType": "module"
	},
	"rules": {
		"semi": [ "error", "always" ],
		"quotes": [ "error", "double" ]
	}
};