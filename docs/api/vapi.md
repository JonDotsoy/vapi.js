# VAPI
WHY?

## Class Model

### Model.defineProperty(propertyName, description)
Define an property to the model.

**Example**

```javascript
class MyModel extends Model {}

MyModel.defineProperty('name', {
  persistentValidation: true,
  validation: require("lodash/isString"),
  transform: require("lodash/toNumber")
})

const myModel = new MyModel()
myModel.name = "132"

console.log(myModel.valueOf()) // { name: 132 }
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
