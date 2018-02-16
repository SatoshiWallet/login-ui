import { openErrorModal } from '../ErrorModal/ErrorModal.action'
import { openLoading, closeLoading } from '../Loader/Loader.action'
import { userLogin, requestEdgeLogin, enablePinTimeout, disablePinTimeout, refreshPinTimeout, enablePasswordTimeout, disablePasswordTimeout, refreshPasswordTimeout } from './Login.action'
import { showContainerNotification } from '../Container.action.js'
import { selectUserToLogin } from '../CachedUsers/CachedUsers.action'

export const loginWithPassword = (username, password, callback) => {
  return (dispatch, getState, imports) => {
    const t = imports.t
    const abcContext = imports.abcContext
    const localStorage = global ? global.localStorage : window.localStorage

    dispatch(openLoading())
    setTimeout(() => {
      abcContext(context => {
        context.loginWithPassword(username, password, null, null, (error, account) => {
          if (error) {
            dispatch(closeLoading())
            const type = (error.type === 'OtpError') ? 'server_error_bad_otp' : 'server_error_bad_password'
            dispatch(openErrorModal(t(type)))

            if (error.wait > 0) {
              const currentWaitSpan = error.wait
              const reEnableLoginTime = Date.now() + currentWaitSpan * 1000
              enableTimer(reEnableLoginTime, 'password', dispatch)
            }
            return callback(error, null)
          }
          if (!error) {
            localStorage.setItem('lastUser', username)
            dispatch(userLogin(account))
            callback(null, account)
          }
        })
      })
    }, 300)
  }
}

export const loginWithPin = (username, pin, callback) => {
  return (dispatch, getState, imports) => {
    const t = imports.t
    dispatch(openLoading())
    const localStorage = global ? global.localStorage : window.localStorage
    const abcctx = imports.abcContext

    setTimeout(() => {
      abcctx(context => {
        context.loginWithPIN(username, pin, (error, account) => {
          dispatch(closeLoading())
          if (error) {
            dispatch(openErrorModal(t('server_error_bad_pin')))
            if (error.wait > 0) {
              const currentWaitSpan = error.wait
              const reEnableLoginTime = Date.now() + currentWaitSpan * 1000
              enableTimer(reEnableLoginTime, 'pin', dispatch)
            }
            return callback(error, null)
          }

          if (!error) {
            localStorage.setItem('lastUser', username)
            dispatch(userLogin(account))
            return callback(null, account)
          }
        })
      })
    }, 300)
  }
}

export const enableTimer = (target, source, dispatch) => {
  const currentCountdown = Math.floor((target - Date.now()) / 1000)
  scheduleTick(target, source, dispatch)
  if (source === 'pin') {
    dispatch(enablePinTimeout(currentCountdown))
  } else if (source === 'password') {
    dispatch(enablePasswordTimeout(currentCountdown))
  }
}

export const scheduleTick = (targetTime, source, disp) => {
  const difference = Math.floor((targetTime - Date.now()) / 1000)
  if (difference > 0) {
    if (source === 'pin') {
      disp(refreshPinTimeout(difference))
    } else if (source === 'password') {
      disp(refreshPasswordTimeout(difference))
    }
  } else {
    const scheduleTickTimeout = setTimeout(() => scheduleTick(targetTime, source, disp), 1000)

    clearTimeout(scheduleTickTimeout, source)
    if (source === 'pin') {
      disp(disablePinTimeout())
    } else if (source === 'password') {
      disp(disablePasswordTimeout())
    }
  }
}

export const edgeLogin = (callback) => {
  return (dispatch, getState, imports) => {
    const abcContext = imports.abcContext
    const t = imports.t

    const onProcess = (username) => {
      dispatch(selectUserToLogin(username))
      return dispatch(openLoading(String.format(t('edge_logging_in'), username)))
    }

    const onLogin = (error, account) => {
      window.localStorage.setItem('lastUser', account.username)
      dispatch(userLogin(account))
      return callback(error, account)
    }

    abcContext(context => {
      context.requestEdgeLogin({
        displayName: context.displayName,
        displayImageUrl: context.displayImageUrl,
        onLogin: onLogin,
        onProcessLogin: onProcess
      }, (error, results) => {
        if (error) {
          dispatch(showContainerNotification(t('error_edge_login'), 'error'))
        } else if (results) {
          dispatch(requestEdgeLogin(results))
        }
      })
    })
  }
}
