import PropTypes from 'prop-types'
import { useLocation } from 'react-router-dom'
import Button from './Button'

const Header = ({ title, onAdd, showAdd, showArchived, onToggleArchive }) => {
  const location = useLocation()

  return (
    <header className='header'>
      <h1>{title}</h1>
      {location.pathname === '/' && (
        <div className='header-buttons'>
          <Button
            color={showArchived ? 'steelblue' : 'blue'}
            text={showArchived ? 'Active' : 'Archived'}
            onClick={onToggleArchive}
          />
          {!showArchived && (
            <Button
              color={showAdd ? 'red' : 'green'}
              text={showAdd ? 'Close' : 'Add'}
              onClick={onAdd}
            />
          )}
        </div>
      )}
    </header>
  )
}

Header.defaultProps = {
  title: 'Task Tracker',
}

Header.propTypes = {
  title: PropTypes.string.isRequired,
}

// CSS in JS
// const headingStyle = {
//   color: 'red',
//   backgroundColor: 'black',
// }

export default Header
