import Joi from 'joi';

export const responsavelSchema = Joi.object({
    nome: Joi.string().min(3).max(100).required(),
    cpf: Joi.string().length(11).required(),
    sexo: Joi.string().valid('M', 'F', 'Outro').required(),
    data_nascimento: Joi.date().less('now').required(),
    telefone: Joi.string().pattern(/^\d{10,15}$/).required(),
    email: Joi.string().email().required(),
    logradouro: Joi.string().required(),
    numero_residencia: Joi.number().integer().positive().required(),
    cep: Joi.string().length(8).required(),
    grau_parentesco: Joi.string().allow(null, ''),
    profissao: Joi.string().allow(null, ''),
    renda_familiar: Joi.number().precision(2).min(0).allow(null)
});