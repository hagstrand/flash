// अथ योगानुशासनम्॥१॥

/** @const */
voyc.flash = {};

/*
var flashc = {
	primed: 'p',
	untried: 'u',
	work: 'w',
	review: 'r',
	mastered: 'm',
	qa: 'qa',  // normal
	aq: 'aq',  // reverse
};
*/

/** @enum 
 used only in Program
 */
Dir = {
	FORWARD: 'qa', // reading/listening (q->a)
	REVERSE: 'aq', // writing/speakng (a->q)
	LISTEN: 'a', // with audio only, no text
	SPEAK: 's', // with speech recognition
	WRITE: 'd' // with sketch and hand-writing recognition
};

/** @enum used only in Coach */
State = {
	UNTRIED: 'u',
	WORK: 'w',
	REVIEW: 'r',
	MASTERED: 'm',
	PRIMED: 'p'
};

/** @enum used only in voyc.flash.strings below */ 
Action = {
	PROGRAM_READY: 'b',
	QUESTION: 'q',
	ANSWER: 'a',
	STACKS_CHANGED: 'i',
	CHANGEDIRECTION_REQUEST: 'e',
	CHANGEDIRECTION_COMPLETE: 'f',
	AUTOPLAY_REQUEST: 'g',
	AUTOPLAY_CANCELLED: 'h'
}

/** @enum used only in voyc.flash.strings below */
Actor = {
	COACH: 'c',
	DESK: 'd',
	PROGRAM: 'p',
	FLASH: 'f'
}

/*****************************************************/

/**
	class Flash
	@constructor
	singleton
	Creates all objects, runs setup methods, publishes 'setup-complete'.
**/
voyc.Flash = function() {
	// is singleton
	if (voyc.Flash._instance) return voyc.Flash._instance;
	else voyc.Flash._instance = this;

	this.observer = null;
	this.cache = [];
}

voyc.Flash.prototype.onLoad = function() {
	console.log('onload');
	voyc.flash.title = 'Flash';

	// rewrite
	voyc.flash.strings = {};
	voyc.flash.strings[Action.PROGRAM_READY] = 'program-ready',
	voyc.flash.strings[Action.QUESTION] = 'question',
	voyc.flash.strings[Action.ANSWER] = 'answer',
	voyc.flash.strings[Action.STACKS_CHANGED] = 'stacks-changed`',
	voyc.flash.strings[Action.CHANGEDIRECTION_REQUEST] = 'changedirection-request',
	voyc.flash.strings[Action.CHANGEDIRECTION_COMPLETE] = 'changedirection-complete',
	voyc.flash.strings[Action.AUTOPLAY_REQUEST] = 'autoplay-request',
	voyc.flash.strings[Action.AUTOPLAY_CANCELLED] = 'autoplay-cancelled'
	voyc.flash.strings[Actor.COACH] = 'coach',
	voyc.flash.strings[Actor.DESK] = 'desk',
	voyc.flash.strings[Actor.PROGRAM] = 'program',
	voyc.flash.strings[Actor.FLASH] = 'flash'

	// model
	voyc.flash.coach = new Coach();
	voyc.flash.program = new Program();  // : creates Sets of Cards

	// view
	voyc.flash.desk = new Desk();
	Str.strings = voyc.flash.Strings;

	// controller
	this.observer = voyc.flash.observer = new voyc.Observer();

	// run setups
	// inconsistency:
	//     program and coach setup attach observer events
	//     desk setup draws the screen
	voyc.flash.program.setup(this.observer);
	voyc.flash.desk.setup(voyc.$('deskcontainer'), this.observer);  // newer version of view
	voyc.flash.coach.setup(this.observer);

	// attach nav buttons
	var elems = document.querySelectorAll('[nav]');
	for (var i=0; i<elems.length; i++) {
		elems[i].addEventListener('click', function(event) {
			var eid = event.currentTarget.getAttribute('nav');
			(new voyc.BrowserHistory()).nav(eid);
		}, false);
	}

	// initialize browserhistory 
	// url: http://flash.voyc.com?subject=pageid
	new voyc.BrowserHistory('subject', function(pageid) {
		voyc.flash.onNav(pageid);
	});

	// initialize form with default custom cards
	voyc.$('custominput').value = 'hola, hello;\nadios, goodbye;\nlapiz, pencil;\nestudiar, study;\nla madre, the mother;\nel padre, the father;';

	// ready to start
	// inconsistency:
	//     this should say onload-complete
	this.observer.publish('setup-complete', 'flash', {});

	// acknowledge opener
	if (window.opener) {
		window.opener.postMessage('ack', '*');
	}
}

/**
	onNav() is a callback called from BrowserHistory in these situations
		1. explicit page switch via (new BrowserHistory()).nav()
		2. when the user clicks the back button (window.onpopstate)
		3. on startup.  pageid may be included in a bookmarked url.
*/
voyc.Flash.prototype.onNav = function(pageid) {
	// home page
	if (!pageid) {
		document.title = voyc.flash.title;
		this.showPage('home');
	}

	// custom data, not yet implemented
	else if (pageid == 'custom') {
		document.title = voyc.flash.title + ' Custom';
		this.showPage(pageid);
	}
	
	// practice button
	else if (pageid == 'practice') {
		this.showPage('deskcontainer');
	}

	// a subject page
	else {
		this.loadScript(pageid);
		this.showPage('deskcontainer');
	}
}

// subroutine called from onNav
voyc.Flash.prototype.loadScript = function(pageid) {
	if (pageid in this.cache) {
		window['onScriptLoaded'](this.cache[pageid]);
	}
	else {
		var scripturl = 'pages/' + pageid + '.js';
		voyc.appendScript(scripturl);
	}
}

// subroutine called from onNav
voyc.Flash.prototype.showPage = function(pageid) {
	var pageids = [
		'home',
		'subject',
		'custom',
		'deskcontainer'
	];
	for (var i=0; i<pageids.length; i++) {
		if (pageids[i] == pageid) {
			voyc.show(pageids[i]);
		}
		else {
			voyc.hide(pageids[i]);
		}
	}
}

// startup
window.addEventListener('load', function(evt) {
	voyc.flash = new voyc.Flash();
	voyc.flash.onLoad();
});

// handle incoming postmessage from external window
window.addEventListener("message", function(e) {
	console.log('postmessage event received from ' + e.origin);
	voyc.flash.program.loadData(e.data);
	(new voyc.BrowserHistory()).nav(e.data['name']);
}, false);

// handle incoming data from pages/*.js loaded dynamically 
// when user clicks on dataset listed on flash homepage
window['onScriptLoaded'] = function(data) {
	voyc.flash.program.loadData(data);
	document.title = voyc.flash.title + ' ' + data['title'];
	var pageid = data['name'];
	if (!(pageid in voyc.flash.cache)) {
		voyc.flash.cache[pageid] = data;
	}
}
