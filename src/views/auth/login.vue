<template>
  <section class="ui centered grid" style="margin-top: 30px">
    <div class="column" style="max-width: 450px;">
      <p v-show="errors.length">
          <b>Please correct the following error(s):</b>
          <ul>
            <li v-for="(error, index) in errors" :key="index">{{ error }}</li>
          </ul>
      </p>
      <form action="#" class="ui segment large form" novalidate="true">
        <div class="ui segment">
          <div class="field">
            <div class="ui left icon input large">
              <input type="email" placeholder="Email Address" v-model="form.email" v-focus required />
              <i class="ui icon mail"></i>
            </div>
          </div>

          <div class="field">
            <div class="ui left icon input large">
              <input type="password" placeholder="Password" v-model="form.password" required />
              <i class="ui icon lock"></i>
            </div>
          </div>

          <button class="ui button field large green" @click.prevent="signIn" type="submit">Login</button>
        </div>
      </form>

      <router-link
        :to="{name: 'register'}"
        tag="a"
        class="ui button basic"
      >Don't have an account? Register</router-link>
    </div>
  </section>
</template>

<script>
export default {
  data() {
    return {
      form: {
        email: null,
        password: null
      }
    };
  },

  methods: {
    signIn() {
      if (this.hasErrors()) return;
      this.$firebase
        .auth()
        .signInWithEmailAndPassword(this.form.email, this.form.password)
        .then(user => console.log("Sign In successful! Redirecting..."))
        .catch(e => {
          console.log(e);
          this.errors.push(e.message);
        });
    },

    hasErrors() {
      this.errors = [];
      if (this.form.email == null || this.form.email == "")
        this.errors.push("Email is required!");
      if (this.form.password == null || this.form.password == "")
        this.errors.push("Password is required!");
      return this.errors.length ? true : false;
    }
  }
};
</script>