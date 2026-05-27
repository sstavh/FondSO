<script lang="ts" setup>
import auth from '~/components/LoginComponent/auth.vue';
</script>
<template>
  <section>
    <div class="container-login">
      <div class="login-box">
        <div class="lodin-box-text">

          <h3 class="box-text__title">До $500 вітального бонусу.<br/>
              Почни інвестувати в акції вже сьогодні</h3>
              <img class="box-text__img" src="../assets/imgs/golden-bitcoin-coin-ready-investment-financial-success-cryptocurrency-era.png" alt="Фото">

              <ul class="box-ul">
                <li class="box-li">
                  <img class="box-li__img" src="../assets/imgs/iconss/frea.png" alt="іконка">
                  <p class="ul-text">Бонус за реєстрацію + депозит</p>
                </li>
                <li class="box-li">
                  <img class="box-li__img" src="../assets/imgs/iconss/promo.png" alt="іконка">
                  <p class="ul-text">Безкоштовні акції (як Robinhood)</p>
                </li>
                <li class="box-li">
                  <img class="box-li__img" src="../assets/imgs/iconss/start.png" alt="іконка">
                  <p class="ul-text">Легкий старт для початківців</p>
                </li>
              </ul>
        </div>
        <auth class="ttt"/>
      </div>
    </div>
  </section>
</template>
<style scoped>
.container-login{
 display: flex;
 justify-content: center;  
 margin-top: 15%;
}

.login-box{
  display: flex;
  justify-content: center;
  align-items: center;

}

.ttt{
  margin-left: 20px;
}


.lodin-box-text{
  text-align: center;
  width: 600px;
}
.box-text__title{
  font-size:  var(--text-xl);
  text-align: center;
  inline-size: var(--leading-loose);
  
}

.box-text__img{
 width: 300px;
 height: 300px;
}

.box-ul{
  list-style: none;
  margin-left: 80px;
  text-align: start;
}

.box-li{
  display: flex;
  align-items: center;
  gap: 10px;
}
.box-li__img {
  width: 25px;
  height: 25px;
 filter: brightness(0) invert(1);
}
</style>