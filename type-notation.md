# Vapi notation language

### Typejavascript
```javascript
type User = {
    id: string,
    name: string,
}
type Element = {
    title: string,
    author: User,
    tags: Tag[]
}
type Tag = {
    id: string,
    title: string,
    code: number
}
```

### output Javscript
```javascript
const isObject = (data) => Object(data) === data
const isString = (data) => String(data) === data
const isArray = (data) => Array.isArray(data)
const isNumber = (data) => Number(data) === data

const isUser = (data) => (
    isObject(data)
    && isString(data.id)
    && isString(data.name)
)

const isElement = (data) => (
    isObject(data)
    && isString(data.title)
    && isString(data.author)
    && isArray(data.tags)
    && data.tags.every(data => isTag(data))
)

const isTag = (data) => (
    isObject(data)
    && isString(data.id)
    && isString(data.title)
    && isNumber(data.code)
)
```

