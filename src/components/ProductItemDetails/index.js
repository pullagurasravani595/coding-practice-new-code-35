// Write your code here
import {Component} from 'react'
import Loader from 'react-loader-spinner'
import Cookie from 'js-cookie'
import {BsPlusSquare, BsDashSquare} from 'react-icons/bs'
import Header from '../Header'
import SimilarProductItem from '../SimilarProductItem'
import 'react-loader-spinner/dist/loader/css/react-spinner-loader.css'
import './index.css'

const apiStatusCondition = {
  success: 'SUCCESS',
  failure: 'FAILURE',
  inProgress: 'IN_PROGRESS',
  initial: 'INITIAL',
}

class ProductItemDetails extends Component {
  state = {productItemList: [], apiStatus: apiStatusCondition.initial, count: 1}

  componentDidMount() {
    this.getProductItemResponse()
  }

  getProductItemResponse = async () => {
    this.setState({
      apiStatus: apiStatusCondition.inProgress,
    })
    const {match} = this.props
    const {params} = match
    const {id} = params
    const apiUrl = `https://apis.ccbp.in/products/${id}`
    const jwtToken = Cookie.get('jwt_token')
    const options = {
      method: 'GET',
      headers: {
        Authorization: `Bearer ${jwtToken}`,
      },
    }
    const response = await fetch(apiUrl, options)

    if (response.ok === true) {
      const responseData = await response.json()
      const updateData = {
        id: responseData.id,
        imageUrl: responseData.image_url,
        title: responseData.title,
        price: responseData.price,
        description: responseData.description,
        brand: responseData.brand,
        totalReviews: responseData.total_reviews,
        rating: responseData.rating,
        availability: responseData.availability,
        similarProducts: responseData.similar_products.map(eachItem => ({
          id: eachItem.id,
          imageUrl: eachItem.image_url,
          title: eachItem.title,
          style: eachItem.style,
          price: eachItem.price,
          description: eachItem.description,
          brand: eachItem.brand,
          totalReviews: eachItem.total_reviews,
          rating: eachItem.rating,
          availability: eachItem.availability,
        })),
      }
      this.setState({
        productItemList: updateData,
        apiStatus: apiStatusCondition.success,
      })
    } else if (response.status === 401) {
      this.setState({apiStatus: apiStatusCondition.failure})
    }
  }

  onClickPlusBtn = () => {
    this.setState(prevState => ({count: prevState.count + 1}))
  }

  onClickMinusBtn = () => {
    this.setState(prevState => ({count: prevState.count - 1}))
  }

  onClickContinueBtn = () => {
      const {history} = this.props
      history.push("/products")
  }

  renderProductItemDisplay = () => {
    const {productItemList, count} = this.state
    const {
      imageUrl,
      title,
      price,
      rating,
      totalReviews,
      description,
      availability,
      brand,
    } = productItemList

    return (
      <div className="item-details-container">
        <div className="product-img-container">
          <img src={imageUrl} alt="product" className="product-img" />
        </div>
        <div className="item-description-container">
          <h1 className="item-heading">{title}</h1>
          <p className="price">Rs {price}</p>
          <div className="rating-review">
            <div className="rating-container-product">
              <p className="rating">{rating}</p>
              <img
                src="https://assets.ccbp.in/frontend/react-js/star-img.png"
                alt="star"
                className="star-icon"
              />
            </div>
            <p className="review">{totalReviews} Reviews</p>
          </div>
          <p className="description">{description}</p>
          <p className="available">
            <span className="span-element">Available: </span>
            {availability}
          </p>
          <p className="available">
            <span className="span-element">Brand: </span>
            {brand}
          </p>
          <hr className="line" />
          <div className="button-container">
            <button
              type="button"
              className="button-btn"
              onClick={this.onClickPlusBtn}
            >
              <BsPlusSquare />
            </button>
            <p>{count}</p>
            <button
              type="button"
              className="button-btn"
              onClick={this.onClickMinusBtn}
            >
              <BsDashSquare />
            </button>
          </div>
          <button type="button" className="button">
            ADD TO CART
          </button>
        </div>
      </div>
    )
  }

  renderSimilarProducts = () => {
    const {productItemList} = this.state
    const {similarProducts} = productItemList

    return (
      <div className="similar-products-container-view">
        <h1 className="heading">Similar Products</h1>
        <ul className="similar-products-item-container">
          {similarProducts.map(eachProduct => (
            <SimilarProductItem productItem={eachProduct} />
          ))}
        </ul>
      </div>
    )
  }

  renderLoaderView = () => (
    <div data-testid="loader">
      <Loader type="ThreeDots" color="#0b69ff" height={80} width={80} />
    </div>
  )

  renderFailureViewMode = () => (
    <div className="failure-container">
      <img
        src="https://assets.ccbp.in/frontend/react-js/nxt-trendz-error-view-img.png"
        alt="error view"
        className="error-img"
      />
      <h1>Product Not Found</h1>
      <button className="continue-btn" type="button" onClick={this.onClickContinueBtn}>
        Continue Shopping
      </button>
    </div>
  )

  renderSuccessView = () => (
    <div className="main-container">
      <div>{this.renderProductItemDisplay()}</div>
      <div>{this.renderSimilarProducts()}</div>
    </div>
  )

  renderProductItemDisplayViewMode = () => {
    const {apiStatus} = this.state

    switch (apiStatus) {
      case apiStatusCondition.success:
        return this.renderSuccessView()
      case apiStatusCondition.failure:
        return this.renderFailureViewMode()
      case apiStatusCondition.inProgress:
        return this.renderLoaderView()
      default:
        return null
    }
  }

  render() {
    return (
      <div>
        <Header />
        {this.renderProductItemDisplayViewMode()}
      </div>
    )
  }
}

export default ProductItemDetails
