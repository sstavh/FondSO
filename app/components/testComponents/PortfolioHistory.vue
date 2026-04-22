<script lang="ts" setup>
import LatestDealsCard from '../UserInformationComponents/LatestDealsCard.vue'
import TransactionTotalCard from '../UserInformationComponents/TransactionTotalCard.vue'
</script>

<template>
<LatestDealsCard class="LatestDealsCard"/>
<TransactionTotalCard class="TransactionTotalCard"/>
</template>

<style scoped>
.LatestDealsCard{
        width: 1085px;
        margin-bottom: 20px;
}
.TransactionTotalCard{
        margin-bottom: 20px;
        width: 1060px;
}

</style>