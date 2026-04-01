<script setup lang="ts">
import Header from '~/components/Header.vue';
import BalanceCard from '~/components/UserInformationComponents/BalanceCard.vue';
</script>

<template>
    <Header/>
    <main class="contaoner">
        <BalanceCard/>
    </main>
</template>

<style scoped>
.contaoner {padding-top: 30px;

  margin-left: 330px;
}
</style>