// Firebase App (the core Firebase SDK) is always required and
// must be listed before other Firebase SDKs
import * as firebase from "firebase/app";
import "firebase/auth";
import "firebase/firestore";
import "firebase/storage";

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

let mixin = {
    computed: {
        $firebase() {
            if (!firebase.apps.length) {
                firebase.initializeApp(firebaseConfig);
                firebase
                    .firestore()
                    .enablePersistence()
                    .catch((e) => {
                        if (err.code == "failed-precondition") {
                            console.log(
                                "Multiple tabs open, persistence can only be enabled in one tab at a time."
                            );
                        } else if (err.code == "unimplemented") {
                            console.log(
                                "The current browser does not support all of the features required to enable persistence."
                            );
                        }
                    });
            }

            return firebase;
        },

        $firestore() {
            return this.$firebase.firestore();
        },

        $storage() {
            return this.$firebase.storage;
        },

        $auth() {
            return this.$firebase.auth;
        },
    },
};

export default mixin;