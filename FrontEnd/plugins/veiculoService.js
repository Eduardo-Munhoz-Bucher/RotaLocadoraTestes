import { VeiculoService } from "~/services/veiculoService";

export default ({$axios}, inject) => {
  const veiculoService = new VeiculoService($axios)  
  inject('veiculoService', veiculoService)
}