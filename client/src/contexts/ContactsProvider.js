import React, { useContext } from 'react'
import useLocalStorage from '../hooks/useLocalStorage'

const ContactsContext = React.createContext()

// custom hook that makes it so that we do not need to export ContactsContext above; much cleaner
export function useContacts() {
  return useContext(ContactsContext)
}

export function ContactsProvider({ children }) {
  // defined values and functionality
  const [contacts, setContacts] = useLocalStorage('contacts', [])

  const createContact = (id, name) => {
    // use an arrow function b/c we want to use the prev state (prevContacts)
    setContacts((prevContacts) => {
      return [...prevContacts, { id, name }]
    })
  }

  // pass value only once via the Provider the React.createContext object provides; all children get access to the values/functions
  return (
    <ContactsContext.Provider value={{ contacts, createContact }}>
      {children}
    </ContactsContext.Provider>
  )
}
