var data = {
	name: 'tibetanphrases';
	title: "Tibetan Phrases",
	reversible:true,
	language:true,
	sketch:true,
	translit:true,
	audio:false,
	db: false,
	hm: false, // show translit with question or answer
	cards: [
		{ q:"བཀྲ་ཤིས་བདེ་ལེགས།", t:"tashi dalek", a:"hello" },
		{ q:"སྔ་དྲོ་བདེ་ལེགས།", t:"nga-to delek", a:"good morning" },
		{ q:"ཁྱེད་རང་སྐུ་གཇུགས་བདེ་པོ་ཡིན་པས།", t:"kayrang kusu debo yimbay", a:"how are you" },
		{ q:"ཁྱེད་རང་གི་མཚན་ལ་ག་རེ་ཞུ་གི་ཡོད།", t:"kayrang gi minglâ karay ray?", a:"what's your name" },
		{ q:"ཐུགས་རྗེ་ཆེ་།", t:"tujay-chay", a:"thank you" },
		{ q:"རེད།", t:"hon", a:"yes" },
		{ q:"", t:"ma-ray", a:"no" },
		{ q:"", t:"la yin-dang-yin", a:"you're welcome" },
		{ q:"", t:"cho-la", a:"excuse me sir (literal:`elder brother)" },
		{ q:"", t:"ah-cha-la", a:"excuse me madam (literal:`elder sister)" },
	]
};
onScriptLoaded(data);
