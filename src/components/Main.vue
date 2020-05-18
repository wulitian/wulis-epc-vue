<template>
  <a-layout id="components-layout-demo-top-side" style="min-height: 100vh">
        <a-layout-header class="header">
          <div class="logo" />
        </a-layout-header>
        <a-layout>
          <a-layout-sider width="200" style="background: #fff">
            <a-menu
              :defaultSelectedKeys="['1']"
              :defaultOpenKeys="['2']"
              mode="inline"
              :inlineCollapsed="collapsed"
            >
              <template v-for="item in menuList[0].children">
                <a-menu-item v-if="!item.children" :key="item.id">
                  <router-link :to="item.path"><span>{{ item.meta.title }}</span></router-link>
                </a-menu-item>
                <sub-menu v-else :menu-info="item" :key="item.id"/>
              </template>
            </a-menu>
          </a-layout-sider>
          <a-layout style="padding: 0 24px 24px">
            <a-breadcrumb style="margin: 16px 0">
              <a-breadcrumb-item>Home</a-breadcrumb-item>
              <a-breadcrumb-item>List</a-breadcrumb-item>
              <a-breadcrumb-item>App</a-breadcrumb-item>
            </a-breadcrumb>
            <a-layout-content
              :style="{ background: '#fff', padding: '24px', margin: 0, minHeight: '280px' }"
            >
              <router-view></router-view>
            </a-layout-content>
          </a-layout>
        </a-layout>
  </a-layout>
</template>
<script>
  import SubMenu from './SubMenu'
  export default {
    components: {
      'sub-menu': SubMenu,
    },
    name: 'Main',
    data () {
      return {
        collapsed: false,
      }
    },
    computed: {
      menuList: function () {
        console.log(this.$store.getters.addRouters.find(item => item.path === '/').children)
        return this.$store.getters.addRouters.find(item => item.path === '/').children
      }
    },
    created(){
    },
    methods:{

    }
  }
</script>
<style>
  #components-layout-demo-top-side .logo {
    width: 120px;
    height: 31px;
    background: rgba(255, 255, 255, 0.2);
    margin: 16px 28px 16px 0;
    float: left;
  }
</style>
