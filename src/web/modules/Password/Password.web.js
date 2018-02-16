import React, { Component } from 'react'
import { connect } from 'react-redux'
import { withRouter } from 'react-router'
import Button from 'react-toolbox/lib/button'
import Input from 'react-toolbox/lib/input'
import FontIcon from 'react-toolbox/lib/font_icon'
import t from '../../lib/web/LocaleStrings'

import { validate } from './PasswordValidation/PasswordValidation.middleware'
import { checkPassword, skipPassword } from './Password.middleware'
import { changeSignupPage } from '../Signup/Signup.action'

import neutralButtonWithBlueText from 'theme/neutralButtonWithBlueText.scss'

import {
  passwordNotificationShow,
  showPassword,
  hidePassword,
  changePasswordValue,
  changePasswordRepeatValue
} from './Password.action'

import styles from './Password.webStyle'

class Password extends Component {
  _handleSubmit = () => {
    const callback = () => this.props.router.push('/review')
    this.props.dispatch(
      checkPassword(
        this.props.password,
        this.props.passwordRepeat,
        this.props.validation,
        this.props.username,
        this.props.pin,
        callback
      )
    )
  }
  _handleSubmitSkipPassword = () => {
    const callback = () => this.props.router.push('/review')
    this.props.dispatch(
      skipPassword(
        this.props.username,
        this.props.pin,
        callback
      )
    )
  }
  _handleBack = () => {
    if (this.props.loader.loading === false) {
      return this.props.dispatch(changeSignupPage('pin'))
    }
  }
  _handlePasswordNotification = () => {
    this.refs.signupPassword.getWrappedInstance().blur()
    this.refs.passwordRepeat.getWrappedInstance().blur()
    this.props.dispatch(passwordNotificationShow())
  }

  passwordKeyPressed = (e) => {
    if (e.charCode === 13) {
      this.refs.passwordRepeat.getWrappedInstance().focus()
    }
  }
  _handleOnChangePassword = (password) => {
    this.props.dispatch(changePasswordValue(password))
    this.props.dispatch(validate(password))
  }

  _handleOnChangePasswordRepeat = (passwordRepeat) => {
    this.props.dispatch(changePasswordRepeatValue(passwordRepeat))
  }

  toggleRevealPassword = (e) => {
    if (this.props.inputState) {
      return this.props.dispatch(hidePassword())
    } else {
      return this.props.dispatch(showPassword())
    }
  }

  _handleKeyEnter = (e) => {
    if (e.nativeEvent.charCode === 13) {
      return this._handleSubmit()
    }
  }

  render () {
    return (
      <div>
        <div className={styles.header}>
          <div className={styles.title}>
            <h4>{t('activity_signup_password_label')}</h4>
          </div>
        </div>
        <div className={styles.section}>
          <div>
            <h5>{t('activity_signup_password_requirements')}</h5>
            <br />
            <p className={styles.passwordRequirement}>
              <FontIcon value={this.props.validation.upperCaseChar ? 'done' : 'clear'} className={this.props.validation.upperCaseChar ? styles.green : styles.red} />
              { t('password_rule_no_uppercase') }
            </p>
            <p className={styles.passwordRequirement}>
              <FontIcon value={this.props.validation.lowerCaseChar ? 'done' : 'clear'} className={this.props.validation.lowerCaseChar ? styles.green : styles.red} />
              { t('password_rule_no_lowercase') }
            </p>
            <p className={styles.passwordRequirement}>
              <FontIcon value={this.props.validation.number ? 'done' : 'clear'} className={this.props.validation.number ? styles.green : styles.red} />
              { t('password_rule_no_number') }
            </p>
            <p className={styles.passwordRequirement}>
              <FontIcon value={this.props.validation.characterLength ? 'done' : 'clear'} className={this.props.validation.characterLength ? styles.green : styles.red} />
              { t('password_rule_too_short') }
            </p>
          </div>
          <br />
          <p>{t('fragment_setup_password_text')}</p>
        </div>
        <div className={styles.section}>
          <div className={styles.inputPasswordFieldDiv}>
            <div style={{flexGrow: 1}}>
              <Input
                ref='signupPassword'
                autoFocus
                type={this.props.inputState ? 'text' : 'password'}
                name='password'
                onKeyPress={this.passwordKeyPressed}
                onChange={this._handleOnChangePassword}
                value={this.props.password}
                label='Password'
              />
            </div>
            <FontIcon value={this.props.inputState ? 'visibility' : 'visibility_off'} onClick={this.toggleRevealPassword} className={styles.inputPasswordFieldImg} />
          </div>
          <Input
            type={this.props.inputState ? 'text' : 'password'}
            ref='passwordRepeat'
            name='passwordRepeat'
            onChange={this._handleOnChangePasswordRepeat}
            value={this.props.passwordRepeat}
            onKeyPress={this._handleKeyEnter.bind(this)}
            label='Re-enter Password'
          />
        </div>

        <div className={styles.buttonSection}>
          <Button theme={neutralButtonWithBlueText} onClick={this._handleBack}>{t('string_capitalize_back')}</Button>
          <Button type='button' raised primary className={styles.next} onClick={this._handleSubmit}>{t('string_next')}</Button>
        </div>
      </div>

    )
  }
}

const PasswordWithRouter = withRouter(Password)
const PasswordWithRedux = connect(state => ({

  inputState: state.password.inputState,
  password: state.password.password,
  passwordRepeat: state.password.passwordRepeat,
  validation: state.password.validation,
  username: state.username,
  pin: state.pin,
  loader: state.loader

}))(PasswordWithRouter)

export default PasswordWithRedux
