// अथ योगानुशासनम्॥१॥
/**
	class Stack
	@constructor
	contains an array of Card ids
	(a card can live in multiple Stacks)
**/
function Stack(state, dir) {
	this.state = state;
	this.dir = dir;
	this.owner = flash.program;
	this.set = [];	// an array of ids
	this.ndx = -1;  // used only by current() and nextSequential()
	this.avgPct = 0;
}
Stack.prototype = {
	getLength: function() {
		return this.set.length;
	},

	getAvgPct: function() {
		return this.avgPct;
	},

	current: function() {
		if (this.ndx < 0) {
			this.ndx = 0;
		}
		var id = this.set[this.ndx];
		var card = this.owner.cards[id];
		return card;
	},

	nextSequential: function() {
		if (!this.set.length) {
			return null;
		}
		this.ndx++;
		if (this.ndx >= this.set.length) {
			this.ndx = 0;
		}
		var id = this.set[this.ndx];
		var card = this.owner.cards[id];
		return card;
	},

	add: function(card) {
		this.set.push(card.id);
	},

	remove: function(card) {
		var ndx = this.getNdxForId(card.id);
		this.set.splice(ndx,1);
		this.ndx = Math.max(ndx-1, -1);
	},

	isPresent: function(card) {
		return (this.set.indexOf(card.id) >= 0);
	},

	getNdxForId: function(id) {
		for (var ndx=0; ndx<this.set.length; ndx++) {
			if (id == this.set[ndx]) {
				return ndx;
			}
		}
		return -1;
	},

	nextRandom: function() {
		if (!this.getLength()) {
			return null;
		}

		// if one card in the stack has a zero acnt, choose it
		for (var ndx=0; ndx<this.set.length; ndx++) {
			var card = this.owner.cards[this.set[ndx]];
			if (card.getAcnt(this.dir) <= 0) {
				return card;
			}
		}
		
		// make a modified copy of the set
		var sortable = [];
		for (var ndx=0; ndx<this.set.length; ndx++) {
			//sortable.push({ndx:ndx, id:this.set[ndx]});
			var card = this.owner.cards[this.set[ndx]];
			sortable.push({ndx:ndx, id:this.set[ndx], seq:card.seq, z:card.getZ(this.dir)});
		}

		// order it by z ascending
		var self = this;
		sortable.sort(function(a,b) {
			return self.owner.cards[a.id].getZ(self.dir) - self.owner.cards[b.id].getZ(self.dir);
		});

		// remove the most recently used members (highest z)
		var halfSetSize = Math.floor(this.getLength()/2);
		for (var i=0; i<halfSetSize; i++) {
			sortable.pop();
		}

		// of the remaining, pick one at random
		var len = sortable.length;
		var r = Math.random();  // a number between 0 and 1
		var n = r * len;
		n = Math.floor(n);

		// (n should now be between 0 and len-1)
		if (n < 0 || n > len-1)
			debugger;

		var o = sortable[n];
		this.ndx = o.ndx;
		var id = o.id;
		var card = this.owner.cards[id];
		return card;
	},

	toString: function() {
		var s = "";
		var id,card;
		var len = Math.min(this.getLength(), 10);
		for (var ndx=0; ndx<len; ndx++) {
			id = this.set[ndx];
			card = this.owner.cards[id];
			s += card.toString(this.dir) + "<br/>";
		}
		//var leftover = this.getLength() - len;
		//if (leftover > 0) {
		//	s += leftover + ' more...';
		//}
		return s;
	},

	resetPendings: function(prevOk) {
		var id,card;
		for (var ndx=0; ndx<this.set.length; ndx++) {
			id = this.set[ndx];
			card = this.owner.cards[id];
			if (card.isPending()) {
				if (prevOk) {
					card.setClean();
				}
				else {
					card.setDirty();
				}
			}
		}
	},
	
	getTitle: function() {
		return this.dir+'/'+this.state+'/'+this.getLength();
	},

	drawStack: function() {
		var titles = {'w':'Work','u':'Untried','r':'Review','m':'Mastered'};
		var title = titles[this.state];
		var s = '<h3>' + title + ' ' + this.avgPct + '</h3><ul>';
		var id,card;
		var len = Math.min(this.getLength(), 100);
		for (var ndx=0; ndx<len; ndx++) {
			id = this.set[ndx];
			card = this.owner.cards[id];
			s += '<li id="'+id+'">' + card.drawStack(this.dir) + '</li>';
		}
		s += '</ul>';
		return s;
	},

	calcAvgPct: function(dir) {
		var totPct = 0;
		var totCnt = 0
		var id,card;
		for (var ndx=0; ndx<this.set.length; ndx++) {
			id = this.set[ndx];
			card = this.owner.cards[id];
			var acnt = card.getAcnt(dir);
			var pct = card.getPct(dir);
			totCnt++;
			totPct += pct
		}
		this.avgPct = (totCnt) ? Math.floor(totPct / totCnt) : 0;
		return this.avgPct;
	},
}
