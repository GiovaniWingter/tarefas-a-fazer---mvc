const tarefasModel = require("../models/tarefasModel");
const moment = require("moment");
const { body, validationResult } = require("express-validator");
const tarefasController = {
  
  regrasValidacao: [
   body("tarefa").isLength({ min: 5, max: 45 }).withMessage("Nome da tarefa deve ter de 5 a 45 caracteres!"),
        body("situacao").isInt({ min: 0, max: 4 }).withMessage("Situação deve ser um inteiro de 0 a 4"),
        body("prazo").isISO8601().withMessage("A data deve ser válida!"),
        body("prazo").custom((value) => {
            moment.locale('en')
            let hoje = moment().format("L");
            let prazo = moment(value).format("L");
            moment.locale('pt-br');
            if (moment(prazo).isSameOrAfter(hoje)) {
                return true;
            } else {
                throw new Error("A data deve ser hoje ou no futuro!");
            }

        }),
  ],

  listarTarefas: async (req, res) => {
    res.locals.moment = moment;
    //recuperar a página solicitada caso não exista será a página 1
    let paginaAtual = req.query.pagina == undefined ? 1 : req.query.pagina;
    //definir a qtde de registros por página
    let qtdePagina = 5;
    //definir o offset em relação a pagina atual
    let offset = (paginaAtual - 1) * qtdePagina;
    //definir o número de páginas de resultados
    let totalPaginas = Math.ceil(await tarefasModel.totRegistros() / qtdePagina);

    if (totalPaginas > 1) {
      var paginador = { "paginaAtual": paginaAtual, "totalPaginas": totalPaginas }
    } else {
      var paginador = null
    }

    try {
      const linhas = await tarefasModel.findAll(offset, qtdePagina);
      res.render("pages/index", { tarefas: linhas, "notificador": paginador });
    } catch (e) {
      console.log(e); // exibir os erros no console do vs code
      res.json({ erro: "Falha ao acessar dados" });
    }
  },

  adicionarTarefa: async (req, res) => {
    res.locals.moment = moment;
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      console.log(errors);
      return res.render("pages/adicionar", {
        dados: req.body,
        listaErros: errors,
      });
    }
    var dadosForm = {
      nome_tarefa: req.body.tarefa,
      prazo_tarefa: req.body.prazo,
      situacao_tarefa: req.body.situacao,
    };
    let id_tarefa = req.body.id_tarefa;
    try {
      if (id_tarefa == "") {
        results = await tarefasModel.create(dadosForm);
      } else {
        results = await tarefasModel.update(dadosForm, id_tarefa);
      }
      res.redirect("/");
    } catch (e) {
      console.log(e);
      res.json({ erro: "Falha ao acessar dados" });
    }
  },

  excluirTarefa: async (req, res) => {
    let { id } = req.query;
    try {
      results = await tarefasModel.delete(id);
      res.redirect("/");
    } catch (e) {
      console.log(e);
      res.json({ erro: "Falha ao acessar dados" });
    }
  },

  finalizarTarefa: async (req, res) => {
    let { id } = req.query;
    try {
      results = await tarefasModel.sistuacaoTarefa(2, id);
      res.redirect("/");
    } catch (e) {
      console.log(e);
      res.json({ erro: "Falha ao acessar dados" });
    }
  },

  exibirTarefaId: async (req, res) => {
    res.locals.moment = moment;
    let { id } = req.query;
    console.log(id);
    try {
      let tarefa = await tarefasModel.findId(id);
      res.render("pages/adicionar", {
        dados: {
          id_tarefa: id,
          tarefa: tarefa[0].nome_tarefa,
          prazo: tarefa[0].prazo_tarefa,
          situacao: tarefa[0].situacao_tarefa,
        },
        listaErros: null,
      });
    } catch (e) {
      console.log(e);
      res.json({ erro: "Falha ao acessar dados" });
    }
  },

  iniciarTarefa: async (req, res) => {
    let { id } = req.query;
    try {
      results = await tarefasModel.sistuacaoTarefa(1, id);
      res.redirect("/");
    } catch (e) {
      console.log(e);
      res.json({ erro: "Falha ao acessar dados" });
    }
  },
};

module.exports = tarefasController;
