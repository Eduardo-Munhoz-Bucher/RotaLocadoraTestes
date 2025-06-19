<template>
  <v-row>
          <v-col cols="12" class="alinhamento-filtros">
            <v-btn icon large @click="visibilidadeFiltro" class="btn-toClose">
              <img
                src="../assets/img/bars-filter.png"
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
                        src="../assets/img/magnifying-glass.png"
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
                      <img src="../assets/img/erase.png" alt="icone-limpar" />
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

                <v-col v-if="mostrarPropUso" cols="3">
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

                <v-col v-if="mostrarMarcas" cols="3">
                  <v-autocomplete
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
                  </v-autocomplete>
                </v-col>
                <v-spacer></v-spacer>
              </div>
            </v-slide-x-reverse-transition>
          </v-col>
        </v-row>
</template>

<script>
export default {
  props: {
    mostrarPropUso: {
      type: Boolean,
      default: true, // Por padrão, exibe o campo de propósito de uso
    },
    mostrarMarcas: {
      type: Boolean,
      default: true, // Por padrão, exibe o campo de marcas
    },
  },

  data() {
    return {
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
    }
  },

  methods: {
    limparFiltro() {
      (this.filtroMarcas = []), (this.filtroProp = ""), (this.filtroPlaca = "");
      this.$emit("limpar-filtros");
    },

    visibilidadeFiltro() {
      this.visibilidade = !this.visibilidade;
    },

    filtrarVeiculos() {
      const filtros = {
        placa: this.filtroPlaca,
      };

      // Apenas inclui os filtros de propósito e marcas se eles estiverem habilitados
      if (this.mostrarPropUso) {
        filtros.proposito = this.filtroProp;
      }
      if (this.mostrarMarcas) {
        filtros.marcas = this.filtroMarcas;
      }
      this.$emit("aplicar-filtros", filtros);
    }
  }
}
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
</style>