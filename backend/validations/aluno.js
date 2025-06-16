import Joi from "joi";

export const alunoSchema = Joi.object({
    nome: Joi.string().min(3).max(100).required(),
    cpf: Joi.string().length(11).required(),
    rg: Joi.string().allow('', null),
    sexo: Joi.string().valid('M', 'F', 'Outro').required(),
    data_nascimento: Joi.date().less('now').required(),
    nacionalidade: Joi.string().allow('', null),
    telefone: Joi.string().pattern(/^\d{10,15}$/).allow('', null),
    email: Joi.string().email().required(),
    senha: Joi.string().min(6).required(),
    necessidades_especiais: Joi.string().allow('', null),
    responsavel_id: Joi.number().integer().positive().required()
});
