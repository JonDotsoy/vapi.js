const isString = require('lodash/isString')
const isNumber = require('lodash/isNumber')
const expect = require('expect.js')
const chance = new (require('chance'))
const {Model} = require('..')

const log = console.log.bind(console)

describe('VAPI.js Models', () => {

  describe('Model', () => {

    describe('Model.defineProperty()', () => {

      it('Model.defineProperty(prototyName, description: {transform})', () => {
        class MyModel1 extends Model {}
        MyModel1.defineProperty('name', {
          transform: (e) => Number(e)
        })

        const myModel1 = new MyModel1()
        myModel1.name = "153"

        expect(myModel1.name).to.be(153)
        expect(myModel1.name).to.be.a('number')

        class MyModel2 extends Model {}
        MyModel2.defineProperty('name', {
          transform: (e) => String(e)
        })

        const myModel2 = new MyModel2()
        myModel2.name = 1242

        expect(myModel2.name).to.be("1242")
        expect(myModel2.name).to.be.an('string')
      })

      it('Model.defineProperty(prototyName, description: {persistentValidation, validation})', () => {
        class MyModel extends Model {}

        MyModel.defineProperty('name', {
          persistentValidation: true,
          validation: (e) => {
            return typeof(e) === 'string'
          }
        })

        const myModel = new MyModel()

        expect(() => {
          myModel.name = Number(124)
        })
        .to.throwError()

        expect(() => {myModel.name = Number(13)})
        .to.throwException((e)=>{
          expect(e).to.be.an(TypeError)
          expect(e).to.not.be.an(class NoAllowError extends Error {})
        })

      })

    })

    it('Model.prototype.toString()', () => {
      const R = chance.first()
      const E = {[R]: class extends Model {}}

      expect((new (E[R])).toString()).to.be(`[object ${R}]`)
    })

    describe('Model.prototype.isValid()', () => {
      it('Case 1: Only a value', () => {
        class MyModel extends Model {}

        MyModel.defineProperty('name', {
          validation: isString
        })

        const instance = new MyModel()

        instance.name = 53
        expect(instance.isValid()).to.not.be.ok()

        instance.name = "hola"
        expect(instance.isValid()).to.be.ok()
      })

      it('Case 2: Multiple values', () => {
        class MyModel extends Model {}

        MyModel.defineProperty('name', {
          validation: isString
        })

        MyModel.defineProperty('age', {
          validation: isNumber
        })

        MyModel.defineProperty('isThree', {
          validation: (e) => e === 13
        })

        const instanceGood = new MyModel()

        instanceGood.name = "hola"
        instanceGood.age = 54
        instanceGood.isThree = 13

        expect(instanceGood.isValid()).to.be.ok()
      })

      it('Case 3: Some it is incorrect', () => {
        class MyModel extends Model {}

        MyModel.defineProperty('name', {
          validation: isString
        })

        MyModel.defineProperty('age', {
          validation: isNumber
        })

        MyModel.defineProperty('isThree', {
          // validation: (e) => e === 13
        })

        const instanceFail = new MyModel()
        
        instanceFail.name = 142
        instanceFail.age = "15"
        instanceFail.isThree = 15

        expect(instanceFail.isValid()).to.not.be.ok()
      })
    })

  })

  it('instanceof to a Model', () => {

    const instance = new Model()

    expect(instance).to.be.a(Model)

  })

})

