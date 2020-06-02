<template>
  <div>
    <!-- 页头 -->
    <div class="a-header">
      <a-col class="gutter-row" :span="4">
        <div class="gutter-box">
          <label>计划编号:</label>
          <a-input v-model="headerForm.jhbh"/>
        </div>
      </a-col>
      <a-col class="gutter-row" :span="4">
        <div class="gutter-box">
          <label>计划阶段:</label>
          <a-input v-model="headerForm.jhjd"/>
        </div>
      </a-col>
      <a-col class="gutter-row" :span="4">
        <div class="gutter-box">
          <label>开始时间:</label>
          <a-input v-model="headerForm.kssj"/>
        </div>
      </a-col>
      <a-col class="gutter-row" :span="4">
        <div class="gutter-box">
          <label>结束时间:</label>
          <a-input v-model="headerForm.jssj"/>
        </div>
      </a-col>
      <span style="margin-left: 10px">
        <a-button type="primary" @click="onSearch">查询</a-button>
        <a-button type="primary" @click="onToAdd">新增</a-button>
      </span>
    </div>
    <!-- 列表 -->
    <a-spin :spinning="spinning">
      <a-table :columns="columns" rowKey="id" :data-source="data" :pagination="false">
      <span slot="action" slot-scope="text, record">
        <a @click="onView(record)">查看</a>
        <a-divider type="vertical" />
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
        <a-form-model-item label="计划名称" prop="jhmc">
          <a-input v-model="form.jhmc" />
        </a-form-model-item>
        <a-form-model-item label="涉及项目" prop="sjxm">
          <a-input v-model="form.sjxm" />
        </a-form-model-item>
        <a-form-model-item label="开始时间" prop="kssj">
          <a-date-picker v-model="form.kssj"/>
        </a-form-model-item>
        <a-form-model-item label="结束时间" prop="jssj">
          <a-date-picker v-model="form.jssj"/>
        </a-form-model-item>
        <a-form-model-item label="涉及项目" prop="sjxm">
          <a-input v-model="form.sjxm" />
        </a-form-model-item>
        <a-form-model-item label="计划审核组" prop="jhshz">
          <a-input v-model="form.jhshz" />
        </a-form-model-item>
        <a-form-model-item label="描述" prop="ms">
          <a-input v-model="form.ms" />
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

  const columns = [
    { title: '计划编号',dataIndex: 'jhbh',key: 'jhbh' },
    { title: '计划名称',dataIndex: 'jhmc',key: 'jhmc' },
    { title: '项目名称',dataIndex: 'xmmc',key: 'xmmc' },
    { title: '状态',dataIndex: 'enable',key: 'enable' },
    { title: '年份',dataIndex: 'nf',key: 'nf' },
    { title: '操作',dataIndex: 'action', scopedSlots: { customRender: 'action' } },
  ];
  const data = [
    {
      id: '1',
      jhbh: '123',
      jhmc: '关于建设市中心的计划',
      xmmc: '项目1',
      enable: '已结束',
      nf: '2020',
    },
    {
      id: '2',
      jhbh: '123',
      jhmc: '关于建设市中心的计划',
      xmmc: '项目1',
      enable: '已结束',
      nf: '2020',
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
          jhbh:'',
          jhjd:'',
          kssj:'',
          jssj:'',
        }
      }
    },
    methods: {
      // 搜索
      onSearch () {
      },
      // 去添加
      onToAdd () {
        this.modalState = true
        this.modalTitle = '新增项目计划';
        this.addStatus = true;
        this.form={
          jhmc:'',
            sjxm:'',
            kssj:'',
            jssj:'',
            jhshz:'',
            ms:'',
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
          jhmc:'',
          sjxm:'',
          kssj:'',
          jssj:'',
          jhshz:'',
          ms:'',
        },
        rules: {
          jhmc: [{ required: true, message: '请输入计划名称', trigger: 'blur' }],
          sjxm: [{ required: true, message: '请选择设计项目', trigger: 'change' }],
          kssj: [{ required: true, message: '请选择开始时间', trigger: 'change' }],
          jssj: [{ required: true, message: '请选择结束时间', trigger: 'change' }],
          jhshz: [{ required: true, message: '请选择计划审核组', trigger: 'change' }],
          ms: [{ required: true, message: '请输入描述', trigger: 'blur' }],
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
            // addUser(params)
            //   .then(res => {
            //     if(res.code==2020200){
            //       console.log(res)
            //       this.onSelectUserList();
            //       this.updateModal = false;
            //       this.$message.info(res.message);
            //     }else{
            //       this.$message.info(res.message);
            //     }
            //   })
            //   .catch((e) => {
            //     console.log(e)
            //   })
          } else {
            return false;
          }
        });
      },
      //修改
      onUpdate(){
        this.$refs.ruleForm.validate(valid => {
          if (valid) {
            // updateUser(params)
            //   .then(res => {
            //     if(res.code==2020200){
            //       console.log(res)
            //       this.onSelectUserList();
            //       this.updateModal = false;
            //       this.$message.info(res.message);
            //     }else{
            //       this.$message.info(res.message);
            //     }
            //   })
            //   .catch((e) => {
            //     console.log(e)
            //   })
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
    },
    methods: {
      // 查看
      onView (record) {
        console.log(record)
      },
      // 修改
      onToUpdate (record) {
        this.modalState = true;
        this.modalTitle = '修改项目计划';
        this.addStatus = false;
        // queryUserByid({id:record.id})
        //   .then(res => {
        //     if(res.code==2020200){
            //   this.form = {
            //     jhmc:res.data.jhmc,
            //     sjxm:res.data.sjxm,
            //     kssj:res.data.kssj,
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
    name: 'PlanManagement',
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
