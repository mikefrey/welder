var Service = require('./service')

function Client(def) {
  var services = this._services = def.map(function(svcDef) {
    return new Service(svcDef)
  })

  var setupEndpoint = this._setupEndpoint.bind(this)
  var obj = _.reduce(services, function(svc) {
    return _.mapValues(svc.models, function(val, key) {
      return _.mapValues(val, setupEndpoint)
    })
  })

  _.extend(this, obj)
}

module.exports = Client
_.extend(Client.prototype, {

  defaults: function(options) {

  },

  _setupEndpoint: function(endpoint, name) {
    return function() {
      var callback = _.last(arguments)
      if (typeof callback !== 'function')
        throw new Error('Last argument must be a callback function.')

      var options = getArgs(endpoint.arguments, _.initial(arguments))

      endpoint.makeRequest(options)

      // validate options
      var err = endpoint.validateOptions(options)
      if (err) return callback(err)

      // generate the request object
      var obj = endpoint.buildRequest(options)
      return console.log(obj)
    }
  }

})



function getArgs(argDef, argVals) {
  var result = {}
  // check for a POJO at the last position
  if (_.isPlainObject(_.last(argVals))) {
    _.extend(result, _.last(argVals))
    argVals = _.initial(argVals)
  }

  // look for and match up args to the endpoint def arguments
  if (argDef && argVals.length > 0) {
    var argKeys = _.keys(endpoint.arguments)
    if (argKeys.length < argVals.length) {
      return tooManyArguments(argKeys.length, argVals.length, callback)
    }
    _.extend(result, _.zipObject(argKeys, argVals))
  }
  return result
}

function tooManyArguments(max, actual, cb) {
  return process.nextTick(function() {
    cb(new Error('Too many arguments. Maximum: ' + max + ', Actual: ' + actual))
  })
}
