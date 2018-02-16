import React, { Component } from 'react'
import { connect } from 'react-redux'
import { withRouter } from 'react-router'
import t from '../../lib/web/LocaleStrings'

import Button from 'react-toolbox/lib/button'
import Dialog from 'react-toolbox/lib/dialog'

import { hidePasswordRecoveryFinishModal } from './PasswordRecovery.action'

import styles from '../ErrorModal/ErrorModal.webStyle'

class PasswordRecoverySuccess extends Component {
  _handleFinish = () => {
    const account = this.props.user
    if (window.parent.loginCallback) {
      return window.parent.loginCallback(null, account)
    }
    if (window.parent.exitCallback) {
      return window.parent.exitCallback(null)
    }
    if (!window.parent.loginCallback && !window.parent.exitCallback) {
      this.props.dispatch(hidePasswordRecoveryFinishModal())
      return this.props.router.push('/home')
    }
  }

  render () {
    return (
      <div>
        <Dialog
          className={styles.dialogZIndex}
          active={this.props.visible}
        >
          <div className={styles.container}>
            <p>{t('recovery_setup_successful')}</p>
            <br />
            <Button raised primary className={styles.button} type='button' onClick={this._handleFinish}>{t('string_ok')}</Button>
          </div>
        </Dialog>
      </div>
    )
  }
}

const PasswordRecoverySuccessWithRouter = withRouter(PasswordRecoverySuccess)
const PasswordRecoveryWithRedux = connect(state => ({

  visible: state.passwordRecovery.viewFinishModal,
  user: state.user,
  details: state.reviewDetails.details

}))(PasswordRecoverySuccessWithRouter)

export default PasswordRecoveryWithRedux
