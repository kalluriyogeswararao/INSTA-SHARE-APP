import {Component} from 'react'
import {Link} from 'react-router-dom'
import Cookies from 'js-cookie'
import Slider from 'react-slick'
import Loader from 'react-loader-spinner'
import {ImCross} from 'react-icons/im'
import {FaSearch} from 'react-icons/fa'
import {IoIosMenu} from 'react-icons/io'
import InstaAllPosts from '../InstaAllPosts'
import StoryItem from '../StoryItem'
import PostItem from '../PostItem'

import './index.css'

const apiStatusConstraints = {
  initial: 'INITIAL',
  success: 'SUCCESS',
  failure: 'FAILURE',
  inprogress: 'IN_PROGRESS',
}

class Home extends Component {
  state = {
    storiesList: [],
    searchList: [],
    apiStatus: apiStatusConstraints.initial,
    searchApiStatus: apiStatusConstraints.initial,
    input: '',
    result: '',
    showDetails: false,
    showSearch: false,
  }

  componentDidMount() {
    this.getUserStories()
  }

  getUserStories = async () => {
    this.setState({apiStatus: apiStatusConstraints.inprogress})
    const url = `https://apis.ccbp.in/insta-share/stories`
    const jwtToken = Cookies.get('jwt_token')
    const options = {
      method: 'GET',
      headers: {
        Authorization: `Bearer ${jwtToken}`,
      },
    }

    const response = await fetch(url, options)

    if (response.ok === true) {
      const data = await response.json()
      const updatedData = data.users_stories.map(each => ({
        storyUrl: each.story_url,
        userId: each.user_id,
        username: each.user_name,
      }))
      this.setState({
        storiesList: updatedData,
        apiStatus: apiStatusConstraints.success,
      })
    } else {
      this.setState({apiStatus: apiStatusConstraints.failure})
    }
  }

  onClickTryAgain = () => {
    this.getUserStories()
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

  onClickSearch = async () => {
    const {input} = this.state
    this.setState({
      searchApiStatus: apiStatusConstraints.inprogress,
      result: input,
    })
    const jwtToken = Cookies.get('jwt_token')
    const url = `https://apis.ccbp.in/insta-share/posts?search=${input}`
    const options = {
      method: 'GET',
      headers: {
        Authorization: `Bearer ${jwtToken}`,
      },
    }
    const response = await fetch(url, options)

    if (response.ok) {
      const data = await response.json()
      const updatedData = data.posts.map(eachPost => ({
        createdAt: eachPost.created_at,
        isLike: false,
        comments: eachPost.comments.map(eachComment => ({
          comment: eachComment.comment,
          userId: eachComment.user_id,
          username: eachComment.user_name,
        })),
        postId: eachPost.post_id,
        likesCount: eachPost.likes_count,
        profilePic: eachPost.profile_pic,
        userUserId: eachPost.user_id,
        userUsername: eachPost.user_name,
        postDetails: {
          caption: eachPost.post_details.caption,
          imageUrl: eachPost.post_details.image_url,
        },
      }))

      this.setState({
        searchList: updatedData,
        searchApiStatus: apiStatusConstraints.success,
      })
    } else {
      this.setState({searchApiStatus: apiStatusConstraints.failure})
    }
  }

  onClickTryAgainSearch = () => {
    this.onClickSearch()
  }

  onRenderSuccessPageStories = () => {
    const settings = {
      speed: 500,
      slidesToShow: 7,
      slidesToScroll: 1,
      responsive: [
        {
          breakpoint: 480,
          settings: {
            slidesToShow: 4,
            slidesToScroll: 1,
          },
        },
      ],
    }
    const {storiesList} = this.state

    return (
      <div className="all-stories">
        <ul>
          <Slider {...settings}>
            {storiesList.map(eachStory => (
              <StoryItem storyDetails={eachStory} key={eachStory.userId} />
            ))}
          </Slider>
        </ul>
      </div>
    )
  }

  onRenderInprogressStories = () => (
    <div className="loader-container" testid="loader">
      <Loader type="TailSpin" color="#4094EF" height={30} width={30} />
    </div>
  )

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
      />
      <button
        type="button"
        className="search-btn"
        onClick={this.onClickSearch}
        testid="searchIcon"
      >
        <FaSearch className="search-icon" />
      </button>
    </div>
  )

  onRenderFailurePage = () => (
    <div className="something-container">
      <img
        src="https://res.cloudinary.com/ysdsp/image/upload/v1664183855/opps_b7yfve.png"
        alt="failure view"
        className="oops-error"
      />
      <p className="wrong-error">Something went wrong. Please try again</p>
      <button
        type="button"
        className="try-again-btn"
        onClick={this.onClickTryAgain}
      >
        Try again
      </button>
    </div>
  )

  onRenderStories = () => {
    const {apiStatus} = this.state

    switch (apiStatus) {
      case apiStatusConstraints.inprogress:
        return this.onRenderInprogressStories()
      case apiStatusConstraints.success:
        return this.onRenderSuccessPageStories()
      case apiStatusConstraints.failure:
        return this.onRenderFailurePage()
      default:
        return null
    }
  }

  onClickLogout = () => {
    const {history} = this.props
    Cookies.remove('jwt_token')
    history.replace('/login')
  }

  headerDetails = () => {
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
                />
                <button
                  type="button"
                  className="search-btn"
                  onClick={this.onClickSearch}
                  testid="searchIcon"
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

  onRenderResults = () => (
    <div className="home-container">
      {this.headerDetails()}
      <div className="stories-posts-container">
        {this.onRenderStories()}
        <InstaAllPosts />
      </div>
    </div>
  )

  onRenderNoSearchResultsPage = () => (
    <div className="no-search-container">
      <img
        src="https://res.cloudinary.com/ysdsp/image/upload/v1664183855/no_search_ehszgq.png"
        alt="search not found"
        className="search-not-found"
      />
      <h1 className="search-not-found-heading">Search Not Found</h1>
      <p className="para">Try different keyword or search again</p>
    </div>
  )

  onClickLikeIcon = async data => {
    const {postId, isLike} = data
    const jwtToken = Cookies.get('jwt_token')
    const likeStatus = {
      like_status: !isLike,
    }
    const url = `https://apis.ccbp.in/insta-share/posts/${postId}/like`
    const options = {
      method: 'POST',
      headers: {
        Authorization: `Bearer ${jwtToken}`,
      },
      body: JSON.stringify(likeStatus),
    }

    const response = await fetch(url, options)
    const status = await response.json()

    if (status.message === 'Post has been liked') {
      this.setState(prevState => ({
        searchList: prevState.searchList.map(each => {
          if (postId === each.postId) {
            return {...each, isLike: true, likesCount: each.likesCount + 1}
          }
          return {...each}
        }),
      }))
    }
    if (status.message === 'Post has been disliked') {
      this.setState(prevState => ({
        searchList: prevState.searchList.map(each => {
          if (postId === each.postId) {
            return {...each, isLike: false, likesCount: each.likesCount - 1}
          }
          return {...each}
        }),
      }))
    }
  }

  onRenderPosts = () => {
    const {searchList} = this.state
    if (searchList.length > 0) {
      return (
        <div className="search-item-container">
          <h1 className="search-heading">Search Results</h1>
          <ul className="all-search-Posts">
            {searchList.map(eachPost => (
              <PostItem
                postDetailsData={eachPost}
                key={eachPost.postId}
                onClickLikeIcon={this.onClickLikeIcon}
              />
            ))}
          </ul>
        </div>
      )
    }
    return this.onRenderNoSearchResultsPage()
  }

  onRenderInprogress = () => (
    <div className="search-loader-container" testid="loader">
      <Loader type="TailSpin" color="#4094EF" height={30} width={30} />
    </div>
  )

  onRenderFailurePostsPage = () => (
    <div className="something-container">
      <img
        src="https://res.cloudinary.com/ysdsp/image/upload/v1664183855/opps_b7yfve.png"
        alt="failure view"
        className="oops-error"
      />
      <p className="wrong-error">Something went wrong. Please try again</p>
      <button
        type="button"
        className="try-again-btn"
        onClick={this.onClickTryAgainSearch}
      >
        Try again
      </button>
    </div>
  )

  onRenderAllPosts = () => {
    const {searchApiStatus} = this.state

    switch (searchApiStatus) {
      case apiStatusConstraints.inprogress:
        return this.onRenderInprogress()
      case apiStatusConstraints.success:
        return this.onRenderPosts()
      case apiStatusConstraints.failure:
        return this.onRenderFailurePostsPage()
      default:
        return null
    }
  }

  onRenderSearchDetailsPage = () => (
    <div className="home-container">
      {this.headerDetails()}
      <div>
        <div className="stories-posts-container">{this.onRenderAllPosts()}</div>
      </div>
    </div>
  )

  render() {
    const {result} = this.state
    return (
      <div>
        {result !== ''
          ? this.onRenderSearchDetailsPage()
          : this.onRenderResults()}
      </div>
    )
  }
}

export default Home
