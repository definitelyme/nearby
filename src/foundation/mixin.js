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
  data() {
    return {
      drawer: false,
      errors: [],
    };
  },
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
      return this.$firebase.auth();
    },
  },

  methods: {
    emailValidator(email) {
      const pattern = /^(([^<>()[\]\\.,;:\s@"]+(\.[^<>()[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/;
      if (email == null || email == "") this.errors.push("Email field is required!")
      else if (!pattern.test(email)) this.errors.push("Enter a valid Email Address")
      return;
    },
    passwordValidator(password) {
      const MIN_LENGTH = 6;
      const upperCasePattern = new RegExp("(.*[A-Z].*)");
      const numberPattern = new RegExp("[0-9]+");
      if (password == null || password == "") this.errors.push("Password field is required!")
      else if (password != null && password.length < MIN_LENGTH) this.errors.push("Password must be at least 6 characters.")
      else if (!upperCasePattern.test(password)) this.errors.push("Must contain an Uppercase letter.")
      else if (!numberPattern.test(password)) this.errors.push("Password must include a number!")
      return;
    },
  },
};

export default mixin;