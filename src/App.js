import { useState, useEffect } from 'react'
import { BrowserRouter as Router, Route, Routes } from 'react-router-dom'
import Header from './components/Header'
import Footer from './components/Footer'
import Tasks from './components/Tasks'
import AddTask from './components/AddTask'
import About from './components/About'
import { filterTasks, sortTasksByReminderTime } from './utils/dateUtils'

const App = () => {
  const [showAddTask, setShowAddTask] = useState(false)
  const [tasks, setTasks] = useState([])
  const [filter, setFilter] = useState('all')
  const [sortBy, setSortBy] = useState('default')

  useEffect(() => {
    const getTasks = async () => {
      const tasksFromServer = await fetchTasks()
      setTasks(tasksFromServer)
    }

    getTasks()
  }, [])

  // Fetch Tasks
  const fetchTasks = async () => {
    const res = await fetch('http://localhost:5001/tasks')
    const data = await res.json()

    return data
  }

  // Fetch Task
  const fetchTask = async (id) => {
    const res = await fetch(`http://localhost:5001/tasks/${id}`)
    const data = await res.json()

    return data
  }

  // Add Task
  const addTask = async (task) => {
    const res = await fetch('http://localhost:5001/tasks', {
      method: 'POST',
      headers: {
        'Content-type': 'application/json',
      },
      body: JSON.stringify(task),
    })

    const data = await res.json()

    setTasks([...tasks, data])

    // const id = Math.floor(Math.random() * 10000) + 1
    // const newTask = { id, ...task }
    // setTasks([...tasks, newTask])
  }

  // Delete Task
  const deleteTask = async (id) => {
    const res = await fetch(`http://localhost:5001/tasks/${id}`, {
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

    const res = await fetch(`http://localhost:5001/tasks/${id}`, {
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

  const getProcessedTasks = () => {
    let processed = filterTasks(tasks, filter)
    if (sortBy === 'reminder') {
      processed = sortTasksByReminderTime(processed)
    }
    return processed
  }

  const processedTasks = getProcessedTasks()

  return (
    <Router>
      <div className='container'>
        <Header
          onAdd={() => setShowAddTask(!showAddTask)}
          showAdd={showAddTask}
        />
        <Routes>
          <Route
            path='/'
            element={
              <>
                {showAddTask && <AddTask onAdd={addTask} />}
                <div className='filter-sort-controls'>
                  <div className='filter-controls'>
                    <span>筛选：</span>
                    <button
                      className={`filter-btn ${filter === 'all' ? 'active' : ''}`}
                      onClick={() => setFilter('all')}
                    >
                      全部
                    </button>
                    <button
                      className={`filter-btn ${filter === 'today' ? 'active' : ''}`}
                      onClick={() => setFilter('today')}
                    >
                      今天
                    </button>
                    <button
                      className={`filter-btn ${filter === 'overdue' ? 'active' : ''}`}
                      onClick={() => setFilter('overdue')}
                    >
                      已过期
                    </button>
                  </div>
                  <div className='sort-controls'>
                    <span>排序：</span>
                    <button
                      className={`sort-btn ${sortBy === 'default' ? 'active' : ''}`}
                      onClick={() => setSortBy('default')}
                    >
                      默认
                    </button>
                    <button
                      className={`sort-btn ${sortBy === 'reminder' ? 'active' : ''}`}
                      onClick={() => setSortBy('reminder')}
                    >
                      提醒时间
                    </button>
                  </div>
                </div>
                {processedTasks.length > 0 ? (
                  <Tasks
                    tasks={processedTasks}
                    onDelete={deleteTask}
                    onToggle={toggleReminder}
                  />
                ) : (
                  <p className='no-tasks'>
                    {filter === 'today' ? '今天没有任务' : 
                     filter === 'overdue' ? '没有已过期的任务' : 
                     'No Tasks To Show'}
                  </p>
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
