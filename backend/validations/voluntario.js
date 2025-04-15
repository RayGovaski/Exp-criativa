import Joi from "joi";

export const voluntarioSchema = Joi.object({
    nome: Joi.string().min(3).max(100).required(),
    cpf: Joi.string().length(11).required(),
    data_nascimento: Joi.date().less('now').required(),
    logradouro: Joi.string().allow(null, ''),
    numero_residencia: Joi.number().integer().positive().allow(null),
    cep: Joi.string().length(8).allow(null, ''),
    telefone: Joi.string().pattern(/^\d{10,15}$/).allow(null, ''),
    email: Joi.string().email().required(),
    nacionalidade: Joi.string().allow(null, ''),
    funcao_nome: Joi.string().required(),
    data_entrada: Joi.date().allow(null),
    disponibilidade: Joi.string().allow(null, ''),
    habilidades: Joi.string().allow(null, '')
});