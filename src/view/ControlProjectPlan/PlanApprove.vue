<template>
  <div>
    <a-descriptions v-if="materialType=='1'" title="合同信息" size="small" bordered>
      <a-descriptions-item label="合同">
        {{form.contractName}}
      </a-descriptions-item>
      <a-descriptions-item label="合同分类">
        {{form.categoryName}}
      </a-descriptions-item>
      <a-descriptions-item label="合同编号">
        {{form.contractNumber}}
      </a-descriptions-item>
      <a-descriptions-item label="日期">
        {{form.date}}
      </a-descriptions-item>
      <a-descriptions-item label="所属部门">
        {{form.departmentName}}
      </a-descriptions-item>
      <a-descriptions-item label="往来单位">
        {{form.contactOrganizationName}}
      </a-descriptions-item>
      <a-descriptions-item label="客户联系人">
        {{form.customerContactName}}
      </a-descriptions-item>
      <a-descriptions-item label="客户联系方式">
        {{form.customerContactPhone}}
      </a-descriptions-item>
      <a-descriptions-item label="所属项目">
        {{form.projectName}}
      </a-descriptions-item>
      <a-descriptions-item label="合同金额（元）">
        {{form.contractAmount}}
      </a-descriptions-item>
      <a-descriptions-item label="质保期（年）">
        {{form.warrantyPeriod}}
      </a-descriptions-item>
      <a-descriptions-item label="质保金比例（%）">
        {{form.retentionMoneyProportion}}
      </a-descriptions-item>
      <a-descriptions-item label="经办人">
        {{form.handledBy}}
      </a-descriptions-item>
      <a-descriptions-item label="开始日期">
        {{form.startDate}}
      </a-descriptions-item>
      <a-descriptions-item label="结束日期">
        {{form.endDate}}
      </a-descriptions-item>
      <a-descriptions-item label="收付款预警">
        {{form.alertType}}
      </a-descriptions-item>
      <a-descriptions-item label="付款达到%预警">
        {{form.paymentRate}}
      </a-descriptions-item>
      <a-descriptions-item label="到期预警">
        {{form.expirationAlert}}
      </a-descriptions-item>
      <a-descriptions-item label="预警天数">
        {{form.alertDays}}
      </a-descriptions-item>
      <a-descriptions-item label="收付款条件">
        {{form.paymentTerms}}
      </a-descriptions-item>
      <a-descriptions-item label="备注">
        {{form.remarks}}
      </a-descriptions-item>
      <a-descriptions-item label="相关附件">
        <a-table :scroll="{ x: 400}" :rowClassName="(record, index)=>{return index % 2 === 1? 'odd' : 'even'}" bordered :columns="uploadColumns" rowKey="id" :data-source="accessoriesUrl" :pagination="false">
            <span slot="action" slot-scope="text, record">
                <a :href="record.fileUrl" :download="record.fileName" target="_blank">下载</a>
            </span>
        </a-table>
      </a-descriptions-item>
    </a-descriptions>
    <a-descriptions v-else title="报告信息" size="small" bordered>
      <a-descriptions-item label="名称">
        {{form.materialName}}
      </a-descriptions-item>
      <a-descriptions-item label="相关附件">
        <a-table :scroll="{ x: 400}" :rowClassName="(record, index)=>{return index % 2 === 1? 'odd' : 'even'}" bordered :columns="uploadColumns" rowKey="id" :data-source="materialUrl" :pagination="false">
            <span slot="action" slot-scope="text, record">
                <a :href="record.fileUrl" :download="record.fileName" target="_blank">下载</a>
            </span>
        </a-table>
      </a-descriptions-item>
    </a-descriptions>
    <a-steps :current="1" style="margin: 20px 0">
      <a-step :title="contractor.organizationName" :description="'上报人：'+contractor.initiator" />
      <a-step :key="1" :title="approvalNodes[0].roleName" :status="approvalNodes[0].approvalResult==1?'finish':'process'" :description="approvalNodes[0].approvalResult==1?'已审批':'待审批'" />
      <a-step :key="2" :title="approvalNodes[1].roleName" :status="approvalNodes[1].approvalResult==1?'finish':(approvalNodes[0].approvalResult==1)?'process':'wait'" :description="approvalNodes[1].approvalResult==1?'已审批':'待审批'" />
      <a-step :key="3" :title="approvalNodes[2].roleName" :status="approvalNodes[2].approvalResult==1?'finish':(approvalNodes[1].approvalResult==1)?'process':'wait'" :description="approvalNodes[2].approvalResult==1?'已审批':'待审批'" />
    </a-steps>
    <!-- 列表 -->
    <a-spin :spinning="spinning">
      <a-table :rowClassName="(record, index)=>{return index % 2 === 1? 'odd' : 'even'}" bordered :columns="columns" rowKey="id" :data-source="data" :pagination="false"></a-table>
    </a-spin>
    <!--弹窗-->
    <a-modal v-model="modalState" :title="modalTitle" :footer="null">
      <!--表单-->
      <a-form-model
        ref="ruleForm"
        :model="ApproveForm"
        :rules="rules"
        :label-col="labelCol"
        :wrapper-col="wrapperCol"
      >
        <a-form-model-item label="说明" prop="description">
          <a-input v-model="ApproveForm.description" />
        </a-form-model-item>
        <a-form-model-item label="意见" prop="opinion">
          <a-input v-model="ApproveForm.opinion" />
        </a-form-model-item>
        <a-form-model-item label="审批结果" prop="approvalResult">
          <a-radio-group v-model="ApproveForm.approvalResult">
            <a-radio :value="0">
              未审核
            </a-radio>
            <a-radio :value="-1">
              驳回
            </a-radio>
            <a-radio :value="1">
              通过
            </a-radio>
          </a-radio-group>
        </a-form-model-item>
        <a-form-model-item :wrapper-col="{ span: 14, offset: 4 }">
          <a-button type="primary" @click="onApprove">
            提交
          </a-button>
          <a-button style="margin-left: 10px;" @click="onResetForm">
            重置
          </a-button>
        </a-form-model-item>
      </a-form-model>
    </a-modal>
    <!-- 操作 -->
    <div style="text-align: center;margin-top: 10px">

      <span v-if="hasPermission('web:ppc:plan:approval:queryMaterialReviewStatus')">
        <span v-if="hasPermission('web:ppc:plan:approval:materialReview')">
           <a-button type="primary" @click="goBack">
            返回
          </a-button>
          <a-button  v-if="approvalResult=='-1'">
            已驳回
          </a-button>
           <a-button type="primary" @click="onToApprove" v-if="approvalResult=='0'">
            审批
          </a-button>
        </span>
      </span>

      <a-button  v-if="approvalResult=='1'">
        已同意
      </a-button>
    </div>
  </div>
</template>
<script>
  import {queryPlanMaterial,queryMaterialReviewStatus,queryMaterialReviewProgress,queryMaterialReviewList,materialReview} from "@/api/ControlProjectPlan/PlanApprove";
  //弹窗混入
  const modalMixins = {
    data () {
      return {
        modalState:false,
        modalTitle:'',
        addStatus:true,
        labelCol: { span: 8 },
        wrapperCol: { span: 14 },
        ApproveForm:{
          description:'',
          opinion:'',
          approvalResult:'0',
        },
        rules: {
          description: [{ required: true, message: '请填写描述', trigger: 'blur' }],
          opinion: [{ required: true, message: '请填写意见', trigger: 'blur' }],
          approvalResult: [{ required: true, message: '请选择审批结果', trigger: 'change' }],
        }
      }
    },
  };
  const uploadColumns = [
    { title: '文件名称',dataIndex: 'fileName',key: 'fileName' ,width:100},
    { title: '文件路径',dataIndex: 'fileUrl',key: 'fileUrl',width:100},
    { title: '文件大小',dataIndex: 'fileSize',key: 'fileSize',width:100},
    { title: '文件类型',dataIndex: 'fileExt',key: 'fileExt' ,width:100},
    { title: '操作',dataIndex: 'action', scopedSlots: { customRender: 'action' },width:100 },
  ];
  //列表混入
  const tableMixins = {
    data () {
      return {
        spinning:false,
        columns,
        uploadColumns,
        data:[],
      }
    },
  };
  const columns = [
    { title: '审批节点',dataIndex: 'roleName',key: 'roleName' },
    { title: '处理人',dataIndex: 'approvedBy',key: 'approvedBy' },
    { title: '描述',dataIndex: 'description',key: 'description' },
    { title: '意见',dataIndex: 'opinion',key: 'opinion' },
    { title: '审批结果',dataIndex: 'approvalResult',key: 'approvalResult' },
    { title: '时间',dataIndex: 'createTime',key: 'createTime' },
  ];
  export default {
  mixins: [tableMixins,modalMixins],
  name: 'PlanApprove',
  data () {
    return {
      id:'',
      materialType:'',
      form:{
        materialName:'',
        materialUrl:'',
        alertDays:'',
        alertType:'',
        departmentId:'',
        categoryName:'',
        categoryId:'',
        projectId:'',
        contactOrganizationName: '',
        contractAmount:'',
        contractName: '',
        contractNumber: '',
        customerContactName: '',
        customerContactPhone: '',
        date: '',
        endDate: '',
        expirationAlert:'',
        handledBy: '',
        paymentRate:'',
        paymentTerms: '',
        percentage:'',
        remarks: '',
        retentionMoneyProportion:'',
        settlementStatus: '',
        startDate: '',
        warrantyPeriod:'',
      },
      data:[],
      total:0,
      contractor:{},
      approvalNodes:[
        {
          roleName:'',
          approvalResult:''
        },
        {
          roleName:'',
          approvalResult:''
        },
        {
          roleName:'',
          approvalResult:''
        },
        {
          roleName:'',
          approvalResult:''
        }
      ],
      approvalResult:'',
      materialUrl:[],
      accessoriesUrl:[],
    }
  },
  created(){
    let obj = this.$route.query
    this.id = obj.id;
    this.queryPlanMaterial();
    this.queryMaterialReviewList();
    this.queryMaterialReviewProgress();
    this.queryMaterialReviewStatus();
  },
  methods:{
    //查询计划详情
    queryPlanMaterial(){
      this.spinning = true;
      queryPlanMaterial({id:this.id})
        .then(res => {
          if(res.code==2020200){
            this.form = res.data;
            this.materialType = res.data.materialType;
            this.materialUrl = res.data.materialUrl==null?[]:JSON.parse(res.data.materialUrl);
            this.accessoriesUrl = res.data.accessoriesUrl==null?[]:JSON.parse(res.data.accessoriesUrl);
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
    //查询进度
    queryMaterialReviewProgress(){
      queryMaterialReviewProgress({id:this.id})
        .then(res => {
          if(res.code==2020200){
            console.log('----------------')
            console.log(res)
            this.contractor = res.data.contractor;
            this.approvalNodes = res.data.approvalNodes;
          }else{
            this.$message.info(res.message);
          }
        })
        .catch((e) => {
          console.log(e)
        })
    },
    //查询列表
    queryMaterialReviewList(){
      this.spinning = true;
      queryMaterialReviewList({id:this.id})
        .then(res => {
          if(res.code==2020200){
            this.data = res.data;
            this.spinning = false;
            console.log(res)
          }else{
            this.$message.info(res.message);
            this.spinning = false;
          }
        })
        .catch((e) => {
          console.log(e)
        })
    },
    //查询
    queryMaterialReviewStatus(){
      queryMaterialReviewStatus({id:this.id})
        .then(res => {
          if(res.code==2020200){
            this.approvalResult = res.data;
            console.log(res)
          }else{
            this.$message.info(res.message);
          }
        })
        .catch((e) => {
          console.log(e)
        })
    },
    //去审批
    onToApprove(){
      this.modalState = true
      this.modalTitle = '审批';
      this.addStatus = true;
      this.ApproveForm={
        description:'',
        opinion:'',
        approvalResult:'0',
      };
    },
    //审批
    onApprove(){
      this.$refs.ruleForm.validate(valid => {
        if (valid) {
          materialReview(Object.assign(this.ApproveForm,{materialId:this.id}))
            .then(res => {
              if(res.code==2020200){
                console.log(res);
                this.modalState = false;
                this.queryMaterialReviewStatus();
                this.queryMaterialReviewList();
                this.queryMaterialReviewProgress();
                this.$message.info(res.message);
              }else{
                this.modalState = false;
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
    },
    goBack() {
      this.$router.go(-1)
    },
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
