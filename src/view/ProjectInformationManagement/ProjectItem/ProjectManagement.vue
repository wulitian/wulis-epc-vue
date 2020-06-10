<template>
  <div>
    <!-- 页头 -->
    <div class="a-header">
      <a-col class="gutter-row" :span="4">
        <div class="gutter-box">
          <label>工程编号:</label>
          <a-input v-model="headerForm.number"/>
        </div>
      </a-col>
      <a-col class="gutter-row" :span="4">
        <div class="gutter-box">
          <label>工程名称:</label>
          <a-input  v-model="headerForm.name"/>
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
    <a-modal v-model="modalState" :title="modalTitle" :footer="null" width="1000px">
      <!--表单-->
      <a-form-model
        ref="ruleForm"
        :model="form"
        :rules="rules"
        :label-col="labelCol"
        :wrapper-col="wrapperCol"
      >
        <a-row>
          <a-col :span="8">
            <a-form-model-item label="工程编号" prop="number">
              <a-input v-model="form.number"/>
            </a-form-model-item>
          </a-col>
          <a-col :span="8">
            <a-form-model-item label="工程名称" prop="name">
              <a-input v-model="form.name"/>
            </a-form-model-item>
          </a-col>
          <a-col :span="8">
            <a-form-model-item label="工程用途" prop="useId">
              <a-select style="width: 100%;" v-model="form.useId">
                <a-select-option v-for="item in EngineeringUseList" :value="item.id" :key="item.id">
                  <a-tooltip>
                    <template slot="title">
                      {{item.name}}
                    </template>
                    {{item.name}}
                  </a-tooltip>
                </a-select-option>
              </a-select>
            </a-form-model-item>
          </a-col>
          <a-col :span="8">
            <a-form-model-item label="工程类型" prop="typeId">
              <a-select style="width: 100%;" v-model="form.typeId">
                <a-select-option v-for="item in EngineeringTypeList" :value="item.id" :key="item.id">
                  <a-tooltip>
                    <template slot="title">
                      {{item.name}}
                    </template>
                    {{item.name}}
                  </a-tooltip>
                </a-select-option>
              </a-select>
            </a-form-model-item>
          </a-col>
          <a-col :span="8">
            <a-form-model-item label="项目类型" prop="projectTypeId">
              <a-select style="width: 100%;" v-model="form.projectTypeId">
                <a-select-option v-for="item in ProjectTypeList" :value="item.id" :key="item.id">
                  <a-tooltip>
                    <template slot="title">
                      {{item.name}}
                    </template>
                    {{item.name}}
                  </a-tooltip>
                </a-select-option>
              </a-select>
            </a-form-model-item>
          </a-col>
          <a-col :span="8">
            <a-form-model-item label="承接方式" prop="undertakeId">
              <a-select style="width: 100%;" v-model="form.undertakeId">
                <a-select-option v-for="item in EngineeringUndertakeList" :value="item.id" :key="item.id">
                  <a-tooltip>
                    <template slot="title">
                      {{item.name}}
                    </template>
                    {{item.name}}
                  </a-tooltip>
                </a-select-option>
              </a-select>
            </a-form-model-item>
          </a-col>
          <a-col :span="8">
            <a-form-model-item label="结构类型" prop="structureId">
              <a-select style="width: 100%;" v-model="form.structureId">
                <a-select-option v-for="item in EngineeringStructureList" :value="item.id" :key="item.id">
                  <a-tooltip>
                    <template slot="title">
                      {{item.name}}
                    </template>
                    {{item.name}}
                  </a-tooltip>
                </a-select-option>
              </a-select>
            </a-form-model-item>
          </a-col>
          <a-col :span="8">
            <a-form-model-item label="录入时间" prop="entryTime">
              <a-date-picker v-model="form.entryTime" style="width: 100%"/>
            </a-form-model-item>
          </a-col>
          <a-col :span="8">
            <a-form-model-item label="项目简介" prop="description">
              <a-input v-model="form.description"/>
            </a-form-model-item>
          </a-col>
          <a-col :span="8">
            <a-form-model-item label="项目地点" prop="address">
              <a-input v-model="form.address" />
            </a-form-model-item>
          </a-col>
          <a-col :span="8">
            <a-form-model-item label="是否启用" prop="enable">
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
        </a-row>
        <a-row>
          <a-form-model-item :wrapper-col="{ span: 20, offset: 0 }" :label-col="{ span: 3 }" style="margin-left: -18px" label="已上传文件" >
            <a-table :rowClassName="(record, index)=>{return index % 2 === 1? 'odd' : 'even'}" bordered :columns="uploadColumns" rowKey="id" :data-source="fileRecordList" :pagination="false">
              <span slot="action" slot-scope="text, record">
                  <a href="#" @click="deleteUpload(record)">删除</a>
              </span>
            </a-table>
          </a-form-model-item>
          <a-form-model-item :wrapper-col="{ span: 20, offset: 0 }" :label-col="{ span: 3 }" style="margin-left: -18px" label="上传附件" >
            <a-upload
              style="margin-top: -40px"
              multiple
              :remove="removeUpload"
              :before-upload="beforeUpload"
              :file-list="fileList"
              :transform-file="transformFile"
            >
              <a-button> <a-icon type="upload" /> 选择附件</a-button>
            </a-upload>
            <a-button
              type="primary"
              :disabled="fileList.length === 0"
              :loading="uploading"
              style="margin-top: 16px"
              @click="upload"
            >
              {{ uploading ? '上传中' : '上传附件' }}
            </a-button>
          </a-form-model-item>
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
  import {insertEngineeringManage,queryEngineeringManageByid,updateEngineeringManage,attachmentUpload,batchDeleteEngineeringManage,queryEngineeringManageList,queryEngineeringManagePage,deleteEngineeringManageByid} from "@/api/ProjectInformationManagement/ProjectItem/ProjectManagement";
  import {queryProjectTypeList} from "@/api/ProjectInformationManagement/ProjectCode/ItemType";
  import {queryEngineeringTypeList} from "@/api/ProjectInformationManagement/ProjectCode/ProjectType";
  import {queryEngineeringUseList} from "@/api/ProjectInformationManagement/ProjectCode/ProjectUse";
  import {queryEngineeringStructureList} from "@/api/ProjectInformationManagement/ProjectCode/TypeConstruction";
  import {queryEngineeringUndertakeList} from "@/api/ProjectInformationManagement/ProjectCode/WayContract";
  const columns = [
    { title: '工程编号',dataIndex: 'number',key: 'number' },
    { title: '工程名称',dataIndex: 'name',key: 'name' },
    { title: '工程类型',dataIndex: 'typeName',key: 'typeName' },
    { title: '工程用途',dataIndex: 'useName',key: 'useName' },
    { title: '结构形式',dataIndex: 'structureName',key: 'structureName' },
    { title: '承揽方式',dataIndex: 'undertakeName',key: 'undertakeName' },
    { title: '项目类型',dataIndex: 'projectTypeName',key: 'projectTypeName' },
    { title: '描述',dataIndex: 'description',key: 'description' },
    { title: '启用状态',dataIndex: 'enable',key: 'enable' ,scopedSlots: { customRender: 'enable' }, },
    { title: '创建时间',dataIndex: 'createTime',key: 'createTime' },
    { title: '操作',dataIndex: 'action', scopedSlots: { customRender: 'action' } },
  ];
  const uploadColumns = [
    { title: '文件名称',dataIndex: 'fileName',key: 'fileName' ,width:200},
    { title: '文件路径',dataIndex: 'fileUrl',key: 'fileUrl',width:200},
    { title: '文件大小',dataIndex: 'fileSize',key: 'fileSize',width:200},
    { title: '文件类型',dataIndex: 'fileExt',key: 'fileExt' ,width:200},
    { title: '操作',dataIndex: 'action', scopedSlots: { customRender: 'action' } ,width:200},
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
        this.queryEngineeringManagePage();
      },
      // 分页下拉改变
      onShowSizeChange (pageNumber, pageSize) {
        this.page.pageNumber = pageNumber
        this.page.pageSize = pageSize
        this.queryEngineeringManagePage();
      }
    }
  };
  //头部混入
  const headMixins = {
    data () {
      return {
        headerForm:{
          name:'',
          number:'',
          enable:''
        }
      }
    },
    methods: {
      // 搜索
      onSearch () {
        this.queryEngineeringManagePage();
      },
      // 去添加
      onToAdd () {
        this.modalState = true
        this.modalTitle = '新增工程名称';
        this.addStatus = true;
        this.form = {
            address:'',
            attachmentUrl:'',
            description:'',
            enable:1,
            entryTime:'',
            name:'',
            number:'',
            projectTypeId:'',
            structureId:'',
            typeId:'',
            undertakeId:'',
            useId:'',
        };
        this.fileRecordList = [];
      }
    }
  };
  //表单混入
  const formModeMixins = {
    data () {
      return {
        labelCol: { span: 8 },
        wrapperCol: { span: 14 },
        id:'',
        form:{
          address:'',
          description:'',
          enable:1,
          entryTime:'',
          name:'',
          number:'',
          projectTypeId:'',
          structureId:'',
          typeId:'',
          undertakeId:'',
          useId:'',
        },
        rules: {
          name: [{ required: true, message: '请输入工程名称', trigger: 'blur' }],
          number: [{ required: true, message: '请输入工程编号', trigger: 'blur' }],
          typeId: [{ required: true, message: '请选择工程类型', trigger: 'change' }],
          structureId: [{ required: true, message: '请选择结构形式', trigger: 'change' }],
          projectTypeId: [{ required: true, message: '请选择项目类型', trigger: 'change' }],
          undertakeId: [{ required: true, message: '请选择承揽方式', trigger: 'change' }],
          useId: [{ required: true, message: '请选择工程用途', trigger: 'change' }],
          entryTime: [{ required: true, message: '请选择录入时间', trigger: 'change' }],
          description: [{ required: true, message: '请输入项目简介', trigger: 'blur' }],
          address: [{ required: true, message: '请输入项目地点', trigger: 'blur' }],
        },
        uploading:false,
        fileRecordList:[],
        fileList:[]
      }
    },
    created () {
    },
    methods: {
      //添加
      onAdd(){
        this.$refs.ruleForm.validate(valid => {
          if (valid) {
            insertEngineeringManage(Object.assign(this.form,{accessoriesUrl:JSON.stringify(this.fileRecordList)}))
              .then(res => {
                if(res.code==2020200){
                  this.queryEngineeringManagePage();
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
        this.$refs.ruleForm.validate(valid => {
          if (valid) {
            updateEngineeringManage(Object.assign(this.form,{id:this.id,accessoriesUrl:JSON.stringify(this.fileRecordList)}))
              .then(res => {
                if(res.code==2020200){
                  this.queryEngineeringManagePage();
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
      //移除上传项
      removeUpload(file){
        const index = this.fileList.indexOf(file);
        const newFileList = this.fileList.slice();
        newFileList.splice(index, 1);
        this.fileList = newFileList;
      },
      //上传前
      beforeUpload(file) {
        this.fileList = [...this.fileList, file];
        return false;
      },
      //上传
      upload(){
        const { fileList } = this;
        const formData = new FormData();
        fileList.forEach(file => {
          formData.append('file', file);
        });
        formData.append('type', '2');
        this.uploading = true;
        attachmentUpload(formData)
          .then(res => {
            if(res.code==2020200){
              res.data.forEach((e)=>{
                this.fileRecordList.push(e);
              })
              this.fileList = [];
              this.uploading = false;
              this.$message.info(res.message);
            }else{
              this.$message.info(res.message);
            }
          })
          .catch((e) => {
            console.log(e)
          })
      },
      //删除已上传
      deleteUpload(record){
        for (let i = 0; i < this.fileRecordList.length; i++) {
          if(this.fileRecordList[i].id == record.id){
            this.fileRecordList.splice(i, 1);
            i--;
          }
        }
      },
      //添加水印
      transformFile(file) {
        return new Promise(resolve => {
          const reader = new FileReader();
          reader.readAsDataURL(file);
          reader.onload = () => {
            const canvas = document.createElement('canvas');
            const img = document.createElement('img');
            img.src = reader.result;
            img.onload = () => {
              const ctx = canvas.getContext('2d');
              ctx.drawImage(img, 0, 0);
              ctx.fillStyle = 'red';
              ctx.textBaseline = 'middle';
              ctx.fillText('wlt', 20, 20);
              canvas.toBlob(resolve);
            };
          };
        });
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
        uploadColumns,
        data:[],
        ProjectTypeList:[],
        EngineeringTypeList:[],
        EngineeringUseList:[],
        EngineeringStructureList:[],
        EngineeringUndertakeList:[],
      }
    },
    created () {
      this.queryEngineeringManagePage();
      this.queryProjectTypeList();
      this.queryEngineeringTypeList();
      this.queryEngineeringUseList();
      this.queryEngineeringStructureList();
      this.queryEngineeringUndertakeList();
    },
    methods: {
      //查询
      queryEngineeringManagePage(){
        this.spinning = true;
        queryEngineeringManagePage(Object.assign(this.page,this.headerForm))
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
      //项目类型
      queryProjectTypeList(){
        queryProjectTypeList()
          .then(res => {
            if(res.code==2020200){
              this.ProjectTypeList = res.data;
            }else{
              this.$message.info(res.message);
            }
          })
          .catch((e) => {
            console.log(e)
          })
      },
      //工程类型
      queryEngineeringTypeList(){
        queryEngineeringTypeList()
          .then(res => {
            if(res.code==2020200){
              this.EngineeringTypeList = res.data;
            }else{
              this.$message.info(res.message);
            }
          })
          .catch((e) => {
            console.log(e)
          })
      },
      //工程用途
      queryEngineeringUseList(){
        queryEngineeringUseList()
          .then(res => {
            if(res.code==2020200){
              this.EngineeringUseList = res.data;
            }else{
              this.$message.info(res.message);
            }
          })
          .catch((e) => {
            console.log(e)
          })
      },
      //结构形式
      queryEngineeringStructureList(){
        queryEngineeringStructureList()
          .then(res => {
            if(res.code==2020200){
              this.EngineeringStructureList = res.data;
            }else{
              this.$message.info(res.message);
            }
          })
          .catch((e) => {
            console.log(e)
          })
      },
      //承揽方式
      queryEngineeringUndertakeList(){
        queryEngineeringUndertakeList()
          .then(res => {
            if(res.code==2020200){
              this.EngineeringUndertakeList = res.data;
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
        this.modalTitle = '修改工程名称';
        this.addStatus = false;
        queryEngineeringManageByid({id:record.id})
          .then(res => {
            if(res.code==2020200){
              this.form = {
                address:res.data.address,
                attachmentUrl:res.data.attachmentUrl,
                description:res.data.description,
                enable:res.data.enable,
                entryTime:res.data.entryTime,
                name:res.data.name,
                number:res.data.number,
                projectTypeId:res.data.projectTypeId+'',
                structureId:res.data.structureId+'',
                typeId:res.data.typeId+'',
                undertakeId:res.data.undertakeId+'',
                useId:res.data.useId+'',
              };
              this.id = res.data.id;
              this.fileRecordList = JSON.parse(res.data.accessoriesUrl)==null?[]:JSON.parse(res.data.accessoriesUrl);
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
        deleteEngineeringManageByid({id:record.id})
          .then(res => {
            if(res.code==2020200){
              this.queryEngineeringManagePage();
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
  //vue实例
  export default {
    name: 'ProjectManagement',
    mixins: [tableMixins,modalMixins,formModeMixins,headMixins,paginationMixins],
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
