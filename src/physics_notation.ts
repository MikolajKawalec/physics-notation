import { commonUnits } from './common_units'
import { siPrefixes } from './si_prefixes'

export type Unit<T> = [T, T, T, T, T, T, T]

export function getEmptyUnit(): Unit<number> {
  return [0, 0, 0, 0, 0, 0, 0]
}

export function convertUnitStringToUnitArray(unitString: string): Unit<number> {
  const splitted = unitString.split(',')
  return [
    parseInt(splitted[0]),
    parseInt(splitted[1]),
    parseInt(splitted[2]),
    parseInt(splitted[3]),
    parseInt(splitted[4]),
    parseInt(splitted[5]),
    parseInt(splitted[6]),
  ]
}

export function IsKilogram(unit: Unit<number>): boolean {
  let kg = [0, 0, 1, 0, 0, 0, 0]
  let checkUnit = [...unit]
  for (let i = 0; i < kg.length; i++) {
    checkUnit[i] = checkUnit[i] - kg[i]
  }
  return checkUnit.toString() === getEmptyUnit().toString()
}

export const Base_Units: Unit<string> = [
  'time(s)',
  'length(m)',
  'mass(kg)',
  'electric current(A)',
  'thermodynamic temparature(K)',
  'amount of substance(mol)',
  'luminous intensity(cd)',
]

export const Base_SI_Prefixes: Array<string> = [
  's',
  'm',
  'kg',
  'A',
  'K',
  'mol',
  'cd',
]

export class UnitsMismatchError extends Error {
  constructor() {
    super()
    Object.setPrototypeOf(this, UnitsMismatchError.prototype)
  }

  getErrorMessage() {
    return 'Something went wrong Cannot perform operation with mismatching units'
  }
}

export class UnitInExponent extends Error {
  constructor() {
    super()
    Object.setPrototypeOf(this, UnitInExponent.prototype)
  }

  getErrorMessage() {
    return 'Something went wrong Cannot perform operation with nonzero unit in the exponent'
  }
}

export class PhysicsVariable {
  //TODO add procted attribiute id

  protected value: number
  protected prefix: number
  protected unit: Unit<number>

  constructor() {
    this.value = 0
    this.prefix = 0
    this.unit = getEmptyUnit()
  }

  public static fromString(inStr: string): PhysicsVariable {
    const pv = new PhysicsVariable()
    try {
      const strArr = inStr.split(',')
      pv.setValue(parseFloat(strArr[0]))
      pv.setPrefix(parseFloat(strArr[1]))
      let floatArr: Unit<number> = getEmptyUnit()
      for (let i = 2; i < 9; i++) {
        floatArr[i - 2] = parseFloat(strArr[i])
      }
      pv.setUnit(floatArr)
    } catch (error) {
      throw error
    }
    return pv
  }

  public static fromValues(
    value: number,
    prefix: number,
    unit: Unit<number>,
  ): PhysicsVariable {
    const pv = new PhysicsVariable()
    pv.setValue(value)
    pv.setPrefix(prefix)
    pv.setUnit(unit)
    return pv
  }

  public static makeConstant(value: number): PhysicsVariable {
    const pv = new PhysicsVariable()
    pv.setValue(value)
    pv.setPrefix(0)
    pv.setUnit(getEmptyUnit())
    return pv
  }

  public setValue(value: number): void {
    this.value = value
  }

  public setPrefix(prefix: number): void {
    this.prefix = prefix
  }

  public setUnit(unit: Unit<number>): void {
    this.unit = unit
  }

  public setUnitByValues(
    time: number,
    length: number,
    mass: number,
    electric_current: number,
    thermodynamic_temperature: number,
    amount_of_substance: number,
    luminous_intensity: number,
  ): void {
    this.unit[0] = time
    this.unit[1] = length
    this.unit[2] = mass
    this.unit[3] = electric_current
    this.unit[4] = thermodynamic_temperature
    this.unit[5] = amount_of_substance
    this.unit[6] = luminous_intensity
  }

  public getValue(): number {
    return this.value
  }

  public getPrefix(): number {
    return this.prefix
  }

  public getUnit(): Unit<number> {
    return this.unit
  }

  public toString(): string {
    let retStr = this.value.toString() + ','
    retStr += this.prefix.toString() + ','
    retStr += this.unit.toString()
    return retStr
  }

  public getUnitString(): string {
    let retStr: string = ''
    for (let i = 0; i < this.unit.length; i++) {
      if (i === this.unit.length - 1) {
        retStr += this.unit[i].toString()
      } else {
        retStr += this.unit[i].toString() + ','
      }
    }
    return retStr
  }

  public toVerboseString(bForceSI?: boolean): string {
    let retStr = this.value.toString()
    if (!this.IsEmptyUnit()) {
      let siPrefix = siPrefixes.get(this.prefix)
      if (this.prefix !== 0) {
        if (siPrefix) {
          retStr += siPrefix
        } else {
          retStr += '*10^' + this.prefix.toString()
        }
      }
    }

    let commonUnit = commonUnits.get(this.getUnitString())
    if (bForceSI || !commonUnit) {
      for (let i = 0; i < this.unit.length; i++) {
        if (this.unit[i] !== 0) {
          if (this.unit[i] === 1) {
            retStr += Base_SI_Prefixes[i]
          } else {
            retStr += Base_SI_Prefixes[i] + '^(' + this.unit[i] + ')'
          }
        }
      }
    } else {
      retStr += commonUnit
    }
    return retStr
  }

  public convertValueToBase(desiredBase: number): number {
    if (this.prefix === desiredBase) {
      return this.value
    }
    let diffrence = this.prefix - desiredBase
    if (diffrence >= 0) {
      return this.value * Math.pow(10, diffrence)
    } else {
      return this.value / Math.pow(10, Math.abs(diffrence))
    }
  }

  //@pmfenix
  public Add(b: PhysicsVariable): PhysicsVariable {
    //typechecks first
    if (this.getUnitString() !== b.getUnitString()) {
      throw new UnitsMismatchError()
    }
    let valueB = b.convertValueToBase(this.prefix)
    return PhysicsVariable.fromValues(
      this.value + valueB,
      this.prefix,
      this.unit,
    )
  }

  public Substract(b: PhysicsVariable): PhysicsVariable {
    //typechecks first
    if (this.getUnitString() !== b.getUnitString()) {
      throw new UnitsMismatchError()
    }
    let valueB = b.convertValueToBase(this.prefix)
    return PhysicsVariable.fromValues(
      this.value - valueB,
      this.prefix,
      this.unit,
    )
  }

  public Multiply(b: PhysicsVariable): PhysicsVariable {
    //common base
    let valueB = b.convertValueToBase(this.prefix)
    //calculating the value and the prefix
    let endValue = this.value * valueB

    //prefixeds are not done
    let endPrefix = this.prefix
    //dealing with kiliograms
    if (IsKilogram(this.unit)) {
      // endValue = endValue / 1000;
    }
    if (IsKilogram(b.unit)) {
      endValue = endValue / 1000
    }
    if (IsKilogram(this.unit) && IsKilogram(b.unit)) {
      endValue = endValue * Math.pow(10, 3)
      endPrefix = endPrefix - 3
    }
    if (IsKilogram(this.unit) && b.IsEmptyUnit()) {
      endPrefix = endPrefix + 3
    }
    if (IsKilogram(b.unit) && this.IsEmptyUnit()) {
      endPrefix = endPrefix + 3
    }

    //unit manipulation
    let newUnit: Unit<number> = getEmptyUnit()
    for (let i = 0; i < newUnit.length; i++) {
      newUnit[i] = this.unit[i] + b.unit[i]
    }

    return PhysicsVariable.fromValues(endValue, endPrefix, newUnit)
  }

  public Divide(b: PhysicsVariable): PhysicsVariable {
    //common base
    let valueB = b.convertValueToBase(this.prefix)
    //calculating the value and the prefix
    let endValue = this.value / valueB

    //prefixeds are not done
    let endPrefix = this.prefix
    //dealing with kiliograms
    if (IsKilogram(this.unit)) {
      endValue = endValue * 1000
    }
    if (IsKilogram(b.unit)) {
      endValue = endValue * 1000
    }
    if (IsKilogram(this.unit) && IsKilogram(b.unit)) {
      endValue = endValue / Math.pow(10, 6)
      endPrefix = endPrefix - 3
    }
    if (IsKilogram(this.unit) && b.IsEmptyUnit()) {
      endPrefix = endPrefix - 3
    }
    if (IsKilogram(b.unit) && this.IsEmptyUnit()) {
      endPrefix = endPrefix - 3
    }

    //unit manipulation
    let newUnit: Unit<number> = getEmptyUnit()
    for (let i = 0; i < newUnit.length; i++) {
      newUnit[i] = this.unit[i] - b.unit[i]
    }

    return PhysicsVariable.fromValues(endValue, endPrefix, newUnit)
  }

  //There may be errors with kilogram calculations provide me with example unit test please
  public ToPower(b: PhysicsVariable): PhysicsVariable {
    //throw out if b has a unit
    if (!b.IsEmptyUnit()) {
      throw new UnitInExponent()
    }
    //convert both a and b to base 0
    let base0A = this.convertValueToBase(0)
    let base0B = b.convertValueToBase(0)
    let resultBase0 = Math.pow(base0A, base0B)
    //convert result to original prefix
    let result = resultBase0 * Math.pow(10, this.prefix)

    //convert unit aka multiple by itself
    let newUnit: Unit<number> = getEmptyUnit()
    for (let i = 0; i < newUnit.length; i++) {
      newUnit[i] = this.unit[i] + this.unit[i]
    }

    let pvRet = PhysicsVariable.fromValues(result, this.prefix, newUnit)
    return pvRet
  }

  //TODO place more operators here define them such as sin cos tan etc

  public IsEqual(b: PhysicsVariable): boolean {
    // check unit
    if (this.getUnitString() !== b.getUnitString()) {
      return false
    }
    //check converted value
    //perhaps add later small approximations
    if (this.value !== b.convertValueToBase(this.prefix)) {
      return true
    }
    return true
  }

  public IsEmptyUnit(): boolean {
    for (let i = 0; i < this.unit.length; i++) {
      if (this.unit[i] !== 0) {
        return false
      }
    }
    return true
  }

  public IsNegative(): boolean {
    return this.value < 0
  }
  public IsPositive(): boolean {
    return this.value > 0
  }
  public IsZero(): boolean {
    return this.value === 0
  }
  public toZeroPrefix(): PhysicsVariable {
    if (IsKilogram(this.unit)) {
      return PhysicsVariable.fromValues(
        this.value * Math.pow(10, this.prefix - 3),
        0,
        this.unit,
      )
    } else {
      return PhysicsVariable.fromValues(
        this.value * Math.pow(10, this.prefix),
        0,
        this.unit,
      )
    }
  }
}
