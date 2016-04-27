// अथ योगानुशासनम्॥१॥
// Manage the internals display, for developers
Internals = function() { 
}

Internals.prototype = {
	setup: function() {
		// move internals form into modeless area
		$('internals-container').appendChild($('internals'));

		this.attachDomEventHandlers();
		this.attachFlashNoteHandlers();
		this.toggleInternals(false);
		this.toggleDebugSettings(false);
	},
	attachFlashNoteHandlers: function() {
		var self = this;
 		flash.observer.subscribe('show-internals-request', 'modeless', function(note) {
			self.toggleInternals(note.payload.show);
		});
		flash.observer.subscribe('question', 'modeless', function(note) {
			if (self.isShowingInternals()) {
				self.populateInternals(note);
			}
		});
	},
	attachDomEventHandlers: function() {
		var self = this;
		window.addEventListener('keyup', function(event) {
		    if (event.keyCode === 88 && event.altKey) {   // alt-x
				self.toggleInternals();
		        return false;
		    }
		    if (event.keyCode === 90 && event.altKey) {   // alt-z
				var notename = (flash.view.isAutoPlay) ? 'autoplay-cancelled' : 'autoplay-request';
				flash.observer.publish(new Note(notename, 'internals', {}));
		        return false;
		    }
			if (event.keyCode == 27) {  // escape key
				self.toggleInternals(false);
				flash.observer.publish(new Note('autoplay-cancelled', 'internals', {}));
		        return false;
			}
		});
		$('debug-autoplay-cb').addEventListener('change', function(event) {
			var bool = event.target.checked;
			var notename = (bool) ? 'autoplay-request' : 'autoplay-cancelled';
			flash.observer.publish(new Note(notename, 'modeless', {}));
		});
		$('numQuestions').addEventListener('change', function(event) {
			flash.coach.nSession = event.target.value;
		});
		$('maxSizeWork').addEventListener('change', function(event) {
			flash.coach.settings.maxWork = event.target.value;
		});
		$('maxSizeReview').addEventListener('change', function(event) {
			flash.coach.settings.maxReview = event.target.value;
		});
		$('reviewPct').addEventListener('change', function(event) {
			flash.coach.settings.reviewPct = event.target.value;
		});
		$('primedPct').addEventListener('change', function(event) {
			flash.coach.settings.primedPct = event.target.value;
		});
		$('workRequirement').addEventListener('change', function(event) {
			flash.coach.settings.workRequirement = event.target.value;
		});
		$('reviewRequirement').addEventListener('change', function(event) {
			flash.coach.settings.reviewRequirement = event.target.value;
		});
		$('reapplyDefaults').addEventListener('click', function(event) {
			flash.coach.settings.reviewRequirement = flash.coach.defaults.reviewRequirement;
			flash.coach.settings.maxWork = flash.coach.defaults.maxWork;
			flash.coach.settings.maxReview = flash.coach.defaults.maxReview;
			flash.coach.settings.reviewPct = flash.coach.defaults.reviewPct;
			flash.coach.settings.primedPct = flash.coach.defaults.primedPct;
			flash.coach.settings.workRequirement = flash.coach.defaults.workRequirement;
			self.populateInternals();
		});
		$('debug-settings-btn').addEventListener('click', function(event) {
			self.toggleDebugSettings();
		});
	},

	isShowingInternals: function() {
		return ($('internals').style.display == 'block');
	},
	toggleInternals: function(boo) {
		var show = (typeof(boo) == 'boolean') ? boo : !this.isShowingInternals();
		$('internals').style.display = (show) ? 'block' : 'none';
		if (show) {
			this.populateInternals();
		}
	},

	isShowingDebugSettings: function() {
		return ($('settingsform').style.display == 'block');
	},
	toggleDebugSettings: function(boo) {
		var show = (typeof(boo) == 'boolean') ? boo : !this.isShowingDebugSettings();
		$('settingsform').style.display = (show) ? 'block' : 'none';
	},

	populateInternals: function() {
		$('debug-autoplay-cb').checked = flash.view.isAutoPlay;
		$('numQuestions').value = flash.coach.nSession;
		$('currentDir').value = flash.program.dir;
		$('maxSizeWork').value = flash.coach.settings.maxWork;
		$('maxSizeReview').value = flash.coach.settings.maxReview;
		$('reviewPct').value = flash.coach.settings.reviewPct;
		$('primedPct').value = flash.coach.settings.primedPct;
		$('workRequirement').value = flash.coach.settings.workRequirement;
		$('reviewRequirement').value = flash.coach.settings.reviewRequirement;
		
		var state, eid, set, dir;
		for (var d=0; d<Program.allDirs.length; d++) {
			dir = Program.allDirs[d];
			for (var st=0; st<Card.allStates.length; st++) {
				state = Card.allStates[st];
				set = flash.program.getSetByState(state,dir);
				if (set) {
					eid = 'debug'+dir+state;
					$(eid).innerHTML = set.toString();
					$(eid+'-hdr').innerHTML = set.getTitle();
				}
			}
		}
	},
}
