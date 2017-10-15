// अथ योगानुशासनम्॥१॥
/**
	class Coach
	@constructor
	singleton
	runs the logic for playing the program

	two methods:
		nextQuestion
		scoreAnswer - loops back to nextQuestion

	Coach and Desk pass Notes back and forth
		Coach publishes 'question'
		Desk publishes 'answer'

	three algorithms
		pull
			pull new cards into the working stack
		choose
			choose next question, from which stack
		promote
			move card from work to review to mastered
*/
function Coach() {
	// is singleton
	if (Coach._instance) return Coach._instance;
	else Coach._instance = this;

	this.setting = {
		'isAutoDir': true,
		'autoDirNth': 30,

		'isAutoChoose': true,
		'choosePctReview': 25,

		'isAutoPull': true,
		'minAvgPctWork': 60,
		'minSizeWork': 2,
		'maxSizeWork': 5,
		'maxSizeReview': 10,

		'isAutoPromote': true,
		'promotePctWork': 90,
		'promoteCntWork': 3,
		'promotePctReview': 90,
		'promoteCntReview': 6,
	}

	this.observer = null;
	this.nSession = 0;
	this.card = null;
	this.dir = ''; // copy of the value held by program
	this.nDir = 0; // counter since last direction switch
}

Coach.prototype = {
	setup: function(observer) {
		this.observer = observer;
		var self = this;
		this.observer.subscribe('program-ready', 'coach', function(note) {
			self.start(note);
		});
		this.observer.subscribe('stacks-changed', 'coach', function(note) {
			self.pull();
		});
		this.observer.subscribe('answer', 'coach', function(note) {
			self.scoreAnswer(note);
		});
		this.observer.subscribe('changedirection-complete', 'coach', function(note) {
			self.onDirectionChange(note);
		});
	},

	start: function(note) {
		this.setting['isAutoDir'] = note.payload.features.reversible;
		this.dir = note.payload.dir;
		this.pull();
		this.nextQuestion();
	},
	
	nextQuestion: function() {
		this.nSession++;
		this.nDir++;

		// auto direction change
		if (this.setting['isAutoDir'] && this.nDir >= this.setting['autoDirNth']) {
			this.toggleDir();
		}

		this.card = this.choose();
		if (!this.card) {
			this.observer.publish('program-completed','coach',{});
			return;
		}

		var stacks = voyc.flash.program.drawStacks();

		this.observer.publish('question','coach',{
				card:this.card,
				nSession:this.nSession,
				stacks:stacks,
		});
	},

	scoreAnswer: function(note) {
		// true/false : right/wrong
		var banswer = note.payload.answer;

		// increment counters on the card
		this.card.setDirty();
		this.card.bumpCounters(banswer, this.dir);

		// calc avg pct on the stack
		var state = this.card.getState(this.dir);
		var stack = voyc.flash.program.getStack(state,this.dir);
		stack.calcAvgPct(this.dir);

		this.promote();
		this.pull();

		this.nextQuestion();  // loop forever
	},

	toggleDir: function() {
		this.observer.publish('changedirection-request', 'coach', {dir:false});
	},
	onDirectionChange: function(note) {
		this.dir = note.payload.dir;
		this.nDir = 0;
		this.pull();
		this.nextQuestion();
	},

	// algorithm: choose
	choose: function () {
		if (!this.setting['isAutoChoose']) {
			var workStack = voyc.flash.program.getStack(State.WORK, this.dir);
			next = workStack.nextRandom();  // nextSequential
			return next;
		}
		
		// choose next card from work or review
		var workStack = voyc.flash.program.getStack(State.WORK, this.dir);
		var reviewStack = voyc.flash.program.getStack(State.REVIEW, this.dir);
		var untriedStack = voyc.flash.program.getStack(State.UNTRIED, this.dir);

		// if untried, work, and review are empty, then user has finished the program
		if (!workStack.getLength() && !reviewStack.getLength() && !untriedStack.getLength()) {
			return null;
		}

		// default to workStack unless it's empty
		var stack = (workStack.getLength()) ? workStack : reviewStack;
			
		// apply randomness against percentage to sometimes use review
		if (workStack.getLength() && reviewStack.getLength()) {
			var reviewPct = this.setting['choosePctReview']; // * (reviewStack.getLength()/this.setting['maxSizeReview);
			var r = Math.random() * 100;  // r is between 0 and 100
			if (r < (reviewPct)) {
				stack = reviewStack;
			}
		}

		// get next card from the chosen stack
		next = stack.nextRandom();
		return next;
	},

	// algorithm: promote
	promote: function () {
		if (!this.setting['isAutoPromote'])
			return;

		// promote work to review
		if (this.card.getState(this.dir) == State.WORK
				&& this.card[this.dir].aCnt >= this.setting['promoteCntWork']
				&& this.card[this.dir].pct >= this.setting['promotePctWork']) {
			voyc.flash.program.changeCardState(this.card, State.REVIEW);
		}

		// promote review to mastered
		if (this.card.getState(this.dir) == State.REVIEW
				&& this.card[this.dir].aCnt >= this.setting['promoteCntReview']
				&& this.card[this.dir].pct >= this.setting['promotePctReview']) {
			voyc.flash.program.changeCardState(this.card, State.MASTERED);
		}
	},
	
	// algorithm: pull
	pull: function () {
		// fill workset to minimum
		var workStack = voyc.flash.program.getStack(State.WORK, this.dir);
		var untriedStack = voyc.flash.program.getStack(State.UNTRIED, this.dir);
		while ((workStack.getLength() < this.setting['minSizeWork']) && (untriedStack.getLength() > 0)) {
			var next = untriedStack.nextSequential();
			if (next) {
				voyc.flash.program.changeCardState(next, State.WORK);
			}
		}

		// add one up to max
		if ((this.setting['isAutoPull'])
				&& (workStack.getLength() < this.setting['maxSizeWork'])
				&& (workStack.getAvgPct(this.dir) > this.setting['minAvgPctWork'])) {
			var untriedStack = voyc.flash.program.getStack(State.UNTRIED, this.dir);
			var next = untriedStack.nextSequential();
			if (next) {
				voyc.flash.program.changeCardState(next, State.WORK);
			}
		}
	},
}
