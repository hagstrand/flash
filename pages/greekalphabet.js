var subject = 'greekalphabet';
subjects[subject] = {
	name: "Greek Alphabet",
	reversible:true,
	language:false,
	sketch:false,
	translit:false,
	audio:false,
	db: false,
	hm: false, // show translit with question or answer
	cards: [
		{q:'Α α', a:'alpha'},
		{q:'Β β', a:'beta'},
		{q:'Γ γ', a:'gamma'},
		{q:'Δ δ', a:'delta'},
		{q:'Ε ε', a:'epsilon'},
		{q:'Ζ ζ', a:'zeta'},
		{q:'Η η', a:'eta'},
		{q:'Θ θ', a:'theta'},
		{q:'Ι ι', a:'iota'},
		{q:'Κ κ', a:'kappa'},
		{q:'Λ λ', a:'lambda'},
		{q:'Μ μ', a:'mu'},
		{q:'Ν ν', a:'nu'},
		{q:'Ξ ξ', a:'xi'},
		{q:'Ο ο', a:'omicron'},
		{q:'Π π', a:'pi'},
		{q:'Ρ ρ', a:'rho'},
		{q:'Σ σ', a:'sigma'},
		{q:'Τ τ', a:'tau'},
		{q:'Υ υ', a:'upsilon'},
		{q:'Φ φ', a:'phi'},
		{q:'Χ χ', a:'chi'},
		{q:'Ψ ψ', a:'psi'},
		{q:'Ω ω', a:'omega'},
	]
}
onscriptloaded(subject);
