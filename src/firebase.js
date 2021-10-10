import firebase from "firebase/compat/app";
import 'firebase/compat/auth';
import 'firebase/compat/firestore';
import 'firebase/compat/storage';


const firebaseConfig = {
    apiKey: "AIzaSyAufUx0IVJZAzl6LlSqltEj503du3pst0c",
    authDomain: "linkedin-dd6ed.firebaseapp.com",
    projectId: "linkedin-dd6ed",
    storageBucket: "linkedin-dd6ed.appspot.com",
    messagingSenderId: "977417825345",
    appId: "1:977417825345:web:2a12404001042bf2752ac0"
};

const firebaseApp = firebase.initializeApp(firebaseConfig);
const db = firebaseApp.firestore();//connecting our app to the db
const auth = firebase.auth();
const provider = new firebase.auth.GoogleAuthProvider();
const storage = firebase.storage();

export  {auth, provider, storage};
export default db;