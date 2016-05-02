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
	this.stacks[flashc.qa] = {};
	this.stacks[flashc.aq] = {};
	
	// working variables
	this.dir = flashc.qa;
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

			dir = flashc.qa;
			state = card.getState(dir);
			this.addCardToStack(card, state, dir);
			if (state == Card.untried) {
				this.highSeq = card.seq;
			}

			dir = flashc.aq;
			state = card.getState(dir);
			this.addCardToStack(card, state, dir);
		}
	}

	this.observer.publish(new Note('cards-loaded', 'program', {}));

	this.observer.publish(new Note('program-ready', 'program', {
		features:this.features,
		dir:this.dir
	}));

	this.stackChanged();
}

Program.prototype.initStacks = function() {
	this.cards = {};
	for (var state, st=0; st<Card.allStates.length; st++) {
		state = Card.allStates[st];
		this.stacks[flashc.qa][state] = new Stack(state, flashc.qa);
		this.stacks[flashc.aq][state] = new Stack(state, flashc.aq);
	}
}

Program.prototype.clearMastered = function() {
	// find cards mastered in both directions and clear them
	var card, stack, dir;
	for (var i in this.cards) {
		card = this.cards[i];
		if (card.isClean() 
				&& card.getState(flashc.qa) == Card.mastered 
				&& card.getState(flashc.aq) == Card.mastered
			) {
			var allDirs = [flashc.qa,flashc.aq];
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
	this.observer.publish(new Note('stackchange-complete', 'program', {
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
		this.dir = (this.dir == flashc.qa) ? flashc.aq : flashc.qa;
	}
	this.observer.publish(new Note('changedirection-complete', 'program', {
		dir:this.dir
	}));
	
	this.stackChanged();
}
