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

  public fromString(inStr: string): EquationMember {
    const ev = new EquationMember(inStr)

    try {
      const strArr = inStr.split(',')
      ev.setValue(parseFloat(strArr[0]))
      ev.setPrefix(parseFloat(strArr[1]))
      let floatArr: Unit<number> = getEmptyUnit()
      for (let i = 2; i < 9; i++) {
        floatArr[i - 2] = parseFloat(strArr[i])
      }
      ev.setUnit(floatArr)
    } catch (error) {
      throw error
    }
    return ev
  }

  public fromValues(
    id: string,
    value: number,
    prefix: number,
    unit: Unit<number>,
  ): EquationMember {
    const ev = new EquationMember(id)
    ev.setValue(value)
    ev.setPrefix(prefix)
    ev.setUnit(unit)
    return ev
  }

  public makeConstant(id: string, value: number): EquationMember {
    const ev = new EquationMember(id)
    ev.setValue(value)
    ev.setPrefix(0)
    ev.setUnit(getEmptyUnit())
    return ev
  }
}
