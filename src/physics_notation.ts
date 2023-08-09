import { commonUnits } from './common_units';

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

	public toVerboseString(bForceSI?: boolean): string {
		let retStr = this.value.toString();
		let commonUnit = commonUnits.get(this.unit);
		console.log(commonUnit);
		if (bForceSI || !commonUnit) {
		} else {
		}
		return retStr;
	}
}
