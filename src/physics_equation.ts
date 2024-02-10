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
      prec: 2,
      assoc: 'right',
    },
  ],
  [
    'max',
    {
      prec: 2,
      assoc: 'right',
    },
  ],
])

const assert = (predicate: any) => {
  if (predicate) return
  throw new Error('Assertion failed due to invalid token')
}

export function tokenize(inputString: string): Array<string> {
  //   let operation_list: Array<string> = ['-', '+', ':', '^', '(', ')', '*', '/']
  let operation_list: Array<string> = Array.from(operators.keys())
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

export function infixToPostfix(input: Array<string>): string {
  const opSymbols: Array<string> = Array.from(operators.keys())
  const stack: Array<string> = []
  let output = ''

  const peek = () => {
    return stack.at(-1)
  }

  const addToOutput = (token: string) => {
    output.length === 0 ? '' : (output += ' ')
    output += token
  }

  const handlePop = () => {
    return stack.pop()
  }

  const handleToken = (token: string) => {
    switch (true) {
      //   case !isNaN(parseFloat(token)):
      //     addToOutput(token)
      //     break
      case token === ',':
        break
      case opSymbols.includes(token):
        const o1 = token
        let o2 = peek()

        while (
          o2 !== undefined &&
          o2 !== '(' &&
          (operators.get(o2).prec > operators.get(o1).prec ||
            (operators.get(o2).prec === operators.get(o1).prec &&
              operators.get(o1).assoc === 'left'))
        ) {
          addToOutput(handlePop())
          o2 = peek()
        }
        stack.push(o1)
        break
      case token === '(':
        stack.push(token)
        break
      case token === ')':
        if (peek() === '(') {
          handlePop()
        }
        while (stack.length > 0 && peek() !== '(') {
          addToOutput(handlePop())
        }
        handlePop()
        break
      default:
        addToOutput(token)
        break
    }
  }

  for (let i of input) {
    if (i === ' ') continue

    handleToken(i)
  }

  while (stack.length !== 0) {
    assert(peek() !== '(')
    addToOutput(stack.pop())
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
    const opSymbols: Array<string> = Array.from(operators.keys())

    for (const t of tokens) {
      const n = Number(t)
      //this is supposed to push on stack variables be
      //so things that are not operators
      if (!opSymbols.includes(t)) {
        //this is a not tested line of code
        s.push(this.variables.find((v) => v.getId() === t))
      } else {
        if (s.length < 2) {
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
          //Here more to be implemented
          default:
            throw new Error(`Unrecognized operator: [${t}]`)
        }
      }
    }

    return s.pop()
  }
}
