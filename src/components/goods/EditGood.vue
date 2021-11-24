<template>
  <div>
    <!-- 面包屑导航区域 -->
    <el-breadcrumb separator-class="el-icon-arrow-right">
      <el-breadcrumb-item :to="{ path: '/home' }">首页</el-breadcrumb-item>
      <el-breadcrumb-item>商品管理</el-breadcrumb-item>
      <el-breadcrumb-item :to="{ path: '/goods' }">商品列表</el-breadcrumb-item>
      <el-breadcrumb-item>编辑商品</el-breadcrumb-item>
    </el-breadcrumb>
    <!-- 卡片视图 -->
    <el-card>
      <!-- 提示 -->
      <el-alert
        title="编辑商品信息"
        type="info"
        show-icon
        center
        :closable="false"
      >
      </el-alert>
      <!-- 步骤条 -->
      <template>
        <div>
          <el-steps
            :space="200"
            :active="parseInt(activeIndex)"
            finish-status="success"
            align-center
          >
            <el-step title="基本信息"></el-step>
            <el-step title="商品参数"></el-step>
            <el-step title="商品属性"></el-step>
            <el-step title="商品图片"></el-step>
            <el-step title="商品内容"></el-step>
            <el-step title="完成"></el-step>
          </el-steps>
          <!-- tabs标签页 -->
          <el-form
            :model="editgoodInfo"
            :rules="editgoodInfoRules"
            ref="editgoodInfoRef"
            label-width="100px"
            label-position="top"
          >
            <el-tabs
              v-model="activeIndex"
              :tab-position="'left'"
              :before-leave="beforeTabPage"
              @tab-click="tabCheckOut()"
            >
              <el-tab-pane label="基本信息" name="0">
                <el-form-item label="商品名称：" prop="goods_name">
                  <el-input v-model="editgoodInfo.goods_name"></el-input>
                </el-form-item>
                <el-form-item label="商品价格：" prop="goods_price">
                  <el-input
                    v-model="editgoodInfo.goods_price"
                    type="number"
                  ></el-input>
                </el-form-item>
                <el-form-item label="商品数量：" prop="goods_number">
                  <el-input
                    v-model="editgoodInfo.goods_number"
                    type="number"
                  ></el-input>
                </el-form-item>
                <el-form-item label="商品重量：" prop="goods_weight">
                  <el-input
                    v-model="editgoodInfo.goods_weight"
                    type="number"
                  ></el-input>
                </el-form-item>
                <el-form-item label="商品分类" prop="goods_cat">
                  <el-cascader
                    v-model="editgoodInfo.goods_cat"
                    :options="goodscatelist"
                    :props="cateprops"
                    @change="goodcatechange()"
                    expandTrigger="hover"
                  ></el-cascader>
                </el-form-item>
              </el-tab-pane>
              <el-tab-pane label="商品参数" name="1">
                <el-form-item
                  v-for="item in goodmanylist"
                  :key="item.attr_id"
                  :label="item.attr_name"
                >
                  <el-checkbox-group v-model="item.attr_vals">
                    <el-checkbox
                      v-for="(item1, i1) in item.attr_vals"
                      :key="i1"
                      :label="item1"
                      border
                    ></el-checkbox>
                  </el-checkbox-group>
                </el-form-item>
              </el-tab-pane>
              <el-tab-pane label="商品属性" name="2">
                <el-form-item
                  v-for="item in goodonlylist"
                  :key="item.attr_id"
                  :label="item.attr_name"
                >
                  <el-input v-model="item.attr_vals"></el-input>
                </el-form-item>
              </el-tab-pane>
              <el-tab-pane label="商品图片" name="3">
                <!-- action图片上传的地址 -->
                <el-upload
                  :action="uploadUrl"
                  :on-preview="handlePreview"
                  :on-remove="handleRemove"
                  :on-success="handleSuccess"
                  list-type="picture"
                  :headers="headerObj"
                >
                  <el-button size="small" type="primary">点击上传</el-button>
                  <div slot="tip" class="el-upload__tip">
                    只能上传jpg/png文件，且不超过500kb
                  </div>
                </el-upload>
              </el-tab-pane>
              <el-tab-pane label="商品内容" name="4">
                <!-- editer符文本编辑器 -->
                <quill-editor
                  v-model="editgoodInfo.goods_introduce"
                  style="width: 90%"
                ></quill-editor>
                <!-- 添加商品的按钮 -->
                <el-button
                  type="primary"
                  size="default"
                  style="margin-top: 15px"
                  @click="btnAddNewGood()"
                  >提交</el-button
                >
              </el-tab-pane>
            </el-tabs>
          </el-form>
        </div>
      </template>
      <!-- 图片预览Dialog -->
      <el-dialog
        title="图片预览"
        :visible.sync="dialogVisibleImg"
        @close="dialogVisibleImgColse()"
        width="40%"
      >
        <img :src="previewImgUrl" alt="图片" style="width: 100% !important" />
      </el-dialog>
    </el-card>
  </div>
</template>

<script>
import _ from 'lodash'

export default {
  data() {
    return {
      // 步骤条进行项
      activeIndex: '0',
      // 商品分类
      goodscatelist: [],
      // 商品动态参数
      goodmanylist: [],
      // 商品静态属性
      goodonlylist: [],
      // 监视分类是否改变
      catestatus: false,
      // 商品编号
      thenGoodId: '',
      // 图片上传请求头
      headerObj: {
        Authorization: window.sessionStorage.getItem('token'),
      },
      // 图片上传
      goodFileImgList: [],
      // 图片上传地址
      uploadUrl: 'http://127.0.0.1:8888/api/private/v1/upload',
      // 控制图片预览Dialog的显示和隐藏
      dialogVisibleImg: false,
      // 预览图片的存放地址
      previewImgUrl: '',
      // 添加商品的数据集
      editgoodInfo: {
        goods_name: '',
        goods_price: 0,
        goods_number: 0,
        goods_weight: 0,
        // 商品分类的数组
        goods_cat: [1, 3, 6],
        // 商品描述
        goods_introduce: '',
        // 图片的数组
        pics: [],
        attrs: [],
      },
      // 联级选择器配置
      cateprops: {
        value: 'cat_id',
        label: 'cat_name',
        children: 'children',
      },
      // 添加商品的表单验证
      editgoodInfoRules: {
        goods_name: [
          { required: true, message: '请输入商品名称', trigger: 'blur' },
        ],
        goods_price: [
          { required: true, message: '请输入商品价格', trigger: 'blur' },
        ],
        goods_number: [
          { required: true, message: '请输入商品数量', trigger: 'blur' },
        ],
        goods_weight: [
          { required: true, message: '请输入商品重量', trigger: 'blur' },
        ],
        goods_cat: [
          { required: true, message: '请选择商品分类', trigger: 'blur' },
        ],
      },
    }
  },
  created() {
    this.getCateList()
  },
  methods: {
    // 分类列表
    async getCateList() {
      const { data: res } = await this.$http.get('categories')
      if (res.meta.status !== 200) {
        this.$message.error(res.meta.msg)
      } else {
        this.goodscatelist = res.data
        this.$message.success(res.meta.msg)
        this.getGoodData()
      }
    },
    // 商品信息初始化
    async getGoodData() {
      const goodid = this.$route.query.id
      const { data: res } = await this.$http.get('goods/' + goodid)
      if (res.meta.status !== 200) {
        this.$message.error(res.meta.msg)
      } else {
        console.log(res.data)
        this.thenGoodId = res.data.goods_id
        this.editgoodInfo.goods_name = res.data.goods_name
        this.editgoodInfo.goods_price = res.data.goods_price
        this.editgoodInfo.goods_number = res.data.goods_number
        this.editgoodInfo.goods_weight = res.data.goods_weight
        this.editgoodInfo.goods_introduce = res.data.goods_introduce
        this.editgoodInfo.goods_cat = res.data.goods_cat
          .split(',')
          .map((e) => e - 0)
        res.data.attrs.forEach((item) => {
          if (item.attr_sel === 'only') {
            this.goodonlylist.push(item)
          } else {
            item.attr_vals =
              item.attr_vals.length === 0 ? [] : item.attr_vals.split(' ')
            this.goodmanylist.push(item)
          }
        })
        this.$message.success(res.meta.msg)
      }
    },
    // 监听商品分类的选择
    goodcatechange() {
      console.log(this.editgoodInfo.goods_cat)
      if (this.editgoodInfo.goods_cat.length !== 3) {
        this.editgoodInfo.goods_cat = []
      }
      this.catestatus = true
    },
    // 监听：tabs切换，进行数据验证
    beforeTabPage(activName, oldActiveName) {
      if (this.editgoodInfo.goods_cat.length !== 3 && oldActiveName === '0') {
        this.$message.error('未选择分类，或选择的不是三级分类')
        return false
      }
    },
    // 监听：处理移除图片的操作
    handleRemove(file, fileList) {
      const picpath = file.response.data.tmp_path
      const picIndex = this.editgoodInfo.pics.findIndex(
        (x) => x.pic === picpath
      )
      this.editgoodInfo.pics.splice(picIndex, 1)
      console.log(this.editgoodInfo)
    },
    // 监听：处理图片上传后预览的效果
    handlePreview(file) {
      this.previewImgUrl = file.response.data.url
      this.dialogVisibleImg = true
    },
    // 监听：图片上成功钩子函数
    handleSuccess(response) {
      // 拼接得到图片信息对象
      const picInfo = { pic: response.data.tmp_path }
      // 将图片信息对象存入商品对象中的pics数组中
      this.editgoodInfo.pics.push(picInfo)
      console.log(this.editgoodInfo)
    },
    // 监听图片预览Dialog关闭事件
    dialogVisibleImgColse() {
      this.previewImgUrl = ''
    },
    // tab切换事件
    async tabCheckOut() {
      if (this.catestatus) {
        if (this.activeIndex === '1') {
          const { data: res } = await this.$http.get(
            `categories/${this.cataId}/attributes`,
            {
              params: {
                sel: 'many',
              },
            }
          )
          console.log(res)
          if (res.meta.status !== 200) {
            this.$message.error('数据异常')
          } else {
            res.data.forEach((item) => {
              item.attr_vals =
                item.attr_vals.length === 0 ? [] : item.attr_vals.split(' ')
            })
            this.goodmanylist = res.data
          }
        }
        if (this.activeIndex === '2') {
          const { data: res } = await this.$http.get(
            `categories/${this.cataId}/attributes`,
            {
              params: {
                sel: 'only',
              },
            }
          )
          console.log(res)
          if (res.meta.status !== 200) {
            this.$message.error('数据异常')
          } else {
            this.goodonlylist = res.data
          }
        }
      }
    },
    // 提交修改商品
    btnAddNewGood() {
      this.$refs.editgoodInfoRef.validate(async (result) => {
        if (!result) {
          this.$message.error('商品基本信息填写不完整')
        } else {
          // 商品数据,深拷贝进行格式校准
          const newEditGoodInfo = _.cloneDeep(this.editgoodInfo)
          newEditGoodInfo.goods_cat = newEditGoodInfo.goods_cat.join(',')
          // 处理动态参数
          this.goodmanylist.forEach((item) => {
            const manyInfo = {
              attr_id: item.attr_id,
              attr_value: item.attr_vals.join(' '),
            }
            this.editgoodInfo.attrs.push(manyInfo)
          })
          // 处理静态属性
          this.goodonlylist.forEach((item) => {
            const onlyInfo = {
              attr_id: item.attr_id,
              attr_value: item.attr_vals,
            }
            this.editgoodInfo.attrs.push(onlyInfo)
          })
          newEditGoodInfo.attrs = this.editgoodInfo.attrs
          console.log(newEditGoodInfo)
          // 商品的名称唯一
          const { data: res } = await this.$http.put(
            `goods/${this.thenGoodId}`,
            {
              goods_name: newEditGoodInfo.goods_name,
              goods_price: newEditGoodInfo.goods_price,
              goods_number: newEditGoodInfo.goods_number,
              goods_weight: newEditGoodInfo.goods_weight,
              pics: newEditGoodInfo.pics,
              goods_cat: newEditGoodInfo.goods_cat,
              goods_introduce: newEditGoodInfo.goods_introduce,
              attrs: newEditGoodInfo.attrs,
            }
          )
          if (res.meta.status !== 200) {
            this.$message.error(res.meta.msg)
          } else {
            this.$message.success('商品编辑成功')
            this.$router.push('/goods')
          }
        }
      })
    },
  },
  computed: {
    // 动态获取商品分类
    cataId() {
      if (this.editgoodInfo.goods_cat.length === 3) {
        return this.editgoodInfo.goods_cat[2]
      } else {
        return null
      }
    },
  },
}
</script>

<style lang="less" scoped>
.el-input {
  width: 87%;
}
.el-checkbox {
  margin: 3px 10px 0 0 !important;
}
</style>
