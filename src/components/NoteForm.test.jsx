import { render, screen } from '@testing-library/react'
import NoteForm from './NoteForm'
import userEvent from '@testing-library/user-event'

// first we define a mock function eventHandler called createNote
// start a user session with the userEvent library
// render a NoteForm component using our mock event handler
// getByRole gives access to the input field
// sendButton finds the button to get access to it
// user.type simulates adding text to the input object
// clicking the send button
// first expect checks to see if the form calls createNote
// the second expecet checks to see if the event handler is called with the right parameters
test('<NoteForm /> updates parent state and calls onSubmit', async () => {
  const createNote = vi.fn()
  const user = userEvent.setup()

  render(<NoteForm createNote={createNote} />)

  const input = screen.getByRole('textbox')
  const sendButton = screen.getByText('save')

  await user.type(input, 'testing a form...')
  await user.click(sendButton)

  expect(createNote.mock.calls).toHaveLength(1)
  expect(createNote.mock.calls[0][0].content).toBe('testing a form...')
})