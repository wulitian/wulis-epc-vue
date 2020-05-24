<template>
  <div>
    <!-- 页头 -->
    <div class="a-header">
      <a-col class="gutter-row" :span="4">
        <div class="gutter-box">
          <label>账号:</label>
          <a-input placeholder="账号" />
        </div>
      </a-col>
      <a-col class="gutter-row" :span="4">
        <div class="gutter-box">
          <label>用户名称:</label>
          <a-input placeholder="用户名称" />
        </div>
      </a-col>
      <a-col class="gutter-row" :span="4">
        <div class="gutter-box">
          <label>组织机构:</label>
          <a-select default-value="1" style="width: 100%;">
            <a-select-option value="1">
              中科集团
            </a-select-option>
            <a-select-option value="2">
              北大集团
            </a-select-option>
          </a-select>
        </div>
      </a-col>
      <a-col class="gutter-row" :span="4">
        <div class="gutter-box">
          <label>所属部门:</label>
          <a-tree-select
            v-model="form.ssbm"
            style="width: 100%"
            :dropdown-style="{ maxHeight: '400px', overflow: 'auto' }"
            :tree-data="treeData"
            placeholder="请选择所属部门"
            tree-default-expand-all
          >
          </a-tree-select>
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
    <a-modal v-model="modalState" :title="modalTitle" :footer="null" width="700px">
      <!--表单-->
      <a-form-model
        ref="ruleForm"
        :model="form"
        :rules="rules"
        :label-col="labelCol"
        :wrapper-col="wrapperCol"
      >
        <a-row :gutter="0">
          <a-col :span="12">
              <a-form-model-item label="账号" prop="account">
                <a-input v-model="form.account" placeholder="请输入账号"/>
              </a-form-model-item>
          </a-col>
          <a-col :span="12">
              <a-form-model-item label="用户名称" prop="userName">
                <a-input v-model="form.userName" placeholder="请输入用户名称"/>
              </a-form-model-item>
          </a-col>
          <a-col :span="12">
              <a-form-model-item label="密码" prop="password">
                <a-input v-model="form.password" placeholder="请输入密码"/>
              </a-form-model-item>
          </a-col>
          <a-col :span="12">
              <a-form-model-item label="确认密码" prop="password2">
                <a-input v-model="form.password2" placeholder="请输入密码"/>
              </a-form-model-item>
          </a-col>
          <a-col :span="12">
              <a-form-model-item label="电话号" prop="phoneNumber">
                <a-input v-model="form.phoneNumber" placeholder="请输入电话号"/>
              </a-form-model-item>
          </a-col>
          <a-col :span="12">
              <a-form-model-item label="邮箱" prop="yx">
                <a-input v-model="form.yx" placeholder="请输入邮箱"/>
              </a-form-model-item>
          </a-col>
          <a-col :span="12">
              <a-form-model-item label="性别" prop="xb">
                <a-radio-group v-model="form.xb" defaultChecked="0">
                  <a-radio :value="0">
                    男
                  </a-radio>
                  <a-radio :value="1">
                    女
                  </a-radio>
                </a-radio-group>
              </a-form-model-item>
          </a-col>
          <a-col :span="12">
              <a-form-model-item label="所属企业" prop="ssqy">
                <a-select default-value="1" v-model="form.ssqy">
                  <a-select-option value="1">
                    中科集团
                  </a-select-option>
                  <a-select-option value="2">
                    北大集团
                  </a-select-option>
                </a-select>
              </a-form-model-item>
          </a-col>
          <a-col :span="12">
              <a-form-model-item label="所属部门" prop="ssbm">
                <a-tree-select
                  v-model="form.ssbm"
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
              <a-form-model-item label="职位" prop="zw">
                <a-select default-value="1" v-model="form.zw">
                  <a-select-option value="1">
                    总裁
                  </a-select-option>
                  <a-select-option value="2">
                    董事长
                  </a-select-option>
                </a-select>
              </a-form-model-item>
          </a-col>
          <a-col :span="12">
              <a-form-model-item label="备注" prop="bz">
                <a-textarea placeholder="请输入备注" :rows="4" v-model="form.bz"/>
              </a-form-model-item>
          </a-col>
          <a-col :span="12">
              <a-form-model-item label="启用状态" prop="enable">
                <a-switch v-model="form.enable" />
              </a-form-model-item>
          </a-col>
          <a-col :span="24">
            <a-form-model-item label="角色" prop="roleIds">
              <a-checkbox-group v-model="form.roleIds">
                <a-checkbox v-for="item in roleList" :value="item.id" name="type" :key="item.id">
                  {{item.roleName}}
                </a-checkbox>
              </a-checkbox-group>
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
    {
      title: '账号',
      dataIndex: 'account',
    },
    {
      title: '用户名称',
      dataIndex: 'userName',
    },
    {
      title: '手机号码',
      dataIndex: 'phoneNumber',
    },
    {
      title: '所属企业',
      dataIndex: 'ssqy',
    },
    {
      title: '所属部门',
      dataIndex: 'shbm',
    },
    {
      title: '岗位',
      dataIndex: 'gw',
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
      account: '董事长',
      userName: '张三',
      phoneNumber: '15743261233',
      ssqy: '中科集团',
      shbm: '财务部',
      gw: '部长',
      cjsj: '2020-10-20',
      enable: '启用',
    },
    {
      id: '2',
      account: '董事长',
      userName: '张三',
      phoneNumber: '15743261233',
      ssqy: '中科集团',
      shbm: '财务部',
      gw: '部长',
      cjsj: '2020-10-20',
      enable: '启用',
    }
  ];
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
  const roleList = [
    {
      id: '1',
      roleName: '角色1',
    },
    {
      id: '2',
      roleName: '角色2',
    }
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
        modalTitle:'新建用户',
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
        roleList,
        treeData,
        labelCol: { span: 6 },
        wrapperCol: { span: 16 },
        form:{
          account:'',
          userName:'',
          password:'',
          password2:'',
          phoneNumber:'',
          yx:'',
          xb:'',
          ssqy:'',
          ssbm:'',
          zw:'',
          roleIds:[],
          bz:'',
          enable:false,
        },
        rules: {
          account: [{ required: true, message: '请输入账号', trigger: 'blur' },{ min: 6, max: 12, message: '账号长度在6至12位', trigger: 'blur' }],
          userName: [{ required: true, message: '请输入用户名', trigger: 'blur' }],
          password: [{ required: true, message: '请输入密码', trigger: 'blur' },{ min: 6, max: 20, message: '账号长度在6至20位', trigger: 'blur' }],
          password2: [{ required: true, message: '请输入密码', trigger: 'blur' },{ min: 6, max: 20, message: '账号长度在6至20位', trigger: 'blur' },{validator: this.compareToFirstPassword}],
          phoneNumber: [{ required: true, message: '请输入电话号', trigger: 'blur' },{validator: this.phoneNumberCheck}],
          yx: [{type: 'email',required: true,message: '请填写正确的邮箱',trigger: 'blur',}],
          ssqy: [{required: true,message: '请选择所属企业',trigger: 'change',}],
          ssbm: [{required: true,message: '请选择所属部门',trigger: 'change',}],
          zw: [{required: true,message: '请选择职位',trigger: 'change',}],
          roleIds: [{type: 'array',required: true,message: '请配置角色',trigger: 'change',}]
        }
      }
    },
    created () {
    },
    methods: {
      //比较两次密码校验
      compareToFirstPassword(rule, value, callback) {
        if (value && value !== this.form.password) {
          callback('两次输入密码不一致');
        } else {
          callback();
        }
      },
      //电话号校验
      phoneNumberCheck(rule, value, callback){
        let tel = /^0\d{2,3}-?\d{7,8}$/;
        let phone = /^(((13[0-9]{1})|(15[0-9]{1})|(18[0-9]{1}))+\d{8})$/;
        if(value &&(phone.test(value)||tel.test(value))) {
          callback();
        }else{
          callback('手机号输入有误');
        }
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
    name: 'UserManagement',
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
