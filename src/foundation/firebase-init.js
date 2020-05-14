// Firebase App (the core Firebase SDK) is always required and
// must be listed before other Firebase SDKs
import * as firebase from "firebase/app";

const firebaseConfig = {
    apiKey: "AIzaSyA3pv09p5d-qDmu3cFkcQqcu09SQaKYnDo",
    authDomain: "test-lab-03.firebaseapp.com",
    databaseURL: "https://test-lab-03.firebaseio.com",
    projectId: "test-lab-03",
    storageBucket: "test-lab-03.appspot.com",
    messagingSenderId: "556031754539",
    appId: "1:556031754539:web:0d7643e4b69cf237a2456e",
    measurementId: "G-8BZSW2ER5X",
};

if (!firebase.apps.length) {
    firebase.initializeApp(firebaseConfig);
}

export default firebase;