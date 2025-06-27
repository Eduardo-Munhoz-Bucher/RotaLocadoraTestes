<template>
  <v-row>
    <v-col cols="12">
      <TheHeader />

      <v-container fluid data-app class="container-filtros">
        <filterVeiculos
          :mostrarPropUso="false"
          :mostrarMarcas="false"
          @aplicar-filtros="aplicarFiltros"
          @limpar-filtros="limparFiltros"
        />
      </v-container>

      <v-card class="tabela-historico">
        <v-simple-table>
          <template v-slot:default>
            <tbody v-for="historico in paginatedHistorico" :key="historico.id">
              <tr v-if="historico.tipo_alteracao === 'Criação'">
                <td>
                  <div>
                    <img
                      class="icones-historico"
                      src="../assets/img/plus-solid.png"
                      alt="icone-criar"
                    />
                  </div>
                  <span>
                    Veículo <strong>{{ historico.placa }}</strong> CADASTRADO em
                    {{ formatData(historico.data_hora) }}
                  </span>
                </td>
              </tr>
              <tr v-if="historico.tipo_alteracao === 'Edição'">
                <td>
                  <div>
                    <img
                      class="icones-historico"
                      src="../assets/img/pen-solid.png"
                      alt="icone-editar"
                    />
                  </div>
                  <span>
                    Veículo <strong>{{ historico.placa }}</strong> EDITADO em
                    {{ formatData(historico.data_hora) }}
                  </span>
                </td>
              </tr>
              <tr v-if="historico.tipo_alteracao === 'Exclusão'">
                <td>
                  <div>
                    <img
                      class="icones-historico"
                      src="../assets/img/trash-solid.png"
                      alt="icone-lixeira"
                    />
                  </div>
                  <span>
                    Veículo <strong>{{ historico.placa }}</strong> DELETADO em
                    {{ formatData(historico.data_hora) }}
                  </span>
                </td>
              </tr>
            </tbody>
          </template>
        </v-simple-table>
        <div v-if="historico.length === 0" class="semHistorico">
          <p class="mb-0">Nenhum histórico encontrado</p>
        </div>
      </v-card>
      <v-footer>
        <div class="text-center">
          <v-pagination
            v-model="pagAtual"
            :length="pagTotal"
            @input="getHistorico"
            color="#3366CC"
          ></v-pagination>
        </div>
      </v-footer>
    </v-col>
  </v-row>
</template>

<script>
import theHeader from "../components/theHeader.vue";
import filterVeiculos from "~/components/filterVeiculos.vue";

export default {
  middleware: "auth",
  components: {
    theHeader,
    filterVeiculos,
  },
  name: "historico",
  data() {
    return {
      pagAtual: 1,
      historicoPorPag: 10,
      historico: [],
      filtroPlaca: "",
    };
  },

  computed: {
    paginatedHistorico() {
      const start = (this.pagAtual - 1) * this.historicoPorPag;
      return this.historico.slice(start, start + this.historicoPorPag);
    },
    pagTotal() {
      return Math.ceil(this.historico.length / this.historicoPorPag);
    },
  },

  methods: {
    limparFiltro() {
      this.filtroPlaca = "";
      this.getHistorico();
    },

    visibilidadeFiltro() {
      this.visibilidade = !this.visibilidade;
    },

    ajustarItensPorPagina() {
      const altura = window.innerHeight;
      if (altura >= 900) {
        this.historicoPorPag = 12;
      } else if (altura >= 695) {
        this.historicoPorPag = 10;
      } else if (altura >= 600) {
        this.historicoPorPag = 8;
      } else {
        this.historicoPorPag = 6;
      }
    },

    async getHistorico() {
      try {
        const response = await this.$veiculoService.getHistorico();
        this.historico = response.data;
      } catch (error) {
        console.error("Erro ao buscar histórico: ", error);
      }
    },

    formatData(dateString) {
      const date = new Date(dateString);
      const dtFormatada = date.toLocaleDateString();
      const hrFormatada = date.toLocaleTimeString();
      return `${dtFormatada} às ${hrFormatada}`;
    },

    async filtrarVeiculos() {
      try {
        const params = {};
        if (this.filtroPlaca.trim()) {
          params.placa = this.filtroPlaca.trim();
        }
        const response = await this.$axios.get("historico", { params });
        this.historico = response.data;
        this.pagAtual = 1; // Reseta para a primeira página
      } catch (error) {
        this.$toast.error("Erro ao filtrar veículos");
        console.error("Erro ao filtrar histórico: ", error);
      }
    },

    aplicarFiltros(filtros) {
      this.filtroPlaca = filtros.placa || "";
      this.filtrarVeiculos();
    },

    limparFiltros() {
      this.filtroPlaca = "";
      this.getHistorico();
    },
  },

  mounted() {
    this.getHistorico();

    this.ajustarItensPorPagina();

    window.addEventListener("resize", this.ajustarItensPorPagina);
  },

  beforeDestroy() {
    window.removeEventListener("resize", this.ajustarItensPorPagina);
  },
};
</script>

<style scoped>
.container-filtros {
  display: flex;
  align-items: center;
  padding: 0 12px;
}

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
  margin-right: 40px;
  transition: 0.5ms;
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

.btn-toClose {
  margin: 30px 15px 10px 0;
}

.btn-cadastro-veiculo {
  padding: 10px !important;
  font-size: 14px;
  font-family: "Roboto";
  color: #fff;
  margin-left: 15px;
}

::v-deep .v-input__slot {
  margin-top: 20px;
  padding: 0;
}

::v-deep .v-input__control {
  width: 50px !important;
}

::v-deep .v-select__sloot {
  height: 40px !important;
}

.v-chip {
  height: 20px;
  font-size: 12px;
  font-family: "Roboto";
  font-weight: 400;
}

::v-deep .v-text-field input {
  font-family: "Roboto";
  font-size: 12px !important;
  font-weight: 400;
}

::v-deep .v-select__selection {
  font-size: 14px;
  font-family: "Roboto";
}

::v-deep .menuable__content__active {
  transform: translateY(28px);
}

.v-select-list {
  background-color: #fff;
}

::v-deep .v-list-item__action {
  margin: 0 !important;
}

::v-deep .v-list-item {
  color: #333333;
}

::v-deep .theme--dark.v-icon {
  color: #a9a7a9;
}

::v-deep .v-list .v-list-item--active .v-icon {
  color: #3366cc !important;
}

::v-deep .v-list-item__title {
  color: #333333;
  padding-left: 5px;
}

.icone-deletar {
  padding-left: 5px;
}

.tabela-historico {
  margin: 0 25px;
}

td {
  color: #333333;
  font-size: 12px !important;
  font-family: "Roboto";
  font-weight: 400;
  border-bottom: 1px solid #dfdfdf;
  display: flex;
  align-items: center;
}

.icones-historico {
  width: 20px;
  height: 20px;
  margin-right: 15px;
  margin-top: 4px;
}

.semHistorico {
  display: flex;
  justify-content: center;
  align-items: center;
  height: 48px;
  color: rgba(128, 128, 128, 0.637);
  font-family: "Roboto";
  font-size: 14px;
}

.v-footer {
  background-color: #fff;
  display: flex;
  justify-content: center;
  position: fixed;
  bottom: 20px;
  left: 50%;
  transform: translateX(-50%);
}

::v-deep .v-pagination > li {
  font-family: "Roboto";
  font-weight: 400;
}
</style>
