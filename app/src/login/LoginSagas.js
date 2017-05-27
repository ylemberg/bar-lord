import { call, put } from 'redux-saga/effects'
import { delay } from 'redux-saga'

import { browserHistory } from 'react-router'
import LoginActions from './duck.Login'

export function* logIn({ email, password, auth }) {
  try {
    // login at auth0 server
    const token = yield call(auth.login, email, password)
    yield call(delay, 3000)
    yield put(LoginActions.loginSuccess())

    // Attempt to set token
    yield call(delay, 2000)
    const accessToken = yield call(auth.storeTokens, token)
    yield put(LoginActions.tokenSet())

    // Get profile info
    yield call(delay, 2000)
    const profile = yield call(auth.getProfileInfo, accessToken)
    yield put(LoginActions.profileSet(profile))

    yield call(delay, 1000)
    yield put(LoginActions.loadingComplete())
    browserHistory.push('/dashboard')
  } catch (err) {
    yield put(LoginActions.authFailure(err))
  }
}

export function* signUp({ email, password, auth }) {
  try {
    // attempt to add user to database
    yield call(auth.signup, email, password, 'Username-Password-Authentication')
    yield call(delay, 3000)
    yield put(LoginActions.signupSuccess())

    // Call Login Saga above
    yield call(delay, 3000)
    yield put(LoginActions.loginRequest(email, password, auth))
  } catch (err) {
    yield put(LoginActions.authFailure(err))
  }
}
