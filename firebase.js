
import { initializeApp } from "firebase/app";
import {getAuth} from "firebase/auth";
import {getFirestore} from "firebase/firestore";

const firebaseConfig = {
  apiKey: "AIzaSyDAC5MmETXTgb1wxQooNmEqrLcshnZVmxg",
  authDomain: "laundry-app-a21d1.firebaseapp.com",
  projectId: "laundry-app-a21d1",
  storageBucket: "laundry-app-a21d1.appspot.com",
  messagingSenderId: "709172913554",
  appId: "1:709172913554:web:e4736dee4b5597c05acd4b"
};


const app = initializeApp(firebaseConfig);

const auth = getAuth(app);
//const db = initializeFirestore(app,{experimentalForceLongPolling:true})
const db = getFirestore();

export {auth,db};