<template>
  <div>
    <!-- 卡片视图 -->
    <el-card>
      <!-- 头部搜索-->
      <el-row :gutter="20">
        <el-col :span="8">
          <el-input
            placeholder="请输入内容"
            v-model="orderQuery.query"
            clearable
          >
            <el-button
              slot="append"
              icon="el-icon-search"
              @click="btnSelectOrder()"
            ></el-button>
          </el-input>
        </el-col>
      </el-row>
      <!-- 数据表格 -->
      <el-table :data="orderList" border stripe>
        <el-table-column type="index" width="50" label="#"> </el-table-column>
        <el-table-column prop="order_number" label="订单编号"></el-table-column>
        <el-table-column prop="order_price" label="订单价格" width="120px">
        </el-table-column>
        <el-table-column prop="pay_status" label="是否付款" width="120px">
          <template slot-scope="scope">
            <el-tag type="success" v-if="scope.row.pay_status === '1'"
              >已付款</el-tag
            >
            <el-tag type="danger" v-if="scope.row.pay_status === '0'"
              >未付款</el-tag
            >
          </template>
        </el-table-column>
        <el-table-column prop="is_send" label="是否发货" width="120px">
        </el-table-column>
        <el-table-column prop="create_time" label="下单时间" width="180px">
          <template slot-scope="scope">
            {{ scope.row.create_time | dataFormat }}
          </template>
        </el-table-column>
        <el-table-column label="操作" width="180px">
          <template slot-scope="scope">
            <el-tooltip
              effect="dark"
              content="修改地址"
              placement="top"
              :enterable="false"
            >
              <el-button
                type="success"
                icon="el-icon-edit"
                size="mini"
                @click="btnOrderEditAddress(scope.row.order_id)"
              ></el-button>
            </el-tooltip>
            <el-tooltip
              effect="dark"
              content="物流进度"
              placement="top"
              :enterable="false"
            >
              <el-button
                type="primary"
                icon="el-icon-location-outline"
                size="mini"
                @click="btnOrderSetAddress(scope.row.order_id)"
              ></el-button>
            </el-tooltip>
          </template>
        </el-table-column>
      </el-table>
      <!-- 分页 -->
      <el-pagination
        @size-change="handleSizeChange"
        @current-change="handleCurrentChange"
        :current-page="orderQuery.pagenum"
        :page-sizes="[5, 8, 10, 15, 20, 25, 30]"
        :page-size="orderQuery.pagesize"
        layout="total, sizes, prev, pager, next, jumper"
        :total="total"
      >
      </el-pagination>
      <!-- 修改地址Dialog -->
      <el-dialog
        title="修改订单地址"
        :visible.sync="editOrderAddress"
        width="40%"
        @close="editDialogClose('editAddressFormRef')"
      >
        <el-form
          :model="editAddressForm"
          :rules="editAddressFormRules"
          ref="editAddressFormRef"
          label-width="100px"
        >
          <el-form-item label="省市区/县：" prop="address1">
            <el-cascader
              v-model="editAddressForm.address1"
              :options="cityDatas"
              :props="propsAddress"
              expandTrigger="hover"
              style="width: 100%"
            ></el-cascader>
          </el-form-item>
          <el-form-item label="详细地址：" prop="address2">
            <el-input v-model="editAddressForm.address2"></el-input>
          </el-form-item>
        </el-form>
        <span slot="footer" class="dialog-footer">
          <el-button @click="editOrderAddress = false">取 消</el-button>
          <el-button type="primary" @click="editOrderAddress = false"
            >确 定</el-button
          >
        </span>
      </el-dialog>
      <!-- 物流状况 -->
      <el-dialog
        title="物流进度"
        :visible.sync="setlookOrderAddress"
        width="40%"
      >
        <el-timeline :reverse="true">
          <el-timeline-item
            v-for="(item, i) in progressInfo"
            :key="i"
            :timestamp="item.time"
          >
            {{ item.context }}
          </el-timeline-item>
        </el-timeline>
      </el-dialog>
    </el-card>
  </div>
</template>

<script>
import cityData from './citydata.js'

export default {
  data() {
    return {
      // 商品订单数据
      orderList: [],
      // 数据请求条件
      orderQuery: {
        query: '',
        pagenum: 1,
        pagesize: 8,
      },
      // 数据总条数
      total: 0,
      // 控制修改地址Dialog显示和隐藏
      editOrderAddress: false,
      // 控制查看物流进度Dialog显示和隐藏
      setlookOrderAddress: false,
      // 物流信息
      progressInfo: [
        {
          time: '2018-05-10 09:39:00',
          ftime: '2018-05-10 09:39:00',
          context: '已签收,感谢使用顺丰,期待再次为您服务',
          location: '',
        },
        {
          time: '2018-05-10 08:23:00',
          ftime: '2018-05-10 08:23:00',
          context:
            '[北京市]北京海淀育新小区营业点派件员 顺丰速运 95338正在为您派件',
          location: '',
        },
        {
          time: '2018-05-10 07:32:00',
          ftime: '2018-05-10 07:32:00',
          context: '快件到达 [北京海淀育新小区营业点]',
          location: '',
        },
        {
          time: '2018-05-10 02:03:00',
          ftime: '2018-05-10 02:03:00',
          context:
            '快件在[北京顺义集散中心]已装车,准备发往 [北京海淀育新小区营业点]',
          location: '',
        },
        {
          time: '2018-05-09 23:05:00',
          ftime: '2018-05-09 23:05:00',
          context: '快件到达 [北京顺义集散中心]',
          location: '',
        },
        {
          time: '2018-05-09 21:21:00',
          ftime: '2018-05-09 21:21:00',
          context: '快件在[北京宝胜营业点]已装车,准备发往 [北京顺义集散中心]',
          location: '',
        },
        {
          time: '2018-05-09 13:07:00',
          ftime: '2018-05-09 13:07:00',
          context: '顺丰速运 已收取快件',
          location: '',
        },
        {
          time: '2018-05-09 12:25:03',
          ftime: '2018-05-09 12:25:03',
          context: '卖家发货',
          location: '',
        },
        {
          time: '2018-05-09 12:22:24',
          ftime: '2018-05-09 12:22:24',
          context: '您的订单将由HLA（北京海淀区清河中街店）门店安排发货。',
          location: '',
        },
        {
          time: '2018-05-08 21:36:04',
          ftime: '2018-05-08 21:36:04',
          context: '商品已经下单',
          location: '',
        },
      ],
      // 修改订单地址数据对象
      editAddressForm: {
        address1: [],
        address2: '',
      },
      // 修改订单地址验证规则
      editAddressFormRules: {
        address1: [
          { required: true, message: '请选择省市区/县地址', trigger: 'blur' },
        ],
        address2: [
          { required: true, message: '请输入详细地址', trigger: 'blur' },
        ],
      },
      // 地址数据
      cityDatas: cityData,
      // 联级选择器配置
      propsAddress: {
        value: 'value',
        label: 'label',
        children: 'children',
      },
    }
  },
  created() {
    this.getOrderList()
  },
  methods: {
    // 初始化商品订单列表
    async getOrderList() {
      const { data: res } = await this.$http.get('orders', {
        params: this.orderQuery,
      })
      if (res.meta.status !== 200) {
        this.$message.error(res.meta.msg)
      } else {
        this.orderList = res.data.goods
        console.log(res.data.goods)
        this.total = res.data.total
        this.$message.success(res.meta.msg)
      }
    },
    // 监听：每页条数改变
    handleSizeChange(val) {
      this.orderQuery.pagesize = val
      this.getOrderList()
    },
    // 监听：页码的改变
    handleCurrentChange(val) {
      this.orderQuery.pagenum = val
      this.getOrderList()
    },
    // 订单查询
    btnSelectOrder() {
      this.getOrderList()
    },
    // 修改订单地址按钮点击事件
    btnOrderEditAddress(orderid) {
      this.editOrderAddress = true
    },
    // 修改地址对话框关闭事件
    editDialogClose(ref) {
      this.$refs[ref].resetFields()
    },
    // 物流进度看
    async btnOrderSetAddress(orderid) {
      this.setlookOrderAddress = true
    },
  },
}
</script>

<style lang="less" scoped></style>
