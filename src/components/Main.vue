<template>
  <a-layout id="components-layout-demo-top-side" style="min-height: 100vh">
        <a-layout-header class="header">
          <div class="logo"><img src="../../static/images/logo.png"><span>沂水县供电公司电力工程项目管理平台</span></div>
          <a-dropdown class="avatar" :trigger="['click']">
            <a class="ant-dropdown-link" @click="e => e.preventDefault()">
              <a-avatar  icon="user" />
            </a>
            <a-menu slot="overlay">
              <a-menu-item key="0">
                <a href="http://www.alipay.com/">个人中心</a>
              </a-menu-item>
              <a-menu-item key="1">
                <a href="#" @click="userLogout">退出登录</a>
              </a-menu-item>
            </a-menu>
          </a-dropdown>
        </a-layout-header>
        <a-layout>
          <a-layout-sider width="200" style="background: #fff">
            <a-menu
              :default-open-keys="openkeys"
              :default-selected-keys="[$route.path]"
              mode="inline"
            >
              <template v-for="item in menuList[0].children">
                <a-menu-item v-if="!item.children&&!item.hidden" :key="item.id">
                  <router-link :to="item.path"><span>{{ item.meta.title }}</span></router-link>
                </a-menu-item>
                <SubMenu v-else :menu-info="item"/>
              </template>
            </a-menu>
          </a-layout-sider>
          <a-layout style="padding: 0 24px 24px;">
            <Breadcrumb style="margin: 16px 0" />
            <a-layout-content
              :style="{ background: '#fff', padding: '24px', margin: 0, minHeight: '280px',height: '100%'}"
            >
              <router-view></router-view>
            </a-layout-content>
          </a-layout>
        </a-layout>
  </a-layout>
</template>
<script>
  import SubMenu from './SubMenu'
  import Breadcrumb from '@/components/Breadcrumb'
  import { mapActions } from 'vuex'
  export default {
    components: {
      SubMenu,
      Breadcrumb
    },
    name: 'Main',
    data () {
      return {
        collapsed: false,
        openkeys:[],
      }
    },
    computed: {
      menuList: function () {
        console.log(this.$store.getters.addRouters.find(item => item.path === '/').children)
        return this.$store.getters.addRouters.find(item => item.path === '/').children
      }
    },
    created(){
      this.getOpenKey();
    },
    methods:{
      ...mapActions(['Logout']),
      getOpenKey(){
        this.openkeys.push(this.$store.getters.routerList.find(item => item.id===(this.$store.getters.routerList.find(item => item.path === this.$route.path).parentId)).path);
      },
      userLogout(){
        this.Logout()
          .then((res) => {
            console.log(res)
            if(res.code==2020200){
              this.$message.info(res.message);
            }else{
              this.$message.info(res.message);
            }
          })
          .catch(err => console.log(err))
          .finally(() => {
            this.$router.push("/login")
          })
      }
    }
  }
</script>
<style>
  #components-layout-demo-top-side .logo {
    float: left;
    height: 100%;
    color: #fff;
    font-size: 18px;
  }
  .avatar{
    backgroundColor:#87d068;
    cursor: pointer;
    float: right;
    margin-right: 15px;
  }
</style>
