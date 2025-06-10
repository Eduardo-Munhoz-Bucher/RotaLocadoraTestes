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
        <ModalCadastro
          v-if="modal"
          @fechaModal="modal = false"
          @veiculoCadastrado="atualizarVeiculos"
        />

        <v-row>
          <v-col cols="12" class="alinhamento-filtros">
            <v-btn icon large @click="visibilidadeFiltro" class="btn-toClose">
              <img
                src="../../assets/img/bars-filter.png"
                alt="icone-bars"
                width="26"
                height="24"
              />
            </v-btn>
            <v-slide-x-reverse-transition>
              <div v-if="visibilidade" class="visibilidade">
                <v-col cols="1" class="buttons">
                  <div>
                    <v-btn
                      color="secondary"
                      elevation="1"
                      outlined
                      class="btn-left"
                      width="60"
                      height="40"
                      @click="filtrarVeiculos"
                    >
                      <img
                        src="../../assets/img/magnifying-glass.png"
                        alt="icone-lupa"
                      />
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
                      <img src="../../assets/img/erase.png" alt="icone-limpar" />
                    </v-btn>
                  </div>
                </v-col>
                <v-col cols="3">
                  <v-text-field
                    type="text"
                    v-model="filtroPlaca"
                    label="Placa"
                    placeholder="Digite a placa do veículo"
                    persistent-placeholder
                    outlined
                    dense
                    hide-details
                  >
                  </v-text-field>
                </v-col>

                <v-col cols="3">
                  <v-select
                    :items="propUso"
                    label="Propósito de uso"
                    placeholder="Selecione o propósito de uso"
                    persistent-placeholder
                    v-model="filtroProp"
                    outlined
                    dense
                    hide-details
                    :menu-props="{ offsetY: true }"
                    append-icon="mdi-chevron-down"
                  >
                    <template v-slot:prepend-item>
                      <v-list-item>
                        <v-list-item-content>
                          <v-list-item-title class="grey--text header-select">
                            Propósito de uso
                          </v-list-item-title>
                        </v-list-item-content>
                      </v-list-item>
                      <v-divider></v-divider>
                    </template>
                  </v-select>
                </v-col>

                <v-col cols="3">
                  <v-select
                    :items="marcas"
                    label="Marca"
                    placeholder="Selecione a marca do veículo"
                    persistent-placeholder
                    v-model="filtroMarcas"
                    multiple
                    outlined
                    dense
                    hide-details
                    :menu-props="{ offsetY: true }"
                    append-icon="mdi-chevron-down"
                  >
                    <template v-slot:selection="{ item, index, parent }">
                      <v-chip v-if="index === 0">
                        <span>{{ item }}</span>
                        <v-icon
                          class="icone-deletar"
                          small
                          @click="parent.selectItem(item)"
                        >
                          $delete
                        </v-icon>
                      </v-chip>
                      <span v-if="index === 1" class="span-contador">
                        (+{{ filtroMarcas.length - 1 }})
                      </span>
                    </template>
                    <template v-slot:prepend-item>
                      <v-list-item>
                        <v-list-item-content>
                          <v-list-item-title class="grey--text header-select">
                            Marca
                          </v-list-item-title>
                        </v-list-item-content>
                      </v-list-item>
                      <v-divider></v-divider>
                    </template>
                  </v-select>
                </v-col>
                <v-spacer></v-spacer>
              </div>
            </v-slide-x-reverse-transition>
          </v-col>
        </v-row>
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
                    src="../../assets/img/star-solid.png"
                    alt="star-solid"
                    width="20"
                    height="19"
                    class="star"
                  />
                </td>
                <td>{{ veiculo.latitude }}, {{ veiculo.longitude }}</td>
                <td>
                  <v-list-item-action class="icone-dropdown">
                    <DropdownVeiculos
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
import dropdownVeiculos from "../../components/dropdownVeiculos.vue";
import theHeader from "../../components/theHeader.vue";
import modalCadastro from "../../components/modal/modalCadastro.vue";

export default {
  middleware: "auth",
  components: {
    theHeader,
    dropdownVeiculos,
    modalCadastro,
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
      marcas: [
        "Bmw",
        "Chevrolet",
        "Volkswagen",
        "Fiat",
        "Nissan",
        "Ford",
        "Jeep",
        "Audi",
        "Toyota",
      ],
      propUso: ["Uso pessoal", "Veículo para locação", "Uso da empresa"],
      filtroMarcas: [],
      filtroProp: "",
      filtroPlaca: "",
      visibilidade: true,
      headers: [
        { text: "Placa", value: "placa" },
        { text: "Marca/Modelo", value: "marca_modelo" },
        { text: "Ano", value: "ano" },
        { text: "Cor", value: "cor" },
        { text: "Propósito de uso", value: "proposito_uso" },
        { text: "Zero-quilômetro?", value: "veiculo_zero" },
        { text: "Nível de conforto", value: "conforto" },
        { text: "Local de repouso (lat,long)", value: "localizacao" },
        { text: "" },
      ],
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
    limparFiltro() {
      (this.filtroMarcas = []), (this.filtroProp = ""), (this.filtroPlaca = "");
      this.getVeiculos();
    },

    visibilidadeFiltro() {
      this.visibilidade = !this.visibilidade;
    },

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

    async filtrarVeiculos() {
      try {
        const params = {};

        if (this.filtroMarcas.length)
          params.marca = this.filtroMarcas.join(",");
        if (this.filtroProp.trim()) params.proposito = this.filtroProp.trim();
        if (this.filtroPlaca.trim()) params.placa = this.filtroPlaca.trim();

        const response = await this.$axios.get("veiculos", { params });

        this.veiculos = response.data;
      } catch (error) {
        console.error("Erro ao filtrar veículo(s): ", error);
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
  margin-right: 60px;
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
  text-transform: none;
  font-size: 16px;
  font-family: "Roboto";
  font-weight: 700;
  color: #fff;
  margin-left: 15px;
}

::v-deep .v-input__slot {
  margin-top: 20px;
  padding: 0;
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
  font-weight: 400;
}

::v-deep .v-select__selections > .span-contador {
  font-size: 14px;
  font-family: "Roboto";
  font-weight: 400;
  color: #a9a7a9 !important;
}

.v-list {
  padding: 0 !important;
}

::v-deep .v-list-item__action {
  margin: 0 !important;
}

::v-deep .theme--dark.v-icon {
  color: #a9a7a9;
}

::v-deep .v-list .v-list-item--active .v-icon {
  color: #3366cc !important;
}

::v-deep .v-list-item__title {
  color: #333333;
  padding-left: 4px;
  font-family: "Roboto";
  font-size: 14px;
  font-weight: 400;
}

.header-select {
  color: #a9a7a9 !important;
  font-size: 12px !important;
  font-weight: 400 !important;
}

.icone-deletar {
  padding-left: 5px;
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

.icone-dropdown {
  display: flex;
  justify-content: end;
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
