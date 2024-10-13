import { EquationMember } from './equation_member'
import { PhysicsEquation, infixToPostfix, tokenize } from './physics_equation'
import {
  PhysicsVariable,
  getEmptyUnit,
  Unit,
  UnitsMismatchError,
  IsKilogram,
} from './physics_notation'

test('creates 0 tuple (array in JS) of size 7', () => {
  expect(getEmptyUnit()).toMatchObject([0, 0, 0, 0, 0, 0, 0])
})

test('Is Kilogram function', () => {
  //1s
  let second: Unit<number> = [1, 0, 0, 0, 0, 0, 0]
  expect(IsKilogram(second)).toBeFalsy()
  //1
  let one: Unit<number> = [0, 0, 0, 0, 0, 0, 0]
  expect(IsKilogram(one)).toBeFalsy()
  //1kg
  let kilogram: Unit<number> = [0, 0, 1, 0, 0, 0, 0]
  expect(IsKilogram(kilogram)).toBeTruthy()
  //1N
  let newton: Unit<number> = [1, -2, 1, 0, 0, 0, 0]
  expect(IsKilogram(newton)).toBeFalsy()
})

test('Default constructor creates 0ed Physics Variables', () => {
  expect(new PhysicsVariable().toString()).toEqual('0,0,0,0,0,0,0,0,0')
})

test('Create 21.37 km (from string)', () => {
  let pv = PhysicsVariable.fromString('21.37,3,0,1,0,0,0,0,0')
  expect(pv.toString()).toEqual('21.37,3,0,1,0,0,0,0,0')
  expect(pv.getValue()).toEqual(21.37)
  expect(pv.getPrefix()).toEqual(3)
  expect(pv.getUnit()).toMatchObject([0, 1, 0, 0, 0, 0, 0])
  expect(pv.toVerboseString()).toEqual('21.37km')
  expect(pv.getUnitString()).toEqual('0,1,0,0,0,0,0')
})

test('Create 21.37 km (from values)', () => {
  let pv = PhysicsVariable.fromValues(21.37, 3, [0, 1, 0, 0, 0, 0, 0])
  expect(pv.toString()).toEqual('21.37,3,0,1,0,0,0,0,0')
  expect(pv.getValue()).toEqual(21.37)
  expect(pv.getPrefix()).toEqual(3)
  expect(pv.getUnit()).toMatchObject([0, 1, 0, 0, 0, 0, 0])
  expect(pv.toVerboseString()).toEqual('21.37km')
  expect(pv.getUnitString()).toEqual('0,1,0,0,0,0,0')
})

test('Create 10 MJ', () => {
  let pv = PhysicsVariable.fromString('10,6,-2,2,1,0,0,0,0')
  expect(pv.toString()).toEqual('10,6,-2,2,1,0,0,0,0')
  expect(pv.getValue()).toEqual(10)
  expect(pv.getPrefix()).toEqual(6)
  expect(pv.getUnit()).toMatchObject([-2, 2, 1, 0, 0, 0, 0])
  expect(pv.toVerboseString()).toEqual('10MJ')
  expect(pv.getUnitString()).toEqual('-2,2,1,0,0,0,0')
})

test('Converts 10 kJ to J', () => {
  let pv = PhysicsVariable.fromString('10,3,-2,2,1,0,0,0,0')
  expect(pv.convertValueToBase(0)).toEqual(10000)
})

test('Converts 10,000 J to kJ', () => {
  let pv = PhysicsVariable.fromString('10000,0,-2,2,1,0,0,0,0')
  expect(pv.convertValueToBase(3)).toEqual(10)
})

test('Add one 1J to 1J', () => {
  let pv1 = PhysicsVariable.fromString('1,0,-2,2,1,0,0,0,0')
  let pv2 = PhysicsVariable.fromString('1,0,-2,2,1,0,0,0,0')
  expect(pv1.Add(pv2).toVerboseString()).toEqual('2J')
})

test('Add 1kJ to 1J', () => {
  let pv1 = PhysicsVariable.fromString('1,3,-2,2,1,0,0,0,0')
  let pv2 = PhysicsVariable.fromString('1,0,-2,2,1,0,0,0,0')
  expect(pv1.Add(pv2).toVerboseString()).toEqual('1.001kJ')
})

test('Add 1J to 1kJ', () => {
  let pv1 = PhysicsVariable.fromString('1,0,-2,2,1,0,0,0,0')
  let pv2 = PhysicsVariable.fromString('1,3,-2,2,1,0,0,0,0')
  expect(pv1.Add(pv2).toVerboseString()).toEqual('1001J')
})

// I dont know how to test errors
// test('Add 1J to 1(no unit) (anticipate error)', () => {
// 	let pv1 = PhysicsVariable.fromString('1,0,-2,2,1,0,0,0,0');
// 	let pv2 = PhysicsVariable.fromString('1,0,0,0,0,0,0,0,0');
// 	expect(pv1.Add(pv2)).toThrow(UnitsMismatchError);
// });

test('Subtract one 1J from 1J', () => {
  let pv1 = PhysicsVariable.fromString('1,0,-2,2,1,0,0,0,0')
  let pv2 = PhysicsVariable.fromString('1,0,-2,2,1,0,0,0,0')
  expect(pv1.Subtract(pv2).toVerboseString()).toEqual('0J')
})

test('Substract 1J from 1kJ', () => {
  let pv1 = PhysicsVariable.fromString('1,3,-2,2,1,0,0,0,0')
  let pv2 = PhysicsVariable.fromString('1,0,-2,2,1,0,0,0,0')
  expect(pv1.Subtract(pv2).toVerboseString()).toEqual('0.999kJ')
})

test('SIN 30 but in radians', () => {
  let pv1 = PhysicsVariable.fromString('0.5233333333333,0,0,0,0,0,0,0,0')
  //let pv2 = PhysicsVariable.fromString('1,0,-2,2,1,0,0,0,0')
  expect(pv1.Sin().getValue()).toBeCloseTo(0.5, 2)
})

test('Substract 1kJ from 1J', () => {
  //1J
  let pv1 = PhysicsVariable.fromString('1,0,-2,2,1,0,0,0,0')
  //1kJ
  let pv2 = PhysicsVariable.fromString('1,3,-2,2,1,0,0,0,0')
  //1J-1kJ=-999J
  expect(pv1.Subtract(pv2).toVerboseString()).toEqual('-999J')
})

test('Multiple 1A 1s = 1C', () => {
  let pv1 = PhysicsVariable.fromString('1,0,1,0,0,0,0,0,0')
  let pv2 = PhysicsVariable.fromString('1,0,0,0,0,1,0,0,0')
  expect(pv1.Multiply(pv2).toVerboseString()).toEqual('1C')
})

test('Multiple 1m/s^2 1kg = 1N', () => {
  let pv1 = PhysicsVariable.fromString('1,0,1,-2,0,0,0,0,0')
  let pv2 = PhysicsVariable.fromString('1,3,0,0,1,0,0,0,0')
  let pvResult = pv1.Multiply(pv2)
  expect(pvResult.getUnitString()).toEqual('1,-2,1,0,0,0,0')
  expect(pvResult.toVerboseString()).toEqual('1N')
})

test('Multiple 1kg 1kg = 1kg^2', () => {
  let pv1 = PhysicsVariable.fromString('1,3,0,0,1,0,0,0,0')
  let pv2 = PhysicsVariable.fromString('1,3,0,0,1,0,0,0,0')
  let pvResult = pv1.Multiply(pv2)
  expect(pvResult.toVerboseString()).toEqual('1kg^(2)')
})

test('Convert 1Mg to zero prefix aka 1000kg', () => {
  let pv1 = PhysicsVariable.fromString('1,6,0,0,1,0,0,0,0')
  expect(pv1.toZeroPrefix().toVerboseString()).toEqual('1000kg')
})

test('Multiple 1s by 100 (no unit) = 100s', () => {
  let pv1 = PhysicsVariable.fromString('1,0,1,0,0,0,0,0,0')
  let pv2 = PhysicsVariable.fromString('100,0,0,0,0,0,0,0,0')
  expect(pv1.Multiply(pv2).toVerboseString()).toEqual('100s')
})

test('Divide 1s by 100 (no unit) = 0.01s', () => {
  let pv1 = PhysicsVariable.fromString('1,0,1,0,0,0,0,0,0')
  let pv2 = PhysicsVariable.fromString('100,0,0,0,0,0,0,0,0')
  expect(pv1.Divide(pv2).toVerboseString()).toEqual('0.01s')
})

test('Divide 1000ms by 1s = 1', () => {
  let pv1 = PhysicsVariable.fromString('1000,-3,1,0,0,0,0,0,0')
  let pv2 = PhysicsVariable.fromString('1,0,1,0,0,0,0,0,0')
  expect(pv1.Divide(pv2).toVerboseString()).toEqual('1')
})

test('Divide 10J by 1s = 10W', () => {
  let pv1 = PhysicsVariable.fromString('10,0,-2,2,1,0,0,0,0')
  let pv2 = PhysicsVariable.fromString('1,0,1,0,0,0,0,0,0')
  expect(pv1.Divide(pv2).toVerboseString()).toEqual('10W')
})

test('Divide 5 by 2 = 2.5', () => {
  let pv1 = PhysicsVariable.fromString('5,0,0,0,0,0,0,0,0')
  let pv2 = PhysicsVariable.fromString('2,0,0,0,0,0,0,0,0')
  expect(pv1.Divide(pv2).toVerboseString()).toEqual('2.5')
})

//Reverse Polish Notation Tests

test('Convert to Polish notation 0+1', () => {
  let str = '0+1'
  let token = tokenize(str)
  let revPolNot = infixToPostfix(token)
  expect(revPolNot).toEqual('0 1 +')
})

test('Convert to Polish notation 0*1*2^3 (1/2mv^2)', () => {
  let str = '0*1*2^3'
  let tokens = tokenize(str)
  let revPolNot = infixToPostfix(tokens)
  //Subject to later coding ideas
  expect(revPolNot).toEqual('0 1 * 2 3 ^ *')
})

test('Making zero+one of adding 1s +5s', () => {
  let str = 'zero+one'
  let tokens = tokenize(str)
  let revPolNot = infixToPostfix(tokens)
  expect(revPolNot).toEqual('zero one +')

  let pv0 = new EquationMember('zero')
  pv0.fromString('1,0,1,0,0,0,0,0,0')

  let pv1 = new EquationMember('one')
  pv1.fromString('5,0,1,0,0,0,0,0,0')

  let variables: Array<EquationMember> = [pv0, pv1]
  let pe = PhysicsEquation.fromString(str, variables)
  let pvResult = pe.calculate()
  expect(pvResult.toVerboseString()).toEqual('6s')
})

test('Kinetic Energy equation with mass = 1kg, v=1m/s', () => {
  let str = 'half*mass*velocity^two'

  let half = new EquationMember('half')
  half.makeConstant(0.5)

  let mass = new EquationMember('mass')
  mass.fromString('1,3,0,0,1,0,0,0,0')

  let velocity = new EquationMember('velocity')
  velocity.fromString('1,0,-1,1,0,0,0,0,0')

  let two = new EquationMember('two')
  two.makeConstant(2)

  let variables = [half, mass, velocity, two]

  let tokens = tokenize(str)

  let pe = PhysicsEquation.fromString(str, variables)
  expect(infixToPostfix(tokens)).toEqual('half mass * velocity two ^ *')
  let pvResult = pe.calculate()
  expect(pvResult.toZeroPrefix().toVerboseString()).toEqual('0.5J')
})

//Depracted tests

// test('Kinetic Energy equation, Igor Polish Notation', () => {
//   let str = '01^2*3*'

//   let half = new EquationMember('half')
//   half.makeConstant(0.5)

//   let mass = new EquationMember('mass')
//   mass.fromString('1,3,0,0,1,0,0,0,0')

//   let velocity = new EquationMember('velocity')
//   velocity.fromString('1,0,-1,1,0,0,0,0,0')

//   let two = new EquationMember('two')
//   two.makeConstant(2)

//   let variables = [velocity, two, mass, half]
//   let pe = PhysicsEquation.fromReversePolish(str, variables)
//   let pvResult = pe.calculate()
//   expect(pvResult.toVerboseString()).toEqual('0.5J')
// })

test('simple tokenization', () => {
  let str = '0+1'
  let tokens = tokenize(str)
  expect(tokens).toEqual(['0', '+', '1'])
})

test('tokenization with subtraction', () => {
  let str = '0-1'
  let tokens = tokenize(str)
  expect(tokens).toEqual(['0', '-', '1'])
})

test('tokenization with multiplication', () => {
  let str = '0*1'
  let tokens = tokenize(str)
  expect(tokens).toEqual(['0', '*', '1'])
})

test('tokenization with division', () => {
  let str = '0/1'
  let tokens = tokenize(str)
  expect(tokens).toEqual(['0', '/', '1'])
})

test('tokenization with exponentiation', () => {
  let str = '0^1'
  let tokens = tokenize(str)
  expect(tokens).toEqual(['0', '^', '1'])
})

test('tokenization with parentheses', () => {
  let str = '(0+1)*2'
  let tokens = tokenize(str)
  expect(tokens).toEqual(['(', '0', '+', '1', ')', '*', '2'])
})

test('tokenization with trigonometric functions', () => {
  let str = 'sin(0)+cos(1)-tan(2)'
  let tokens = tokenize(str)
  expect(tokens).toEqual([
    'sin',
    '(',
    '0',
    ')',
    '+',
    'cos',
    '(',
    '1',
    ')',
    '-',
    'tan',
    '(',
    '2',
    ')',
  ])
})

test('tokenization with logarithmic functions', () => {
  let str = 'log(0)+ln(1)'
  let tokens = tokenize(str)
  expect(tokens).toEqual(['log', '(', '0', ')', '+', 'ln', '(', '1', ')'])
})
test('tokenization with variable identifiers', () => {
  let str = 'x+y'
  let tokens = tokenize(str)
  expect(tokens).toEqual(['x', '+', 'y'])
})

test('tokenization with variable identifiers and numbers', () => {
  let str = 'x_1+2'
  let tokens = tokenize(str)
  expect(tokens).toEqual(['x_1', '+', '2'])
})

test('tokenization with multiple variable identifiers', () => {
  let str = 'x_1+y_1'
  let tokens = tokenize(str)
  expect(tokens).toEqual(['x_1', '+', 'y_1'])
})

test('tokenization with complex expressions', () => {
  let str = 'mass_1*height'
  let tokens = tokenize(str)
  expect(tokens).toEqual(['mass_1', '*', 'height'])
})

test('tokenization with complex expressions and functions', () => {
  let str = 'sin(x)+cos(y_1)-tan(mass_1)'
  let tokens = tokenize(str)
  expect(tokens).toEqual([
    'sin',
    '(',
    'x',
    ')',
    '+',
    'cos',
    '(',
    'y_1',
    ')',
    '-',
    'tan',
    '(',
    'mass_1',
    ')',
  ])
})

test('tokenization with spaces wikipedia shuting yard example one', () => {
  let str = '3+4*2/(1-5)^2^3'
  let tokens = tokenize(str)
  expect(tokens).toEqual([
    '3',
    '+',
    '4',
    '*',
    '2',
    '/',
    '(',
    '1',
    '-',
    '5',
    ')',
    '^',
    '2',
    '^',
    '3',
  ])
})

test('tokenization with spaces wikipedia shuting yard example two', () => {
  let str = 'sin(max(2,3)/3*pi)'
  let tokens = tokenize(str)
  expect(tokens).toEqual([
    'sin',
    '(',
    'max',
    '(',
    '2',
    ',',
    '3',
    ')',
    '/',
    '3',
    '*',
    'pi',
    ')',
  ])
})

//TODO check if there are test for tokenize for spaces in input
test('Convert wikipedia example one', () => {
  let str = '3+4*2/(1-5)^2^3'
  let tokens = tokenize(str)
  let revPolNot = infixToPostfix(tokens)
  //Subject to later coding ideas
  expect(revPolNot).toEqual('3 4 2 * 1 5 - 2 3 ^ ^ / +')

  // old check for nospaces deprecated solution
  // expect(revPolNot).toEqual('342*15-23^^/+')
})

test('Convert wikipedia example two', () => {
  let str = 'sin(max(2,3)/3*pi)'
  let tokens = tokenize(str)
  let revPolNot = infixToPostfix(tokens)
  //Subject to later coding ideas
  expect(revPolNot).toEqual('2 3 max 3 / pi * sin')
})

//write 10 tests in style of the two above
test('Complex to RPN test 1', () => {
  let str = 'sin(x)+cos(y)-tan(z)'
  let tokens = tokenize(str)
  let revPolNot = infixToPostfix(tokens)
  //Subject to later coding ideas
  expect(revPolNot).toEqual('x sin y cos + z tan -')
})

test('Complex to RPN test 2', () => {
  let str = 'sin(x)+cos(y)-tan(z)+cot(w)'
  let tokens = tokenize(str)
  let revPolNot = infixToPostfix(tokens)
  //Subject to later coding ideas
  expect(revPolNot).toEqual('x sin y cos + z tan - w cot +')
})

test('Complex to RPN test 3', () => {
  let str = 'sin(x)+cos(y)-tan(z)+cot(w)+sec(v)'
  let tokens = tokenize(str)
  let revPolNot = infixToPostfix(tokens)
  //Subject to later coding ideas
  expect(revPolNot).toEqual('x sin y cos + z tan - w cot + v sec +')
})

test('Sin over cosine', () => {
  let str = 'sin(x)/cos(y)'
  let tokens = tokenize(str)
  let revPolNot = infixToPostfix(tokens)
  //Subject to later coding ideas
  expect(revPolNot).toEqual('x sin y cos /')
})

test('Sin over cosine over tangent', () => {
  let str = 'sin(x)/cos(y)/tan(z)'
  let tokens = tokenize(str)
  let revPolNot = infixToPostfix(tokens)
  //Subject to later coding ideas
  expect(revPolNot).toEqual('x sin y cos / z tan /')
})

test('Sin over cosine over tangent over cotangent', () => {
  let str = 'sin(x)/cos(y)/tan(z)/cot(w)'
  let tokens = tokenize(str)
  let revPolNot = infixToPostfix(tokens)
  //Subject to later coding ideas
  expect(revPolNot).toEqual('x sin y cos / z tan / w cot /')
})

test('Sin over cosine over tangent over cotangent over secant', () => {
  let str = 'sin(x)/cos(y)/tan(z)/cot(w)/sec(v)'
  let tokens = tokenize(str)
  let revPolNot = infixToPostfix(tokens)
  //Subject to later coding ideas
  expect(revPolNot).toEqual('x sin y cos / z tan / w cot / v sec /')
})

test('Sin over cosine over tangent over cotangent over secant over cosecant', () => {
  let str = 'sin(x)/cos(y)/tan(z)/cot(w)/sec(v)/csc(u)'
  let tokens = tokenize(str)
  let revPolNot = infixToPostfix(tokens)
  //Subject to later coding ideas
  expect(revPolNot).toEqual('x sin y cos / z tan / w cot / v sec / u csc /')
})

test('infix to postfix sin a / cos b', () => {
  let str = 'sin(a)/cos(b)'
  let tokens = tokenize(str)
  let revPolNot = infixToPostfix(tokens)
  //Subject to later coding ideas
  expect(revPolNot).toEqual('a sin b cos /')

  //no spaces depreacted check
  // expect(revPolNot).toEqual('23max3/pi*sin')
})

test('sin(3.14/6) / cos(3.14/3)', () => {
  let str = 'sin(a)/cos(b)'

  let a = new EquationMember('a')
  a.makeConstant(Math.PI / 6)

  let b = new EquationMember('b')
  b.makeConstant(Math.PI / 3)

  let variables = [a, b]

  let tokens = tokenize(str)

  let pe = PhysicsEquation.fromString(str, variables)
  //expect(infixToPostfix(tokens)).toEqual('half mass * velocity two ^ *')
  let pvResult = pe.calculate()
  expect(pvResult.toZeroPrefix().getValue()).toBeCloseTo(1, 2)
})

test('tan(PI/2)', () => {
  let str = 'tan(a)'

  let a = new EquationMember('a')
  a.makeConstant(Math.PI / 2)

  //let b = new EquationMember('b')
  //b.makeConstant(Math.PI / 3)

  let variables = [a]

  let tokens = tokenize(str)

  let pe = PhysicsEquation.fromString(str, variables)
  //expect(infixToPostfix(tokens)).toEqual('half mass * velocity two ^ *')
  let pvResult = pe.calculate()
  expect(pvResult.toZeroPrefix().getValue()).toBeCloseTo(Infinity, 2)
})

test('cot(0)', () => {
  let str = 'cot(a)'

  let a = new EquationMember('a')
  a.makeConstant(0)

  //let b = new EquationMember('b')
  //b.makeConstant(Math.PI / 3)

  let variables = [a]

  let tokens = tokenize(str)

  let pe = PhysicsEquation.fromString(str, variables)
  //expect(infixToPostfix(tokens)).toEqual('half mass * velocity two ^ *')
  let pvResult = pe.calculate()
  expect(pvResult.toZeroPrefix().getValue()).toBeCloseTo(Infinity, 2)
})
test('cot(0) * Log(0)', () => {
  let str = 'cot(a)*log(b)'

  let a = new EquationMember('a')
  a.makeConstant(0)

  let b = new EquationMember('b')
  b.makeConstant(0)

  let variables = [a, b]

  let tokens = tokenize(str)

  let pe = PhysicsEquation.fromString(str, variables)

  //fix this with error handling for infinity
  expect(pe.calculate()).toThrowError('Infinity in operation')
})

//wrongly written tests

// test('a^2', () => {
//   let str = 'a^2'

//   let a = new EquationMember('a')
//   a.makeConstant(6)

//   //let b = new EquationMember('b')
//   //b.makeConstant(Math.PI / 3)

//   let variables = [a]

//   let tokens = tokenize(str)

//   let pe = PhysicsEquation.fromString(str, variables)
//   //expect(infixToPostfix(tokens)).toEqual('half mass * velocity two ^ *')
//   let pvResult = pe.calculate()
//   expect(pvResult.toZeroPrefix().getValue()).toBeCloseTo(36, 2)
// })

// test('sin(a)^2', () => {
//   let str = '(sin(a))^2'

//   let a = new EquationMember('a')
//   a.makeConstant(Math.PI / 6)

//   //let b = new EquationMember('b')
//   //b.makeConstant(Math.PI / 3)

//   let variables = [a]

//   let tokens = tokenize(str)

//   let pe = PhysicsEquation.fromString(str, variables)
//   //expect(infixToPostfix(tokens)).toEqual('half mass * velocity two ^ *')
//   let pvResult = pe.calculate()
//   expect(pvResult.toZeroPrefix().getValue()).toBeCloseTo(0.25, 2)
// })
// test('sin(a)^2+cos(a)^2 trigonometric unit ', () => {
//   let str = '(sin(a))^2+(cos(a))^2'

//   let a = new EquationMember('a')
//   a.makeConstant(Math.PI / 6)

//   //let b = new EquationMember('b')
//   //b.makeConstant(Math.PI / 3)

//   let variables = [a]

//   let tokens = tokenize(str)

//   let pe = PhysicsEquation.fromString(str, variables)
//   //expect(infixToPostfix(tokens)).toEqual('half mass * velocity two ^ *')
//   let pvResult = pe.calculate()
//   expect(pvResult.toZeroPrefix().getValue()).toBeCloseTo(1, 2)
// })

test('sin(a)^2+cos(a)^2 trigonometric unit ', () => {
  let str = '(sin(a))*(sin(a))+(cos(a))*(cos(a))'

  let a = new EquationMember('a')
  a.makeConstant(Math.PI / 6)

  //let b = new EquationMember('b')
  //b.makeConstant(Math.PI / 3)

  let variables = [a]

  let tokens = tokenize(str)

  let pe = PhysicsEquation.fromString(str, variables)
  //expect(infixToPostfix(tokens)).toEqual('half mass * velocity two ^ *')
  let pvResult = pe.calculate()
  expect(pvResult.toZeroPrefix().getValue()).toBeCloseTo(1, 2)
})
test('tan(a)-(sin(a))/(cos(a))', () => {
  let str = 'tan(a)-(sin(a))/(cos(a))'

  let a = new EquationMember('a')
  a.makeConstant(Math.PI / 6)

  //let b = new EquationMember('b')
  //b.makeConstant(Math.PI / 3)

  let variables = [a]

  let tokens = tokenize(str)

  let pe = PhysicsEquation.fromString(str, variables)
  //expect(infixToPostfix(tokens)).toEqual('half mass * velocity two ^ *')
  let pvResult = pe.calculate()
  expect(pvResult.toZeroPrefix().getValue()).toBeCloseTo(0, 2)
})
test('a/b', () => {
  let str = 'a/b'

  let a = new EquationMember('a')
  a.makeConstant(6)

  let b = new EquationMember('b')
  b.makeConstant(3)

  let variables = [a, b]

  let tokens = tokenize(str)

  let pe = PhysicsEquation.fromString(str, variables)
  //expect(infixToPostfix(tokens)).toEqual('half mass * velocity two ^ *')
  let pvResult = pe.calculate()
  expect(pvResult.toZeroPrefix().getValue()).toBeCloseTo(2, 2)
})

//wrongly written test
// test('(a)^2', () => {
//   let str = '(a)^2'

//   let a = new EquationMember('a')
//   a.makeConstant(5)

//   //let b = new EquationMember('b')
//   //b.makeConstant(Math.PI / 3)

//   let variables = [a]

//   let tokens = tokenize(str)

//   let pe = PhysicsEquation.fromString(str, variables)
//   //expect(infixToPostfix(tokens)).toEqual('half mass * velocity two ^ *')
//   let pvResult = pe.calculate()
//   expect(pvResult.toZeroPrefix().getValue()).toBeCloseTo(25, 2)
// })

test('a^two+b^two', () => {
  let str = 'a^two+b^two'

  let a = new EquationMember('a')
  a.makeConstant(3)

  let b = new EquationMember('b')
  b.makeConstant(4)

  let two = new EquationMember('two')
  two.makeConstant(2)

  let variables = [a, b, two]

  let tokens = tokenize(str)

  let pe = PhysicsEquation.fromString(str, variables)
  //expect(infixToPostfix(tokens)).toEqual('half mass * velocity two ^ *')
  let pvResult = pe.calculate()
  expect(pvResult.toZeroPrefix().getValue()).toBeCloseTo(25, 2)
})

//wronly written test

// test('3^two', () => {
//   let str = '3^two'

//   let two = new EquationMember('two')
//   two.makeConstant(2)

//   let variables = [two]

//   let tokens = tokenize(str)

//   let pe = PhysicsEquation.fromString(str, variables)
//   //expect(infixToPostfix(tokens)).toEqual('half mass * velocity two ^ *')
//   let pvResult = pe.calculate()
//   expect(pvResult.toZeroPrefix().getValue()).toBeCloseTo(9, 2)
// })

//wrongly written test

// test('3*x', () => {
//   let str = '3*x'

//   let x = new EquationMember('x')
//   x.makeConstant(2)

//   let variables = [x]

//   let tokens = tokenize(str)

//   let pe = PhysicsEquation.fromString(str, variables)
//   //expect(infixToPostfix(tokens)).toEqual('half mass * velocity two ^ *')
//   let pvResult = pe.calculate()
//   expect(pvResult.toZeroPrefix().getValue()).toBeCloseTo(6, 2)
// })

//wrongly written test

// test('x/4', () => {
//   let str = 'x/4'

//   let x = new EquationMember('x')
//   x.makeConstant(2)

//   let variables = [x]

//   let tokens = tokenize(str)

//   let pe = PhysicsEquation.fromString(str, variables)
//   //expect(infixToPostfix(tokens)).toEqual('half mass * velocity two ^ *')
//   let pvResult = pe.calculate()
//   expect(pvResult.toZeroPrefix().getValue()).toBeCloseTo(0.5, 2)
// })

test('a^two+b^two', () => {
  let str = 'a^two+b^two'

  let a = new EquationMember('a')
  a.makeConstant(-3)

  let b = new EquationMember('b')
  b.makeConstant(-4)

  let two = new EquationMember('two')
  two.makeConstant(2)

  let variables = [a, b, two]

  let tokens = tokenize(str)

  let pe = PhysicsEquation.fromString(str, variables)
  //expect(infixToPostfix(tokens)).toEqual('half mass * velocity two ^ *')
  let pvResult = pe.calculate()
  expect(pvResult.toZeroPrefix().getValue()).toBeCloseTo(25, 2)
})
test('a^two+b^two', () => {
  let str = 'a^two+b^two'

  let a = new EquationMember('a')
  a.makeConstant(-1)

  let b = new EquationMember('b')
  b.makeConstant(-2)

  let two = new EquationMember('two')
  two.makeConstant(3)

  let variables = [a, b, two]

  let tokens = tokenize(str)

  let pe = PhysicsEquation.fromString(str, variables)
  //expect(infixToPostfix(tokens)).toEqual('half mass * velocity two ^ *')
  let pvResult = pe.calculate()
  expect(pvResult.toZeroPrefix().getValue()).toBeCloseTo(-9, 2)
})
test('a*b*c', () => {
  let str = 'a*b*c'

  let a = new EquationMember('a')
  a.makeConstant(2)

  let b = new EquationMember('b')
  b.makeConstant(3)

  let c = new EquationMember('c')
  c.makeConstant(4)

  let variables = [a, b, c]

  let tokens = tokenize(str)

  let pe = PhysicsEquation.fromString(str, variables)
  //expect(infixToPostfix(tokens)).toEqual('half mass * velocity two ^ *')
  let pvResult = pe.calculate()
  expect(pvResult.toZeroPrefix().getValue()).toBeCloseTo(24, 2)
})
test('a*b+c^d', () => {
  let str = 'a*b+c^d'

  let a = new EquationMember('a')
  a.makeConstant(2)

  let b = new EquationMember('b')
  b.makeConstant(3)

  let c = new EquationMember('c')
  c.makeConstant(4)

  let d = new EquationMember('d')
  d.makeConstant(2)

  let variables = [a, b, c, d]

  let tokens = tokenize(str)

  let pe = PhysicsEquation.fromString(str, variables)
  //expect(infixToPostfix(tokens)).toEqual('half mass * velocity two ^ *')
  let pvResult = pe.calculate()
  expect(pvResult.toZeroPrefix().getValue()).toBeCloseTo(22, 2)
})

test('bok_a*bok_b*bok_c', () => {
  let str = 'bok_a*bok_b*bok_c'

  let bok_a = new EquationMember('bok_a')
  bok_a.fromString('2,0,0,1,0,0,0,0,0')

  let bok_b = new EquationMember('bok_b')
  bok_b.fromString('4,0,0,1,0,0,0,0,0')

  let bok_c = new EquationMember('bok_c')
  bok_c.fromString('6,0,0,1,0,0,0,0,0')

  let variables = [bok_a, bok_b, bok_c]

  let tokens = tokenize(str)
  let pe = PhysicsEquation.fromString(str, variables)
  //expect(infixToPostfix(tokens)).toEqual('half mass * velocity two ^ *')
  let pvResult = pe.calculate()
  expect(pvResult.toString()).toEqual('48,0,0,3,0,0,0,0,0')
  expect(pvResult.getValue()).toEqual(48)
  expect(pvResult.getPrefix()).toEqual(0)
  expect(pvResult.getUnit()).toMatchObject([0, 3, 0, 0, 0, 0, 0])

  expect(pvResult.toVerboseString()).toEqual('48m^(3)')
  //expect(pvResult.toZeroPrefix().getValue()).toMatchObject([48, 0, 0, 3, 0, 0, 0])
  //expect(pvResult.toZeroPrefix().getValue()).toBeCloseTo(48m^3, 2)
})

test('velocity_1/velocity_2', () => {
  let str = 'velocity_1/velocity_2'

  let velocity_1 = new EquationMember('velocity_1')
  velocity_1.fromString('0.5,3,-1,1,0,0,0,0,0')

  let velocity_2 = new EquationMember('velocity_2')
  velocity_2.fromString('5,0,-1,1,0,0,0,0,0')

  let variables = [velocity_1, velocity_2]

  let tokens = tokenize(str)
  let pe = PhysicsEquation.fromString(str, variables)
  //expect(infixToPostfix(tokens)).toEqual('half mass * velocity two ^ *')
  let pvResult = pe.calculate()
  expect(pvResult.toString()).toEqual('48,0,0,3,0,0,0,0,0')
  expect(pvResult.getValue()).toEqual(48)
  expect(pvResult.getPrefix()).toEqual(0)
  expect(pvResult.getUnit()).toMatchObject([0, 3, 0, 0, 0, 0, 0])

  expect(pvResult.toVerboseString()).toEqual('100')
  //expect(pvResult.toZeroPrefix().getValue()).toMatchObject([48, 0, 0, 3, 0, 0, 0])
  //expect(pvResult.toZeroPrefix().getValue()).toBeCloseTo(48m^3, 2)
})

test('kg+g', () => {
  let str = 'mass_1+mass_2'

  let mass_1 = new EquationMember('mass_1')
  mass_1.fromString('5.0,3,0,0,1,0,0,0,0')

  let mass_2 = new EquationMember('mass_2')
  mass_2.fromString('5,0,0,0,1,0,0,0,0')

  let variables = [mass_1, mass_2]

  let tokens = tokenize(str)
  let pe = PhysicsEquation.fromString(str, variables)
  //expect(infixToPostfix(tokens)).toEqual('half mass * velocity two ^ *')

  let mass_simpleAdd: PhysicsVariable = mass_1.Add(mass_2)
  expect(mass_simpleAdd.getValue()).toEqual(5.005)

  let pvResult = pe.calculate()
  expect(pvResult.toString()).toEqual('5.005,3,0,0,1,0,0,0,0')
  expect(pvResult.getValue()).toEqual(5.005)
  expect(pvResult.getPrefix()).toEqual(3)
  expect(pvResult.getUnit()).toMatchObject([0, 0, 1, 0, 0, 0, 0])

  //expect(pvResult.toVerboseString()).toEqual('5.005 kg')
  //expect(pvResult.toZeroPrefix().getValue()).toMatchObject([48, 0, 0, 3, 0, 0, 0])
  //expect(pvResult.toZeroPrefix().getValue()).toBeCloseTo(48m^3, 2)
})

test('kg/g', () => {
  let str = 'mass_1/mass_2'

  let mass_1 = new EquationMember('mass_1')
  mass_1.fromString('5,3,0,0,1,0,0,0,0')

  let mass_2 = new EquationMember('mass_2')
  mass_2.fromString('5,0,0,0,1,0,0,0,0')

  let variables = [mass_1, mass_2]

  let tokens = tokenize(str)
  let pe = PhysicsEquation.fromString(str, variables)
  //expect(infixToPostfix(tokens)).toEqual('half mass * velocity two ^ *')
  let pvResult = pe.calculate()
  expect(pvResult.toString()).toEqual('1000,0,0,0,0,0,0,0,0')
  expect(pvResult.getValue()).toEqual(1000)
  expect(pvResult.getPrefix()).toEqual(0)
  expect(pvResult.getUnit()).toMatchObject([0, 0, 0, 0, 0, 0, 0])

  expect(pvResult.toVerboseString()).toEqual('1000')
  //expect(pvResult.toZeroPrefix().getValue()).toMatchObject([48, 0, 0, 3, 0, 0, 0])
  //expect(pvResult.toZeroPrefix().getValue()).toBeCloseTo(48m^3, 2)
})

test('kg*g', () => {
  let str = 'mass_1*mass_2'

  let mass_1 = new EquationMember('mass_1')
  mass_1.fromString('2.0,3,0,0,1,0,0,0,0')

  let mass_2 = new EquationMember('mass_2')
  mass_2.fromString('2,0,0,0,1,0,0,0,0')

  let variables = [mass_1, mass_2]

  let tokens = tokenize(str)
  let pe = PhysicsEquation.fromString(str, variables)
  //expect(infixToPostfix(tokens)).toEqual('half mass * velocity two ^ *')
  let pvResult = pe.calculate()
  expect(pvResult.toString()).toEqual('0.004,3,0,0,2,0,0,0')
  expect(pvResult.getValue()).toEqual(48)
  expect(pvResult.getPrefix()).toEqual(0)
  expect(pvResult.getUnit()).toMatchObject([0, 0, 1, 0, 0, 0, 0])

  expect(pvResult.toVerboseString()).toEqual('4')
  //expect(pvResult.toZeroPrefix().getValue()).toMatchObject([48, 0, 0, 3, 0, 0, 0])
  //expect(pvResult.toZeroPrefix().getValue()).toBeCloseTo(48m^3, 2)
})

test('g*kg', () => {
  let str = 'mass_1*mass_2'

  let mass_1 = new EquationMember('mass_1')
  mass_1.fromString('2.0,0,0,0,1,0,0,0,0')

  let mass_2 = new EquationMember('mass_2')
  mass_2.fromString('2.0,3,0,0,1,0,0,0,0')

  let variables = [mass_1, mass_2]

  let tokens = tokenize(str)
  let pe = PhysicsEquation.fromString(str, variables)
  //expect(infixToPostfix(tokens)).toEqual('half mass * velocity two ^ *')
  let pvResult = pe.calculate()
  expect(pvResult.toString()).toEqual('0.004,3,0,0,2,0,0,0')
  expect(pvResult.getValue()).toEqual(0.004)
  expect(pvResult.getPrefix()).toEqual(0)
  expect(pvResult.getUnit()).toMatchObject([0, 0, 1, 0, 0, 0, 0])

  expect(pvResult.toVerboseString()).toEqual('4')
  //expect(pvResult.toZeroPrefix().getValue()).toMatchObject([48, 0, 0, 3, 0, 0, 0])
  //expect(pvResult.toZeroPrefix().getValue()).toBeCloseTo(48m^3, 2)
})

test('velocity_1*velocity_2', () => {
  let str = 'velocity_1*velocity_2'

  let velocity_1 = new EquationMember('velocity_1')
  velocity_1.fromString('2,3,-1,1,0,0,0,0,0')

  let velocity_2 = new EquationMember('velocity_2')
  velocity_2.fromString('5,0,-1,1,0,0,0,0,0')

  let variables = [velocity_1, velocity_2]

  let tokens = tokenize(str)
  let pe = PhysicsEquation.fromString(str, variables)
  //expect(infixToPostfix(tokens)).toEqual('half mass * velocity two ^ *')
  let pvResult = pe.calculate()
  expect(pvResult.toString()).toEqual('10,0,0,3,0,0,0,0,0')
  expect(pvResult.getValue()).toEqual(10)
  expect(pvResult.getPrefix()).toEqual(0)
  expect(pvResult.getUnit()).toMatchObject([0, 3, 0, 0, 0, 0, 0])

  expect(pvResult.toVerboseString()).toEqual('100')
  //expect(pvResult.toZeroPrefix().getValue()).toMatchObject([48, 0, 0, 3, 0, 0, 0])
  //expect(pvResult.toZeroPrefix().getValue()).toBeCloseTo(48m^3, 2)
})

test('3*20kg', () => {
  let str = '3*a'
  let a = new EquationMember('a')
  a.fromString('20,0,0,1,0,0,0,0,0')
  let three = new EquationMember('3')
  three.makeConstant(3)
  let variables = [three, a]

  let pe = PhysicsEquation.fromString(str, variables)
  let pvResult = pe.calculate()
  expect(pvResult.toString()).toEqual('60,0,0,1,0,0,0,0,0')
})
