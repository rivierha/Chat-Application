import React, {Component} from 'react';
import { withAuthorization } from '../Session';
import { Link } from 'react-router-dom';
import Modal from 'react-responsive-modal';
import '../ChatRoom';

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
      room : "",group:0,id:''
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
    
  }else {

    let id;
    id = (this.props.location.pathname).slice(6);
    this.room = (this.props.location.pathname).slice(6);
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
  this.onOpenModal();
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
            if(this.value !== doc.data().email)
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
    const { open, group,id } = this.state;
    const { users, loading} = this.state;
    const UserList = ({ users,id }) => (
      <table style={{ "maxWidth":"30vw","marginLeft": "37vw"}} >
        {users.map(user => (
          <tr style={{"marginLeft": "34vw", "marginBottom": "40px", "fontSize":"20px", "maxWidth":"25vw"}} key={user.uid}> 
            <td style={{"margin": "20px", "color":"rgb(19, 203, 216)","paddingLeft":"20px", "paddingRight":"20px"}}>
              <strong>{user.username}</strong>
            </td>
            <td style={{"marginLeft": "10vw","paddingLeft":"20px", "paddingRight":"20px"}} className={user.status} >
              {user.status}
            </td>
            {this.props.location.pathname === '/home'?
             <button style={{"display": "inline", "float":"right"}} onClick={()=> this.onClick(user.uid)}>Chat</button> : 
             <button style={{"display": "inline", "float":"right"}} onClick={()=> this.onClick(user.uid)}>Chat</button> } 
          </tr>
        ))}
      </table>
    );
    return (
      <div >
        <h2 style={{"marginLeft": "43vw"}}>Users :</h2>
        {loading && <div>Loading ...</div>}
        <UserList style={{"maxWidth":"25vw"}} users={users} id={id}/>
        {group !== undefined &&  <Link group={group} to={`/chat/${group}`} ><button style={{"marginLeft":"42vw", "marginTop":"20px"}}>Goto group chat </button>  </Link>} 
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