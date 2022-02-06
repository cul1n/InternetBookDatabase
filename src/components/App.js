import React from "react"
import Signup from "./Signup"
import { Container } from "react-bootstrap"
import { AuthProvider } from "../contexts/AuthContext"
import { BrowserRouter as Router, Switch, Route } from "react-router-dom"
import Profile from "./Profile"
import Login from "./Login"
import PrivateRoute from "./PrivateRoute"
import EditProfile from "./EditProfile"
import Home from "./Home"
import Library from "./Library"
import { Navbar } from "./Navbar"
import '../App.css'

function App() {
  return (
        <Router>
          <AuthProvider>
            <Navbar/>
            <Container
      className="d-flex align-items-center justify-content-center"
      style={{ minHeight: "60vh" }}
    >
      <div className="w-100" style={{ maxWidth: "700px" }}>
            <Switch>
              <PrivateRoute exact path="/" component={Home} />
              <PrivateRoute  path="/profile" component={Profile} />
              <PrivateRoute  path="/library" component={Library} />
              <PrivateRoute path="/editprofile" component={EditProfile} />
              <Route path="/signup" component={Signup} />
              <Route path="/login" component={Login} />
            </Switch>
            </div>
            </Container>
          </AuthProvider>
        </Router>
  )
}

export default App
