import React, { useRef } from 'react'
import { Button, Container, Form } from 'react-bootstrap'
import { v4 as uuidV4 } from 'uuid'

function Login({ onIdSubmit }) {
  const idRef = useRef()

  const handleSubmit = (e) => {
    e.preventDefault() // prevent page refresh b/c form submission posts to the page
    onIdSubmit(idRef.current.value)
  }

  const createNewId = () => {
    onIdSubmit(uuidV4())
  }

  return (
    <Container
      className='align-items-center d-flex'
      style={{ height: '100vh' }}
    >
      <Form onSubmit={handleSubmit} className='w-100'>
        <Form.Group>
          <Form.Label>Enter your ID</Form.Label>
          <Form.Control
            className='mb-3'
            type='text'
            ref={idRef}
            required
          ></Form.Control>
        </Form.Group>
        <Button type='submit' className='me-2'>
          Login
        </Button>
        <Button onClick={createNewId} variant='secondary'>
          Create A New Id
        </Button>
      </Form>
    </Container>
  )
}

export default Login
