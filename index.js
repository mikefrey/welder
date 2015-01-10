var Client = require('./client')

module.exports = function(def) {
  if (!Array.isArray(def))
    def = [def]

  return new Client(def)
}




// console.log('WITH ID')
// services[0].models.Tournament.save.makeRequest({id:1, name:'stuff', sport_id:1, org_id:1})

// console.log('WITHOUT ID')
// services[0].models.Tournament.save.makeRequest({name:'stuff', sport_id:1, org_id:1})