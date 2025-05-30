<template>
  <div>
    <v-dialog max-width="700" v-model="dialogCadastrarVeiculo" persistent>
      <v-card light>
        <div class="d-flex justify-space-between">
          <v-toolbar color="primary" class="white--color">
            <v-card-text class="white--text">Cadastro de Veículo</v-card-text>
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
                v-model="dadosVeiculo.placa"
                placeholder="Digite a placa do veículo"
                persistent-placeholder
                outlined
                dense
                required
                :rules="placaRules"
              >
              </v-text-field>
            </v-col>
            <v-col class="col-form">
              <v-select
                :items="marcas"
                label="Marca"
                v-model="dadosVeiculo.marca"
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
                v-model="dadosVeiculo.modelo"
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
                v-model="dadosVeiculo.ano"
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
                    {{ dadosVeiculo.ano || "Selecione o ano do veículo" }}
                  </div>
                  <v-divider></v-divider>
                </template>
              </v-select>
            </v-col>
          </v-row>
          <v-row class="row-form">
            <v-col class="col-form pr-2">
              <v-text-field
                type="text"
                label="Cor"
                v-model="dadosVeiculo.cor"
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
                v-model="dadosVeiculo.proposito_uso"
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
                v-model="dadosVeiculo.latitude"
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
                v-model="dadosVeiculo.longitude"
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
                  v-model="dadosVeiculo.conforto"
                  background-color="primary"
                  color="primary"
                  size="32"
                ></v-rating>
              </div>
            </v-col>
          </v-row>
          <v-container fluid class="checkbox">
            <v-checkbox
              v-model="dadosVeiculo.veiculo_zero"
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
              @click="criarVeiculo"
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
  placaRules,
  marcaRules,
  modeloRules,
  anoRules,
  corRules,
  propositoRules,
  latitudeRules,
  longitudeRules,
} from "../../services/validationsRules";

export default {
  data() {
    return {
      dialogCadastrarVeiculo: true,
      years: [],
      dadosVeiculo: {
        placa: null,
        marca: null,
        modelo: null,
        cor: null,
        ano: null,
        proposito_uso: null,
        latitude: null,
        longitude: null,
        conforto: 1,
        veiculo_zero: false,
        dtCadastro: null,
      },
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
      loading: false,
      valid: true,
      placaRules,
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

    async criarVeiculo(e) {
      e.preventDefault();

      this.loading = true;

      await new Promise((resolve) => setTimeout(resolve, 2000));

      try {
        if (
          !this.dadosVeiculo.placa ||
          !this.dadosVeiculo.marca ||
          !this.dadosVeiculo.modelo ||
          !this.dadosVeiculo.cor ||
          !this.dadosVeiculo.ano ||
          !this.dadosVeiculo.proposito_uso ||
          !this.dadosVeiculo.latitude ||
          !this.dadosVeiculo.longitude
        ) {
          this.$toast.error("Campos não preenchidos!");
          this.validate();
          return;
        }

        const data = {
          placa: this.dadosVeiculo.placa,
          marca: this.dadosVeiculo.marca,
          modelo: this.dadosVeiculo.modelo,
          cor: this.dadosVeiculo.cor,
          ano: this.dadosVeiculo.ano,
          proposito_uso: this.dadosVeiculo.proposito_uso,
          latitude: this.dadosVeiculo.latitude,
          longitude: this.dadosVeiculo.longitude,
          conforto: this.dadosVeiculo.conforto,
          veiculo_zero: this.dadosVeiculo.veiculo_zero,
          dtCadastro: new Date().toISOString(),
          dtEdicao: null,
          dtExclusao: null,
          ativo: "1",
        };

        const response = await this.$veiculoService.postVeiculo(data);

        if (response.status === 201 || response.status === 200) {
          this.$toast.success("Veículo cadastrado com sucesso!");

          await new Promise((resolve) => setTimeout(resolve, 2000));

          this.$emit("fechaModal");
          this.$emit("veiculoCadastrado");
        } else {
          throw new Error("Erro ao cadastrar o veículo.");
        }
      } catch (error) {
        console.error("Erro ao criar veículo: ", error);
        this.$toast.error("Erro ao cadastrar veículo!");
      } finally {
        this.loading = false;
      }
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

::v-deep .v-list-item__title,
.v-list-item__subtitle {
  font-size: 14px !important;
  font-weight: 400;
  color: #333333;
}

.v-list {
  padding: 0 !important;
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

::v-deep .v-input--selection-controls .v-input__slot > .v-label,
.v-input--selection-controls .v-radio > .v-label {
  font-size: 14px !important;
  font-weight: 400;
  font-family: "Roboto";
}

.checkbox {
  padding: 0 0 0 2px;
  margin-top: -14px;
  height: 40px;
}

::v-depp .theme--light .v-label {
  padding-top: 10px;
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
