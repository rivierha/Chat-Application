import app from 'firebase/app';
import 'firebase/auth';
import 'firebase/firestore';


const config = {
    apiKey: "AIzaSyDd4ouWFLUz9nfIH7ML41VONcbbN-RJtfU",
    authDomain: "chat-application-ecfca.firebaseapp.com",
    databaseURL: "https://chat-application-ecfca.firebaseio.com",
    projectId: "chat-application-ecfca",
    storageBucket: "chat-application-ecfca.appspot.com",
    messagingSenderId: "449281740600",
  };

class Firebase {
    constructor() {
      app.initializeApp(config);
      this.fieldValue = app.firestore.FieldValue;

      this.auth = app.auth();
      this.db = app.firestore();
      this.db.settings({ timestampsInSnapshots: true });
      window.db = this.db;
      this.googleProvider = new app.auth.GoogleAuthProvider();
    }

    doCreateUserWithEmailAndPassword = (email, password) =>
    this.auth.createUserWithEmailAndPassword(email, password);

    doSignInWithEmailAndPassword = (email, password) =>
    this.auth.signInWithEmailAndPassword(email, password);

    doSignInWithGoogle = () =>
    this.auth.signInWithPopup(this.googleProvider)

    doSignOut = () => this.auth.signOut();
    
    user = uid => this.db.doc(`users/${uid}`);

    users = () => this.db.collection('users');

    chatroom = () => this.db.collection('chatroom');


  }
  
export default Firebase;