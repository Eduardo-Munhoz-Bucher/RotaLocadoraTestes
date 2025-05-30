import { mount } from "@vue/test-utils";
//mount -> função usada para montar o componente em um ambiente de teste
import Vue from "vue";
import IndexPage from "@/pages/index.vue";
import Vuetify from "vuetify";

// Mock do toast -> Simula um serviço de notificações com métodos success e error.
const mockToast = {
  success: jest.fn(),
  error: jest.fn(),
};

// Mock do usuarioService -> Simula um serviço de logi com o método postUsuarioLogin, configurado para retornar um objeto com dados ficicios. O método mockResolvedValue simula uma promessa resolvida.
const mockUsuarioService = {
  postUsuarioLogin: jest.fn().mockResolvedValue({
    data: { usuario: { nome_user: "Eduardo Munhoz Bucher" } },
  }),
};

// Mock do $router
const mockRouter = {
  push: jest.fn(),
};

// Mock do $store
const mockStore = {
  commit: jest.fn(),
};

describe("IndexPage", () => {
  let wrapper;
  let vuetify;

  beforeEach(() => {
    vuetify = new Vuetify();
    Vue.use(Vuetify);

    wrapper = mount(IndexPage, {
      vuetify,
      mocks: {
        $toast: mockToast,
        $usuarioService: mockUsuarioService,
        $router: mockRouter,
        $store: mockStore,
      },
      stubs: [
        "NuxtLink",
        "v-text-field",
        "v-btn",
        "v-form",
        "v-container",
        "v-card",
        "v-card-text",
      ],
    });
  });

  afterEach(() => {
    wrapper.destroy();
    jest.clearAllMocks();
  });

  it("renderiza o formulário de login corretamente", () => {
    expect(wrapper.find(".formulario").exists()).toBe(true);
  });

  it("renderiza os campos de e-mail e senha", () => {
    const emailField = wrapper.find('v-text-field-stub[label="E-mail"]');
    const passwordField = wrapper.find('v-text-field-stub[label="Senha"]');
    expect(emailField.exists()).toBe(true);
    expect(passwordField.exists()).toBe(true);
  });

  it("permite atualizar o campo de e-mail", async () => {
    await wrapper.setData({
      formData: { email: "eduardo@rotaexata.com.br", senha: "" },
    });
    expect(wrapper.vm.formData.email).toBe("eduardo@rotaexata.com.br");
  });

  it("permite atualizar o campo de senha", async () => {
    await wrapper.setData({ formData: { email: "", senha: "eduardo123@" } });
    expect(wrapper.vm.formData.senha).toBe("eduardo123@");
  });

  it("chama o serviço de login ao clicar no botão Entrar", async () => {
    // Mock do método entrar para evitar setTimeout
    wrapper.vm.entrar = jest.fn(async function (e) {
      e.preventDefault();
      this.loading = true;

      try {
        const data = {
          email: this.formData.email,
          senha: this.formData.senha,
        };

        const response = await this.$usuarioService.postUsuarioLogin(data);
        this.$toast.success("Login realizado com sucesso!");
        this.$store.commit("auth/login", response.data.usuario.nome_user);
        this.$router.push({ path: "/veiculos" });
      } catch (error) {
        this.$toast.error(
          error.response?.data?.message || "Erro ao fazer login!"
        );
      }

      this.loading = false;
    });

    await wrapper.setData({
      formData: { email: "eduardo@rotaexata.com.br", senha: "eduardo123@" },
    });

    // Mock do evento para evitar erro com e.preventDefault()
    const mockEvent = { preventDefault: jest.fn() };
    await wrapper.vm.entrar(mockEvent);

    // Aguarda um pequeno delay para garantir que as promessas sejam resolvidas
    await new Promise((resolve) => setTimeout(resolve, 100));

    expect(mockUsuarioService.postUsuarioLogin).toHaveBeenCalledWith({
      email: "eduardo@rotaexata.com.br",
      senha: "eduardo123@",
    });
    expect(mockStore.commit).toHaveBeenCalledWith("auth/login", "Eduardo Munhoz Bucher");
    expect(mockToast.success).toHaveBeenCalledWith(
      "Login realizado com sucesso!"
    );
    expect(mockRouter.push).toHaveBeenCalledWith({ path: "/veiculos" });
  });

  it("exibe mensagem de erro se o login falhar", async () => {
    // Mock do método entrar para evitar setTimeout
    wrapper.vm.entrar = jest.fn(async function (e) {
      e.preventDefault();
      this.loading = true;

      try {
        const data = {
          email: this.formData.email,
          senha: this.formData.senha,
        };

        const response = await this.$usuarioService.postUsuarioLogin(data);
        this.$toast.success("Login realizado com sucesso!");
        this.$store.commit("auth/login", response.data.usuario.nome_user);
        this.$router.push({ path: "/veiculos" });
      } catch (error) {
        this.$toast.error(
          error.response?.data?.message || "Erro ao fazer login!"
        );
      }

      this.loading = false;
    });

    const errorMessage = "Credenciais inválidas";
    mockUsuarioService.postUsuarioLogin.mockRejectedValueOnce({
      response: { data: { message: errorMessage } },
    });

    await wrapper.setData({
      formData: { email: "eduardo@rotaexata.com.br", senha: "eduardo123@" },
    });

    // Mock do evento para evitar erro com e.preventDefault()
    const mockEvent = { preventDefault: jest.fn() };
    await wrapper.vm.entrar(mockEvent);

    // Aguarda um pequeno delay para garantir que as promessas sejam resolvidas
    await new Promise((resolve) => setTimeout(resolve, 100));

    expect(mockUsuarioService.postUsuarioLogin).toHaveBeenCalledWith({
      email: "eduardo@rotaexata.com.br",
      senha: "eduardo123@",
    });
    expect(mockToast.error).toHaveBeenCalledWith(errorMessage);
  });
});
