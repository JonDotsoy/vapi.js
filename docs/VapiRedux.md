# vapi Redux
Redux with vapi models.

## Step 1. Make your Model

```javascript
// const {Model} = require('vapi')
class Person extends Model {}

// Define Properties
Person.defineProperty('name', {
    transform: [require('lodash/toLower')]
})
```


## Step 2. Use your the reducer

```javascript
// const set = require('setimmutable') // For less code
const Reducer = (state = initialState, action) {
    /* ... */
    case 'SET_PERSON': {
        return set(state, ['people', action.id], new Person({
            name: action.name
        }))
    }
    /* ... */
}
```


## Step 3. Get and use data

```javascript
// const get = require('lodash/get')
const lastJhon
store.subcription(() => {
    const state = store.getState()
    const jhon = get(state, ['people', 'jhon'])

    if(lastJhon !== jhon) { lastJhon = jhon // Update the last data
        if (jhon.isValid()) {
            // When is valid person
        } else {
            // When is not valid
        }
    }
})

store.dispatch({
    type: 'SET_PERSON',
    id: 'jhon',
    name: 'Jimmy'
})
```


