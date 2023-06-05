<template>
    <section class="hero is-fullheight">
      <div class="hero-body">
        <div class="container">
          <LoaderView v-if="loading" />
          <div class="columns is-centered" v-if="hidden">
            <div class="column is-half">
                  <div class="modal" :class="{'is-active' : isActive}">
                        <div class="modal-background"></div>
                        <div class="modal-card">
                            <section class="box has-text-centered">
                                <p class="title is-4">{{ error }}</p>
                                <button class="button is-danger is-fullwidth" v-on:click="isActive = false">Dismiss</button>
                            </section>
                        </div>
                  </div>
              <div class="box">
                    <h1 class="title has-text-centered is-3">SIGN IN</h1>
                    <form @submit.prevent="submit">
                      <div class="field">
                        <label class="label">Email</label>
                        <div class="control has-icons-left">
                          <input class="input" v-model="$v.email.$model" :class="{'is-danger': $v.email.$error}" type="email" placeholder="Email">
                          <span class="icon is-small is-left">
                              <font-awesome-icon :icon="['fas', 'envelope']"/>
                          </span>
                        </div>
                        <template v-if="$v.email.$error">
                          <p class="help is-danger" v-if="!$v.email.required">This field is required</p>
                        </template>
                      </div>
                      <div class="field">
                        <label class="label">Password</label>
                        <div class="control has-icons-left">
                          <input class="input" v-model="$v.password.$model" :class="{'is-danger': $v.password.$error}" type="password" placeholder="Password">
                          <span class="icon is-small is-left">
                            <font-awesome-icon :icon="['fas', 'lock']"/>
                          </span>
                        </div>
                        <template v-if="$v.password.$error">
                          <p class="help is-danger" v-if="!$v.password.required">This field is required</p>
                        </template>
                      </div>
                      <div class="field">
                        <div class="control">
                          <button class="button is-primary">Sign In</button>
                          <p class="has-text-right">
                              <router-link to="/forgotpassword">Forgot Password ?</router-link>
                          </p>
                        </div>
                      </div>
                    </form>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
</template>

<script>
    import axios from '@/plugins/axios'
    import { required } from 'vuelidate/lib/validators'
    import LoaderView from '../components/Loading.vue'

    export default{
        name: 'SigninView',
        components:{
          LoaderView
        },
        data(){
          return{
              email: '',
              password: '',
              loading: false,
              hidden: true,
              isActive: false,
              error: ""
          }
        },
        methods:{
          submit(){
            this.$v.$touch()
            if(!this.$v.$invalid){
              const data = {
                email: this.email,
                password: this.password
              }

            axios.post('/signin', data)
              .then(res => {
                  const token = res.data.token
                  localStorage.setItem('token', token)
                  this.$emit('auth-change')
                  this.$store.dispatch('user', res.data.user)
                  this.loading = true
                  this.hidden = false
                  setTimeout(() => {
                    this.$router.push({path: '/'})
                    this.loading = false
                  }, 3000)
              }).catch(err => {
                  console.log(err)
                  this.isActive = true
                  if (err.response && err.response.status === 401) {
                      this.error = 'Invalid Email or Password'
                  }else {
                      this.error = 'An error occurred. Please try again later.'
                  }
              })
            }
          }
        },
        validations:{
          email:{
            required: required
          },
          password:{
            required: required
          }
        },
    }
</script>