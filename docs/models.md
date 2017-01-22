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

**Example:**

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


## Validations
The models can use validators this is useful when needing specific values. 

**Example:**

```javascript
class Account extends Model {}
Account.defineProperty('password', {
    validation: [require('lodash/isString'), (v) => /^[a-z|0-9]{6,12}$/.test(v)],
})

const cat = new Account()
cat.password = '1234'

cat.isValid() // false

cat.password = '1b3d5678910'
cat.isValid() // true
```

## Transform
Modify the value before set the final value.

**Example:**

```javascript
function toCode (value) {
    if (isObject(value)) {
        return value
    } else {
        return {code: value, v: value[0]}
    }
}

class PromoCard extends Model {}
PromoCard.defineProperty('code', {
    transform: toCode
})

const card1 = new PromoCard()

card1.code = "abc1234"
// card1 => {'code': {'code': 'bc1234', 'v': 'a'}}
```
