<template>
  <div>
    <el-card>
      <!-- 头部搜索、添加区 -->
      <el-row :gutter="20">
        <el-col :xs="4" :sm="6" :md="8" :lg="9" :xl="11">
          <el-input
            v-model="queryInfo.query"
            placeholder="请输入内容"
            clearable
            @clear="getGoodsList()"
          >
            <el-button
              slot="append"
              icon="el-icon-search"
              @click="getGoodsList()"
            ></el-button>
          </el-input>
        </el-col>
        <el-col :xs="8" :sm="6" :md="4" :lg="3" :xl="1">
          <el-button type="primary" @click="goAddGoodPage()"
            >添加商品</el-button
          ></el-col
        >
      </el-row>
      <!-- 商品列表 -->
      <el-table :data="goodslist" border stripe>
        <el-table-column type="index" width="50"> </el-table-column>
        <el-table-column prop="goods_name" label="商品名称"> </el-table-column>
        <el-table-column prop="goods_price" label="商品价格(元)" width="90px">
        </el-table-column>
        <el-table-column prop="goods_weight" label="商品重量" width="70px">
        </el-table-column>
        <el-table-column prop="add_time" label="创建时间" width="190px">
          <template slot-scope="scope">
            {{ scope.row.add_time | dataFormat }}
          </template>
        </el-table-column>
        <el-table-column label="操作" width="140px">
          <template slot-scope="scope">
            <!-- 修改按钮 -->
            <el-button
              type="success"
              size="mini"
              icon="el-icon-edit"
              @click="btnGoodsEdit(scope.row.goods_id)"
            ></el-button>
            <!-- 删除按钮 -->
            <el-button
              type="danger"
              size="mini"
              icon="el-icon-delete"
              @click="btnGoodsDelete(scope.row.goods_id)"
            ></el-button>
          </template>
        </el-table-column>
      </el-table>
      <div class="block">
        <el-pagination
          @size-change="handleSizeChange"
          @current-change="handleCurrentChange"
          :current-page="queryInfo.pagenum"
          :page-sizes="[5, 10, 15, 20, 25, 30]"
          :page-size="queryInfo.pagesize"
          layout="total, sizes, prev, pager, next, jumper"
          :total="total"
        >
        </el-pagination>
      </div>
    </el-card>
  </div>
</template>
<script>
export default {
  data() {
    return {
      // 商品数据集
      goodslist: [],
      // 控制添加商品Dialog显示和隐藏
      addGoodsDialog: false,
      // 分页查询参数
      queryInfo: {
        query: '',
        pagenum: 1,
        pagesize: 10,
      },
      // 商品总条数
      total: 0,
    }
  },
  created() {
    this.getGoodsList()
  },
  methods: {
    // 初始化商品列表
    async getGoodsList() {
      const { data: res } = await this.$http.get('goods', {
        params: this.queryInfo,
      })
      console.log(res)
      if (res.meta.status !== 200) {
        this.$message.error(res.meta.msg)
      } else {
        this.goodslist = res.data.goods
        this.total = res.data.total
        this.$message.success(res.meta.msg)
      }
    },
    // 监听：数据展示条数改变
    handleSizeChange(val) {
      this.queryInfo.pagesize = val
      this.getGoodsList()
    },
    // 监听：页码改变
    handleCurrentChange(val) {
      this.queryInfo.pagenum = val
      this.getGoodsList()
    },
    // 添加商品路由跳转
    goAddGoodPage() {
      this.$router.push('/goods/add')
    },
    btnGoodsEdit(rowgoodid) {
      this.$router.push({ path: '/goods/edit', query: { id: rowgoodid } })
    },
    // 商品删除
    btnGoodsDelete(rowgoodid) {
      this.$messagebox
        .confirm('此操作将永久删除该文件, 是否继续?', '提示', {
          confirmButtonText: '确定',
          cancelButtonText: '取消',
          type: 'warning',
        })
        .then(async () => {
          // 删除数据
          const { data: res } = await this.$http.delete('goods/' + rowgoodid)
          if (res.meta.status !== 200) {
            this.$message.error(res.meta.msg)
          } else {
            this.getGoodsList()
            this.$message.success(res.meta.msg)
          }
        })
        .catch(() => {
          this.$message({
            type: 'info',
            message: '已取消删除',
          })
        })
    },
  },
}
</script>

<style lang="less" scoped></style>
