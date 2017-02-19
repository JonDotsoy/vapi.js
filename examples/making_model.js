const {Model} = require('..')

class Person extends Model {}

Person.defineProperty('firstName', {
  transform: (name) => name.toString().toLowerCase()
})

Person.defineProperty('name', {
  alias: 'firstName'
})

const nicol = new Person({name: 'Nicol'})

console.log(JSON.stringify(nicol)) // => {"name":"Nicol","firstName":"Nicol"}

