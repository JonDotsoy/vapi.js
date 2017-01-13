const isString = require('lodash/isString')
const isNumber = require('lodash/isNumber')
const range = require('lodash/range')
const wrap = require('lodash/wrap')
const bind = require('lodash/bind')
const expect = require('expect.js')
const chance = new (require('chance'))
const {Model} = require('..')

const log = console.log.bind(console)

describe('VAPI Models', () => {

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

      // REF: https://runkit.com/jondotsoy/5876e5d164cddc0014666ebd
      describe('Model.defineProperty(prototyName, description: {transferable})', () => {

        it('Example 1: Define the "name" property how to transferable.', () => {

          const name = chance.name()

          class Person extends Model {}

          Person.defineProperty('name', {
            transferable: true,
          })

          const juan = new Person()

          juan.name = name

          const JUANParsed = JSON.parse(JSON.stringify(juan, null, 2))

          expect(JUANParsed.name).to.be(name)
        })

        it('Example 2: define the "Account" property how to not transferable.', () => {

          class Account extends Model {}
          Account.defineProperties({
            username: {
              transform: require('lodash/toLower')
            },
            password: {
              transferable: false
            }
          })

          const CAT = new Account()

          CAT.username = "Cat"
          CAT.password = "12345"

          const CATParsed = JSON.parse(JSON.stringify(CAT, null, 2))

          expect(CATParsed.username).to.be('cat')
          expect(CATParsed.username).to.not.be('Cat')

          expect(CATParsed.password).to.be(undefined)
          expect(CATParsed.password).to.not.be("12345")

        })

      })

      it('Heritable properties',  () => {
        const hashs = range(4).map(bind(chance.hash, chance, void(0)))

        class Person extends Model {}
        Person.defineProperties({
          fullname: {default:hashs[0]},
          age: {default:hashs[1]}
        })

        class Account extends Person {}
        Account.defineProperties({
          username: {default:hashs[2]},
          password: {
            transferable: false,
            default:hashs[3]
          }
        })

        const instancePerson = new Person
        const instanceAccount = new Account

        expect(instancePerson.fullname).to.be(hashs[0])
        expect(instancePerson.age).to.be(hashs[1])

        expect(instanceAccount.fullname).to.be(hashs[0])
        expect(instanceAccount.age).to.be(hashs[1])
        expect(instanceAccount.username).to.be(hashs[2])
        expect(instanceAccount.password).to.be(hashs[3])

        // Transferables
        const transferInstancePerson = JSON.parse(JSON.stringify(instancePerson))
        const transferInstanceAccount = JSON.parse(JSON.stringify(instanceAccount))

        expect(transferInstancePerson.fullname).to.be(hashs[0])
        expect(transferInstancePerson.age).to.be(hashs[1])

        expect(transferInstanceAccount.fullname).to.be(hashs[0])
        expect(transferInstanceAccount.age).to.be(hashs[1])
        expect(transferInstanceAccount.username).to.be(hashs[2])
        expect(transferInstanceAccount.password).to.be(undefined)
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

