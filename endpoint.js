var _ = require('lodash')

var requiredParamsRx = /(?!:[^\/]+\?):([^\/]+)/g
var optionalParamsRx = /\/:([^\/]+)\?$/

function Endpoint(epDef, baseURL, request) {
  _.extend(this, epDef)
  this.params = this.findParams()
  console.log('PARAMS', this.params)
  this.baseURL = baseURL
  this.request = request
}

_.extend(Endpoint.prototype, {

  makeRequest: function(options) {
    var err = this.validateOptions(options)
    if (err) return console.error('error', err)

    var obj = this.buildRequest(options)
    return console.log(obj)
  },

  validateOptions: function(options) {
    // validate that all required params, query and args are present
    var where = [this.arguments, this.query, this.payload, this.params]
    var results = _.transform(where, function(result, set) {
      if (!set) return
      _.chain(set).pick(isRequired).each(function(val, key) {
        if (!_.has(options, key))
          result.push(new Error('"' + key + '" is a required parameter.'))
      })
    })
    return results.length < 1 ? false : results
  },

  buildRequest: function(options) {
    // build up the object that request uses to make a request
    var method = getVerb(this.verb, options)

    var opts = {
      headers: { accept:'application/json' },
      jar: false,
      method: method,
      url: this.buildURL(options)
    }

    if (~['POST','PUT','PATCH'].indexOf(method))
      opts.json = buildPayload(this.payload, options)

    return opts
  },

  buildURL: function(options) {
    // assemble the url
    var url = _.clone(this.baseURL)
    url.pathname = buildPath(this.path, options)
    url.query = buildQuery(this.query, options)
    return url
  },

  findParams: function() {
    // look for required params in the path,
    // these are only used for validation
    var params = {}
    var match
    while ((match = requiredParamsRx.exec(this.path)) !== null) {
      params[match[1]] = { required: true }
    }
    return params
  }

})


function getVerb(verbs, options) {
  // determine method/verb based on options and definition
  if (typeof verbs === 'string') return verbs
  if (typeof verbs !== 'object')
    throw new Error('verb must be a string or object hash')

  return _.find(_.keys(verbs), function(key) {
    var val = verbs[key]
    if (!val) return true
    if (val && val.when && options[val.when])
      return true
    return false
  }).toUpperCase()
}


function buildPath(pathTmpl, options) {
  // assemble the url path
  var path = pathTmpl
    .replace(requiredParamsRx, function(m, f) { return options[f] })
    .replace(optionalParamsRx, function(m, f) {
      return options[f] ? '/' + options[f] : ''
    })
  return path
}


function buildQuery(queryDef, options) {
  // assemble the query object
  return _.pick(options, _.keys(queryDef))
}

function buildPayload(payloadDef, options) {
  // filter the options into a payload
  return _.pick(options, _.keys(payloadDef))
}


function isRequired(val) {
  return (_.isObject(val) && val.required === true) || val === true
}

module.exports = Endpoint