<template>
  <section class="ui centered grid" style="margin-top: 30px">
    <div class="column" style="max-width: 450px;">
      <form action="#" class="ui segment large form">
        <div class="ui segment">
          <div class="field">
            <div class="ui left icon input large">
              <input type="text" placeholder="Name" v-model="form.name" required v-focus />
              <i class="ui icon user"></i>
            </div>
          </div>

          <div class="field">
            <div class="ui left icon input large">
              <input type="email" placeholder="Email Address" v-model="form.email" required />
              <i class="ui icon mail"></i>
            </div>
          </div>

          <div class="field">
            <div class="ui left icon input large">
              <input type="password" placeholder="Password" v-model="form.password" required />
              <i class="ui icon lock"></i>
            </div>
          </div>

          <button
            class="ui button field large green"
            @click.prevent="register"
            type="submit"
          >Register</button>
        </div>
      </form>

      <router-link :to="{name: 'login'}" tag="a" class="ui button basic">Already registered? Log In</router-link>
    </div>
  </section>
</template>

<script>
export default {
  data() {
    return {
      form: {
        name: null,
        email: null,
        password: null
      }
    };
  },

  methods: {
    register() {
      this.$firebase
        .auth()
        .createUserWithEmailAndPassword(this.form.email, this.form.password)
        .then(user => {
          console.log(
            `Name: ${this.form.name}, Email: ${user.email}, id: ${user.uid}`
          );
          this.setUpUserProfile(user);
        })
        .catch(e => console.log(e));
    },

    setUpUserProfile({ user }) {
      try {
        this.$firestore
          .collection("users")
          .doc(user.uid)
          .set({
            name: this.form.name,
            email: user.email,
            active: false
          });
        console.log("User created Successfully!");
      } catch (e) {
        console.log(e);
      }
    }
  }
};
</script>