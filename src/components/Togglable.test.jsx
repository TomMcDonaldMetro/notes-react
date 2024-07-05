import { render, screen } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import Togglable from './Togglable'

describe('<Togglable />', () => {
  let container

  // the beforeEach function gets called before each test, which then
  // renders the Togglable component and saves the field container
  // of the returned value.
  beforeEach(() => {
    container = render(
      <Togglable buttonLabel="show...">
        <div className="testDiv" >
          togglable content
        </div>
      </Togglable>
    ).container
  })

  // this test verifies that the Togglable component renders its child component
  test('renders its children', async () => {
    await screen.findAllByText('togglable content')
  })

  // toHaveStyle checks if an element has a specific css property with specific value.
  test('at start the children are not displayed', () => {
    const div = container.querySelector('.togglableContent')
    expect(div).toHaveStyle('display: none')
  })

  // userEvent library userEvent.setup used to create a session to interact with a component
  // screen.getByText locates the button on the 'screen' object
  // firing the event handler is supposed to change the display style to ''
  // so this checks wif it does NOT have a style.
  test('after clicking the button, children are displayed', async () => {
    const user = userEvent.setup()
    const button = screen.getByText('show...')
    await user.click(button)

    const div = container.querySelector('.togglableContent')
    expect(div).not.toHaveStyle('display: none')
  })

  // same thing as before but when the cancel button is clicked after
  // it is supposed to replace the style to 'none' again to remove the elements from the screen
  test('toggled content can be closed', async () => {
    const user = userEvent.setup()
    const button = screen.getByText('show...')
    await user.click(button)

    const closeButton = screen.getByText('cancel')
    await user.click(closeButton)

    const div = container.querySelector('.togglableContent')
    expect(div).toHaveStyle('display: none')
  })
})