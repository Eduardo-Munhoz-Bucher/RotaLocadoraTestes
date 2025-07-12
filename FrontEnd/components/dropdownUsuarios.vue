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
    <ModalRedefinirSenha 
      v-if="detalhes[0].modal"
      @fechaModal="handleFechaModalRedefinirSenha"
      :usuario="usuario"
    />
  </div>
</template>

<script>
import modalRedefinirSenha from './modalUsuario/modalRedefinirSenha.vue';

export default {
  props: ["usuario", "id", "atualizarUsuarios"],
  components: {
    modalRedefinirSenha
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

    async deletarUsuario(id) {
      this.loading = true;

      await new Promise((resolve) => setTimeout(resolve, 3000));

      try {
        const response = await this.$usuarioService.deleteUsuario(id);

        if (response.status === 200 || response.status === 204) {
          this.$toast.success("Usuário desativado com sucesso!");

          await new Promise((resolve) => setTimeout(resolve, 2000));

          this.getUsuarios();
        } else {
          throw new Error("Erro ao desativar o usuário.");
        }
      } catch (error) {
        console.error("Erro ao desativar o usuário:", error);
        this.$toast.error("Erro ao desativar o usuário!");
      } finally {
        this.loading = false;
      }
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