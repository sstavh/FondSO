<script setup lang="ts">
import BalanceCard from './UserInformationComponents/BalanceCard.vue';
import GoalTargetCard from './UserInformationComponents/GoalTargetCard.vue';
import LatestDealsCard from './UserInformationComponents/LatestDealsCard.vue';
import TransactionsCircleCard from './UserInformationComponents/TransactionsCircleCard.vue';
import TransactionTotalCard from './UserInformationComponents/TransactionTotalCard.vue';
import TrendingStocksCard from './UserInformationComponents/TrendingStocksCard.vue';


</script>


<template>
 <div class="container-box">
        <div class="box-one">
                <BalanceCard class="BalanceCard"/>
                 <TransactionsCircleCard class="TransactionsCircleCard"/>
        </div>
  <div class="box-tu">
         <GoalTargetCard class="GoalTargetCard "/>
  <LatestDealsCard class="LatestDealsCard"/>
  </div>
 
 
  <TransactionTotalCard class="TransactionTotalCard"/>
  <TrendingStocksCard class="TrendingStocksCard"/>
 </div>
</template>

<style scoped >
.box-one{
        display: flex;
        gap: 20px;
        padding-bottom: 20px;
}
.TransactionsCircleCard{
        flex: 1;
}
.box-tu{
        display: flex;
        gap: 20px;
        padding-bottom: 20px;
}

.TransactionTotalCard{
        margin-bottom: 20px;
        width: 1060px;
}
.TrendingStocksCard{
        width: 1085px;
        margin-bottom: 80px;
}
</style>