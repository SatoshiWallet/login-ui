// @flow

import { makeReactNativeFolder } from 'disklet'
import type { EdgeAccount, EdgeContext } from 'edge-core-js'
import React, { Component } from 'react'
import { Provider } from 'react-redux'
import type { Store } from 'redux'
import { applyMiddleware, compose, createStore } from 'redux'
import thunk from 'redux-thunk'

import reducers from '../../../common/reducers'
import { checkingForOTP } from '../../../common/util/checkingForOTP.js'
import type { Imports } from '../../../types/ReduxTypes'
import LoginAppConnector from '../../connectors/LogInAppConnector'
import * as Styles from '../../styles'

type Props = {
  context: EdgeContext,
  username: ?string,
  recoveryLogin?: string,
  accountOptions: any,
  fontDescription: any,
  onLogin(error: ?Error, account: ?EdgeAccount, touchIdInfo: ?Object): void,
  appId?: string,
  appName?: string,
  backgroundImage?: any,
  primaryLogo?: any,
  primaryLogoCallback?: () => void,
  parentButton?: Object,
  landingScreenText?: string
}

type State = {}
type Action = { type: string }

class LoginScreen extends Component<Props> {
  store: Store<State, Action>
  cleanups: Array<Function>

  static defaultProps = {
    username: null,
    recoveryLogin: null,
    accountOptions: null
  }

  constructor(props: Props) {
    super(props)
    checkingForOTP(this.props.context)
    const composeEnhancers =
      typeof window === 'object' && window.__REDUX_DEVTOOLS_EXTENSION_COMPOSE__
        ? window.__REDUX_DEVTOOLS_EXTENSION_COMPOSE__({ name: 'core-ui' })
        : compose
    const imports: Imports = {
      context: this.props.context,
      callback: this.props.onLogin,
      onCancel: () => {},
      onComplete: () => {},
      folder: makeReactNativeFolder(),
      accountOptions: this.props.accountOptions,
      username: this.props.username,
      recoveryKey: this.props.recoveryLogin
    }
    this.store = createStore(
      reducers,
      {},
      composeEnhancers(applyMiddleware(thunk.withExtraArgument(imports)))
    )
    this.cleanups = []
  }

  componentDidMount() {
    // Completed Edge login:
    this.cleanups = [
      this.props.context.on('login', account => {
        this.props.onLogin(null, account)
      }),
      this.props.context.on('loginStart', ({ username }) => {
        // Show spinner for Edge login starting
      }),
      this.props.context.on('loginError', ({ error }) => {
        this.props.onLogin(error)
      })
    ]
  }

  componentWillUnmount() {
    for (const cleanup of this.cleanups) cleanup()
  }

  render() {
    return (
      <Provider store={this.store}>
        <LoginAppConnector
          context={this.props.context}
          onLogin={this.props.onLogin}
          recoveryLogin={this.props.recoveryLogin}
          styles={Styles}
          appId={this.props.appId}
          appName={this.props.appName}
          backgroundImage={this.props.backgroundImage}
          primaryLogo={this.props.primaryLogo}
          primaryLogoCallback={this.props.primaryLogoCallback}
          parentButton={this.props.parentButton}
          landingScreenText={this.props.landingScreenText}
        />
      </Provider>
    )
  }
}

export { LoginScreen }
