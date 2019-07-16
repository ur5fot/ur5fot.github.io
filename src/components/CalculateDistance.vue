<template>
    <div class="hello">
        <el-form ref="form">
            <el-form-item label="distance km">
                <el-input-number controls-position="right" :step="100" :min="0" v-model="distance"></el-input-number>
            </el-form-item>
            <el-form-item label="speed km/h">
                <el-input-number controls-position="right" :step="20" :min="0" v-model="speed"></el-input-number>
            </el-form-item>
        </el-form>
        <el-card class="result">
            <p v-if="!(time.years || time.months || time.weeks || time.days || time.hours || time.minutes)">Enter data and click enter, please</p>
            <p v-else>
                <span v-if="time.years">{{ time.years }} years </span>
                <span v-if="time.months">{{ time.months }} year </span>
                <span v-if="time.weeks">{{ time.weeks }} weeks </span>
                <span v-if="time.days"> {{time.days }} days </span>
                <span v-if="time.hours">{{ time.hours }} hours </span>
                <span v-if="time.minutes">{{ time.minutes }} minutes </span>
            </p>
        </el-card>
    </div>
</template>

<script lang="ts">
  import { Component, Vue } from "vue-property-decorator";
  import _ from "lodash";
  import * as moment from "moment";


  @Component({
    computed: {
      time(): object {
        let duration = moment.duration(_.round(this.distance / this.speed, 2), "hours");
        let minutes = duration.minutes();
        let hours = duration.hours();
        let days = duration.days();
        let weeks = duration.weeks();
        let months = duration.months();
        let years = duration.years();
        return { hours, days, weeks, months, years, minutes };
      }
    },
    functions: {}
  })
  export default class CalculateDistance extends Vue {
    distance: number = 0;
    speed: number = 80;
    hours: number = 0;
    days: number = 0;
    weeks: number = 0;
    months: number = 0;
    years: number = 0;
  }
</script>

<!-- Add "scoped" attribute to limit CSS to this component only -->
<style lang="scss">
    .el-form-item__label {
        float: none !important;
    }

    h3 {
        margin: 40px 0 0;
    }

    ul {
        list-style-type: none;
        padding: 0;
    }

    li {
        display: inline-block;
        margin: 0 10px;
    }

    a {
        color: #42b983;
    }
</style>
