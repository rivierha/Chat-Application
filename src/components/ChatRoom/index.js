import React, {Component} from 'react';
import { withAuthorization } from '../Session';
import { withFirebase } from '../Firebase';
import './chatRoom.css';
import ReactDOM from 'react-dom';

class ChatRoom extends Component{

    constructor(props){
        super(props)
        this.state= {
            var : this.props.location.pathname,
            res : "",
            chats : []
        }
        this.state.res = (this.state.var).slice(6);
    }

    componentDidMount(){

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

        e.preventDefault();
            this.props.firebase.chatroom().doc(this.state.res).collection("roomMessages").add({
            userMail: this.props.firebase.auth.currentUser.email,  
            content: this.state.text,
            time: new Date().getTime()
          })
          .then( console.log("success"))
          .catch(error => {
            this.setState({ error });
          });
          this.setState({text: ""});

    }

    render() {
        const { chats } = this.state;
        const Message = ({chats}) => (
          <div>
            {chats.map(chat => (
            <div key = {chat.id}>
            <span className={`chat ${chat.userMail === this.props.firebase.auth.currentUser.email ? "right" : "left"}`} >
               {chat.content}
            </span>             
            </div>
            ))}  
          </div>
      );
      return(
          
          <div className="chatroom">
          <h3>ChatRoom</h3>        
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