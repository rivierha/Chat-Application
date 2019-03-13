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
      room : "",group:0
    }; 
  }

  onClick = (val) => {

    if(this.props.location.pathname === '/home'){
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
  }else {

    let u1,u2,id;
    id = (this.props.location.pathname).slice(6);
    u1 = (this.props.location.pathname).slice(6);
    u1 = (this.props.location.pathname).slice(6);
    console.log(id);
    this.props.firebase.chatroom().doc(id).update(
      {
        user3: val
      }
    ).then(
      console.log("successfully added new user to chat")
    )

    this.props.firebase.users().doc(val).update({
      groupChat: id
    })
    .catch(
      error => {
        this.setState({ error });
      });
  }
  }

  state = {
    open: false,
    group: ""
  };

  onOpenModal = () => {
    this.setState({ open: true });
  };

  onCloseModal = () => {    
    this.setState({ open: false });  
  };

  componentDidMount() {

    console.log(this.props.location.pathname);

    if(this.props.firebase.auth.currentUser != null){
      this.value = this.props.firebase.auth.currentUser.email;
    }
    else
    this.value = null;
    this.setState({ loading: true });
    this.unsubscribe = this.props.firebase
      .users()
      .onSnapshot(snapshot => {
        if(snapshot.size){
        let users = [];
        let group ;
          snapshot.forEach(doc => {
            if(this.value != doc.data().email)
            {
            users.push({ ...doc.data(), uid: doc.id })
            }else {
                group = doc.data().groupChat
             
            }
          })
        this.setState({
          users: users.reverse(),
          loading: false,
          group: group,
        });
      }else {
        this.setState({ users: null, loading: false });
      }
      });
  }

  render() {
    const { open, group } = this.state;
    const { users, loading, room } = this.state;
    const UserList = ({ users }) => (
      <table style={{ "maxWidth":"30vw"}} style={{"marginLeft": "37vw"}} >
        {users.map(user => (
          <tr style={{"marginLeft": "34vw", "marginBottom": "40px", "fontSize":"20px", "maxWidth":"25vw"}} key={user.uid}> 
            <td style={{"margin": "20px", "color":"rgb(5, 151, 170)","paddingLeft":"20px", "paddingRight":"20px"}}>
              <strong>{user.username}</strong>
            </td>
            <td style={{"marginLeft": "10vw","paddingLeft":"20px", "paddingRight":"20px"}} className={user.status} >
              {user.status}
            </td>
            <button style={{"display": "inline", "float":"right"}} onClick={()=> this.onClick(user.uid,user.name)}>Chat</button>    
          </tr>
        ))}
      </table>
    );
    return (
      <div >
        <h2 style={{"marginLeft": "43vw"}}>Users :</h2>
        {loading && <div>Loading ...</div>}
        <UserList style={{"maxWidth":"25vw"}} users={users} />
        {group != undefined &&  <Link group={group} to={`/chat/${group}`} ><button style={{"margin-left":"10vw"}}>Goto group chat </button>  </Link>} 
        <Modal open={open} onClose={this.onCloseModal} little>
              <h2>Your chat-room is ready! Press the button below to navigate to the room</h2>
              <button style={{"marginLeft": "18vw"}}><Link to={`/chat/${this.room}`}>GO !</Link> </button>
        </Modal>       
      </div>
    );
  }
}

const condition = authUser => !!authUser;
export default withAuthorization(condition)(HomePage);