const Vapi = require('.')
const name = process.env.npm_package_name || "vapi"
const nameTitle = process.env.npm_package_title || "VAPI"

global[name] = Vapi
global[name].version = process.env.npm_package_version

global[nameTitle] = Vapi
global[nameTitle].version = process.env.npm_package_version
