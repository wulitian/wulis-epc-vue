<template>
  <div>
    <!-- 页头 -->
    <div class="a-header">
      <a-col class="gutter-row" :span="4">
        <div class="gutter-box">
          <label>成本科目:</label>
          <a-input placeholder="成本科目" v-model="headerForm.name"/>
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
    <a-modal v-model="modalState" :title="modalTitle" :footer="null">
      <!--表单-->
      <a-form-model
        ref="ruleForm"
        :model="form"
        :rules="rules"
        :label-col="labelCol"
        :wrapper-col="wrapperCol"
      >
        <a-form-model-item label="成本科目" prop="name">
          <a-input v-model="form.name" />
        </a-form-model-item>
        <a-form-model-item label="大类名称" prop="category">
          <a-input v-model="form.category" />
        </a-form-model-item>
        <a-form-model-item label="备注" prop="remark">
          <a-input v-model="form.remark" />
        </a-form-model-item>
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
  import {insertSubject,updateSubject,batchDeleteSubject,querySubjectList,querySubjectPage,deleteSubjectByid} from "@/api/ProjectInformationManagement/CostCod/CostSubject";
  const columns = [
    { title: '成本科目',dataIndex: 'name',key: 'name' },
    { title: '大类名称',dataIndex: 'category',key: 'category' },
    { title: '备注',dataIndex: 'remark',key: 'remark' },
    {title: '启用状态',dataIndex: 'enable',key: 'enable' ,scopedSlots: { customRender: 'enable' }, },
    { title: '创建时间',dataIndex: 'createTime',key: 'createTime' },
    { title: '操作',dataIndex: 'action', scopedSlots: { customRender: 'action' } },
  ];
  const data = [
    {
      id: '1',
      name: '专业分包费',
      category: '专业分包费',
      remark: '无',
      enable: '启用',
      createTime: '2020-10-10',
    },
    {
      id: '2',
      name: '专业分包费',
      category: '专业分包费',
      remark: '无',
      enable: '启用',
      createTime: '2020-10-10',
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
        this.querySubjectPage();
      },
      // 分页下拉改变
      onShowSizeChange (pageNumber, pageSize) {
        this.page.pageNumber = pageNumber
        this.page.pageSize = pageSize
        this.querySubjectPage();
      }
    }
  };
  //头部混入
  const headMixins = {
    data () {
      return {
        headerForm:{
          name:'',
          enable:''
        }
      }
    },
    methods: {
      // 搜索
      onSearch () {
        this.querySubjectPage();
      },
      // 去添加
      onToAdd () {
        this.modalState = true
        this.modalTitle = '新增成本科目';
        this.addStatus = true;
        this.form={
            name:'',
            category:'',
            remark:'',
            enable:1
        };
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
          name:'',
          category:'',
          remark:'',
          enable:1
        },
        rules: {
          name: [{ required: true, message: '请输入成本名称', trigger: 'blur' }],
          category: [{ required: true, message: '请输入大类名称', trigger: 'blur' }],
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
            insertSubject(this.form)
              .then(res => {
                if(res.code==2020200){
                  this.querySubjectPage();
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
            updateSubject(Object.assign(this.form,{id:this.id}))
              .then(res => {
                if(res.code==2020200){
                  this.querySubjectPage();
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
        columns,
        data,
      }
    },
    created () {
      this.querySubjectPage();
    },
    methods: {
      //查询
      querySubjectPage(){
        this.spinning = true;
        querySubjectPage(Object.assign(this.page,this.headerForm))
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
        this.modalTitle = '修改成本科目';
        this.addStatus = false;
        this.id=record.id;
        this.form={
            name:record.name,
            category:record.category,
            remark:record.remark,
            enable:record.enable,
        };
      },
      // 删除确认
      onDeleteConfirm (record) {
        deleteSubjectByid({id:record.id})
          .then(res => {
            if(res.code==2020200){
              this.querySubjectPage();
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
    name: 'CostSubject',
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
