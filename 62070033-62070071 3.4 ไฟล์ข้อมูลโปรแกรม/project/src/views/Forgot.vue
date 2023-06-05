<template>
    <section class="hero is-fullheight">
        <div class="hero-body">
            <div class="container">
                <div class="columns is-centered">
                    <div class="column is-half">
                        <div class="box">
                                <div class="notification is-success" v-if="isActive">
                                    <button class="delete" v-on:click="isActive = false"></button>
                                    Check Your Email
                                </div>
                            <form @submit.prevent="submit">
                                <div class="field">
                                    <label class="label">Email</label>
                                    <div class="control has-icons-left">
                                        <input class="input" v-model.trim="$v.email.$model" :class="{'is-danger': $v.email.$error}" type="email" placeholder="Email">
                                        <span class="icon is-small is-left">
                                            <font-awesome-icon :icon="['fas', 'envelope']"/>
                                        </span>
                                    </div>
                                    <template v-if="$v.email.$error">
                                        <p class="help is-danger" v-if="!$v.email.required">This field is required</p>
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
    import { required } from 'vuelidate/lib/validators'
    export default{
        name: "ForgotView",
        data(){
            return{
                email: "",
                isActive: false,
                loading: false,
            }
        },
        methods:{
            submit(){
                this.$v.$touch()
                if(!this.$v.$invalid){
                    const data = {
                        email: this.email,
                    }
                    axios.post('/forgotpassword', data)
                    .then(res => {
                        console.log(res.data)
                        this.loading = true
                        setTimeout(() => {
                            this.loading = false
                            this.isActive = true
                        }, 3000)
                    }).catch(err => {
                        console.log(err)
                    })
                }
            },
        },
        validations:{
          email:{
            required: required
          },
        },
    }
</script>