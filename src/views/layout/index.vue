<template >
  <div class="main">
    <el-row :gutter="20">
      <el-col :span="10" :offset="2">
        <div class="data_col">
          <h3 class="data_tit">商品总览</h3>
          <el-row>
            <el-col :span="6">
              <div>100</div>
              <div>已下架</div>
            </el-col>
            <el-col :span="6">
              <div>100</div>
              <div>已下架</div>
            </el-col>
            <el-col :span="6">
              <div>100</div>
              <div>已下架</div>
            </el-col>
            <el-col :span="6">
              <div>100</div>
              <div>已下架</div>
            </el-col>
          </el-row>
        </div>
      </el-col>
      <el-col :span="10">
        <div class="data_col">
          <h3 class="data_tit">用户总览</h3>
          <el-row>
            <el-col :span="6">
              <div>100</div>
              <div>已下架</div>
            </el-col>
            <el-col :span="6">
              <div>100</div>
              <div>已下架</div>
            </el-col>
            <el-col :span="6">
              <div>100</div>
              <div>已下架</div>
            </el-col>
            <el-col :span="6">
              <div>100</div>
              <div>已下架</div>
            </el-col>
          </el-row>
        </div>
      </el-col>
    </el-row>

    <div id="echart" class="echart"></div>
  </div>
</template>
<script>
import echarts from "echarts";
export default {
  mounted() {
    let mycharts = echarts.init(document.getElementById("echart"));

    let option = {
      title: {
        text: "仓储数据图",
        left: "30%",
      },
      legend: {
        data: ["销量", "进货量"],
      },
      tooltip: {},
      xAxis: {
        data: ["周一", "周二", "周三", "周四", "周五", "周六", "周日"],
        // boundaryGap: false,
      },
      yAxis: {
        max: 60,
        min: 0,
      },
      toolbox: {
        feature: {
          saveAsImage: {},
        },
      },

      series: [
        {
          name: "销量",
          type: "bar",
          data: [5, 20, 36, 10, 15, 20, 30],
        },
        {
          name: "进货量",
          type: "bar",
          data: [10, 10, 26, 15, 20, 50],
        },
      ],
    };
    mycharts.setOption(option);
  },
};
</script>
<style lang="stylus">
.main {
  .data_col {
    height: 150px;
    border: 1px solid #000;

    .data_tit {
      margin: 20px auto;
      padding: 0 20px;
    }

    .el-col {
      text-align: center;
    }
  }

  .echart {
    margin-top: 50px;
    width: 800px;
    height: 400px;
    margin-left: 200px;
  }
}
</style>