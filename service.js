var _ = require('lodash')
var request = require('request')
var Url = require('url')
var Endpoint = require('./endpoint')

function Service(svcDef) {
  this.name = svcDef.name
  this.baseURL = Url.parse(svcDef.baseURL)
  this.models = _.mapValues(svcDef.models, this.createModel.bind(this))
  this.request = request.defaults(svcDef.requestDefaults || {})
}

_.extend(Service.prototype, {

  createModel: function(modelDef) {
    return _.mapValues(modelDef.endpoints, this.createEndpoint.bind(this))
  },

  createEndpoint: function(epDef) {
    return new Endpoint(epDef, this.baseURL, this.request)
  }

})

module.exports = Service