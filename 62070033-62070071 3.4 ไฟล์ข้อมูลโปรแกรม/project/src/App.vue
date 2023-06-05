<template>
  <div>
    <nav class="navbar" role="navigation" aria-label="main navigation">
      <div class="navbar-brand">
        <router-link to="" class="navbar-item is-size-4">
          DHSS
        </router-link>

        <a
          role="button"
          class="navbar-burger"
          :class="{'is-active' : isActive}"
          aria-label="menu"
          aria-expanded="false"
          data-target="navbarBasicExample"
          @click="click()"
        >
          <span aria-hidden="true"></span>
          <span aria-hidden="true"></span>
          <span aria-hidden="true"></span>
        </a>
      </div>

      <div class="navbar-menu" :class="{'is-active' : isActive}">
          <div class="navbar-start">
            <div class="navbar-item">
              <router-link to="/" class="button is-info">
                  <strong>Home</strong>
              </router-link>
            </div>

            <div v-if="user" class="navbar-item">
              <router-link :to="'/main/' + user.id" class="button is-success">
                  <strong>Record</strong>
              </router-link>
            </div>
          </div>
      </div>

      <div class="navbar-menu" :class="{'is-active' : isActive}">
        <div class="navbar-end">
          <div v-if="user" class="navbar-item has-dropdown is-hoverable">
            <a class="navbar-link">
              <span class="pl-3">{{ user.user_name }} ( level {{ user.rank }})</span>
            </a>
            <div class="navbar-dropdown">
              <router-link class="navbar-item has-text-dark has-background-primary" :to="'/profile/' + user.id"><strong>PROFILE</strong></router-link>
              <a class="navbar-item has-text-dark has-background-danger mt-2" href="javascript:void(0)" @click.prevent="logout()"><strong>LOG OUT</strong></a>
            </div>
          </div>

          <div v-if="!user" class="navbar-item">
              <div class="buttons">
                <router-link to="/signin" class="button is-primary">
                    <strong>SIGN IN</strong>
                </router-link>
              </div>
          </div>

          <div v-if="!user" class="navbar-item">
            <div class="buttons">
                <router-link to="/signup" class="button is-link">
                    <strong>SIGN UP</strong>
                </router-link>
              </div>
          </div>
        </div>
      </div>
    </nav>
    <!-- <router-view :key="$route.fullPath" @auth-change="onAuthChange" :user="user"></router-view> -->
    <router-view :key="$route.fullPath" @auth-change="onAuthChange"></router-view>
  </div>
</template>

<script>
    import axios from '@/plugins/axios'
    import { mapGetters } from 'vuex'

    export default{
        data(){
          return{
            // user: null,
            isActive: false,
            loading: false
          }
        },
        mounted(){
          this.onAuthChange()
        },
        methods:{
          onAuthChange(){
            const token = localStorage.getItem('token')
            if(token){
              this.getUser()
            }
          },
          getUser(){
            localStorage.getItem('token')
            axios.get('/user/me').then(res => {
              // this.user = res.data
              this.$store.dispatch('user', res.data)
            })
          },
          click(){
            this.isActive = !this.isActive
          },
          logout(){
            localStorage.removeItem('token')
            this.$store.dispatch('user', null)
            this.$router.push('/signin')
          },
        },
        computed:{
          ...mapGetters(['user'])
        }
    }
</script>
