import React, {Component} from 'react';
import { withAuthorization } from '../Session';
import { withFirebase } from '../Firebase';
import { Link,BrowserRouter as Router, Route } from 'react-router-dom';
import Modal from 'react-responsive-modal';
import '/home/rivierha/ReactProject/chat-application/src/components/ChatRoom/chatRoom.css';

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

    this.cid = this.props.firebase.auth.currentUser.uid.toString()
    this.uid = val.toString();

    if(this.uid < this.cid){
      this.room = this.uid + this.cid
    }else {
      this.room = this.cid + this.uid
    }

    this.props.firebase.chatroom().doc(this.room).set(
      {
        user1: this.uid,
        user2: this.cid,
      }
    )  
    this.onOpenModal();
  }

  state = {
    open: false,
  };

  onOpenModal = () => {
    this.setState({ open: true });
  };

  onCloseModal = () => {    
    this.setState({ open: false });  
  };

  componentDidMount() {

    if(this.props.firebase.auth.currentUser != null){
      this.value = this.props.firebase.auth.currentUser.email;
    }
    else
    this.value = null;
    this.setState({ loading: true });
    this.name = this.props.firebase.user();
    this.unsubscribe = this.props.firebase
      .users()
      .onSnapshot(snapshot => {
        if(snapshot.size){
        let users = [];
          snapshot.forEach(doc => {
            if(this.value != doc.data().email)
            {
            users.push({ ...doc.data(), uid: doc.id })
            }
            console.log(users); 
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

  render() {
    const { open } = this.state;
    const { users, loading, room } = this.state;
    const UserList = ({ users }) => (
      <table style={{ "background-color":"red", "max-width":"30vw"}} style={{"margin-left": "37vw"}} >
        {users.map(user => (
          <tr style={{"margin-left": "34vw", "margin-bottom": "40px", "font-size":"20px", "max-width":"25vw"}} key={user.uid}> 
            <td style={{"margin": "20px", "color":"rgb(5, 151, 170)","padding-left":"20px", "padding-right":"20px"}}>
              <strong>{user.username}</strong>
            </td>
            <td style={{"margin-left": "10vw","padding-left":"20px", "padding-right":"20px"}} className={user.status} >
              {user.status}
            </td>
            <button style={{"display": "inline", "float":"right"}} onClick={()=> this.onClick(user.uid)}>Chat</button>           
          </tr>
        ))}
      </table>
    );
    return (
      <div >
        <h2 style={{"margin-left": "43vw"}}>Users :</h2>
        {loading && <div>Loading ...</div>}
        <UserList style={{"background-color":"blue", "max-width":"25vw"}} users={users} />
        <Modal open={open} onClose={this.onCloseModal} little>
              <h2>Your chat-room is ready! Press the button below to navigate to the room</h2>
              <button style={{"margin-left": "18vw"}}><Link to={`/chat/${this.room}`}>GO !</Link> </button>
        </Modal>       
      </div>
    );
  }
}

const condition = authUser => !!authUser;
export default withAuthorization(condition)(HomePage);