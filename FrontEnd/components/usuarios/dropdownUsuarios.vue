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
    <modalRedefinirSenha 
      v-if="detalhes[0].modal"
      @fechaModal="handleFechaModalRedefinirSenha"
      :usuario="usuario"
    />

    <modalDesativarUsuario 
      v-if="detalhes[1].modal"
      @fechaModal="handleFechaModalDesativarUsuario"
      :usuario="usuario"
      :id="usuario.id"
    />
  </div>
</template>

<script>
import modalRedefinirSenha from './modalUsuario/modalRedefinirSenha.vue';
import modalDesativarUsuario from './modalUsuario/modalDesativarUsuario.vue';

export default {
  name: "dropdownUsuarios",
  props: ["usuario", "id", "atualizarUsuarios"],
  components: {
    modalRedefinirSenha,
    modalDesativarUsuario
  },
  data() {
    return {
      detalhes: [
        {
          title: "Redefinir senha",
          modal: false,
        },
        {
          title: "Desativar",
          modal: false,
        },
      ],
    };
  },
  methods: {
    abrirModal(index) {
      this.detalhes[index].modal = true;
    },

    handleFechaModalRedefinirSenha() {
      this.detalhes[0].modal = false;
      this.atualizarUsuarios();
    },

    handleFechaModalDesativarUsuario() {
      this.detalhes[1].modal = false;
      this.atualizarUsuarios();
    }
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