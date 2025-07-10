<template>
  <div class="page-container">
    <v-card class="formulario" rounded-xl>
      <v-form ref="form" v-model="valid" lazy-validation>
        <v-container>
          <div class="logo-garagem">
            <img
              src="../assets/img/car-garage-solid.png"
              alt="logo-garagem"
              width="83"
              height="70"
            />
          </div>
          <v-card-text> Novo Cadastro </v-card-text>
          <v-text-field
            v-model="formData.nome_user"
            label="Usuário"
            placeholder="Digite o nome de usuário"
            required
            :rules="usuarioRules"
            persistent-placeholder
            outlined
            dense
          ></v-text-field>
          <v-menu
            ref="menu"
            v-model="menu"
            :close-on-content-click="false"
            transition="scale-transition"
            offset-y
            min-width="auto"
          >
            <template v-slot:activator="{ on, attrs }">
              <v-text-field
                v-model="computedDateFormatted"
                label="Data de aniversário"
                placeholder="Selecione a data de aniversário"
                persistent-placeholder
                outlined
                dense
                readonly
                required
                :rules="aniversarioRules"
                v-bind="attrs"
                v-on="on"
                append-icon="mdi-chevron-down"
                @click="showCalendario = !showCalendario"
              ></v-text-field>
            </template>
            <v-date-picker
              v-model="formData.dt_aniversario"
              locale="pt-br"
              header-color="#3366CC"
              @input="menu = false"
              :max="
                new Date(Date.now() - new Date().getTimezoneOffset() * 60000)
                  .toISOString()
                  .substring(0, 10)
              "
              min="1950-01-01"
              light
            ></v-date-picker>
          </v-menu>
          <v-text-field
            v-model="formData.email"
            :rules="emailRules"
            label="E-mail"
            placeholder="Digite o e-mail"
            persistent-placeholder
            outlined
            dense
            required
          ></v-text-field>
          <v-text-field
            v-model="formData.senha"
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
            v-model="formData.confirmaSenha"
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
          <v-btn
            color="primary"
            class="button"
            block
            large
            :loading="loading"
            :disabled="loading"
            @click="criarUsuario"
            >Cadastrar</v-btn
          >
          <div class="novoLogin">
            <NuxtLink to="/">Fazer login</NuxtLink>
          </div>
        </v-container>
      </v-form>
    </v-card>
  </div>
</template>

<script>
import {
  usuarioRules,
  aniversarioRules,
  emailRules,
  senhaRules,
  confirmarSenhaRule,
} from "../services/validationsRules";

export default {
  name: "IndexPage",
  data() {
    return {
      valid: true,
      loading: false,
      menu: false,
      formData: {
        nome_user: null,
        dt_aniversario: null,
        email: null,
        senha: null,
        confirmaSenha: null,
      },
      showPassword: false,
      showConfirmPassword: false,
      showCalendario: false,
      usuarioRules,
      aniversarioRules,
      emailRules,
      senhaRules,
    };
  },

  computed: {
    computedDateFormatted() {
      return this.formatDate(this.formData.dt_aniversario);
    },

    confirmaSenhaRules() {
      return confirmarSenhaRule(this.formData.senha);
    },
  },

  methods: {
    formatDate(date) {
      if (!date) return null;

      const [year, month, day] = date.split("-");
      return `${day}/${month}/${year}`;
    },

    async criarUsuario(e) {
      e.preventDefault();
      this.loading = true;

      await new Promise((resolve) => setTimeout(resolve, 2000));

      if (
        !this.formData.nome_user ||
        !this.formData.dt_aniversario ||
        !this.formData.email ||
        !this.formData.senha ||
        !this.formData.confirmaSenha
      ) {
        this.$toast.error("Campos não preenchidos!");
        this.validate();
        this.loading = false;
        return;
      }

      if (this.formData.senha !== this.formData.confirmaSenha) {
        this.$toast.error("Senhas divergentes.");
        this.loading = false;
        return;
      }

      try {
        const data = {
          nome_user: this.formData.nome_user,
          dt_aniversario: this.formData.dt_aniversario,
          email: this.formData.email,
          senha: this.formData.senha,
          ativo: "1",
        };

        const response = await this.$usuarioService.postUsuario(data);

        if (response.status === 201 || response.status === 200) {
          this.$toast.success("Usuário cadastrado com sucesso!");

          await new Promise((resolve) => setTimeout(resolve, 2000));

          this.$router.push({ path: "/" });
        } else {
          throw new Error("Erro ao criar usuário.");
        }
      } catch (error) {
        console.error("Erro ao criar usuário:", error);

        this.$toast.error("Erro ao criar usuário!");
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

<style lang="scss" scoped>
@import "~/assets/variables.scss";

.page-container {
  @include page-container-style; // Aplica o mixin
}

.formulario {
  padding: 20px 40px;
  margin: auto;
  width: 35vw;
  height: auto;
  max-width: 480px;
  border-radius: 30px;
}

.logo-garagem {
  display: flex;
  justify-content: center;
  margin-bottom: 10px;
}

.v-card__text {
  font-size: 20px;
  font-weight: 700;
  font-family: "Roboto";
  text-align: center;
  margin-bottom: 15px;
  color: #333333;
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

::v-deep .v-picker__title {
  background-color: #3366cc;
}

::v-deep .v-date-picker-title__year {
  font-family: "Roboto";
  font-size: 12px;
  font-weight: 400;
}

::v-deep .v-date-picker-title__date {
  font-family: "Roboto";
  font-size: 24px;
  font-weight: 700;
}

::v-deep .v-date-picker-header {
  font-family: "Roboto";
  font-size: 16px;
  font-weight: 700;
}

::v-deep .v-date-picker-table table {
  font-family: "Roboto";
}

::v-deep .v-btn--outlined {
  color: #3366cc;
}

::v-deep .v-btn--active {
  background-color: #3366cc;
}

::v-deep .v-date-picker-years {
  font-family: "Roboto";
}

::v-deep .active {
  color: #3366cc;
  font-size: 20px;
  font-weight: 700;
}

.v-chip {
  height: 20px;
  font-size: 12px;
  font-family: "Roboto";
  font-weight: 400;
}

.theme--light.v-input input {
  color: rgba(0, 0, 0, 0.87);
}

.button {
  font-size: 16px;
  font-family: "Roboto";
  font-weight: 400;
  line-height: 18px;
  color: #fff;
}

.novoLogin {
  margin-top: 20px;
  text-align: center;
  font-size: 16px;
  font-family: "Roboto";
  font-weight: 400;
}

.novoLogin > a {
  text-decoration: none;
  color: #a9a7a9;
  transition: 0.3s;

  &:hover {
    text-decoration: none;
    color: #797979;
  }
}
</style>
