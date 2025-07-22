<template>
  <div>
    <v-dialog max-width="850" v-model="dialogDetalhesVeiculo" persistent>
      <v-card light>
        <div class="d-flex justify-space-between">
          <v-toolbar color="primary" class="white--color">
            <div class="header">
              <v-card-text class="white--text">Detalhes do Veículo</v-card-text>
              <span>{{ veiculo.placa }}</span>
            </div>
            <v-btn text icon @click="$emit('fechaModal')">
              <img src="~/assets/img/xmark.png" alt="close" />
            </v-btn>
          </v-toolbar>
        </div>

        <v-container class="r-modal">
          <v-container class="r-container">
            <v-card min-height="150" class="card-detalhes">
              <v-row class="r-row">
                <v-col cols="3">
                  <div class="r-dados-veiculo">
                    <div class="div-avatar-veiculo mr-2 mt-1" >
                      <v-avatar size="36" color="red">
                        <img
                          src="~/assets/img/Vector.png"
                          alt="car-side"
                          class="v-icon"
                        />
                      </v-avatar>
                    </div>
                    <div class="div-veiculo">
                      <span class="span-titulo-veiculo">{{
                        veiculo.placa
                      }}</span>
                      <div class="subtitulo">Frota {{ veiculo.id }}</div>
                    </div>
                  </div>
                </v-col>
                <v-col cols="3">
                  <div class="r-dados">
                    <span class="span-titulo">Marca/Modelo</span>
                    <div class="subtitulo">
                      {{ veiculo.marca }} {{ veiculo.modelo }}
                    </div>
                  </div>
                </v-col>
                <v-col cols="3">
                  <div class="r-dados">
                    <span class="span-titulo">Ano</span>
                    <div class="subtitulo">{{ veiculo.ano }}</div>
                  </div>
                </v-col>
                <v-col cols="3">
                  <div class="r-dados">
                    <span class="span-titulo">Cor</span>
                    <div class="subtitulo">{{ veiculo.cor }}</div>
                  </div>
                </v-col>
              </v-row>
              <v-row class="r-row">
                <v-col cols="3">
                  <div class="r-dados">
                    <span class="span-titulo">Propósito de uso</span>
                    <div class="subtitulo">{{ veiculo.proposito_uso }}</div>
                  </div>
                </v-col>
                <v-col cols="3">
                  <div class="r-dados">
                    <span class="span-titulo">Zero-quilômetro?</span>
                    <div class="subtitulo">
                      {{ veiculo.veiculo_zero === 0 ? "Não" : "Sim" }}
                    </div>
                  </div>
                </v-col>
                <v-col cols="3">
                  <div class="r-dados">
                    <span class="span-titulo">Nível de conforto</span>
                    <div class="subtitulo">
                      {{ veiculo.conforto }}
                      <img
                        src="~/assets/img/star-solid.png"
                        alt="star-solid"
                        width="20"
                        height="19"
                        class="star"
                      />
                    </div>
                  </div>
                </v-col>
                <v-col cols="3"> </v-col>
              </v-row>
            </v-card>
            <v-card>
              <div id="mapContainer"></div>
            </v-card>
          </v-container>
        </v-container>
      </v-card>
    </v-dialog>
  </div>
</template>

<script>
import * as L from "leaflet";
import "leaflet/dist/leaflet.css";

export default {
  props: ["veiculo"],
  data() {
    return {
      dialogDetalhesVeiculo: true,
      marcas: ["BMW", "Chevrolet", "VolksWagen", "Fiat", "Nissan", "Toyota"],
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
      map: null,
      url: "https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png",
      attribution:
        '&copy; RotaExata',
      zoom: 16,
    };
  },
  created() {
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
  },

  mounted() {
    this.initializeMap();
  },

  methods: {
    initializeMap() {
      this.map = L.map("mapContainer", {
        zoomControl: false,
      }).setView([this.latitude, this.longitude], this.zoom);
      L.tileLayer(this.url, {
        attribution: this.attribution,
      }).addTo(this.map);

      const customIcon = L.icon({
        iconUrl: require("@/assets/img/map-point.png"),
        iconSize: [30, 40], 
      });

      L.marker([this.latitude, this.longitude], { icon: customIcon }).addTo(
        this.map
      );

      const infoControl = L.control({ position: "topleft" });
      infoControl.onAdd = () => {
        const div = L.DomUtil.create("div", "info-control");
        div.innerHTML = `<div style="background: white; color: #777777; padding: 8px; border-radius: 4px; box-shadow: 0 2px 6px rgba(0,0,0,0.2);">
          Local de repouso (lat, long)<br>
          <p style="margin: 0; color: #333333;"><b>${this.latitude}, ${this.longitude}</b></p>
        </div>`;
        return div;
      };
      infoControl.addTo(this.map);
    },
  },
};
</script>

<style lang="scss" scoped>
#mapContainer {
  max-width: 100%;
  min-height: 250px;
  margin-top: 16px;
}

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
  color: #FFF !important;
}

.header {
  display: flex;
  flex-direction: column;
}

.r-container {
  padding: 10px 12px;
}

.card-detalhes {
  padding: 1.5px 0;
}

.r-row {
  padding: 0 10px;
  margin: 0 2px;
  display: flex;
  justify-content: space-between;
}

.r-dados-veiculo {
  display: flex;
  align-items: center;
}

.v-avatar .v-icon {
  height: 20px;
  width: 22px;
}

.div-veiculo {
  height: 40px;
}

.span-titulo-veiculo {
  color: #333;
  font-size: 14px;
  font-weight: 700;
}

.span-titulo {
  color: #777777;
  font-size: 12px;
  font-family: "Roboto";
  font-weight: 400;
}

.subtitulo {
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

::v-deep .v-rating .v-icon {
  padding: 0 0 0 4px;
  color: $primary;
}

.card-leaflet {
  margin-top: 16px;
}
</style>
