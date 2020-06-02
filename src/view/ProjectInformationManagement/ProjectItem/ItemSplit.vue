<template>
  <div class="body">
    <div class="listParent">
      <div class="listFixed">
        <a-input-search style="width: 260px" v-model="name" placeholder="搜索工程"  @search="onGcSearch" >
          <a-button slot="enterButton">
            搜索
          </a-button>
        </a-input-search>
      </div>
      <ul class="listGroup">
        <li class="listOne" v-for="(item,i) in list" :key="item.id" :title="item.name" @click="listClick(item,i)" :class="{ active: item.active }">{{item.name}}</li>
      </ul>
    </div>
    <div style="width: 100%">
      <!-- 页头 -->
      <div class="a-header">
        <!--<a-col class="gutter-row" :span="8">-->
          <!--<div class="gutter-box">-->
            <!--<label>责任单位:</label>-->
            <!--<a-input placeholder="责任单位" v-model="headerForm.zrdw"/>-->
          <!--</div>-->
        <!--</a-col>-->
        <span style="margin-left: 10px">
        <!--<a-button type="primary" @click="onSearch">查询</a-button>-->
        <a-button type="primary" @click="onToAdd">新增</a-button>
      </span>
      </div>
      <!-- 列表 -->
      <a-spin :spinning="spinning">
        <a-table :columns="columns"  :data-source="data" rowKey="id"  childrenColumnName="childList" :scroll="{ x: 1500}" :pagination="false" :row-selection="rowSelection" >
          <span slot="action" slot-scope="text, record">
        <a @click="onToUpdate(record)">修改</a>
        <a-divider type="vertical" />
        <a-popconfirm title="你确定删除吗（如果删除有可能删除拆分的子项目）？" ok-text="确定" cancel-text="取消" @confirm="onDeleteConfirm(record)" @cancel="onDeleteCancel">
          <a href="#">删除</a>
        </a-popconfirm>
      </span>
        </a-table>
      </a-spin>
      <!-- 弹窗 -->
      <a-modal v-model="modalState" :title="modalTitle" :footer="null" width="700px">
        <!--表单-->
        <a-form-model
          ref="ruleForm"
          :model="form"
          :rules="rules"
          :label-col="labelCol"
          :wrapper-col="wrapperCol"
        >
          <a-form-model-item label="添加类型" v-if="updataState">
            <a-radio-group v-model="type">
              <a-radio :value="0">
                方案
              </a-radio>
              <a-radio :value="1">
                项目
              </a-radio>
            </a-radio-group>
          </a-form-model-item>
          <a-row v-if="type=='0'">
            <a-col :span="24">
              <a-form-model-item label="名称" prop="name">
                <a-input v-model="form.name" placeholder="请输入菜单名称"/>
              </a-form-model-item>
            </a-col>
            <a-col :span="24">
              <a-form-model-item label="选择责任单位" prop="organizationId">
                <a-select style="width: 100%;" v-model="form.organizationId">
                  <a-select-option v-for="item in organizationList" :value="item.id" :key="item.id">
                    {{item.organizationName}}
                  </a-select-option>
                </a-select>
              </a-form-model-item>
          </a-col>
            <a-col :span="24">
              <a-form-model-item label="计划开始时间" prop="startTime">
                <a-date-picker v-model="form.startTime" style="width: 100%"/>
              </a-form-model-item>
            </a-col>
            <a-col :span="24">
              <a-form-model-item label="计划结束时间" prop="endTime">
                <a-date-picker v-model="form.endTime" style="width: 100%"/>
              </a-form-model-item>
            </a-col>
          </a-row>
          <a-row v-else>
            <a-col :span="24">
              <a-form-model-item label="名称" prop="name">
                <a-input v-model="form.name" placeholder="请输入菜单名称"/>
              </a-form-model-item>
            </a-col>
            <a-col :span="24" v-if="isHide">
              <a-form-model-item label="上级目录" prop="parentId">
                <a-tree-select
                v-model="form.parentId"
                style="width: 100%"
                :dropdown-style="{ maxHeight: '400px', overflow: 'auto' }"
                :tree-data="menuData"
                tree-default-expand-all
                >
                </a-tree-select>
              </a-form-model-item>
            </a-col>
            <a-col :span="24">
              <a-form-model-item label="选择责任单位" prop="organizationId">
                <a-select style="width: 100%;" v-model="form.organizationId">
                  <a-select-option v-for="item in organizationList" :value="item.id" :key="item.id">
                      {{item.organizationName}}
                  </a-select-option>
                </a-select>
              </a-form-model-item>
            </a-col>
            <a-col :span="24">
              <a-form-model-item label="计划开始时间" prop="startTime">
                <a-date-picker v-model="form.startTime" style="width: 100%"/>
              </a-form-model-item>
            </a-col>
            <a-col :span="24">
              <a-form-model-item label="计划结束时间" prop="endTime">
                <a-date-picker v-model="form.endTime" style="width: 100%"/>
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
  </div>
</template>

<script>
  import {insertEngineeringManage,updateEngineeringManage,attachmentUpload,batchDeleteEngineeringManage,queryEngineeringManageList,queryEngineeringManagePage,deleteEngineeringManageByid} from "@/api/ProjectInformationManagement/ProjectItem/ProjectManagement";
  import {insertFaxm,updateFaxm,queryFaxmByGcid,deleteFaxmByid} from "@/api/ProjectInformationManagement/ProjectItem/ItemSplit";
  import {deleteOrganizationByid,insertOrganization,queryOrganizationByid,queryOrganizationList,queryOrganizationPage,updateOrganization} from "@/api/BasicInformationManagement/OrganizationManagement";
  const columns = [
    { title: '项目名称',dataIndex: 'name',key: 'name' ,width: 200, fixed: 'left' },
    { title: '责任单位',dataIndex: 'organizationName',key: 'organizationName'},
    { title: '开始时间',dataIndex: 'startTime',key: 'startTime' },
    { title: '结束时间',dataIndex: 'endTime',key: 'endTime'},
    { title: '启用状态',dataIndex: 'enable',key: 'enable' },
    { title: '操作', key: 'active', fixed: 'right', scopedSlots: { customRender: 'action' }, width: 140, },
  ];
  const list = [
    {
      active:false,
      title: 'Name',
      id: '1',
    },
    {
      active:false,
      title: 'xian',
      id: '2',
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
  //弹窗混入
  const modalMixins = {
    data () {
      return {
        modalTitle:'新建',
        modalState:false,
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
        isHide:true,
        updataState:true,
        labelCol: { span: 8 },
        wrapperCol: { span: 14 },
        menuTypeShow:true,
        menuData:[],
        addStatus:true,
        id:'',
        type:0,
        form:{
          name: '',
          endTime: '',
          startTime: '',
          engineeringId: '',
          organizationId: '',
          parentId: '',
        },
        rules: {
          name: [{ required: true, message: '请输入名称', trigger: 'change' }],
          endTime: [{ required: true, message: '请选择计划结束时间', trigger: 'change' }],
          startTime: [{ required: true, message: '请选择计划开始时间', trigger: 'change' }],
          organizationId: [{ required: true, message: '请选择责任单位', trigger: 'change' }],
          parentId: [{ required: true, message: '请选择上级项目', trigger: 'change' }],
        }
      }
    },
    created () {
    },
    methods: {
      selectToIcon(){
        this.modalState2 = true
      },
      SelectIcon(item){
        this.form.icon = item;
        this.modalState2 = false;
      },
      //菜单切换
      onCdlxChange(e){
      },
      //添加
      onAdd(){
        this.$refs.ruleForm.validate(valid => {
          if (valid) {
            let params = {}
            if(this.type==0){
                params ={
                  name:this.form.name,
                  endTime:this.form.endTime,
                  startTime:this.form.startTime,
                  engineeringId:this.listId,
                  organizationId:this.form.organizationId,
                  parentId:'0',
                }
            }else{
              params ={
                name:this.form.name,
                endTime:this.form.endTime,
                startTime:this.form.startTime,
                engineeringId:this.listId,
                organizationId:this.form.organizationId,
                parentId:this.form.parentId,
              }
            }
            insertFaxm(params)
              .then(res => {
                if(res.code==2020200){
                  this.queryFaxmByGcid();
                  this.queryFaxmByGcidzd();
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
      //修改
      onUpdate(){
        console.log('Object.assign(this.form,{id:this.id})-------------')
        console.log(Object.assign(this.form,{id:this.id}))
        updateMenu(Object.assign(this.form,{id:this.id}))
          .then(res => {
            if(res.code==2020200){
              this.queryMenuTree();
              this.queryMenuSelectTree();
              this.modalState = false;
              this.$message.info(res.message);
            }else{
              this.$message.info(res.message);
            }
          })
          .catch((e) => {
            console.log(e)
          })
      },
      //重置表单
      onResetForm(){
        this.$refs.ruleForm.resetFields();
      }
    }
  }
  export default {
  mixins:[modalMixins,formModeMixins],
  name: 'ItemSplit',
  data () {
    return {
      spinning:false,
      name:'',
      headerForm:{
        zrdw:'',
      },
      listId:'',
      list,
      data:[],
      organizationList:[],
      columns,
      rowSelection,
    }
  },
  created(){
    this.queryEngineeringManageList();
    this.queryOrganizationList();
  },
  methods: {
    //查询上级目录
    queryFaxmByGcidzd(){
      queryFaxmByGcid({id:this.listId})
        .then(res => {
          if(res.code==2020200){
            this.menuData =res.data;
            this.getTree(this.menuData)
          }else{
            this.$message.info(res.message);
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
            console.log(res)
            this.organizationList = res.data;
          }else{
            this.$message.info(res.message);
          }
        })
        .catch((e) => {
          console.log(e)
        })
    },
    //项目类型
    queryEngineeringManageList(){
      queryEngineeringManageList()
        .then(res => {
          if(res.code==2020200){
            res.data.forEach((e)=>{
              e.active = false;
            })
            this.list = res.data;
          }else{
            this.$message.info(res.message);
          }
        })
        .catch((e) => {
          console.log(e)
        })
    },
    //根据项目id查询工程树
    queryFaxmByGcid(){
      queryFaxmByGcid({id:this.listId})
        .then(res => {
          if(res.code==2020200){
              console.log(res)
            this.data = res.data;
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
      deleteFaxmByid({id:record.id})
        .then(res => {
          if(res.code==2020200){
            this.queryFaxmByGcid();
            this.queryFaxmByGcidzd();
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
    },
    // 工程搜索
    onGcSearch() {
      this.listId='';
      queryEngineeringManageList({name:this.name})
        .then(res => {
          if(res.code==2020200){
            res.data.forEach((e)=>{
              e.active = false;
            })
            this.list = res.data;
          }else{
            this.$message.info(res.message);
          }
        })
        .catch((e) => {
          console.log(e)
        })
    },
    onSearch() {
      if(this.listId==''){
        this.$message.info("请选择工程");
      }else{

      }
    },
    onToAdd() {
      if(this.listId==''){
        this.$message.info("请选择工程");
      }else{
        this.modalState = true;
        this.modalTitle = '添加';
        this.addStatus = true;
        this.isHide=true;
        this.updataState=true;
        this.form={
            name: '',
            endTime: '',
            startTime: '',
            engineeringId: '',
            organizationId: '',
            parentId: '',
        };
      }
    },
    onToUpdate(record) {
      if(this.listId==''){
        this.$message.info("请选择工程");
      }else{
        this.modalState = true;
        this.modalTitle = '修改';
        this.addStatus = false;
        record.parentId == 0?this.type = 0:this.type = 1;
        this.isHide=false;
        this.updataState=false;
        this.form={
            name: record.name,
            endTime: record.endTime,
            startTime: record.startTime,
            engineeringId: record.engineeringId,
            organizationId: record.organizationId+'',
            parentId: record.parentId,
        };
      }
    },
    listClick(item,i){
      this.list.forEach((e)=>{
        e.active = false;
      })
      this.list[i].active = true;
      this.listId = this.list[i].id;
      this.queryFaxmByGcid();
      this.queryFaxmByGcidzd();
    },
    //修改tree的key值
    getTree(data) {
      for(let i = 0; i < data.length; i++) {
          data[i].title = data[i].name;
          data[i].value = data[i].id;
          data[i].key = data[i].id;
          if(data[i].childList&&data[i].childList!=null&&data[i].childList.length>0){
            data[i].children = data[i].childList;
            this.getTree(data[i].childList)
          }
      }
    }
  }
}
</script>

<style scoped>
  .body{
    height: 100%;
    position: relative;
    padding-left: 260px
  }
  .listFixed{
    position: absolute;
    top: 0;
  }
  .listParent{
    height: 100%;
    width: 260px;
    position: absolute;
    left: 0;
    top: 0;
    border: 1px solid #dddddd;
    padding-top: 31px;
  }
  .listGroup{
    padding: 0;
    margin: 0;
    list-style: none;
    height: 100%;
    overflow-y: auto;
  }
  .listOne:first-child{
    border-top: 1px solid #ddd;
  }
  .listOne{
    height: 38px;
    overflow: hidden;
    text-overflow: ellipsis;
    white-space: nowrap;
    cursor: pointer;
    font-size: 16px;
    border-bottom: 1px solid #ddd;
    line-height: 38px;
    padding: 0 10px;
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
  .active{
    background: #1890ff;
    color: #fff;
  }
</style>
