const isString = require('lodash/isString')
const expect = require('expect.js')
const chance = new (require('chance'))
const {Model} = require('..')

const log = console.log.bind(console)

describe('VAPI.js Models', () => {

  describe('Model', () => {

    it('#toString()', () => {
      const R = chance.first()
      const E = {[R]: class extends Model {}}

      expect((new (E[R])).toString()).to.be(`[object ${R}]`)
    })

    it('#isValid()', () => {
      class MyModelWithValidation extends Model {}

      MyModelWithValidation.defineProperty('name', {
        validation: isString
      })

      const instance = new MyModelWithValidation()

      instance.name = 53
      expect(instance.isValid()).to.not.be.ok()

      instance.name = "hola"
      expect(instance.isValid()).to.be.ok()
    })

  })


  it('instanceof to a Model', () => {

    const instance = new Model()

    expect(instance).to.be.a(Model)

  })

  // describe('describe a new model', () => {

  //   it('define a class from a model', () => {

  //     class CustomModel1 extends Model {}
  //     class CustomModel2 extends Model {}

  //     CustomModel1.defineProperties({
  //       a: {default: 5},
  //       b: {_default: 1},
  //       c: {_default: 2},
  //       d: {_default: 3},
  //     })

  //     CustomModel2.defineProperties({
  //       c: {default: 5},
  //       d: {default: 1},
  //     })

  //     const instance1 = new CustomModel1()
  //     const instance2 = new CustomModel1()
  //     const instance3 = new CustomModel2()

  //     instance2.b = "____5____"

  //     instance2.delete('b')


  //     log(''+instance1/*.valueOf()*/)
  //     log(''+instance2/*.valueOf()*/)
  //     log(''+instance3/*.valueOf()*/)

  //     log()

  //     log('instance1')
  //     log(JSON.stringify(instance1, null, 2))
  //     log()
  //     log('instance2')
  //     log(JSON.stringify(instance2, null, 2))
  //     log()
  //     log('instance3')
  //     log(JSON.stringify(instance3, null, 2))

  //   })

  // })

})

