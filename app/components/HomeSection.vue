<script setup lang="ts">

import BalanceCard from '~/components/UserInformationComponents/BalanceCard.vue';
import TransactionTotalCard from './UserInformationComponents/TransactionTotalCard.vue';
</script>


<template>
        <div class="tt">
         <BalanceCard class="ttB"/>
        <TransactionTotalCard/>
</div>
       

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