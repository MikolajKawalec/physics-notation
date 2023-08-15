import {
	PhysicsVariable,
	getEmptyUnit,
	Unit,
	UnitsMismatchError,
	IsKilogram,
} from './physics_notation';

test('creates 0 tuple (array in JS) of size 7', () => {
	expect(getEmptyUnit()).toMatchObject([0, 0, 0, 0, 0, 0, 0]);
});

test('Is Kilogram function', () => {
	//1s
	let second: Unit<number> = [1, 0, 0, 0, 0, 0, 0];
	expect(IsKilogram(second)).toBeFalsy();
	//1
	let one: Unit<number> = [0, 0, 0, 0, 0, 0, 0];
	expect(IsKilogram(one)).toBeFalsy();
	//1kg
	let kilogram: Unit<number> = [0, 0, 1, 0, 0, 0, 0];
	expect(IsKilogram(kilogram)).toBeTruthy();
	//1N
	let newton: Unit<number> = [1, -2, 1, 0, 0, 0, 0];
	expect(IsKilogram(newton)).toBeFalsy();
});

test('Default constructor creates 0ed Physics Variables', () => {
	expect(new PhysicsVariable().toString()).toEqual('0,0,0,0,0,0,0,0,0');
});

test('Create 21.37 km (from string)', () => {
	let pv = PhysicsVariable.fromString('21.37,3,0,1,0,0,0,0,0');
	expect(pv.toString()).toEqual('21.37,3,0,1,0,0,0,0,0');
	expect(pv.getValue()).toEqual(21.37);
	expect(pv.getPrefix()).toEqual(3);
	expect(pv.getUnit()).toMatchObject([0, 1, 0, 0, 0, 0, 0]);
	expect(pv.toVerboseString()).toEqual('21.37km');
	expect(pv.getUnitString()).toEqual('0,1,0,0,0,0,0');
});

test('Create 21.37 km (from values)', () => {
	let pv = PhysicsVariable.fromValues(21.37, 3, [0, 1, 0, 0, 0, 0, 0]);
	expect(pv.toString()).toEqual('21.37,3,0,1,0,0,0,0,0');
	expect(pv.getValue()).toEqual(21.37);
	expect(pv.getPrefix()).toEqual(3);
	expect(pv.getUnit()).toMatchObject([0, 1, 0, 0, 0, 0, 0]);
	expect(pv.toVerboseString()).toEqual('21.37km');
	expect(pv.getUnitString()).toEqual('0,1,0,0,0,0,0');
});

test('Create 10 MJ', () => {
	let pv = PhysicsVariable.fromString('10,6,-2,2,1,0,0,0,0');
	expect(pv.toString()).toEqual('10,6,-2,2,1,0,0,0,0');
	expect(pv.getValue()).toEqual(10);
	expect(pv.getPrefix()).toEqual(6);
	expect(pv.getUnit()).toMatchObject([-2, 2, 1, 0, 0, 0, 0]);
	expect(pv.toVerboseString()).toEqual('10MJ');
	expect(pv.getUnitString()).toEqual('-2,2,1,0,0,0,0');
});

test('Converts 10 kJ to J', () => {
	let pv = PhysicsVariable.fromString('10,3,-2,2,1,0,0,0,0');
	expect(pv.convertValueToBase(0)).toEqual(10000);
});

test('Converts 10,000 J to kJ', () => {
	let pv = PhysicsVariable.fromString('10000,0,-2,2,1,0,0,0,0');
	expect(pv.convertValueToBase(3)).toEqual(10);
});

test('Add one 1J to 1J', () => {
	let pv1 = PhysicsVariable.fromString('1,0,-2,2,1,0,0,0,0');
	let pv2 = PhysicsVariable.fromString('1,0,-2,2,1,0,0,0,0');
	expect(pv1.Add(pv2).toVerboseString()).toEqual('2J');
});

test('Add 1kJ to 1J', () => {
	let pv1 = PhysicsVariable.fromString('1,3,-2,2,1,0,0,0,0');
	let pv2 = PhysicsVariable.fromString('1,0,-2,2,1,0,0,0,0');
	expect(pv1.Add(pv2).toVerboseString()).toEqual('1.001kJ');
});

test('Add 1J to 1kJ', () => {
	let pv1 = PhysicsVariable.fromString('1,0,-2,2,1,0,0,0,0');
	let pv2 = PhysicsVariable.fromString('1,3,-2,2,1,0,0,0,0');
	expect(pv1.Add(pv2).toVerboseString()).toEqual('1001J');
});

// I dont know how to test errors
// test('Add 1J to 1(no unit) (anticipate error)', () => {
// 	let pv1 = PhysicsVariable.fromString('1,0,-2,2,1,0,0,0,0');
// 	let pv2 = PhysicsVariable.fromString('1,0,0,0,0,0,0,0,0');
// 	expect(pv1.Add(pv2)).toThrow(UnitsMismatchError);
// });

test('Subtract one 1J from 1J', () => {
	let pv1 = PhysicsVariable.fromString('1,0,-2,2,1,0,0,0,0');
	let pv2 = PhysicsVariable.fromString('1,0,-2,2,1,0,0,0,0');
	expect(pv1.Substract(pv2).toVerboseString()).toEqual('0J');
});

test('Substract 1J from 1kJ', () => {
	let pv1 = PhysicsVariable.fromString('1,3,-2,2,1,0,0,0,0');
	let pv2 = PhysicsVariable.fromString('1,0,-2,2,1,0,0,0,0');
	expect(pv1.Substract(pv2).toVerboseString()).toEqual('0.999kJ');
});

test('Substract 1kJ from 1J', () => {
	//1J
	let pv1 = PhysicsVariable.fromString('1,0,-2,2,1,0,0,0,0');
	//1kJ
	let pv2 = PhysicsVariable.fromString('1,3,-2,2,1,0,0,0,0');
	//1J-1kJ=-999J
	expect(pv1.Substract(pv2).toVerboseString()).toEqual('-999J');
});

test('Multiple 1A 1s = 1C', () => {
	let pv1 = PhysicsVariable.fromString('1,0,1,0,0,0,0,0,0');
	let pv2 = PhysicsVariable.fromString('1,0,0,0,0,1,0,0,0');
	expect(pv1.Multiply(pv2).toVerboseString()).toEqual('1C');
});

test('Multiple 1m/s^2 1kg = 1N', () => {
	let pv1 = PhysicsVariable.fromString('1,0,1,-2,0,0,0,0,0');
	let pv2 = PhysicsVariable.fromString('1,3,0,0,1,0,0,0,0');
	let pvResult = pv1.Multiply(pv2);
	expect(pvResult.getUnitString()).toEqual('1,-2,1,0,0,0,0');
	expect(pvResult.toVerboseString()).toEqual('1N');
});

test('Multiple 1kg 1kg = 1kg^2', () => {
	let pv1 = PhysicsVariable.fromString('1,3,0,0,1,0,0,0,0');
	let pv2 = PhysicsVariable.fromString('1,3,0,0,1,0,0,0,0');
	let pvResult = pv1.Multiply(pv2);
	expect(pvResult.toVerboseString()).toEqual('1kg^(2)');
});

test('Multiple 1s by 100 (no unit) = 100s', () => {
	let pv1 = PhysicsVariable.fromString('1,0,1,0,0,0,0,0,0');
	let pv2 = PhysicsVariable.fromString('100,0,0,0,0,0,0,0,0');
	expect(pv1.Multiply(pv2).toVerboseString()).toEqual('100s');
});

test('Divide 1s by 100 (no unit) = 0.01s', () => {
	let pv1 = PhysicsVariable.fromString('1,0,1,0,0,0,0,0,0');
	let pv2 = PhysicsVariable.fromString('100,0,0,0,0,0,0,0,0');
	expect(pv1.Divide(pv2).toVerboseString()).toEqual('0.01s');
});

test('Divide 1000ms by 1s = 1', () => {
	let pv1 = PhysicsVariable.fromString('1000,-3,1,0,0,0,0,0,0');
	let pv2 = PhysicsVariable.fromString('1,0,1,0,0,0,0,0,0');
	expect(pv1.Divide(pv2).toVerboseString()).toEqual('1');
});

test('Divide 10J by 1s = 10W', () => {
	let pv1 = PhysicsVariable.fromString('10,0,-2,2,1,0,0,0,0');
	let pv2 = PhysicsVariable.fromString('1,0,1,0,0,0,0,0,0');
	expect(pv1.Divide(pv2).toVerboseString()).toEqual('10W');
});

test('Divide 5 by 2 = 2.5', () => {
	let pv1 = PhysicsVariable.fromString('5,0,0,0,0,0,0,0,0');
	let pv2 = PhysicsVariable.fromString('2,0,0,0,0,0,0,0,0');
	expect(pv1.Divide(pv2).toVerboseString()).toEqual('2.5');
});

//Write tests for exponent
