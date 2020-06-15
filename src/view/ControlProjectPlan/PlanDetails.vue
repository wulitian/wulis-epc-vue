<template>
  <div>
    <a-page-header
      style="border: 1px solid rgb(235, 237, 240)"
      :title="pageHeadForm.title"
      @back="() => $router.go(-1)"
    >
      <template slot="extra">
        <a-button key="1" v-if="hasPermission('web:ppc:plan:detail:applyNextPlanProcess')&&descriptions.planStage==0" @click="applyNextPlanProcess">
          开始施工
        </a-button>
        <span v-if="descriptions.planStage==1">申请施工状态</span>
        <a-button key="2" v-if="hasPermission('web:ppc:plan:detail:applyNextPlanProcess')&&descriptions.planStage==2" @click="applyNextPlanProcess">
          中期施工
        </a-button>
        <span v-if="descriptions.planStage==3">申请中期施工</span>
        <a-button key="3" v-if="hasPermission('web:ppc:plan:detail:applyNextPlanProcess')&&descriptions.planStage==4" @click="applyNextPlanProcess">
          结束竣工
        </a-button>
        <span v-if="descriptions.planStage==5">申请竣工状态</span>
        <span v-if="descriptions.planStage==6">竣工阶段</span>
        <a-button key="4" type="primary" v-if="hasPermission('web:ppc:plan:detail:approvalNextPlanProcess')" @click="approvalNextPlanProcess('0')">
          驳回
        </a-button>
        <a-button key="5" type="primary" v-if="hasPermission('web:ppc:plan:detail:approvalNextPlanProcess')" @click="approvalNextPlanProcess('1')">
          同意
        </a-button>
      </template>
      <a-descriptions size="small" :column="3">
        <a-descriptions-item label="合同数">
          {{descriptions.contractNum}}
        </a-descriptions-item>
        <a-descriptions-item label="报告数">
          {{descriptions.reportNum}}
        </a-descriptions-item>
        <a-descriptions-item label="未审核数量">
          {{descriptions.notApprovedNum}}
        </a-descriptions-item>
        <a-descriptions-item label="计划开始时间/计划结束时间">
          {{descriptions.startTime}}-{{descriptions.endTime}}
        </a-descriptions-item>
        <a-descriptions-item label="目前工期阶段">
          {{ztList[descriptions.planStage]}}
        </a-descriptions-item>
      </a-descriptions>
    </a-page-header>
    <!--列表操作头-->
    <div class="a-header" style="margin-top: 10px">
      <a-col class="gutter-row" :span="4">
        <a-radio-group v-model="headerForm.shzt">
          <a-radio-button value="">
            全部
          </a-radio-button>
          <a-radio-button value="0">
            待审核
          </a-radio-button>
          <a-radio-button value="1">
            已审核
          </a-radio-button>
        </a-radio-group>
      </a-col>
      <a-col class="gutter-row" :span="4">
        <div class="gutter-box">
          <label>任务名称:</label>
          <a-input v-model="headerForm.materialName"/>
        </div>
      </a-col>
      <span style="margin-left: 10px">
        <a-button type="primary" @click="onSearch">查询</a-button>
        <a-button type="primary" @click="onToAddHt" v-if="hasPermission('web:ppc:plan:detail:insertPlanContract')" >新增合同</a-button>
        <a-button type="primary" @click="onToAddBg" v-if="hasPermission('web:ppc:plan:detail:insertPlanReport')" >新增报告</a-button>
      </span>
    </div>
    <!-- 列表 -->
    <a-spin :spinning="spinning">
      <a-table :rowClassName="(record, index)=>{return index % 2 === 1? 'odd' : 'even'}" bordered :columns="columns" rowKey="id" :data-source="data" :pagination="false">
      <span slot="materialType" slot-scope="materialType">
         <a-tag color="green" v-if="materialType==0">
           报告
        </a-tag>
        <a-tag color="pink" v-if="materialType==1">
          合同
        </a-tag>
      </span>
        <span slot="action" slot-scope="text, record">
        <a @click="onView(record)">查看</a>
      </span>
      </a-table>
    </a-spin>
    <!-- 分页 -->
    <a-pagination v-if="total>=10" style="float: right;margin-top: 10px" :total="total" :default-current="1" show-size-changer show-quick-jumper @change="onPaginationChange" @showSizeChange="onShowSizeChange"/>
    <!--弹窗-->
    <a-modal v-model="htModalState" :title="htModalTitle" :footer="null" >
      <!--表单-->
      <a-form-model
        ref="ruleForm"
        :model="form"
        :rules="rules"
        :label-col="labelCol"
        :wrapper-col="wrapperCol"
      >
        <a-form-model-item label="名称" prop="materialName">
          <a-input v-model="form.materialName" />
        </a-form-model-item>
        <a-form-model-item label="合同选择" prop="contractId">
          <a-select style="width: 100%;" v-model="form.contractId">
            <a-select-option v-for="item in contractInfoList" :value="item.id" :key="item.id">
              <a-tooltip>
                <template slot="title">
                  {{item.contractName}}
                </template>
                {{item.contractName}}
              </a-tooltip>
            </a-select-option>
          </a-select>
        </a-form-model-item>
        <a-form-model-item :wrapper-col="{ span: 14, offset: 4 }">
          <a-button type="primary" @click="onHtAdd" >
            添加
          </a-button>
          <a-button style="margin-left: 10px;" @click="onResetForm">
            重置
          </a-button>
        </a-form-model-item>
      </a-form-model>
    </a-modal>
    <!--弹窗-->
    <a-modal v-model="bgModalState" :title="bgModalTitle" :footer="null" width="800px">
      <!--表单-->
      <a-form-model
        ref="ruleForm"
        :model="form"
        :rules="rules"
        :label-col="labelCol"
        :wrapper-col="wrapperCol"
      >
        <a-form-model-item :wrapper-col="{ span: 20, offset: 0 }" :label-col="{ span: 3 }" label="名称" prop="materialName">
          <a-input v-model="form.materialName" />
        </a-form-model-item>
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
        <a-form-model-item :wrapper-col="{ span: 14, offset: 4 }">
          <a-button type="primary" @click="onBgAdd">
            添加
          </a-button>
          <a-button style="margin-left: 10px;" @click="onResetForm">
            重置
          </a-button>
        </a-form-model-item>
      </a-form-model>
    </a-modal>
    <div style="text-align: center;margin-top: 10px">
      <a-button type="primary" @click="goBack">
        返回
      </a-button>
    </div>
  </div>
</template>

<script>

  import {queryPlanDetail} from "@/api/ControlProjectPlan/PlanManagement";
  import {applyNextPlanProcess,approvalNextPlanProcess,insertPlanContract,insertPlanReport,queryApprovalStatus,queryPlanMaterialPage,uploadReport} from "@/api/ControlProjectPlan/PlanDetails";
  import {queryContractInfoList} from "@/api/ItemContractManagement/ContractParameter";
  const columns = [
    { title: '任务名称',dataIndex: 'materialName',key: 'materialName' },
    { title: '发起人',dataIndex: 'userName',key: 'userName' },
    { title: '材料类型',dataIndex: 'materialType',key: 'materialType' ,scopedSlots: { customRender: 'materialType' },},
    { title: '开始时间',dataIndex: 'createTime',key: 'createTime' },
    { title: '审核状态',dataIndex: 'roleType',key: 'roleType' },
    { title: '操作',dataIndex: 'action', scopedSlots: { customRender: 'action' } },
  ];
  const uploadColumns = [
    { title: '文件名称',dataIndex: 'fileName',key: 'fileName' ,width:200},
    { title: '文件路径',dataIndex: 'fileUrl',key: 'fileUrl',width:200},
    { title: '文件大小',dataIndex: 'fileSize',key: 'fileSize',width:200},
    { title: '文件类型',dataIndex: 'fileExt',key: 'fileExt' ,width:200},
    { title: '操作',dataIndex: 'action', scopedSlots: { customRender: 'action' } ,width:200},
  ];
  const data = [];
  //弹窗混入
  const modalMixins = {
    data () {
      return {
        htModalState:false,
        htModalTitle:'',
        bgModalState:false,
        bgModalTitle:'',
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
  const pageHeadMixins = {
    data () {
      return {
        pageHeadForm:{
          title:'济南市医院',
        }
      }
    },
  };
  //列表头部混入
  const headMixins = {
    data () {
      return {
        headerForm:{
          roleType:'',
          materialName:'',
        }
      }
    },
    methods: {
      // 搜索
      onSearch () {
        this.queryPlanMaterialPage();
      },
      // 去添加报告
      onToAddBg () {
        this.bgModalState = true
        this.bgModalTitle = '新增报告';
        this.form={
          jhmc:'',
          sjxm:'',
          materialType:'',
          jssj:'',
          jhshz:'',
          ms:'',
        }
      },
      // 去添加合同
      onToAddHt () {
        this.htModalState = true
        this.htModalTitle = '新增合同';
        this.form={
          contractId:'',
          planId:'',
        }
      }
    }
  };
  //表单混入
  const formModeMixins = {
    data () {
      return {
        labelCol: { span: 8 },
        wrapperCol: { span: 14 },
        planId:'',
        id:'',
        HtChangelx:0,
        form:{
          materialName:'',
          materialUrl: '',
          contractId:'',
        },
        rules: {
          // contractId: [{ required: true, message: '请选择合同', trigger: 'change' }],
          // materialUrl: [{ required: true, message: '请选择附件', trigger: 'blur' }],
          // materialName: [{ required: true, message: '请填写附件名称', trigger: 'change' }],
        }
      }
    },
    methods: {
      goBack() {
        this.$router.go(-1)
      },
      //添加合同
      onHtAdd(){
        this.$refs.ruleForm.validate(valid => {
          let params = {
            materialName:this.form.materialName,
            planId:this.planId,
            contractId:this.form.contractId,
          }
          if (valid) {
            insertPlanContract(params)
              .then(res => {
                if(res.code==2020200){
                  console.log(res)
                  this.queryPlanMaterialPage();
                  this.htModalState = false;
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
      //添加报告
      onBgAdd(){
        this.$refs.ruleForm.validate(valid => {
          if (valid) {
            if(this.fileRecordList==null||this.fileRecordList.length==0){
              this.$message.info('请上传报告');
              return false;
            }
            let params = {
              materialName:this.form.materialName,
              materialUrl: JSON.stringify(this.fileRecordList),
              planId:this.planId
            }
            insertPlanReport(params)
              .then(res => {
                if(res.code==2020200){
                  console.log(res)
                  this.queryPlanMaterialPage();
                  this.bgModalState = false;
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
  //列表混入
  const tableMixins = {
    data () {
      return {
        spinning:false,
        page:{
          pageNumber:1,
          pageSize:10
        },
        ztList:['准备状态','申请施工状态','前期施工状态','申请中期施工', '中期施工状态','申请竣工状态' ,'竣工阶段'],
        descriptions:{
          contractNum:'' ,
          endTime:'' ,
          startTime:'',
          id:'' ,
          notApprovedNum:'' ,
          planName:'' ,
          planStage:'' ,
          projectName:'' ,
          reportNum:''
        },
        uploadColumns,
        columns,
        data,
        uploading:false,
        fileRecordList:[],
        fileList:[],
        contractInfoList:[],
        approvalStatus:''
      }
    },
    created () {
      let obj = this.$route.query
      this.planId = obj.id;
      this.queryPlanDetail({id:this.planId})
      this.queryContractInfoList();
      this.queryPlanMaterialPage();
      this.queryApprovalStatus();
    },
    methods: {
      queryApprovalStatus(){
        queryApprovalStatus({id:this.planId})
          .then(res=>{
            if(res.code==2020200){
              this.approvalStatus = res.data;
              console.log('res-----')
              console.log(res)
            }else{
              this.$message.info(res.message);
            }
          })
          .catch((e)=>{
            console.log(e)
          })
      },
      applyNextPlanProcess(){
        applyNextPlanProcess({id:this.planId})
          .then(res=>{
            if(res.code==2020200){
              console.log(res)
            }else{
              this.$message.info(res.message);
            }
          })
          .catch((e)=>{
            console.log(e)
          })
      },
      approvalNextPlanProcess(zt){
        approvalNextPlanProcess({id:this.planId,approvalResult:zt})
          .then(res=>{
            if(res.code==2020200){
              console.log(res)
            }else{
              this.$message.info(res.message);
            }
          })
          .catch((e)=>{
            console.log(e)
          })
      },
      //查询合同全量
      queryContractInfoList(){
        queryContractInfoList()
          .then(res=>{
            if(res.code==2020200){
              console.log(res)
              this.contractInfoList = res.data;
            }else{
              this.$message.info(res.message);
            }
          })
          .catch((e)=>{
            console.log(e)
          })
      },
      //查询合同报告列表
      queryPlanMaterialPage(){
        this.spinning = true
        queryPlanMaterialPage(Object.assign(this.page,this.headerForm,{planId:this.planId}))
          .then(res=>{
            if(res.code==2020200){
              console.log(res)
              this.data = res.data.records;
              this.total = res.data.total;
              this.spinning = false
            }else{
              this.spinning = false
              this.$message.info(res.message);
            }
          })
          .catch((e)=>{
            console.log(e)
          })
      },
      //查询计划详情
      queryPlanDetail(id){
        queryPlanDetail(id)
          .then(res => {
            if(res.code==2020200){
              this.descriptions.contractNum = res.data.contractNum;
              this.descriptions.endTime= res.data.endTime;
              this.descriptions.startTime= res.data.startTime;
              this.descriptions.id= res.data.id;
              this.descriptions.notApprovedNum= res.data.notApprovedNum;
              this.descriptions.planName= res.data.planName;
              this.descriptions.planStage= res.data.planStage;
              this.descriptions.projectName= res.data.projectName;
              this.descriptions.reportNum= res.data.reportNum;
              this.pageHeadForm.title = res.data.planName;
              // this.data = res.data.records;
              // this.total = res.data.total;
            }else{
              this.$message.info(res.message);
            }
          })
          .catch((e) => {
            console.log(e)
          })
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
        formData.append('type', '3');
        this.uploading = true;
        uploadReport(formData)
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
      // 查看
      onView (record) {
        this.$router.push({path:'/main/ControlProjectPlan/PlanApprove',query: {id: record.id}})
      },
      // 修改
      onToUpdate (record) {
        this.modalState = true;
        this.modalTitle = '修改项目计划';
        // queryUserByid({id:record.id})
        //   .then(res => {
        //     if(res.code==2020200){
        //   this.form = {
        //     jhmc:res.data.jhmc,
        //     sjxm:res.data.sjxm,
        //     materialType:res.data.materialType,
        //     jssj:res.data.jssj,
        //     jhshz:res.data.jhshz,
        //     ms:res.data.ms,
        //   },
        //       this.id = res.data.id;
        //     }else{
        //       this.$message.info(res.message);
        //     }
        //   })
        //   .catch((e) => {
        //     console.log(e)
        //   })
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
    name: 'PlanDetails',
    mixins: [tableMixins,modalMixins,formModeMixins,headMixins,pageHeadMixins,paginationMixins],
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
