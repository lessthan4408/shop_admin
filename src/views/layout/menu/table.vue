<template >
  <div>
    <el-table
      :data="tableData"
      style="width: 100%"
      row-key="id"
      :tree-props="{ children: 'children', hasChildren: 'hasChildren' }"
    >
      <el-table-column label="名称" width="180" prop="title"> </el-table-column>

      <el-table-column label="图标" width="180">
        <template slot-scope="scope">
          <i :class="scope.row.icon"></i>
        </template>
      </el-table-column>

      <el-table-column label="类型">
        <template slot-scope="scope">
          <el-tag v-if="scope.row.type == 1">目录</el-tag>
          <el-tag v-else type="success">菜单</el-tag>
        </template>
      </el-table-column>

      <el-table-column prop="url" label="菜单URL" width="180">
      </el-table-column>

      <el-table-column label="操作">
        <template slot-scope="scope">
          <el-button @click="editFn(scope.row.id)">编辑</el-button>
          <el-button type="danger" @click="deleteFn(scope.row.id)"
            >删除</el-button
          >
        </template>
      </el-table-column>
    </el-table>
  </div>
</template>
<script>
export default {
  props: {
    tableData: Array,
  },
  methods: {
    editFn(id) {
      this.$emit("edit", id);
    },

    deleteFn(id) {
      this.$confirm("此操作将永久删除该菜单, 是否继续?", "", {
        confirmButtonText: "确定",
        cancelButtonText: "取消",
        type: "warning",
      })
        .then(async () => {
          let res = await this.$http.post("/api/menudelete", { id });
          if (res.code == 200) {
            this.$message.success("删除成功");
            this.$emit("del", res.list);
          }
        })
        .catch(() => {});
    },
  },
};
</script>