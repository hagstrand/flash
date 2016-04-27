// अथ योगानुशासनम्॥१॥
/**
	class Flash
	singleton
	creates all objects and runs setup methods
	publishes the initial 'setup-complete'
**/

var flash;
var flashc = {
	primed: 'p',
	untried: 'u',
	work: 'w',
	review: 'r',
	mastered: 'm',
	qa: 'qa',  // normal
	aq: 'aq',  // reverse
};

window.addEventListener('load', function(evt) {
	flash = new Flash();
	flash.load();
});

var title = 'Flash';
var keyword = 'subject';
loadpage = function(page) {
	if (!page) {
		document.title = title;
		show('home');
		hide('subject');
		hide('custom');
		hide('deskcontainer');
	}
	else if (page == 'custom') {
		document.title = title + ' ' + page;
		hide('home');
		hide('subject');
		show('custom');
		hide('deskcontainer');
	}
	else {
		document.title = title + ' ' + page;
		hide('home');
		show('subject');
		hide('custom');
		hide('deskcontainer');
		if (!subjects[page]) {
			var scripturl = 'pages/' + page + '.js';
			appendScript(scripturl);
		}
		else {
			genPage(page);
		}
	}
}

onscriptloaded = function(subject) {
	genPage(subject);
}

genPage = function(subject) {
	$('pageheader').innerHTML = subjects[subject].name;

	var deck = subjects[subject];
	var card;
	var s = '';
	for (var i=0; i<deck.cards.length; i++) {
		card = deck.cards[i];
		s += "<tr id='0'><td>" + card.q + "</td><td>" + card.a + "</td></tr>";
	} 
	$('pagetable').innerHTML = s;
}

practicePage = function(evt) {
	flash.program.loadData(subjects[subject]);
	hide('home');
	hide('subject');
	hide('custom');
	show('deskcontainer');
}

var subject = 'greekalphabet';
var subjects = {};


function Flash() {
}

Flash.prototype.load = function() {
	console.log('onload');

	flash.coach = new Coach();
	flash.program = new Program();  // : creates Sets of Cards

	// view
	flash.desk = new Desk();
	flash.str = new Str();
	flash.internals = new Internals();

	// controller
	var observer = flash.observer = new Observer();

	// run setups
	flash.desk.setup($('deskcontainer'), observer);  // newer version of view
	flash.internals.setup();
	flash.coach.setup(observer);
	flash.program.setup(observer);

	// attach nav
	var elems = document.querySelectorAll('[nav]');
	for (var i=0; i<elems.length; i++) {
		elems[i].addEventListener('click', function(event) {
			var eid = event.currentTarget.getAttribute('nav');
			nav(eid);
		}, false);
	}

	$('custominput').value = 'hola, hello;\nadios, goodbye;\nlapiz, pencil;\nestudiar, study;\nla madre, the mother;\nel padre, the father;';
	
	$('practice').addEventListener('click', function(evt) {
		practicePage(evt);
	});

	// ready to start
	flash.observer.publish(new Note('setup-complete', 'flash', {}));
}
