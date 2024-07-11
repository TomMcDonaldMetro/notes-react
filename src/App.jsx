import { useState, useEffect, useRef } from 'react'
import Note from './components/Note'
import LoginForm from './components/LoginForm'
import Togglable from './components/Togglable'
import NoteForm from './components/NoteForm'
import Notification from './components/Notification'
import Footer from './components/Footer'
import noteService from './services/notes'
import loginService from './services/login'


const App = (props) => {
  const [notes, setNotes] = useState([])
  const [showAll, setShowAll] = useState(true)
  const [notification, setNotification] = useState(null)
  const [notificationType, setNotificationType] = useState(null)


  const [user, setUser] = useState(null)
  const [loginVisible, setLoginVisible] = useState(false)



  const handleLogin = async (loginObject) => {

    try {
      const user = await loginService.login(loginObject)
      window.localStorage.setItem(
        'loggedNoteappUser', JSON.stringify(user)
      )
      noteService.setToken(user.token)
      setUser(user)

      setNotification(`${user.name} logged in.`)
      setNotificationType('success')

      setTimeout(() => {
        setNotification(null)
        setNotificationType(null)
      }, 5000);
    } catch (exception) {
      setNotification('Wrong credentials')
      setNotificationType('error')
      setTimeout(() => {
        setNotification(null)
      }, 5000)
    }

  }

  const hook = () => {
    noteService
      .getAll()
      .then(initialNotes => {
        setNotes(initialNotes)
      })
  }

  useEffect(hook, [])

  useEffect(() => {
    const loggedUserJSON = window.localStorage.getItem('loggedNoteappUser')
    if (loggedUserJSON) {
      const user = JSON.parse(loggedUserJSON)
      setUser(user)
      noteService.setToken(user.token)
    }
  }, [])

  console.log('render', notes.length, 'notes')

  const notesToShow = showAll
    ? notes
    : notes.filter(note => note.important)

  const noteFormRef = useRef()

  // passing addNote service handler as props to the NoteForm component
  // it will then be able to call it from inside its component definition
  const noteForm = () => (
    <Togglable buttonLabel='new note' ref={noteFormRef}>
      <NoteForm createNote={addNote} />
    </Togglable>
  )

  const addNote = async (noteObject) => {
    noteFormRef.current.toggleVisibility()

    try{
      const returnedNote = await noteService
        .create(noteObject)

      setNotes(notes.concat(returnedNote))
      setNotification("new note added")
      setNotificationType('success')
      setTimeout(() => {
        setNotification(null)
        setNotificationType(null)
      }, 5000)

    } catch(error){
      console.log("error creating a note", error)
      setNotification(
        `error creating note`
      )
      setNotificationType('error')
      setTimeout(() => {
        setNotification(null)
        setNotificationType(null)
      }, 5000)
    }
    // noteService
    //   .create(noteObject)
    //   .then(returnedNote => {
    //     setNotes(notes.concat(returnedNote))
    //   })
    //   .catch(error=> {
    //     setNotification(
    //       `error creating note`
    //     )
    //     setNotificationType('error')
    //     setTimeout(() => {
    //       setNotification(null)
    //       setNotificationType(null)
    //     }, 5000)
    //   })
      
      
  }


  const toggleImportanceOf = id => {
    const note = notes.find(n => n.id===id)
    const changedNote = { ...note, important: !note.important }

    noteService
      .update(id, changedNote)
      .then(returnedNote => {
        setNotes(notes.map(note => note.id !== id ? note : returnedNote))
      })
      .catch(error => {

        setNotification(
          `Note '${note.content} was already removed from server`
        )
        setNotificationType('error')
        setTimeout(() => {
          setNotification(null)
          setNotificationType(null)
        }, 5000)
        setNotes(notes.filter(n => n.id !== id))
      })
  }

  return (
    <div>
      <h1>My Notes</h1>
      <Notification message={notification} type={notificationType}/>

      {!user  && <Togglable buttonLabel='log in'>
        <LoginForm
          login={handleLogin}
        />
      </Togglable>}
      {user && noteForm()}

      <div>
        <button onClick={() => setShowAll(!showAll)}>
          show {showAll ? 'important' : 'all' }
        </button>
      </div>
      <ul>
        {notesToShow.map(note =>
          <Note
            key={note.id}
            note={note}
            toggleImportance={() => toggleImportanceOf(note.id)}
          />
        )}
      </ul>

      <Footer />
    </div>
  )
}

export default App
