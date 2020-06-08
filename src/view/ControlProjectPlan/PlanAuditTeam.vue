<template>
  <div>
    <!-- 页头 -->
    <div class="a-header">
      <a-col class="gutter-row" :span="4">
        <div class="gutter-box">
          <label>审核组编号:</label>
          <a-input placeholder="工程类型" v-model="headerForm.teamNumber"/>
        </div>
      </a-col>
      <a-col class="gutter-row" :span="4">
        <div class="gutter-box">
          <label>审核组名称:</label>
          <a-input placeholder="工程类型" v-model="headerForm.teamName"/>
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
  </div>
</template>

<script>
  import {deleteReviewTeamById,insertReviewTeam,queryReviewTeamByid,queryReviewTeamList,queryReviewTeamPage,updateReviewTeam} from "@/api/ControlProjectPlan/PlanAuditTeam";

  const columns = [
    { title: '审核组编号',dataIndex: 'teamNumber',key: 'teamNumber' },
    { title: '审核组名称',dataIndex: 'teamName',key: 'teamName' },
    { title: '启用状态',dataIndex: 'enable',key: 'enable' },
    // { title: '包含人数',dataIndex: 'bhrs',key: 'bhrs' },
    { title: '操作',dataIndex: 'action', scopedSlots: { customRender: 'action' } },
  ];
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
          teamNumber:'',
          teamName:'',
          enable:''
        }
      }
    },
    methods: {
      // 搜索
      onSearch () {
        this.queryReviewTeamList();
      },
      // 去添加
      onToAdd () {
        this.$router.push({path:"/main/ControlProjectPlan/PlanAuditTeamAdd",query: {state:'add'}});
      }
    }
  };
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
        data:[]
      }
    },
    created () {
      this.queryReviewTeamList();
    },
    methods: {
      //查询部门树
      queryReviewTeamList(){
        this.spinning = true;
        queryReviewTeamList(Object.assign(this.page,this.headerForm))
          .then(res => {
            if(res.code==2020200){
              console.log(res)
              this.data = res.data;
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
        this.$router.push({path:"/main/ControlProjectPlan/PlanAuditTeamAdd",query: {id: record.id,state:'update'}});
      },
      // 删除确认
      onDeleteConfirm (record) {
        deleteReviewTeamById({id:record.id})
          .then(res => {
            if(res.code==2020200){
              this.queryReviewTeamList();
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
    name: 'PlanAuditTeam',
    mixins: [tableMixins,headMixins,paginationMixins],
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
