# Models
A model represents a structured data and usually, is used to work data in the applicacitión. One usual application is defined method helpful to the work the data.

```javascript
const {Model} = require('vapi')

class Person extends Model {
    activate () {
        this.isActived = true
        return this
    }
}

Person.defineProperties({
    // e.g., 24
    'age': {
        'transform': require('lodash/toNumber')
    },
    // e.g., "Juan Antionio"
    'name': {
        'transform': require('lodash/toString')
    },
    // e.g., "Female"
    'gender': {},
    // e.g., true
    'isActived': {
        'validation': require('lodash/isBoolean')
    },
})
```


## Alias Properties
Alias name to the model, permit read and write under another parameter in an instance.

### Example
```javascript
class Person extends Model {}
Person.defineProperty('name', {
    alias: 'firstName'
})

const jhon = new Person()

jhon.firstName = 'Jhon'
// jhon => { 'firstName': 'Jhon', 'name': 'Jhon' } 

jhon.firstName = 'Carlos'
// jhon => { 'firstName': 'Carlos', 'name': 'Carlos' } 
```


