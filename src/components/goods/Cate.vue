<template>
  <div>
    <!-- 卡片视图 -->
    <el-card>
      <el-row>
        <el-col>
          <!-- 添加角色 -->
          <el-button type="primary" @click="showAddCateDialog()"
            >添加分类</el-button
          >
        </el-col>
      </el-row>
      <tree-table
        :data="catelist"
        :columns="columns"
        :selection-type="false"
        :expand-type="false"
        border
        stripe
        show-index
        index-text="#"
        class="treetable"
      >
        <template slot="isok" slot-scope="scope">
          <i
            class="el-icon-error"
            v-if="!scope.row.cat_deleted"
            style="color: red"
          ></i>
          <i
            class="el-icon-success"
            v-if="scope.row.cat_deleted"
            style="color: blur"
          ></i>
        </template>
        <template slot="islevel" slot-scope="scope">
          <el-tag v-if="scope.row.cat_level === 0">一级</el-tag>
          <el-tag type="success" v-if="scope.row.cat_level === 1">二级</el-tag>
          <el-tag type="warning" v-if="scope.row.cat_level === 2">三级</el-tag>
        </template>
        <template slot="isopare" slot-scope="scope">
          <!-- 修改按钮 -->
          <el-button
            type="success"
            size="mini"
            icon="el-icon-edit"
            @click="btnCateEdit(scope.row.cat_id)"
            >编辑</el-button
          >
          <!-- 删除按钮 -->
          <el-button
            type="danger"
            size="mini"
            icon="el-icon-delete"
            @click="btnCateRemove(scope.row.cat_id)"
            >删除</el-button
          >
        </template>
      </tree-table>
      <!-- 分页功能区 -->
      <el-pagination
        @size-change="handleSizeChange"
        @current-change="handleCurrentChange"
        :current-page="queryInfo.pagenum"
        :page-sizes="[3, 5, 10, 15]"
        :page-size="queryInfo.pagesize"
        layout="total, sizes, prev, pager, next, jumper"
        :total="total"
      >
      </el-pagination>
      <!-- 添加分类对话框 -->
      <el-dialog
        title="添加分类"
        @close="addDialogClose('addCateFromRef')"
        :visible.sync="dialogFormCateAdd"
        width="40%"
      >
        <el-form
          :model="addCateFrom"
          ref="addCateFromRef"
          :rules="addCateRules"
          label-width="100px"
        >
          <el-form-item label="分类名称：" prop="cat_name">
            <el-input v-model="addCateFrom.cat_name"></el-input>
          </el-form-item>
          <el-form-item label="分类父类：">
            <!-- options绑定数据源 -->
            <!-- props指定配置项 -->
            <!-- change-on-select允许选中任何一项 -->
            <el-cascader
              v-model="checkcascaderlist"
              expand-trigger="hover"
              :options="checkCatelist"
              :props="propscate"
              style="width: 100%"
              popper-class="selectArea"
              ref="cascaderHandle"
              @change="cascaderChange()"
              clearable
            ></el-cascader>
          </el-form-item>
        </el-form>
        <div slot="footer">
          <el-button @click="dialogFormCateAdd = false">取 消</el-button>
          <el-button type="primary" @click="getNewCateAdd()">确 定</el-button>
        </div>
      </el-dialog>
      <!-- 编辑分类对话框 -->
      <el-dialog
        title="编辑分类"
        :visible.sync="dialogFormCateEidt"
        width="40%"
        @close="editDialogClose('editFormRef')"
      >
        <el-form
          :model="editCateOnce"
          ref="editFormRef"
          :rules="editFormRules"
          label-width="100px"
        >
          <el-form-item label="分类名称" prop="cat_name">
            <el-input v-model="editCateOnce.cat_name"></el-input>
          </el-form-item>
        </el-form>

        <div slot="footer">
          <el-button @click="dialogFormCateEidt = false">取 消</el-button>
          <el-button type="primary" @click="btnCateEidt()">确 定</el-button>
        </div>
      </el-dialog>
    </el-card>
  </div>
</template>

<script>
export default {
  data() {
    return {
      // 控制添加分类dialog对话框的显示隐藏
      dialogFormCateAdd: false,
      // 控制编辑分类dialog对话框的显示隐藏
      dialogFormCateEidt: false,
      // 商品分类列表数据
      catelist: [],
      // 父级分类数据
      checkCatelist: [],
      // 联级数据选中值
      checkcascaderlist: [],
      // 保存要编辑的源数据
      editCateOnce: {
        cat_pid: '',
        cat_name: '',
      },
      // 获取用户列表的参数对象
      queryInfo: {
        type: 3,
        pagenum: 1,
        pagesize: 5,
      },
      // 数据总条数
      total: 0,
      // 添加分类数据
      addCateFrom: {
        cat_pid: 0,
        cat_name: '',
        cat_level: 0,
      },
      columns: [
        {
          label: '分类名称',
          prop: 'cat_name',
        },
        {
          label: '是否有效',
          // 将当前列定义为模板列
          type: 'template',
          // 当前列使用的模板名称
          template: 'isok',
        },
        {
          label: '排序',
          // 将当前列定义为模板列
          type: 'template',
          // 当前列使用的模板名称
          template: 'islevel',
        },
        {
          label: '操作',
          // 将当前列定义为模板列
          type: 'template',
          // 当前列使用的模板名称
          template: 'isopare',
        },
      ],
      // 级联选择配置
      propscate: {
        value: 'cat_id',
        label: 'cat_name',
        children: 'children',
        checkStrictly: true,
      },
      // 添加验证
      addCateRules: {
        cat_name: [
          { required: true, message: '请输入分类名称', trigger: 'blur' },
        ],
      },
      editFormRules: {
        cat_name: [
          { required: true, message: '请输入分类名称', trigger: 'blur' },
        ],
      },
    }
  },
  created() {
    this.getCateList()
  },
  methods: {
    // 初始化商品分类列表
    async getCateList() {
      const { data: res } = await this.$http.get('categories', {
        params: this.queryInfo,
      })
      if (res.meta.status !== 200) {
        this.$message.error(res.meta.msg)
      } else {
        this.catelist = res.data.result
        this.total = res.data.total
        this.$message.success(res.meta.msg)
      }
    },
    // 监听：每页多少条数据
    handleSizeChange(val) {
      this.queryInfo.pagesize = val
      this.getCateList()
    },
    // 监听：页码
    handleCurrentChange(val) {
      this.queryInfo.pagenum = val
      this.getCateList()
    },
    // 监听：添加分类Dialog关闭,重置表单
    addDialogClose(ref) {
      this.$refs[ref].resetFields()
      this.checkcascaderlist = []
      this.addCateFrom.cat_pid = 0
      this.addCateFrom.cat_level = 0
    },
    // 添加分类对话框的展示
    showAddCateDialog() {
      this.getCheckCatelist()
      this.dialogFormCateAdd = true
    },
    // 获取父级分类选择框的数据
    async getCheckCatelist() {
      const { data: res } = await this.$http.get('categories', {
        params: { type: 2 },
      })
      if (res.meta.status !== 200) {
      } else {
        this.checkCatelist = res.data
      }
    },
    // 联级选项改变事件
    cascaderChange() {
      // 监听值发生变化就关闭它
      this.$refs.cascaderHandle.dropDownVisible = false
      if (this.checkcascaderlist.length > 0) {
        // 父级分类的id
        this.addCateFrom.cat_pid =
          this.checkcascaderlist[this.checkcascaderlist.length - 1]
        // 分类层级
        this.addCateFrom.cat_level = this.checkcascaderlist.length
      } else {
        this.addCateFrom.cat_pid = 0
        this.addCateFrom.cat_level = 0
      }
    },
    // 添加新的商品分类信息
    getNewCateAdd() {
      this.$refs.addCateFromRef.validate(async (result) => {
        console.log(this.addCateFrom)
        if (result) {
          const { data: res } = await this.$http.post(
            'categories',
            this.addCateFrom
          )
          if (res.meta.status !== 201) {
            this.$message.error(res.meta.msg)
          } else {
            this.getCateList()
            this.dialogFormCateAdd = false
            this.$message.success(res.meta.msg)
          }
        }
      })
    },
    // 监听：编辑分类Dialog关闭,重置表单
    editDialogClose(ref) {
      this.$refs[ref].resetFields()
      this.editCateOnce.cat_pid = ''
      this.editCateOnce.cat_name = ''
    },
    // 修改分类dialog显示和数据绑定
    async btnCateEdit(rowcateid) {
      console.log(rowcateid)
      const { data: res } = await this.$http.get('categories/' + rowcateid)
      if (res.meta.status !== 200) {
        this.$message.error('数据获取失败')
      } else {
        this.editCateOnce.cat_pid = res.data.cat_id
        this.editCateOnce.cat_name = res.data.cat_name
        this.dialogFormCateEidt = true
      }
    },
    // 编辑分类提交
    btnCateEidt() {
      this.$refs.editFormRef.validate(async (result) => {
        if (result) {
          const { data: res } = await this.$http.put(
            `categories/${this.editCateOnce.cat_pid}`,
            { cat_name: this.editCateOnce.cat_name }
          )
          if (res.meta.status !== 200) {
            this.$message.error(res.meta.msg)
          } else {
            this.getCateList()
            this.dialogFormCateEidt = false
            this.$message.success(res.meta.msg)
          }
        }
      })
    },
    // 删除商品分类
    async btnCateRemove(rowcateid) {
      const result = await this.$messagebox
        .confirm('此操作将永久删除该角色, 是否继续?', '提示', {
          confirmButtonText: '确定',
          cancelButtonText: '取消',
          type: 'warning',
        })
        .catch((err) => err)
      if (result === 'confirm') {
        const { data: res } = await this.$http.delete('categories/' + rowcateid)
        if (res.meta.status !== 200) {
          this.$message.error(res.meta.msg)
        } else {
          this.getCateList()
          this.$message.success(res.meta.msg)
        }
      } else {
        this.$message({
          type: 'info',
          message: '已取消删除',
        })
      }
    },
  },
}
</script>

<style lang="less">
.treetable {
  margin-top: 15px;
}
// 级联下拉框单选 文字选中样式
.selectArea {
  .el-radio {
    width: 100% !important;
    height: 100% !important;
    z-index: 10 !important;
    position: absolute !important;
    right: 0 !important;
  }
  .el-radio__inner {
    border: none !important;
  }
  .el-radio__input.is-checked .el-radio__inner {
    background: transparent !important;
  }
}
</style>
