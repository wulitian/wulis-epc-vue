<template functional>
  <a-sub-menu :key="props.menuInfo.path" v-if="!props.menuInfo.hidden">
    <span slot="title">
      <a-icon type="mail" /><span>{{ props.menuInfo.meta.title }}</span>
    </span>
    <template v-for="item in props.menuInfo.children">
      <a-menu-item v-if="!item.children&&!item.hidden" :key="item.path">
        <router-link :to="item.path">
          <a-icon type="pie-chart" />
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
