import React, {Component} from 'react';
import { withFirebase } from '../Firebase';
import { withAuthorization } from '../Session';

import { AuthUserContext } from '../Session';



class SignOutButton extends Component{
  constructor(props) {
    super(props);
    this.value = this.props.firebase.auth.currentUser.uid;
  }
  
  onClick = event => {
    console.log(this.props.firebase.auth.currentUser.uid
      
  );
  this.props.firebase.user(this.value).update(
    {
      status: "not-active"
    }
  )
  this.props.firebase.doSignOut(); 
  }
     do(){
       
     }

  render() {
    return (
      <button type="button" onClick={this.onClick}>
      Sign Out  
    </button>
    )
  }
}

export default withFirebase(SignOutButton);