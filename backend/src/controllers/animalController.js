import * as animalModel from "../models/animalModel.js";
import * as clienteModel from "../models/clienteModel.js";

const idFrom = (value) => (/^\d+$/.test(value) ? Number(value) : null);
const validate = (body) =>
  body.nome &&
  body.especie &&
  Number.isInteger(body.idade) &&
  body.idade >= 0 &&
  Number.isInteger(body.cliente_id);

const allowed = async (req, clienteId) =>
  req.user.perfil === "ADM" ||
  clienteModel.belongsToUser(clienteId, req.user.id);

export const listar = async (req, res) => {
  try {
    const animais = await animalModel.findAll({
      nome: req.query.nome,
      usuarioId: req.user.id,
      isAdmin: req.user.perfil === "ADM",
    });
    return res.status(200).json(animais);
  } catch (error) {
    console.error("Erro ao listar animais:", error);
    return res.status(500).json({ mensagem: "Erro interno do servidor" });
  }
};

export const buscarPorId = async (req, res) => {
  try {
    const id = idFrom(req.params.id);
    if (!id) return res.status(400).json({ mensagem: "ID inválido" });
    const animal =
      req.user.perfil === "ADM"
        ? await animalModel.findById(id)
        : await animalModel.findByIdForUser(id, req.user.id);
    if (!animal)
      return res
        .status(req.user.perfil === "ADM" ? 404 : 403)
        .json({ mensagem: "Animal não encontrado ou sem permissão" });
    return res.status(200).json(animal);
  } catch (error) {
    console.error("Erro ao buscar animal:", error);
    return res.status(500).json({ mensagem: "Erro interno do servidor" });
  }
};

export const criar = async (req, res) => {
  try {
    if (!validate(req.body))
      return res
        .status(400)
        .json({
          mensagem:
            "Nome, espécie, idade e cliente_id válidos são obrigatórios",
        });
    if (!(await allowed(req, req.body.cliente_id)))
      return res
        .status(403)
        .json({ mensagem: "Você só pode cadastrar animais para seu cliente" });
    if (!(await clienteModel.findById(req.body.cliente_id)))
      return res.status(404).json({ mensagem: "Cliente não encontrado" });
    return res
      .status(201)
      .json(
        await animalModel.create({
          ...req.body,
          clienteId: req.body.cliente_id,
        }),
      );
  } catch (error) {
    console.error("Erro ao criar animal:", error);
    return res.status(500).json({ mensagem: "Erro interno do servidor" });
  }
};

export const atualizar = async (req, res) => {
  try {
    const id = idFrom(req.params.id);
    if (!id || !validate(req.body))
      return res.status(400).json({ mensagem: "Dados do animal inválidos" });
    const atual =
      req.user.perfil === "ADM"
        ? await animalModel.findById(id)
        : await animalModel.findByIdForUser(id, req.user.id);
    if (!atual)
      return res
        .status(req.user.perfil === "ADM" ? 404 : 403)
        .json({ mensagem: "Animal não encontrado ou sem permissão" });
    if (!(await allowed(req, req.body.cliente_id)))
      return res
        .status(403)
        .json({ mensagem: "Você só pode mover animais para seu cliente" });
    if (!(await clienteModel.findById(req.body.cliente_id)))
      return res.status(404).json({ mensagem: "Cliente não encontrado" });
    return res
      .status(200)
      .json(
        await animalModel.update(id, {
          ...req.body,
          clienteId: req.body.cliente_id,
        }),
      );
  } catch (error) {
    console.error("Erro ao atualizar animal:", error);
    return res.status(500).json({ mensagem: "Erro interno do servidor" });
  }
};

export const remover = async (req, res) => {
  try {
    const id = idFrom(req.params.id);
    if (!id) return res.status(400).json({ mensagem: "ID inválido" });
    const atual =
      req.user.perfil === "ADM"
        ? await animalModel.findById(id)
        : await animalModel.findByIdForUser(id, req.user.id);
    if (!atual)
      return res
        .status(req.user.perfil === "ADM" ? 404 : 403)
        .json({ mensagem: "Animal não encontrado ou sem permissão" });
    await animalModel.remove(id);
    return res.status(204).send();
  } catch (error) {
    console.error("Erro ao remover animal:", error);
    return res.status(500).json({ mensagem: "Erro interno do servidor" });
  }
};
