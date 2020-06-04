<template>
  <div>
    <!-- 页头 -->
    <div class="a-header">
      <a-col class="gutter-row" :span="4">
        <div class="gutter-box">
          <label>机构名称:</label>
          <a-input placeholder="机构名称" v-model="headerForm.organizationName" />
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
         <!--v-if="hasPermission('update')-->
        <a-button type="primary" @click="onSearch" >查询</a-button>
        <a-button type="primary" @click="onToAdd" >新增</a-button>
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
    <a-modal v-model="modalState" :title="modalTitle" :footer="null">
      <!--表单-->
      <a-form-model
        ref="ruleForm"
        :model="form"
        :rules="rules"
        :label-col="labelCol"
        :wrapper-col="wrapperCol"
      >
        <a-form-model-item label="机构名称" prop="organizationName">
          <a-input v-model="form.organizationName" placeholder="请输入用户名称"/>
        </a-form-model-item>
        <a-form-model-item label="是否启用" prop="enable">
          <a-switch v-model="form.enable" />
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
  import {deleteOrganizationByid,insertOrganization,queryOrganizationByid,queryOrganizationList,queryOrganizationPage,updateOrganization} from "@/api/BasicInformationManagement/OrganizationManagement";
  const columns = [
    {title: '名称', dataIndex: 'organizationName',},
    {title: '启用状态',dataIndex: 'enable',key: 'enable' ,scopedSlots: { customRender: 'enable' }, },
    {title: '操作', key: 'action', scopedSlots: { customRender: 'action' },},
  ];
  //头部混入
  const headMixins = {
    data () {
      return {
        headerForm:{
          organizationName:'',
          enable:''
        }
      }
    },
    created () {
    },
    methods: {
      // 搜索
      onSearch () {
        this.queryOrganizationPage();
      },
      // 去添加
      onToAdd () {
        this.modalTitle='新建机构',
        this.addStatus = true;
        this.modalState = true
        this.form.organizationName = '',
        this.form.enable = false
      },
    }
  };
  //列表混入
  const tableMixins = {
    data () {
      return {
        columns,
        data:[],
        page:{
          pageNumber:1,
          pageSize:10
        }
      }
    },
    created () {
      this.queryOrganizationPage();
    },
    methods: {
      queryOrganizationPage(){
        this.spinning = true;
        queryOrganizationPage(Object.assign(this.page,this.headerForm))
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
        this.modalTitle = '修改机构';
        this.addStatus = false;
        this.form.organizationName = record.organizationName;
        this.form.enable = record.enable==1?true:false;
        this.id = record.id;
      },
      // 删除确认
      onDeleteConfirm (record) {
        deleteOrganizationByid({id:record.id})
          .then(res => {
            if(res.code==2020200){
              this.queryOrganizationPage();
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
  //弹窗混入
  const modalMixins = {
    data () {
      return {
        modalTitle:'新建机构',
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
        labelCol: { span: 8 },
        wrapperCol: { span: 14 },
        addStatus:true,
        id:'',
        form:{
          organizationName:'',
          enable:false,
        },
        rules: {
          organizationName: [{ required: true, message: '请输入机构名称', trigger: 'blur' }],
          enable: [{ required: true, message: '请选择启用状态', trigger: 'change' }],
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
            let params = {
              organizationName:this.form.organizationName,
              enable:this.enable?1:0
            };
            insertOrganization(params)
              .then(res => {
                if(res.code==2020200){
                  this.queryOrganizationPage();
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
      //修改
      onUpdate(){
        const params = {
          id:this.id,
          organizationName:this.form.organizationName,
          enable:this.form.enable?1:0,
        };
        updateOrganization(params)
          .then(res => {
            if(res.code==2020200){
              this.queryOrganizationPage();
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
  //vue实例
  export default {
    name: 'OrganizationManagement',
    mixins: [tableMixins,paginationMixins,modalMixins,formModeMixins,headMixins],
    data () {
      return {
        spinning:false
      }
    },
    created(){
    },
    methods:{
    }
  }
</script>

<style scoped lang="less">
  /deep/ .even{
    background:#ffffff;
  }
  /deep/ .odd{
    background: #fafafa;
  }
  .ant-table-body{
   background: #2f54eb;
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
