require('babel-polyfill')
const Vapi = require('.')
const name = process.env.npm_package_name || 'vapi'
const nameTitle = process.env.npm_package_title || 'VAPI'

console.warn(`The vapi to browser use 'babel-polyfill'. To load this module is recommendable "require" or "import" to load the vapi module on you aplicatión.`)

global[name] = Vapi
global[name].version = process.env.npm_package_version

global[nameTitle] = Vapi
global[nameTitle].version = process.env.npm_package_version
