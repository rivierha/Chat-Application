import React, { Component } from 'react';
import { withRouter } from 'react-router-dom';
import { compose } from 'recompose';
import { SignUpLink } from '../SignUp';
import { withFirebase } from '../Firebase';
import * as ROUTES from '../../constants/routes';

const SignInPage = () => (
  <div>
    <h2 style={{"marginLeft": "44vw"}}>Login</h2>
    <SignInForm />
    <SignUpLink />
    <SignInGoogle />    
  </div>
);

const INITIAL_STATE = {
  email: '',
  password: '',
  error: null,
};

class SignInFormBase extends Component {
  constructor(props) {
    super(props);
    this.activeUser= {};
    this.state = { ...INITIAL_STATE };
  }

  onSubmit = event => {
    const { email, password } = this.state;
    this.props.firebase
      .doSignInWithEmailAndPassword(email, password)
      .then(authUser => {
        this.activeUser = this.props.firebase.user(authUser.user.uid);
        // Create a user in your Firebase Realtime Database too
        return this.props.firebase.user(authUser.user.uid).update(
          {
            status: "active"
          }
        );        
      })
      .then(() => {
        
        this.setState({ ...INITIAL_STATE });
        this.props.history.push(ROUTES.HOME);
      })
      .catch(error => {
        this.setState({ error });
      });

    event.preventDefault();
  };

  onChange = event => {
    this.setState({ [event.target.name]: event.target.value });
  };

  render() {
    const { email, password, error } = this.state;
    const isInvalid = password === '' || email === '';
    return (
      <form style={{"marginLeft": "40vw"}} onSubmit={this.onSubmit}>
        <input style={{"margin": "20px", "display":"block"}}
          name="email"
          value={email}
          onChange={this.onChange}
          type="text"
          placeholder="Email Address"
        />
        <input style={{"margin": "20px", "display":"block"}}
          name="password"
          value={password}
          onChange={this.onChange}
          type="password"
          placeholder="Password"
        />
        <button style={{"margin": "20px", "display":"block"}} disabled={isInvalid} type="submit">
          Login
        </button>
        {error && <p>{error.message}</p>}
      </form>
    );
  }
}

class SignInGoogleBase extends Component {
  constructor(props) {
    super(props);
    this.state = { error: null };
  }

  onSubmit = event => {
    this.props.firebase
      .doSignInWithGoogle()
      .then(socialAuthUser => {
        return this.props.firebase.user(socialAuthUser.user.uid).set(
          {
            username: socialAuthUser.user.displayName,
            email: socialAuthUser.user.email,
            status: "active",
            userId: Date.now()
          },
          { merge: true },
        );
      })
      .then(socialAuthUser => {
        this.setState({ error: null });
        this.props.history.push(ROUTES.HOME);
      })
      .catch(error => {
        this.setState({ error });
      });
    event.preventDefault();
  };

  render() {
    const { error } = this.state;

    return (
      <form style={{"marginLeft": "43vw"}} onSubmit={this.onSubmit}>
        <button style={{"align": "center"}} type="submit">Sign In with Google</button>
        {error && <p>{error.message}</p>}
      </form>
    );
  }
}

const SignInGoogle = compose(
                      withRouter,
                      withFirebase,
                    )(SignInGoogleBase);

const SignInForm = compose(
                    withRouter,
                    withFirebase,
                  )(SignInFormBase);

export default SignInPage;
export { SignInForm, SignInGoogle };