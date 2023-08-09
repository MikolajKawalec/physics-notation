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
});

test('Create 21.37 km (from values)', () => {
	let pv = PhysicsVariable.fromValues(21.37, 3, [0, 1, 0, 0, 0, 0, 0]);
	expect(pv.toString()).toEqual('21.37,3,0,1,0,0,0,0,0');
	expect(pv.getValue()).toEqual(21.37);
	expect(pv.getPrefix()).toEqual(3);
	expect(pv.getUnit()).toMatchObject([0, 1, 0, 0, 0, 0, 0]);
});
