<template>
  <div>
    <v-dialog max-width="700" v-model="dialogEditarVeiculo" persistent>
      <v-card light>
        <div class="d-flex justify-space-between">
          <v-toolbar color="primary" class="white--color">
            <div class="header">
              <v-card-text class="white--text">Editar Veículo</v-card-text>
              <span>{{ veiculo.placa }}</span>
            </div>
            <v-btn text icon @click="$emit('fechaModal')">
              <img src="../../assets/img/xmark.png" alt="clone" />
            </v-btn>
          </v-toolbar>
        </div>

        <v-form
          class="modal-cadastro"
          ref="form"
          v-model="valid"
          lazy-validation
        >
          <v-row class="row-form">
            <v-col class="col-form pr-2">
              <v-text-field
                type="text"
                label="Placa"
                v-model="placa"
                hint="Ex: ABC-1234 ou ABC1C34"
                placeholder="Digite a placa do veículo"
                persistent-placeholder
                outlined
                dense
                disabled
              >
              </v-text-field>
            </v-col>
            <v-col class="col-form">
              <v-select
                :items="marcas"
                label="Marca"
                v-model="marca"
                placeholder="Selecione a marca do veículo"
                persistent-placeholder
                outlined
                dense
                required
                :rules="marcaRules"
                :menu-props="{ offsetY: true }"
                append-icon="mdi-chevron-down"
              >
              </v-select>
            </v-col>
          </v-row>
          <v-row class="row-form">
            <v-col class="col-form pr-2">
              <v-text-field
                type="text"
                label="Modelo"
                v-model="modelo"
                placeholder="Digite o modelo do veículo"
                persistent-placeholder
                outlined
                dense
                required
                :rules="modeloRules"
              >
              </v-text-field>
            </v-col>
            <v-col class="col-form">
              <v-select
                :items="years"
                label="Ano"
                placeholder="Selecione o ano do veículo"
                persistent-placeholder
                v-model="ano"
                dense
                outlined
                item-value="year"
                item-text="year"
                :item-class="getItemClass"
                :menu-props="{ offsetY: true }"
                append-icon="mdi-chevron-down"
                :rules="anoRules"
              >
                <template v-slot:prepend-item>
                  <div
                    class="d-flex justify-start align-center pl-4 header-year"
                  >
                    {{ ano || "Selecione o ano do veículo" }}
                  </div>
                  <v-divider></v-divider> </template
              ></v-select>
            </v-col>
          </v-row>
          <v-row class="row-form">
            <v-col class="col-form pr-2">
              <v-text-field
                type="text"
                label="Cor"
                v-model="cor"
                placeholder="Digite a cor do veículo"
                persistent-placeholder
                outlined
                dense
                required
                :rules="corRules"
              >
              </v-text-field>
            </v-col>
            <v-col class="col-form">
              <v-select
                :items="proUso"
                label="Propósito"
                v-model="proposito_uso"
                placeholder="Selecione o propósito de uso"
                persistent-placeholder
                outlined
                dense
                required
                :rules="propositoRules"
                :menu-props="{ offsetY: true }"
                append-icon="mdi-chevron-down"
              >
              </v-select>
            </v-col>
          </v-row>
          <v-card-subtitle>Local de repouso do veículo</v-card-subtitle>
          <v-row class="row-form mt-1">
            <v-col class="col-form pr-2">
              <v-text-field
                type="text"
                label="Latitude"
                v-model="latitude"
                placeholder="Digite a latitude"
                persistent-placeholder
                outlined
                dense
                required
                :rules="latitudeRules"
              >
              </v-text-field>
            </v-col>
            <v-col class="col-form">
              <v-text-field
                type="text"
                label="Longitude"
                v-model="longitude"
                placeholder="Digite a longitude"
                persistent-placeholder
                outlined
                dense
                required
                :rules="longitudeRules"
              >
              </v-text-field>
            </v-col>
          </v-row>
          <v-row class="row-form">
            <v-col class="col-form">
              <div class="nivel-conf">
                <v-card-subtitle class="rating"
                  >Nivel de conforto do veículo</v-card-subtitle
                >
                <v-rating
                  v-model="conforto"
                  background-color="primary"
                  color="primary"
                  size="32"
                ></v-rating>
              </div>
            </v-col>
          </v-row>
          <v-container fluid class="checkbox">
            <v-checkbox
              v-model="veiculo_zero"
              label="Veículo zero-quilômetro"
              color="primary"
              ripple
            ></v-checkbox>
          </v-container>
          <v-card-actions>
            <v-btn
              class="btn-salvar-modal"
              color="primary"
              :loading="loading"
              :disabled="loading"
              @click="editarVeiculo(veiculo.id)"
              >Salvar</v-btn
            >
          </v-card-actions>
        </v-form>
      </v-card>
    </v-dialog>
  </div>
</template>

<script>
import {
  marcaRules,
  modeloRules,
  anoRules,
  corRules,
  propositoRules,
  latitudeRules,
  longitudeRules,
} from "../../services/validationsRules";

export default {
  props: ["veiculo"],
  data() {
    return {
      dialogEditarVeiculo: true,
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
      proUso: ["Uso pessoal", "Veículo para locação", "Uso da empresa"],
      placa: null,
      marca: null,
      modelo: null,
      cor: null,
      ano: null,
      proposito_uso: null,
      latitude: null,
      longitude: null,
      conforto: null,
      veiculo_zero: null,
      dtCadastro: null,
      dtEdicao: null,
      loading: false,
      years: [],
      valid: true,
      marcaRules,
      modeloRules,
      anoRules,
      corRules,
      propositoRules,
      latitudeRules,
      longitudeRules,
    };
  },

  created() {
    this.populateYears();
    this.placa = this.veiculo.placa;
    this.marca = this.veiculo.marca;
    this.modelo = this.veiculo.modelo;
    this.cor = this.veiculo.cor;
    this.ano = this.veiculo.ano;
    this.proposito_uso = this.veiculo.proposito_uso;
    this.latitude = this.veiculo.latitude;
    this.longitude = this.veiculo.longitude;
    this.conforto = this.veiculo.conforto;
    this.veiculo_zero = this.veiculo.veiculo_zero;
    this.dtCadastro = this.veiculo.dtCadastro;
  },

  methods: {
    populateYears() {
      const startYear = 1990;
      const endYear = 2025;

      for (let year = endYear; year >= startYear; year--) {
        this.years.push({ year });
      }
    },

    getItemClass(item) {
      return item.year === this.currentYear ? "current-year" : "";
    },

    async editarVeiculo(id) {
      this.loading = true;

      await new Promise((resolve) => setTimeout(resolve, 3000));

      try {
        if (
          !this.placa ||
          !this.marca ||
          !this.modelo ||
          !this.cor ||
          !this.ano ||
          !this.proposito_uso ||
          !this.latitude ||
          !this.longitude ||
          !this.conforto
        ) {
          this.$toast.error("Campos não preenchidos!");
          this.validate();
          return;
        }

        const data = {
          placa: this.placa,
          marca: this.marca,
          modelo: this.modelo,
          cor: this.cor,
          ano: this.ano,
          proposito_uso: this.proposito_uso,
          latitude: this.latitude,
          longitude: this.longitude,
          conforto: this.conforto,
          veiculo_zero: this.veiculo_zero,
          dtCadastro: this.dtCadastro,
          dtEdicao: new Date().toISOString(),
          dtExclusao: null,
          ativo: true,
        };

        const response = await this.$veiculoService.putVeiculo(id, data);

        if (response.status === 200 || response.status === 201) {
          this.$toast.success("Veículo editado com sucesso");

          await new Promise((resolve) => setTimeout(resolve, 2000));

          this.$emit("fechaModal");
        } else {
          throw new Error("Erro ao editar veículo.");
        }
      } catch (error) {
        console.error("Erro ao editar veículo: ", error);
        this.$toast.error("Erro ao editar veículo!");
      } finally {
        this.loading = false;
      }
    },

    onErrorClosed() {
      console.log("Snackbar de erro fechado.");
    },

    onSuccessClosed() {
      console.log("Sucesso");
    },

    validate() {
      this.$refs.form.validate();
    },
  },
};
</script>

<style scoped>
::v-deep .v-dialog {
  position: absolute;
  top: 58px;
  margin: 0 !important;
}

::v-deep .v-card__text {
  font-size: 14px;
  font-family: "Roboto";
  font-weight: 500;
  padding: 0;
  line-height: 16px;
}

::v-deep .v-toolbar__content {
  padding: 4px 25px !important;
  display: flex;
  justify-content: space-between;
}

.header > span {
  font-size: 16px !important;
  font-weight: normal;
  color: #fff !important;
}

.header {
  display: flex;
  flex-direction: column;
}

.modal-cadastro {
  padding: 20px 20px 10px 20px;
}

.row-form {
  margin: 0;
  height: 65px;
}

.col-form {
  padding: 4px;
}

::v-deep .v-card__text-toolbar {
  font-size: 18px;
  font-family: "Roboto";
  font-weight: 400;
  color: #fff;
}

.v-card__subtitle {
  padding: 0 0 0 4px;
  font-size: 14px;
  font-family: "Roboto";
  font-weight: 400;
  color: #333333;
}

::v-deep .v-text-field input {
  font-family: "Roboto";
  font-size: 14px !important;
  font-weight: 400;
}

::v-deep .v-select__selection {
  font-size: 14px;
  font-family: "Roboto";
  font-weight: 400;
}

.v-list {
  padding: 0;
}

.header-year {
  color: #fff;
  background-color: #3366cc;
  font-size: 12px;
  font-weight: 400;
  height: 38px;
  position: sticky;
  top: 0;
  z-index: 1;
}

.rating {
  padding: 0 !important;
}

.nivel-conf {
  display: flex;
  align-items: center;
  margin: -6px 0 -6px 0;
}

::v-deep .v-input--selection-controls__input {
  margin-right: 2px;
}

::v-deep .v-input--selection-controls {
  margin: 0;
}

::v-deep .v-input--selection-controls__ripple {
  width: 0 !important;
  height: 0 !important;
}

.checkbox {
  padding: 0 0 0 2px;
  margin-top: -14px;
  height: 40px;
}

::v-deep .v-input--selection-controls .v-input__slot > .v-label,
.v-input--selection-controls .v-radio > .v-label {
  font-size: 14px !important;
  font-weight: 400;
  font-family: "Roboto";
}

::v-deep .v-messages__message {
  color: var(--error);
  font-family: "Roboto";
}

.v-card__actions {
  display: flex;
  justify-content: end;
  padding: 10px 4px;
}

::v-deep .v-card__actions > .v-btn.v-btn {
  padding: 0 12px !important;
}

.btn-salvar-modal {
  font-size: 14px;
  font-weight: 400;
  text-transform: none;
  font-family: "Roboto";
  color: #fff;
}

.custom-loader {
  animation: loader 1s infinite;
  display: flex;
}
@-moz-keyframes loader {
  from {
    transform: rotate(0);
  }
  to {
    transform: rotate(360deg);
  }
}
@-webkit-keyframes loader {
  from {
    transform: rotate(0);
  }
  to {
    transform: rotate(360deg);
  }
}
@-o-keyframes loader {
  from {
    transform: rotate(0);
  }
  to {
    transform: rotate(360deg);
  }
}
@keyframes loader {
  from {
    transform: rotate(0);
  }
  to {
    transform: rotate(360deg);
  }
}
</style>
