'use strict'

/* eslint-disable no-console */

process.env.NODE_TLS_REJECT_UNAUTHORIZED = '0'

const {xml, component} = require('.') // For you require('@xmpp/component')
const entity = component()

// Emitted for any error
entity.on('error', err => {
  console.error('error', err)
})

entity.on('close', () => {
  console.log('closed')
})

entity.on('reconnecting', () => {
  console.log('reconnecting')
})

entity.on('reconnected', () => {
  console.log('reconnected')
})

// Emitted for incoming stanza _only_ (iq/presence/message) qualified with the right namespace
// entity.on('stanza', (stanza) => {
//   console.log('stanza', stanza.toString())
// })

// Emitted for incoming nonza _only_
// entity.on('nonza', (nonza) => {
//   console.log('nonza', nonza.toString())
// })

// useful for logging raw traffic
// Emitted for every incoming fragment
entity.on('input', data => console.log('⮈ IN ', data))
// Emitted for every outgoing fragment
entity.on('output', data => console.log('⮊ OUT', data))

// Emitted for any in our out XML root element
// useful for logging
// entity.on('element', (input, output) => {
//   console.log(output ? 'element =>' : 'element <=', (output || input).toString())
// })

// Emitted when the connection is established
entity.on('connect', () => {
  console.log('1. connected')
})

// Emitted when the XMPP stream has open and we received the server stream
entity.on('open', () => {
  console.log('2. open')
})

// Emitted when the XMPP entity is authenticated
entity.on('authenticated', () => {
  console.log('3. authenticated')
})

// Emitted when authenticated and bound
entity.on('online', jid => {
  console.log('4. online', jid.toString())

  entity.send(xml`
    <iq id='ping' type='get'>
      <ping xmlns='urn:xmpp:ping'/>
    </iq>
  `)
})

// "start" opens the socket and the XML stream
entity.start({uri: 'xmpp://localhost:5347', domain: 'node-xmpp.localhost'})
  // Resolves once online
  .then(jid => {
    console.log('started', jid.toString())
  })
  // Rejects for any error before online
  .catch(err => {
    console.error('start failed', err)
  })

// Emitted when authentication is required
entity.on('authenticate', authenticate => {
  authenticate('foobar')
    .then(() => {
      console.log('authenticated')
    })
    .catch(err => {
      console.error('authentication failed', err)
    })
})

process.on('unhandledRejection', (reason, p) => {
  console.log('Possibly Unhandled Rejection at: Promise ', p, ' reason: ', reason)
})
