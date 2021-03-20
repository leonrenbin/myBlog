<template>
    <div class="footer">
        <ul>
            <li v-for="data in pageData" :key="data">{{ data }}</li>
        </ul>
        <p>广告位招租</p>
    </div>
</template>

<script>
export default {
    data(){
        return{
            pageData:['年轻人', '不讲武德', '我大意了', '没有闪', '来骗我', '偷袭我', '69岁', '老同志']
        }
    },
}
</script>

<style>
</style>