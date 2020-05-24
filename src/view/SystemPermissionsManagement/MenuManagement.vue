<template>
  <div>
    <!-- 页头 -->
    <div class="a-header">
      <a-col class="gutter-row" :span="4">
        <div class="gutter-box">
          <label>菜单名称:</label>
          <a-input placeholder="菜单名称" />
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
    <a-modal v-model="modalState" :title="modalTitle" :footer="null" width="700px">
      <!--表单-->
      <a-form-model
        ref="ruleForm"
        :model="form"
        :rules="rules"
        :label-col="labelCol"
        :wrapper-col="wrapperCol"
      >
        <a-form-model-item  label="菜单类型" prop="cdlx">
          <a-radio-group v-model="form.cdlx"  @change="onCdlxChange">
            <a-radio :value="0">
              菜单
            </a-radio>
            <a-radio :value="1">
              按钮
            </a-radio>
          </a-radio-group>
        </a-form-model-item>
        <a-row v-if="form.cdlx == 0">
          <a-col :span="12">
            <a-form-model-item label="上级菜单" prop="sjcd">
              <a-tree-select
                v-model="form.sjcd"
                style="width: 100%"
                :dropdown-style="{ maxHeight: '400px', overflow: 'auto' }"
                :tree-data="treeData"
                placeholder="请选择所属部门"
                tree-default-expand-all
              >
              </a-tree-select>
            </a-form-model-item>
          </a-col>
          <a-col :span="12">
            <a-form-model-item label="名称" prop="mc">
              <a-input v-model="form.mc" placeholder="请输入菜单名称"/>
            </a-form-model-item>
          </a-col>
          <a-col :span="12">
            <a-form-model-item label="菜单图标" prop="cdtb">
              <a-input v-model="form.cdtb" placeholder="请输入菜单图标"/>
            </a-form-model-item>
          </a-col>
          <a-col :span="12">
            <a-form-model-item label="排序" prop="px">
              <a-input v-model="form.px" placeholder="请输入序号"/>
            </a-form-model-item>
          </a-col>
          <a-col :span="12">
            <a-form-model-item label="跳转类型" prop="tzlx">
              <a-select default-value="_self" v-model="form.tzlx">
                <a-select-option value="_self">
                  _self
                </a-select-option>
                <a-select-option value="_blank">
                  _blank
                </a-select-option>
                <a-select-option value="_top">
                  _top
                </a-select-option>
                <a-select-option value="_parent">
                  _parent
                </a-select-option>
              </a-select>
            </a-form-model-item>
          </a-col>
          <a-col :span="12">
            <a-form-model-item label="路由地址" prop="lydz">
              <a-input v-model="form.lydz" placeholder="请输入路由地址"/>
            </a-form-model-item>
          </a-col>
          <a-col :span="12">
            <a-form-model-item label="组件路径" prop="zjlj">
              <a-input v-model="form.zjlj" placeholder="请输入组件路径"/>
            </a-form-model-item>
          </a-col>
          <a-col :span="12">
            <a-form-model-item label="组件名称" prop="zjmc">
              <a-input v-model="form.zjmc" placeholder="请输入组件名称"/>
            </a-form-model-item>
          </a-col>
          <a-col :span="12">
            <a-form-model-item label="重定向地址" prop="cdxdz">
              <a-input v-model="form.cdxdz" placeholder="请输入重定向地址"/>
            </a-form-model-item>
          </a-col>
          <a-col :span="12">
            <a-form-model-item label="路由缓存" prop="lyhc">
              <a-radio-group v-model="form.lyhc" defaultChecked="0">
                <a-radio :value="0">
                  是
                </a-radio>
                <a-radio :value="1">
                  否
                </a-radio>
              </a-radio-group>
            </a-form-model-item>
          </a-col>
          <a-col :span="12">
            <a-form-model-item label="隐藏tab" prop="yctab">
              <a-radio-group v-model="form.yctab" defaultChecked="0">
                <a-radio :value="0">
                  是
                </a-radio>
                <a-radio :value="1">
                  否
                </a-radio>
              </a-radio-group>
            </a-form-model-item>
          </a-col>
          <a-col :span="12">
            <a-form-model-item label="启用状态" prop="enable">
              <a-switch v-model="form.enable" />
            </a-form-model-item>
          </a-col>
        </a-row>
        <a-row v-else>
          <a-col :span="12">
            <a-form-model-item label="上级菜单" prop="sjcd">
              <a-tree-select
                v-model="form.sjcd"
                style="width: 100%"
                :dropdown-style="{ maxHeight: '400px', overflow: 'auto' }"
                :tree-data="treeData"
                placeholder="请选择所属部门"
                tree-default-expand-all
              >
              </a-tree-select>
            </a-form-model-item>
          </a-col>
          <a-col :span="12">
            <a-form-model-item label="名称" prop="mc">
              <a-input v-model="form.mc" placeholder="请输入菜单名称"/>
            </a-form-model-item>
          </a-col>
          <a-col :span="12">
            <a-form-model-item label="权限标识" prop="qxbs">
              <a-input v-model="form.qxbs" placeholder="请输入权限标识"/>
            </a-form-model-item>
          </a-col>
          <a-col :span="12">
            <a-form-model-item label="排序" prop="px">
              <a-input v-model="form.px" placeholder="请输入序号"/>
            </a-form-model-item>
          </a-col>
          <a-col :span="12">
            <a-form-model-item label="启用状态" prop="enable">
              <a-switch v-model="form.enable" />
            </a-form-model-item>
          </a-col>
        </a-row>
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
              key: 132,
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
              key: 133,
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
        modalTitle:'新建菜单',
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
          cdlx:0,
          sjcd:'',
          mc:'',
          cdtb:'',
          px:0,
          tzlx:'-self',
          lydz:'',
          zjlj:'',
          zjmc:'',
          cdxdz:'',
          lyhc:'',
          yctab:'',
          qxbs:'',
          enable:false
        },
        rules: {
          sjcd: [{ required: true, message: '请选择上级菜单', trigger: 'change' }],
          mc: [{ required: true, message: '请输入名称', trigger: 'blur' }],
          qxbs: [{ required: true, message: '请输入权限标识', trigger: 'blur' }],
          lydz: [{ required: true, message: '请输入路由地址', trigger: 'blur' }],
          zjlj: [{ required: true, message: '请输入组件路径', trigger: 'blur' }],
          zjmc: [{ required: true, message: '请输入组件名称', trigger: 'blur' }],
        }
      }
    },
    created () {
    },
    methods: {
      //菜单切换
      onCdlxChange(e){
      },
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
    name: 'MenuManagement',
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
