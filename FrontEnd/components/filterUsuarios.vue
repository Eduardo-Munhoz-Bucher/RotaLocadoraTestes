<template>
  <v-row>
    <v-col cols="12" class="alinhamento-filtros">
      <div class="visibilidade">
        <v-col cols="1" class="buttons mr-6">
          <div>
            <v-btn
              color="secondary"
              elevation="1"
              outlined
              class="btn-left"
              width="60"
              height="40"
              @click="filtrarUsuarios"
            >
              <img src="../assets/img/magnifying-glass.png" alt="icone-lupa" />
            </v-btn>
            <v-btn
              color="secondary"
              elevation="1"
              outlined
              class="btn-right"
              width="60"
              height="40"
              @click="limparFiltro"
            >
              <img src="../assets/img/erase.png" alt="icone-limpar" />
            </v-btn>
          </div>
        </v-col>
        <v-col cols="3">
          <v-text-field
            type="text"
            v-model="filtroUsuario"
            label="Usuário"
            placeholder="Digite o usuário"
            persistent-placeholder
            outlined
            dense
            hide-details
          >
          </v-text-field>
        </v-col>
        <v-spacer></v-spacer>
      </div>
    </v-col>
  </v-row>
</template>

<script>
export default {
  data() {
    return {
      filtroUsuario: "",
    };
  },

  methods: {
    limparFiltro() {
      this.filtroUsuario = "";
      this.$emit("limpar-filtros");
    },

    filtrarUsuarios() {
      const filtros = {
        nome_user: this.filtroUsuario,
      };

      this.$emit("aplicar-filtros", filtros);
    },
  },
};
</script>

<style scoped>
.row {
  height: 80px;
  margin-bottom: 5px;
}

.alinhamento-filtros {
  display: flex;
  flex-direction: row-reverse;
  padding: 0 12px;
}

.visibilidade {
  display: flex;
  flex-direction: row-reverse;
  width: 100%;
  margin-right: 38px;
  transition: 0.5ms;
}

@media screen and (max-width: 1500px) {
  .visibilidade {
    margin-right: 60px;
  }
}

@media screen and (max-width: 1250px) {
  .visibilidade {
    margin-right: 80px;
  }
}

.buttons {
  display: flex;
  flex-direction: column;
  justify-content: center;
  margin-top: 18px;
}

.buttons div {
  width: 150px;
}

.btn-left {
  border-radius: 5px 0 0 5px;
  border: 1px solid #dfdfdf;
}

.btn-right {
  border-radius: 0 5px 5px 0;
  border: 1px solid #dfdfdf;
  transform: translateX(-5px);
}

::v-deep .v-text-field input {
  font-family: "Roboto";
  font-size: 12px !important;
  font-weight: 400;
}

::v-deep .v-input__slot {
  margin-top: 20px;
  padding: 0;
}
</style>