<template>
  <div>
    <v-dialog max-width="500" v-model="dialogDesativarUsuario">
      <v-card light>
        <div class="d-flex justify-space-between">
          <v-toolbar color="primary" class="white--color">
            <v-card-text class="white--text pa-0 font-weight-medium">
              Desativar Usuário
            </v-card-text>
            <v-btn text icon @click="$emit('fechaModal')">
              <img src="~/assets/img/xmark.png" alt="close" />
            </v-btn>
          </v-toolbar>
        </div>

        <v-card-text class="text--info text font-weight-normal px-4 pt-5"
          >Tem certeza que deseja desativar o usuário
          <strong>{{ this.nome_user }}</strong
          >?</v-card-text
        >

        <v-card-actions class="justify-end">
          <v-btn class="mt-3" text color="#212121" @click="$emit('fechaModal')"
            >CANCELAR</v-btn
          >
          <v-btn
            class="mt-3"
            text
            color="error"
            @click="deletarUsuario(usuario.id)"
            :loading="loading"
            :disabled="loading"
            >CONFIRMAR</v-btn
          >
        </v-card-actions>
      </v-card>
    </v-dialog>
  </div>
</template>

<script>
export default {
  props: ["usuario"],
  data() {
    return {
      dialogDesativarUsuario: true,
      nome_user: null,
      loading: false,
    };
  },

  created() {
    this.nome_user = this.usuario.nome_user;
  },

  methods: {
    async deletarUsuario(id) {
      this.loading = true;

      await new Promise((resolve) => setTimeout(resolve, 3000));

      try {
        console.log("entrou no if");

        const response = await this.$usuarioService.deleteUsuario(id);

        if (response.status === 200 || response.status === 204) {
          this.$toast.success("Usuário desativado com sucesso!");

          await new Promise((resolve) => setTimeout(resolve, 2000));

          this.$emit("fechaModal");
        } else {
          console.log("entrou no else");

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
.title--info {
  display: flex;
  align-items: center;
}

.text-tile {
  font-size: 20px;
  line-height: 23px;
}

::v-deep .text--info {
  color: #616161 !important;
  font-size: 14px;
  line-height: 16px;
  padding-bottom: 0 !important;
}

::v-deep .v-dialog > .v-card > .v-card__actions {
  padding: 0 16px 12px 16px !important;
  display: flex;
  justify-content: end;
}

.v-card__actions > .v-btn.v-btn {
  padding: 0 16px;
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