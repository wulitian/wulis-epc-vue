<template>
  <div>
    <a-card title="组信息设置" >
      <a-col class="gutter-row" :span="4">
        <div class="gutter-box">
          <label>审核组编号:</label>
          <a-input v-model="cardForm.shzbh"/>
        </div>
      </a-col>
      <a-col class="gutter-row" :span="4">
        <div class="gutter-box">
          <label>审核组名称:</label>
          <a-input v-model="cardForm.shzmc"/>
        </div>
      </a-col>
      <a-col class="gutter-row" :span="4">
        <div class="gutter-box">
          <label>备注:</label>
          <a-input v-model="cardForm.bz"/>
        </div>
      </a-col>
    </a-card>
    <a-card title="组信息设置" style="margin-top: 10px">
      <!-- 页头 -->
      <!--<div class="a-header">-->
        <!--<a-col class="gutter-row" :span="4">-->
          <!--<div class="gutter-box">-->
            <!--<label>组员姓名:</label>-->
            <!--<a-input v-model="headerForm.zyxm"/>-->
          <!--</div>-->
        <!--</a-col>-->
        <!--<a-col class="gutter-row" :span="4">-->
          <!--<div class="gutter-box">-->
            <!--<label>组员工号:</label>-->
            <!--<a-input v-model="headerForm.zygh"/>-->
          <!--</div>-->
        <!--</a-col>-->
        <!--<a-col class="gutter-row" :span="4">-->
          <!--<div class="gutter-box">-->
            <!--<label>所在组织:</label>-->
            <!--<a-input v-model="headerForm.szzz"/>-->
          <!--</div>-->
        <!--</a-col>-->
        <!--<a-col class="gutter-row" :span="4">-->
          <!--<div class="gutter-box">-->
            <!--<label>审核职责:</label>-->
            <!--<a-input v-model="headerForm.shzz"/>-->
          <!--</div>-->
        <!--</a-col>-->
        <!--<span style="margin-left: 10px">-->
          <!--<a-button type="primary" @click="onSearch">查询</a-button>-->
          <!--<a-button type="primary" @click="onToAdd">新增成员</a-button>-->
        <!--</span>-->
      <!--</div>-->
      <!-- 列表 -->
      <a-spin :spinning="spinning">
        <a-table :columns="columns" rowKey="id" :data-source="data" :pagination="false">
        <span slot="action" slot-scope="text, record">
          <a @click="onView(record)">查看</a>
          <a-divider type="vertical" />
          <a @click="onToUpdate(record)">修改</a>
          <a-divider type="vertical" />
          <a @click="onToAdd(record)">新增</a>
        </span>
        </a-table>
      </a-spin>
      <!-- 分页 -->
      <a-pagination v-if="total>=10" style="float: right;margin-top: 10px" :total="total" :default-current="1" show-size-changer show-quick-jumper @change="onPaginationChange" @showSizeChange="onShowSizeChange"/>
      <!--弹窗-->
    </a-card>
    <a-modal v-model="modalState" :title="modalTitle" :footer="null" width="900px">
      <!--表单-->
      <div style="position: relative;padding-left: 300px;height: 500px">
        <div style="height: 100%;width: 260px;position: absolute;left: 0;top: 0;border: 1px solid #dddddd;overflow-y: auto;">
          <a-directory-tree multiple default-expand-all @select="onSelect" @expand="onExpand">
            <a-tree-node key="0-0" title="parent 0">
              <a-tree-node key="0-0-0" title="leaf 0-0" is-leaf />
              <a-tree-node key="0-0-1" title="leaf 0-1" is-leaf />
            </a-tree-node>
            <a-tree-node key="0-1" title="parent 1">
              <a-tree-node key="0-1-0" title="leaf 1-0" is-leaf />
              <a-tree-node key="0-1-1" title="leaf 1-1" is-leaf />
            </a-tree-node>
          </a-directory-tree>
        </div>
        <div style="width: 100%;">
          <a-transfer
            :list-style="{width: '250px',height: '500px',}"
            :data-source="mockData"
            show-search
            :locale="{ itemUnit: '项', itemsUnit: '项', notFoundContent: '列表为空', searchPlaceholder: '请输入搜索内容' }"
            :filter-option="filterOption"
            :target-keys="targetKeys"
            :render="item => item.title"
            @change="handleChange"
            @search="handleSearch"
          />
        </div>
      </div>
      <div style="text-align: center;margin-top: 10px">
        <a-button type="primary" @click="onAdd" v-if="addStatus">
          添加
        </a-button>
        <a-button type="primary" @click="onUpdate" v-else>
          修改
        </a-button>
        <a-button style="margin-left: 10px;" @click="onResetForm">
          重置
        </a-button>
      </div>
    </a-modal>
  </div>
</template>

<script>

  const columns = [
    // { title: '组员姓名',dataIndex: 'zyxm',key: 'zyxm' },
    // { title: '组员工号',dataIndex: 'zygh',key: 'zygh' },
    // { title: '所属组织',dataIndex: 'szzz',key: 'szzz' },
    { title: '审核角色',dataIndex: 'shjs',key: 'shjs' },
    { title: '当前人数',dataIndex: 'dqrs',key: 'dqrs' },
    { title: '操作',dataIndex: 'action', scopedSlots: { customRender: 'action' } },
  ];
  const data = [
    {
      id: '1',
      zyxm: '张三',
      zygh: '001',
      szzz: '承建单位',
      dqrs: '0',
      shjs: '项目管理公司',
    },
    {
      id: '2',
      zyxm: '李四',
      zygh: '002',
      szzz: '承建单位',
      dqrs: '2',
      shjs: '中介公司',
    },
    {
      id: '3',
      zyxm: '王五',
      zygh: '003',
      szzz: '承建单位',
      dqrs: '10',
      shjs: '审计部门',
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
          zyxm:'',
          zygh:'',
          szzz:'',
          zhzz:''
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
        this.modalTitle = '新增工程类型';
        this.addStatus = true;
        this.form = {
          zyxm:'',
          zygh:'',
          szzz:1
        };
      }
    }
  };
  //卡片混入
  const cardMixins = {
    data () {
      return {
        cardForm:{
          zyxm:'',
          zygh:'',
          szzz:'',
          zhzz:''
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
        this.modalTitle = '新增工程类型';
        this.addStatus = true;
        this.form = {
          zyxm:'',
          zygh:'',
          szzz:1
        };
      }
    }
  };
  //穿梭盒子混入
  const transferMixins= {
    data () {
      return {
        mockData: [],
        targetKeys: [],
      }
    },
    mounted() {
      this.getMock();
    },
    methods: {
      onSelect(keys, event) {
        console.log('Trigger Select', keys, event);
      },
      onExpand() {
        console.log('Trigger Expand');
      },
      getMock() {
        const targetKeys = [];
        const mockData = [];
        for (let i = 0; i < 20; i++) {
          const data = {
            key: i.toString(),
            title: `content${i + 1}`,
            description: `description of content${i + 1}`,
            chosen: Math.random() * 2 > 1,
          };
          if (data.chosen) {
            targetKeys.push(data.key);
          }
          mockData.push(data);
        }
        this.mockData = mockData;
        this.targetKeys = targetKeys;
      },
      filterOption(inputValue, option) {
        return option.description.indexOf(inputValue) > -1;
      },
      handleChange(targetKeys, direction, moveKeys) {
        console.log(targetKeys, direction, moveKeys);
        this.targetKeys = targetKeys;
      },
      handleSearch(dir, value) {
        console.log('search:', dir, value);
      },
    },
  };
  //表单混入
  const formModeMixins = {
    data () {
      return {
        labelCol: { span: 8 },
        wrapperCol: { span: 14 },
        id:'',
        form:{
          zyxm:'',
          zygh:'',
          szzz:1
        },
        rules: {
          zyxm: [{ required: true, message: '请输入工程类型', trigger: 'blur' }],
          zygh: [{ required: true, message: '请输入描述', trigger: 'blur' }],
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
        this.modalTitle = '修改工程类型';
        this.addStatus = false;
        // queryUserByid({id:record.id})
        //   .then(res => {
        //     if(res.code==2020200){
        //       this.form = {
        //         zyxm:res.data.zyxm,
        //         ms:res.data.ms,
        //         szzz:res.data.szzz,
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
    name: 'PlanAuditTeamAdd',
    mixins: [tableMixins,modalMixins,cardMixins,formModeMixins,headMixins,paginationMixins,transferMixins],
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
    padding-left: 100px;
  }
  .gutter-box>label{
    width: 90px;
    text-align: right;
    line-height: 32px;
    position: absolute;
    left: 0;
  }
</style>
