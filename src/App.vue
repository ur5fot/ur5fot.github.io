<template>
    <div id="app">
        <img src="./assets/logo.png">
        <div>
            <p>
                If Element is successfully added to this project, you'll see an
                <code v-text="'<el-button>'"></code>
                below
            </p>
            <el-button>el-button</el-button>
        </div>
        <!--<HelloWorld msg="Welcome to Your Vue.js App"/>-->

        <div class="block">
            <span class="demonstration">Default</span>
            <el-date-picker
                    v-model="value1"
                    type="date"
                    placeholder="Pick a day">
            </el-date-picker>
        </div>
        <div class="block">
            <span class="demonstration">Picker with quick options</span>
            <el-date-picker
                    v-model="value2"
                    type="date"
                    placeholder="Pick a day"
                    :picker-options="pickerOptions">
            </el-date-picker>
        </div>
    </div>


</template>

<style lang="scss">

</style>
