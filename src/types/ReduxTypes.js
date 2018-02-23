// @flow

import type { AbcAccount, AbcContext } from 'edge-login'
import type { Dispatch as ReduxDispatch, Store as ReduxStore } from 'redux'

export type Action = { type: string, data?: any }

export type State = {
  previousUsers: {
    lastUser: Object,
    usersWithPinList: Array<string>,
    usernameOnlyList: Array<string>,
    filteredUsernameList: Array<string>,
    userList: Array<Object>
  },
  workflow: {
    currentKey: string,
    details: Array<Object>,
    currentSceneIndex: number,
    showModal: boolean
  },
  create: {
    username: string,
    password: string,
    pin: string,
    pinError: string,
    pinErrorMessage: string,
    confirmPassword: string,
    confirmPasswordErrorMessage: string,
    usernameErrorMessage: string,
    showModal: boolean,
    passwordStatus: Object,
    accountObject: AbcAccount
  },
  login: {
    username: string,
    pin: string,
    password: string,
    errorMessage: string,
    isLoggingInWithPin: boolean,
    loginSuccess: boolean,
    edgeLoginId: string,
    cancelEdgeLoginRequest(): void
  },
  passwordStatus: {
    secondsToCrack: number,
    passed: boolean,
    list: Array<Object>
  },
  passwordRecovery: {
    recoveryErrorMessage: string,
    userQuestions: Array<string>,
    questionsList: Array<string>,
    recoveryKey: string,
    showRecoveryEmailDialog: boolean
  },
  terms: {}
}

type ThunkDispatch<A> = ((Dispatch, GetState) => Promise<void> | void) => A

export type Store = ReduxStore<State, Action>
export type GetState = () => State
export type Dispatch = ReduxDispatch<Action> & ThunkDispatch<Action>
export type Imports = {
  onCancel: Function,
  accountObject: AbcAccount,
  context: AbcContext,
  onComplete: Function,
  locale: string,
  language: string,
  callback: Function,
  username: string,
  recoveryKey: string
}
