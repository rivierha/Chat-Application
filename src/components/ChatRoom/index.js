import React, {Component} from 'react';
import { withAuthorization } from '../Session';
import { withFirebase } from '../Firebase';
import './chatRoom.css';

class ChatRoom extends Component{

    constructor(props){
        super(props)

    }

    render() {
        return(
            <div className="chatroom">
            <h3>Chilltime</h3>
            <h2>This is chat Room! </h2>
            <ul className="chats" >
                    
            </ul>
                <form className="input" >
                <input type="text" />
                    <input type="submit" value="Submit" />
                </form>

            </div>
        )
    }

}
const condition = authUser => !!authUser;

export default withAuthorization(condition)(ChatRoom);