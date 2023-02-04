import {Redirect} from 'react-router-dom'
import Cookies from 'js-cookie'
import {Component} from 'react'
import './index.css'

class Login extends Component {
  state = {userId: '', pin: '', showErrorMsg: false, errMsg: ''}

  onChangeUserId = event => {
    this.setState({userId: event.target.value})
  }

  onChangePin = event => {
    this.setState({pin: event.target.value})
  }

  onSubmitSuccess = jwtToken => {
    Cookies.set('jwt_token', jwtToken, {
      expires: 30,
    })

    const {history} = this.props
    history.replace('/')
  }

  onSubmitFailure = errMsg => {
    this.setState({showErrorMsg: true, errMsg})
  }

  onSubmitLoginForm = async event => {
    event.preventDefault()
    const {userId, pin} = this.state

    const userDetails = {
      userId: parseInt(userId),
      pin: parseInt(pin),
    }

    const url = 'https://apis.ccbp.in/ebank/login'
    const options = {
      method: 'POST',
      body: JSON.stringify(userDetails),
    }

    const response = await fetch(url, options)
    const data = await response.json()
    console.log(data)
    if (response.ok === true) {
      this.onSubmitSuccess(data.jwt_token)
    } else {
      this.onSubmitFailure(data.error_msg)
    }
  }

  render() {
    const {userId, pin, showErrorMsg, errMsg} = this.state
    const jwtToken = Cookies.get('jwt_token')
    if (jwtToken !== undefined) {
      return <Redirect to="/" />
    }
    return (
      <div className="login-container">
        <div className="login-card-container">
          <div className="login-image-container">
            <img
              src="https://assets.ccbp.in/frontend/react-js/ebank-login-img.png"
              alt="website login"
              className="login-image"
            />
          </div>
          <form
            className="login-input-container"
            onSubmit={this.onSubmitLoginForm}
          >
            <h1 className="login-head">Welcome Back!</h1>
            <div className="label-container">
              <label htmlFor="user-id" className="label-name">
                User ID
              </label>
              <input
                type="text"
                placeholder="Enter User ID"
                id="user-id"
                className="user-input"
                value={userId}
                onChange={this.onChangeUserId}
              />
            </div>
            <div className="label-container">
              <label htmlFor="pin" className="label-name">
                PIN
              </label>
              <input
                type="password"
                placeholder="Enter PIN"
                id="pin"
                className="user-input"
                value={pin}
                onChange={this.onChangePin}
              />
            </div>
            <button type="submit" className="login-button">
              Login
            </button>
            {showErrorMsg && <p className="error-message">{errMsg}</p>}
          </form>
        </div>
      </div>
    )
  }
}

export default Login
