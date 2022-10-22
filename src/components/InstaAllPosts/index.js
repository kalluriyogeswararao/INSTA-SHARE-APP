import {Component} from 'react'
import Cookies from 'js-cookie'
import Loader from 'react-loader-spinner'
import PostItem from '../PostItem'

import './index.css'

const apiStatusConstraints = {
  initial: 'INITIAL',
  success: 'SUCCESS',
  failure: 'FAILURE',
  inprogress: 'IN_PROGRESS',
}

class InstaAllPosts extends Component {
  state = {
    postsList: [],
    apiStatus: apiStatusConstraints.initial,
  }

  componentDidMount() {
    this.getUserStories()
  }

  getUserStories = async () => {
    this.setState({apiStatus: apiStatusConstraints.inprogress})
    const url = `https://apis.ccbp.in/insta-share/posts`
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
        postsList: updatedData,
        apiStatus: apiStatusConstraints.success,
      })
    } else {
      this.setState({apiStatus: apiStatusConstraints.failure})
    }
  }

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
        postsList: prevState.postsList.map(each => {
          if (postId === each.postId) {
            return {...each, isLike: true, likesCount: each.likesCount + 1}
          }
          return {...each}
        }),
      }))
    }
    if (status.message === 'Post has been disliked') {
      this.setState(prevState => ({
        postsList: prevState.postsList.map(each => {
          if (postId === each.postId) {
            return {...each, isLike: false, likesCount: each.likesCount - 1}
          }
          return {...each}
        }),
      }))
    }
  }

  onClickTryAgain = () => {
    this.getUserStories()
  }

  onRenderSuccessPageStories = () => {
    const {postsList} = this.state

    return (
      <ul className="all-posts">
        {postsList.map(eachPost => (
          <PostItem
            postDetailsData={eachPost}
            key={eachPost.postId}
            onClickLikeIcon={this.onClickLikeIcon}
          />
        ))}
      </ul>
    )
  }

  onRenderInprogress = () => (
    <div className="loader-container" testid="loader">
      <Loader type="TailSpin" color="#4094EF" height={30} width={30} />
    </div>
  )

  onRenderFailurePage = () => (
    <div className="something-container">
      <img
        src="https://www.nicepng.com/png/detail/135-1358116_error-png.png"
        alt="failure view"
        className="error-icon"
      />

      <h1 className="wrong-error">Something went wrong. Please try again</h1>
      <button
        type="button"
        className="try-again-btn"
        onClick={this.onClickTryAgain}
      >
        Try again
      </button>
    </div>
  )

  onRenderAllPosts = () => {
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
    return <div className="posts-container">{this.onRenderAllPosts()}</div>
  }
}

export default InstaAllPosts
