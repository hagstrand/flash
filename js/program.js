// अथ योगानुशासनम्॥१॥
/**
	class Program
	@constructor
	singleton
 	represents one language program
	contains the Cards
	contains the Stacks of Cards
**/
function Program() {
	// is singleton
	if (Program._instance) return Program._instance;
	else Program._instance = this;

	// program features
	this.features = {
		name       : '',    // string
		reversible : false, // true/false
		language   : false, // true/false
		lang       : 'sa',  // two-char language code (only for language)
		sketch     : false, // true/false
		translit   : false, // true/false (only for language)
		audio      : false, // true/false
		db         : false, // true/false
	}

	this.observer = null;

	// all the cards, indexed by id
	this.cards = {};

	// card stacks, by dir and state
	this.stacks = {};
	this.stacks[Dir.FORWARD] = {};
	this.stacks[Dir.REVERSE] = {};
	
	// working variables
	this.dir = Dir.FORWARD;
}

Program.prototype.setup = function(observer) {
	this.observer = observer;
	var self = this;
	this.observer.subscribe('changedirection-request', 'program', function(note) {
		self.changeDirection(note);
	});
}

// receive external data
Program.prototype.loadData = function(data) {
	this.features.name       = data['name'] || '';
	this.features.title      = data['title'] || '';
	this.features.reversible = data['reversible'] || false;
	this.features.dir        = data['dir'] || 'qa';
	this.features.language   = data['language'] || false;
	this.features.sketch     = data['sketch'] || false;
	this.features.translit   = data['translit'] || false;
	this.features.audio      = data['audio'] || false;
	this.features.db         = data['db'] || false;

	this.initStacks();

	// add the newly received cards to the deck and to the stacks
	var card, id, dir;
	for (var i=0; i<data['cards'].length; i++) {
		card = new Card(data['cards'][i]);
		id = card.id;
		if (!this.cards[id]) {
			this.cards[id] = card;

			dir = Dir.FORWARD;
			state = card.getState(dir);
			this.addCardToStack(card, state, dir);
			if (state == Card.untried) {
				this.highSeq = card.seq;
			}

			dir = Dir.REVERSE;
			state = card.getState(dir);
			this.addCardToStack(card, state, dir);
		}
	}

	this.observer.publish(new voyc.Note('cards-loaded', 'program', {}));

	this.observer.publish(new voyc.Note('program-ready', 'program', {
		features:this.features,
		dir:this.dir
	}));

	this.stackChanged();
}

Program.prototype.initStacks = function() {
	this.cards = {};
	for (var state, st=0; st<Card.allStates.length; st++) {
		state = Card.allStates[st];
		this.stacks[Dir.FORWARD][state] = new Stack(state, Dir.FORWARD);
		this.stacks[Dir.REVERSE][state] = new Stack(state, Dir.REVERSE);
	}
}

Program.prototype.clearMastered = function() {
	// find cards mastered in both directions and clear them
	var card, stack, dir;
	for (var i in this.cards) {
		card = this.cards[i];
		if (card.isClean() 
				&& card.getState(Dir.FORWARD) == Card.mastered 
				&& card.getState(Dir.REVERSE) == Card.mastered
			) {
			var allDirs = [Dir.FORWARD,Dir.REVERSE];
			for (var d=0; d<allDirs.length; d++) {
				dir = allDirs[d];
				stack = this.getStack(Card.mastered, dir);
				if (stack.isPresent(card)) {
					stack.remove(card);
				}
			}
			delete this.cards[i];
		}
	}
	this.stackChanged();
}

// stack manipulation

Program.prototype.getStack = function(state,direction) {
	var dir = direction || this.dir;
	return this.stacks[dir][state];
}

Program.prototype.addCardToStack = function(card, state, direction) {
	var dir = direction || this.dir;
	var stack = this.getStack(state, dir);
	card.setState(state, dir);
	stack.add(card);
}

Program.prototype.changeCardState = function(card, newState, direction, quiet) {
	var dir = direction || this.dir;
	var oldstack = this.getStack(card.getState(dir), dir);
	var newstack = this.getStack(newState, dir);
	card.setState(newState,dir);
	oldstack.remove(card);
	newstack.add(card);
	card.setDirty();
	if (!quiet) {
		this.stackChanged();
	}
}

Program.prototype.stackChanged = function() {
	var stacks = this.drawStacks();
	this.observer.publish(new voyc.Note('stackchange-complete', 'program', {
		stacks:stacks
	}));
}

Program.prototype.drawStacks = function() {
	var stacks = {};
	var state,stack,s;
	for (var i=0; i<Card.allStates.length; i++) {
		state = Card.allStates[i];
		stack = this.getStack(state,this.dir);
		stacks[state] = stack.drawStack();
	}
	return stacks;
}

Program.prototype.changeDirection = function(note) {
	if (note.payload.dir) {
		this.dir = note.payload.dir;
	}
	else {
		this.dir = (this.dir == Dir.FORWARD) ? Dir.REVERSE : Dir.FORWARD;
	}
	this.observer.publish(new voyc.Note('changedirection-complete', 'program', {
		dir:this.dir
	}));
	
	this.stackChanged();
}
