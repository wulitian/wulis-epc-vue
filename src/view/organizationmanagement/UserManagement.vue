<template>
  <div>
    <a-spin :spinning="spinning">
      <div style="margin-bottom: 10px">
        <label>账号：</label><a-input style="width: 160px" placeholder="账号" v-model="selectParams.account"/>
        <label>用户名称：</label><a-input style="width: 160px" placeholder="用户名称" v-model="selectParams.userName"/>
        <label>启用状态：</label><a-select default-value="1" style="width: 160px" v-model="selectParams.enable">
        <a-select-option value="1">
          启用
        </a-select-option>
        <a-select-option value="0">
          禁用
        </a-select-option>
      </a-select>
        <a-button type="primary" @click="onSelectUserList">搜索</a-button>
        <a-button type="primary" @click="showModal">添加</a-button>
      </div>
      <a-table :columns="columns" rowKey="id" :data-source="data" :pagination="false">
    <span slot="action" slot-scope="text, record">
      <a @click="onUpdate(record)">修改</a>
      <a-divider type="vertical" />
      <a-popconfirm
        title="你确定删除吗？"
        ok-text="确定"
        cancel-text="取消"
        @confirm="onDelete(record)"
        @cancel="onDeleteCancel"
      >
    <a href="#">删除</a>
    </a-popconfirm>

    </span>
      </a-table>
      <a-pagination show-size-changer show-quick-jumper @change="onChange" :total="page.total" :page-size="page.pageSize" :default-current="page.pageNumber"/>
    </a-spin>
    <a-modal v-model="updateModal" title="用户添加" :footer="null" @ok="updateModalOk">
      <a-form-model
        ref="ruleForm"
        :model="form"
        :rules="rules"
        :label-col="labelCol"
        :wrapper-col="wrapperCol"
      >
        <a-form-model-item label="账号" prop="account">
          <a-input v-model="form.account" placeholder="请输入账号"/>
        </a-form-model-item>
        <a-form-model-item label="用户名称" prop="userName">
          <a-input v-model="form.userName" placeholder="请输入用户名称"/>
        </a-form-model-item>
        <a-form-model-item label="密码" prop="password">
          <a-input v-model="form.password" placeholder="请输入密码"/>
        </a-form-model-item>
        <a-form-model-item label="确认密码" prop="password2">
          <a-input v-model="form.password2" placeholder="请输入密码"/>
        </a-form-model-item>
        <a-form-model-item label="电话号" prop="phoneNumber">
          <a-input v-model="form.phoneNumber" placeholder="请输入电话号"/>
        </a-form-model-item>
        <a-form-model-item label="启用状态" prop="enable">
          <a-switch v-model="form.enable" />
        </a-form-model-item>
        <a-form-model-item label="请配置角色" prop="roleIds">
          <a-checkbox-group v-model="form.roleIds">
              <a-checkbox v-for="item in roleList" :value="item.id" name="type" :key="item.id">
                {{item.roleName}}
              </a-checkbox>
          </a-checkbox-group>
        </a-form-model-item>
        <a-form-model-item :wrapper-col="{ span: 14, offset: 4 }">
          <a-button type="primary" @click="updateModalOk">
            添加
          </a-button>
          <a-button style="margin-left: 10px;" @click="resetForm">
            重置
          </a-button>
        </a-form-model-item>
      </a-form-model>
    </a-modal>
  </div>
</template>
<script>
  import {selectUserList,selectRoleList,addUser,deleteUser} from "@/api/userManagement";
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
      account: 'John Brown',
      userName: '123',
      phoneNumber: 'New York No. 1 Lake Park',
      enable: 'New York No. 1 Lake Park',
    },
    {
      id: '2',
      account: 'John Brown',
      userName: '123',
      phoneNumber: 'New York No. 1 Lake Park',
      enable: 'New York No. 1 Lake Park',
    }
  ];
  export default {
    name: 'UserManagement',
    data() {
      return {
        spinning:true,
        roleList:[],
        data,
        columns,
        selectParams:{
          account:'',
          userName:'',
          enable:''
        },
        page:{
          total:0,
          pageSize:10,
          pageNumber:1
        },
        updateModal:false,
        labelCol: { span: 8 },
        wrapperCol: { span: 14 },
        form:{
          account:'',
          userName:'',
          password:'',
          password2:'',
          phoneNumber:'',
          enable:false,
          roleIds:[]
        },
        rules: {
          account: [{ required: true, message: '请输入账号', trigger: 'blur' },{ min: 6, max: 12, message: '账号长度在6至12位', trigger: 'blur' }],
          userName: [{ required: true, message: '请输入用户名', trigger: 'blur' }],
          password: [{ required: true, message: '请输入密码', trigger: 'blur' },{ min: 6, max: 20, message: '账号长度在6至20位', trigger: 'blur' }],
          password2: [{ required: true, message: '请输入密码', trigger: 'blur' },{ min: 6, max: 20, message: '账号长度在6至20位', trigger: 'blur' },{validator: this.compareToFirstPassword}],
          phoneNumber: [{ required: true, message: '请输入电话号', trigger: 'blur' },{validator: this.phoneNumberCheck}],
          enable: [{ required: true, message: '请选择启用状态', trigger: 'change' }],
          roleIds: [{type: 'array',required: true,message: '请配置角色',trigger: 'change',}]
        }
      };
    },
    created(){
      this.onSelectUserList();
      this.onSelectRoleList();
    },
    methods:{
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
      //更新保存密码
      updateModalOk() {
        this.$refs.ruleForm.validate(valid => {
          var params = {};
          params.account = this.form.account
          params.userName= this.form.userName
          params.password= this.form.password
          params.phoneNumber= this.form.phoneNumber
          params.roleIds= this.form.roleIds
          if(this.form.enable==false){
            params.enable=0
          }else{
            params.enable=1
          }
          console.log(params)
          if (valid) {
            addUser(params)
              .then(res => {
                if(res.code==2020200){
                  console.log(res)
                  this.onSelectUserList();
                  this.updateModal = false;
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
      resetForm() {
        this.$refs.ruleForm.resetFields();
      },
      //查询用户列表
      onSelectUserList(){
        this.spinning=true;
        let param = {
          pageNumber:this.page.pageNumber,
          pageSize:this.page.pageSize
        }
        selectUserList(Object.assign(param, this.selectParams))
          .then(res => {
            this.page.total = res.data.total;
            this.data = res.data.records;
            this.spinning=false;
          })
          .catch((e) => {
            console.log(e)
            this.spinning=false;
          })
      },
      //查询当前用户可分配的角色列表
      onSelectRoleList(){
        selectRoleList()
          .then(res => {
            this.roleList = res.data;
            this.spinning=false;
          })
          .catch((e) => {
            console.log(e)
            this.spinning=false;
          })
      },
      //删除
      onDelete(item){
        let param = {
          id:item.id
        }
        deleteUser(param)
          .then(res => {
            if(res.code==2020200){
              this.onSelectUserList();
            }else{
              this.$message.info(res.message);
            }
          })
          .catch((e) => {
            console.log(e)
          })
      },
      //取消删除
      onDeleteCancel(){

      },
      //修改
      onUpdate(e){
        console.log(e)
      },
      //分页
      onChange(pageNumber,pageSize) {
        console.log('Page: ', pageNumber);
        console.log('Page: ', pageSize);
      },
      //显示弹窗
      showModal(){
        this.updateModal = true
      },
    }
  };
</script>
<style>
  .ant-pagination{
    float: right;
    margin-top: 10px;
  }
</style>
