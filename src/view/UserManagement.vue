<template>
  <div>
    <a-spin :spinning="spinning">
      <div>
        <label>账号：</label><a-input placeholder="账号" v-model="params.account"/>
        <label>用户名称：</label><a-input placeholder="用户名称" v-model="params.userName"/>
        <label>启用状态：</label><a-select default-value="1" style="width: 160px" @change="onSelectIsUse" v-model="params.enable">
        <a-select-option value="1">
          启用
        </a-select-option>
        <a-select-option value="0">
          禁用
        </a-select-option>
      </a-select>
        <a-button type="primary" @click="onSelect">搜索</a-button>
        <a-button type="primary" @click="showModal">添加</a-button>
      </div>
      <a-table :columns="columns" rowKey="id" :data-source="data" :pagination="false">
    <span slot="action" slot-scope="text, record">
      <a @click="onUpdate(record)">修改</a>
      <a-divider type="vertical" />
      <a href="javascript:;" @click="onDelete(record)" >删除</a>
    </span>
      </a-table>
      <a-pagination show-size-changer show-quick-jumper @change="onChange" :total="page.total" :page-size="page.pageSize" :default-current="page.pageNumber"/>
    </a-spin>
    <a-modal v-model="updateModal" title="用户添加" @ok="updateModalOk">
      <div>
        <label>账号：</label><a-input placeholder="账号" />
      </div>
      <div>
        <label>用户名称：</label><a-input placeholder="用户名称" />
      </div>
      <div>
        <label>启用状态：</label>
      </div>
      <div>
        <a-select default-value="1" style="width: 160px" @change="onSelectIsUse">
          <a-select-option value="1">
            启用
          </a-select-option>
          <a-select-option value="0">
            禁用
          </a-select-option>
        </a-select>
      </div>
    </a-modal>
  </div>
</template>
<script>
  import {select} from "@/api/userManagement";
  const columns = [
    {
      title: '账号',
      dataIndex: 'account',
    },
    {
      title: '用户名称',
      dataIndex: 'userName',
    },
    {
      title: '手机号码',
      dataIndex: 'phoneNumber',
    },
    {
      title: '启用状态',
      dataIndex: 'enable',
    },
    {
      title: '操作',
      key: 'action',
      scopedSlots: { customRender: 'action' },
    },
  ];
  const data = [
    {
      id: '1',
      account: 'John Brown',
      userName: '123',
      phoneNumber: 'New York No. 1 Lake Park',
      enable: 'New York No. 1 Lake Park',
    },
    {
      id: '2',
      account: 'John Brown',
      userName: '123',
      phoneNumber: 'New York No. 1 Lake Park',
      enable: 'New York No. 1 Lake Park',
    }
  ];
  export default {
    name: 'UserManagement',
    data() {
      return {
        spinning:true,
        data,
        columns,
        params:{
          account:'',
          loginName:'',
          enable:''
        },
        page:{
          total:0,
          pageSize:10,
          pageNumber:1
        },
        updateModal:false
      };
    },
    created(){
      this.onSelect();
    },
    methods:{
      onSelect(){
        let param = {
          pageNumber:this.page.pageNumber,
          pageSize:this.page.pageSize
        }
        select(Object.assign(param, this.params))
          .then(res => {
            this.page.total = res.data.total;
            this.data = res.data.records;
            this.spinning=false;
          })
          .catch((e) => {
            console.log(e)
            this.spinning=false;
          })
      },
      onDelete(e){
        console.log(e)
      },
      onUpdate(e){
        console.log(e)
      },
      onChange(pageNumber,pageSize) {
        console.log('Page: ', pageNumber);
        console.log('Page: ', pageSize);
      },
      onSelectIsUse(){
      },
      showModal(){
        this.updateModal = true
      },
      updateModalOk(e){
        console.log(e);
        this.updateModal = false;
      }
    }
  };
</script>
<style>
  .ant-pagination{
    float: right;
    margin-top: 10px;
  }
  .ant-input {
    width: 160px;
    margin: 0 8px 8px 0;
  }
</style>
