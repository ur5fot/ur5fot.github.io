<template>
    <div class="hello">
        <el-form ref="form">
            <el-form-item label="Distance 'km'">
                <el-input-number :step="100" :min="0" v-model="distance"></el-input-number>
            </el-form-item>
            <el-form-item label="Speed 'km/h'">
                <el-input-number :step="20" :min="0" v-model="speed"></el-input-number>
            </el-form-item>
            <el-form-item>
                <el-radio v-model="mode" label="Comfort">Comfort</el-radio>
                <el-radio v-model="mode" label="Extreme">Extreme</el-radio>
            </el-form-item>
        </el-form>
        <el-card class="result">
            <div v-if="!(time.years || time.months || time.weeks || time.days || time.hours || time.minutes)">Enter data and click enter, please</div>
            <div v-else>
                <p>
                    <span v-if="time.years">{{ time.years }} years, </span>
                    <span v-if="time.months">{{ time.months }} months, </span>
                    <span v-if="time.days"> {{ time.days }} days, </span>
                    <span v-if="time.hours">{{ time.hours }} hours, </span>
                    <span v-if="time.minutes">{{ time.minutes }} minutes </span>
                </p>
                <p v-if="mode === 'Comfort'">
                    <span v-if="holiday">{{ holiday * 2 }} holiday, </span>
                    <span v-if="slips">{{ slips }} slips, </span>
                    <span v-if="stops">{{ stops }} stops </span>
                </p>
                <p v-if="mode === 'Extreme'">Non stopping</p>
            </div>
        </el-card>
    </div>
</template>

<script lang="ts">
  import { Component, Vue } from "vue-property-decorator";
  import _ from "lodash";
  import * as moment from "moment";


  @Component({
    computed: {
      time(): any {
        let duration = this.duration(this.distance, this.speed);
        let minutes = duration.minutes();
        let hours = duration.hours();
        let days = duration.days();
        let months = duration.months();
        let years = duration.years();
        return { hours, days, months, years, minutes };
      }
    },
    methods: {
      duration(distance, speed): moment {
        let timeH = this.mode === "Extreme"? this.computedExtreme(distance, speed): this.computedComfort(distance, speed);
        return moment.duration(timeH, "hours");
      },
      computedExtreme(distance: number, speed: number): number {
        return _.round(distance / speed, 3);
      },
      computedComfort(distance: number, speed: number): number {
        let timeH = _.round(distance / speed, 3);

        if ( timeH > 4.5 + 2 ) {
          let stopsTimeH = 1;
          this.stops = _.floor(timeH / 4.5);
          timeH += this.stops * stopsTimeH;

        }

        if ( timeH > 13 ) {
          let slipsTimeH = 14;
          this.slips = _.floor(timeH / ( 4.5 + 1 + 4.5 + 1 ));
          timeH += this.slips * slipsTimeH;
        }

        if ( moment.duration(timeH, "hours").asDays() > 6 ) {
          let holidayTimeH = 48;
          this.holiday = _.floor(timeH / ( 5 * 24 ));
          timeH += this.holiday * holidayTimeH;
        }

        return timeH;
      }
    }
  })
  export default class CalculateDistance extends Vue {
    distance: number = 0;
    speed: number = 80;
    mode: string = "Comfort";
    stops: number = 0;
    slips: number = 0;
    holiday: number = 0;

  }
</script>

<style lang="scss">

</style>
