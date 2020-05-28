<template>
  <div class="container">
    <div class="login-form-group">
      <div class="left-group"></div>
      <div class="bt"><img src="../../static/images/logo.png"><span>电力工程管理系统</span></div>
      <div class="form-group">
        <img src="../../static/images/loginuser.png"/>
        <input type="text" placeholder="请输入账号" v-model="form.account"/>
      </div>
      <div class="form-group">
        <img src="../../static/images/loginpassword.png"/>
        <input type="password" placeholder="请输入密码" v-model="form.password"/>
      </div>
      <button @click="gotoToken">登录</button>
    </div>
  </div>
</template>

<script>
  import Vue from 'vue'
  import { ACCESS_TOKEN } from '@/store/mutation-types'
  import {test,getUserInfo,getToken} from "@/api/login";
  import { mapActions } from 'vuex'
  export default {
  name: 'Login',
  data () {
    return {
      form:{
        account:'administrator',
        password:'123456',
      },
    }
  },
  created(){
    // this.gotoToken();
  },
  methods:{
    ...mapActions(['GetUserInfo', 'Login']),
    gotoToken(){
      Vue.ls.remove(ACCESS_TOKEN);
      this.Login(this.form)
        .then((res) => {
          if(res.code==2020200){
            this.$message.info(res.message);
            this.$router.push("/")
          }else{
            this.$message.info(res.message);
          }
        })
        .catch(err => console.log(err))
    }
  }
}
</script>

<style scoped>
  input:-webkit-autofill {
    -webkit-transition-delay: 99999s;
    -webkit-transition: color 99999s ease-out, background-color 99999s ease-out;
    -webkit-box-shadow: 0 0 0 1000px #f7fbfb inset;
  }
  .container{
    background: url("../../static/images/pcbg.png")center center no-repeat;
    background-color: #eff7ff;
    height: 100%;
    width: 100%;
    position: fixed;
  }
    .bt{
      font-size: 20px;
      color: #2979ff;
      font-weight: 700;
      margin-bottom: 20px;
    }
    .login-form-group{
      text-align: center;
      width: 780px;
      height: 400px;
      margin: 200px auto 0 auto;
      padding-left: 390px;
      padding-right: 20px;
      padding-top: 30px;
      position: relative;
      background: #e9f2ff;
      border-radius: 10px;
      box-shadow: 0px 0px 30px #deeaff;
  }
  .left-group{
    background: url('../../static/images/pcleftbg.png')center center no-repeat;
    position: absolute;
    left: 0;
    top: 0;
    width: 370px;
    height: 400px;
    background-size: 80%;
    background-color: #3583ff;
    border-radius: 10px 0px 0px 10px
  }
  .form-group{
    width: 100%;
    position: relative;
    border: 1px solid #d4e6ff;
    margin-top: 24px;
  }
  .form-group input{
    padding-left: 40px;
    height: 40px;
    width: 100%;
    border: 0;
    color: #a7a7a7;
    outline: none;
  }
  .form-group img{
    position: absolute;
    left: 10px;
    width: 20px;
    top: 10px;
  }
  .login-form-group button{
    width: 100%;
    height: 40px;
    border: 0;
    outline: none;
    color: #FFFFFF;
    background: #3583ff;
    margin-top: 30px;
  }
</style>
