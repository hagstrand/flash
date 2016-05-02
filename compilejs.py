#!/usr/bin/python2.4

import httplib, urllib, sys

# Define the parameters for the POST request and encode them in
# a URL-safe format.

params = urllib.urlencode([
	('code_url', 'http://flash.hagstrand.com/minimal/minimal.js'),
	('code_url', 'http://flash.hagstrand.com/jslib/utils.js'),
	('code_url', 'http://flash.hagstrand.com/jslib/dragger.js'),
	('code_url', 'http://flash.hagstrand.com/jslib/observer.js'),
	('code_url', 'http://flash.hagstrand.com/jslib/note.js'),
	('code_url', 'http://flash.hagstrand.com/jslib/browserhistory.js'),
	('code_url', 'http://flash.hagstrand.com/jslib/sketch.js'),
	('code_url', 'http://flash.hagstrand.com/jslib/voyclogo.js'),
	('code_url', 'http://flash.hagstrand.com/icon/icon.js'),
	('code_url', 'http://flash.hagstrand.com/icon/lib/menu.js'),
	('code_url', 'http://flash.hagstrand.com/icon/lib/gear.js'),
	('code_url', 'http://flash.hagstrand.com/js/flash.js'),
	('code_url', 'http://flash.hagstrand.com/js/coach.js'),
	('code_url', 'http://flash.hagstrand.com/js/program.js'),
	('code_url', 'http://flash.hagstrand.com/js/desk.js'),
	('code_url', 'http://flash.hagstrand.com/js/str.js'),
	('code_url', 'http://flash.hagstrand.com/js/card.js'),
	('code_url', 'http://flash.hagstrand.com/js/stack.js'),
	('compilation_level', 'ADVANCED_OPTIMIZATIONS'),
	('language', 'ECMASCRIPT5'),
	('output_format', 'text'),
	('output_info', 'compiled_code'),
	('formatting', 'pretty_print'),
])

# Always use the following value for the Content-type header.
headers = { "Content-type": "application/x-www-form-urlencoded" }
conn = httplib.HTTPConnection('closure-compiler.appspot.com')
conn.request('POST', '/compile', params, headers)
response = conn.getresponse()
data = response.read()
print data
conn.close()
