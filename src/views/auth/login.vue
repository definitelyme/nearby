<template>
  <section class="ui centered grid" style="margin-top: 30px">
    <div class="column" style="max-width: 450px;">
      <form action="#" class="ui segment large form">
        <div class="ui segment">
          <div class="field">
            <div class="ui left icon input large">
              <input type="email" placeholder="Email Address" v-model="form.email" />
              <i class="ui icon mail"></i>
            </div>
          </div>

          <div class="field">
            <div class="ui left icon input large">
              <input type="password" placeholder="Password" v-model="form.password" />
              <i class="ui icon lock"></i>
            </div>
          </div>

          <button class="ui button field large green" @click.prevent="signIn">Login</button>
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
      this.$firebase.auth()
        .signInWithEmailAndPassword(this.form.email, this.form.password)
        .then(user => console.log(user))
        .catch(e => console.log(e));
    }
  }
};
</script>