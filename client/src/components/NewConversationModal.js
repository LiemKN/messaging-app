import React, { useState } from 'react'
import { Modal, Form, Button } from 'react-bootstrap'
import { useContacts } from '../contexts/ContactsProvider'
import { useConversations } from '../contexts/ConversationsProvider'

function NewConversationModal({ closeModal }) {
  const [selectedContactIds, setSelectedContactIds] = useState([])
  const { contacts } = useContacts()
  const { createConversation } = useConversations()

  const handleSubmit = (e) => {
    e.preventDefault()
    createConversation(selectedContactIds)
    closeModal()
  }

  const handleCheckboxChange = (contactId) => {
    // initially no contacts are selected so prevSelectedContactIds is empty
    setSelectedContactIds((prevSetSelectedContactIds) => {
      if (prevSetSelectedContactIds.includes(contactId)) {
        // if contact was checked then unchecked, they will be removed
        return prevSetSelectedContactIds.filter((prevId) => {
          return contactId !== prevId
        })
      } else {
        // add the selected contact to the list of contacts that will be added to the conversation
        return [...prevSetSelectedContactIds, contactId]
      }
    })
  }

  return (
    <>
      <Modal.Header closeButton>Create Conversation</Modal.Header>
      <Modal.Body>
        <Form onSubmit={handleSubmit}>
          {contacts.map((contact) => (
            <Form.Group controlId={contact.id} key={contact.key}>
              <Form.Check
                type='checkbox'
                value={selectedContactIds.includes(contact.id)}
                label={contact.name}
                onChange={() => handleCheckboxChange(contact.id)}
              />
            </Form.Group>
          ))}
          <Button className='mt-3' type='submit'>
            Create
          </Button>
        </Form>
      </Modal.Body>
    </>
  )
}

export default NewConversationModal
