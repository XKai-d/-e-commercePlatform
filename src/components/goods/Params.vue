<template>
  <div>
    <!-- 卡片视图 -->
    <el-card>
      <el-alert
        title="注意：只允许为第三级分类设置相关参数！"
        type="warning"
        show-icon
        :closable="false"
      >
      </el-alert>
      <el-row style="margin-top: 15px">
        <el-col>
          <!-- options绑定数据源 -->
          <!-- props指定配置项 -->
          <el-form>
            <el-form-item label="选择商品分类：">
              <el-cascader
                expand-trigger="hover"
                v-model="checkcascader"
                :options="catalist"
                :props="propscas"
                @change="checkCateCas()"
                clearable
              ></el-cascader>
            </el-form-item>
          </el-form>
        </el-col>
        <el-col>
          <!-- tabs标签区 -->
          <template>
            <el-tabs v-model="tabsAvtiveName" @tab-click="handleTabsClick">
              <el-tab-pane label="动态参数" name="many">
                <!-- 添加动态参数 -->
                <el-button
                  type="primary"
                  size="mini"
                  :disabled="isBtnDiabled"
                  @click="dialogParamsDataAdd = true"
                  >添加参数</el-button
                >
                <!-- 动态参数数据展示 -->
                <template>
                  <el-table :data="paramslist" border stripe="">
                    <el-table-column type="expand">
                      <!-- 动态参数可选项 -->
                      <template slot-scope="scope">
                        <div style="width: 92%; margin: auto">
                          <el-tag
                            :key="i"
                            v-for="(item, i) in scope.row.attr_vals"
                            closable
                            :disable-transitions="false"
                            @close="btnParamsValsDelete(scope.row, item)"
                          >
                            {{ item }}
                          </el-tag>
                          <el-input
                            class="input-new-tag"
                            v-if="scope.row.addTagInputShow"
                            v-model="scope.row.addTagValue"
                            ref="saveTagInput"
                            size="small"
                            @keyup.enter.native="btnParamsValsAdd(scope.row)"
                            @blur="btnParamsValsAdd(scope.row)"
                          >
                          </el-input>
                          <el-button
                            v-else
                            class="button-new-tag"
                            size="small"
                            @click="showInput(scope.row)"
                            >+ New Tag</el-button
                          >
                        </div>
                      </template>
                    </el-table-column>
                    <el-table-column type="index" label="#"> </el-table-column>
                    <el-table-column label="参数名称" prop="attr_name">
                    </el-table-column>
                    <el-table-column label="操作">
                      <template slot-scope="scope">
                        <!-- 修改按钮 -->
                        <el-button
                          type="success"
                          size="mini"
                          icon="el-icon-edit"
                          @click="btnParamsDataEdit(scope.row.attr_id)"
                          >编辑</el-button
                        >
                        <!-- 删除按钮 -->
                        <el-button
                          type="danger"
                          size="mini"
                          icon="el-icon-delete"
                          @click="btnParamsDelete(scope.row.attr_id)"
                          >删除</el-button
                        >
                      </template>
                    </el-table-column>
                  </el-table>
                </template>
              </el-tab-pane>
              <el-tab-pane label="静态属性" name="only">
                <!-- 添加静态属性 -->
                <el-button
                  type="primary"
                  size="mini"
                  :disabled="isBtnDiabled"
                  @click="dialogParamsDataAdd = true"
                  >添加属性</el-button
                >
                <!-- 静态属性数据展示 -->
                <template>
                  <el-table :data="propertylist" border stripe="">
                    <el-table-column type="expand">
                      <!-- 静态属性可选项 -->
                      <template slot-scope="scope">
                        <div style="width: 92%; margin: auto">
                          <el-tag
                            :key="i"
                            v-for="(item, i) in scope.row.attr_vals"
                            closable
                            :disable-transitions="false"
                            @close="btnParamsValsDelete(scope.row, item)"
                          >
                            {{ item }}
                          </el-tag>
                          <el-input
                            class="input-new-tag"
                            v-if="scope.row.addTagInputShow"
                            v-model="scope.row.addTagValue"
                            ref="saveTagInput"
                            size="small"
                            @keyup.enter.native="btnParamsValsAdd(scope.row)"
                            @blur="btnParamsValsAdd(scope.row)"
                          >
                          </el-input>
                          <el-button
                            v-else
                            class="button-new-tag"
                            size="small"
                            @click="showInput(scope.row)"
                            >+ New Tag</el-button
                          >
                        </div>
                      </template>
                    </el-table-column>
                    <el-table-column type="index" label="#"> </el-table-column>
                    <el-table-column label="参数名称" prop="attr_name">
                    </el-table-column>
                    <el-table-column label="操作">
                      <template slot-scope="scope">
                        <!-- 修改按钮 -->
                        <el-button
                          type="success"
                          size="mini"
                          icon="el-icon-edit"
                          @click="btnParamsDataEdit(scope.row.attr_id)"
                          >编辑</el-button
                        >
                        <!-- 删除按钮 -->
                        <el-button
                          type="danger"
                          size="mini"
                          icon="el-icon-delete"
                          @click="btnParamsDelete(scope.row.attr_id)"
                          >删除</el-button
                        >
                      </template>
                    </el-table-column>
                  </el-table>
                </template>
              </el-tab-pane>
            </el-tabs>
          </template>
        </el-col>
      </el-row>
      <!-- 添加动态参数,静态属性Dialog -->
      <el-dialog
        :title="'添加' + titleText"
        :visible.sync="dialogParamsDataAdd"
        width="40%"
        @close="dialogParamsClose('addFromParamsRef')"
      >
        <el-form
          :model="addFromParams"
          :rules="paramsDataRules"
          ref="addFromParamsRef"
        >
          <el-form-item :label="titleText" label-width="100px" prop="attr_name">
            <el-input v-model="addFromParams.attr_name"></el-input>
          </el-form-item>
        </el-form>
        <span slot="footer" class="dialog-footer">
          <el-button @click="dialogParamsDataAdd = false">取 消</el-button>
          <el-button type="primary" @click="btnParamsDataAdd()"
            >确 定</el-button
          >
        </span>
      </el-dialog>
      <!-- 修改动态参数,静态属性Dialog -->
      <el-dialog
        :title="'编辑' + titleText"
        :visible.sync="dialogParamsDataEdit"
        width="40%"
        @close="dialogParamsClose('editformParamsRef')"
      >
        <el-form
          :model="editformParams"
          ref="editformParamsRef"
          :rules="editformParamsRules"
        >
          <el-form-item :label="titleText" label-width="100px" prop="attr_name">
            <el-input v-model="editformParams.attr_name"></el-input>
          </el-form-item>
        </el-form>

        <span slot="footer" class="dialog-footer">
          <el-button @click="dialogParamsDataEdit = false">取 消</el-button>
          <el-button type="primary" @click="ParamsDataEdit()">确 定</el-button>
        </span>
      </el-dialog>
    </el-card>
  </div>
</template>
<script>
export default {
  data() {
    return {
      // 商品分类列表
      catalist: [],
      // 动态参数列表
      paramslist: [],
      // 静态属性列表
      propertylist: [],
      // 联级选择器选中的数据
      checkcascader: [],
      // 控制动态参数添加，静态属性添加Dialog显示隐藏
      dialogParamsDataAdd: false,
      // 控制动态参数,静态属性修改Dialog显示隐藏
      dialogParamsDataEdit: false,
      // tabs默认选项
      tabsAvtiveName: 'many',
      // 添加参数表单值
      addFromParams: {
        attr_name: '',
      },
      // 修改参数表单值
      editformParams: {
        attr_id: '',
        attr_name: '',
      },
      // 级联选择配置
      propscas: {
        value: 'cat_id',
        label: 'cat_name',
        children: 'children',
      },
      paramsDataRules: {
        attr_name: [{ required: true, message: '请输入名称', trigger: 'blur' }],
      },
      editformParamsRules: {
        attr_name: [{ required: true, message: '请输入名称', trigger: 'blur' }],
      },
    }
  },
  created() {
    this.getcarelist()
  },
  methods: {
    // 初始化商品分类数据
    async getcarelist() {
      const { data: res } = await this.$http.get('categories', {
        params: { type: 3 },
      })
      if (res.meta.status !== 200) {
        this.$message.error('初始化数据获取失败')
      } else {
        this.catalist = res.data
        this.$message.success('初始化成功')
      }
    },
    // 联级菜单选中值改变事件，联级查询相关分类的静态参数和静态属性列表
    checkCateCas() {
      this.selectParamsData()
    },
    // 查询指定的动态参数或静态属性列表
    async selectParamsData() {
      if (this.checkcascader.length === 3) {
        const { data: res } = await this.$http.get(
          `categories/${this.cataId}/attributes`,
          { params: { sel: this.tabsAvtiveName } }
        )
        if (res.meta.status !== 200) {
          this.$message.error(res.meta.msg)
        } else {
          res.data.forEach((item) => {
            item.attr_vals = item.attr_vals ? item.attr_vals.split(' ') : []
            // 控制可选项添加input的显示和隐藏
            item.addTagInputShow = false
            // 绑定文本输入的数据
            item.addTagValue = ''
          })
          if (this.tabsAvtiveName === 'many') {
            this.paramslist = res.data
          } else {
            this.propertylist = res.data
          }
          this.$message.success(res.meta.msg)
        }
      } else {
        this.checkcascader = []
        this.paramslist = []
        this.propertylist = []
      }
    },
    // 监听：Tabs切换
    handleTabsClick() {
      this.selectParamsData()
    },
    // 监听：对话框关闭事件
    dialogParamsClose(ref) {
      this.$refs[ref].resetFields()
      this.addFromParams.attr_name = ''
      this.editformParams.attr_id = ''
      this.editformParams.attr_name = ''
    },
    // 动态参数,静态属性添加
    btnParamsDataAdd() {
      this.$refs.addFromParamsRef.validate(async (result) => {
        if (result) {
          const { data: res } = await this.$http.post(
            `categories/${this.cataId}/attributes`,
            {
              attr_name: this.addFromParams.attr_name,
              attr_sel: this.tabsAvtiveName,
            }
          )
          if (res.meta.status !== 201) {
            this.$message.error(res.meta.msg)
          } else {
            this.selectParamsData()
            this.dialogParamsDataAdd = false
            this.$message.success('添加成功')
          }
        }
      })
    },
    // 动态参数,静态属性修改数据获取
    async btnParamsDataEdit(paramsid) {
      const { data: res } = await this.$http.get(
        `categories/${this.cataId}/attributes/${paramsid}`
      )
      if (res.meta.status !== 200) {
        this.$message.error(res.meta.msg)
      } else {
        this.editformParams.attr_id = res.data.attr_id
        this.editformParams.attr_name = res.data.attr_name
        this.dialogParamsDataEdit = true
      }
    },
    // 动态参数，静态属性修改后保存
    ParamsDataEdit() {
      this.$refs.editformParamsRef.validate(async (result) => {
        if (result) {
          const { data: res } = await this.$http.put(
            `categories/${this.cataId}/attributes/${this.editformParams.attr_id}`,
            {
              attr_name: this.editformParams.attr_name,
              attr_sel: this.tabsAvtiveName,
            }
          )
          if (res.meta.status !== 200) {
            this.$message.error(res.meta.msg)
          } else {
            this.selectParamsData()
            this.dialogParamsDataEdit = false
            this.$message.success(res.meta.msg)
          }
        }
      })
    },
    // 删除动态参数,静态属性
    async btnParamsDelete(paramsid) {
      const result = await this.$messagebox
        .confirm('此操作将永久删除该参数, 是否继续?', '提示', {
          confirmButtonText: '确定',
          cancelButtonText: '取消',
          type: 'warning',
        })
        .catch((err) => err)
      if (result === 'confirm') {
        const { data: res } = await this.$http.delete(
          `categories/${this.cataId}/attributes/${paramsid}`
        )
        if (res.meta.status !== 200) {
          this.$message.error(res.meta.msg)
        } else {
          this.selectParamsData()
          this.$message.success(res.meta.msg)
        }
      } else {
        this.$message({
          type: 'info',
          message: '已取消删除',
        })
      }
    },
    // 可选项的添加
    async btnParamsValsAdd(rowdata) {
      if (rowdata.addTagValue.trim().length === 0) {
        rowdata.addTagInputShow = false
        rowdata.addTagValue = ''
      } else {
        rowdata.attr_vals.push(rowdata.addTagValue)
        this.setValsValueEdit(rowdata)
      }
      rowdata.addTagInputShow = false
      rowdata.addTagValue = ''
    },
    // 可选项的删除
    btnParamsValsDelete(rowdata, vals) {
      rowdata.attr_vals.splice(rowdata.attr_vals.indexOf(vals), 1)
      this.setValsValueEdit(rowdata)
    },
    // 可选项的修改提交
    async setValsValueEdit(rowdata) {
      const valsValue = rowdata.attr_vals.join(' ')
      const { data: res } = await this.$http.put(
        `categories/${this.cataId}/attributes/${rowdata.attr_id}`,
        {
          attr_name: rowdata.attr_name,
          attr_sel: rowdata.attr_sel,
          attr_vals: valsValue,
        }
      )
      if (res.meta.status !== 200) {
        this.$message.error(res.meta.msg)
      } else {
        this.$message.success('修改成功')
      }
    },
    // 添加可选项input显示和隐藏
    showInput(rowdata) {
      rowdata.addTagInputShow = true
      // 让文本框自动获取焦点
      // $nextTick当页面中的元素重新渲染之后，才会触发回调函数中的代码
      this.$nextTick((_) => {
        this.$refs.saveTagInput.$refs.input.focus()
      })
    },
  },
  computed: {
    // 如果按钮需要被禁用则返回true，否则返回false
    isBtnDiabled() {
      if (this.checkcascader.length !== 3) {
        return true
      } else {
        return false
      }
    },
    // 动态获取商品分类
    cataId() {
      if (this.checkcascader.length === 3) {
        return this.checkcascader[this.checkcascader.length - 1]
      } else {
        return null
      }
    },
    // 动态获取参数或属性的展示
    titleText() {
      if (this.tabsAvtiveName === 'only') {
        return '静态属性'
      } else {
        return '动态参数'
      }
    },
  },
}
</script>

<style lang="less" scoped>
.el-tag {
  margin-left: 15px;
  margin-top: 10px;
}
.button-new-tag {
  margin-left: 15px;
  height: 32px;
  line-height: 30px;
  padding-top: 0;
  padding-bottom: 0;
}
.input-new-tag {
  width: 120px;
  margin-left: 10px;
  vertical-align: bottom;
}
</style>
