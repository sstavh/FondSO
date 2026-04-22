<script setup lang="ts">
import BalanceCard from '../UserInformationComponents/BalanceCard.vue';
import GoalTargetCard from '../UserInformationComponents/GoalTargetCard.vue';
</script>

<template>
    <div class="container-box">
            <div class="box-one">
                    <BalanceCard class="BalanceCard"/>
                    <GoalTargetCard class="GoalTargetCard"/>
            </div>
    </div>
</template>
<style scoped > 
.box-one{
        display: flex;
        gap: 20px;
        padding-bottom: 20px;
}
.BalanceCard{
        flex: 1;
}
.GoalTargetCard{
        flex: 1;
}   


</style>