<template>
    <section class="hero is-fullheight">
        <div class="hero-body">
            <div class="container">
                <div class="columns is-centered">
                    <div class="column is-half">
                        <div class="modal" :class="{'is-active' : showerr}">
                            <div class="modal-background"></div>
                            <div class="modal-card">
                                <section class="box has-text-centered">
                                    <p class="title is-4">{{ error }}</p>
                                    <button class="button is-link" v-on:click="showerr = false">OK</button>
                                </section>
                            </div>
                        </div>
                        <div class="box">
                            <div class="notification is-success" v-if="isActive">
                                <button class="delete" v-on:click="isActive = false"></button>
                                Change Password Success Back To <router-link to="/signin"><p>Sign In</p></router-link>
                            </div>
                            <form @submit.prevent="submit">
                                <div class="field">
                                    <label class="label">Password</label>
                                    <div class="control has-icons-left">
                                        <input class="input" v-model.trim="$v.password.$model" :class="{'is-danger': $v.password.$error}" type="password" placeholder="password">
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
                                        <input class="input" v-model.trim="$v.confirm_password.$model" :class="{'is-danger': $v.confirm_password.$error}" type="password" placeholder="confirm password">
                                        <span class="icon is-small is-left">
                                            <font-awesome-icon :icon="['fas', 'circle-check']"/>
                                        </span>
                                    </div>
                                    <template v-if="$v.confirm_password.$error">
                                        <p class="help is-danger" v-if="!$v.confirm_password.required">This field is required</p>
                                        <p class="help is-danger" v-if="!$v.confirm_password.sameAs">Passwords did not match</p>
                                    </template>
                                </div>

                                <div class="field has-text-centered">
                                    <div class="control">
                                        <button class="button is-primary is-fullwidth" :class="{ 'is-loading': loading }">Submit</button>
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
    import { required, minLength, sameAs } from 'vuelidate/lib/validators'

    function complexPassword (value) {
      if (!(value.match(/[a-z]/) && value.match(/[A-Z]/) && value.match(/[0-9]/))) {
        return false
      }
      return true
    }
    export default{
        name: "ResetView",
        data(){
            return{
                password: "",
                confirm_password: "",
                error: "",
                isActive: false,
                loading: false,
                showerr: false
            }
        },
        methods:{
            submit(){
                this.$v.$touch()
                if(!this.$v.$invalid){
                    const data = {
                        password: this.password,
                        confirm_password: this.confirm_password
                    }
                    axios.post(`/reset/${encodeURIComponent(this.$route.params.token)}`, data)
                        .then(res => {
                            console.log(res.data)
                            this.loading = true
                            setTimeout(() => {
                                this.isActive = true
                                this.loading = false
                            }, 3000)
                        }).catch(err => {
                            if(err.response && err.response.status === 400){
                                this.error = "Invalid Token"
                            }
                            console.log(err)
                            this.showerr = true
                        })
                }
            }
        },
        validations:{
          password:{
            required: required,
            minLength: minLength(8),
            complex: complexPassword
          },
          confirm_password:{
            required: required,
            sameAs: sameAs('password')
          }
        },
    }
</script>