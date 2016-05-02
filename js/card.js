// अथ योगानुशासनम्॥१॥
/**
	class Card
	@constructor
	Contains the scoring for one question
 */
 
function Card(quest) {
	// The input quest is external data.
	this.id = quest['i'] || Card.id++;      // id
	this.seq = quest['n'] || Card.seq++;     // sequence number
	this.foreign = quest['q']; // question text (foreign language)
	this.native = quest['a'];  // answer text (native language)
	this.translit = quest['t'];
	this.audiourl = quest['audiourl'];

	this['qa'] = {
		state: quest['qas'] || 'u',    // state
		aCnt: quest['qaa'] || 0,  // count asked
		cCnt: quest['qac'] || 0,  // count correct
		pct: 0,					// percent correct
		recent: null,      // The 5 most recent answers.  A 5-byte array.  Each byte is empty, 0, or 1.
		z: 0,              // nSession of last time this question was displayed
	};
	this['aq'] = {
		state: quest['aqs'] || 'u',
		aCnt: quest['aqa'] || 0,
		cCnt: quest['aqc'] || 0,
		pct: 0,
		recent: null,
		z:0
	};

	this.io = 'c';
	this.clearRecent('qa');
	this.clearRecent('aq');
}

Card.id = 1;
Card.seq = 1; 
 
Card.maxRecent = 5;

Card.mastered = 'm';
Card.review = 'r';
Card.work = 'w';
Card.untried = 'u';
Card.primed = 'p';
Card.inputs = [Card.untried, Card.primed];
Card.outputs = [Card.work, Card.review, Card.mastered];
Card.allStates = [Card.untried, Card.primed, Card.work, Card.review, Card.mastered];

Card.prototype = {

	// states
	getState: function(dir) {
		return this[dir].state;
	},

	setState: function(state, dir) {
		this[dir].state = state
	},

	isInput: function(dir) {
		return (Card.inputs.indexOf(this.getState(dir)) >= 0);
	},

	isOutput: function(dir) {
		return (Card.outputs.indexOf(this.getState(dir)) >= 0);
	},

	// io
	isClean:   function() {return (this.io == 'c')},
	isDirty:   function() {return (this.io == 'd')},
	isPending: function() {return (this.io == 'p')},
	setClean:  function() {this.io = 'c'},
	setDirty:  function() {this.io = 'd'},
	setPending:function() {this.io = 'p'},

	getAcnt: function(dir) {
		return this[dir].aCnt;
	},
	getCcnt: function(dir) {
		return this[dir].cCnt;
	},
	getPct: function(dir) {
		return this[dir].pct;
	},

	getZ: function(dir) {
		return this[dir].z;
	},

	bumpCounters: function(banswer, dir) {
		this[dir].aCnt++;
		if (banswer) {
			this[dir].cCnt++;
		}
		this[dir].pct = this.calcPct(dir);
		this[dir].recent.shift();
		this[dir].recent.push((banswer) ? 1 : 0);
		this[dir].z = flash.coach.nSession;
	},

	getConsecutiveCorrect: function(dir) {
		var rightInARow = 0;
		var x = Card.maxRecent-rightInARow-1;
		var x1 = x > 0;
		var x2 = this[dir].recent[Card.maxRecent-rightInARow-1]
		while (x1 && x2) {
			rightInARow++;
			x = Card.maxRecent-rightInARow-1;
			x1 = x > 0;
			x2 = this[dir].recent[Card.maxRecent-rightInARow-1]
		}
		return rightInARow;
	},
	
	clearRecent: function(dir) {
		this[dir].recent = [];
		for (var i=0; i<Card.maxRecent; i++) {
			this[dir].recent.push('');
		}
	},

	toString: function(dir) {
		return this.seq + " " + this.foreign.substr(0,10) + " " + this[dir].cCnt + "/" + this[dir].aCnt + " " + this[dir].state + " " + this.io + " " + this[dir].z + " " + this[dir].recent;
	},
	toJson: function() {
		return '{"i":'+this.id+',"qas":"'+this['qa'].state+'","qaa":'+this['qa'].aCnt+',"qac":'+this['qa'].cCnt+',"aqs":"'+this['aq'].state+'","aqa":'+this['aq'].aCnt+',"aqc":'+this['aq'].cCnt+'}';
	}, 

	drawAnalytics: function() {
		return this['qa'].state + '/' + this['qa'].cCnt + '/' + this['qa'].aCnt + ' : ' + this['aq'].state + '/' + this['aq'].cCnt + '/' + this['aq'].aCnt;
	},

	drawStack: function(dir) {
		var s = (dir == 'qa') ? this.foreign.substr(0,10) : this.native.substr(0,10);
		var a = this[dir].aCnt;
		var p = this[dir].pct;
		return s + ' ' + a + ',' + p;
	},

	calcPct: function(dir) {
		var a = this[dir].aCnt;
		var c = this[dir].cCnt;
		var t = a + c;
		var p = (a <= 0) ? 0 : Math.floor(c/a * 100);
		return p;
	},
}
