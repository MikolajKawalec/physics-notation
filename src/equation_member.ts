import { PhysicsVariable, Unit, getEmptyUnit } from './physics_notation'

export class EquationMember extends PhysicsVariable {
  protected id: string

  constructor(id: string) {
    super()
    this.id = id
  }

  public getId(): string {
    return this.id
  }

  public fromString(inStr: string): void {
    

    try {
      const strArr = inStr.split(',')
      this.setValue(parseFloat(strArr[0]))
      this.setPrefix(parseFloat(strArr[1]))
      let floatArr: Unit<number> = getEmptyUnit()
      for (let i = 2; i < 9; i++) {
        floatArr[i - 2] = parseFloat(strArr[i])
      }
      this.setUnit(floatArr)
    } catch (error) {
      throw error
    }
    return 
  }

  public fromValues(
    id: string,
    value: number,
    prefix: number,
    unit: Unit<number>,
  ): void {
    this.setValue(value)
    this.setPrefix(prefix)
    this.setUnit(unit)
    return
  }

  public makeConstant(value: number): void {
    this.setValue(value)
    this.setPrefix(0)
    this.setUnit(getEmptyUnit())
  }
}
