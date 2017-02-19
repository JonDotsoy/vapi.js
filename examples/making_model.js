const {Model} = require('..')

class Person extends Model {}

Person.defineProperty('name', {
  alias: 'firstName'
})

console.log( (new Person({name:'Carlos'})).toJSON() )
