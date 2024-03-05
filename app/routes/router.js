const express = require("express");
const router = express.Router();
const moment = require("moment");
const tarefasController = require("../controllers/tarefasController");

router.get("/",  function (req, res) {
   tarefasController.listarTarefasPaginadas(req, res);
});

router.get("/editar", function (req, res) {
  tarefasController.exibirTarefaId(req, res);
});

router.get("/excluir", function (req, res) {
  tarefasController.excluirTarefa(req, res);
});

router.get("/finalizar", function (req, res) {
  tarefasController.finalizarTarefa(req, res);
});

router.get("/iniciar", function (req, res) {
  tarefasController.iniciarTarefa(req, res);
});

router.get("/adicionar", function (req, res) {
  res.locals.moment = moment;
  res.render("pages/adicionar", { dados: null, listaErros: null });
});

router.post("/adicionar", tarefasController.regrasValidacao, function (req, res) {
    tarefasController.adicionarTarefa(req, res);
  }
);


module.exports = router;

