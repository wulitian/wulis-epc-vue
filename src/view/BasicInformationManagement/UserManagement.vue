<template>
  <div>
    <!-- 页头 -->
    <div class="a-header">
      <a-col class="gutter-row" :span="4">
        <div class="gutter-box">
          <label>账号:</label>
          <a-input placeholder="账号" v-model="headerForm.account"/>
        </div>
      </a-col>
      <a-col class="gutter-row" :span="4">
        <div class="gutter-box">
          <label>用户名称:</label>
          <a-input placeholder="用户名称" v-model="headerForm.userName"/>
        </div>
      </a-col>
      <a-col class="gutter-row" :span="4">
        <div class="gutter-box">
          <label>组织机构:</label>
          <a-select style="width: 100%;" v-model="headerForm.organizationId">
            <a-select-option value="" :key="-1">
              全部机构
            </a-select-option>
            <a-select-option v-for="item in organizationList" :value="item.id" :key="item.id">
              <a-tooltip>
                <template slot="title">
                  {{item.organizationName}}
                </template>
                {{item.organizationName}}
              </a-tooltip>
            </a-select-option>
          </a-select>
        </div>
      </a-col>
      <a-col class="gutter-row" :span="4">
        <div class="gutter-box">
          <label>所属部门:</label>
          <a-tree-select
            v-model="headerForm.departmentId"
            style="width: 100%"
            :dropdown-style="{ maxHeight: '400px', overflow: 'auto' }"
            :tree-data="departmentTree"
            placeholder="请选择所属部门"
            tree-default-expand-all
          >
          </a-tree-select>
        </div>
      </a-col>
      <a-col class="gutter-row" :span="4">
        <div class="gutter-box">
          <label>启用状态:</label>
          <a-select style="width: 100%;" v-model="headerForm.enable">
            <a-select-option value="">
              全部
            </a-select-option>
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
    <a-spin :spinning="spinning">
      <a-table :rowClassName="(record, index)=>{return index % 2 === 1? 'odd' : 'even'}" bordered :columns="columns" rowKey="id" :data-source="data" :pagination="false">
        <span slot="enable" slot-scope="enable">
         <a-tag color="green" v-if="enable==0">
           禁用
        </a-tag>
        <a-tag color="cyan" v-if="enable==1">
           启用
        </a-tag>
      </span>
        <span slot="action" slot-scope="text, record">
          <a @click="onToUpdate(record)">修改</a>
          <a-divider type="vertical" />
          <a-popconfirm title="你确定删除吗？" ok-text="确定" cancel-text="取消" @confirm="onDeleteConfirm(record)" @cancel="onDeleteCancel">
            <a href="#">删除</a>
          </a-popconfirm>
        </span>
      </a-table>
    </a-spin>
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
              <a-form-model-item label="密码" prop="password" >
                <a-input v-model="form.password" placeholder="请输入密码"/>
              </a-form-model-item>
          </a-col>
          <a-col :span="12">
              <a-form-model-item label="电话号" prop="phoneNumber">
                <a-input v-model="form.phoneNumber" placeholder="请输入电话号"/>
              </a-form-model-item>
          </a-col>
          <a-col :span="12">
              <a-form-model-item label="邮箱" prop="mail">
                <a-input v-model="form.mail" placeholder="请输入邮箱"/>
              </a-form-model-item>
          </a-col>
          <a-col :span="12">
              <a-form-model-item label="性别" prop="sex">
                <a-radio-group v-model="form.sex">
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
              <a-form-model-item label="所属机构" prop="organizationId">
                <a-select style="width: 100%;" v-model="form.organizationId">
                  <a-select-option v-for="item in organizationList" :value="item.id" :key="item.id">
                    <a-tooltip>
                      <template slot="title">
                        {{item.organizationName}}
                      </template>
                      {{item.organizationName}}
                    </a-tooltip>
                  </a-select-option>
                </a-select>
              </a-form-model-item>
          </a-col>
          <a-col :span="12">
              <a-form-model-item label="所属部门" prop="departmentId">
                <a-tree-select
                  v-model="form.departmentId"
                  style="width: 100%"
                  :dropdown-style="{ maxHeight: '400px', overflow: 'auto' }"
                  :tree-data="departmentTree"
                  placeholder="请选择所属部门"
                  tree-default-expand-all
                >
                </a-tree-select>
              </a-form-model-item>
          </a-col>
          <a-col :span="12">
              <a-form-model-item label="当前职位" prop="positionId">
                <a-select style="width: 100%;" v-model="form.positionId">
                  <a-select-option v-for="item in positionList" :value="item.id" :key="item.id">
                    <a-tooltip>
                      <template slot="title">
                        {{item.positionName }}
                      </template>
                      {{item.positionName}}
                    </a-tooltip>
                  </a-select-option>
                </a-select>
              </a-form-model-item>
          </a-col>
          <a-col :span="12">
            <a-form-model-item label="启用状态" prop="enable">
              <a-radio-group v-model="form.enable">
                <a-radio :value="0">
                  否
                </a-radio>
                <a-radio :value="1">
                  是
                </a-radio>
              </a-radio-group>
            </a-form-model-item>
          </a-col>
          <a-col :span="12">
              <a-form-model-item label="备注" prop="remark">
                <a-textarea placeholder="请输入备注" :rows="4" v-model="form.remark"/>
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
          <a-button type="primary" @click="onAdd" v-if="addStatus">
            添加
          </a-button>
          <a-button type="primary" @click="onUpdate" v-else>
            修改
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
  import {deleteUserById,insertUser,queryUserByid,queryUserListByOfficeId,queryUserPage,updateUser} from "@/api/BasicInformationManagement/UserManagement";
  import {queryOrganizationList} from "@/api/BasicInformationManagement/OrganizationManagement";
  import {queryDepartmentTree} from "@/api/BasicInformationManagement/DepartmentManagement";
  import {queryPositionList} from "@/api/BasicInformationManagement/PositionManagement";
  import {queryRoleList} from "@/api/SystemPermissionsManagement/RoleManagement";
  const columns = [
    {title: '账号',dataIndex: 'account',},
    {title: '用户名称',dataIndex: 'userName',},
    {title: '手机号码',dataIndex: 'phoneNumber',},
    {title: '所属企业', dataIndex: 'organizationName',},
    {title: '所属部门', dataIndex: 'departmentName',},
    {title: '职位', dataIndex: 'positionName',},
    {title: '创建时间', dataIndex: 'createTime',},
    {title: '启用状态',dataIndex: 'enable',key: 'enable' ,scopedSlots: { customRender: 'enable' }, },
    {title: '操作', key: 'action', scopedSlots: { customRender: 'action' },},
  ];
  const data = [
    {
      id: '1',
      account: '董事长',
      userName: '张三',
      phoneNumber: '15743261233',
      organizationName: '中科集团',
      departmentName: '财务部',
      positionName: '部长',
      cjsj: '2020-10-20',
      enable: '启用',
    },
    {
      id: '2',
      account: '董事长',
      userName: '张三',
      phoneNumber: '15743261233',
      organizationName: '中科集团',
      departmentName: '财务部',
      positionName: '部长',
      cjsj: '2020-10-20',
      enable: '启用',
    }
  ];
  //头部混入
  const headMixins = {
    data () {
      return {
        headerForm:{
          userName:'',
          account:'',
          organizationId:'',
          departmentId:'',
          enable:'',
        }
      }
    },
    created () {
    },
    methods: {
      // 搜索
      onSearch () {
        if(this.headerForm.departmentId=='1'){
          this.headerForm.departmentId='';
        }
        this.queryUserPage();
      },
      // 去添加
      onToAdd () {
        this.modalTitle='新建用户';
        this.addStatus = true;
        this.modalState = true;
        this.passwordState = true;
        this.form={
          account:'',
          userName:'',
          password:'',
          phoneNumber:'',
          mail:'',
          sex:0,
          organizationId:'',
          departmentId:'',
          positionId:'',
          roleIds:[],
          remark:'',
          enable:1,
        }
        this.rules = this.rulesAdd;
      }
    }
  };
  //列表混入
  const tableMixins = {
    data () {
      return {
        columns,
        data,
        page:{
          pageNumber:1,
          pageSize:10
        },
        organizationList:[],
        departmentTree:[],
        positionList:[],
        roleList:[],
      }
    },
    created () {
      this.queryUserPage();
      this.queryOrganizationList();
      this.queryDepartmentTreeSelect();
      this.queryPositionList();
      this.queryRoleList();
    },
    methods: {
      //查询机构列表
      queryOrganizationList(){
        queryOrganizationList()
          .then(res => {
            if(res.code==2020200){
              this.organizationList = res.data;
            }else{
              this.$message.info(res.message);
            }
          })
          .catch((e) => {
            console.log(e)
          })
      },
      //查询部门树
      queryDepartmentTreeSelect(){
        queryDepartmentTree()
          .then(res => {
            if(res.code==2020200){
              this.departmentTree = res.data;
              this.getTree(this.departmentTree);
            }else{
              this.$message.info(res.message);
            }
          })
          .catch((e) => {
            console.log(e)
          })
      },
      //查询部门树
      queryPositionList(){
        queryPositionList()
          .then(res => {
            if(res.code==2020200){
              this.positionList = res.data;
            }else{
              this.$message.info(res.message);
            }
          })
          .catch((e) => {
            console.log(e)
          })
      },
      //查询部门树
      queryRoleList(){
        queryRoleList()
          .then(res => {
            if(res.code==2020200){
              this.roleList = res.data;
            }else{
              this.$message.info(res.message);
            }
          })
          .catch((e) => {
            console.log(e)
          })
      },
      //查询用户列表
      queryUserPage(){
        this.spinning = true;
        queryUserPage(Object.assign(this.page,this.headerForm))
          .then(res => {
            if(res.code==2020200){
              this.data = res.data.records;
              this.total = res.data.total;
              this.spinning = false;
            }else{
              this.$message.info(res.message);
              this.spinning = false;
            }
          })
          .catch((e) => {
            console.log(e)
          })
      },
      // 查看
      onView (record) {
        console.log(record)
      },
      // 修改
      onToUpdate (record) {
        this.modalState = true;
        this.modalTitle = '修改用户';
        this.addStatus = false;
        this.rules = this.rulesUpdate;
        this.passwordState = false;
        queryUserByid({id:record.id})
          .then(res => {
            if(res.code==2020200){
                this.form.account= res.data.account;
                this.form.userName= res.data.userName;
                this.form.phoneNumber= res.data.phoneNumber;
                this.form.mail= res.data.mail;
                this.form.sex= res.data.sex;
                this.form.organizationId= res.data.organizationId;
                this.form.departmentId= res.data.departmentId+'';
                this.form.positionId= res.data.positionId+'';
                this.form.roleIds= res.data.roleIds.map(String);
                this.form.remark= res.data.remark;
                this.form.enable= res.data.enable;
                this.id = res.data.id;
            }else{
              this.$message.info(res.message);
            }
          })
          .catch((e) => {
            console.log(e)
          })
      },
      // 删除确认
      onDeleteConfirm (record) {
        deleteUserById({id:record.id})
          .then(res => {
            if(res.code==2020200){
              this.queryUserPage();
              this.$message.info(res.message);
            }else{
              this.$message.info(res.message);
            }
          })
          .catch((e) => {
            console.log(e)
          })
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
      onPaginationChange (pageNumber, pageSize) {
        this.page.pageNumber = pageNumber;
        this.page.pageSize = pageSize;
        this.queryUserPage();
      },
      // 分页下拉改变
      onShowSizeChange (pageNumber, pageSize) {
        this.page.pageNumber = pageNumber
        this.page.pageSize = pageSize
        this.queryUserPage();
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
        labelCol: { span: 6 },
        wrapperCol: { span: 16 },
        addStatus:true,
        id:'',
        passwordState:true,
        form:{
          account:'',
          userName:'',
          password:'',
          phoneNumber:'',
          mail:'',
          sex: 0,
          organizationId:'',
          departmentId:'',
          positionId:'',
          roleIds:[],
          remark:'',
          enable:1,
        },
        rules:[],
        rulesUpdate: {
          account: [{ required: true, message: '请输入账号', trigger: 'blur' },{ min: 6, max: 12, message: '账号长度在6至12位', trigger: 'blur' }],
          userName: [{ required: true, message: '请输入用户名', trigger: 'blur' }],
          phoneNumber: [{ required: true, message: '请输入电话号', trigger: 'blur' },{validator: this.phoneNumberCheck}],
          mail: [{type: 'email',required: true,message: '请填写正确的邮箱',trigger: 'blur',}],
          organizationId: [{required: true,message: '请选择所属企业',trigger: 'change',}],
          departmentId: [{required: true,message: '请选择所属部门',trigger: 'change',}],
          positionId: [{required: true,message: '请选择职位',trigger: 'change',}],
          roleIds: [{type: 'array',required: true,message: '请配置角色',trigger: 'change',}]
        },
        rulesAdd: {
          account: [{ required: true, message: '请输入账号', trigger: 'blur' },{ min: 6, max: 12, message: '账号长度在6至12位', trigger: 'blur' }],
          userName: [{ required: true, message: '请输入用户名', trigger: 'blur' }],
          password: [{ required: true, message: '请输入密码', trigger: 'blur' },{ min: 6, max: 20, message: '账号长度在6至20位', trigger: 'blur' }],
          phoneNumber: [{ required: true, message: '请输入电话号', trigger: 'blur' },{validator: this.phoneNumberCheck}],
          mail: [{type: 'email',required: true,message: '请填写正确的邮箱',trigger: 'blur',}],
          organizationId: [{required: true,message: '请选择所属企业',trigger: 'change',}],
          departmentId: [{required: true,message: '请选择所属部门',trigger: 'change',}],
          positionId: [{required: true,message: '请选择职位',trigger: 'change',}],
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
            insertUser(this.form)
              .then(res => {
                if(res.code==2020200){
                  this.queryUserPage();
                  this.modalState = false;
                  this.$message.info(res.message);
                }else{
                  this.$message.info(res.message);
                }
              })
              .catch((e) => {
                console.log(e)
              })
          } else {
            return false;
          }
        });
      },
      onUpdate(){
        this.$refs.ruleForm.validate(valid => {
          if (valid) {
            updateUser(Object.assign(this.form,{id:this.id}))
              .then(res => {
                if(res.code==2020200){
                  this.queryUserPage();
                  this.modalState = false;
                }else{
                  this.$message.info(res.message);
                }
              })
              .catch((e) => {
                console.log(e)
              })
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
        spinning:false
      }
    },
    created(){
    },
    methods:{
      //修改tree的key值
      getTree(data) {
        for(let i = 0; i < data.length; i++) {
          data[i].title = data[i].departmentName;
          data[i].value = data[i].id;
          data[i].key = data[i].id;
          if(data[i].nodes&&data[i].nodes.length>0){
            data[i].children = data[i].nodes;
            this.getTree(data[i].nodes)
          }
        }
      }
    }
  }
</script>

<style scoped>
  /deep/ .even{
    background:#ffffff;
  }
  /deep/ .odd{
    background: #fafafa;
  }
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
