<template>
  <div>
    <v-dialog max-width="500" v-model="dialogRedefinirSenha">
      <v-card light>
        <div class="d-flex justify-space-between">
          <v-toolbar color="primary" class="white--color">
            <v-card-text class="white--text pa-0 font-weight-medium">
              Redefinir Senha
            </v-card-text>
            <v-btn text icon @click="$emit('fechaModal')">
              <img src="../../assets/img/xmark.png" alt="close" />
            </v-btn>
          </v-toolbar>
        </div>

        <v-form
          class="px-5 py-5"
          ref="formRedefinirSenha"
          v-model="valid"
          lazy-validation
        >
          <v-text-field
            v-model="formSenha.senha"
            :append-icon="showPassword ? 'mdi-eye' : 'mdi-eye-off'"
            :type="showPassword ? 'text' : 'password'"
            :rules="senhaRules"
            outlined
            dense
            required
            name="input-password"
            label="Senha"
            placeholder="Digite a senha"
            persistent-placeholder
            @click:append="showPassword = !showPassword"
          ></v-text-field>
          <v-text-field
            v-model="formSenha.confirmaSenha"
            :append-icon="showConfirmPassword ? 'mdi-eye' : 'mdi-eye-off'"
            :type="showConfirmPassword ? 'text' : 'password'"
            :rules="confirmaSenhaRules"
            outlined
            dense
            required
            name="input-confirm-password"
            label="Confirmar senha"
            placeholder="Digite novamente a senha"
            persistent-placeholder
            @click:append="showConfirmPassword = !showConfirmPassword"
          ></v-text-field>
          <v-card-actions class="justify-end pa-0">
            <v-btn
              class="btn-salvar-modal px-3 text-capitalize"
              color="primary"
              :loading="loading"
              :disabled="loading"
              @click="redefinirSenha(usuario.id)"
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
  senhaRules,
  confirmarSenhaRule,
} from "../../services/validationsRules";

export default {
  props: ["usuario"],
  data() {
    return {
      dialogRedefinirSenha: true,
      formSenha: {
        senha: null,
        confirmaSenha: null,
      },
      showPassword: false,
      showConfirmPassword: false,
      nome: null,
      valid: true,
      loading: false,
      senhaRules,
      confirmarSenhaRule,
    };
  },

  created() {
    this.nome = this.usuario;
  },

  computed: {
    confirmaSenhaRules() {
      return confirmarSenhaRule(this.formSenha.senha);
    },
  },

  methods: {
    async redefinirSenha(id) {
      this.loading = true;

      await new Promise((resolve) => setTimeout(resolve, 2000));

      if (!this.formSenha.senha || !this.formSenha.confirmaSenha) {
        this.$toast.error("Campos não preenchidos!");
        this.validate();
        this.loading = false;
        return;
      }

      if (this.formSenha.senha !== this.formSenha.confirmaSenha) {
        this.$toast.error("Senhas divergentes.");
        this.loading = false;
        return;
      }

      try {
        const data = {
          senha: this.formSenha.senha,
        };

        const response = await this.$usuarioService.putUsuario(id, data);

        if (response.status === 201 || response.status === 200) {
          this.$toast.success("Senha redefinida com sucesso!");

          await new Promise((resolve) => setTimeout(resolve, 2000));

          this.$emit("fechaModal")
        } else {
          throw new Error("Erro ao redefinir senha");
        }
      } catch (error) {
        console.error("Erro ao redefinir senha: ", error);

        this.$toast.error("Erro ao redefinir senha");
      } finally {
        this.loading = false;
      }
    },

    validate() {
      this.$refs.formRedefinirSenha.validate();
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
  line-height: 16px;
}

::v-deep .v-text-field input {
  font-family: "Roboto";
  font-size: 12px !important;
  font-weight: 400;
}

::v-deep .v-messages__message {
  color: var(--error);
  font-family: "Roboto";
}
</style>