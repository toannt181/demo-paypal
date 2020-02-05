import React, { useEffect, useState } from 'react'
import { connect } from 'react-redux'
import {
  BrowserRouter as Router,
  Switch,
  Route,
} from 'react-router-dom'
import AuthenticateRoute from '../../hocs/AuthenticateRoute'

import { actions } from '../../slices/appSlice'
// import { selectUsername } from './selectors'
import GlobalStyle from './globalStyle'
import Main from '../Main'
import LoginPage from '../LoginPage'
import WarningModal from './WarningModal'
import LoadingSpinner from '../../components/LoadingSpinner'
import { ACCESS_TOKEN } from '../../configs/constants'
import WaitVerifyEmailPage from '../WaitVerifyEmailPage'
import VerifyEmailPage from '../VerifyEmailPage'

function App(props) {
  const {
    warningData,
    dispatchWarningModal,
    appLoadingStack,
    dispatchFetchUser,
    dispatchSetUser,
    user,
  } = props
  const [isAppReady, setAppReady] = useState(false)

  useEffect(() => {
    if (localStorage.getItem(ACCESS_TOKEN)) {
      dispatchFetchUser()
    } else {
      dispatchSetUser(false)
    }
  }, [dispatchFetchUser, dispatchSetUser])

  useEffect(() => {
    if (user !== null) {
      setAppReady(true)
    }
  }, [user])

  return (
    <>
      <GlobalStyle />
      <Router>
        {isAppReady && (
          <Switch>
            <Route exact path="/login" component={LoginPage} />
            <Route exact path="/wait-verify" component={WaitVerifyEmailPage} />
            <Route exact path="/verify" component={VerifyEmailPage} />
            <AuthenticateRoute component={Main} />
          </Switch>
        )}
        {(!isAppReady || appLoadingStack > 0) && (<LoadingSpinner />)}
        {warningData.visible && <WarningModal {...warningData} dispatchWarningModal={dispatchWarningModal} />}
      </Router>
    </>
  )
}

export default connect(
  state => ({
    user: state.app.user,
    // fullname: selectUsername(state),
    warningData: state.app.warningData,
    appLoadingStack: state.app.appLoadingStack,
  }),
  actions
)(App)
