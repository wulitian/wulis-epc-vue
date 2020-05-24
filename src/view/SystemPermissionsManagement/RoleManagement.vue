<template>
  <div>
    <!-- 页头 -->
    <div class="a-header">
      <a-col class="gutter-row" :span="4">
        <div class="gutter-box">
          <label>角色名称:</label>
          <a-input placeholder="角色名称" />
        </div>
      </a-col>
      <a-col class="gutter-row" :span="4">
        <div class="gutter-box">
          <label>权限字符:</label>
          <a-input placeholder="权限字符" />
        </div>
      </a-col>
      <a-col class="gutter-row" :span="4">
        <div class="gutter-box">
          <label>启用状态:</label>
          <a-select default-value="1" style="width: 100%;">
            <a-select-option value="1">
              启用
            </a-select-option>
            <a-select-option value="0">
              禁用
            </a-select-option>
          </a-select>
        </div>
      </a-col>
      <span style="margin-left: 10px">
        <a-button type="primary" @click="onSearch">查询</a-button>
        <a-button type="primary" @click="onToAdd">新增</a-button>
      </span>
    </div>
    <!-- 列表 -->
    <a-table :columns="columns" rowKey="id" :data-source="data" :pagination="false">
      <span slot="action" slot-scope="text, record">
        <a @click="onView(record)">查看</a>
        <a-divider type="vertical" />
        <a @click="onUpdate(record)">修改</a>
        <a-divider type="vertical" />
        <a-popconfirm title="你确定删除吗？" ok-text="确定" cancel-text="取消" @confirm="onDeleteConfirm(record)" @cancel="onDeleteCancel">
          <a href="#">删除</a>
        </a-popconfirm>
      </span>
    </a-table>
    <!-- 分页 -->
    <a-pagination v-if="total>=10" style="float: right;margin-top: 10px" :total="total" :default-current="1" show-size-changer show-quick-jumper @change="onPaginationChange" @showSizeChange="onShowSizeChange"/>
    <!--弹窗-->
    <a-modal v-model="modalState" :title="modalTitle" :footer="null">
      <!--表单-->
      <a-form-model
        ref="ruleForm"
        :model="form"
        :rules="rules"
        :label-col="labelCol"
        :wrapper-col="wrapperCol"
      >
        <a-form-model-item label="角色名称" prop="jsmc">
          <a-input v-model="form.jsmc" placeholder="请输入角色名称"/>
        </a-form-model-item>
        <a-form-model-item label="权限字符" prop="qxzf">
          <a-input v-model="form.qxzf" placeholder="请输入权限字符"/>
        </a-form-model-item>
        <a-form-model-item label="排序" prop="px">
          <a-input v-model="form.px" placeholder="请输入排序"/>
        </a-form-model-item>
        <a-form-model-item label="是否启用" prop="enable">
          <a-switch v-model="form.enable" />
        </a-form-model-item>
        <a-form-model-item label="备注" prop="bz">
          <a-textarea placeholder="请输入备注" :rows="4" v-model="form.bz"/>
        </a-form-model-item >
        <a-form-model-item label="菜单权限" prop="cdqx">
          <a-tree
            v-model="form.cdqx"
            checkable
            :expanded-keys="expandedKeys"
            :auto-expand-parent="autoExpandParent"
            :selected-keys="selectedKeys"
            :tree-data="treeData"
            @expand="onTreeExpand"
            @select="onTreeSelect"
          />
        </a-form-model-item >

        <a-form-model-item :wrapper-col="{ span: 14, offset: 4 }">
          <a-button type="primary" @click="onAdd">
            添加
          </a-button>
          <a-button style="margin-left: 10px;" @click="onResetForm">
            重置
          </a-button>
        </a-form-model-item>
      </a-form-model>
    </a-modal>
  </div>
</template>

<script>
  const columns = [
    {
      title: '角色名称',
      dataIndex: 'jsmc',
    },
    {
      title: '权限字符',
      dataIndex: 'qxzf',
    },
    {
      title: '排序',
      dataIndex: 'px',
    },
    {
      title: '创建时间',
      dataIndex: 'cjsj',
    },
    {
      title: '启用状态',
      dataIndex: 'enable',
    },
    {
      title: '操作',
      key: 'action',
      scopedSlots: { customRender: 'action' },
    },
  ];
  const data = [
    {
      id: '1',
      jsmc: 'admin',
      qxzf: 'system',
      px: '0',
      cjsj: '2020-10-10',
      enable: '启用',
    },
    {
      id: '2',
      jsmc: 'order',
      qxzf: 'order',
      px: '1',
      cjsj: '2020-10-10',
      enable: '启用',
    }
  ];
  const treeData = [
    {
      title: '0-0',
      key: '0-0',
      children: [
        {
          title: '0-0-0',
          key: '0-0-0',
          children: [
            { title: '0-0-0-0', key: '0-0-0-0' },
            { title: '0-0-0-1', key: '0-0-0-1' },
            { title: '0-0-0-2', key: '0-0-0-2' },
          ],
        },
        {
          title: '0-0-1',
          key: '0-0-1',
          children: [
            { title: '0-0-1-0', key: '0-0-1-0' },
            { title: '0-0-1-1', key: '0-0-1-1' },
            { title: '0-0-1-2', key: '0-0-1-2' },
          ],
        },
        {
          title: '0-0-2',
          key: '0-0-2',
        },
      ],
    },
    {
      title: '0-1',
      key: '0-1',
      children: [
        { title: '0-1-0-0', key: '0-1-0-0' },
        { title: '0-1-0-1', key: '0-1-0-1' },
        { title: '0-1-0-2', key: '0-1-0-2' },
      ],
    },
    {
      title: '0-2',
      key: '0-2',
    },
  ];
  //头部混入
  const headMixins = {
    data () {
      return {
        columns,
        data
      }
    },
    created () {
    },
    methods: {
      // 搜索
      onSearch () {
      },
      // 去添加
      onToAdd () {
        this.modalState = true
      }
    }
  };
  //列表混入
  const tableMixins = {
    data () {
      return {
        columns,
        data
      }
    },
    created () {
    },
    methods: {
      // 查看
      onView (record) {
        console.log(record)
      },
      // 修改
      onUpdate (record) {
        console.log(record)
      },
      // 删除确认
      onDeleteConfirm (record) {
        console.log(record)
      },
      // 删除取消
      onDeleteCancel (record) {
        console.log(record)
      }
    }
  };
  //分页混入
  const paginationMixins = {
    data () {
      return {
        total:0
      }
    },
    created () {
    },
    methods: {
      // 分页页码改变
      onPaginationChange (page, pageSize) {
        console.log(page,pageSize)
      },
      // 分页下拉改变
      onShowSizeChange (current, size) {
        console.log(current,size)
      }
    }
  };
  //弹窗混入
  const modalMixins = {
    data () {
      return {
        modalTitle:'新建角色',
        modalState:false
      }
    },
    created () {
    },
    methods: {
    }
  };
  //表单混入
  const formModeMixins = {
    data () {
      return {
        expandedKeys: [],
        autoExpandParent: true,
        checkedKeys: [],
        selectedKeys: [],
        treeData,
        labelCol: { span: 8 },
        wrapperCol: { span: 14 },
        form:{
          jsmc:'',
          qxzf:'',
          px:0,
          bz:'',
          enable:false,
          cdqx:[]
        },
        rules: {
          JgName: [{ required: true, message: '请输入机构名称', trigger: 'blur' }],
          qxzf: [{ required: true, message: '请输入权限字符', trigger: 'blur' }],
          px: [{ required: true, message: '请输入序号', trigger: 'blur' }],
        }
      }
    },
    created () {
    },
    methods: {
      //添加
      onAdd(){
        this.$refs.ruleForm.validate(valid => {
          if (valid) {
            // addUser(params)
            //   .then(res => {
            //     if(res.code==2020200){
            //       console.log(res)
            //       this.onSelectUserList();
            //       this.updateModal = false;
            //     }else{
            //       this.$message.info(res.message);
            //     }
            //   })
            //   .catch((e) => {
            //     console.log(e)
            //   })
          } else {
            return false;
          }
        });
      },
      //重置表单
      onResetForm(){
        this.$refs.ruleForm.resetFields();
      },
      onTreeExpand(expandedKeys) {
        console.log('onExpand', expandedKeys);
        // if not set autoExpandParent to false, if children expanded, parent can not collapse.
        // or, you can remove all expanded children keys.
        this.expandedKeys = expandedKeys;
        this.autoExpandParent = false;
      },
      onTreeCheck(checkedKeys) {
        console.log('onCheck', checkedKeys);
        this.checkedKeys = checkedKeys;
      },
      onTreeSelect(selectedKeys, info) {
        console.log('onSelect', info);
        this.selectedKeys = selectedKeys;
      },
    }
  }
  //vue实例
  export default {
    name: 'RoleManagement',
    mixins: [tableMixins,paginationMixins,modalMixins,formModeMixins,headMixins],
    data () {
      return {
      }
    },
    created(){
    },
    methods:{
    }
  }
</script>

<style scoped>
  tr:last-child td {
    padding-bottom: 0;
  }
  .gutter-row{
    margin-bottom: 10px;
  }
  .gutter-box{
    padding-left: 80px;
  }
  .gutter-box>label{
    width: 72px;
    text-align: right;
    line-height: 32px;
    position: absolute;
    left: 0;
  }
</style>
