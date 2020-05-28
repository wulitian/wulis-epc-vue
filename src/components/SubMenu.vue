<template functional>
  <a-sub-menu :key="props.menuInfo.path" v-if="!props.menuInfo.hidden">
    <span slot="title">
      <!--<a-icon type="icon-yiban" theme="twoTone" two-tone-color="#52c41a" />-->
      <my-icon v-if="props.menuInfo.meta.icon==null" type="icon-jiqunchushihua" style="font-size: 20px"></my-icon>
      <my-icon v-else :type="props.menuInfo.meta.icon" style="font-size: 20px"></my-icon>
      <span>{{ props.menuInfo.meta.title }}</span>
    </span>
    <template v-for="item in props.menuInfo.children">
      <a-menu-item v-if="!item.children&&!item.hidden" :key="item.path">
        <router-link :to="item.path">
          <my-icon v-if="item.meta.icon==null" type="icon-jiqunchushihua" style="font-size: 20px"></my-icon>
          <my-icon v-else :type="item.meta.icon" style="font-size: 20px"></my-icon>
          <!--<a-icon type="icon-yiban" theme="twoTone" two-tone-color="#52c41a" />-->
          <span>{{ item.meta.title }}</span>
        </router-link>
      </a-menu-item>
      <sub-menu v-else :menu-info="item" />
    </template>
  </a-sub-menu>
</template>
<script>
  export default {
    props: ['menuInfo'],
  };
</script>
<style scoped>
</style>
