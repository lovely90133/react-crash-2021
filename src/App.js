import { useState, useEffect } from 'react'
import { BrowserRouter as Router, Route, Routes } from 'react-router-dom'
import Header from './components/Header'
import Footer from './components/Footer'
import Tasks from './components/Tasks'
import AddTask from './components/AddTask'
import About from './components/About'

const App = () => {
  const [showAddTask, setShowAddTask] = useState(false)
  const [tasks, setTasks] = useState([])
  const [showArchived, setShowArchived] = useState(false)

  useEffect(() => {
    const getTasks = async () => {
      const tasksFromServer = await fetchTasks()
      setTasks(tasksFromServer)
    }

    getTasks()
  }, [])

  // Fetch Tasks
  const fetchTasks = async () => {
    const res = await fetch('http://localhost:5000/tasks')
    const data = await res.json()

    return data
  }

  // Fetch Task
  const fetchTask = async (id) => {
    const res = await fetch(`http://localhost:5000/tasks/${id}`)
    const data = await res.json()

    return data
  }

  // Add Task
  const addTask = async (task) => {
    const newTask = { ...task, archived: false }
    const res = await fetch('http://localhost:5000/tasks', {
      method: 'POST',
      headers: {
        'Content-type': 'application/json',
      },
      body: JSON.stringify(newTask),
    })

    const data = await res.json()

    setTasks([...tasks, data])
  }

  // Delete Task
  const deleteTask = async (id) => {
    const res = await fetch(`http://localhost:5000/tasks/${id}`, {
      method: 'DELETE',
    })
    //We should control the response status to decide if we will change the state or not.
    res.status === 200
      ? setTasks(tasks.filter((task) => task.id !== id))
      : alert('Error Deleting This Task')
  }

  // Toggle Reminder
  const toggleReminder = async (id) => {
    const taskToToggle = await fetchTask(id)
    const updTask = { ...taskToToggle, reminder: !taskToToggle.reminder }

    const res = await fetch(`http://localhost:5000/tasks/${id}`, {
      method: 'PUT',
      headers: {
        'Content-type': 'application/json',
      },
      body: JSON.stringify(updTask),
    })

    const data = await res.json()

    setTasks(
      tasks.map((task) =>
        task.id === id ? { ...task, reminder: data.reminder } : task
      )
    )
  }

  // Archive Task
  const archiveTask = async (id) => {
    const taskToArchive = await fetchTask(id)
    const updTask = { ...taskToArchive, archived: true }

    const res = await fetch(`http://localhost:5000/tasks/${id}`, {
      method: 'PUT',
      headers: {
        'Content-type': 'application/json',
      },
      body: JSON.stringify(updTask),
    })

    const data = await res.json()

    setTasks(
      tasks.map((task) =>
        task.id === id ? { ...task, archived: data.archived } : task
      )
    )
  }

  // Restore Task
  const restoreTask = async (id) => {
    const taskToRestore = await fetchTask(id)
    const updTask = { ...taskToRestore, archived: false }

    const res = await fetch(`http://localhost:5000/tasks/${id}`, {
      method: 'PUT',
      headers: {
        'Content-type': 'application/json',
      },
      body: JSON.stringify(updTask),
    })

    const data = await res.json()

    setTasks(
      tasks.map((task) =>
        task.id === id ? { ...task, archived: data.archived } : task
      )
    )
  }

  // Toggle Archive View
  const toggleArchiveView = () => {
    setShowArchived(!showArchived)
  }

  // Filter tasks based on archived status
  // Tasks without archived property are considered as not archived
  const filteredTasks = tasks.filter(task => {
    const isArchived = task.archived === true
    return showArchived ? isArchived : !isArchived
  })

  return (
    <Router>
      <div className='container'>
        <Header
          onAdd={() => setShowAddTask(!showAddTask)}
          showAdd={showAddTask}
          showArchived={showArchived}
          onToggleArchive={toggleArchiveView}
        />
        <Routes>
          <Route
            path='/'
            element={
              <>
                {!showArchived && showAddTask && <AddTask onAdd={addTask} />}
                {filteredTasks.length > 0 ? (
                  <Tasks
                    tasks={filteredTasks}
                    onDelete={deleteTask}
                    onToggle={toggleReminder}
                    onArchive={archiveTask}
                    onRestore={restoreTask}
                    showArchived={showArchived}
                  />
                ) : (
                  showArchived ? 'No Archived Tasks' : 'No Tasks To Show'
                )}
              </>
            }
          />
          <Route path='/about' element={<About />} />
        </Routes>
        <Footer />
      </div>
    </Router>
  )
}

export default App
