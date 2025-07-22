<template>
  <v-row>
    <v-col cols="12">
      <TheHeader />

      <v-container fluid data-app class="container-filtros">
        <v-btn
          class="btn-cadastro-veiculo"
          color="primary"
          @click="modal = true"
        >
          Cadastrar Veículo
        </v-btn>
        <modalCadastroVeiculo
          v-if="modal"
          @fechaModal="modal = false"
          @veiculoCadastrado="atualizarVeiculos"
        />

        <filterVeiculos
          :mostrarPropUso="true"
          :mostrarMarcas="true"
          @aplicar-filtros="aplicarFiltros"
          @limpar-filtros="limparFiltros"
        />
      </v-container>

      <v-card v-if="loading" class="tabela-veiculos">
        <v-simple-table>
          <template v-slot:default>
            <thead>
              <tr>
                <th>Placa</th>
                <th>Marca/Modelo</th>
                <th>Ano</th>
                <th>Cor</th>
                <th>Propósito de uso</th>
                <th>Zero-quilômetro?</th>
                <th>Nivel de conforto</th>
                <th>Local de repouso (lat,long)</th>
                <th class="icon"></th>
              </tr>
            </thead>
          </template>
        </v-simple-table>
        <v-progress-linear indeterminate color="primary"></v-progress-linear>
        <div class="buscando">
          <p class="mb-0">Buscando...</p>
        </div>
      </v-card>

      <v-card v-else class="tabela-veiculos">
        <v-data-table
          :headers="headers"
          :items="paginatedVeiculo"
          hide-default-footer
        >
          <template v-slot:body="{ items }">
            <tbody>
              <tr v-for="veiculo in items" :key="veiculo.id">
                <td>{{ veiculo.placa }}</td>
                <td>{{ veiculo.marca }} {{ veiculo.modelo }}</td>
                <td>{{ veiculo.ano }}</td>
                <td>{{ veiculo.cor }}</td>
                <td>{{ veiculo.proposito_uso }}</td>
                <td>{{ veiculo.veiculo_zero === 0 ? "Não" : "Sim" }}</td>
                <td class="conforto">
                  {{ veiculo.conforto }}
                  <img
                    src="~/assets/img/star-solid.png"
                    alt="star-solid"
                    width="20"
                    height="19"
                    class="star"
                  />
                </td>
                <td>{{ veiculo.latitude }}, {{ veiculo.longitude }}</td>
                <td>
                  <v-list-item-action class="d-flex justify-end mr-0">
                    <dropdownVeiculos
                      :veiculo="veiculo"
                      :id="veiculo.id"
                      :atualizarVeiculos="getVeiculos"
                    />
                  </v-list-item-action>
                </td>
              </tr>
            </tbody>
          </template>
        </v-data-table>

        <div v-if="veiculos.length === 0" class="semVeiculo">
          <p class="mb-0">Nenhum veículo encontrado</p>
        </div>
      </v-card>
      <v-footer>
        <div class="text-center">
          <v-pagination
            v-model="pagAtual"
            :length="pagTotal"
            @input="getVeiculos"
            color="#3366CC"
          ></v-pagination>
        </div>
      </v-footer>
    </v-col>
  </v-row>
</template>

<script>
import dropdownVeiculos from "~/components/veiculos/dropdownVeiculos.vue";
import theHeader from "~/components/theHeader.vue";
import modalCadastroVeiculo from "~/components/veiculos/modalVeiculo/modalCadastroVeiculo.vue";
import filterVeiculos from "~/components/veiculos/filterVeiculos.vue";

export default {
  middleware: "auth",
  components: {
    theHeader,
    dropdownVeiculos,
    modalCadastroVeiculo,
    filterVeiculos,
  },
  name: "veiculos",
  data() {
    return {
      pagAtual: 1,
      veiculoPorPag: 9,
      modal: false,
      loading: true,
      dialog: false,
      veiculos: [],
      headers: [
        { text: "Placa", value: "placa" },
        { text: "Marca/Modelo", value: "marca_modelo" },
        { text: "Ano", value: "ano" },
        { text: "Cor", value: "cor" },
        { text: "Propósito de uso", value: "proposito_uso" },
        { text: "Zero-quilômetro?", value: "veiculo_zero" },
        { text: "Nível de conforto", value: "conforto" },
        { text: "Local de repouso (lat,long)", value: "localizacao" },
        { text: "", sortable: false },
      ],
      filtroPlaca: "",
      filtroProp: "",
      filtroMarcas: [],
    };
  },

  computed: {
    paginatedVeiculo() {
      const start = (this.pagAtual - 1) * this.veiculoPorPag;
      return this.veiculos.slice(start, start + this.veiculoPorPag);
    },
    pagTotal() {
      return Math.ceil(this.veiculos.length / this.veiculoPorPag);
    },
  },

  methods: {
    ajustarItensPorPagina() {
      const altura = window.innerHeight;
      if (altura >= 900) {
        this.veiculoPorPag = 12;
      } else if (altura >= 695) {
        this.veiculoPorPag = 9;
      } else if (altura >= 600) {
        this.veiculoPorPag = 7;
      } else {
        this.veiculoPorPag = 5;
      }
    },

    async getVeiculos() {
      try {
        const response = await this.$veiculoService.getVeiculos();
        this.veiculos = response;
      } catch (error) {
        console.error("Erro ao buscar veículos: ", error);
      } finally {
        this.loading = false;
      }
    },

    async atualizarVeiculos() {
      this.loading = true;
      await this.getVeiculos();
    },

    limparFiltros() {
      this.filtroPlaca = "";
      this.filtroProp = "";
      this.filtroMarcas = [];
      this.atualizarVeiculos();
    },

    aplicarFiltros(filtros) {
      // Atualiza os filtros com os valores recebidos do componente
      this.filtroMarcas = filtros.marcas || [];
      this.filtroProp = filtros.proposito || "";
      this.filtroPlaca = filtros.placa || "";
      this.filtrarVeiculos(); // Chama a função de filtragem
    },

    async filtrarVeiculos() {
      try {
        this.loading = true;
        const params = {};

        if (this.filtroMarcas.length) params.marca = this.filtroMarcas.join(",");
        if (this.filtroProp.trim()) params.proposito = this.filtroProp.trim();
        if (this.filtroPlaca.trim()) params.placa = this.filtroPlaca.trim();

        const response = await this.$axios.get("veiculos", { params });

        this.veiculos = response.data;
        this.pagAtual = 1;
      } catch (error) {
        this.$toast.error("Erro ao filtrar veículos");
        console.error("Erro ao filtrar veículo(s): ", error);
      } finally {
        this.loading = false;
      }
    },
  },

  mounted() {
    this.getVeiculos();

    this.ajustarItensPorPagina();

    window.addEventListener("resize", this.ajustarItensPorPagina);
  },

  beforeDestroy() {
    window.removeEventListener("resize", this.ajustarItensPorPagina);
  },
};
</script>

<style lang="scss" scoped>
.container-filtros {
  display: flex;
  align-items: center;
  padding: 0 12px;
}

.btn-cadastro-veiculo {
  padding: 10px !important;
  text-transform: none;
  font-size: 16px;
  font-family: "Roboto";
  font-weight: 700;
  color: #fff;
  margin-left: 15px;
}

.tabela-veiculos {
  margin: 0 25px;
}

.buscando {
  display: flex;
  justify-content: center;
  align-items: center;
  height: 48px;
  color: rgba(128, 128, 128, 0.637);
  font-family: "Roboto";
  font-size: 14px;
  margin-bottom: 0;
}

::v-deep
  .theme--light.v-data-table
  > .v-data-table__wrapper
  > table
  > thead
  > tr
  > th {
  color: $primary !important;
  font-weight: 700;
  font-size: 14px;
}

.icon {
  text-align: start;
}

td {
  color: #333333;
  font-size: 12px !important;
  font-family: "Roboto";
  font-weight: 400;
  border-bottom: 1px solid #dfdfdf;
}

.conforto {
  color: #333333;
  font-size: 14px;
  font-family: "Roboto";
  font-weight: 400;
  display: flex;
  align-items: center;
}

.star {
  margin: 0 0 3px 5px;
}

::v-deep .v-list-item__action {
  margin: 0 !important;
}

::v-deep .v-btn--icon.v-size--default .v-icon,
.v-btn--fab.v-size--default .v-icon {
  color: #464646;
}

.semVeiculo {
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
