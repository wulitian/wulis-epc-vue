<template>
  <div>
    <!-- 页头 -->
    <div class="a-header">
      <a-col class="gutter-row" :span="4">
        <div class="gutter-box">
          <label>角色名称:</label>
          <a-input placeholder="角色名称" v-model="headerForm.roleName"/>
        </div>
      </a-col>
      <a-col class="gutter-row" :span="4">
        <div class="gutter-box">
          <label>权限字符:</label>
          <a-input placeholder="权限字符" v-model="headerForm.roleMark"/>
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
        <a-form-model-item label="角色名称" prop="roleName">
          <a-input v-model="form.roleName" placeholder="请输入角色名称"/>
        </a-form-model-item>
        <a-form-model-item label="权限字符" prop="roleMark">
          <a-input v-model="form.roleMark" placeholder="请输入权限字符"/>
        </a-form-model-item>
        <a-form-model-item label="排序" prop="sort">
          <a-input v-model="form.sort" placeholder="请输入排序"/>
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
        <a-form-model-item label="备注" prop="remark">
          <a-textarea placeholder="请输入备注" :rows="4" v-model="form.remark"/>
        </a-form-model-item >
        <a-form-model-item label="菜单权限" prop="menuIds">
          <a-tree
            v-model="form.menuIds"
            checkable
            checkStrictly
            :tree-data="treeData"
            @check="onTreeCheck"
          />
        </a-form-model-item >

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
  import {deleteRoleByid,insertRole,queryRoleByid,queryRoleList,queryRolePage,updateRole} from "@/api/SystemPermissionsManagement/RoleManagement";
  import {queryMenuTree} from "@/api/SystemPermissionsManagement/MenuManagement";
  const columns = [
    {title: '角色名称',dataIndex: 'roleName',},
    {title: '权限字符', dataIndex: 'roleMark',},
    {title: '排序', dataIndex: 'sort',},
    {title: '创建时间', dataIndex: 'createTime',},
    {title: '启用状态',dataIndex: 'enable',key: 'enable' ,scopedSlots: { customRender: 'enable' }, },
    {title: '操作', key: 'action', scopedSlots: { customRender: 'action' },},
  ];
  //头部混入
  const headMixins = {
    data () {
      return {
        headerForm:{
          enable:'',
          roleMark:'',
          roleName:''
        }
      }
    },
    created () {
    },
    methods: {
      // 搜索
      onSearch () {
        this.queryRolePage();
      },
      // 去添加
      onToAdd () {
        this.form.roleName='';
        this.form.roleMark='';
        this.form.sort=0;
        this.form.remark='';
        this.form.enable=1;
        this.form.menuIds={
          checked:[]
        };
        this.modalTitle='新建角色';
        this.addStatus = true;
        this.modalState = true;
      },
    }
  };
  //列表混入
  const tableMixins = {
    data () {
      return {
        columns,
        data:[],
        treeData:[],
        page:{
          pageNumber:1,
          pageSize:10
        }
      }
    },
    created () {
      this.queryRolePage();
      this.queryMenuTree();
    },
    methods: {
      //查询菜单列表
      queryMenuTree(){
        queryMenuTree()
          .then(res => {
            if(res.code==2020200){
              this.treeData = res.data;
              this.getTree(this.treeData)
            }else{
              this.$message.info(res.message);
            }
          })
          .catch((e) => {
            console.log(e)
          })
      },
      //查询角色列表
      queryRolePage(){
        this.spinning = true;
        queryRolePage(Object.assign(this.page,this.headerForm))
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
        this.modalTitle = '修改角色';
        this.addStatus = false;
        queryRoleByid({id:record.id})
          .then(res => {
            if(res.code==2020200){
              this.form.roleName = res.data.roleName;
              this.form.roleMark = res.data.roleMark;
              this.form.sort = res.data.sort;
              this.form.remark = res.data.remark;
              this.form.enable = res.data.enable;
              this.form.menuIds.checked = res.data.menuIds.map(String)
              this.id = record.id;
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
        deleteRoleByid({id:record.id})
          .then(res => {
            if(res.code==2020200){
              this.$message.info(res.message);
              this.queryRolePage();
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
      onPaginationChange (page, pageSize) {
        console.log(page,pageSize)
      },
      // 分页下拉改变
      onShowSizeChange (current, size) {
        console.log(current,size)
      }
    }
  };
  //弹窗混入
  const modalMixins = {
    data () {
      return {
        modalTitle:'新建角色',
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
        expandedKeys: [],
        autoExpandParent: true,
        checkedKeys: [],
        selectedKeys: [],
        addStatus:true,
        labelCol: { span: 8 },
        wrapperCol: { span: 14 },
        id:'',
        form:{
          roleName:'',
          roleMark:'',
          sort:0,
          remark:'',
          enable:1,
          menuIds:{
            checked:[]
          }
        },
        rules: {
          JgName: [{ required: true, message: '请输入机构名称', trigger: 'blur' }],
          roleMark: [{ required: true, message: '请输入权限字符', trigger: 'blur' }],
          sort: [{ required: true, message: '请输入序号', trigger: 'blur' }],
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
              roleName:this.form.roleName,
              roleMark:this.form.roleMark,
              sort:this.form.sort,
              remark:this.form.remark,
              enable:this.form.enable,
              menuIds:this.form.menuIds.checked
            }
            insertRole(params)
              .then(res => {
                if(res.code==2020200){
                  this.queryRolePage();
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
      onUpdate(){
        let params = {
          roleName:this.form.roleName,
          roleMark:this.form.roleMark,
          sort:this.form.sort,
          remark:this.form.remark,
          enable:this.form.enable,
          menuIds:this.form.menuIds.checked,
          id:this.id
        }
        updateRole(params)
          .then(res => {
            if(res.code==2020200){
              this.queryRolePage();
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
      },
      onTreeExpand(expandedKeys) {
        console.log('onExpand', expandedKeys);
        this.expandedKeys = expandedKeys;
        this.autoExpandParent = false;
      },
      onTreeCheck(checkedKeys) {
        console.log('onCheck', checkedKeys.checked);
        // this.form.menuIds = checkedKeys.checked;
        // console.log(this.form.menuIds)
      },
      onTreeSelect(selectedKeys, info) {
        console.log('onSelect', info);
        this.selectedKeys = selectedKeys;
      },
    }
  }
  //vue实例
  export default {
    name: 'RoleManagement',
    mixins: [tableMixins,paginationMixins,modalMixins,formModeMixins,headMixins],
    data () {
      return {
        spinning:false
      }
    },
    created(){
    },
    methods:{
      getTree(data) {
        for(let i = 0; i < data.length; i++) {
          if(data[i].menuType==0){
            data[i].title = data[i].menuName;
            data[i].value = data[i].id;
            data[i].key = data[i].id;
            if(data[i].nodes&&data[i].nodes.length>0){
              data[i].children = data[i].nodes;
              this.getTree(data[i].nodes)
            }
          }else{
            delete data[i];
          }
        }
      }
    }
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
  /deep/ .even{
    background:#ffffff;
  }
  /deep/ .odd{
    background: #fafafa;
  }
</style>
