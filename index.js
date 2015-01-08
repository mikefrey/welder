var Service = require('./service')
var def = require('./test/fixtures/def.json')

if (!Array.isArray(def))
  def = [def]

var services = def.map(function(svcDef) {
  return new Service(svcDef)
})

console.log('WITH ID')
services[0].models.Tournament.save.makeRequest({id:1, name:'stuff', sport_id:1, org_id:1})

console.log('WITHOUT ID')
services[0].models.Tournament.save.makeRequest({name:'stuff', sport_id:1, org_id:1})