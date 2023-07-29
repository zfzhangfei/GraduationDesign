<template>
    <div>
        <h3>分数：{{score}}</h3>
    </div>
</template>
<script>
export default {
  data() {
    return{
      score:this.$route.query.score,
    }
  },
}
</script>