<script setup lang="ts">
import TrendingStocksCard from '../UserInformationComponents/TrendingStocksCard.vue';
import GoalTargetCard from '../UserInformationComponents/GoalTargetCard.vue';
</script>
<template>
     <GoalTargetCard class="GoalTargetCard "/>
     <TrendingStocksCard class="TrendingStocksCard"/>
</template>

<style scoped>  
.GoalTargetCard{
        width: 1085px;
        margin-bottom: 20px;
}
.TrendingStocksCard{
        width: 1085px;
        margin-bottom: 80px;
}

</style>