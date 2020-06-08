<template>
  <div>
    <a-card title="组信息设置" >
      <a-col class="gutter-row" :span="6">
        <div class="gutter-box">
          <label>审核组编号:</label>
          <a-input v-model="form.teamNumber"/>
        </div>
      </a-col>
      <a-col class="gutter-row" :span="6">
        <div class="gutter-box">
          <label>审核组名称:</label>
          <a-input v-model="form.teamName"/>
        </div>
      </a-col>
      <a-col class="gutter-row" :span="6">
        <div class="gutter-box">
          <label>备注:</label>
          <a-input v-model="form.remark"/>
        </div>
      </a-col>
      <a-col class="gutter-row" :span="6">
        <div class="gutter-box">
          <label>启用状态:</label>
            <a-radio-group v-model="form.enable">
              <a-radio :value="0">
                否
              </a-radio>
              <a-radio :value="1">
                是
              </a-radio>
            </a-radio-group>
        </div>
      </a-col>
    </a-card>
    <a-card title="组信息设置" style="margin-top: 10px">
      <!-- 页头 -->
      <!--<div class="a-header">-->
        <!--<a-col class="gutter-row" :span="4">-->
          <!--<div class="gutter-box">-->
            <!--<label>组员姓名:</label>-->
            <!--<a-input v-model="headerForm.zyxm"/>-->
          <!--</div>-->
        <!--</a-col>-->
        <!--<a-col class="gutter-row" :span="4">-->
          <!--<div class="gutter-box">-->
            <!--<label>组员工号:</label>-->
            <!--<a-input v-model="headerForm.zygh"/>-->
          <!--</div>-->
        <!--</a-col>-->
        <!--<a-col class="gutter-row" :span="4">-->
          <!--<div class="gutter-box">-->
            <!--<label>所在组织:</label>-->
            <!--<a-input v-model="headerForm.szzz"/>-->
          <!--</div>-->
        <!--</a-col>-->
        <!--<a-col class="gutter-row" :span="4">-->
          <!--<div class="gutter-box">-->
            <!--<label>审核职责:</label>-->
            <!--<a-input v-model="headerForm.shzz"/>-->
          <!--</div>-->
        <!--</a-col>-->
        <!--<span style="margin-left: 10px">-->
          <!--<a-button type="primary" @click="onSearch">查询</a-button>-->
          <!--<a-button type="primary" @click="onToAdd">新增成员</a-button>-->
        <!--</span>-->
      <!--</div>-->
      <!-- 列表 -->
      <a-spin :spinning="spinning">
        <a-table :rowClassName="(record, index)=>{return index % 2 === 1? 'odd' : 'even'}" bordered :columns="columns" rowKey="id" :data-source="data" :pagination="false">
        <span slot="action" slot-scope="text, record">
          <a @click="onToUpdate(record)">配置审核人员</a>
        </span>
        </a-table>
      </a-spin>
      <!-- 分页 -->
      <a-pagination v-if="total>=10" style="float: right;margin-top: 10px" :total="total" :default-current="1" show-size-changer show-quick-jumper @change="onPaginationChange" @showSizeChange="onShowSizeChange"/>
      <!--弹窗-->
    </a-card>
    <a-modal v-model="modalState" :title="modalTitle" :footer="null" width="900px">
      <!--表单-->
      <div style="position: relative;padding-left: 300px;height: 500px">
        <div style="width: 260px;position: absolute;left: 0px;height: 40px;overflow-y: auto;">
        <a-select style="width: 100%;" v-model="organization" @change="organizationChange" placeholder="请选择选择机构">
          <a-select-option v-for="item in organizationList" :value="item.id" :key="item.id">
            {{item.organizationName}}
          </a-select-option>
        </a-select>
        </div>
        <div style="width: 260px;position: absolute;left: 0;top: 40px;bottom:0;border: 1px solid #dddddd;overflow-y: auto;">
          <a-tree
            :tree-data="departmentTree"
            show-line
            default-expand-all
            @expand="onExpand"
            @select="onSelect"
          />
        </div>
        <div style="height: 100%;width: 260px;position: absolute;left: 280px;top: 0;border: 1px solid #dddddd;overflow-y: auto;">
          <div  v-for="(item,i) in mockData" :key="item.id" :class="{list:true,active:item.active}" @click="onActive(item,i)">{{item.userName}}</div>
        </div>
        <div @click="onRight" style="cursor:pointer;text-align:center;font-size: 30px;color: #00b5a4;height: 50px;width: 50px;position: absolute;left: 540px;top: 198px;border: 1px solid rgb(221, 221, 221);overflow-y: auto;">
          <a-icon type="forward" />
        </div>
        <div style="height: 100%;width: 260px;position: absolute;left: 590px;top: 0;border: 1px solid #dddddd;overflow-y: auto;">
          <div class="list" v-for="item in targetKeys" :key="item.id">{{item.userName}}</div>
        </div>
      </div>
      <div style="text-align: center;margin-top: 10px">
        <a-button type="primary" @click="onSaveUsers" >
          保存
        </a-button>
      </div>
    </a-modal>
    <div style="text-align: center;margin-top: 10px">
      <a-button type="primary" @click="goBack">
        返回
      </a-button>
      <a-button type="primary" @click="onSave" v-if="addStatus">
        添加
      </a-button>
      <a-button type="primary" @click="onUpdate" v-else>
        修改
      </a-button>
    </div>
  </div>
</template>

<script>
  import Vue from 'vue'
  import {deleteReviewTeamById,insertReviewTeam,queryReviewTeamByid,queryReviewTeamList,queryReviewTeamPage,updateReviewTeam,queryReviewRoleList} from "@/api/ControlProjectPlan/PlanAuditTeam";
  import {queryOrganizationList} from "@/api/BasicInformationManagement/OrganizationManagement";
  import {queryDepartmentTree} from "@/api/BasicInformationManagement/DepartmentManagement";
  import {queryUserListByOfficeId} from "@/api/BasicInformationManagement/UserManagement";

  const columns = [
    { title: '审核角色',dataIndex: 'roleName',key: 'roleName' },
    // { title: '当前人数',dataIndex: 'dqrs',key: 'dqrs' },
    { title: '操作',dataIndex: 'action', scopedSlots: { customRender: 'action' } },
  ];
  const data = [
    {
      id: '1',
      zyxm: '张三',
      zygh: '001',
      szzz: '承建单位',
      dqrs: '0',
      roleName: '项目管理公司',
    },
    {
      id: '2',
      zyxm: '李四',
      zygh: '002',
      szzz: '承建单位',
      dqrs: '2',
      roleName: '中介公司',
    },
    {
      id: '3',
      zyxm: '王五',
      zygh: '003',
      szzz: '承建单位',
      dqrs: '10',
      roleName: '审计部门',
    },
  ];
  //弹窗混入
  const modalMixins = {
    data () {
      return {
        modalState:false,
        modalTitle:'',
        addStatus:true,
      }
    },
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
        this.queryOrganizationPage();
      },
      // 分页下拉改变
      onShowSizeChange (pageNumber, pageSize) {
        this.page.pageNumber = pageNumber
        this.page.pageSize = pageSize
        this.queryOrganizationPage();
      }
    }
  };
  //头部混入
  const headMixins = {
    data () {
      return {
        headerForm:{
          zyxm:'',
          zygh:'',
          szzz:'',
          zhzz:''
        }
      }
    },
    methods: {
      // 去添加
      onToAdd () {
        this.modalState = true
        this.modalTitle = '新增';
        this.addStatus = true;
        this.form = {
          zyxm:'',
          zygh:'',
          szzz:1
        };
      }
    }
  };
  //卡片混入
  const cardMixins = {
    data () {
      return {
        cardForm:{
          zyxm:'',
          zygh:'',
          szzz:'',
          zhzz:''
        }
      }
    },
    methods: {
      goBack() {
        this.$router.go(-1)
      },
      // 保存
      onSave () {
        if(this.form.teamNumber == ''){
          this.$message.info('审核组编号');
          return false;
        }
        if(this.form.teamName == ''){
          this.$message.info('审核组名称');
          return false;
        }
        if(this.form.roles[0].userIds.length == 0){
          this.$message.info('请为审核管理部门配置审批人');
          return false;
        }
        if(this.form.roles[1].userIds.length == 0){
          this.$message.info('请为中介公司配置审批人');
          return false;
        }
        if(this.form.roles[2].userIds.length == 0){
          this.$message.info('请为审计公司配置审批人');
          return false;
        }
        insertReviewTeam(this.form)
          .then(res => {
            if(res.code==2020200){
              console.log(res)
              this.$message.info(res.message);
              this.goBack();
            }else{
              this.$message.info(res.message);
            }
          })
          .catch((e) => {
            console.log(e)
          })
      },
      onUpdate(){
        updateReviewTeam(Object.assign(this.form,{id:this.id}))
          .then(res => {
            if(res.code==2020200){
              console.log(res)
              this.$message.info(res.message);
              this.goBack();
            }else{
              this.$message.info(res.message);
            }
          })
          .catch((e) => {
            console.log(e)
          })
      },
    }
  };
  //穿梭盒子混入
  const transferMixins= {
    data () {
      return {
        mockData: [],
        targetKeys: [],
      }
    },
    methods: {
      onSelect(keys, event) {
        if(keys[0]!=null){
          let params = {id:keys[0]}
          console.log(params)
          queryUserListByOfficeId({id:keys[0]})
            .then(res => {
              if(res.code==2020200){
                console.log(res)
                this.mockData = res.data;
                this.mockData.forEach((e,i)=>{
                  e.active=false;
                })
              }else{
                this.$message.info(res.message);
              }
            })
            .catch((e) => {
              console.log(e)
            })
        }

      },
      onActive(item,i){
        if(item.active){
          item.active = false
        }else{
          item.active = true
        }
        Vue.set(this.mockData,i,item)
      },
      ishas(id){
        let state = true;
        console.log(state)
        this.targetKeys.forEach((e)=>{
          if(e.id==id){
            state = false;
          }
        })
        console.log(state)
        return state
      },
      onRight(){
        this.mockData.forEach((e,i)=>{
          if(e.active){
            if(this.ishas(e.id)){
              this.targetKeys.push(e)
            }else{
              this.$message.info('存在重复的'+e.userName+'已过滤');
            }
          }
          e.active = false;
          Vue.set(this.mockData,i,e)
        })
      },
      onExpand() {
        console.log('Trigger Expand');
      },
      filterOption(inputValue, option) {
        return option.description.indexOf(inputValue) > -1;
      },
      handleChange(targetKeys, direction, moveKeys) {
        console.log(targetKeys, direction, moveKeys);
        this.targetKeys = targetKeys;
        console.log(this.targetKeys)
      },
      handleSearch(dir, value) {
        console.log('search:', dir, value);
      },
    },
  };
  //表单混入
  const formModeMixins = {
    data () {
      return {
        labelCol: { span: 8 },
        wrapperCol: { span: 14 },
        id:'',
        roleType:'',
        organization:'',
        form:{
          enable: 1,
          remark: '',
          roles: [
            {
              roleType: '1',
              roleName: '',
              userIds: [],
              userIdsList: []
            },
            {
              roleType: '2',
              roleName: '',
              userIds: [],
              userIdsList: []
            },
            {
              roleType: '3',
              roleName: '',
              userIds: [],
              userIdsList: []
            }
          ],
          teamName: '',
          teamNumber: ''
        },
      }
    },
    created () {
    },
    methods: {
      //添加
      onAdd(){
        console.log(this.form)
        insertReviewTeam(this.form)
          .then(res => {
            if(res.code==2020200){
              console.log(res)
              this.$message.info(res.message);
            }else{
              this.$message.info(res.message);
            }
          })
          .catch((e) => {
            console.log(e)
          })

      },
      //修改
      onSaveUsers(){
        this.form.roles.forEach((e,i)=>{
          if(e.roleType == this.roleType){
            e.userIdsList = this.targetKeys;
            console.log( e.userIdsList)
            e.userIds=[];
            this.targetKeys.forEach((e2,i)=>{
              e.userIds.push(e2.id);
            })
          }
        })
        this.modalState = false;
      },
      //重置表单
      onResetForm(){
        this.$refs.ruleForm.resetFields();
      }
    }
  }
  //列表混入
  const tableMixins = {
    data () {
      return {
        spinning:false,
        page:{
          pageNumber:1,
          pageSize:10
        },
        columns,
        data,
        organizationList:[],
        departmentTree:[]
      }
    },
    created () {
      let obj = this.$route.query
      if(obj.state == 'update'){
        this.addStatus = false;
        this.id = obj.id;
        this.queryReviewTeamByid({id:obj.id});
      }
      this.queryReviewRoleList();
      this.queryOrganizationList();

    },
    methods: {
      // 查询根据id
      queryReviewTeamByid(id){
        this.spinning = true;
        queryReviewTeamByid(id)
          .then(res => {
            if(res.code==2020200){
              console.log(res)
              res.data.roles.forEach((e,i)=>{
                  if(e.roleType=='1'){
                    this.form.roles[0].roleName = e.roleName
                    this.form.roles[0].roleType = e.roleType
                    e.users.forEach((e2)=>{
                      e2.id = e2.userId;
                      this.form.roles[0].userIds.push(e2.id);
                    })
                    this.form.roles[0].userIdsList = e.users
                  }
                  if(e.roleType=='2'){
                    this.form.roles[1].roleName = e.roleName
                    this.form.roles[1].roleType = e.roleType
                    e.users.forEach((e2)=>{
                      e2.id = e2.userId;
                      this.form.roles[1].userIds.push(e2.id);
                    })
                    this.form.roles[1].userIdsList = e.users
                  }
                if(e.roleType=='3'){
                  this.form.roles[2].roleName = e.roleName
                  this.form.roles[2].roleType = e.roleType
                  e.users.forEach((e2)=>{
                    e2.id = e2.userId;
                    this.form.roles[2].userIds.push(e2.id);
                  })
                  this.form.roles[2].userIdsList = e.users
                }
              });
                this.form.enable=res.data.enable,
                this.form.remark=res.data.remark,
                this.form.teamName=res.data.teamName,
                this.form.teamNumber=res.data.teamNumber,
              console.log(this.form)
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
      // 列表查询
      queryReviewRoleList(){
        this.spinning = true;
        queryReviewRoleList()
          .then(res => {
            if(res.code==2020200){
              console.log(res)
              this.data = res.data;
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
      //查询责任单位
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
      //修改tree的key值
      getTreeDepartment(data) {
        for(let i = 0; i < data.length; i++) {
          data[i].title = data[i].departmentName;
          data[i].value = data[i].id;
          data[i].key = data[i].id;
          if(data[i].nodes&&data[i].nodes.length>0){
            data[i].children = data[i].nodes;
            this.getTreeDepartment(data[i].nodes)
          }
        }
      },
      //机构改变
      organizationChange(value){
        queryDepartmentTree({organizationId:value})
          .then(res => {
            if(res.code==2020200){
              this.departmentTree = res.data;
              this.getTreeDepartment(this.departmentTree);
            }else{
              this.$message.info(res.message);
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
        this.modalTitle = '修改';
        this.roleType = record.roleType;
        this.mockData = [];
        this.targetKeys = [];
        this.departmentTree = [];
        this.organization = '';
        //targetKeys
        this.form.roles.forEach((e,i)=>{
          if(e.roleType == this.roleType){
            this.targetKeys = e.userIdsList;
          }
        })
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
  //vue实例
  export default {
    name: 'PlanAuditTeamAdd',
    mixins: [tableMixins,modalMixins,cardMixins,formModeMixins,headMixins,paginationMixins,transferMixins],
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
    padding-left: 100px;
  }
  .gutter-box>label{
    width: 90px;
    text-align: right;
    line-height: 32px;
    position: absolute;
    left: 0;
  }
  .list{
    border-bottom: 1px solid #ddd;
    height: 30px;
    line-height: 30px;
    padding: 0 10px;
    text-overflow: ellipsis;
    overflow: hidden;
    white-space: nowrap;
    cursor: pointer;
  }
  .active{
    background: #00b5a4;
    color: #fff;
  }
</style>
