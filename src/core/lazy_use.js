import Vue from 'vue'
import VueStorage from 'vue-ls'
import config from '@/config/defaultSettings'

// base library（基本组件）
import '@/core/lazy_lab'
import 'ant-design-vue/dist/antd.css'
/* antV的图表非常漂亮 */
import Viser from 'viser-vue'
// 图片剪裁器
import VueCropper from 'vue-cropper'
// 集成动画
import '../../static/animate/animate.min.css'


Vue.use(VueStorage, config.storageOptions)
Vue.use(Viser)
Vue.use(VueCropper)
