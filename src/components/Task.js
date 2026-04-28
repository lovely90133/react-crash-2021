import { FaTimes, FaArchive, FaUndo } from 'react-icons/fa'

const Task = ({ task, onDelete, onToggle, onArchive, onRestore, showArchived }) => {
  return (
    <div
      className={`task ${task.reminder && 'reminder'} ${task.archived && 'archived'}`}
      onDoubleClick={() => !task.archived && onToggle(task.id)}
    >
      <h3>
        {task.text}{' '}
        <div className="task-actions">
          {!showArchived ? (
            <>
              <FaArchive
                style={{ color: 'steelblue', cursor: 'pointer', marginRight: '10px' }}
                onClick={() => onArchive(task.id)}
                title="Archive"
              />
              <FaTimes
                style={{ color: 'red', cursor: 'pointer' }}
                onClick={() => onDelete(task.id)}
                title="Delete"
              />
            </>
          ) : (
            <>
              <FaUndo
                style={{ color: 'green', cursor: 'pointer', marginRight: '10px' }}
                onClick={() => onRestore(task.id)}
                title="Restore"
              />
              <FaTimes
                style={{ color: 'red', cursor: 'pointer' }}
                onClick={() => onDelete(task.id)}
                title="Delete Permanently"
              />
            </>
          )}
        </div>
      </h3>
      <p>{task.day}</p>
    </div>
  )
}

export default Task
