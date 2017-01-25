## Class `Model`

### `Model.defineProperty(propertyName, description)`
Define an property to the model.

**Example**

```javascript
class MyModel extends Model {}

MyModel.defineProperty('name', {
  persistentValidation: true,
  validation: require('lodash/isString'),
  transform: require('lodash/toString')
})

const myModel = new MyModel()
myModel.name = 'Juan Morales'

// myModel => { name: "Juan Morales" }
```

**Arguments**

| Name             | Type     | Description              |
| ---------------- | -------- | ------------------------ |
| **propertyName** | `String` | Property name to define. |
| **description**  | `Object` | Options to definition.   |

***description***

| Name                     | Type       | Description                                                            |
| ------------------------ | ---------- | ---------------------------------------------------------------------- |
| **persistentValidation** | `Boolean`  | Define if this property is a persistent validation.                    |
| **validation**           | `Function` | This is a function to validate the set value.                          |
| **transform**            | `Function` | This is a function to transform the value previously to set the value. |
| **alias**                | `Object`   | Define a reference to other value.                                     |
| **default**              | `Object`   | Default value.                                                         |
| **transferable**         | `Boolean`  | Define the property is view on end JSON.                               |


### `Model.defineProperties(properties)`
Define many properties to the model.

**Example**

```javascript
class MyModel extends Model {}

MyModel.defineProperties({
  'name': {
    validation: require('lodash/isString')
  },
  'age': {
    transform: require('lodash/toNumber')
  }
})

const myModel = new MyModel()
myModel.name = 'Diago Marcri'
myModel.age = '32'

// myModel => { name: "Diago Marcri", age: 32 }
```

> See example on runkit https://runkit.com/jondotsoy/5876dae264cddc0014666c70

**Arguments**

| Name                      | Type     | Description                                    |
| ------------------------- | -------- | ---------------------------------------------- |
| **propertiesDescriptors** | `Object` | An object with multiple descriptions to model. |

### `Model.parse(Object)`
Is similar to `new Model(initialValues)`. Transform a simple object to a model type.

```javascript
class Person extends Model {}
Person.defineProperty('name', {default: 'Jhon'})

let person1 = {lastName: 'Fredyc'}
// person1 => {"lastName": "Fredyc"}

person1 = Person.parse(person1)
// person1 => Person {"name": "Jhon","lastName": "Fredyc"}
```

> See example on runkit: https://runkit.com/jondotsoy/example-to-model-parse

**Arguments**

| Name       | Type     | Description          |
| ---------- | -------- | -------------------- |
| **Object** | `Object` | Object ot transform. |

