<template>
  <div>
    <!-- 页头 -->
    <div class="a-header">
      <a-col class="gutter-row" :span="4">
        <div class="gutter-box">
          <label>机构名称:</label>
          <a-select style="width: 100%;" v-model="headerForm.organizationId">
            <a-select-option v-for="item in organizationList" :value="item.id" :key="item.id">
              <a-tooltip>
                <template slot="title">
                  {{item.organizationName}}
                </template>
                {{item.organizationName}}
              </a-tooltip>
            </a-select-option>
          </a-select>
        </div>
      </a-col>
      <a-col class="gutter-row" :span="4">
        <div class="gutter-box">
          <label>部门名称:</label>
          <a-input placeholder="部门名称" v-model="headerForm.departmentName"/>
        </div>
      </a-col>
      <a-col class="gutter-row" :span="4">
        <div class="gutter-box">
          <label>启用状态:</label>
          <a-select  style="width: 100%;" v-model="headerForm.enable">
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
      <a-table  bordered :columns="columns" :data-source="data" rowKey="id" childrenColumnName="nodes" :pagination="false" >
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
        <a-form-model-item label="所属机构" prop="organizationId">
          <a-select style="width: 100%;" v-model="form.organizationId" @change="organizationChange">
            <a-select-option v-for="item in organizationList" :value="item.id" :key="item.id">
              <a-tooltip>
                <template slot="title">
                  {{item.organizationName}}
                </template>
                {{item.organizationName}}
              </a-tooltip>
            </a-select-option>
          </a-select>
        </a-form-model-item>
        <a-form-model-item label="上级部门" prop="parentId" >
          <a-tree-select
            v-model="form.parentId"
            style="width: 100%"
            :dropdown-style="{ maxHeight: '400px', overflow: 'auto' }"
            :tree-data="selectTreeData"
            placeholder="请选择上级部门"
            tree-default-expand-all
          >
          </a-tree-select>
        </a-form-model-item>
        <a-form-model-item label="部门名称" prop="departmentName">
          <a-input v-model="form.departmentName" placeholder="部门名称"/>
        </a-form-model-item>
        <a-form-model-item label="排序" prop="sort">
          <a-input-number  v-model="form.sort" :min="0" :max="100000" placeholder="请输入序号" style="width: 100%;"/>
        </a-form-model-item>
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
  import {deleteDepartmentById,insertDepartment,queryDepartmentByid,queryDepartmentTree,updateDepartment} from "@/api/BasicInformationManagement/DepartmentManagement";
  import {queryOrganizationList} from "@/api/BasicInformationManagement/OrganizationManagement";

  const columns = [
    { title: '名称',dataIndex: 'departmentName',key: 'departmentName' },
    { title: '所属机构',dataIndex: 'organizationName',key: 'organizationName' },
    { title: '排序',dataIndex: 'sort',key: 'sort' },
    { title: '创建时间',dataIndex: 'createTime',key: 'createTime' },
    { title: '启用状态',dataIndex: 'enable',key: 'enable' ,scopedSlots: { customRender: 'enable' }, },
    { title: '操作',dataIndex: 'action', scopedSlots: { customRender: 'action' } },
  ];
  //头部混入
  const headMixins = {
    data () {
      return {
        headerForm:{
          departmentName:'',
          enable:'',
          organizationId:'',
        }
      }
    },
    methods: {
      // 搜索
      onSearch () {
        this.queryDepartmentTreeFun();
      },
      // 去添加
      onToAdd () {
        this.modalState = true;
        this.modalTitle = '添加部门';
        this.addStatus = true;
        this.form = {
          organizationId:'',
          parentId:'',
          departmentName:'',
          sort:0,
          enable:1
        }
      }
    }
  };
  //列表混入
  const tableMixins = {
    data () {
      return {
        columns,
        data :[],
        selectTreeData:[],
        organizationList:[],
      }
    },
    created () {
      this.queryDepartmentTreeFun();
      this.queryOrganizationList();
    },
    methods: {
      //查询部门树
      queryDepartmentTreeFun(){
        this.spinning = true;
        queryDepartmentTree(this.headerForm)
          .then(res => {
            if(res.code==2020200){
              this.data = res.data
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
      //机构点击
      organizationChange(id){
        queryDepartmentTree({organizationId:id})
          .then(res => {
            if(res.code==2020200){
              this.form.parentId = '';
              this.selectTreeData = res.data;
              this.getTree(this.selectTreeData);
              console.log(res.data)
            }else{
              this.$message.info(res.message);
            }
          })
          .catch((e) => {
            console.log(e)
          })
      },
      //查询机构列表
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
      // 查看
      onView (record) {
        console.log(record)
      },
      // 修改
      onToUpdate (record) {
        this.modalState = true;
        this.modalTitle = '修改部门';
        this.addStatus = false;
        queryDepartmentByid({id:record.id})
          .then(res => {
            if(res.code==2020200){
              this.form.organizationId= res.data.organizationId+'';
              queryDepartmentTree({organizationId:this.form.organizationId})
                .then(res2 => {
                  if(res2.code==2020200){
                    this.selectTreeData = res2.data;
                    this.getTree(this.selectTreeData);
                    this.form.parentId= res.data.parentId==0?'':res.data.parentId;
                    this.form.departmentName= res.data.departmentName;
                    this.form.sort= res.data.sort;
                    this.form.enable= res.data.enable;
                    this.id = res.data.id;
                  }else{
                    this.$message.info(res2.message);
                  }
                })
                .catch((e) => {
                  console.log(e)
                })
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
        deleteDepartmentById({id:record.id})
          .then(res => {
            if(res.code==2020200){
              this.queryDepartmentTreeFun();
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
  //弹窗混入
  const modalMixins = {
    data () {
      return {
        modalTitle:'新建部门',
        modalState:false
      }
    },
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
          organizationId:'',
          parentId:'',
          departmentName:'',
          sort:0,
          enable:1
        },
        rules: {
          organizationId: [{ required: true, message: '请输入所属机构', trigger: 'blur' }],
          departmentName: [{ required: true, message: '请输入部门名称', trigger: 'blur' }],
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
                organizationId:this.form.organizationId,
                parentId:(this.form.parentId==''?'0':this.form.parentId),
                departmentName:this.form.departmentName,
                sort:this.form.sort,
                enable:this.form.enable,
            };
            insertDepartment(params)
              .then(res => {
                if(res.code==2020200){
                  this.queryDepartmentTreeFun();
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
      onUpdate(){
        this.$refs.ruleForm.validate(valid => {
          if (valid) {
            let params = {
              organizationId:this.form.organizationId,
              parentId:(this.form.parentId==''?'0':this.form.parentId),
              departmentName:this.form.departmentName,
              sort:this.form.sort,
              enable:this.form.enable,
              id:this.id
            };
            updateDepartment(params)
              .then(res => {
                if(res.code==2020200){
                  this.queryDepartmentTreeFun();
                  this.modalState = false;
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
      }
    }
  }
  //vue实例
  export default {
    name: 'DepartmentManagement',
    mixins: [tableMixins,modalMixins,formModeMixins,headMixins],
    data () {
      return {
        spinning:false
      }
    },
    created(){
    },
    methods:{
      //修改tree的key值
      getTree(data) {
        for(let i = 0; i < data.length; i++) {
            data[i].title = data[i].departmentName;
            data[i].value = data[i].id;
            data[i].key = data[i].id;
            if(data[i].nodes&&data[i].nodes.length>0){
              data[i].children = data[i].nodes;
              this.getTree(data[i].nodes)
            }
        }
      }
    }
}
</script>

<style scoped >
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
