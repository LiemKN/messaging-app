const io = require('socket.io')(5000, {
  cors: {
    origin: 'http://localhost:3000',
  },
})

io.on('connection', (socket) => {
  //socket creates a new id each time we join
  const id = socket.handshake.query.id // a way to have a static id
  socket.join(id) // join a session

  // sent messages come through this method
  socket.on('send-message', ({ recipients, text }) => {
    recipients.forEach((recipient) => {
      // when recipient gets the message, it will have the correct recipients, so we remove person receiving message
      const newRecipients = recipients.filter((r) => r !== recipient)
      // add person sending the message
      newRecipients.push(id)
      // broadcast or send a message to a recipient's room (recipient id)
      socket.broadcast.to(recipient).emit('receive-message', {
        recipients: newRecipients,
        sender: id,
        text,
      })
    })
  })
})
