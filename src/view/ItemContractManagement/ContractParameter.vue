<template>
  <div>
    <!-- 页头 -->
    <div class="a-header">
      <a-col class="gutter-row" :span="4">
        <div class="gutter-box">
          <label>合同编号:</label>
          <a-input v-model="headerForm.contractNumber"/>
        </div>
      </a-col>
      <a-col class="gutter-row" :span="4">
        <div class="gutter-box">
          <label>合同名称:</label>
          <a-input v-model="headerForm.contractName"/>
        </div>
      </a-col>
      <!--<a-col class="gutter-row" :span="4">-->
        <!--<div class="gutter-box">-->
          <!--<label>启用状态:</label>-->
          <!--<a-select style="width: 100%;" v-model="headerForm.auditStatus">-->
            <!--<a-select-option value="">-->
              <!--全部-->
            <!--</a-select-option>-->
            <!--<a-select-option value="1">-->
              <!--启用-->
            <!--</a-select-option>-->
            <!--<a-select-option value="0">-->
              <!--禁用-->
            <!--</a-select-option>-->
          <!--</a-select>-->
        <!--</div>-->
      <!--</a-col>-->
      <span style="margin-left: 10px">
        <a-button type="primary" @click="onSearch">查询</a-button>
        <a-button type="primary" @click="onToAdd">新增</a-button>
      </span>
    </div>
    <!-- 列表 -->
    <a-spin :spinning="spinning">
      <a-table :columns="columns" rowKey="id" :data-source="data" :pagination="false">
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
    <a-modal v-model="modalState" :title="modalTitle" :footer="null" width="1100px">
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
            <a-form-model-item label="合同名称" prop="contractName">
              <a-input v-model="form.contractName"/>
            </a-form-model-item>
          </a-col>
          <a-col :span="8">
            <a-form-model-item label="合同类目" prop="categoryId">
              <a-select style="width: 100%" v-model="form.categoryId">
                <a-select-option :value="item.id" v-for="item in ContractCategoryList" :key="item.id">
                  {{item.categoryName}}
                </a-select-option>
              </a-select>
            </a-form-model-item>
          </a-col>
          <a-col :span="8">
            <a-form-model-item label="合同编号" prop="contractNumber">
              <a-input v-model="form.contractNumber"/>
            </a-form-model-item>
          </a-col>
          <a-col :span="8">
            <a-form-model-item label="日期" prop="date">
              <a-date-picker v-model="form.date" style="width: 100%;"/>
            </a-form-model-item>
          </a-col>
          <a-col :span="8">
            <a-form-model-item label="所属部门" prop="departmentId">
              <a-tree-select
                v-model="form.departmentId"
                style="width: 100%"
                :dropdown-style="{ maxHeight: '400px', overflow: 'auto' }"
                :tree-data="DepartmentTree"
                tree-default-expand-all
              >
              </a-tree-select>
            </a-form-model-item>
          </a-col>
          <a-col :span="8">
            <a-form-model-item label="往来单位" prop="contactOrganizationName">
              <a-input v-model="form.contactOrganizationName"/>
            </a-form-model-item>
          </a-col>
          <a-col :span="8">
            <a-form-model-item label="客户联系人" prop="customerContactName">
              <a-input v-model="form.customerContactName"/>
            </a-form-model-item>
          </a-col>
          <a-col :span="8">
            <a-form-model-item label="客户联系电话" prop="customerContactPhone">
              <a-input v-model="form.customerContactPhone"/>
            </a-form-model-item>
          </a-col>
          <a-col :span="8">
            <a-form-model-item label="所属项目" prop="projectId">
              <a-select style="width: 100%" v-model="form.projectId">
                <a-select-option :value="item.id" v-for="item in FaxmList" :key="item.id">
                  {{item.name}}
                </a-select-option>
              </a-select>
            </a-form-model-item>
          </a-col>
          <a-col :span="8">
            <a-form-model-item label="合同金额（元）" prop="contractAmount">
              <a-input v-model="form.contractAmount"/>
            </a-form-model-item>
          </a-col>
          <a-col :span="8">
            <a-form-model-item label="质保期（年）" prop="warrantyPeriod">
              <a-input v-model="form.warrantyPeriod"/>
            </a-form-model-item>
          </a-col>
          <a-col :span="8">
            <a-form-model-item label="质保金比例（%）" prop="retentionMoneyProportion">
              <a-input v-model="form.retentionMoneyProportion"/>
            </a-form-model-item>
          </a-col>
          <a-col :span="8">
            <a-form-model-item label="经办人" prop="handledBy">
              <a-input v-model="form.handledBy"/>
            </a-form-model-item>
          </a-col>
          <a-col :span="8">
            <a-form-model-item label="开始日期" prop="startDate">
              <a-date-picker v-model="form.startDate" style="width: 100%;"/>
            </a-form-model-item>
          </a-col>
          <a-col :span="8">
            <a-form-model-item label="结束日期" prop="endDate">
              <a-date-picker v-model="form.endDate" style="width: 100%;"/>
            </a-form-model-item>
          </a-col>
          <a-col :span="8">
            <a-form-model-item label="收/付款预警" prop="alertType">
              <a-radio-group v-model="form.alertType">
                <a-radio :value="0">
                  收款预警
                </a-radio>
                <a-radio :value="1">
                  付款预警
                </a-radio>
              </a-radio-group>
            </a-form-model-item>
          </a-col>
          <a-col :span="8">
            <a-form-model-item label="付款达到（%）" prop="paymentRate">
              <a-input v-model="form.paymentRate"/>
            </a-form-model-item>
          </a-col>
          <a-col :span="8">
            <a-form-model-item label="到期预警" prop="expirationAlert">
              <a-radio-group v-model="form.expirationAlert">
                <a-radio :value="0">
                  否
                </a-radio>
                <a-radio :value="1">
                  是
                </a-radio>
              </a-radio-group>
            </a-form-model-item>
          </a-col>
          <a-col :span="8">
            <a-form-model-item label="预警天数" prop="alertDays">
              <a-input v-model="form.alertDays"/>
            </a-form-model-item>
          </a-col>
          <a-col :span="8">
            <a-form-model-item label="收/付款条件" prop="paymentTerms">
              <a-input v-model="form.paymentTerms"/>
            </a-form-model-item>
          </a-col>
          <a-col :span="8">
            <a-form-model-item label="备注" prop="remarks">
              <a-input v-model="form.remarks"/>
            </a-form-model-item>
          </a-col>
          <a-col :span="8">
            <a-form-model-item label="提成比例" prop="percentage">
              <a-input v-model="form.percentage"/>
            </a-form-model-item>
          </a-col>
          <a-col :span="8">
            <a-form-model-item label="是否结算" prop="settlementStatus">
              <a-radio-group v-model="form.settlementStatus">
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
            <a-table :columns="uploadColumns" rowKey="id" :data-source="fileRecordList" :pagination="false">
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
  import {attachmentUpload,deleteContractInfoByid,insertContractInfo,queryContractInfoByid,queryContractInfoPage,updateContractInfo} from "@/api/ItemContractManagement/ContractParameter";
  import {queryContractCategoryList} from "@/api/ItemContractManagement/ContractCategory";
  import {queryDepartmentTree} from "@/api/BasicInformationManagement/DepartmentManagement";
  import {queryEngineeringManageList} from "@/api/ProjectInformationManagement/ProjectItem/ProjectManagement";
  import {queryFaxmByGcid,queryFaxmList} from "@/api/ProjectInformationManagement/ProjectItem/ItemSplit";
  const uploadColumns = [
    { title: '文件名称',dataIndex: 'fileName',key: 'fileName' ,width:200},
    { title: '文件路径',dataIndex: 'fileUrl',key: 'fileUrl',width:200},
    { title: '文件大小',dataIndex: 'fileSize',key: 'fileSize',width:200},
    { title: '文件类型',dataIndex: 'fileExt',key: 'fileExt' ,width:200},
    { title: '操作',dataIndex: 'action', scopedSlots: { customRender: 'action' } ,width:200},
  ];
  const columns = [
    { title: '编号',dataIndex: 'contractNumber',key: 'contractNumber' },
    { title: '名称',dataIndex: 'contractName',key: 'contractName' },
    { title: '合同类目',dataIndex: 'categoryName',key: 'categoryName' },
    // { title: '状态',dataIndex: 'auditStatus',key: 'auditStatus' },
    { title: '更新时间',dataIndex: 'createTime',key: 'createTime' },
    { title: '操作',dataIndex: 'action', scopedSlots: { customRender: 'action' } },
  ];
  const defaultFileList=[
    {
      uid: '1',
      name: 'xxx.png',
      status: 'done',
      response: 'Server Error 500', // custom error message to show
      url: 'http://www.baidu.com/xxx.png',
    },
    {
      uid: '2',
      name: 'yyy.png',
      status: 'done',
      url: 'http://www.baidu.com/yyy.png',
    },
    {
      uid: '3',
      name: 'zzz.png',
      status: 'error',
      response: 'Server Error 500', // custom error message to show
      url: 'http://www.baidu.com/zzz.png',
    }];
  const data = [
    {
      id: '1',
      contractNumber: '0001',
      contractName: '建设合同',
      categoryName: '建设合同',
      auditStatus: '无',
      createTime: '2020-10-10',
    },
    {
      id: '2',
      contractNumber: '0002',
      contractName: '建设合同',
      categoryName: '建设合同',
      auditStatus: '无',
      createTime: '2020-10-10',
    },
  ];
  //弹窗混入
  const modalMixins = {
    data () {
      return {
        defaultFileList,
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
          contractNumber:'',
          contractName:'',
          auditStatus:''
        }
      }
    },
    methods: {
      // 搜索
      onSearch () {
        this.queryContractInfoPage();
      },
      // 去添加
      onToAdd () {
        this.modalState = true
        this.modalTitle = '新增合同';
        this.addStatus = true;
        this.form = {
          alertDays:'',
          alertType:0,
          departmentId:'',
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
          expirationAlert:0,
          handledBy: '',
          paymentRate:'',
          paymentTerms: '',
          percentage:'',
          remarks: '',
          retentionMoneyProportion:'',
          settlementStatus: 0,
          startDate: '',
          warrantyPeriod:'',
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
          alertDays:'',
          alertType:0,
          departmentId:'',
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
          expirationAlert:0,
          handledBy: '',
          paymentRate:'',
          paymentTerms: '',
          percentage:'',
          remarks: '',
          retentionMoneyProportion:'',
          settlementStatus: 0,
          startDate: '',
          warrantyPeriod:'',
        },
        rules: {
          alertDays:[{ required: true, message: '请输入预警天数', trigger: 'blur' }],
          departmentId:[{ required: true, message: '请选择所属部门', trigger: 'change' }],
          categoryId:[{ required: true, message: '请选择合同类目', trigger: 'change' }],
          projectId:[{ required: true, message: '请选择所属项目', trigger: 'change' }],
          contactOrganizationName: [{ required: true, message: '请输入往来单位名称', trigger: 'blur' }],
          contractAmount:[{ required: true, message: '请输入合同金额', trigger: 'blur' }],
          contractName: [{ required: true, message: '请输入合同名称', trigger: 'blur' }],
          contractNumber: [{ required: true, message: '请输入合同编号', trigger: 'blur' }],
          customerContactName: [{ required: true, message: '请输入客户联系人姓名', trigger: 'blur' }],
          customerContactPhone: [{ required: true, message: '请输入客户联系人电话', trigger: 'blur' }],
          date: [{ required: true, message: '请选择日期', trigger: 'change' }],
          endDate: [{ required: true, message: '请选择结束日期', trigger: 'change' }],
          handledBy: [{ required: true, message: '请输入经办人', trigger: 'blur' }],
          paymentRate:[{ required: true, message: '请输入收付到达（比率）', trigger: 'blur' }],
          paymentTerms: [{ required: true, message: '请输入收付款条件', trigger: 'blur' }],
          percentage:[{ required: true, message: '请输入提成比例', trigger: 'blur' }],
          remarks: [{ required: true, message: '请输入备注', trigger: 'blur' }],
          retentionMoneyProportion:[{ required: true, message: '请输入质保金比例', trigger: 'blur' }],
          startDate: [{ required: true, message: '请选择开始日期', trigger: 'change' }],
          warrantyPeriod:[{ required: true, message: '请输入质保期', trigger: 'blur' }],
        },
        uploading:false,
        fileRecordList:[],
        fileList:[]
      }
    },
    methods: {
      //添加
      onAdd(){
        this.$refs.ruleForm.validate(valid => {
          console.log(this.form)
          if (valid) {
            insertContractInfo(Object.assign(this.form,{fileRecordList:this.fileRecordList}))
              .then(res => {
                if(res.code==2020200){
                  console.log(res)
                  this.queryContractInfoPage();
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
            updateContractInfo(Object.assign(this.form,{id:this.id,fileRecordList:this.fileRecordList}))
              .then(res => {
                if(res.code==2020200){
                  console.log(res)
                  this.queryContractInfoPage();
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
        console.log(this.fileList)
        return false;
      },
      //上传
      upload(){
        const { fileList } = this;
        const formData = new FormData();
        fileList.forEach(file => {
          formData.append('file', file);
        });
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
        console.log(record)
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
        data,
        ContractCategoryList:[],
        DepartmentTree:[],
        FaxmList:[],
      }
    },
    created () {
      this.queryContractInfoPage();
      this.queryContractCategoryList();
      this.queryDepartmentTree();
      this.queryFaxmList();
    },
    methods: {
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
      //查询
      queryContractInfoPage(){
        this.spinning = true;
        queryContractInfoPage(Object.assign(this.page,this.headerForm))
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
      //查询合同类目
      queryContractCategoryList(){
        queryContractCategoryList()
          .then(res => {
            if(res.code==2020200){
              this.ContractCategoryList = res.data;
              console.log('合同类目')
              console.log(res)
            }else{
              this.$message.info(res.message);
            }
          })
          .catch((e) => {
            console.log(e)
          })
      },
      //查询部门树
      queryDepartmentTree(){
        queryDepartmentTree()
          .then(res => {
            if(res.code==2020200){
              this.DepartmentTree = res.data;
              this.getTreeDepartment(this.DepartmentTree);
            }else{
              this.$message.info(res.message);
            }
          })
          .catch((e) => {
            console.log(e)
          })
      },
      //查询所属项目
      queryFaxmList(){
        queryFaxmList()
          .then(res => {
            if(res.code==2020200){
              this.FaxmList = res.data;
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
        this.modalTitle = '修改合同';
        this.addStatus = false;
        queryContractInfoByid({id:record.id})
          .then(res => {
            if(res.code==2020200){
              console.log('123123123123123')
              console.log(res,res)
              this.form = {
                alertDays:res.data.alertDays,
                alertType:res.data.alertType,
                departmentId:res.data.departmentId+'',
                categoryId:res.data.categoryId+'',
                projectId:res.data.projectId,
                contactOrganizationName: res.data.contactOrganizationName,
                contractAmount:res.data.contractAmount,
                contractName: res.data.contractName,
                contractNumber: res.data.contractNumber,
                customerContactName: res.data.customerContactName,
                customerContactPhone: res.data.customerContactPhone,
                date: res.data.date,
                endDate: res.data.endDate,
                expirationAlert:res.data.expirationAlert,
                handledBy: res.data.handledBy,
                paymentRate:res.data.paymentRate,
                paymentTerms: res.data.paymentTerms,
                percentage:res.data.percentage,
                remarks: res.data.remarks,
                retentionMoneyProportion:res.data.retentionMoneyProportion,
                settlementStatus: res.data.settlementStatus,
                startDate: res.data.startDate,
                warrantyPeriod:res.data.warrantyPeriod,
              };
              this.id = res.data.id;
              this.fileRecordList = res.data.fileRecordList;
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
        deleteContractInfoByid({id:record.id})
          .then(res => {
            if(res.code==2020200){
              this.queryContractInfoPage();
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
    name: 'ContractParameter',
    mixins: [tableMixins,modalMixins,formModeMixins,headMixins,paginationMixins],
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
