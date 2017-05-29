'use strict'

const escaping = require('./escaping')

/**
 * JID implements
 * - XMPP addresses according to RFC6122
 * - XEP-0106: JID Escaping
 *
 * @see http://tools.ietf.org/html/rfc6122#section-2
 * @see http://xmpp.org/extensions/xep-0106.html
 */
function JID(a, b, c) {
  this._local = null
  this.user = null // DEPRECATED
  this._domain = null
  this._resource = null

  if (a && (!b) && (!c)) {
    this.parseJID(a)
  } else if (b) {
    this.setLocal(a)
    this.setDomain(b)
    this.setResource(c)
  } else {
    throw new Error('Argument error')
  }
}

JID.prototype.parseJID = function (s) {
  const resourceStart = s.indexOf('/')
  if (resourceStart !== -1) {
    this.setResource(s.substr(resourceStart + 1))
    s = s.substr(0, resourceStart)
  }

  const atStart = s.indexOf('@')
  if (atStart !== -1) {
    this.setLocal(s.substr(0, atStart))
    s = s.substr(atStart + 1)
  }

  this.setDomain(s)
}

JID.prototype.toString = function (unescape) {
  let s = this._domain
  if (this._local) {
    s = this.getLocal(unescape) + '@' + s
  }
  if (this._resource) {
    s = s + '/' + this._resource
  }
  return s
}

/**
 * Convenience method to distinguish users
 * */
JID.prototype.bare = function () {
  if (this._resource) {
    return new JID(this._local, this._domain, null)
  }
  return this
}

/**
 * Comparison function
 * */
JID.prototype.equals = function (other) {
  return (this._local === other._local) &&
    (this._domain === other._domain) &&
    (this._resource === other._resource)
}

/**
 * http://xmpp.org/rfcs/rfc6122.html#addressing-localpart
 * */
JID.prototype.setLocal = function (local, escape) {
  escape = escape || escaping.detect(local)

  if (escape) {
    local = escaping.escape(local)
  }

  this._local = local && local.toLowerCase()
  this.user = this._local
  return this
}

JID.prototype.getLocal = function (unescape) {
  unescape = unescape || false
  let local = null

  if (unescape) {
    local = escaping.unescape(this._local)
  } else {
    local = this._local
  }

  return local
}

Object.defineProperty(JID.prototype, 'local', {
  get: JID.prototype.getLocal,
  set: JID.prototype.setLocal,
})

/**
 * http://xmpp.org/rfcs/rfc6122.html#addressing-domain
 */
JID.prototype.setDomain = function (domain) {
  this._domain = domain.toLowerCase()
  return this
}

JID.prototype.getDomain = function () {
  return this._domain
}

Object.defineProperty(JID.prototype, 'domain', {
  get: JID.prototype.getDomain,
  set: JID.prototype.setDomain,
})

/**
 * http://xmpp.org/rfcs/rfc6122.html#addressing-resourcepart
 */
JID.prototype.setResource = function (resource) {
  this._resource = resource
  return this
}

JID.prototype.getResource = function () {
  return this._resource
}

Object.defineProperty(JID.prototype, 'resource', {
  get: JID.prototype.getResource,
  set: JID.prototype.setResource,
})

JID.prototype.detectEscape = escaping.detectEscape // FIXME move to index
JID.prototype.escapeLocal = escaping.escape // FIXME move to index
JID.prototype.unescapeLocal = escaping.unescape // FIXME move to index

module.exports = JID
