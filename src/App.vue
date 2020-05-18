<template>
  <a-locale-provider :locale="zh_CN">
    <div id="app">
      <router-view/>
    </div>
  </a-locale-provider>
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
  .ant-layout-header {
    height: 64px;
    padding: 0 50px;
    line-height: 64px;
    background: #567aff;
  }
</style>
