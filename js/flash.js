// अथ योगानुशासनम्॥१॥


// global variable
var flash = null;

// global constants
var title = 'Flash';
var flashc = {
	primed: 'p',
	untried: 'u',
	work: 'w',
	review: 'r',
	mastered: 'm',
	qa: 'qa',  // normal
	aq: 'aq',  // reverse
};

/**
	class Flash
	@constructor
	singleton
	Creates all objects, runs setup methods, publishes 'setup-complete'.
**/

function Flash() {
	// is singleton
	if (Flash._instance) return Flash._instance;
	else Flash._instance = this;
	
	this.cache = [];
}

Flash.prototype.load = function() {
	console.log('onload');

	flash.coach = new Coach();
	flash.program = new Program();  // : creates Sets of Cards

	// view
	flash.desk = new Desk();
	flash.str = new Str();

	// controller
	var observer = flash.observer = new Observer();

	// run setups
	flash.desk.setup($('deskcontainer'), observer);  // newer version of view
	flash.coach.setup(observer);
	flash.program.setup(observer);

	// attach nav buttons
	var elems = document.querySelectorAll('[nav]');
	for (var i=0; i<elems.length; i++) {
		elems[i].addEventListener('click', function(event) {
			var eid = event.currentTarget.getAttribute('nav');
			(new BrowserHistory()).nav(eid);
		}, false);
	}

	// initialize browserhistory 
	// url: http://flash.voyc.com?subject=pageid
	new BrowserHistory('subject', function(pageid) {
		flash.onNav(pageid);
	});

	// initialize form with default custom cards
	$('custominput').value = 'hola, hello;\nadios, goodbye;\nlapiz, pencil;\nestudiar, study;\nla madre, the mother;\nel padre, the father;';

	// attach practice button handler
	$('practice').addEventListener('click', function(evt) {
		practicePage(evt);
	});

	// ready to start
	flash.observer.publish(new Note('setup-complete', 'flash', {}));
}

/**
	onNav() is a callback called from BrowserHistory in these situations
		1. explicit page switch via (new BrowserHistory()).nav()
		2. when the user clicks the back button (window.onpopstate)
		3. on startup.  pageid may be included in a bookmarked url.
*/
Flash.prototype.onNav = function(pageid) {

	// home page
	if (!pageid) {
		document.title = title;
		this.showPage('home');
	}

	// custom data, not yet implemented
	else if (pageid == 'custom') {
		document.title = title + ' Custom';
		this.showPage(pageid);
	}
	
	// practice button
	else if (pageid == 'practice') {
		//document.title = title + ' ' + subjects[pageid].name + ' Practice';
		//this.showPage('deskcontainer');
		//flash.program.loadData(subjects[pageid]);
	}

	// a subject page
	else {
		this.loadScript(pageid);
		this.showPage('deskcontainer');
	}
}

Flash.prototype.loadScript = function(pageid) {
	if (pageid in this.cache) {
		window['onScriptLoaded'](this.cache[pageid]);
	}
	else {
		var scripturl = 'pages/' + pageid + '.js';
		appendScript(scripturl);
	}
}

Flash.prototype.showPage = function(pageid) {
	var pageids = [
		'home',
		'subject',
		'custom',
		'deskcontainer'
	];
	for (var i=0; i<pageids.length; i++) {
		if (pageids[i] == pageid) {
			show(pageids[i]);
		}
		else {
			hide(pageids[i]);
		}
	}
}

// global onload handler
window.addEventListener('load', function(evt) {
	flash = new Flash();
	flash.load();
});

/** 
	External data comes in from these places:

	1. onScriptLoaded(subject data) - from pages/*.js
		flash.js switches the page and then passes data to Program object
	
	2. onLoadData(data) - from and external windows such as Sanskrit Keyboard
		postMessage: window.addEventListener("message", function(e) {
		flash.js reads the data to generate a new page and then passes data to Program object

	3. from getCards data service
		directly handled by Program object

	4. when practice button is clicked, 
		a new data structure is built
		this is not external, but uses the same data structure as incoming external data

	Data Portal:
		program.loadData(data)
		Card(quest) constructor

	The incoming data object is external to the closure compiler,
	and therefore references to it must use brackets-quoted-string notation.
	
	We first pass the data object to program.loadData().
	Here the data is pulled out and loaded into internal objects,
	and the original external data object is discarded.
	
	The internal objects are then accessed by dot-notation.
*/

// handle incoming postmessage from external window
window.addEventListener("message", function(e) {
	console.log('postmessage event received from ' + e.origin);
	loadData(e.data);
	(new BrowserHistory()).nav(e.data['name']);
}, false);

// handle incoming data from pages/*.js loaded dynamically
window['onScriptLoaded'] = function(data) {
	flash.program.loadData(data);
	document.title = title + ' ' + data['title'];
	var pageid = data['name'];
	if (!(pageid in flash.cache)) {
		flash.cache[pageid] = data;
	}
}
