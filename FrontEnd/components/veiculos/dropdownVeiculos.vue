<template>
  <div>
    <v-menu offset-y left>
      <template v-slot:activator="{ on, attrs }">
        <v-btn plain icon v-bind="attrs" v-on="on">
          <v-icon dense>mdi-dots-horizontal</v-icon>
        </v-btn>
      </template>
      <v-list color="#FFF">
        <v-list-item
          v-for="(detalhe, index) in detalhes"
          :key="index"
          @click="abrirModal(index)"
          link
        >
          <v-list-item-title>
            {{ detalhe.title }}
          </v-list-item-title>
        </v-list-item>
      </v-list>
    </v-menu>
    <modalDetalhes
      v-if="detalhes[0].modal"
      @fechaModal="handleFechaModalDetalhes"
      :veiculo="veiculo"
    />
    <modalEditar
      v-if="detalhes[1].modal"
      @fechaModal="handleFechaModalEdicao"
      :veiculo="veiculo"
      :id="veiculo.id"
    />
    <modalDeletar
      v-if="detalhes[2].modal"
      @fechaModal="handleFechaModalDeletar"
      :veiculo="veiculo"
      :id="veiculo.id"
    />
  </div>
</template>

<script>
import modalEditar from "./modalVeiculo/modalEditar.vue";
import modalDeletar from "./modalVeiculo/modalDeletar.vue";
import modalDetalhes from "./modalVeiculo/modalDetalhes.vue";

export default {
  props: ["veiculo", "id", "atualizarVeiculos"],
  components: { modalEditar, modalDetalhes, modalDeletar },
  data() {
    return {
      detalhes: [
        {
          title: "Detalhes",
          modal: false,
        },
        {
          title: "Editar",
          modal: false,
        },
        {
          title: "Deletar",
          modal: false,
        },
      ],
    };
  },
  methods: {
    abrirModal(index) {
      this.detalhes[index].modal = true;
    },

    handleFechaModalDetalhes() {
      this.detalhes[0].modal = false;
    },

    handleFechaModalEdicao() {
      this.detalhes[1].modal = false;
      this.atualizarVeiculos();
    },

    handleFechaModalDeletar() {
      this.detalhes[2].modal = false;
      this.atualizarVeiculos(); 
    },
  },
};
</script>

<style scoped>
.v-list-item:hover {
  background: #dfdfdf;
}

.v-list {
  padding: 0px;
}

.v-list-item__title {
  color: #333333;
  font-size: 14px;
  font-family: "Roboto";
  text-align: start;
}
</style>