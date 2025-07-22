<template>
  <v-row>
    <v-col cols="12">
      <theHeader />

      <v-container fluid data-app class="mx-6 px-0 container-filtros">
        <v-btn
          color="primary"
          class="text-capitalize btn-novo-usuario pa-3 rounded-r-0"
          @click="modalCadastroUsuario = true"
          >Novo Usuário</v-btn
        >
        <v-btn color="primary" class="rounded-l-0 btn-dropdown" outlined>
          <v-list-item-action class="mr-0">
            <v-menu offset-y right>
              <template v-slot:activator="{ on, attrs }">
                <v-btn plain icon v-bind="attrs" v-on="on">
                  <v-icon dense color="primary">mdi-dots-horizontal</v-icon>
                </v-btn>
              </template>
              <v-list color="#FFF">
                <v-list-item link to="/usuarios">
                  <v-list-item-title> Usuários ativos </v-list-item-title>
                </v-list-item>
              </v-list>
            </v-menu>
          </v-list-item-action>
        </v-btn>
        <v-icon x-large class="ml-5">mdi-chevron-right</v-icon>
        <v-subheader class="text-h5 font-weight-thin px-0 ml-4"
          >Usuários Desativados</v-subheader
        >
        <ModalCadastroUsuario
          v-if="modalCadastroUsuario"
          @fechaModal="modalCadastroUsuario = false"
          @usuarioCadastrado="atualizarUsuarios"
        />

        <filterUsuarios
          @aplicar-filtros="aplicarFiltros"
          @limpar-filtros="limparFiltros"
        />
      </v-container>

      <v-card v-if="loading" class="tabela-usuarios">
        <v-simple-table>
          <template v-slot:default>
            <thead>
              <tr>
                <th>Nome</th>
                <th>Email</th>
                <th>Data de Nascimento</th>
                <th class="icon"></th>
              </tr>
            </thead>
          </template>
        </v-simple-table>
        <v-progress-linear indeterminate color="primary"></v-progress-linear>
        <div class="buscando">
          <p class="mb-0">Buscando...</p>
        </div>
      </v-card>

      <v-card v-else class="tabela-usuarios">
        <v-data-table
          :headers="headers"
          :items="paginatedUsuario"
          hide-default-footer
        >
          <template v-slot:body="{ items }">
            <tbody>
              <tr v-for="usuario in items" :key="usuario.id">
                <td>{{ usuario.nome_user }}</td>
                <td>{{ usuario.email }}</td>
                <td>{{ formatData(usuario.dt_aniversario) }}</td>
              </tr>
            </tbody>
          </template>
        </v-data-table>

        <div v-if="usuarios_inativos.length === 0" class="semUsuario">
          <p class="mb-0">Nenhum usuário encontrado</p>
        </div>
      </v-card>

      <v-footer>
        <div class="text-center">
          <v-pagination
            v-model="pagAtual"
            :length="pagTotal"
            @input="getUsuariosInativos"
            color="#3366CC"
          ></v-pagination>
        </div>
      </v-footer>
    </v-col>
  </v-row>
</template>

<script>
import theHeader from "~/components/theHeader.vue";
import modalCadastroUsuario from "~/components/usuarios/modalUsuario/modalCadastroUsuario.vue";
import filterUsuarios from "~/components/usuarios/filterUsuarios.vue";
import dropdownUsuarios from "~/components/usuarios/dropdownUsuarios.vue";

export default {
  middleware: "auth",
  comments: {
    theHeader,
    modalCadastroUsuario,
    filterUsuarios,
    dropdownUsuarios,
  },
  name: "usuarios",
  data() {
    return {
      modalCadastroUsuario: false,
      dialogCadastrarUsuario: false,
      modalRedefinirSenha: false,
      dialogRedefinirSenha: false,
      pagAtual: 1,
      usuarioPorPag: 9,
      loading: true,
      usuarios_inativos: [],
      headers: [
        { text: "Nome", value: "nome" },
        { text: "Email", value: "email" },
        { text: "Data de Nascimento", value: "data de nascimento" },
      ],
      filtroUsuario: "",
    };
  },

  computed: {
    paginatedUsuario() {
      const start = (this.pagAtual - 1) * this.usuarioPorPag;
      return this.usuarios_inativos.slice(start, start + this.usuarioPorPag);
    },

    pagTotal() {
      return Math.ceil(this.usuarios_inativos.length / this.usuarioPorPag);
    },
  },

  methods: {
    ajustarItensPorPagina() {
      const altura = window.innerHeight;
      if (altura >= 900) {
        this.usuarioPorPag = 12;
      } else if (altura >= 695) {
        this.usuarioPorPag = 9;
      } else if (altura >= 600) {
        this.usuarioPorPag = 7;
      } else {
        this.usuarioPorPag = 5;
      }
    },

    async getUsuariosInativos() {
      try {
        const response = await this.$usuarioService.getUsuariosInativos();
        this.usuarios_inativos = response;
      } catch (error) {
        console.error("Erro ao buscar usuários cadastrados: ", error);
      } finally {
        this.loading = false;
      }
    },

    async atualizarUsuarios() {
      this.loading = true;
      await this.getUsuariosInativos();
    },

    formatData(dateString) {
      const date = new Date(dateString);
      const dtFormatada = date.toLocaleDateString();
      return `${dtFormatada}`;
    },

    limparFiltros() {
      this.filtroUsuario = "";
      this.atualizarUsuarios();
    },

    aplicarFiltros(filtros) {
      this.filtroUsuario = filtros.nome_user || "";
      this.filtrarUsuarios();
    },

    async filtrarUsuarios() {
      try {
        this.loading = true;
        const params = {};

        if (this.filtroUsuario.trim())
          params.nome_user = this.filtroUsuario.trim();

        const response = await this.$axios.get("usuarios_inativos", { params });

        this.usuarios_inativos = response.data;
        this.pagAtual = 1;
      } catch (error) {
        this.$toast.error("Erro ao filtrar usuários");
        console.error("Erro ao filtrar usuário(s): ", error);
      } finally {
        this.loading = false;
      }
    },
  },

  mounted() {
    this.getUsuariosInativos();

    this.ajustarItensPorPagina();

    window.addEventListener("resize", this.ajustarItensPorPagina);
  },

  beforeDestroy() {
    window.removeEventListener("resize", this.ajustarItensPorPagina);
  },
};
</script>

<style lang="scss" scoped>
.container-filtros {
  display: flex;
  align-items: center;
  padding: 0 12px;
}

.btn-novo-usuario {
  font-size: 16px;
  font-weight: 700;
}

.btn-dropdown {
  width: 35px !important;
  min-width: 35px !important;
}

.tabela-usuarios {
  margin: 0 25px;
}

.buscando {
  display: flex;
  justify-content: center;
  align-items: center;
  height: 48px;
  color: rgba(128, 128, 128, 0.637);
  font-family: "Roboto";
  font-size: 14px;
  margin-bottom: 0;
}

::v-deep
  .theme--light.v-data-table
  > .v-data-table__wrapper
  > table
  > thead
  > tr
  > th {
  color: $primary !important;
  font-weight: 700;
  font-size: 14px;
}

.icon {
  text-align: end;
}

td {
  color: #333333;
  font-size: 12px !important;
  font-family: "Roboto";
  font-weight: 400;
  border-bottom: 1px solid #dfdfdf;
}

.v-list-item:hover {
  background: #dfdfdf;
}

.v-list .v-list-item--active {
  color: #fff;
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

.semUsuario {
  display: flex;
  justify-content: center;
  align-items: center;
  height: 48px;
  color: rgba(128, 128, 128, 0.637);
  font-family: "Roboto";
  font-size: 14px;
}

.v-footer {
  background-color: #fff;
  display: flex;
  justify-content: center;
  position: fixed;
  bottom: 20px;
  left: 50%;
  transform: translateX(-50%);
}

::v-deep .v-pagination > li {
  font-family: "Roboto";
  font-weight: 400;
}
</style>