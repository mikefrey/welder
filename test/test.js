
var def = require('./fixtures/def.json')
var welder = require('..')

var client = welder(def)
client.defaults({
  headers: { Authorization: 'Bearer xxx' }
})

client.Tournament.fetch(1234, function(err, data) {
  console.log('ERROR ', err)
  console.log('DATA ', data)
})
