<template>
  <div>
    <!-- 页头 -->
    <div class="a-header">
      <a-col class="gutter-row" :span="4">
        <div class="gutter-box">
          <label>菜单名称:</label>
          <a-input placeholder="菜单名称" v-model="headerForm.menuName"/>
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
      <a-table :columns="columns"  :data-source="data" rowKey="id"  childrenColumnName="nodes" :scroll="{ x: 1500}" :pagination="false" :row-selection="rowSelection" >
      <span slot="menuType" slot-scope="menuType">
         <a-tag color="pink" v-if="menuType==0">
           菜单
        </a-tag>
        <a-tag color="green" v-if="menuType==1">
           按钮
        </a-tag>
      </span>
      <span slot="icon" slot-scope="icon">
         <my-icon v-if="icon==null" type="icon-jiqunchushihua" style="font-size: 20px"></my-icon>
         <my-icon v-else :type="icon" style="font-size: 20px"></my-icon>
      </span>
      <span slot="enable" slot-scope="enable">
         <a-tag color="orange" v-if="enable==0">
           禁用
        </a-tag>
        <a-tag color="blue" v-if="enable==1">
           启用
        </a-tag>
      </span>
      <span slot="hiddenHeaderContent" slot-scope="hiddenHeaderContent">
         <a-tag color="cyan" v-if="hiddenHeaderContent==0">
           否
        </a-tag>
        <a-tag color="purple" v-if="hiddenHeaderContent==1">
           是
        </a-tag>
      </span>
      <span slot="keepAlive" slot-scope="keepAlive">
         <a-tag color="pink" v-if="keepAlive==0">
           否
        </a-tag>
        <a-tag color="green" v-if="keepAlive==1">
           是
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
    <a-modal v-model="modalState" :title="modalTitle" :footer="null" width="700px">
      <!--表单-->
      <a-form-model
        ref="ruleForm"
        :model="form"
        :rules="rules"
        :label-col="labelCol"
        :wrapper-col="wrapperCol"
      >
        <a-form-model-item v-if="menuTypeShow" label="菜单类型" prop="menuType">
          <a-radio-group v-model="form.menuType"  @change="onCdlxChange">
            <a-radio :value="0">
              菜单
            </a-radio>
            <a-radio :value="1">
              按钮
            </a-radio>
          </a-radio-group>
        </a-form-model-item>
        <a-row v-if="form.menuType == 0">
          <a-col :span="12">
            <a-form-model-item label="上级菜单" prop="parentId">
              <a-tree-select
                v-model="form.parentId"
                style="width: 100%"
                :dropdown-style="{ maxHeight: '400px', overflow: 'auto' }"
                :tree-data="menuData"
                placeholder="请选择所属部门"
                tree-default-expand-all
              >
              </a-tree-select>
            </a-form-model-item>
          </a-col>
          <a-col :span="12">
            <a-form-model-item label="名称" prop="menuName">
              <a-input v-model="form.menuName" placeholder="请输入菜单名称"/>
            </a-form-model-item>
          </a-col>
          <a-col :span="12">
            <a-form-model-item label="菜单图标" prop="icon">
              <a-input v-model="form.icon" placeholder="请选择菜单图标" style="width: 125px" :disabled="true" />
              <a-button type="primary" @click="selectToIcon">
                选择
              </a-button>
            </a-form-model-item>
          </a-col>
          <a-col :span="12">
            <a-form-model-item label="排序" prop="sort">
              <a-input v-model="form.sort" placeholder="请输入序号"/>
            </a-form-model-item>
          </a-col>
          <a-col :span="12">
            <a-form-model-item label="跳转类型" prop="target">
              <a-select default-value="_self" v-model="form.target">
                <a-select-option value="_self">
                  _self
                </a-select-option>
                <a-select-option value="_blank">
                  _blank
                </a-select-option>
                <a-select-option value="_top">
                  _top
                </a-select-option>
                <a-select-option value="_parent">
                  _parent
                </a-select-option>
              </a-select>
            </a-form-model-item>
          </a-col>
          <a-col :span="12">
            <a-form-model-item label="路由地址" prop="route">
              <a-input v-model="form.route" placeholder="请输入路由地址"/>
            </a-form-model-item>
          </a-col>
          <a-col :span="12">
            <a-form-model-item label="组件路径" prop="component">
              <a-input v-model="form.component" placeholder="请输入组件路径"/>
            </a-form-model-item>
          </a-col>
          <a-col :span="12">
            <a-form-model-item label="组件名称" prop="componentName">
              <a-input v-model="form.componentName" placeholder="请输入组件名称"/>
            </a-form-model-item>
          </a-col>
          <a-col :span="12">
            <a-form-model-item label="重定向地址" prop="redirect">
              <a-input v-model="form.redirect" placeholder="请输入重定向地址"/>
            </a-form-model-item>
          </a-col>
          <a-col :span="12">
            <a-form-model-item label="路由缓存" prop="keepAlive">
              <a-radio-group v-model="form.keepAlive">
                <a-radio :value="0">
                  否
                </a-radio>
                <a-radio :value="1">
                  是
                </a-radio>
              </a-radio-group>
            </a-form-model-item>
          </a-col>
          <a-col :span="12">
            <a-form-model-item label="隐藏tab" prop="hiddenHeaderContent">
              <a-radio-group v-model="form.hiddenHeaderContent">
                <a-radio :value="0">
                  否
                </a-radio>
                <a-radio :value="1">
                  是
                </a-radio>
              </a-radio-group>
            </a-form-model-item>
          </a-col>
          <a-col :span="12">
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
          </a-col>
        </a-row>
        <a-row v-else>
          <a-col :span="12">
            <a-form-model-item label="上级菜单" prop="parentId">
              <a-tree-select
                v-model="form.parentId"
                style="width: 100%"
                :dropdown-style="{ maxHeight: '400px', overflow: 'auto' }"
                :tree-data="menuData"
                placeholder="请选择所属部门"
                tree-default-expand-all
              >
              </a-tree-select>
              <!--<a-select style="width: 100%;" v-model="headerForm.parentId">-->
                <!--<a-select-option v-for="item in leafNodeList" :value="item.id" :key="item.id">-->
                  <!--{{item.title}}-->
                <!--</a-select-option>-->
              <!--</a-select>-->
            </a-form-model-item>
          </a-col>
          <a-col :span="12">
            <a-form-model-item label="名称" prop="menuName">
              <a-input v-model="form.menuName" placeholder="请输入菜单名称"/>
            </a-form-model-item>
          </a-col>
          <a-col :span="12">
            <a-form-model-item label="权限标识" prop="permissionMark">
              <a-input v-model="form.permissionMark" placeholder="请输入权限标识"/>
            </a-form-model-item>
          </a-col>
          <a-col :span="12">
            <a-form-model-item label="排序" prop="sort">
              <a-input v-model="form.sort" placeholder="请输入序号"/>
            </a-form-model-item>
          </a-col>
          <a-col :span="12">
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
          </a-col>
        </a-row>
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
    <a-modal v-model="modalState2" :title="modalTitle2" :footer="null" width="700px">
      <div style="height: 400px;overflow-y: auto;border: 1px solid #dddddd">
        <a-row>
          <a-col :span="4" class="box" v-for="(item,i) in iconList" :key="item+i" @click="SelectIcon(item)">
            <my-icon :type="item" class="boxIcon"></my-icon>
            <div class="boxTitle" :title="item">{{item}}</div>
          </a-col>
        </a-row>
      </div>
    </a-modal>
  </div>
</template>

<script>
  import {deleteMenuByid,insertMenu,queryMenuByid,queryMenuTree,updateMenu} from "@/api/SystemPermissionsManagement/MenuManagement";
  const columns = [
    { title: '菜单名称',dataIndex: 'menuName',key: 'menuName' ,width: 200, fixed: 'left' },
    { title: '菜单类型',dataIndex: 'menuType',key: 'menuType',scopedSlots: { customRender: 'menuType' },width: 100,},
    { title: '跳转路径',dataIndex: 'route',key: 'route' ,width: 400, },
    { title: '组件路径',dataIndex: 'component',key: 'component',width: 400,  },
    { title: '组件名称',dataIndex: 'componentName',key: 'componentName' ,width: 400, },
    { title: '重定向地址',dataIndex: 'redirect',key: 'redirect' ,width: 400, },
    { title: '跳转目标',dataIndex: 'target',key: 'target' ,width: 100, },
    { title: '图标',dataIndex: 'icon',key: 'icon' ,scopedSlots: { customRender: 'icon' },width: 100, },
    { title: '隐藏信息',dataIndex: 'hiddenHeaderContent',key: 'hiddenHeaderContent' ,scopedSlots: { customRender: 'hiddenHeaderContent' } ,width: 100, },
    { title: '是否缓冲',dataIndex: 'keepAlive',key: 'keepAlive'  ,scopedSlots: { customRender: 'keepAlive' },width: 100, },
    { title: '菜单隐藏',dataIndex: 'enable',key: 'enable' ,scopedSlots: { customRender: 'enable' },width: 100,  },
    { title: '排序',dataIndex: 'sort',key: 'sort' ,width: 100, },
    { title: '权限标识',dataIndex: 'permissionMark',key: 'permissionMark' ,width: 100, },
    { title: '操作', key: 'active', fixed: 'right', scopedSlots: { customRender: 'action' }, width: 140, },
  ];
  const iconList = [
    'icon-shujubeifen',
    'icon-zhanghaozhuxiao',
    'icon-yiban',
    'icon-zhuanshenren',
    'icon-hetong',
    'icon-zuhu',
    'icon-yunwangguan',
    'icon-VPChutong',
    'icon-wangluotuopu',
    'icon-wangluotuopudefuben',
    'icon-caozuorizhi',
    'icon-jisuan',
    'icon-cunchu',
    'icon-wuliwangluo',
    'icon-xuniwangluo',
    'icon-zuijingaojing',
    'icon-ziyuanshiyongqingkuang',
    'icon-ziyuankaitongqushi',
    'icon-ziyuanshiyongpaiming',
    'icon-yonghuquanxianguanli',
    'icon-chanpinguanli',
    'icon-mobanguanli',
    'icon-YUMyuanguanli',
    'icon-anquanzhongxin',
    'icon-bukashenqing',
    'icon-chuchashenqing',
    'icon-gonggao',
    'icon-daibanshixiang',
    'icon-gongsi1',
    'icon-fankui',
    'icon-kecheng',
    'icon-jiaban1',
    'icon-huodong',
    'icon-paibandaka',
    'icon-buxiu1',
    'icon-paihangbang',
    'icon-qingjia2',
    'icon-lizhi1',
    'icon-qingjiabiangeng',
    'icon-richeng',
    'icon-shenpi1',
    'icon-tiaoxiu',
    'icon-wodeshenqing',
    'icon-yuangongguanhuai',
    'icon-tongjifenxi',
    'icon-waichu1',
    'icon-xitongshezhi',
    'icon-xiujiashenqing',
    'icon-jiabanshenqing',
    'icon-chuchashenqing1',
    'icon-kaoqinshensu',
    'icon-waichushenqing',
    'icon-tiaodongshenqing',
    'icon-zhengzhangshenqing',
    'icon-lizhishenqing',
    'icon-chengweijiangshi',
    'icon-canjiapeixun',
    'icon-gongzuohuibao',
    'icon-zhuanzhengshenqing',
    'icon-wupinlingyong',
    'icon-jixiaoziping',
    'icon-xinxibiangeng',
    'icon-faqihuiyi',
    'icon-qitatongyong',
    'icon-caigoushenqing',
    'icon-baoxiaoshenqing',
    'icon-jiekuanshenqing',
    'icon-ruzhishenpi',
    'icon-zidingyi',
    'icon-hetongqianding',
    'icon-gongzuojiaojietubiao',
    'icon-waichukaoqin',
    'icon-chufadan',
    'icon-tiaodongshenpi',
    'icon-tiaogangtiaoxin',
    'icon-jianglidan',
    'icon-WMS',
    'icon-hebingqianhe',
    'icon-PPO',
    'icon-daichulirenwu',
    'icon-baobiaotongji',
    'icon-gongyinglianguanli',
    'icon-kaifaguanli',
    'icon-gerenshezhi',
    'icon-WMSguanli',
    'icon-jijianbaogongguanli',
    'icon-shujufenxi',
    'icon-woderenwu',
    'icon-tianxiebiaodan',
    'icon-xiangmuguanli',
    'icon-wodeyouxiang',
    'icon-wendangguanli',
    'icon-xinxiangmuguanli',
    'icon-renwuchaxun',
    'icon-zonghefenxi',
    'icon-xitongweihu',
    'icon-youxiangpeizhi',
    'icon-huaweipojiekou',
    'icon-xiaoxi',
    'icon-xiaoyeceshi',
    'icon-sanyangbom',
    'icon-zhujiemianlianjie',
    'icon-fukuanjilu',
    'icon-biangengjilu',
    'icon-chukudan',
    'icon-anquanyinhuanbaogaoguanli',
    'icon-anquanjianchajihuaguanli',
    'icon-gongchengbaogaochakan',
    'icon-gongchengshiwudan',
    'icon-gongchengshiwudantongjifenxi',
    'icon-gongchengbaogaobianji',
    'icon-jianlibaogaochakan',
    'icon-hetongtaizhang',
    'icon-jinchumingxi',
    'icon-jindufankui',
    'icon-renwuchakan',
    'icon-jiqunchushihua',
    'icon-icon-test',
    'icon-icon-test1',
    'icon-icon-test2',
    'icon-icon-test3',
    'icon-icon-test4',
    'icon-icon-test5',
    'icon-icon-test6',
    'icon-icon-test7',
    'icon-icon-test8',
    'icon-icon-test9',
    'icon-icon-test10',
    'icon-icon-test11',
    'icon-qingjia1',
    'icon-chucha',
    'icon-waichu',
    'icon-baoxiao',
    'icon-buqia',
    'icon-kaoqintiaozheng',
    'icon-jiaban',
    'icon-zhuanzheng',
    'icon-gongwen',
    'icon-gerenxinxi',
    'icon-yijianfankui',
    'icon-banbenxinxi',
    'icon-saoyisao',
    'icon-zhanghaoguanli',
    'icon-weixin',
    'icon-tongshiquanzi',
    'icon-dianhua',
    'icon-gongsi',
    'icon-yuefen',
    'icon-zhuanshen',
    'icon-fujian',
    'icon-daishenhe',
    'icon-yue_yuan',
    'icon-zhou_yuan',
    'icon-shuangzhoubao',
    'icon-ribao',
    'icon-jujue',
    'icon-nianbao',
    'icon-tongyi',
    'icon-yuebao',
    'icon-zhoubao',
    'icon-bingjia',
    'icon-daiban',
    'icon-gongzuobaogao',
    'icon-dianzan',
    'icon-jixing',
    'icon-tiaoxiujia',
    'icon-bianji',
    'icon-lizhi',
    'icon-kehu',
    'icon-hunjia',
    'icon-nianjia',
    'icon-pinglun',
    'icon-qianpi',
    'icon-shijia',
    'icon-ruzhi',
    'icon-shenqingfahuo',
    'icon-shenpi',
    'icon-sangjia',
    'icon-tongxunlu',
    'icon-tongzhi',
    'icon-yunjia',
    'icon-xueshengxuejixinxigenggai',
    'icon-yuangong',
    'icon-xueshengmiankao',
    'icon-yanchangxuexinianxian',
    'icon-zhongyangrenzhengjiekou',
    'icon-yumingjiexi',
    'icon-VPN',
    'icon-zhujituoguan',
    'icon-zhuanjiajiangzuo',
    'icon-zhuanzhuanye',
    'icon-baoleiji',
    'icon-biyezhengxueweizhengyishibuban',
    'icon-zhuanxue',
    'icon-buxiu',
    'icon-chengjigengzheng',
    'icon-fuxue',
    'icon-chengjirending',
    'icon-bumen',
    'icon-jubanpeixunban',
    'icon-genbanzhongxiu',
    'icon-jubandangke',
    'icon-kaochakechengkaohefangshishenpi',
    'icon-keyan',
    'icon-liuji',
    'icon-kechengmianting',
    'icon-mianxiu',
    'icon-tiaotingke',
    'icon-tiaohuanrenkejiaoshi',
    'icon-qingnianjiaoshijiaoxuejinengjingsaishenbao',
    'icon-tuixue',
    'icon-xinxibeian',
    'icon-wangzhankaitong',
    'icon-xunizhujixieyi',
    'icon-xueshenghuankao',
    'icon-xueshengkechengfenshubuchang',
    'icon-Vquxiaozanhuanjiuye',
    'icon-biyejiaoyuhuodong',
    'icon-Vguojiazhuxuejin',
    'icon-Vzanhuanjiuye',
    'icon-zuotanhuijiangzuo',
    'icon-banjizhiyuanhuodong',
    'icon-canjiaxiaowaijingsai',
    'icon-chuangxinchuangyexunlianjihua',
    'icon-chuguojingliuxue',
    'icon-dangyuangongzuohuiyi',
    'icon-dangtuanzhishijuesai',
    'icon-dangyuanzuzhiguanxizhuanyi',
    'icon-dangzhenglianxihuiyi',
    'icon-fuxiu',
    'icon-jianglidengji',
    'icon-gangweishenqing',
    'icon-guojiajiangxuejin',
    'icon-guowaixuexijiaoliukecheng',
    'icon-jiaoliuhui',
    'icon-keyanxiangmu',
    'icon-peixunhuodongdongyuandahui',
    'icon-shenghuohuijiminzhupingyigongzuo',
    'icon-tuanxuezhaoxin',
    'icon-tuanxuequantidahui',
    'icon-xiaoyouhui',
    'icon-xiuxue',
    'icon-xinlijiankangjiaoyu',
    'icon-xueshengdangjiangongzuoduiwuganbulihui',
    'icon-xueshengdangjiangongzuoduiwuquantidahui',
    'icon-miance',
    'icon-xueshengdangzhibudahui',
    'icon-zhishijingsai',
    'icon-zhuantixuexihui',
    'icon-zhongzhifuxiu',
    'icon-yangzhenningjiangxuejin',
    'icon-zongzhiweiyuanhuidangyuandahui',
    'icon-zizhuzigerending',
    'icon-xueyuandebiyeshengjiuyepeixunhuodong',
    'icon-zichanguanli',
    'icon-Vxueshenghuodongzhongxinchangdishenqing',
    'icon-xueshengzhengbuban',
    'icon-biyeshixi',
    'icon-Vxueshenggongyuchangdishiyongshenqing',
    'icon-Vxinlizixun',
    'icon-banxuepinggu',
    'icon-caigou',
    'icon-biyeshengjiuyeshouxubanli',
    'icon-biyeshengbanligaipaigongzuoliucheng',
    'icon-fawenguanli',
    'icon-falvyushehuigongzuoxueyuanzhixuesheng',
    'icon-fuchachengji',
    'icon-chengjishouji',
    'icon-gaoxiaozhuxuejin',
    'icon-gaoxiaobiyeshengdengji',
    'icon-gongcheguanli',
    'icon-huochepiaoxueshengyouhuiqiabanli',
    'icon-goumaibangongyongpin',
    'icon-kaowuguanligongzuo',
    'icon-guojiazhuxuedaikuan',
    'icon-mianzhihangguojiaxueshengtizhijiankangbiaozhun',
    'icon-keyanguanli',
    'icon-pinqingwaipinjiaoshi',
    'icon-pinggugongzuo',
    'icon-shiyongyinzhang',
    'icon-qingongzhuxuegongzuoliucheng',
    'icon-shouwenliucheng',
    'icon-tiyuketeshuchuli',
    'icon-xiaoneixueshengqingongzhuxueshanggang',
    'icon-xuejiyidonggongzuoliucheng',
    'icon-tuiwufuxueshengmianxiugonggongtiyujunshijinenghejunshili',
    'icon-weijichufen',
    'icon-xueshengICqiabanli',
    'icon-xiaoqihezuoshixijidi',
    'icon-xueshengdangan',
    'icon-zichanpankuiyingdengji',
    'icon-bangfujinshenqing',
    'icon-bangongdianhuayewu',
    'icon-baoxiaodan',
    'icon-caigouxiangmushenhe',
    'icon-caigouxiangmujihua',
    'icon-cheliangtonghangzheng',
    'icon-gongchengbiangengshenpi',
    'icon-gongchengjungongyanshouzhengming',
    'icon-gongchengxiangmujungongchuyanshenhe',
    'icon-gongchengxiangmutuzhishenhe',
    'icon-gonghuichengyuandengji',
    'icon-gonghuichengyuantiaodong',
    'icon-gonghuichengyuanzhuce',
    'icon-gonghuichengyuanzhuxiao',
    'icon-gonghuikunnanjin',
    'icon-gonghuichengyuanzhuxiaodengji',
    'icon-wangjieshengshenqingjieyehuanbiyeshenpi',
    'icon-gudingzichanbaosunbaofeishenpi',
    'icon-huifeijiaona',
    'icon-wangzhanzhanghao',
    'icon-gudingzichanhaocaigouzhi',
    'icon-jiaoshibaodingjiaocai',
    'icon-jiaoshiyunzhuomian',
    'icon-jiatingjingjikunnanxueshengrending',
    'icon-jiaoshijieyong',
    'icon-jiaozhigongkunnanbangzhujin',
    'icon-linshicheliangtonghangzheng',
    'icon-qingjia',
    'icon-kunnanjinguidang',
    'icon-menjinquanxianshenqing',
    'icon-shebeiyanshoudan',
    'icon-zichanbiandongtiaobo',
    'icon-shengriweiwen',
    'icon-shiwuzhaoling',
    'icon-sichegongyong',
    'icon-tonghangzhengshenqing',
    'icon-tushujiangoushenqing',
    'icon-right_up2',
    'icon-right',
    'icon-rotate_to_landscape',
    'icon-rotate_to_portrait',
    'icon-rules',
    'icon-rotate_camera',
    'icon-ruler',
    'icon-safe',
    'icon-scatter_plot',
    'icon-search',
    'icon-binoculars',
    'icon-serial_tasks',
    'icon-about',
    'icon-self_service_kiosk',
    'icon-accept_database',
    'icon-service_mark',
    'icon-add_row',
    'icon-selfie',
    'icon-add_column',
    'icon-services',
    'icon-add_database',
    'icon-settings',
    'icon-add_image',
    'icon-share',
    'icon-address_book',
    'icon-shipped',
    'icon-advance',
    'icon-signature',
    'icon-advertising',
    'icon-sales_performance',
    'icon-alphabetical_sorting_az',
    'icon-sim_card_chip',
    'icon-alphabetical_sorting_za',
    'icon-sim_card',
    'icon-answers',
    'icon-shop',
    'icon-approval',
    'icon-sms',
    'icon-alarm_clock',
    'icon-smartphone_tablet',
    'icon-approve',
    'icon-slr_back_side',
    'icon-area_chart',
    'icon-sound_recording_copyright',
    'icon-assistant',
    'icon-speaker',
    'icon-bar_chart',
    'icon-sports_mode',
    'icon-automatic',
    'icon-start',
    'icon-bearish',
    'icon-switch_camera',
    'icon-bad_decision',
    'icon-statistics',
    'icon-biomass',
    'icon-support',
    'icon-binoculars1',
    'icon-stack_of_photos',
    'icon-biotech',
    'icon-survey',
    'icon-biohazard',
    'icon-synchronize',
    'icon-briefcase',
    'icon-tablet_android',
    'icon-bookmark',
    'icon-template',
    'icon-bullish',
    'icon-todo_list',
    'icon-business_contact',
    'icon-trademark',
    'icon-broken_link',
    'icon-timeline',
    'icon-business',
    'icon-tree_structure',
    'icon-businesswoman',
    'icon-undo',
    'icon-businessman',
    'icon-two_smartphones',
    'icon-cable_release',
    'icon-unlock',
    'icon-butting_in',
    'icon-up_left',
    'icon-calculator',
    'icon-up_right',
    'icon-calendar',
    'icon-up',
    'icon-call_transfer',
    'icon-upload',
    'icon-callback',
    'icon-video_call',
    'icon-camcorder_pro',
    'icon-video_file',
    'icon-camcorder',
    'icon-view_details',
    'icon-camera_addon',
    'icon-vip',
    'icon-cancel',
    'icon-voice_presentation',
    'icon-camera',
    'icon-voicemail',
    'icon-camera_identification',
    'icon-video_projector',
    'icon-candle_sticks',
    'icon-webcam',
    'icon-capacitor',
    'icon-workflow',
    'icon-checkmark',
    'icon-charge_battery',
    'icon-cell_phone',
    'icon-circuit',
    'icon-clapperboard',
    'icon-clear_filters',
    'icon-clock',
    'icon-close_up_mode',
    'icon-collapse',
    'icon-collaboration',
    'icon-collect',
    'icon-combo_chart',
    'icon-comments',
    'icon-compact_camera',
    'icon-conference_call',
    'icon-cloth',
    'icon-copyleft',
    'icon-contacts',
    'icon-copyright',
    'icon-currency_exchange',
    'icon-crystal_oscillator',
    'icon-customer_support',
    'icon-dam',
    'icon-data_backup',
    'icon-data_protection',
    'icon-data_configuration',
    'icon-data_recovery',
    'icon-data_encryption',
    'icon-database',
    'icon-decision',
    'icon-delete_column',
    'icon-debt',
    'icon-data_sheet',
    'icon-delete_database',
    'icon-deployment',
    'icon-department',
    'icon-diploma_2',
    'icon-delete_row',
    'icon-diploma_1',
    'icon-disapprove',
    'icon-dislike',
    'icon-display',
    'icon-do_not_inhale',
    'icon-do_not_insert',
    'icon-do_not_mix',
    'icon-document',
    'icon-disclaimer',
    'icon-down_right',
    'icon-doughnut_chart',
    'icon-down_left',
    'icon-download',
    'icon-donate',
    'icon-down',
    'icon-edit_image',
    'icon-electrical_sensor',
    'icon-electricity',
    'icon-electro_devices',
    'icon-electronics',
    'icon-empty_battery',
    'icon-empty_filter',
    'icon-empty_trash',
    'icon-end_call',
    'icon-engineering',
    'icon-expand',
    'icon-entering_heaven_alive',
    'icon-export',
    'icon-external',
    'icon-expired',
    'icon-factory_breakdown',
    'icon-factory',
    'icon-faq',
    'icon-feed_in',
    'icon-file',
    'icon-filled_filter',
    'icon-film',
    'icon-filing_cabinet',
    'icon-film_reel',
    'icon-feedback',
    'icon-fine_print',
    'icon-flash_auto',
    'icon-flash_on',
    'icon-flash_off',
    'icon-flow_chart',
    'icon-folder',
    'icon-frame',
    'icon-full_battery',
    'icon-gallery',
    'icon-full_trash',
    'icon-generic_sorting_desc',
    'icon-genealogy',
    'icon-generic_sorting_asc',
    'icon-globe',
    'icon-graduation_cap',
    'icon-good_decision',
    'icon-headset',
    'icon-grid',
    'icon-heat_map',
    'icon-high_battery',
    'icon-high_priority',
    'icon-home',
    'icon-idea',
    'icon-image_file',
    'icon-import',
    'icon-icons8_cup',
    'icon-in_transit',
    'icon-info',
    'icon-inspection',
    'icon-integrated_webcam',
    'icon-invite',
    'icon-ipad',
    'icon-internal',
    'icon-iphone',
    'icon-kindle',
    'icon-landscape',
    'icon-key',
    'icon-left_down2',
    'icon-left_down',
    'icon-leave',
    'icon-left_up',
    'icon-left_up2',
    'icon-left',
    'icon-light_at_the_end_of_tunnel',
    'icon-like_placeholder',
    'icon-library',
    'icon-like',
    'icon-link',
    'icon-lock_landscape',
    'icon-line_chart',
    'icon-lock_portrait',
    'icon-list',
    'icon-lock',
    'icon-low_battery',
    'icon-low_priority',
    'icon-medium_priority',
    'icon-make_decision',
    'icon-manager',
    'icon-menu',
    'icon-middle_battery',
    'icon-minus',
    'icon-mind_map',
    'icon-missed_call',
    'icon-money_transfer',
    'icon-mms',
    'icon-multiple_cameras',
    'icon-multiple_devices',
    'icon-multiple_inputs',
    'icon-multiple_smartphones',
    'icon-music',
    'icon-negative_dynamic',
    'icon-neutral_decision',
    'icon-news',
    'icon-next',
    'icon-night_landscape',
    'icon-no_idea',
    'icon-night_portrait',
    'icon-numerical_sorting_12',
    'icon-ok',
    'icon-numerical_sorting_21',
    'icon-opened_folder',
    'icon-old_time_camera',
    'icon-online_support',
    'icon-org_unit',
    'icon-organization',
    'icon-package',
    'icon-paid',
    'icon-parallel_tasks',
    'icon-panorama',
    'icon-overtime',
    'icon-phone_android',
    'icon-phone',
    'icon-photo_reel',
    'icon-pie_chart',
    'icon-plus',
    'icon-planner',
    'icon-podium_with_speaker',
    'icon-picture',
    'icon-podium_without_speaker',
    'icon-previous',
    'icon-positive_dynamic',
    'icon-privacy',
    'icon-portrait_mode',
    'icon-print',
    'icon-process',
    'icon-puzzle',
    'icon-questions',
    'icon-rating',
    'icon-radar_plot',
    'icon-ratings',
    'icon-redo',
    'icon-reading',
    'icon-registered_trademark',
    'icon-refresh',
    'icon-reading_ebook',
    'icon-remove_image',
    'icon-right_down2',
    'icon-right_down',
    'icon-right_up',
    'icon-reuse',
  ]
  const rowSelection = {
    onChange: (selectedRowKeys, selectedRows) => {
      console.log(`selectedRowKeys: ${selectedRowKeys}`, 'selectedRows: ', selectedRows);
    },
    onSelect: (record, selected, selectedRows) => {
      console.log(record, selected, selectedRows);
    },
    onSelectAll: (selected, selectedRows, changeRows) => {
      console.log(selected, selectedRows, changeRows);
    },
  };
  //头部混入
  const headMixins = {
    data () {
      return {
        headerForm:{
          enable:'',
          menuName:''
        }
      }
    },
    created () {
    },
    methods: {
      // 搜索
      onSearch () {
        this.queryMenuTree();
      },
      // 去添加
      onToAdd () {
        this.modalState = true;
        this.modalTitle = '添加菜单';
        this.addStatus = true;
        this.menuTypeShow=true;
        this.form.menuType=0,
        this.form.parentId='',
        this.form.menuName='',
        this.form.icon='',
        this.form.sort=0,
        this.form.target='-self',
        this.form.route='',
        this.form.component='',
        this.form.componentName='',
        this.form.redirect='',
        this.form.keepAlive=0,
        this.form.hiddenHeaderContent=0,
        this.form.permissionMark='',
        this.form.enable=1
      }
    }
  };
  //列表混入
  const tableMixins = {
    data () {
      return {
        columns,
        data:[],
        menuData:[],
        rowSelection
      }
    },
    created () {
      this.queryMenuTree();
      this.queryMenuSelectTree();
    },
    methods: {
      queryMenuTree(){
        this.spinning = true;
        queryMenuTree(this.headerForm)
          .then(res => {
            if(res.code==2020200){
              this.data = res.data[0].nodes;
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
      queryMenuSelectTree(){
        this.leafNodeList = [];
        queryMenuTree()
          .then(res => {
            if(res.code==2020200){
              this.menuData =res.data;
              this.getTree(this.menuData)
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
        this.modalTitle = '修改菜单';
        this.addStatus = false;
        this.menuTypeShow=false;
        this.form.menuType=record.menuType;
        this.form.parentId=record.parentId;
        this.form.menuName=record.menuName;
        this.form.icon=record.icon;
        this.form.sort=record.sort;
        this.form.target=record.target;
        this.form.route=record.route;
        this.form.component=record.component;
        this.form.componentName=record.componentName;
        this.form.redirect=record.redirect;
        this.form.keepAlive=record.keepAlive;
        this.form.hiddenHeaderContent=record.hiddenHeaderContent;
        this.form.permissionMark=record.permissionMark;
        this.form.enable=record.enable;
        this.id=record.id;
        console.log(record)
      },
      // 删除确认
      onDeleteConfirm (record) {
          deleteMenuByid({id:record.id})
            .then(res => {
              if(res.code==2020200){
                this.$message.info(res.message);
                this.queryMenuTree();
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
        iconList,
        modalTitle:'新建菜单',
        modalState:false,
        modalTitle2:'图标选择',
        modalState2:false
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
        labelCol: { span: 8 },
        wrapperCol: { span: 14 },
        menuTypeShow:true,
        leafNodeList:[],
        addStatus:true,
        id:'',
        form:{
          menuType:0,
          parentId:'',
          menuName:'',
          icon:'',
          sort:0,
          target:'-self',
          route:'',
          component:'',
          componentName:'',
          redirect:'',
          keepAlive:0,
          hiddenHeaderContent:0,
          permissionMark:'',
          enable:1
        },
        rules: {
          parentId: [{ required: true, message: '请选择上级菜单', trigger: 'change' }],
          menuName: [{ required: true, message: '请输入名称', trigger: 'blur' }],
          permissionMark: [{ required: true, message: '请输入权限标识', trigger: 'blur' }],
          route: [{ required: true, message: '请输入路由地址', trigger: 'blur' }],
          component: [{ required: true, message: '请输入组件路径', trigger: 'blur' }],
          componentName: [{ required: true, message: '请输入组件名称', trigger: 'blur' }],
        }
      }
    },
    created () {
    },
    methods: {
      selectToIcon(){
        this.modalState2 = true
      },
      SelectIcon(item){
        this.form.icon = item;
        this.modalState2 = false;
      },
      //菜单切换
      onCdlxChange(e){
      },
      //添加
      onAdd(){
        this.$refs.ruleForm.validate(valid => {
          if (valid) {
            let params = {}
            if(this.form.menuType==0){
                params = this.form
            }else{
                params ={
                menuType:this.form.menuType,
                parentId:this.form.parentId,
                menuName:this.form.menuName,
                sort:this.form.sort,
                permissionMark:this.form.permissionMark,
                enable:1
              }
            }
              insertMenu(params)
                .then(res => {
                  if(res.code==2020200){
                    this.queryMenuTree();
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
        console.log('Object.assign(this.form,{id:this.id})-------------')
        console.log(Object.assign(this.form,{id:this.id}))
        updateMenu(Object.assign(this.form,{id:this.id}))
          .then(res => {
            if(res.code==2020200){
              this.queryMenuTree();
              this.queryMenuSelectTree();
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
      }
    }
  }
  //vue实例
  export default {
    name: 'MenuManagement',
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
          if(data[i].menuType==0){
            data[i].title = data[i].menuName;
            data[i].value = data[i].id;
            data[i].key = data[i].id;
            if(data[i].nodes&&data[i].nodes.length>0){
              data[i].children = data[i].nodes;
              for(let j =0;j<data[i].nodes.length;j++){
                if(data[i].nodes[j].menuType==1){
                  this.leafNodeList.push(data[i])
                  break;
                }
              }
              this.getTree(data[i].nodes)
            }else{
              this.leafNodeList.push(data[i])
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
  .box{
    height: 125px;
    box-sizing: border-box;
    text-align: center;
    border: 1px solid #ddd;
    cursor: pointer;
  }
  .box:hover{
    border: 1px dashed #ddd;
    background: #eeeeee;
  }
  .boxIcon{
    font-size: 40px;
    margin-top: 30px;
  }
  .boxTitle{
    text-overflow: ellipsis;
    overflow: hidden;
    white-space: nowrap;
  }
</style>
