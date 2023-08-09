import { PhysicsVariable, getEmptyUnit, Unit } from './physics_notation';

test('creates 0 tuple (array in JS) of size 7', () => {
	expect(getEmptyUnit()).toMatchObject([0, 0, 0, 0, 0, 0, 0]);
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
