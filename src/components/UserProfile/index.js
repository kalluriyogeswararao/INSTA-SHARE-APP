import {Component} from 'react'
import Cookies from 'js-cookie'
import Loader from 'react-loader-spinner'
import {BsGrid3X3} from 'react-icons/bs'
import {BiCamera} from 'react-icons/bi'
import Header from '../Header'

import './index.css'

const apiStatusConstraints = {
  initial: 'INITIAL',
  success: 'SUCCESS',
  failure: 'FAILURE',
  inprogress: 'IN_PROGRESS',
}

class MyProfile extends Component {
  state = {myProfileDetails: [], apiStatus: apiStatusConstraints.initial}

  componentDidMount() {
    this.getUserStories()
  }

  getUserStories = async () => {
    const {match} = this.props
    const {params} = match
    const {id} = params

    this.setState({apiStatus: apiStatusConstraints.inprogress})
    const url = `https://apis.ccbp.in/insta-share/users/${id}`
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

      const updatedData = {
        followersCount: data.user_details.followers_count,
        followingCount: data.user_details.following_count,
        id: data.user_details.id,
        postsCount: data.user_details.posts_count,
        profilePic: data.user_details.profile_pic,
        userBio: data.user_details.user_bio,
        userId: data.user_details.user_id,
        username: data.user_details.user_name,
        posts: data.user_details.posts,
        stories: data.user_details.stories,
      }

      this.setState({
        apiStatus: apiStatusConstraints.success,
        myProfileDetails: updatedData,
      })
    } else {
      this.setState({apiStatus: apiStatusConstraints.failure})
    }
  }

  onClickTryAgain = () => {
    this.getUserStories()
  }

  onRenderPosts = posts => (
    <ul className="all-posts-list">
      {posts.map(post => (
        <li className="post-item" key={post.id}>
          <img src={post.image} alt="user post" className="post" />
        </li>
      ))}
    </ul>
  )

  onRenderEmpty = () => (
    <div>
      <BiCamera className="camera-icon" />
      <h1 className="no-posts">No Posts</h1>
    </div>
  )

  onRenderAllPosts = () => {
    const {myProfileDetails} = this.state
    const {posts} = myProfileDetails

    if (posts.length > 0) {
      return this.onRenderPosts(posts)
    }
    return this.onRenderEmpty()
  }

  onRenderSuccessPageStories = () => {
    const {myProfileDetails} = this.state
    const {
      profilePic,
      username,
      followersCount,
      followingCount,
      postsCount,
      userId,
      userBio,
      stories,
    } = myProfileDetails

    return (
      <div className="all">
        <div className="user-profile-container">
          <img
            src={profilePic}
            alt="user profile"
            className="user-my-profile-image"
          />
          <div className="user-profile-details-container">
            <h1 className="user-profile-username">{username}</h1>
            <div className="user-posts-followers-container">
              <p className="user-posts">
                {postsCount} <span className="user-span">posts</span>
              </p>
              <p className="user-posts">
                {followersCount} <span className="span">followers</span>
              </p>
              <p className="user-posts">
                {followingCount} <span className="user-span"> following</span>
              </p>
            </div>
            <p className="user-user-id">{userId}</p>
            <p>{userBio}</p>
          </div>
        </div>
        <ul className="user-my-profile-stories">
          {stories.map(item => (
            <li key={item.id} className="user-story">
              <img src={item.image} alt="user story" className="user-image" />
            </li>
          ))}
        </ul>
        <hr className="user-hr-line" />
        <div className="user-grid-icon-container">
          <BsGrid3X3 className="user-grid-icon" />
          <h1 className="user-post-heading">Posts</h1>
        </div>

        {this.onRenderAllPosts()}
      </div>
    )
  }

  onRenderInprogress = () => (
    <div className="user-my-profile-loader-container" testid="loader">
      <Loader type="TailSpin" color="#4094EF" height={30} width={30} />
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
        return this.onRenderInprogress()
      case apiStatusConstraints.success:
        return this.onRenderSuccessPageStories()
      case apiStatusConstraints.failure:
        return this.onRenderFailurePage()
      default:
        return null
    }
  }

  render() {
    return (
      <div className="user-home-container">
        <Header />
        <div className="user-posts-container">{this.onRenderStories()}</div>
      </div>
    )
  }
}

export default MyProfile
