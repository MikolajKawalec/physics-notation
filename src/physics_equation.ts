/* Javascript implementation to convert
    infix expression to postfix*/

import { EquationMember } from './equation_member'
import {
  PhysicsVariable,
  UnitInExponent,
  UnitsMismatchError,
} from './physics_notation'

//Function to return precedence of operators
function prec(c: string) {
  if (c == '^') return 3
  else if (c == '/' || c == '*') return 2
  else if (c == '+' || c == '-') return 1
  else return -1
}

export type Operator = {
  prec: number
  assoc: 'left' | 'right'
}

//@pmfenix
//add all operator with prec whitch stands for precedence
const operators: Map<string, Operator> = new Map([
  [
    '^',
    {
      prec: 4,
      assoc: 'right',
    },
  ],
  [
    '*',
    {
      prec: 3,
      assoc: 'left',
    },
  ],
  [
    '/',
    {
      prec: 3,
      assoc: 'left',
    },
  ],
  [
    '+',
    {
      prec: 2,
      assoc: 'left',
    },
  ],
  [
    '-',
    {
      prec: 2,
      assoc: 'left',
    },
  ],
  [
    'sin',
    {
      prec: 4,
      assoc: 'right',
    },
  ],
  [
    'cos',
    {
      prec: 4,
      assoc: 'right',
    },
  ],
  [
    'max',
    {
      prec: 4,
      assoc: 'right',
    },
  ],
])

const functionsNames = [
  'sin',
  'max',
  'min',
  'cos',
  'tan',
  'cot',
  'sec',
  'csc',
  'asin',
  'acos',
  'atan',
  'acot',
  'asec',
  'acsc',
  'log',
  'ln',
  'log10',
]

const operatorsStringArray: Array<string> = [
  ...Array.from(operators.keys()),
  ...functionsNames,
]

const assert = (predicate: any) => {
  if (predicate) return
  throw new Error('Assertion failed due to invalid token')
}

export function tokenize(inputString: string): Array<string> {
  //   let operation_list: Array<string> = ['-', '+', ':', '^', '(', ')', '*', '/']
  let operation_list: Array<string> = [...operatorsStringArray]
  operation_list.push('(')
  operation_list.push(')')
  operation_list.push(',')

  let results_list: Array<string> = []
  //   let results_list_descript:Array<string>=[]
  let temp_reading: string = ''
  let counter: number = 0
  let switch_replace = 1
  //console.log("Wynik dzialania funkcji tokenize: "+pom_pm_01)

  for (let i = 0; i < inputString.length; i++) {
    if (operation_list.includes(inputString[i])) {
      //console.log("licznik=", licznik_petla," Jest znak", "pom_pm_01",pom_pm_01)
      results_list.push(inputString[i])
      // results_list_descript.push("operacja")
      counter = results_list.length
      temp_reading = ''
      switch_replace = 0
    } else {
      //console.log("Znaku brak")
      temp_reading = temp_reading.concat(inputString[i])
      results_list.splice(counter, switch_replace, temp_reading)
      // results_list_descript.splice(counter,switch_replace,"liczba")
      switch_replace = 1
    }
  }

  // dziala

  // let mathSymbol: string = ''

  // for(let i = 0; i < inputString.length; i++) {
  // 	if(wektor_dzialan.includes(inputString[i])) {
  // 		if(mathSymbol.length > 0)
  // 		{
  // 			wektor_wynikowy.push(mathSymbol)
  // 			wektor_wynikowy_opis.push("liczba")
  // 		}
  // 		mathSymbol = ''
  // 		wektor_wynikowy.push(inputString[i])
  // 		wektor_wynikowy_opis.push("operacja")
  // 	}
  // 	else if (i === inputString.length - 1) {
  // 		mathSymbol += inputString[i]
  // 		wektor_wynikowy.push(mathSymbol)
  // 		wektor_wynikowy_opis.push("liczba")
  // 		mathSymbol = ''
  // 	}
  // 	else {
  // 		mathSymbol += inputString[i]
  // 	}
  // }

  //   console.log("wektor_wynikowy", results_list.toString())
  //   console.log("wektor_wynikowy_opis", results_list_descript.toString())
  return results_list
}

//significantly based of github user: tkrotoff implementation
//https://gist.github.com/tkrotoff/b0b1d39da340f5fc6c5e2a79a8b6cec0
export function infixToPostfix(tokens: Array<string>): string {
  const opSymbols: Array<string> = [...operatorsStringArray]

  const stack: Array<string> = []
  let output = ''

  const top = (stack: Array<string>) => stack.at(-1)

  const getPrecedence = (token: string) => {
    try {
      return operators.get(token).prec
    } catch (error) {
      return 0
    }
  }

  const getAssociativity = (token: string) => {
    try {
      return operators.get(token).assoc
    } catch (error) {
      return 'left'
    }
  }

  const addToOutput = (token: string) => {
    output.length === 0 ? '' : (output += ' ')
    output += token
  }

  const handlePop = () => {
    return stack.pop()
  }

  for (const token of tokens) {
    if (functionsNames.includes(token)) {
      stack.push(token)
    } else if (token === ',') {
      while (stack.length > 0 && top(stack) !== '(') {
        addToOutput(handlePop())
      }
      if (stack.length === 0) {
        throw new Error("Misplaced ','")
      }
    } else if (opSymbols.includes(token)) {
      const o1 = token
      while (
        stack.length > 0 &&
        top(stack) !== undefined &&
        top(stack) !== '(' &&
        (getPrecedence(top(stack)) > getPrecedence(o1) ||
          (getPrecedence(top(stack)) === getPrecedence(o1) &&
            getAssociativity(o1) === 'left'))
      ) {
        addToOutput(handlePop()) // o2
      }
      stack.push(o1)
    } else if (token === '(') {
      stack.push(token)
    } else if (token === ')') {
      while (stack.length > 0 && top(stack) !== '(') {
        addToOutput(handlePop())
      }
      if (stack.length > 0 && top(stack) === '(') {
        stack.pop()
      } else {
        throw new Error('Parentheses mismatch')
      }

      // Seems like a weird fix
      if (functionsNames.includes(top(stack))) {
        addToOutput(handlePop())
      }
    } else {
      addToOutput(token)
    }
  }

  // Remaining items
  while (stack.length > 0) {
    const operator = top(stack)
    if (operator === '(') {
      throw new Error('Parentheses mismatch')
    } else {
      addToOutput(handlePop())
    }
  }

  return output
}

// This code is contributed by decode2207.

//string of prefix to postfix
export class PhysicsEquation {
  protected variables: EquationMember[]
  //equation in postfix notation which is passed in constructors
  protected equationString: string

  constructor() {
    this.variables = []
    this.equationString = ''
  }

  public static fromString(
    inStr: string,
    variables: EquationMember[],
  ): PhysicsEquation {
    const pe = new PhysicsEquation()
    pe.setVariables(variables)
    const tokens = tokenize(inStr)
    const postfixString = infixToPostfix(tokens)
    pe.setEquation(postfixString)
    return pe
  }

  //this is technically viable function but it is not used in the code and is not reccomened to be used
  //as it takes as input string in reverse polish notation wtih id's of variables
  public static fromReversePolish(
    inStr: string,
    variables: EquationMember[],
  ): PhysicsEquation {
    const pe = new PhysicsEquation()
    pe.setVariables(variables)
    pe.setEquation(inStr)
    return pe
  }

  public setVariables(variables: EquationMember[]): void {
    this.variables = variables
  }

  //this would break something so error catching in caluculation should be accomodated for
  public setEquation(equation: string): void {
    this.equationString = equation
  }

  public get_formula_string(): string {
    return this.equationString
  }

  public get_formula_array(): Array<PhysicsVariable> {
    return this.variables
  }

  //TODO
  //this needs to be implemented to handle the tokens rather than searching for variables based upon their index
  public calculate(): PhysicsVariable {
    const s: Array<PhysicsVariable> = []
    const tokens = this.equationString.split(' ')
    const opSymbols: Array<string> = [...operatorsStringArray]

    for (const t of tokens) {
      const n = Number(t)
      //this is supposed to push on stack variables be
      //so things that are not operators
      if (!opSymbols.includes(t)) {
        //this is a not tested line of code
        s.push(this.variables.find((v) => v.getId() === t))
      } else {
        if (s.length < 1) {
          throw new Error(`${t}: ${s}: insufficient operands.`)
        }
        const o2 = s.pop()
        const o1 = s.pop()
        switch (t) {
          case '+':
            try {
              s.push(o1.Add(o2))
            } catch (error) {
              if (error instanceof UnitsMismatchError) {
                throw UnitsMismatchError
              }
              throw error
            }
            break
          case '-':
            try {
              s.push(o1.Substract(o2))
            } catch (error) {
              if (error instanceof UnitsMismatchError) {
                throw UnitsMismatchError
              }
              throw error
            }
            break
          case '*':
            try {
              s.push(o1.Multiply(o2))
            } catch (error) {
              throw error
            }
            break
          case '/':
            try {
              s.push(o1.Divide(o2))
            } catch (error) {
              throw error
            }
            break
          case '^':
            try {
              s.push(o1.ToPower(o2))
            } catch (error) {
              if (error instanceof UnitInExponent) {
                throw UnitInExponent
              }
              throw error
            }
            break
          case 'sin':
            s.push(o1)
            try {
              s.push(o2.Sin())
            } catch (error) {
              if (error instanceof UnitInExponent) {
                throw UnitInExponent
              }
              throw error
            }
            break

          case 'cos':
            s.push(o1)
            try {
              s.push(o2.Cos())
            } catch (error) {
              if (error instanceof UnitInExponent) {
                throw UnitInExponent
              }
              throw error
            }
            break
          case 'tan':
            s.push(o1)
            try {
              s.push(o2.Tan())
            } catch (error) {
              if (error instanceof UnitInExponent) {
                throw UnitInExponent
              }
              throw error
            }
            break
          case 'cot':
            s.push(o1)
            try {
              s.push(o2.Cot())
            } catch (error) {
              if (error instanceof UnitInExponent) {
                throw UnitInExponent
              }
              throw error
            }
            break
          case 'csc':
            s.push(o1)
            try {
              s.push(o2.Csc())
            } catch (error) {
              if (error instanceof UnitInExponent) {
                throw UnitInExponent
              }
              throw error
            }
            break
          case 'sec':
            s.push(o1)
            try {
              s.push(o2.Sec())
            } catch (error) {
              if (error instanceof UnitInExponent) {
                throw UnitInExponent
              }
            }
            break
          case 'arcsin':
            s.push(o1)
            try {
              s.push(o2.Arcsin())
            } catch (error) {
              if (error instanceof UnitInExponent) {
                throw UnitInExponent
              }
              throw error
            }
            break
          case 'arccos':
            s.push(o1)
            try {
              s.push(o2.Arccos())
            } catch (error) {
              if (error instanceof UnitInExponent) {
                throw UnitInExponent
              }
              throw error
            }
            break
          case 'arctan':
            s.push(o1)
            try {
              s.push(o2.Arctan())
            } catch (error) {
              if (error instanceof UnitInExponent) {
                throw UnitInExponent
              }
              throw error
            }
            break
          case 'arccot':
            s.push(o1)
            try {
              s.push(o2.Arccot())
            } catch (error) {
              if (error instanceof UnitInExponent) {
                throw UnitInExponent
              }
              throw error
            }
            break
          case 'arcsec':
            s.push(o1)
            try {
              s.push(o2.Arcsec())
            } catch (error) {
              if (error instanceof UnitInExponent) {
                throw UnitInExponent
              }
              throw error
            }
            break
          case 'arccsc':
            s.push(o1)
            try {
              s.push(o2.Arccsc())
            } catch (error) {
              if (error instanceof UnitInExponent) {
                throw UnitInExponent
              }
              throw error
            }
            break
          case 'sinh':
            s.push(o1)
            try {
              s.push(o2.Sinh())
            } catch (error) {
              if (error instanceof UnitInExponent) {
                throw UnitInExponent
              }
              throw error
            }
            break
          case 'cosh':
            s.push(o1)
            try {
              s.push(o2.Cosh())
            } catch (error) {
              if (error instanceof UnitInExponent) {
                throw UnitInExponent
              }
              throw error
            }
            break
          case 'tanh':
            s.push(o1)
            try {
              s.push(o2.Tanh())
            } catch (error) {
              if (error instanceof UnitInExponent) {
                throw UnitInExponent
              }
              throw error
            }
            break
          case 'coth':
            s.push(o1)
            try {
              s.push(o2.Coth())
            } catch (error) {
              if (error instanceof UnitInExponent) {
                throw UnitInExponent
              }
              throw error
            }
            break
          case 'csch':
            s.push(o1)
            try {
              s.push(o2.Csch())
            } catch (error) {
              if (error instanceof UnitInExponent) {
                throw UnitInExponent
              }
              throw error
            }
            break
          case 'sech':
            s.push(o1)
            try {
              s.push(o2.Sech())
            } catch (error) {
              if (error instanceof UnitInExponent) {
                throw UnitInExponent
              }
              throw error
            }
            break
          case 'arcsinh':
            s.push(o1)
            try {
              s.push(o2.Arcsinh())
            } catch (error) {
              if (error instanceof UnitInExponent) {
                throw UnitInExponent
              }
              throw error
            }
            break
          case 'arccosh':
            s.push(o1)
            try {
              s.push(o2.Arccosh())
            } catch (error) {
              if (error instanceof UnitInExponent) {
                throw UnitInExponent
              }
              throw error
            }
            break
          case 'arctanh':
            s.push(o1)
            try {
              s.push(o2.Arctanh())
            } catch (error) {
              if (error instanceof UnitInExponent) {
                throw UnitInExponent
              }
              throw error
            }
            break
          case 'arccoth':
            s.push(o1)
            try {
              s.push(o2.Arccoth())
            } catch (error) {
              if (error instanceof UnitInExponent) {
                throw UnitInExponent
              }
              throw error
            }
            break
          case 'arcsech':
            s.push(o1)
            try {
              s.push(o2.Arcsech())
            } catch (error) {
              if (error instanceof UnitInExponent) {
                throw UnitInExponent
              }
              throw error
            }
            break
          case 'arccsch':
            s.push(o1)
            try {
              s.push(o2.Arccsch())
            } catch (error) {
              if (error instanceof UnitInExponent) {
                throw UnitInExponent
              }
              throw error
            }
            break
          case 'ln':
            s.push(o1)
            try {
              s.push(o2.Ln())
            } catch (error) {
              if (error instanceof UnitInExponent) {
                throw UnitInExponent
              }
              throw error
            }
            break
          case 'log10':
            s.push(o1)
            try {
              s.push(o2.Log10())
            } catch (error) {
              if (error instanceof UnitInExponent) {
                throw UnitInExponent
              }
              throw error
            }
            break
          case 'log':
            try {
              s.push(o2.Log(o1))
            } catch (error) {
              if (error instanceof UnitInExponent) {
                throw UnitInExponent
              }
              throw error
            }
            break
          case 'abs':
            s.push(o1)
            try {
              s.push(o2.Abs())
            } catch (error) {
              if (error instanceof UnitInExponent) {
                throw UnitInExponent
              }
              throw error
            }
            break
          case 'min':
            try {
              s.push(o2.Min(o1))
            } catch (error) {
              if (error instanceof UnitInExponent) {
                throw UnitInExponent
              }
              throw error
            }
            break
          case 'max':
            try {
              s.push(o2.Max(o1))
            } catch (error) {
              if (error instanceof UnitInExponent) {
                throw UnitInExponent
              }
              throw error
            }
            break

          //Here more to be implemented
          default:
            throw new Error(`Unrecognized operator: [${t}]`)
        }
      }
    }

    return s.pop()
  }
}
