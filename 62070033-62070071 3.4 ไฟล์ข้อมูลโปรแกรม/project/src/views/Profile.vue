<template>
    <section class="hero is-fullheight" v-if="user">
        <div class="hero-body">
            <div class="container">
                <LoaderView v-if="loading" />
                <div class="columns is-centered" v-if="hidden">
                    <div class="column is-half">
                        <div class="modal" :class="{'is-active' : showerr}">
                            <div class="modal-background"></div>
                            <div class="modal-card">
                                <section class="box has-text-centered">
                                    <p class="title is-4">{{ error }}</p>
                                    <button class="button is-danger is-fullwidth" v-on:click="showerr = false">Dismiss</button>
                                </section>
                            </div>
                        </div>
                        <div class="box">
                            <div class="notification is-success" v-if="isActive">
                                <button class="delete" v-on:click="isActive = false"></button>
                                    Edit Profile Is Success
                            </div>
                            <form @submit.prevent="save" onsubmit="setTimeout(function(){window.location.reload();},3000);">
                                <div class="field">
                                    <label class="label">Username</label>
                                    <div class="control has-icons-left">
                                        <input class="input" type="text" v-model="$v.username.$model" :class="{'is-danger': $v.username.$error}" pattern="[\w ]+" :disabled="disabled == 0">
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
                                        <input class="input" type="email" v-model="$v.email.$model" :class="{'is-danger': $v.email.$error}" :disabled="disabled == 0">
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
                                    <label class="label">Weight</label>
                                    <div class="control has-icons-left">
                                        <input class="input" type="number" v-model="$v.weight.$model" :class="{'is-danger': $v.weight.$error}" :disabled="disabled == 0">
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
                                        <input class="input" type="date" v-model="$v.dob.$model" :class="{'is-danger': $v.dob.$error}" :disabled="disabled == 0">
                                        <span class="icon is-small is-left">
                                            <font-awesome-icon :icon="['fas', 'calendar-days']"/>
                                        </span>
                                    </div>
                                    <template v-if="$v.dob.$error">
                                        <p class="help is-danger" v-if="!$v.dob.required">This field is required</p>
                                        <p class="help is-danger" v-if="!$v.dob.maxDay">Date must not a future day</p>
                                    </template>
                                </div>

                                <div class="field mt-3 is-grouped">
                                    <div class="control" v-if="disabled == 1">
                                        <button class="button is-link">Save</button>
                                    </div>
                                </div>
                            </form>

                                <div class="field">
                                    <div class="control">
                                        <div class="buttons is-right">
                                            <button class="button is-info" @click="disabled = 1">Edit</button>
                                            <button v-if="disabled == 1" class="button is-danger" @click="disabled = 0">Cancel</button>
                                        </div>
                                    </div>
                                </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    </section>
</template>
<script>
    import axios from '@/plugins/axios'
    import { mapGetters } from 'vuex'
    import { required, email, minLength, maxLength, between} from 'vuelidate/lib/validators'
    import LoaderView from '../components/Loading.vue'

    function validate_Date(value){
      const today = new Date()
      const bd = new Date(value)
      if(bd > today){
        return false
      }
      return true
    }

    export default{
        name: "ProfileView",
        components:{
          LoaderView
        },
        data(){
            return{
                username: "",
                email: "",
                weight: "",
                dob: "",
                error: "",
                disabled: 0,
                isActive: false,
                loading: false,
                hidden: true,
                showerr: false
            }
        },
        created(){
            axios.get(`/profile/${this.$route.params.id}`)
                .then(res => {
                    this.username = res.data.user_name
                    this.email = res.data.email
                    this.weight = res.data.weight
                    this.dob = res.data.dob.slice(0, 10)
                }).catch(err =>{
                    console.log(err)
                })
        },
        methods:{
            save(){
                this.$v.$touch()
              if(!this.$v.$invalid){
                const data = {
                    username: this.username,
                    email: this.email,
                    date: this.dob,
                    weight: parseFloat(this.weight)
                }

                axios.post(`/profile/${this.$route.params.id}`, data)
                  .then(res => {
                      console.log(res.data)
                      this.loading = true
                      this.hidden = false
                      this.disabled = 0
                      setTimeout(() => {
                            setTimeout(() => {
                                this.isActive = true
                                this.hidden = true
                            }, 0)
                            this.loading = false
                      }, 3000)
                  })
                  .catch(err => {
                        if(err.response && err.response.status === 400){
                            this.error = "Username or Email is already taken"
                        }
                        this.showerr = true
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
          weight:{
            required: required,
            between: between(30, 120)
          },
          dob:{
            required: required,
            maxDay: validate_Date
          }
        },
        computed:{
            ...mapGetters(['user'])
        }
    }
</script>