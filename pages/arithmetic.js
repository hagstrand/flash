var data = {
	name: "arithmetic",
	title: "Arithmetic",
	reversible:false,
	language:false,
	sketch:false,
	translit:false,
	audio:false,
	db: false,
	hm: false, // show translit with question or answer
	cards: [
		{q:'1 x 1', a:'1'},
		{q:'1 x 2', a:'2'},
		{q:'1 x 3', a:'3'},
		{q:'1 x 4', a:'4'},
		{q:'1 x 5', a:'5'},
		{q:'1 x 6', a:'6'},
		{q:'1 x 7', a:'7'},
		{q:'1 x 8', a:'8'},
		{q:'1 x 9', a:'9'},
		{q:'1 x 10', a:'10'},
		{q:'1 x 11', a:'11'},
		{q:'1 x 12', a:'12'},
		{q:'2 x 1', a:'2'},
		{q:'2 x 2', a:'4'},
		{q:'2 x 3', a:'6'},
		{q:'2 x 4', a:'8'},
		{q:'2 x 5', a:'10'},
		{q:'2 x 6', a:'12'},
		{q:'2 x 7', a:'14'},
		{q:'2 x 8', a:'16'},
		{q:'2 x 9', a:'18'},
		{q:'2 x 10', a:'20'},
		{q:'2 x 11', a:'22'},
		{q:'2 x 12', a:'24'},
		{q:'3 x 1', a:'3'},
		{q:'3 x 2', a:'6'},
		{q:'3 x 3', a:'9'},
		{q:'3 x 4', a:'12'},
		{q:'3 x 5', a:'15'},
		{q:'3 x 6', a:'18'},
		{q:'3 x 7', a:'21'},
		{q:'3 x 8', a:'24'},
		{q:'3 x 9', a:'27'},
		{q:'3 x 10', a:'30'},
		{q:'3 x 11', a:'33'},
		{q:'3 x 12', a:'36'},
		{q:'4 x 1', a:'4'},
		{q:'4 x 2', a:'8'},
		{q:'4 x 3', a:'12'},
		{q:'4 x 4', a:'16'},
		{q:'4 x 5', a:'20'},
		{q:'4 x 6', a:'24'},
		{q:'4 x 7', a:'28'},
		{q:'4 x 8', a:'32'},
		{q:'4 x 9', a:'36'},
		{q:'4 x 10', a:'40'},
		{q:'4 x 11', a:'44'},
		{q:'4 x 12', a:'48'},
		{q:'5 x 1', a:'5'},
		{q:'5 x 2', a:'10'},
		{q:'5 x 3', a:'15'},
		{q:'5 x 4', a:'20'},
		{q:'5 x 5', a:'25'},
		{q:'5 x 6', a:'30'},
		{q:'5 x 7', a:'35'},
		{q:'5 x 8', a:'40'},
		{q:'5 x 9', a:'45'},
		{q:'5 x 10', a:'50'},
		{q:'5 x 11', a:'55'},
		{q:'5 x 12', a:'60'},
		{q:'6 x 1', a:'6'},
		{q:'6 x 2', a:'12'},
		{q:'6 x 3', a:'18'},
		{q:'6 x 4', a:'24'},
		{q:'6 x 5', a:'30'},
		{q:'6 x 6', a:'36'},
		{q:'6 x 7', a:'42'},
		{q:'6 x 8', a:'48'},
		{q:'6 x 9', a:'54'},
		{q:'6 x 10', a:'60'},
		{q:'6 x 11', a:'66'},
		{q:'6 x 12', a:'72'},
		{q:'7 x 1', a:'7'},
		{q:'7 x 2', a:'14'},
		{q:'7 x 3', a:'21'},
		{q:'7 x 4', a:'28'},
		{q:'7 x 5', a:'35'},
		{q:'7 x 6', a:'42'},
		{q:'7 x 7', a:'49'},
		{q:'7 x 8', a:'56'},
		{q:'7 x 9', a:'63'},
		{q:'7 x 10', a:'70'},
		{q:'7 x 11', a:'77'},
		{q:'7 x 12', a:'84'},
		{q:'8 x 1', a:'8'},
		{q:'8 x 2', a:'16'},
		{q:'8 x 3', a:'24'},
		{q:'8 x 4', a:'32'},
		{q:'8 x 5', a:'40'},
		{q:'8 x 6', a:'48'},
		{q:'8 x 7', a:'56'},
		{q:'8 x 8', a:'64'},
		{q:'8 x 9', a:'72'},
		{q:'8 x 10', a:'80'},
		{q:'8 x 11', a:'88'},
		{q:'8 x 12', a:'96'},
		{q:'9 x 1', a:'9'},
		{q:'9 x 2', a:'18'},
		{q:'9 x 3', a:'27'},
		{q:'9 x 4', a:'36'},
		{q:'9 x 5', a:'45'},
		{q:'9 x 6', a:'54'},
		{q:'9 x 7', a:'63'},
		{q:'9 x 8', a:'72'},
		{q:'9 x 9', a:'81'},
		{q:'9 x 10', a:'90'},
		{q:'9 x 11', a:'99'},
		{q:'9 x 12', a:'108'},
		{q:'10 x 1', a:'10'},
		{q:'10 x 2', a:'20'},
		{q:'10 x 3', a:'30'},
		{q:'10 x 4', a:'40'},
		{q:'10 x 5', a:'50'},
		{q:'10 x 6', a:'60'},
		{q:'10 x 7', a:'70'},
		{q:'10 x 8', a:'80'},
		{q:'10 x 9', a:'90'},
		{q:'10 x 10', a:'100'},
		{q:'10 x 11', a:'110'},
		{q:'10 x 12', a:'120'},
		{q:'11 x 1', a:'11'},
		{q:'11 x 2', a:'22'},
		{q:'11 x 3', a:'33'},
		{q:'11 x 4', a:'44'},
		{q:'11 x 5', a:'55'},
		{q:'11 x 6', a:'66'},
		{q:'11 x 7', a:'77'},
		{q:'11 x 8', a:'88'},
		{q:'11 x 9', a:'99'},
		{q:'11 x 10', a:'110'},
		{q:'11 x 11', a:'121'},
		{q:'11 x 12', a:'132'},
		{q:'12 x 1', a:'12'},
		{q:'12 x 2', a:'24'},
		{q:'12 x 3', a:'36'},
		{q:'12 x 4', a:'48'},
		{q:'12 x 5', a:'60'},
		{q:'12 x 6', a:'72'},
		{q:'12 x 7', a:'84'},
		{q:'12 x 8', a:'96'},
		{q:'12 x 9', a:'108'},
		{q:'12 x 10', a:'120'},
		{q:'12 x 11', a:'132'},
		{q:'12 x 12', a:'144'},
	]
}
onScriptLoaded(data);