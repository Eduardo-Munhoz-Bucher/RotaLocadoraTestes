export const state = () => ({
  loggedIn: process.browser ? !!localStorage.getItem('loggedIn') : false,
  userName: process.browser ? localStorage.getItem('userName') || null : null,
});

//Mutations são funções responsáveis por modificar o estado

export const mutations = {
  login(state, userName) {
    state.loggedIn = true;
    state.userName = userName;
    if (process.browser) {
      localStorage.setItem('loggedIn', true);
      localStorage.setItem('userName', userName);
    }
  },
  logout(state) {
    state.loggedIn = false;
    if (process.browser) {
      localStorage.removeItem("loggedIn");
      localStorage.removeItem("userName");
    }
  },
};

export const getters = {
  userName: (state) => state.userName || "Usuário não autentificado",
}