<template>
  <div>
    <!-- 页头 -->
    <div class="a-header">
      <a-col class="gutter-row" :span="4">
        <div class="gutter-box">
          <label>机构名称:</label>
          <a-input placeholder="机构名称" />
        </div>
      </a-col>
      <a-col class="gutter-row" :span="4">
        <div class="gutter-box">
          <label>部门名称:</label>
          <a-input placeholder="部门名称" />
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
    <a-table :columns="columns" :data-source="data" :pagination="false" :row-selection="rowSelection" >
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
        <a-form-model-item label="所属机构" prop="ssjg">
          <a-input v-model="form.ssjg" placeholder="所属机构"/>
        </a-form-model-item>
        <a-form-model-item label="上级部门" prop="sjbm">
          <a-tree-select
            v-model="form.sjbm"
            style="width: 100%"
            :dropdown-style="{ maxHeight: '400px', overflow: 'auto' }"
            :tree-data="treeData"
            placeholder="请选择上级部门"
            tree-default-expand-all
          >
          </a-tree-select>
        </a-form-model-item>
        <a-form-model-item label="部门名称" prop="bmmc">
          <a-input v-model="form.bmmc" placeholder="部门名称"/>
        </a-form-model-item>
        <a-form-model-item label="排序" prop="px">
          <a-input-number id="inputNumber" v-model="form.px" :min="0" :max="100000" />
        </a-form-model-item>
        <a-form-model-item label="是否启用" prop="enable">
          <a-switch v-model="form.enable" />
        </a-form-model-item>
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
    { title: '名称',dataIndex: 'mc',key: 'mc' },
    { title: '所属机构',dataIndex: 'ssjg',key: 'ssjg' },
    { title: '排序',dataIndex: 'px',key: 'px' },
    { title: '创建时间',dataIndex: 'cjsj',key: 'cjsj' },
    { title: '启用状态',dataIndex: 'qyzt',key: 'qyzt' },
    { title: '操作',dataIndex: 'action', scopedSlots: { customRender: 'action' } },
  ];
  const data = [
    {
      key: 1,
      mc: '财务部',
      ssjg: '公司a',
      px: '1',
      cjsj: '2020-10-20',
      qyzt: '启用',
      children: [
        {
          key: 11,
          mc: '财务部',
          ssjg: '公司a',
          px: '1',
          cjsj: '2020-10-20',
          qyzt: '启用',
          children: [
            {
              key: 111,
              mc: '财务部',
              ssjg: '公司a',
              px: '1',
              cjsj: '2020-10-20',
              qyzt: '启用',
            },
          ],
        },
        {
          key: 12,
          mc: '财务部',
          ssjg: '公司a',
          px: '1',
          cjsj: '2020-10-20',
          qyzt: '启用',
          children: [
            {
              key: 121,
              mc: '财务部',
              ssjg: '公司a',
              px: '1',
              cjsj: '2020-10-20',
              qyzt: '启用',
            },
          ],
        },
        {
          key: 13,
          mc: '财务部',
          ssjg: '公司a',
          px: '1',
          cjsj: '2020-10-20',
          qyzt: '启用',
          children: [
            {
              key: 131,
              mc: '财务部',
              ssjg: '公司a',
              px: '1',
              cjsj: '2020-10-20',
              qyzt: '启用',
            }
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
  const treeData = [
    {
      title: 'Node1',
      value: '0-0',
      key: '0-0',
      children: [
        {
          value: '0-0-1',
          key: '0-0-1',
          scopedSlots: {
            // custom title
            title: 'title',
          },
        },
        {
          title: 'Child Node2',
          value: '0-0-2',
          key: '0-0-2',
        },
      ],
    },
    {
      title: 'Node2',
      value: '0-1',
      key: '0-1',
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
        data,
        rowSelection
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
  //弹窗混入
  const modalMixins = {
    data () {
      return {
        modalTitle:'新建部门',
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
        treeData,
        labelCol: { span: 8 },
        wrapperCol: { span: 14 },
        form:{
          ssjg:'',
          sjbm:'',
          bmmc:'',
          px:0,
          enable:false
        },
        rules: {
          ssjg: [{ required: true, message: '请输入所属机构', trigger: 'blur' }],
          sjbm: [{ required: true, message: '请输入上级部门', trigger: 'blur' }],
          bmmc: [{ required: true, message: '请输入部门名称', trigger: 'blur' }],
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
      }
    }
  }
  //vue实例
  export default {
    name: 'DepartmentManagement',
    mixins: [tableMixins,modalMixins,formModeMixins,headMixins],
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
