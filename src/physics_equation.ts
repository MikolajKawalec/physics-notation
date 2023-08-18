/* Javascript implementation to convert
    infix expression to postfix*/

import {
	PhysicsVariable,
	UnitInExponent,
	UnitsMismatchError,
} from './physics_notation';

//Function to return precedence of operators
function prec(c: string) {
	if (c == '^') return 3;
	else if (c == '/' || c == '*') return 2;
	else if (c == '+' || c == '-') return 1;
	else return -1;
}

const operators: any = {
	'^': {
		prec: 4,
		assoc: 'right',
	},
	'*': {
		prec: 3,
		assoc: 'left',
	},
	'/': {
		prec: 3,
		assoc: 'left',
	},
	'+': {
		prec: 2,
		assoc: 'left',
	},
	'-': {
		prec: 2,
		assoc: 'left',
	},
};

const assert = (predicate: any) => {
	if (predicate) return;
	throw new Error('Assertion failed due to invalid token');
};

export function infixToPostfix(input: string) {
	const opSymbols = Object.keys(operators);
	const stack: Array<any> = [];
	let output = '';

	const peek = () => {
		return stack.at(-1);
	};

	const addToOutput = (token: any) => {
		output += token;
	};

	const handlePop = () => {
		return stack.pop();
	};

	const handleToken = (token: any) => {
		switch (true) {
			case !isNaN(parseFloat(token)):
				addToOutput(token);
				break;
			case opSymbols.includes(token):
				const o1 = token;
				let o2 = peek();

				while (
					o2 !== undefined &&
					o2 !== '(' &&
					(operators[o2].prec > operators[o1].prec ||
						(operators[o2].prec === operators[o1].prec &&
							operators[o1].assoc === 'left'))
				) {
					addToOutput(handlePop());
					o2 = peek();
				}
				stack.push(o1);
				break;
			case token === '(':
				stack.push(token);
				break;
			case token === ')':
				let topOfStack = peek();
				while (topOfStack !== '(') {
					assert(stack.length !== 0);
					addToOutput(handlePop());
					topOfStack = peek();
				}
				assert(peek() === '(');
				handlePop();
				break;
			default:
			// throw new Error(`Invalid token: ${token}`);
		}
	};

	for (let i of input) {
		if (i === ' ') continue;

		handleToken(i);
	}

	while (stack.length !== 0) {
		assert(peek() !== '(');
		addToOutput(stack.pop());
	}

	return output;
}

let exp = 'a+b*(c^d-e)^(f+g*h)-i';
infixToPostfix(exp);

// This code is contributed by decode2207.

//string of prefix to postfix
export class PhysicsEquation {
	protected variables: PhysicsVariable[];
	protected equationString: string;

	constructor() {
		this.variables = [];
		this.equationString = '';
	}

	public static fromString(
		inStr: string,
		variables: PhysicsVariable[]
	): PhysicsEquation {
		const pe = new PhysicsEquation();
		pe.setVariables(variables);
		pe.setEquation(infixToPostfix(inStr));
		return pe;
	}

	public static fromReversePolish(
		inStr: string,
		variables: PhysicsVariable[]
	): PhysicsEquation {
		const pe = new PhysicsEquation();
		pe.setVariables(variables);
		pe.setEquation(inStr);
		return pe;
	}

	public setVariables(variables: PhysicsVariable[]): void {
		this.variables = variables;
	}

	//this would break something so error catching in caluculation should be accomodaded for
	public setEquation(equation: string): void {
		this.equationString = equation;
	}

	public calculate(): PhysicsVariable {
		const s: Array<PhysicsVariable> = [];
		const tokens = this.equationString.split('');

		for (const t of tokens) {
			const n = Number(t);
			if (!isNaN(n)) {
				s.push(this.variables[n]);
			} else {
				if (s.length < 2) {
					throw new Error(`${t}: ${s}: insufficient operands.`);
				}
				const o2 = s.pop();
				const o1 = s.pop();
				switch (t) {
					case '+':
						try {
							s.push(o1.Add(o2));
						} catch (error) {
							if (error instanceof UnitsMismatchError) {
								throw UnitsMismatchError;
							}
							throw error;
						}
						break;
					case '-':
						try {
							s.push(o1.Substract(o2));
						} catch (error) {
							if (error instanceof UnitsMismatchError) {
								throw UnitsMismatchError;
							}
							throw error;
						}
						break;
					case '*':
						try {
							s.push(o1.Multiply(o2));
						} catch (error) {
							throw error;
						}
						break;
					case '/':
						try {
							s.push(o1.Divide(o2));
						} catch (error) {
							throw error;
						}
						break;
					case '^':
						try {
							s.push(o1.ToPower(o2));
						} catch (error) {
							if (error instanceof UnitInExponent) {
								throw UnitInExponent;
							}
							throw error;
						}
						break;
					default:
						throw new Error(`Unrecognized operator: [${t}]`);
				}
			}
		}

		return s.pop();
	}
}
