<template>
    <section class="hero is-fullheight">
        <div class="hero-body">
            <div class="container">
                <LoaderView v-if="loading" />
                <div class="columns is-centered" v-if="hidden">
                    <div class="column is-half">
                        <div class="box">
                            <h1 class="title has-text-centered is-3">SIGN UP</h1>
                                <form @submit.prevent="handleSubmit">
                                    <div class="field">
                                        <label class="label">Username</label>
                                            <div class="control has-icons-left">
                                                <input class="input" v-model.trim="$v.username.$model" :class="{'is-danger': $v.username.$error}" type="text" pattern="[\w ]+" placeholder="Enter your username">
                                                <span class="icon is-small is-left">
                                                    <font-awesome-icon :icon="['fas', 'user']"/>
                                                </span>
                                            </div>
                                            <template v-if="$v.username.$error">
                                                <p class="help is-danger" v-if="!$v.username.required">This field is required</p>
                                                <p class="help is-danger" v-if="!$v.username.minLength">Username must contain at least 6 characters</p>
                                            </template>
                                      </div>

                                    <div class="field">
                                        <label class="label">Email</label>
                                            <div class="control has-icons-left">
                                                <input class="input" v-model.trim="$v.email.$model" :class="{'is-danger': $v.email.$error}" type="email" placeholder="Enter your email">
                                                <span class="icon is-small is-left">
                                                    <font-awesome-icon :icon="['fas', 'envelope']"/>
                                                </span>
                                            </div>
                                            <template v-if="$v.email.$error">
                                                <p class="help is-danger" v-if="!$v.email.required">This field is required</p>
                                                <p class="help is-danger" v-if="!$v.email.email">Invalid Email</p>
                                            </template>
                                      </div>

                                    <div class="field">
                                        <label class="label">Password</label>
                                            <div class="control has-icons-left">
                                                <input class="input" v-model.trim="$v.password.$model" :class="{'is-danger': $v.password.$error}" type="password" placeholder="Enter your password">
                                                <span class="icon is-small is-left">
                                                      <font-awesome-icon :icon="['fas', 'lock']"/>
                                                </span>
                                            </div>
                                            <template v-if="$v.password.$error">
                                                <p class="help is-danger" v-if="!$v.password.required">This field is required</p>
                                                <p class="help is-danger" v-if="!$v.password.minLength">Passwordmust contain at least 8 characters</p>
                                                <p class="help is-danger" v-if="!$v.password.complex">Password too easy</p>
                                            </template>
                                    </div>

                                    <div class="field">
                                        <label class="label">Confirm Password</label>
                                            <div class="control has-icons-left">
                                                <input class="input" v-model.trim="$v.confirm_password.$model" :class="{'is-danger': $v.confirm_password.$error}" type="password" placeholder="Confirm your password">
                                                <span class="icon is-small is-left">
                                                      <font-awesome-icon :icon="['fas', 'circle-check']"/>
                                                </span>
                                            </div>
                                            <template v-if="$v.confirm_password.$error">
                                                <p class="help is-danger" v-if="!$v.confirm_password.required">This field is required</p>
                                                <p class="help is-danger" v-if="!$v.confirm_password.sameAs">Passwords did not match</p>
                                            </template>
                                    </div>

                                    <div class="field">
                                        <label class="label">Weight</label>
                                            <div class="control has-icons-left">
                                                <input class="input" v-model.number="$v.weight.$model" :class="{'is-danger': $v.weight.$error}" type="number" placeholder="weight" min="30" max="120" step="0.01" >
                                                <span class="icon is-small is-left">
                                                    <font-awesome-icon :icon="['fas', 'weight-scale']"/>
                                                </span>
                                            </div>
                                            <template v-if="$v.weight.$error">
                                                <p class="help is-danger" v-if="!$v.weight.required">This field is required</p>
                                                <p class="help is-danger" v-if="!$v.weight.between">Weight Must be between {{$v.weight.$params.between.min}}</p>
                                            </template>
                                      </div>

                                    <div class="field">
                                        <label class="label">Date of Birth</label>
                                            <div class="control has-icons-left">
                                                <input class="input" v-model.trim="$v.date.$model" :class="{'is-danger': $v.date.$error}" type="date">
                                                <span class="icon is-small is-left">
                                                    <font-awesome-icon :icon="['fas', 'calendar-days']"/>
                                                </span>
                                            </div>
                                            <template v-if="$v.date.$error">
                                                <p class="help is-danger" v-if="!$v.date.required">This field is required</p>
                                                <p class="help is-danger" v-if="!$v.date.maxDay">Date must not a future day</p>
                                            </template>
                                      </div>

                                      <div class="field is-grouped is-grouped-centered">
                                          <template>
                                              <button class="button is-link is-fullwidth"> SIGN UP </button>
                                          </template>
                                      </div>
                                      <div class="field is-grouped is-grouped-centered">
                                          <template>
                                              <p>Already have an account ? <a href="/signin">SIGN IN</a></p>
                                          </template>
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
    import { required, email, minLength, sameAs, maxLength, between} from 'vuelidate/lib/validators'
    import LoaderView from '../components/Loading.vue'

    function complexPassword (value) {
      if (!(value.match(/[a-z]/) && value.match(/[A-Z]/) && value.match(/[0-9]/))) {
        return false
      }
      return true
    }

    function validate_Date(value){
      const today = new Date()
      const bd = new Date(value)
      if(bd > today){
        return false
      }
      return true
    }

    export default{
        name: 'SignUpView',
        components:{
          LoaderView
        },
        data(){
            return{
                username: "",
                email: '',
                password: '',
                confirm_password: '',
                date: '',
                weight: '',
                loading: false,
                hidden: true
            }
        },
        methods:{
            handleSubmit(){
              this.$v.$touch()
              if(!this.$v.$invalid){
                let data = {
                    username: this.username,
                    email: this.email,
                    password: this.password,
                    confirm_password: this.confirm_password,
                    date: this.date,
                    weight: parseFloat(this.weight)
                }

                axios.post('/signup', data)
                  .then(res => {
                        console.log(res.data)
                        this.loading = true
                        this.hidden = false
                        setTimeout(() => {
                            this.$router.push({path: '/signin'})
                            this.loading = false
                        }, 3000)
                  })
                  .catch(err => {
                        console.log(err)
                  })
              }
            }
        },
        validations:{
          username:{
            required: required,
            minLength: minLength(6),
            maxLength: maxLength(20)
          },
          email:{
            required: required,
            email: email
          },
          password:{
            required: required,
            minLength: minLength(8),
            complex: complexPassword
          },
          confirm_password:{
            required: required,
            sameAs: sameAs('password')
          },
          weight:{
            required: required,
            between: between(30, 120)
          },
          date:{
            required: required,
            maxDay: validate_Date
          }
        }
    }
</script>