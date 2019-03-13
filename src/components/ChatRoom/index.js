import React, {Component} from 'react';
import { withAuthorization } from '../Session';
import { withFirebase } from '../Firebase';
import './chatRoom.css';
import ReactDOM from 'react-dom';
import { Link,BrowserRouter as Router, Route } from 'react-router-dom';

class ChatRoom extends Component{

    constructor(props){
        super(props)
        this.state= {
            var : this.props.location.pathname,
            res : "",
            chats : [],
            uName : ""
        }
        this.state.res = (this.state.var).slice(6);
    }

    componentDidMount(){

      if(this.props.firebase.auth.currentUser != null){
        this.value = this.props.firebase.auth.currentUser.email;
      }
      else
      this.value = null;

      console.log(this.props.firebase.users().onSnapshot(

        snapshot => {
          let uName;
           snapshot.forEach((doc) => {
             if(this.props.firebase.auth.currentUser.email == doc.data().email){
              console.log(doc.data().username);
              uName = doc.data().username;

              this.setState({
                uName : uName
              })
             }    
          })
        }
      ))


      this.unsubscribe = this.props.firebase.chatroom().doc(this.state.res).collection("roomMessages").orderBy('time').onSnapshot(
        snapshot => {
          if(snapshot.size){
            let chats= []
            snapshot.forEach(doc => {
                chats.push( {...doc.data(), id : doc.time} )
            })

            this.setState({
              chats: chats
            });
          }else {
            this.setState({ users: null, loading: false });
          }
        }
      )
    }

    componentWillUnmount() {
      this.unsubscribe();
   }

    state = {
        text: ""
      }

    onChange(e) {
      this.setState({text: e.target.value});
    }

    submitMessage(e) {

      console.log(this.state.uName);


      this.props.firebase.user(this.props.firebase.auth.currentUser.uid).get();

        e.preventDefault();
          if(this.state.text != '') {
            let msg = this.state.text;
            msg = msg.trim();
            if(msg != '') {
            this.props.firebase.chatroom().doc(this.state.res).collection("roomMessages").add({
            userName: this.state.uName,  
            content: this.state.text,
            time: new Date().getTime()
          })
          .then( console.log("success"))
          .catch(error => {
            this.setState({ error });
          });
        }
        }
          this.setState({text: ""});

    }

    render() {
        const { chats,res } = this.state;
        const Message = ({chats}) => (
          <div>
            {chats.map(chat => (
            <div key = {chat.id}>
            <span className={`chat ${chat.userName === this.state.uName ? "right" : "left"}`} >
               <div> <b>{chat.userName}</b></div>
               {chat.content}
            </span>             
            </div>
            ))}  
          </div>
      );
      return(
          
          <div className="chatroom">
          
          <h3>ChatRoom
          <Link to={`/home/${res}`} ><button style={{"margin-left":"10vw"}}>Add user </button>  </Link>
          </h3>      
          <ul className="chats">                    
              <Message chats={chats} />            
          </ul>       
          <div className="input">    
          <form className="input" onSubmit={(e) => this.submitMessage(e)} >
          <input onChange={e => this.onChange(e)} type="text" value={this.state.text} placeholder="Enter your message and press ENTER"/>
          <button className="button"> Send </button>
          </form>
          </div>
          </div>
      )
    }
}

const condition = authUser => !!authUser;
export default withAuthorization(condition)(ChatRoom);