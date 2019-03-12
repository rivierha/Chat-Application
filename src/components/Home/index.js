import React, {Component} from 'react';
import { withAuthorization } from '../Session';
import { withFirebase } from '../Firebase';
import { Link,BrowserRouter as Router, Route } from 'react-router-dom';



class HomePage extends Component {
  constructor(props) {
    super(props);
    this.state = {
      loading: false,
      value: "",
      users: [],
      name : "",
      cid: 0,
      uid: 0,
      room : ""
    }; 
  }

  onClick = (val) => {
    console.log(val.toString())
    console.log(this.props.firebase.auth.currentUser.uid.toString())
    this.cid = this.props.firebase.auth.currentUser.uid.toString()
    this.uid = val.toString();

    if(this.uid < this.cid){
      console.log("true");
      this.room = this.uid + this.cid

    }else {
      console.log("false");
      this.room = this.cid + this.uid
    }

    this.props.firebase.chatroom().doc(this.room).set(
      {
        user1: this.uid,
        user2: this.cid,
      }

    )    
  }

  componentDidMount() {
    console.log(this.props.firebase.chatroom().doc("12").collection("roomMessages").onSnapshot(
      snapshot => {
        if(snapshot.size){
          snapshot.forEach(doc => {
            console.log(doc.data().content);
          })
        }
      }
    ));
    if(this.props.firebase.auth.currentUser != null){
      this.value = this.props.firebase.auth.currentUser.email;
    }
    else
    this.value = null;

    this.setState({ loading: true });
    console.log(this.props.firebase.auth.currentUser.email);
    this.name = this.props.firebase.user();
    console.log(this.name);
    this.unsubscribe = this.props.firebase
      .users()
      .onSnapshot(snapshot => {
        if(snapshot.size){
        let users = [];
          snapshot.forEach(doc => {
            console.log(doc.data());
            if(this.value != doc.data().email)
            {
            users.push({ ...doc.data(), uid: doc.id })
            }
            
          })
        this.setState({
          users: users.reverse(),
          loading: false,
        });
      }else {
        this.setState({ users: null, loading: false });
      }
      });
  }

  componentWillUnmount() {
     this.unsubscribe();
  }

  render() {
    const { users, loading, room } = this.state;
    const UserList = ({ users }, {room}) => (
      <ul>
        {users.map(user => (
          <li key={user.uid}>
            <span>
              <strong>Status:</strong> {user.status}
            </span>
            <span>
              <strong>E-Mail:</strong> {user.email}
            </span>
            <span>
              <strong>Username:</strong> {user.username}
            </span>
            <button onClick={()=> this.onClick(user.uid)}><Link to={`/chat/${user.userId}`}>Chat</Link></button>
          </li>
        ))}
      </ul>
    );
    return (
      <div>
        <h1>Users List :</h1>

        {loading && <div>Loading ...</div>}

        <UserList users={users} room={room} />
       
      </div>
    );
}
}

const condition = authUser => !!authUser;

export default withAuthorization(condition)(HomePage);