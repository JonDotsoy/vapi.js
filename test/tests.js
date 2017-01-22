require('debug').enable('vapi:*')
// const log = require('debug')('vapi:tests')

/* global describe, it */
const isString = require('lodash/isString')
const isNumber = require('lodash/isNumber')
const range = require('lodash/range')
// const wrap = require('lodash/wrap')
const bind = require('lodash/bind')
const expect = require('expect.js')
const chance = new (require('chance'))()
// const {} = require('./data')
const {Model, utils} = require('..')

global.Model = Model

describe('VAPI', () => {
  describe('Model', () => {
    describe('Inspect a element from Model', () => {
      it('usin model#toString()', () => {
        class MyModel extends Model {}
        const myModel = new MyModel()

        expect(myModel.toString()).to.be('[model MyModel]')
      })
      it('usin model#toString(), and custom name.', () => {
        class MyModel extends Model {}
        const myModel = new MyModel()
        myModel[Symbol.toStringTag] = 'modelCool'

        expect(myModel.toString()).to.be('[model modelCool]')
      })

      it('Usin instanceof', () => {
        class A extends Model {}
        class B extends Model {}
        class C extends (class _C extends (class __C extends Model {}) {}) {}

        const a = new A()
        const b = new B()
        const c = new C()

        expect(a).to.be.a(Model)
        expect(b).to.be.a(Model)
        expect(c).to.be.a(Model)
      })
    })

    describe('Parse a model', () => {
      it('Parse with validators', () => {
        const name = chance.first()
        const age = chance.age()

        const myData = {
          name,
          age
        }

        class Person extends Model {}
        Person.defineProperty('name', {
          transform: (e) => ('') // Allways return a empty string
        })

        const person1 = new Person(myData)

        expect(person1.name).to.be('')
        expect(person1.age).to.be(age)
      })

      const nameTOWithParseStaticFunction = chance.first()
      const ageTOWithParseStaticFunction = chance.age()
      it('with Parse static function', () => {
        const name = nameTOWithParseStaticFunction
        const age = ageTOWithParseStaticFunction

        const myData = {
          name,
          age
        }

        class Person extends Model {}

        const person1 = Person.parse(myData)

        expect(person1.name).to.be(name)
        expect(person1.age).to.be(age)
      })

      const nameTOSingleParse = chance.first()
      const ageTOSingleParse = chance.age()
      it('Single Parse', () => {
        const name = nameTOSingleParse
        const age = ageTOSingleParse

        const myData = {
          name,
          age
        }

        class Person extends Model {}
        const person1 = new Person(myData)

        expect(person1.name).to.be(name)
        expect(person1.age).to.be(age)
      })
    })

    describe('Model.defineProperty()', () => {
      it('Model.defineProperty(prototyName, description: {transform})', () => {
        class MyModel1 extends Model {}
        MyModel1.defineProperty('name', {
          transform: (e) => Number(e)
        })

        const myModel1 = new MyModel1()
        myModel1.name = '153'

        expect(myModel1.name).to.be(153)
        expect(myModel1.name).to.be.a('number')

        class MyModel2 extends Model {}
        MyModel2.defineProperty('name', {
          transform: (e) => String(e)
        })

        const myModel2 = new MyModel2()
        myModel2.name = 1242

        expect(myModel2.name).to.be('1242')
        expect(myModel2.name).to.be.an('string')
      })

      it('Model.defineProperty(prototyName, description: {persistentValidation, validation})', () => {
        class MyModel extends Model {}

        MyModel.defineProperty('name', {
          persistentValidation: true,
          validation: (e) => {
            return typeof (e) === 'string'
          }
        })

        const myModel = new MyModel()

        expect(() => {
          myModel.name = Number(124)
        })
        .to.throwError()

        expect(() => { myModel.name = Number(13) })
        .to.throwException((e) => {
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
            transferable: true
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

          CAT.username = 'Cat'
          CAT.password = '12345'

          const CATParsed = JSON.parse(JSON.stringify(CAT, null, 2))

          expect(CATParsed.username).to.be('cat')
          expect(CATParsed.username).to.not.be('Cat')

          expect(CATParsed.password).to.be(undefined)
          expect(CATParsed.password).to.not.be('12345')
        })
      })

      const hashsTOHeritableProperties = range(4).map(bind(chance.hash, chance, void (0)))
      it('Heritable properties', () => {
        const hashs = hashsTOHeritableProperties

        class Person extends Model {}
        Person.defineProperties({
          fullname: {default: hashs[0]},
          age: {default: hashs[1]}
        })

        class Account extends Person {}
        Account.defineProperties({
          username: {default: hashs[2]},
          password: {
            transferable: false,
            default: hashs[3]
          }
        })

        const instancePerson = new Person()
        const instanceAccount = new Account()

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

    describe('Model.prototype.isValid()', () => {
      it('Case 1: Only a value', () => {
        class MyModel extends Model {}

        MyModel.defineProperty('name', {
          validation: isString
        })

        const instance = new MyModel()

        instance.name = 53
        expect(instance.isValid()).to.not.be.ok()

        instance.name = 'hola'
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

        instanceGood.name = 'hola'
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
        instanceFail.age = '15'
        instanceFail.isThree = 15

        expect(instanceFail.isValid()).to.not.be.ok()
      })
    })

    describe('Model alias values', () => {
      it('Simple alias', () => {
        class Person extends Model {}
        Person.defineProperty('name', {
          alias: 'firstName'
        })

        const jhon = new Person()

        jhon.name = 'Jhon'

        expect(jhon.name).to.be('Jhon')
        expect(jhon.firstName).to.be('Jhon')

        jhon.name = 'Carlos'

        expect(jhon.name).to.be('Carlos')
        expect(jhon.firstName).to.be('Carlos')
      })
    })
  })
})

describe('utils functions', () => {
  it('#getPrototypesOf', () => {
    class A {}
    class B extends A {}
    class C extends B {}
    class D extends C {}
    class E extends D {}
    class F extends E {}
    class G extends F {}
    class I extends G {}

    const _chain = utils.getPrototypesOf(new I(), A.prototype)
    const chain = [..._chain]
    chain.first = chain[0]
    chain.last = chain[chain.length - 1]

    // log('Inspect chain of prototypes => %o', chain)

    expect(chain[0].constructor).to.be(I)
    expect(chain[1].constructor).to.be(G)
    expect(chain[2].constructor).to.be(F)
    expect(chain[3].constructor).to.be(E)
    expect(chain[4].constructor).to.be(D)
    expect(chain[5].constructor).to.be(C)
    expect(chain[6].constructor).to.be(B)
    expect(chain[7].constructor).to.be(A)
  })

  it('#getDescriptionOf', () => {
    class MyModelSub2 extends Model {}
    class MyModelSub1 extends MyModelSub2 {}
    class MyModel extends MyModelSub1 {}

    MyModelSub2.defineProperty('c', {default: 'good c'})
    MyModelSub2.defineProperty('b', {default: 'bad b'})
    MyModelSub2.defineProperty('a', {default: 'bad a'})

    MyModelSub1.defineProperty('b', {default: 'good b'})
    MyModelSub1.defineProperty('a', {default: 'bad a'})

    MyModel.defineProperty('a', {default: 'good a'})

    const myModel = new MyModel()
    const description = utils.getDescriptionOf(myModel)

    expect(description.a.default).to.be('good a')
    expect(description.b.default).to.be('good b')
    expect(description.c.default).to.be('good c')
  })
})
