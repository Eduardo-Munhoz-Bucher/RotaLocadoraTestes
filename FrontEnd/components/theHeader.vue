<template>
  <v-app-bar flat color="#F0F0F0" height="58px">
    <img class="RotaLocadora" src="../assets/img/logo.png" alt="RotaLocadora" />
    <v-btn
      :class="{
        'active-btn': $route.path === '/veiculos',
        'cor-btn': $route.path !== '/veiculos',
      }"
      depressed
      color="#DFDFDF"
      to="/veiculos"
    >
      Veículos
    </v-btn>
    <v-btn
      :class="{
        'active-btn': $route.path === '/historico',
        'cor-btn': $route.path !== '/historico',
      }"
      depressed
      color="#DFDFDF"
      to="/historico"
    >
      Histórico de atividades
    </v-btn>

    <v-spacer></v-spacer>

    <div class="dados">
      <v-toolbar-title>
        Olá<br />
        <span>{{ userName }}</span>
      </v-toolbar-title>

      <v-menu bottom min-width="145px" rounded offset-y left>
        <template v-slot:activator="{ on }">
          <v-btn icon x-large v-on="on">
            <v-avatar size="50">
              <img
                src="../assets/img/user-286.png"
                alt="user"
                class="img-user"
              />
            </v-avatar>
          </v-btn>
        </template>
        <v-list>
          <v-list-item class="div-usuarios" link to="/usuarios">
            <v-list-item-title
              depressed
              text
              block
              class="item-usuarios"
              to="/usuarios"
              link
              >Usuários</v-list-item-title
            >
          </v-list-item>
          <v-list-item class="mx-auto div-sair" link @click="sair">
            <v-list-item-title depressed text block class="item-sair"
              ><img
                src="../assets/img/arrow-right-from-bracket.png"
                alt="sair"
                class="img-sair"
              />Sair</v-list-item-title
            >
          </v-list-item>
        </v-list>
      </v-menu>
    </div>
  </v-app-bar>
</template>

<script>
export default {
  name: "theHeader",
  data() {
    return {
      checkBtn: false,
    };
  },

  computed: {
    userName() {
      return this.$store.getters["auth/userName"];
    },
  },

  methods: {
    sair() {
      this.$store.commit("auth/logout");
      this.$router.push("/");
    },
  },
};
</script>

<style lang="scss" scoped>
.RotaLocadora {
  width: 188px;
  height: 38px;
}

::v-deep .v-btn {
  margin-left: 10px;
  font-size: 12px;
  font-family: "Roboto";
  font-weight: 700;
}

.active-btn {
  background-color: rgba(0, 125, 240, 0.1);
  color: $primary;
}

.cor-btn {
  background-color: #dfdfdf;
  color: #000;
}

.dados {
  display: flex;
}

.v-toolbar__title {
  font-size: 14px;
  font-weight: 400;
  font-family: "Roboto";
  margin-top: 4px;
}

.v-toolbar__title > span {
  font-weight: 700;
}

.div-usuarios {
  display: flex;
  justify-content: start;
  align-items: center;

  &:hover {
    background-color: #dfdfdf;
  }
}

.v-list .v-list-item--active {
  color: #FFF;
}

.item-usuarios {
  color: #000000;
  margin: 0;
  font-size: 14px;
  font-weight: 400;
  text-transform: none;
  letter-spacing: 1.2px;
  display: flex;
  justify-content: start;
}

.div-sair {
  display: flex;
  justify-content: start;
  align-items: center;

  &:hover {
    background-color: #dfdfdf;
  }
}

.theme--dark.v-card {
  background-color: #fff;
}

.img-sair {
  width: 13px;
  height: 15px;
  margin-right: 8px;
}

.item-sair {
  color: #e8363b;
  margin: 0;
  font-size: 14px;
  font-weight: 400;
  text-transform: none;
  letter-spacing: 1.2px;
  display: flex;
  justify-content: start;
}
</style>
