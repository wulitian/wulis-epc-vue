<template>
  <a-config-provider :locale="zh_CN">
    <div id="app">
      <router-view/>
    </div>
  </a-config-provider>
</template>

<script>
  import zh_CN from 'ant-design-vue/lib/locale-provider/zh_CN';
  import moment from 'moment';
  import 'moment/locale/zh-cn';
  moment.locale('zh-cn');
export default {
  name: 'App',
  data() {
    return {
      zh_CN,
    };
  },
}
</script>

<style>
  #app{
    min-height: 100%;
  }
  .ant-layout-header {
    height: 64px;
    padding: 0px!important;
    line-height: 64px;
    /*background: #0f00f3!important;*/
    background: #00b5a4!important
  }
</style>
