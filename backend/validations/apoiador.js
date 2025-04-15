import Joi from "joi";

export const apoiadorSchema = Joi.object({
    nome: Joi.string().min(3).max(100).required(),
    cpf: Joi.string().length(11).required(),
    email: Joi.string().email().required(),
    senha: Joi.string().min(6).required(),
    data_nascimento: Joi.date().less('now').required(),
    telefone: Joi.string().pattern(/^\d{10,15}$/).allow(null, ''),
    plano_nome: Joi.string().allow(null, ''),
    notificacoes: Joi.boolean().default(true)
});
