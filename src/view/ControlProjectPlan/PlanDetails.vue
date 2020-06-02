<template>
  <div>
    <!--tabs-->
    <a-tabs type="card" @change="tabChange">
      <a-tab-pane key="1" tab="济南市医院">
      </a-tab-pane>
      <a-tab-pane key="2" tab="文化广场">
      </a-tab-pane>
    </a-tabs>
    <!--header-->
    <a-page-header
      style="border: 1px solid rgb(235, 237, 240)"
      :title="pageHeadForm.title"
      :sub-title="pageHeadForm.subTitle"
      @back="() => $router.go(-1)"
    >
      <template slot="extra">
        <a-button key="3">
          开始施工
        </a-button>
        <a-button key="2">
          结束竣工
        </a-button>
        <a-button key="1" type="primary">
          同意
        </a-button>
      </template>
      <a-descriptions size="small" :column="3">
        <a-descriptions-item label="合同数">
          {{2}}
        </a-descriptions-item>
        <a-descriptions-item label="报告书">
          {{2}}
        </a-descriptions-item>
        <a-descriptions-item label="未审核数量">
          {{2}}
        </a-descriptions-item>
        <a-descriptions-item label="计划开始时间/计划结束时间">
          {{'2019-10-10/2010-10-20'}}
        </a-descriptions-item>
        <a-descriptions-item label="目前工期阶段">
          {{'前期准备阶段'}}
        </a-descriptions-item>
        <a-descriptions-item label="项目工程数量">
          {{2}}
        </a-descriptions-item>
      </a-descriptions>
    </a-page-header>
    <!--列表操作头-->
    <div class="a-header" style="margin-top: 10px">
      <a-col class="gutter-row" :span="4">
        <a-radio-group v-model="headerForm.shzt">
          <a-radio-button value="large">
            全部
          </a-radio-button>
          <a-radio-button value="default">
            待审核
          </a-radio-button>
          <a-radio-button value="small">
            已审核
          </a-radio-button>
        </a-radio-group>
      </a-col>
      <a-col class="gutter-row" :span="4">
        <div class="gutter-box">
          <label>任务名称:</label>
          <a-input v-model="headerForm.rwmc"/>
        </div>
      </a-col>
      <span style="margin-left: 10px">
        <a-button type="primary" @click="onSearch">查询</a-button>
        <a-button type="primary" @click="onToAddHt">新增合同</a-button>
        <a-button type="primary" @click="onToAddBg">新增报告</a-button>
      </span>
    </div>
    <!-- 列表 -->
    <a-spin :spinning="spinning">
      <a-table :columns="columns" rowKey="id" :data-source="data" :pagination="false">
      <span slot="action" slot-scope="text, record">
        <a @click="onView(record)">查看</a>
      </span>
      </a-table>
    </a-spin>
    <!-- 分页 -->
    <a-pagination v-if="total>=10" style="float: right;margin-top: 10px" :total="total" :default-current="1" show-size-changer show-quick-jumper @change="onPaginationChange" @showSizeChange="onShowSizeChange"/>
    <!--弹窗-->
    <a-modal v-model="htModalState" :title="htModalTitle" :footer="null" width="1200px">
      <!--表单-->
      <a-radio-group v-model="HtChangelx" style="margin-left: 90px;margin-bottom: 10px">
        <a-radio :value="0">
          选择合同
        </a-radio>
        <a-radio :value="1">
          新增合同
        </a-radio>
      </a-radio-group>
      <a-form-model
        ref="ruleForm"
        :model="form"
        :rules="rules"
        :label-col="labelCol"
        :wrapper-col="wrapperCol"
      >
        <a-row v-if="HtChangelx=='0'">
          <a-col :span="8">
            <a-form-model-item label="名称" prop="mc">
              <a-input v-model="form.mc" />
            </a-form-model-item>
          </a-col>
          <a-col :span="8">
            <a-form-model-item label="合同选择" prop="mc">
              <a-select style="width: 100%"v-model="form.mc">
                <a-select-option value="jack">
                  Jack
                </a-select-option>
                <a-select-option value="lucy">
                  Lucy
                </a-select-option>
              </a-select>
            </a-form-model-item>
          </a-col>
        </a-row>
        <a-row v-if="HtChangelx=='1'">
          <a-col :span="8">
            <a-form-model-item label="名称" prop="mc">
              <a-input v-model="form.mc" />
            </a-form-model-item>
          </a-col>
          <a-col :span="8">
            <a-form-model-item label="合同" prop="ht">
              <a-input v-model="form.ht"/>
            </a-form-model-item>
          </a-col>
          <a-col :span="8">
            <a-form-model-item label="合同分类" prop="htfl">
              <a-select style="width: 100%" v-model="form.htfl">
                <a-select-option value="jack">
                  Jack
                </a-select-option>
              </a-select>
            </a-form-model-item>
          </a-col>
          <a-col :span="8">
            <a-form-model-item label="合同编号" prop="htbh">
              <a-input v-model="form.htbh"/>
            </a-form-model-item>
          </a-col>
          <a-col :span="8">
            <a-form-model-item label="日期" prop="rq">
              <a-date-picker v-model="form.rq" />
            </a-form-model-item>
          </a-col>
          <a-col :span="8">
            <a-form-model-item label="所属部门" prop="ssbm">
              <a-select style="width: 100%" v-model="form.ssbm">
                <a-select-option value="jack">
                  Jack
                </a-select-option>
              </a-select>
            </a-form-model-item>
          </a-col>
          <a-col :span="8">
            <a-form-model-item label="往来单位" prop="wldw">
              <a-select style="width: 100%" v-model="form.wldw">
                <a-select-option value="jack">
                  Jack
                </a-select-option>
              </a-select>
            </a-form-model-item>
          </a-col>
          <a-col :span="8">
            <a-form-model-item label="客户联系人" prop="kulxr">
              <a-input v-model="form.kulxr"/>
            </a-form-model-item>
          </a-col>
          <a-col :span="8">
            <a-form-model-item label="客户联系电话" prop="kulxdh">
              <a-input v-model="form.kulxdh"/>
            </a-form-model-item>
          </a-col>
          <a-col :span="8">
            <a-form-model-item label="所属项目" prop="ssxm">
              <a-select style="width: 100%" v-model="form.ssxm">
                <a-select-option value="jack">
                  Jack
                </a-select-option>
              </a-select>
            </a-form-model-item>
          </a-col>
          <a-col :span="8">
            <a-form-model-item label="合同金额（元）" prop="htje">
              <a-input v-model="form.htje"/>
            </a-form-model-item>
          </a-col>
          <a-col :span="8">
            <a-form-model-item label="质保期（年）" prop="zbq">
              <a-input v-model="form.zbq"/>
            </a-form-model-item>
          </a-col>
          <a-col :span="8">
            <a-form-model-item label="质保金比例（%）" prop="zbjbl">
              <a-input v-model="form.zbjbl"/>
            </a-form-model-item>
          </a-col>
          <a-col :span="8">
            <a-form-model-item label="经办人" prop="jbr">
              <a-input v-model="form.jbr"/>
            </a-form-model-item>
          </a-col>
          <a-col :span="8">
            <a-form-model-item label="开始日期" prop="ksrq">
              <a-date-picker v-model="form.ksrq" />
            </a-form-model-item>
          </a-col>
          <a-col :span="8">
            <a-form-model-item label="结束日期" prop="jsrq">
              <a-date-picker v-model="form.jsrq" />
            </a-form-model-item>
          </a-col>
          <a-col :span="8">
            <a-form-model-item label="收/付款预警" prop="sfkyj">
              <a-radio-group v-model="form.sfkyj">
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
            <a-form-model-item label="付款达到" prop="fkdd">
              <a-input v-model="form.fkdd"/>
            </a-form-model-item>
          </a-col>
          <a-col :span="8">
            <a-form-model-item label="到期预警" prop="dqyj">
              <a-radio-group v-model="form.dqyj">
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
            <a-form-model-item label="预警天数" prop="yjts">
              <a-input v-model="form.yjts"/>
            </a-form-model-item>
          </a-col>
          <a-col :span="8">
            <a-form-model-item label="收/付款条件" prop="sfktj">
              <a-input v-model="form.sfktj"/>
            </a-form-model-item>
          </a-col>
          <a-col :span="8">
            <a-form-model-item label="备注" prop="remark">
              <a-input v-model="form.remark"/>
            </a-form-model-item>
          </a-col>
          <a-col :span="8">
            <a-form-model-item label="提成比例" prop="tcbl">
              <a-input v-model="form.tcbl"/>
            </a-form-model-item>
          </a-col>
          <a-col :span="8">
            <a-form-model-item label="是否结算" prop="sfjs">
              <a-radio-group v-model="form.sfjs">
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
        <a-form-model-item v-if="HtChangelx=='1'" :wrapper-col="{ span: 20, offset: 0 }" :label-col="{ span: 3 }" style="margin-left: -18px" label="上传附件" prop="scfj">
          <a-upload
            style="margin-top: -40px"
            action="https://www.mocky.io/v2/5cc8019d300000980a055e76"
            :default-file-list="defaultFileList"
          >
            <a-button> <a-icon type="upload" /> 上传附件 </a-button>
          </a-upload>
        </a-form-model-item>
        <a-form-model-item :wrapper-col="{ span: 14, offset: 4 }">
          <a-button type="primary" @click="onAdd" >
            添加
          </a-button>
          <a-button style="margin-left: 10px;" @click="onResetForm">
            重置
          </a-button>
        </a-form-model-item>
      </a-form-model>
    </a-modal>
    <!--弹窗-->
    <a-modal v-model="bgModalState" :title="bgModalTitle" :footer="null">
      <!--表单-->
      <a-form-model
        ref="ruleForm"
        :model="form"
        :rules="rules"
        :label-col="labelCol"
        :wrapper-col="wrapperCol"
      >
        <a-form-model-item label="名称" prop="mc">
          <a-input v-model="form.mc" />
        </a-form-model-item>
        <a-form-model-item :wrapper-col="{ span: 10, offset: 0 }" :label-col="{ span: 8 }" style="margin-left: -18px" label="上传附件" prop="scfj">
          <a-upload
            style="margin-top: -40px"
            action="https://www.mocky.io/v2/5cc8019d300000980a055e76"
            :default-file-list="defaultFileList"
          >
            <a-button> <a-icon type="upload" /> 上传附件 </a-button>
          </a-upload>
        </a-form-model-item>
        <a-form-model-item :wrapper-col="{ span: 14, offset: 4 }">
          <a-button type="primary" @click="onAdd">
            添加
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
  const columns = [
    { title: '任务名称',dataIndex: 'rwmc',key: 'rwmc' },
    { title: '发起人',dataIndex: 'fqr',key: 'fqr' },
    { title: '开始时间',dataIndex: 'kssj',key: 'kssj' },
    { title: '审核状态',dataIndex: 'enable',key: 'enable' },
    { title: '操作',dataIndex: 'action', scopedSlots: { customRender: 'action' } },
  ];
  const data = [
    {
      id: '1',
      rwmc: '工程分包',
      fqr: '张三',
      kssj: '2020-10-20',
      enable: '审计单位审核中',
    },
    {
      id: '2',
      rwmc: '工程分包',
      fqr: '张三',
      kssj: '2020-10-20',
      enable: '审计单位审核中',
    },
  ];
  //头部混入
  const cardMixins = {
    data () {
      return {
      }
    },
    methods: {
      // 搜索
      tabChange () {
      },
    }
  };
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
          subTitle:'项目相关描述',
        }
      }
    },
  };
  //列表头部混入
  const headMixins = {
    data () {
      return {
        headerForm:{
          shzt:'',
          rwmc:'',
        }
      }
    },
    methods: {
      // 搜索
      onSearch () {
      },
      // 去添加报告
      onToAddBg () {
        this.bgModalState = true
        this.bgModalTitle = '新增报告';
        this.form={
          jhmc:'',
          sjxm:'',
          kssj:'',
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
        HtChangelx:0,
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
        defaultFileList,
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
    name: 'PlanDetails',
    mixins: [cardMixins,tableMixins,modalMixins,formModeMixins,headMixins,pageHeadMixins,paginationMixins],
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
