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

class SearchResults extends Component {
  state = {
    searchList: [],
    apiStatus: apiStatusConstraints.initial,
  }

  componentDidMount() {
    this.onGetSearchPosts()
  }

  onGetSearchPosts = async () => {
    this.setState({apiStatus: apiStatusConstraints.inprogress})
    const {searchData} = this.props
    const jwtToken = Cookies.get('jwt_token')
    const url = `https://apis.ccbp.in/insta-share/posts?search=${searchData}`
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
        apiStatus: apiStatusConstraints.success,
      })
    } else {
      this.setState({apiStatus: apiStatusConstraints.failure})
    }
  }

  onClickSearch = () => {
    this.onGetSearchPosts()
  }

  onClickTryAgain = () => {
    this.onGetSearchPosts()
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

  onRenderNoSearchResultsPage = () => (
    <div className="no-search-container">
      <img
        src="https://res.cloudinary.com/ysdsp/image/upload/v1664183855/no_search_ehszgq.png"
        alt="search not found"
        className="search-not-found"
      />
      <h1 className="search-not-found-heading">Search Not Found</h1>
      <p className="para">Try different key word or search again</p>
    </div>
  )

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
    <div className="search-loader-container">
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

  onRenderAllPosts = () => {
    const {apiStatus} = this.state

    switch (apiStatus) {
      case apiStatusConstraints.inprogress:
        return this.onRenderInprogress()
      case apiStatusConstraints.success:
        return this.onRenderPosts()
      case apiStatusConstraints.failure:
        return this.onRenderFailurePage()
      default:
        return null
    }
  }

  render() {
    return (
      <div className="home-container">
        <div className="stories-posts-container">{this.onRenderAllPosts()}</div>
      </div>
    )
  }
}

export default SearchResults
