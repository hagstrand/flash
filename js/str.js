// अथ योगानुशासनम्॥१॥
/**
	class Str
	static class, not instantiated
	one method: get()
	Contains and manages display strings.
*/
function Str() {
}

/**
	@param {string|number} id
	@param {Array|null} [a]
*/
Str.get = function(id, a) {
	var target = Str.strings[id];
	if (typeof(a) != 'undefined') {
		for (var i=0; i<a.length; i++) {
			target = target.replace('$'+(i+1), a[i]);
		}
	}
	return target;
};
