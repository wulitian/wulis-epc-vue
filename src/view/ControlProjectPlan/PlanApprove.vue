<template>
  <div>
    <a-descriptions title="合同信息" size="small" bordered>
      <a-descriptions-item label="合同">
        合同
      </a-descriptions-item>
      <a-descriptions-item label="合同分类">
        合同分类
      </a-descriptions-item>
      <a-descriptions-item label="合同编号">
        合同编号
      </a-descriptions-item>
      <a-descriptions-item label="日期">
        日期
      </a-descriptions-item>
      <a-descriptions-item label="所属部门">
        所属部门
      </a-descriptions-item>
      <a-descriptions-item label="往来单位">
        往来单位
      </a-descriptions-item>
      <a-descriptions-item label="客户联系人">
        客户联系人
      </a-descriptions-item>
      <a-descriptions-item label="客户联系方式">
        客户联系方式
      </a-descriptions-item>
      <a-descriptions-item label="所属项目">
        所属项目
      </a-descriptions-item>
      <a-descriptions-item label="合同金额（元）">
        合同金额（元）
      </a-descriptions-item>
      <a-descriptions-item label="质保期（年）">
        质保期（年）
      </a-descriptions-item>
      <a-descriptions-item label="质保金比例（%）">
        质保金比例（%）
      </a-descriptions-item>
      <a-descriptions-item label="经办人">
        经办人
      </a-descriptions-item>
      <a-descriptions-item label="开始日期">
        开始日期
      </a-descriptions-item>
      <a-descriptions-item label="结束日期">
        结束日期
      </a-descriptions-item>
      <a-descriptions-item label="收付款预警">
        收付款预警
      </a-descriptions-item>
      <a-descriptions-item label="付款达到%预警">
        付款达到%预警
      </a-descriptions-item>
      <a-descriptions-item label="到期预警">
        到期预警
      </a-descriptions-item>
      <a-descriptions-item label="预警天数">
        预警天数
      </a-descriptions-item>
      <a-descriptions-item label="收付款条件">
        收付款条件
      </a-descriptions-item>
      <a-descriptions-item label="备注">
        备注
      </a-descriptions-item>
      <a-descriptions-item label="相关附件">
        相关附件
      </a-descriptions-item>
    </a-descriptions>
    <a-steps :current="1" style="margin: 20px 0">
      <a-step title="施工单位" description="上报人（张三）" />
      <a-step title="项目管理部门" description="审批中" />
      <a-step title="中介公司" description="" />
      <a-step title="审计部门" description="" />
    </a-steps>
    <!-- 列表 -->
    <a-spin :spinning="spinning">
      <a-table :rowClassName="(record, index)=>{return index % 2 === 1? 'odd' : 'even'}" bordered :columns="columns" rowKey="id" :data-source="data" :pagination="false"></a-table>
    </a-spin>
    <div style="text-align: center;margin-top: 10px">
      <a-button type="primary" v-if="hasPermission('xmjhkz::ty')">
        通过
      </a-button>
      <a-button type="primary" v-if="hasPermission('xmjhkz::bh')">
        驳回
      </a-button>
    </div>
  </div>
</template>
<script>
  //列表混入
  const tableMixins = {
    data () {
      return {
        spinning:false,
        columns,
        data:[],
      }
    },
    created () {
      // this.queryProjectTypePage();
    },
    methods: {
      queryProjectTypePage(){
        this.spinning = true;
        queryProjectTypePage(Object.assign(this.page,this.headerForm))
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
    }
  };
  const columns = [
    { title: '审批节点',dataIndex: 'name',key: 'name' },
    { title: '处理人',dataIndex: 'describe',key: 'describe' },
    { title: '说明',dataIndex: 'enable',key: 'enable' },
    { title: '意见',dataIndex: 'createTime',key: '1' },
    { title: '操作',dataIndex: 'createTime',key: '2' },
    { title: '时间',dataIndex: 'createTime',key: '3' },
  ];
  export default {
  mixins: [tableMixins],
  name: 'PlanApprove',
  data () {
    return {
    }
  },
  created(){
  },
  methods:{
  }
}
</script>

<style scoped>
  /deep/ .even{
    background:#ffffff;
  }
  /deep/ .odd{
    background: #fafafa;
  }
</style>
