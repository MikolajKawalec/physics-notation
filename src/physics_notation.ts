type Unit<T> = [T, T, T, T, T, T, T];

export function getEmptyUnit(): Unit<number> {
	return [0, 0, 0, 0, 0, 0, 0];
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

	public setValue(value: number) {
		this.value = value;
	}
	public setPrefix(prefix: number) {
		this.prefix = prefix;
	}
	public setUnit(unit: Unit<number>) {
		this.unit = unit;
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

	public toString() : string {
        let retStr = this.value.toString() + ",";
        retStr += this.prefix.toString() + ",";
        retStr += this.unit.
        return retStr;
    }
}
