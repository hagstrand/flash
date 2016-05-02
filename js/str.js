// अथ योगानुशासनम्॥१॥
/**
	class Str
	@constructor
	singleton
	Contains and manages display strings.
*/
function Str() {
	// is singleton
	if (Str._instance) return Str._instance;
	else Str._instance = this;

	this.strings = {
		'complete': 'Success!',
		'program-options': 'Program Options',
		'comm-fail': 'Unable to reach server.  Please try again later.',
		'system-error': 'System error.  Contact support.',
		'change-program': 'Choose Program',
		'changing-program': 'Loading the $1 program.',
		'qa': 'Reading/Listening',
		'aq': 'Writing/Speaking',
		'contact-server': 'Contact Server',
		'contacting-server': 'Contacting server...',
		'welcome': 'Welcome',
		'please-login': 'Please login or register so we can save your progress.',
		'wait': 'Please wait a moment...',

		// returned from svc:register
		'username-in-use': 'Username already on file.',
		'email-in-use': 'Email already on file.',
		'send-email-failed': 'Unable to send verification email.',

		// returned from svc:login
		'email-password-no-match': 'Wrong password.',
		'email-not-found': 'This username or email is not found.',
	};
}

Str.prototype = {
	get: function(id, a) {
		var target = this.strings[id];
		if (typeof(a) != 'undefined') {
			for (var i=0; i<a.length; i++) {
				target = target.replace('$'+(i+1), a[i]);
			}
		}
		return target;
	},
};
