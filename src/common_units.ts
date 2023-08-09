import { Unit } from './physics_notation';

export const commonUnits = new Map<Unit<number>, string>([
	[[-2, 2, 1, 0, 0, 0, 0], 'J'],
	[[-3, 2, 1, 0, 0, 0, 0], 'W'],
	[[1, 0, 0, 1, 0, 0, 0], 'C'],
	[[-3, 2, 1, -1, 0, 0, 0], 'V'],
]);
