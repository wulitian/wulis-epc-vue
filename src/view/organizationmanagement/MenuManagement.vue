<template>
  <a-table :columns="columns" :data-source="data" :row-selection="rowSelection" />
</template>
<script>
  const columns = [
    { title: '菜单名称',dataIndex: 'cdmc',key: 'cdmc' },
    { title: '图标',dataIndex: 'tb',key: 'tb' },
    { title: '排序',dataIndex: 'px',key: 'px' },
    { title: '组件路径',dataIndex: 'zjlj',key: 'zjlj' },
    { title: '组件名称',dataIndex: 'zjmc',key: 'zjmc' },
    { title: '重定向地址',dataIndex: 'cdxdz',key: 'cdxdz' },
    { title: '跳转目标',dataIndex: 'tzmb',key: 'tzmb' },
    { title: '菜单隐藏',dataIndex: 'cdyc',key: 'cdyc' },
    { title: '隐藏其他信息',dataIndex: 'ycqtxx',key: 'ycqtxx' },
    { title: '缓冲',dataIndex: 'hc',key: 'hc' },
    { title: '类型',dataIndex: 'lx',key: 'lx' },
    { title: '权限标识',dataIndex: 'bs',key: 'bs' },
    { title: '操作',dataIndex: 'cs',key: 'cs' },
  ];
  const data = [
    {
      key: 1,
      cdmc: '组织机构管理',
      tb: '#123456',
      px: '1',
      zjlj: '/main',
      zjmc: 'main',
      cdxdz: '/main/UserManagement',
      tzmb: '_self',
      cdyc: false,
      ycqtxx: false,
      hc: false,
      lx: '菜单',
      bs: '',
      cs: '',
      children: [
        {
          key: 11,
          cdmc: '角色管理',
          tb: '#123456',
          px: '1',
          zjlj: '/main/RoleManagement',
          zjmc: 'RoleManagement',
          cdxdz: '',
          tzmb: '_self',
          cdyc: false,
          ycqtxx: false,
          hc: false,
          lx: '菜单',
          bs: '',
          cs: '',
          children: [
            {
              key: 131,
              cdmc: '删除按钮',
              tb: '',
              px: '1',
              zjlj: '',
              zjmc: '',
              cdxdz: '',
              tzmb: '',
              cdyc: '',
              ycqtxx: '',
              hc: '',
              lx: '按钮',
              bs: 'del-btn',
              cs: '',
            },
          ],
        },
        {
          key: 12,
          cdmc: '菜单管理',
          tb: '#123456',
          px: '1',
          zjlj: '/main/MenuManagement',
          zjmc: 'MenuManagement',
          cdxdz: '',
          tzmb: '_self',
          cdyc: false,
          ycqtxx: false,
          hc: false,
          lx: '菜单',
          bs: '',
          cs: '',
          children: [
            {
              key: 131,
              cdmc: '删除按钮',
              tb: '',
              px: '1',
              zjlj: '',
              zjmc: '',
              cdxdz: '',
              tzmb: '',
              cdyc: '',
              ycqtxx: '',
              hc: '',
              lx: '按钮',
              bs: 'del-btn',
              cs: '',
            },
          ],
        },
        {
          key: 13,
          cdmc: '用户管理',
          tb: '#123456',
          px: '1',
          zjlj: '/main/UserManagement',
          zjmc: 'UserManagement',
          cdxdz: '',
          tzmb: '_self',
          cdyc: false,
          ycqtxx: false,
          hc: false,
          lx: '菜单',
          bs: '',
          cs: '',
          children: [
            {
              key: 131,
              cdmc: '删除按钮',
              tb: '',
              px: '1',
              zjlj: '',
              zjmc: '',
              cdxdz: '',
              tzmb: '',
              cdyc: '',
              ycqtxx: '',
              hc: '',
              lx: '按钮',
              bs: 'del-btn',
              cs: '',
            },
          ],
        },
      ],
    },
  ];
  const rowSelection = {
    onChange: (selectedRowKeys, selectedRows) => {
      console.log(`selectedRowKeys: ${selectedRowKeys}`, 'selectedRows: ', selectedRows);
    },
    onSelect: (record, selected, selectedRows) => {
      console.log(record, selected, selectedRows);
    },
    onSelectAll: (selected, selectedRows, changeRows) => {
      console.log(selected, selectedRows, changeRows);
    },
  };
  export default {
    data() {
      return {
        data,
        columns,
        rowSelection,
      };
    },
  };
</script>
