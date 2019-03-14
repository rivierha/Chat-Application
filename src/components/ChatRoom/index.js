import React, {Component} from 'react';
import { withAuthorization } from '../Session';
import './chatRoom.css';
import Modal from 'react-responsive-modal';
import { Link } from 'react-router-dom';

class ChatRoom extends Component{

    constructor(props){
        super(props)
        this.state= {
            var : this.props.location.pathname,
            res : "",
            chats : [],
            uName : "",
            img:null,
            url:'',
            text: "",
            open: false,
            progress:0
        }
        this.state.res = (this.state.var).slice(6);
    }

    componentDidMount(){
      if(this.props.firebase.auth.currentUser != null){
        this.value = this.props.firebase.auth.currentUser.email;
      }
      else {this.value = null;}
      this.props.firebase.users().onSnapshot(
        snapshot => {
          let uName;
           snapshot.forEach((doc) => {
             if(this.value === doc.data().email){
              console.log(doc.data().username);
              uName = doc.data().username;

              this.setState({
                uName : uName
              })
             }    
          })
        }
      )

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

    onChange(e) {
      this.setState({text: e.target.value});
    }

    onOpenModal = () => {
      this.setState({ open: true });
    };
  
    onCloseModal = () => {    
      this.setState({ open: false });  
    };

    handleChange = (e) => {
      console.log(this.img);
      if(e.target.files[0]){
        console.log(e.target.files[0])
        const img = e.target.files[0];
        this.setState({img : img})
      }

    }

    handleUpload = () => {
      var dat = new Date()
      var hrs = dat.getHours();
      var min = dat.getMinutes();
      var sec = dat.getSeconds();
      console.log(hrs+':'+ min);
      var time = hrs+':'+ min + ':'+sec ;
      
      console.log(this.state.img.name.toString());
      const {img} = this.state;
      console.log(this.props.firebase.storageref())

      const uploadTask = this.props.firebase.storageref().child(`${img.name}`).put(img); 
      uploadTask.on('state_changed',
       (snapshot) => {
         var progress = Math.round((snapshot.bytesTransferred / snapshot.totalBytes) * 100);
         this.setState({progress: progress})

       },
       (error) => {
        console.log(error);
       },
       () => {
         this.props.firebase.storageref().child(`${img.name}`).getDownloadURL().then(
          url => {
            console.log(url);
            this.setState({url : url})

            this.props.firebase.chatroom().doc(this.state.res).collection("roomMessages").add({
              userName: this.state.uName,  
              content: url,
              type: "file",
              time: time
            })
            .then( console.log("success"))
            .catch(error => {
              this.setState({ error });
            })
          }
        )          
       });
      setTimeout(this.onCloseModal, 5000)

    }

    submitMessage(e) {
      var dat = new Date()
      var hrs = dat.getHours();
      var min = dat.getMinutes();
      var sec = dat.getSeconds();
      console.log(hrs+':'+ min);
      var time = hrs+':'+ min + ':'+sec ;
      this.props.firebase.user(this.props.firebase.auth.currentUser.uid).get();
      e.preventDefault();
          if(this.state.text !== '') {
            let msg = this.state.text;
            msg = msg.trim();
            if(msg !== '') {
            this.props.firebase.chatroom().doc(this.state.res).collection("roomMessages").add({
            userName: this.state.uName,  
            content: this.state.text,
            type:"text",
            time: time
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
        const { chats,res,open } = this.state;
        const Message = ({chats}) => (
          <div>
            {chats.map(chat => (
            <div key = {chat.id}>
            <span className={`chat ${chat.userName === this.state.uName ? "right" : "left"}`} >
            {chat.userName === this.state.uName ?  <div> <b></b></div> :  <div> <b>{chat.userName}</b></div> }

               {chat.type === "file"? <div><br /><img src={chat.content} alt='' /></div> : <div>{chat.content}</div>}
               <div style={{"fontSize":"12px", "marginTop":"5px", "float":"right"}}>{chat.time.slice(0,5)}</div>
            </span>             
            </div>
            ))}  
          </div>
      );
      return(          
          <div className="chatroom">          
          <h3>ChatRoom
          <Link to={`/home/${res}`} ><button style={{"marginLeft":"10vw"}}>Add user </button>  </Link>
          </h3>      
          <ul className="chats">                    
              <Message chats={chats} />            
          </ul>       
          <div className="input">    
          <form className="input" onSubmit={(e) => this.submitMessage(e)} >
          <input onChange={e => this.onChange(e)} type="text" value={this.state.text} placeholder="Enter your message and press ENTER"/>
          <button className="button"> Send </button><br />
          </form>
          <button style={{"marginLeft":"10px"}} onClick={()=>{this.onOpenModal()}} className="button" > Upload image </button>
          </div>
          <Modal open={open} onClose={this.onCloseModal} little>
              <h2>Select an Image to upload</h2>
              <progress value={this.state.progress} max="100"/>
              <br />
              <input onChange={e => this.handleChange(e)} type="file" /><br />
              <button style={{"marginLeft": "18vw"}} onClick={this.handleUpload} >Upload</button>
        </Modal> 
          </div>
      )
    }
}

const condition = authUser => !!authUser;
export default withAuthorization(condition)(ChatRoom);