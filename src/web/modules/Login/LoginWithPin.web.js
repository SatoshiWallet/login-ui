import React, { Component } from 'react'
import { connect } from 'react-redux'
import { withRouter } from 'react-router'
import t from 'lib/web/LocaleStrings'
import { sprintf } from 'sprintf-js'

import { openLogin, loginPIN, openUserList, closeUserList } from './Login.action'
import { loginWithPin } from './Login.middleware'
import CachedUsers from '../CachedUsers/CachedUsers.web'
import { closeLoading } from '../Loader/Loader.action'

import { Button } from 'react-toolbox/lib/button'
import Input from 'react-toolbox/lib/input'
import styles from './LoginWithPin.style.scss'
import neutral from 'theme/neutralButtonWithBlueText.scss'

class LoginWithPin extends Component {
  _handleSubmit = () => {
    const callback = (error, account) => {
      if (!error) {
        if (window.parent.loginCallback) {
          return window.parent.loginCallback(null, account)
        }
        if (!window.parent.loginCallback) {
          this.props.dispatch(closeLoading())
          return this.props.router.push('/home')
        }
      } else {
        this._handleChangePin('')
        return this.refs.pinInput.getWrappedInstance().focus()
      }
    }
    this.props.dispatch(
      loginWithPin(
        this.props.user,
        this.props.pin,
        callback
      )
    )
    this.refs.pinInput.getWrappedInstance().blur()
  }

  _handleChangePin = (pin) => {
    if (pin.length > 4) {
      pin = pin.substr(0, 4)
    }
    if (/^\d+$/.test(pin) || pin.length === 0) {
      this.props.dispatch(
        loginPIN(pin)
      )
    }
    if (pin.length > 3) {
      setTimeout(this._handleSubmit, 200)
    }
  }
  _showCachedUsers = () => {
    this.props.dispatch(openUserList())
    this.refs.pinInput.getWrappedInstance().blur()
  }
  _hideCachedUsers = () => {
    this.props.dispatch(closeUserList())
    this.refs.pinInput.getWrappedInstance().focus()
  }
  _gotoPasswordInput = (pin) => {
    this.props.dispatch(closeUserList())
    this.props.dispatch(openLogin())
  }
  pinStyle = () => {
    if (this.props.pin.length > 0) {
      return {textAlign: 'center', fontSize: '70px', height: '80px'}
    } else {
      return {textAlign: 'center', fontSize: '35px', height: '80px'}
    }
  }

  render () {
    const usersDropdown = () => {
      return (
        <div className={styles.usernameContainer}>
          <a className={styles.username} tabIndex={1} onFocus={this._showCachedUsers} onBlur={this._hideCachedUsers}>
            { this.props.user ? this.props.user : 'No User Selected' }
          </a>
        </div>
      )
    }

    return (
      <div className={styles.container}>
        <CachedUsers component={usersDropdown()} area='pinLogin' containerClassName={styles.cachedUsers} userListClassName={styles.userListClassName} />
        <div className={styles.inputDiv}>
          <Input
            ref='pinInput'
            name='pinInput'
            type='password'
            placeholder={t('fragment_landing_enter_pin')}
            style={this.pinStyle()}
            value={this.props.pin}
            onChange={this._handleChangePin}
            autoCorrect={false}
            autoFocus
            disabled={this.props.loginPinWait > 0}
          />
        </div>
        <span className={styles.loginTimeout}>{this.props.loginPinWait ? sprintf(t('server_error_invalid_pin_wait'), this.props.loginPinWait) : ''}</span>
        <Button theme={neutral} className={styles.exitPin} onClick={this._gotoPasswordInput}>
          { t('fragment_landing_switch_user') }
        </Button>
      </div>
    )
  }
}

const LoginWithPinWithRouter = withRouter(LoginWithPin)
const LoginWithPinWithRedux = connect(state => ({

  pin: state.login.pin,
  user: state.cachedUsers.selectedUserToLogin,
  showCachedUsers: state.login.showCachedUsers,
  loginPinWait: state.login.loginPinWait,
  currentPasswordCountdown: false

}))(LoginWithPinWithRouter)

export default LoginWithPinWithRedux
