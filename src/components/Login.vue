<template>
  <div class="hello">
   123qwewdqwewewerewrwer
  </div>
</template>

<script>
  import Vue from 'vue'
  import { ACCESS_TOKEN } from '@/store/mutation-types'
  import {test,getUserInfo,getToken} from "@/api/login";
  import { mapActions } from 'vuex'
  import qs from 'qs'
  export default {
  name: 'Login',
  data () {
    return {
    }
  },
  created(){
    Vue.ls.remove(ACCESS_TOKEN);
    this.gotoToken();
  },
  methods:{
    ...mapActions(['GetUserInfo', 'Login']),
    haha(){
      test(1)
        .then(res => {
          console.log(res)
        })
        .catch((e) => {
          console.log(e)
        })
    },
    gotoUserInfo(){
      this.GetUserInfo()
        .then((res) => console.log(res))
        .catch(err => console.log(err))
        .finally(() => {
        })
    },
    gotoToken(){
      console.log("token")
      let data = {
        account:'administrator',
        password:'123456'
      }
      this.Login(qs.stringify(data))
        .then((res) => {
          this.$router.push("/")
          console.log(res)
        })
        .catch(err => console.log(err))
        .finally(() => {
        })
    }
  }
}
</script>

<style scoped>
</style>
