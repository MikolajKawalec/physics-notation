import { commonUnits } from './common_units';
import { siPrefixes } from './si_prefixes';

export type Unit<T> = [T, T, T, T, T, T, T];

export function getEmptyUnit(): Unit<number> {
	return [0, 0, 0, 0, 0, 0, 0];
}

export const Base_Units: Unit<string> = [
	'time(s)',
	'length(m)',
	'mass(kg)',
	'electric current(A)',
	'thermodynamic temparature(K)',
	'amount of substance(mol)',
	'luminous intensity(cd)',
];

export const Base_SI_Prefixes: Array<string> = [
	's',
	'm',
	'g',
	'A',
	'K',
	'mol',
	'cd',
];

export class UnitsMismatchError extends Error {
	constructor() {
		super();
		Object.setPrototypeOf(this, UnitsMismatchError.prototype);
	}

	getErrorMessage() {
		return 'Something went wrong Cannot perform operation with mismatching units';
	}
}

export class PhysicsVariable {
	protected value: number;
	protected prefix: number;
	protected unit: Unit<number>;

	constructor() {
		this.value = 0;
		this.prefix = 0;
		this.unit = getEmptyUnit();
	}

	public static fromString(inStr: string) {
		const pv = new PhysicsVariable();
		try {
			const strArr = inStr.split(',');
			pv.setValue(parseFloat(strArr[0]));
			pv.setPrefix(parseFloat(strArr[1]));
			let floatArr: Unit<number> = getEmptyUnit();
			for (let i = 2; i < 9; i++) {
				floatArr[i - 2] = parseFloat(strArr[i]);
			}
			pv.setUnit(floatArr);
		} catch (error) {
			throw error;
		}
		return pv;
	}

	public static fromValues(value: number, prefix: number, unit: Unit<number>) {
		const pv = new PhysicsVariable();
		pv.setValue(value);
		pv.setPrefix(prefix);
		pv.setUnit(unit);
		return pv;
	}

	public setValue(value: number): void {
		this.value = value;
	}

	public setPrefix(prefix: number): void {
		this.prefix = prefix;
	}

	public setUnit(unit: Unit<number>): void {
		this.unit = unit;
	}

	public setUnitByValues(
		time: number,
		length: number,
		mass: number,
		electric_current: number,
		thermodynamic_temperature: number,
		amount_of_substance: number,
		luminous_intensity: number
	): void {
		this.unit[0] = time;
		this.unit[1] = length;
		this.unit[2] = mass;
		this.unit[3] = electric_current;
		this.unit[4] = thermodynamic_temperature;
		this.unit[5] = amount_of_substance;
		this.unit[6] = luminous_intensity;
	}

	public getValue(): number {
		return this.value;
	}

	public getPrefix(): number {
		return this.prefix;
	}

	public getUnit(): Unit<number> {
		return this.unit;
	}

	public toString(): string {
		let retStr = this.value.toString() + ',';
		retStr += this.prefix.toString() + ',';
		retStr += this.unit.toString();
		return retStr;
	}

	public getUnitString(): string {
		let retStr: string = '';
		for (let i = 0; i < this.unit.length; i++) {
			if (i === this.unit.length - 1) {
				retStr += this.unit[i].toString();
			} else {
				retStr += this.unit[i].toString() + ',';
			}
		}
		return retStr;
	}

	public toVerboseString(bForceSI?: boolean): string {
		let retStr = this.value.toString();
		let siPrefix = siPrefixes.get(this.prefix);
		if (this.prefix !== 0) {
			if (siPrefix) {
				retStr += siPrefix;
			} else {
				retStr += '*10^' + this.prefix.toString();
			}
		}
		let commonUnit = commonUnits.get(this.getUnitString());
		if (bForceSI || !commonUnit) {
			for (let i = 0; i < this.unit.length; i++) {
				if (this.unit[i] !== 0) {
					if (this.unit[i] === 1) {
						retStr += Base_SI_Prefixes[i];
					} else {
						retStr += Base_SI_Prefixes[i] + '^(' + this.unit[i] + ')';
					}
				}
			}
		} else {
			retStr += commonUnit;
		}
		return retStr;
	}

	public convertValueToBase(desiredBase: number): number {
		if (this.prefix === desiredBase) {
			return this.value;
		}
		let diffrence = this.prefix - desiredBase;
		if (diffrence >= 0) {
			//string move to the right
			return this.value * (10 ^ diffrence);
		} else {
			//string move to the left
			return this.value / (10 ^ diffrence);
		}
	}

	public Add(b: PhysicsVariable): PhysicsVariable {
		//typechecks first
		if (this.getUnitString() !== b.getUnitString()) {
			throw new UnitsMismatchError();
		}
		//convert to common base and prefix aka of the first
		return new PhysicsVariable();
	}
}
