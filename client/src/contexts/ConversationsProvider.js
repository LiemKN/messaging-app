import React, { useContext, useEffect, useState, useCallback } from 'react'
import useLocalStorage from '../hooks/useLocalStorage'
import { useContacts } from './ContactsProvider'
import { useSocket } from './SocketProvider'

const ConversationsContext = React.createContext()

// custom hook that makes it so that we do not need to export ConversationsContext above; much cleaner
export function useConversations() {
  return useContext(ConversationsContext)
}

function arrayEquality(a, b) {
  if (a.length !== b.length) return false
  a.sort()
  b.sort()

  // tests whether all elements in the array pass the test implemented by the provided function
  return a.every((element, index) => element === b[index])
}

export function ConversationsProvider({ id, children }) {
  // defined values and functionality
  const [conversations, setConversations] = useLocalStorage('conversations', [])
  const { contacts } = useContacts()
  const [selectConversationIndex, setSelectConversationIndex] = useState(0)
  const socket = useSocket()

  function createConversation(recipients) {
    setConversations((prevConversations) => {
      return [...prevConversations, { recipients, messages: [] }] // each conversation is an object with a recipients array and messages array
    })
  }

  const addMessageToConversation = useCallback(
    ({ recipients, text, sender }) => {
      setConversations((prevConversations) => {
        let madeChange = false
        const newMessage = { sender, text }

        const newConversations = prevConversations.map((conversation) => {
          // find conversation with matching recipients and return an updated conversations object with the new message
          if (arrayEquality(conversation.recipients, recipients)) {
            madeChange = true
            return {
              ...conversation,
              messages: [...conversation.messages, newMessage],
            }
          }
          return conversation
        })

        // if there is an existing conversation with the recipients
        if (madeChange) {
          return newConversations
        } else {
          // don't have a conversation with the recipients
          return [...prevConversations, { recipients, messages: [newMessage] }]
        }
      })
    },
    [setConversations]
  )

  // handle receiving messages from server's .emit('receive-message)
  useEffect(() => {
    if (socket == null) return
    socket.on('receive-message', addMessageToConversation)

    // remove event listener
    return () => socket.off('receive-message')
  }, [socket, addMessageToConversation]) // initial issue is that addMessageToConversation changes with each component re render so have to wrap the addMessageToConversation in a useCallback() to prevent it

  function sendMessage(recipients, text) {
    socket.emit('send-message', { recipients, text })
    addMessageToConversation({ recipients, text, sender: id })
  }

  // get the conversations in an object with the conversation, recipients array containing an id and name,
  const formattedConversations = conversations.map((conversation, index) => {
    const recipients = conversation.recipients.map((recipient) => {
      const contact = contacts.find((contact) => contact.id === recipient)
      // each contact has an id and name
      //find() method returns the value of the first element in the provided array that satisfies the provided testing function

      const name = (contact && contact.name) || recipient
      // && operator: Starting from left and moving to the right, return the first operand that is falsy (i.e false, 0, '', null, undefined, or NaN). If no falsy operand was found, return the latest operand.
      // || operator: Starting from left and moving to the right, return the first operand that is truthy. If no truthy operand was found, return the latest operand.
      return { id: recipient, name }
    })

    const messages = conversation.messages.map((message) => {
      const contact = contacts.find((contact) => contact.id === message.sender)
      // each contact has an id and name
      //find() method returns the value of the first element in the provided array that satisfies the provided testing function

      const name = (contact && contact.name) || message.sender
      const fromMe = id === message.sender
      return { ...message, senderName: name, fromMe }
    })

    const selected = index === selectConversationIndex
    return { ...conversation, messages, recipients, selected }
  })

  const value = {
    conversations: formattedConversations,
    selectedConversation: formattedConversations[selectConversationIndex],
    sendMessage,
    selectConversationIndex: setSelectConversationIndex,
    createConversation,
  }

  // pass value only once via the Provider the React.createContext object provides; all children get access to the values/functions
  return (
    <ConversationsContext.Provider value={value}>
      {children}
    </ConversationsContext.Provider>
  )
}
