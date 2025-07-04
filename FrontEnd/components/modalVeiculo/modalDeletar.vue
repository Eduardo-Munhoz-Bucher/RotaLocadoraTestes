<template>
  <div>
    <v-dialog max-width="500" v-model="dialogDeletarVeiculo" persistent>
      <v-card light>
        <v-card-title class="pb-4">
          <div class="title--info">
            <img
              src="../../assets/img/trash-solid.svg"
              alt="icon-ban"
              width="21"
              height="24"
            />
            <span class="text-title ml-3">Deletar veículo</span>
          </div>
        </v-card-title>

        <v-card-text class="text--info text font-weight-normal"
          >Tem certeza que deseja deletar o veículo
          <strong>{{ this.placa }}</strong
          >?</v-card-text
        >

        <v-card-actions>
          <v-btn class="mt-3" text color="#212121" @click="$emit('fechaModal')"
            >CANCELAR</v-btn
          >
          <v-btn
            class="mt-3"
            text
            color="error"
            @click="deletarVeiculo(veiculo.id)"
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
  props: ["veiculo"],
  data() {
    return {
      dialogDeletarVeiculo: true,
      placa: null,
      loading: false,
    };
  },

  created() {
    this.placa = this.veiculo.placa;
  },

  methods: {
    async deletarVeiculo(id) {
      this.loading = true;

      await new Promise((resolve) => setTimeout(resolve, 3000));

      try {
        const response = await this.$veiculoService.deleteVeiculo(id);

        if (response.status === 200 || response.status === 204) {
          this.$toast.success("Veículo deletado com sucesso!");

          await new Promise((resolve) => setTimeout(resolve, 2000));

          this.$emit("fechaModal");
        } else {
          throw new Error("Erro ao deletar o veículo.");
        }
      } catch (error) {
        console.error("Erro ao deletar veículo:", error);
        this.$toast.error("Erro ao deletar veículo!");
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
  padding: 0 24px 12px 24px !important;
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
