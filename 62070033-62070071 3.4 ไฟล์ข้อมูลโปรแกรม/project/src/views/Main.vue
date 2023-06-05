<template>
        <div class="container" v-if="user">
            <LoaderView v-if="loading" />
            <div v-if="hidden">
                <div class="columns mt-3 ml-3 mr-3">
                    <div class="column is-6">
                        <div class="box">
                            <div class="columns is-centered">
                                <div class="column is-9">
                                    <p class="has-text-centered has-text-weight-bold title is-4">{{ rewards }} {{ points }} / {{ required }}</p>
                                    <br>
                                    <progress class="progress is-info is-small" :value="points" :max="required"></progress>
                                </div>
                            </div>

                            <div class="columns">
                                <div class="column">
                                    <label class="label">Water {{ water2 }} ml / {{ amount_month }} ml</label>
                                    <progress class="progress is-info" :value="water2" :max="amount_month"></progress>
                                </div>
                            </div>

                            <div class="columns">
                                <div class="column">
                                    <label class="label">Beer {{ beer }} ml / 900 ml</label>
                                    <progress class="progress is-warning" :value="beer" max="900"></progress>
                                </div>
                            </div>

                            <div class="columns">
                                <div class="column">
                                    <label class="label">Soft Drink {{ softdrink }} ml / 180 ml</label>
                                    <progress class="progress is-danger" :value="softdrink" max="180"></progress>
                                </div>
                            </div>
                        </div>
                    </div>

                    <div class="column is-6">
                        <div class="box">
                            <div class="columns">
                                <div class="column">
                                    <label class="label">Amount of water should be received {{ water1 }} ml / {{ recive }} ml</label>
                                    <progress class="progress is-link" :value="water1" :max="recive"></progress>
                                </div>
                            </div>

                            <form @submit.prevent="submit" onsubmit="setTimeout(function(){window.location.reload();},6000);">
                                <div class="field pt-2">
                                    <label class="label">Drinks</label>
                                    <div class="control">
                                        <div class="select is-fullwidth">
                                            <select v-model="$v.drinks.$model" :class="{'is-danger': $v.drinks.$error}">
                                                <option disabled value="">Please select a drink type</option>
                                                <option value="Water">Water</option>
                                                <option value="Beer">Beer</option>
                                                <option value="Soft Drink">Soft Drink</option>
                                            </select>
                                        </div>
                                    </div>
                                    <template v-if="$v.drinks.$error">
                                        <p class="help is-danger" v-if="!$v.drinks.required">This field is required</p>
                                    </template>
                                </div>

                                <div class="field pt-2">
                                    <label class="label">Amount</label>
                                    <div class="control">
                                        <input class="input" v-model="$v.amount.$model" :class="{'is-danger': $v.amount.$error}" type="number" placeholder="0 ml" min="0" />
                                    </div>
                                    <template v-if="$v.amount.$error">
                                        <p class="help is-danger" v-if="!$v.amount.required">This field is required</p>
                                    </template>
                                </div>

                                <div class="field has-text-centered pt-2">
                                    <div class="control">
                                        <button class="button is-link is-centered" style="width: 150px">Submit</button>
                                    </div>
                                </div>
                        </form>
                        </div>
                    </div>
                </div>
                <ChartComponent/>
            </div>
        </div>
</template>
<script>
    import { mapGetters } from 'vuex'
    import axios from '@/plugins/axios'
    import { required } from 'vuelidate/lib/validators'
    import ChartComponent from '../components/ChartComponent.vue'
    import LoaderView from '../components/Loading.vue'
    export default{
        name: "MainView",
        components:{
            ChartComponent,
            LoaderView
        },
        data(){
            return{
                username: "",
                ranks: "",
                rewards: "",
                points: "",
                required: "",
                water2: "",
                amount_month: "",
                beer: "",
                softdrink: "",
                water1: "",
                recive: "",
                drinks: "",
                amount: 0,
                id: "",
                loading: false,
                hidden: true
            }
        },
        validations:{
            drinks:{
                required: required,
            },
            amount:{
                required: required,
            }
        },
        created(){
            this.id = this.$route.params.id
            axios.get(`/main/${this.id}`)
            .then((res) => {
                this.username = res.data.username
                this.points = res.data.points
                this.required = res.data.required
                this.rewards = res.data.rewards
                this.ranks = res.data.ranks
                this.recive = res.data.recive 
                this.amount_month = res.data.amount_month
                this.water1 = res.data.water1
                this.water2 = res.data.water2
                this.beer = res.data.beer
                this.softdrink = res.data.softdrink
            }).catch((err) => {
                console.log(err)
            })
        },
        methods:{
            submit(){
                this.id = this.$route.params.id
                this.$v.$touch()
                if(!this.$v.$invalid){
                    const data = {
                        drinks: this.drinks,
                        amount: this.amount
                    }
                    axios.post(`/main/${this.id}`, data)
                    .then(res => {
                        console.log(res.data)
                        this.loading = true
                        this.hidden = false
                        setTimeout(() => {
                            setTimeout(() => {
                                this.hidden = true
                            }, 0)
                            this.loading = false
                        }, 6000)
                    }).catch(err => {
                        console.log(err)
                    })
              }
          }
        },
        computed:{
            ...mapGetters(['user'])
        }
    }
</script>