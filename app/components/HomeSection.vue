<script setup lang="ts">

import BalanceCard from '~/components/UserInformationComponents/BalanceCard.vue';
import TransactionTotalCard from './UserInformationComponents/TransactionTotalCard.vue';
import TransactionsCircleCard from './UserInformationComponents/TransactionsCircleCard.vue';
import GoalTargetCard from './UserInformationComponents/GoalTargetCard.vue';
import TrendingStocksCard from './UserInformationComponents/TrendingStocksCard.vue';
import LatestDealsCard from './UserInformationComponents/LatestDealsCard.vue';
</script>


<template>
       <!---- <div class="tt">
         <BalanceCard class="ttB"/>
        <TransactionTotalCard/>
</div>
<TransactionsCircleCard/>
<GoalTargetCard/>
<TrendingStocksCard/>-->
<LatestDealsCard      />                

</template>

<style scoped>
.ttB{
        width: 870px;
        height: 300px;
}
.tt {
  display: flex;
  gap: 15px;
}
</style>