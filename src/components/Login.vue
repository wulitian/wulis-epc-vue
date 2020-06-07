<template>
  <div class="container">
    <div class="login-form-group">
      <div class="left-group"></div>
      <div class="bt"><img src="../../static/images/logo2.png"><span>沂水县供电公司电力工程项目管理平台</span></div>
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
      spinning:false,
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
      this.spinning = true;
      Vue.ls.remove(ACCESS_TOKEN);
      this.Login(this.form)
        .then((res) => {
          if(res.code==2020200){
            this.spinning = false;
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
    background-color: #00b5a4;
    height: 100%;
    width: 100%;
    position: fixed;
  }
    .bt{
      font-size: 18px;
      color: #00b5a4;
      font-weight: 700;
      margin-bottom: 20px;
    }
    .login-form-group{
      text-align: center;
      width: 900px;
      height: 460px;
      margin: 200px auto 0 auto;
      padding-left: 470px;
      padding-right: 20px;
      padding-top: 30px;
      position: relative;
      background: #e7f9f3;
      border-radius: 10px;
      -webkit-box-shadow: 0px 0px 30px #b3e2d3;
      box-shadow: 0px 0px 30px #b3e2d3;
  }
  .left-group{
    background: url('../../static/images/pcleftbg.png')center center no-repeat;
    position: absolute;
    left: 0;
    top: 0;
    width: 450px;
    height: 459px;
    background-size: 70%;
    background-color: #00b5a4;
    border-radius: 10px 0px 0px 10px;
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
    background: #00b5a4;
    margin-top: 30px;
  }
</style>
