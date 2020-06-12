<template>
  <div>
    <!-- 页头 -->
    <div class="a-header">
      <a-col class="gutter-row" :span="4">
        <div class="gutter-box">
          <label>计划名称:</label>
          <a-input v-model="headerForm.planName" />
        </div>
      </a-col>
      <a-col class="gutter-row" :span="4">
        <div class="gutter-box">
          <label>开始时间:</label>
          <a-date-picker v-model="headerForm.startTime" @change="onStartDateChange"/>
        </div>
      </a-col>
      <a-col class="gutter-row" :span="4">
        <div class="gutter-box">
          <label>结束时间:</label>
          <a-date-picker v-model="headerForm.endTime" @change="onEndDateChange"/>
        </div>
      </a-col>
      <span style="margin-left: 10px">
        <a-button type="primary" @click="onSearch">查询</a-button>
        <a-button type="primary" @click="onToAdd" v-if="hasPermission('web:ppc:plan:insertPlan')">新增</a-button>
      </span>
    </div>
    <!-- 列表 -->
    <a-spin :spinning="spinning">
      <a-table :rowClassName="(record, index)=>{return index % 2 === 1? 'odd' : 'even'}" bordered :columns="columns" rowKey="id" :data-source="data" :pagination="false">
      <span slot="planStage" slot-scope="planStage">
         <a-tag color="green" v-if="planStage==0">
           准备阶段
        </a-tag>
        <a-tag color="pink" v-if="planStage==1">
           申请施工
        </a-tag>
        <a-tag color="cyan" v-if="planStage==2">
           施工阶段
        </a-tag>
        <a-tag color="orange" v-if="planStage==3">
           申请竣工
        </a-tag>
        <a-tag color="purple" v-if="planStage==4">
           竣工阶段
        </a-tag>
      </span>
      <span slot="action" slot-scope="text, record">
        <a @click="onView(record)">查看</a>
        <a-divider type="vertical" v-if="hasPermission('web:ppc:plan:updatePlan')"/>
        <a @click="onToUpdate(record)" v-if="hasPermission('web:ppc:plan:updatePlan')">修改</a>
        <a-divider type="vertical" v-if="hasPermission('web:ppc:plan:deletePlan')"/>
        <a-popconfirm title="你确定删除吗？" ok-text="确定" cancel-text="取消" v-if="hasPermission('web:ppc:plan:deletePlan')" @confirm="onDeleteConfirm(record)" @cancel="onDeleteCancel">
          <a href="#">删除</a>
        </a-popconfirm>
      </span>
      </a-table>
    </a-spin>
    <!-- 分页 -->
    <a-pagination v-if="total>=10" style="float: right;margin-top: 10px" :total="total" :default-current="1" show-size-changer show-quick-jumper @change="onPaginationChange" @showSizeChange="onShowSizeChange"/>
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
        <a-form-model-item label="计划名称" prop="planName">
          <a-input v-model="form.planName" />
        </a-form-model-item>
        <a-form-model-item label="涉及项目" prop="projectId">
          <a-select style="width: 100%;" v-model="form.projectId">
            <a-select-option v-for="item in sjxmlist" :value="item.id" :key="item.id">
              {{item.name}}
            </a-select-option>
          </a-select>
        </a-form-model-item>
        <a-form-model-item label="开始时间" prop="startTime" >
          <a-date-picker v-model="form.startTime" style="width: 100%;"/>
        </a-form-model-item>
        <a-form-model-item label="结束时间" prop="endTime" >
          <a-date-picker v-model="form.endTime" style="width: 100%;"/>
        </a-form-model-item>
        <a-form-model-item label="计划审核组" prop="reviewTeamId">
          <a-select style="width: 100%;" v-model="form.reviewTeamId">
            <a-select-option v-for="item in ReviewTeamList" :value="item.id" :key="item.id">
              {{item.teamName}}
            </a-select-option>
          </a-select>
        </a-form-model-item>
        <a-form-model-item label="描述" prop="description">
          <a-input v-model="form.description" />
        </a-form-model-item>
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
  import {deletePlanById,insertPlan,queryPlanByid,queryPlanPage,updatePlan,queryPlanDetail} from "@/api/ControlProjectPlan/PlanManagement";
  import {queryFaxmAll} from "@/api/ProjectInformationManagement/ProjectItem/ItemSplit";
  import {queryReviewTeamList} from "@/api/ControlProjectPlan/PlanAuditTeam";

  const columns = [
    { title: '计划名称',dataIndex: 'planName',key: 'planName' },
    { title: '项目名称',dataIndex: 'projectName',key: 'projectName' },
    { title: '状态',dataIndex: 'planStage',key: 'planStage'  ,scopedSlots: { customRender: 'planStage' },},
    { title: '开始时间',dataIndex: 'startTime',key: 'startTime' },
    { title: '结束时间',dataIndex: 'endTime',key: 'endTime' },
    { title: '操作',dataIndex: 'action', scopedSlots: { customRender: 'action' } },
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
          planName:'',
          startTime:'',
          endTime:'',
        }
      }
    },
    methods: {
      // 搜索
      onSearch () {
        this.queryPlanPage();
      },
      //开始时间
      onStartDateChange(date, dateString){
        this.headerForm.startTime =this.$moment(date).format('YYYY-MM-DD HH:mm:ss');
      },
      //结束时间
      onEndDateChange(date, dateString){
        this.headerForm.endTime =this.$moment(date).format('YYYY-MM-DD HH:mm:ss');
      },
      // 去添加
      onToAdd () {
        this.modalState = true
        this.modalTitle = '新增项目计划';
        this.addStatus = true;
        this.form={
            description:'',
            endTime:'',
            planName:'',
            projectId:'',
            reviewTeamId:'',
            startTime:'',
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
        id:'',
        form:{
          planName:'',
          projectId:'',
          startTime:'',
          endTime:'',
          reviewTeamId:'',
          description:'',
        },
        rules: {
          planName: [{ required: true, message: '请输入计划名称', trigger: 'blur' }],
          projectId: [{ required: true, message: '请选择设计项目', trigger: 'change' }],
          startTime: [{ required: true, message: '请选择开始时间', trigger: 'change' }],
          endTime: [{ required: true, message: '请选择结束时间', trigger: 'change' }],
          reviewTeamId: [{ required: true, message: '请选择计划审核组', trigger: 'change' }],
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
            insertPlan(this.form)
              .then(res => {
                if(res.code==2020200){
                  console.log(res)
                  this.queryPlanPage();
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
            updatePlan(Object.assign(this.form,{id:this.id}))
              .then(res => {
                if(res.code==2020200){
                  console.log(res)
                  this.queryPlanPage();
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
        sjxmlist:[],
        ReviewTeamList:[],
        columns,
        data:[]
      }
    },
    created () {
      this.queryPlanPage();
      this.queryFaxmAll();
      this.queryReviewTeamList();
    },
    methods: {
      //查询
      queryPlanPage(){
        this.spinning = true;
        queryPlanPage(Object.assign(this.page,this.headerForm))
          .then(res => {
            if(res.code==2020200){
              console.log(res)
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
      queryFaxmAll(){
        queryFaxmAll()
          .then(res => {
            if(res.code==2020200){
              this.sjxmlist = res.data;
              console.log(res)
            }else{
              this.$message.info(res.message);
            }
          })
          .catch((e) => {
            console.log(e)
          })
      },
      queryReviewTeamList(){
        queryReviewTeamList()
          .then(res => {
            if(res.code==2020200){
              this.ReviewTeamList = res.data;
              console.log(res)
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
        this.$router.push({path:'/main/ControlProjectPlan/PlanDetails',query: {id: record.id}})
        console.log(record)
      },
      // 修改
      onToUpdate (record) {
        this.modalState = true;
        this.modalTitle = '修改项目计划';
        this.addStatus = false;
        console.log(record.id)
        queryPlanByid({id:record.id})
          .then(res => {
            if(res.code==2020200){
              this.form = {
                description:res.data.description,
                endTime:res.data.endTime,
                planName:res.data.planName,
                projectId:res.data.projectId,
                reviewTeamId:res.data.reviewTeamId+'',
                startTime:res.data.startTime,
              },
              this.id = res.data.id;
            }else{
              this.$message.info(res.message);
            }
          })
          .catch((e) => {
            console.log(e)
          })
        console.log(record)
      },
      // 删除确认
      onDeleteConfirm (record) {
        deletePlanById({id:record.id})
          .then(res => {
            if(res.code==2020200){
              this.queryPlanPage();
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
    name: 'PlanManagement',
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
