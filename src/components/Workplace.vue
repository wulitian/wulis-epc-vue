<template>
  <div class="hello">
    工作台
  </div>
</template>

<script>
  import {test,getUserInfo,getToken} from "@/api/login";
  import { mapActions } from 'vuex'
  export default {
  name: 'Workplace',
  data () {
    return {

    }
  },
  created(){
    this.haha();
    this.gotoUserInfo();
    this.gotoToken();
    console.log('获取vuexgetUserName',this.$store.getters.getUserName)
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
      let data = {
        username:'admin',
        password:'admin'
      }
      this.Login(data)
        .then((res) => console.log(res))
        .catch(err => console.log(err))
        .finally(() => {
        })
    }
  }
}
</script>

<style scoped>
</style>
