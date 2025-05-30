import mysql from "mysql";

const conexao = mysql.createConnection({
  host: "localhost",
  port: "3306",
  user: "root",
  password: "Dudu@thays240918",
  database: "bd_rota_locadora",
});

conexao.connect((err) => {
  if (err) {
    console.error("Erro ao conectar no banco de dados: ", err.stack);
    return
  }
  console.log("Banco de dados conectado");
});

export const consulta = (sql, valores='', mensagemReject) => {
  return new Promise((resolve, reject) => {
    conexao.query(sql, valores, (erro, resultado) => {
      if (erro) {
        console.error("Erro na consulta: ", erro);
        return reject(mensagemReject);
      }
      const row = JSON.parse(JSON.stringify(resultado))
      return resolve(row)
    });
  });
}

export default conexao;
