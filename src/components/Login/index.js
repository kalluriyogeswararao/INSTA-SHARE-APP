import {Component} from 'react'
import {Redirect} from 'react-router-dom'
import Cookies from 'js-cookie'
import './index.css'

class Login extends Component {
  state = {username: '', password: '', showErrorMsg: false, errorMsg: ''}

  onSuccessLogin = jwtToken => {
    const {history} = this.props
    Cookies.set('jwt_token', jwtToken, {expires: 30})
    history.replace('/')
  }

  onFailureLogin = errorMsg => {
    this.setState({showErrorMsg: true, errorMsg})
  }

  onSubmitForm = async event => {
    event.preventDefault()
    const {username, password} = this.state
    const UserDetails = {username, password}
    const url = `https://apis.ccbp.in/login`
    const options = {
      method: 'POST',
      body: JSON.stringify(UserDetails),
    }
    const response = await fetch(url, options)
    const data = await response.json()
    if (response.ok === true) {
      this.onSuccessLogin(data.jwt_token)
    } else {
      this.onFailureLogin(data.error_msg)
    }
  }

  onChangeUsername = event => {
    this.setState({username: event.target.value})
  }

  onChangePassword = event => {
    this.setState({password: event.target.value})
  }

  render() {
    const {username, password, showErrorMsg, errorMsg} = this.state
    const jwtToken = Cookies.get('jwt_token')
    if (jwtToken !== undefined) {
      return <Redirect to="/" />
    }
    return (
      <div className="login-container">
        <img
          src="https://res.cloudinary.com/ysdsp/image/upload/v1663996025/Layer_2_1_ywbxs4.png"
          alt="website login"
          className="website-login-image"
        />
        <form className="form-container" onSubmit={this.onSubmitForm}>
          <img
            src="https://res.cloudinary.com/ysdsp/image/upload/v1663996344/logo_wlcmi9.png"
            alt="website logo"
            className="website-logo"
          />
          <h1 className="website-login-heading">Insta Share</h1>
          <div className="label-input-container">
            <label className="label" htmlFor="username">
              username
            </label>
            <input
              id="username"
              type="text"
              className="user-input"
              placeholder="Username"
              onChange={this.onChangeUsername}
              value={username}
            />
          </div>
          <div className="label-input-container">
            <label className="label" htmlFor="password">
              password
            </label>
            <input
              id="password"
              className="user-input"
              type="password"
              placeholder="Password"
              onChange={this.onChangePassword}
              value={password}
            />
          </div>
          {showErrorMsg && <p className="error-msg">{errorMsg}</p>}
          <button type="submit" className="login-button">
            Login
          </button>
        </form>
      </div>
    )
  }
}

export default Login
