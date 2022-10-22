import {withRouter} from 'react-router-dom'
import './index.css'

const NotFound = props => {
  const {history} = props
  const onClickHomePage = () => {
    history.replace('/')
  }

  return (
    <div className="not-found-container">
      <img
        src="https://res.cloudinary.com/ysdsp/image/upload/v1664183855/notfound_isyx2u.png"
        alt="page not found"
        className="not-found-image"
      />
      <h1 className="not-found-heading">Page Not Found</h1>
      <p className="error-para">
        we are sorry, the page you requested could not be found.Please go back
        to the homepage.
      </p>
      <button
        type="button"
        className="redirect-home-btn"
        onClick={onClickHomePage}
      >
        Home Page
      </button>
    </div>
  )
}

export default withRouter(NotFound)
