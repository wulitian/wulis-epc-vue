<template>
  <div>
    <!-- 页头 -->
    <div class="a-header">
      <a-col class="gutter-row" :span="4">
        <div class="gutter-box">
          <label>合同编号:</label>
          <a-input v-model="headerForm.htbh"/>
        </div>
      </a-col>
      <a-col class="gutter-row" :span="4">
        <div class="gutter-box">
          <label>合同名称:</label>
          <a-input v-model="headerForm.htmc"/>
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
        <a-form-model-item :wrapper-col="{ span: 20, offset: 3 }" :label-col="{ span: 3 }" style="margin-left: -18px" label="上传附件" prop="scfj">
          <a-upload
            style="margin-top: -40px"
            action="https://www.mocky.io/v2/5cc8019d300000980a055e76"
            :default-file-list="defaultFileList"
          >
            <a-button> <a-icon type="upload" /> 上传附件 </a-button>
          </a-upload>
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
    { title: '编号',dataIndex: 'bh',key: 'bh' },
    { title: '名称',dataIndex: 'mc',key: 'mc' },
    { title: '合同类目',dataIndex: 'htlm',key: 'htlm' },
    { title: '状态',dataIndex: 'state',key: 'state' },
    { title: '更新时间',dataIndex: 'updateTime',key: 'updateTime' },
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
      bh: '0001',
      mc: '建设合同',
      htlm: '建设合同',
      state: '无',
      updateTime: '2020-10-10',
    },
    {
      id: '2',
      bh: '0002',
      mc: '建设合同',
      htlm: '建设合同',
      state: '无',
      updateTime: '2020-10-10',
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
          htbh:'',
          htmc:'',
          enable:''
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
        this.modalTitle = '新增合同';
        this.addStatus = true;
        this.form = {
          ht:'',
          htlm:'',
          htbh:'',
          rq:'',
          ssbm:'',
          wldw:'',
          khlxr:'',
          khlxfs:'',
          ssxm:'',
          htje:'',
          zbq:'',
          zbjebl:'',
          jbr:'',
          ksrq:'',
          jsrq:'',
          sfkyj:'',
          fkdd:'',
          dqyj:'',
          yjts:'',
          sfktj:'',
          remark:'',
          tcbl:'',
          sfjs:'',
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
          htlm:'',
          ms:'',
          enable:1
        },
        rules: {
          htlm: [{ required: true, message: '请输入合同类目', trigger: 'blur' }],
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
        this.modalTitle = '修改合同';
        this.addStatus = false;
        // queryUserByid({id:record.id})
        //   .then(res => {
        //     if(res.code==2020200){
        //       this.form = {
        //         htlm:res.data.htlm,
        //         ms:res.data.ms,
        //         enable:res.data.enable,
        //       };
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
