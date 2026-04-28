import Task from './Task'

const Tasks = ({ tasks, onDelete, onToggle, onArchive, onRestore, showArchived }) => {
  return (
    <>
      {tasks.map((task, index) => (
        <Task 
          key={index} 
          task={task} 
          onDelete={onDelete} 
          onToggle={onToggle}
          onArchive={onArchive}
          onRestore={onRestore}
          showArchived={showArchived}
        />
      ))}
    </>
  )
}

export default Tasks
