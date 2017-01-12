## Class Model

### Model.defineProperty(propertyName, description)
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

console.log(myModel) // { name: "Juan Morales" }
```

**Arguments**

| Name             | Type     | Description              |
| ---------------- | -------- | ------------------------ |
| **propertyName** | `String` | Property name to define. |
| **description**  | `Object` | Options to definition.   |

***description***

| Name             | Type     | Description                                                                      |
| ---------------- | -------- | -------------------------------------------------------------------------------- |
| **persistentValidation** | `Boolean`  | Define if this property is a persistent validation.                    |
| **validation**           | `Function` | This is a function to validate the set value.                          |
| **transform**            | `Function` | This is a function to transform the value previously to set the value. |


### Model.defineProperties(properties)
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

console.log(myModel) // { name: "Diago Marcri", age: 32 }
```

> See example on runkit https://runkit.com/jondotsoy/5876dae264cddc0014666c70

**Arguments**

| Name            | Type     | Description                    |
| --------------- | -------- | ------------------------------ |
| **properties**  | `Object` | An object with all properties. |
