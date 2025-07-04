<template>
  <v-row>
    <v-col cols="12">
      <theHeader />

      <v-container fluid data-app class="mx-6 px-0 container-filtros">
        <v-btn
          color="primary"
          class="text-capitalize btn-novo-usuario pa-3"
          @click="modalCadastroUsuario = true"
          >Novo Usuário</v-btn
        >
        <ModalCadastroUsuario
          v-if="modalCadastroUsuario"
          @fechaModal="modalCadastroUsuario = false"
          @usuarioCadastrado="atualizarUsuarios"
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
                <td>
                  <v-list-item-action class="icone-dropdown">
                    <v-menu offset-y left>
                      <template v-slot:activator="{ on, attrs }">
                        <v-btn plain icon v-bind="attrs" v-on="on">
                          <v-icon dense>mdi-dots-horizontal</v-icon>
                        </v-btn>
                      </template>
                      <v-list color="#FFF">
                        <v-list-item
                          link
                        >
                          <v-list-item-title>
                            Deletar
                          </v-list-item-title>
                        </v-list-item>
                      </v-list>
                    </v-menu>
                  </v-list-item-action>
                </td>
              </tr>
            </tbody>
          </template>
        </v-data-table>

        <div v-if="usuarios.length === 0" class="semUsuario">
          <p class="mb-0">Nenhum usuário encontrado</p>
        </div>
      </v-card>

      <v-footer>
        <div class="text-center">
          <v-pagination
            v-model="pagAtual"
            :length="pagTotal"
            @input="getUsuarios"
            color="#3366CC"
          ></v-pagination>
        </div>
      </v-footer>
    </v-col>
  </v-row>
</template>

<script>
import theHeader from "~/components/theHeader.vue";
import modalCadastroUsuario from "~/components/modalUsuario/modalCadastroUsuario.vue";
import dropdownVeiculos from "~/components/dropdownVeiculos.vue";

export default {
  middleware: "auth",
  comments: {
    theHeader,
    modalCadastroUsuario,
    dropdownVeiculos,
  },
  name: "usuarios",
  data() {
    return {
      modalCadastroUsuario: false,
      dialogCadastrarUsuario: false,
      pagAtual: 1,
      usuarioPorPag: 9,
      loading: true,
      usuarios: [],
      headers: [
        { text: "Nome", value: "nome" },
        { text: "Email", value: "email" },
        { text: "Data de Nascimento", value: "data de nascimento" },
        { text: "", sortable: false },
      ],
    };
  },

  computed: {
    paginatedUsuario() {
      const start = (this.pagAtual - 1) * this.usuarioPorPag;
      return this.usuarios.slice(start, start + this.usuarioPorPag);
    },
    pagTotal() {
      return Math.ceil(this.usuarios.length / this.usuarioPorPag);
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

    async getUsuarios() {
      try {
        const response = await this.$usuarioService.getUsuarios();
        this.usuarios = response;
      } catch (error) {
        console.error("Erro ao buscar usuários cadastrados: ", error);
      } finally {
        this.loading = false;
      }
    },

    async atualizarUsuarios() {
      this.loading = true;
      await this.getUsuarios();
    },

    formatData(dateString) {
      const date = new Date(dateString);
      const dtFormatada = date.toLocaleDateString();
      return `${dtFormatada}`;
    },
  },

  mounted() {
    this.getUsuarios();

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
}

.btn-novo-usuario {
  font-size: 16px;
  font-weight: 700;
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

.icone-dropdown {
  display: flex;
  justify-content: end;
  margin-right: 0px !important;
}

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