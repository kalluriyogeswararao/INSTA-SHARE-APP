import {Component} from 'react'
import {withRouter, Link} from 'react-router-dom'
import Cookies from 'js-cookie'
import {FaSearch} from 'react-icons/fa'
import {IoIosMenu} from 'react-icons/io'
import {ImCross} from 'react-icons/im'

import './index.css'

class Header extends Component {
  state = {
    showDetails: false,
    showSearch: false,
    input: '',
  }

  onClickLogout = () => {
    const {history} = this.props
    Cookies.remove('jwt_token')
    history.replace('/login')
  }

  onChangeInput = event => {
    this.setState({input: event.target.value})
  }

  onClickMenu = () => {
    this.setState({showDetails: true, showSearch: false})
  }

  onClickCloseMenu = () => {
    this.setState({showDetails: false})
  }

  onShowSearch = () => {
    this.setState({showSearch: true, showDetails: false})
  }

  onClickRedirect = () => {
    const {history} = this.props
    history.push('/')
  }

  onRenderNavDetails = () => (
    <div className="small-screen-details">
      <Link to="/">
        <button type="button" className="nav-home-heading">
          Home
        </button>
      </Link>
      <button
        type="button"
        className="nav-home-heading"
        onClick={this.onShowSearch}
      >
        Search
      </button>
      <Link to="/my-profile">
        <button type="button" className="nav-profile-heading">
          Profile
        </button>
      </Link>
      <button type="button" className="logout-btn" onClick={this.onClickLogout}>
        Logout
      </button>
      <button
        type="button"
        className="close-btn"
        onClick={this.onClickCloseMenu}
      >
        <ImCross />
      </button>
    </div>
  )

  onShowSearchBar = () => (
    <div className="popup-search-container">
      <input
        type="search"
        placeholder="Search Caption"
        className="search-input"
        onChange={this.onChangeInput}
        onClick={this.onClickRedirect}
      />
      <button type="button" className="search-btn" onClick={this.onClickSearch}>
        <FaSearch className="search-icon" />
      </button>
    </div>
  )

  onClickSearch = () => {
    const {onSearchPosts} = this.props
    const {input} = this.state
    onSearchPosts(input)
  }

  render() {
    const {showDetails, showSearch, input} = this.state
    return (
      <>
        <nav className="navbar-container">
          <div className="header-container">
            <div className="logo-container">
              <Link to="/">
                <img
                  src="https://res.cloudinary.com/ysdsp/image/upload/v1663996344/logo_wlcmi9.png"
                  alt="website logo"
                  className="website-header-logo"
                />
              </Link>
              <h1 className="website-header-title">Insta Share</h1>
            </div>
            <div className="details-container">
              <div className="search-container">
                <input
                  type="search"
                  placeholder="Search Caption"
                  className="search-input"
                  onChange={this.onChangeInput}
                  value={input}
                  onClick={this.onClickRedirect}
                />
                <button
                  type="button"
                  className="search-btn"
                  onClick={this.onClickSearch}
                >
                  <FaSearch className="search-icon" />
                </button>
              </div>
              <Link to="/">
                <button type="button" className="nav-home-heading">
                  Home
                </button>
              </Link>
              <Link to="/my-profile">
                <button type="button" className="nav-profile-heading">
                  Profile
                </button>
              </Link>
              <button
                type="button"
                className="logout-btn"
                onClick={this.onClickLogout}
              >
                Logout
              </button>
            </div>
            <button
              type="button"
              className="menu-button"
              onClick={this.onClickMenu}
            >
              <IoIosMenu className="menu-icon" />
            </button>
          </div>
        </nav>
        {showDetails && this.onRenderNavDetails()}
        {showSearch && this.onShowSearchBar()}
      </>
    )
  }
}

export default withRouter(Header)
