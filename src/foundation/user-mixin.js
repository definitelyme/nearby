let userMixin = {
  data() {
    return {
      user: {},
    };
  },

  methods: {
    async getCurrentUser() {
      this.$firebase.auth().onAuthStateChanged(async(firebaseUser) => {
        if (firebaseUser && firebaseUser != null) {
          this.$user = await this.$firestore
            .collection("users")
            .doc(firebaseUser.uid)
            .onSnapshot((data) => (this.user = data.data()));
        }
      });
    },
  },

  created() {
    this.getCurrentUser();
  },
};

export default userMixin;