import Joi from "joi";

export const professorSchema = Joi.object({
    nome: Joi.string().min(3).max(100).required(),
    cpf: Joi.string().length(11).required(),
    sexo: Joi.string().valid('M', 'F', 'Outro').required(),
    data_nascimento: Joi.date().less('now').required(),
    logradouro: Joi.string().allow(null, ''),
    numero_residencia: Joi.number().integer().positive().allow(null),
    cep: Joi.string().length(8).allow(null, ''),
    telefone: Joi.string().pattern(/^\d{10,15}$/).allow(null, ''),
    email: Joi.string().email().required(),
    nacionalidade: Joi.string().allow(null, ''),
    graduacao: Joi.string().allow(null, ''),
    curriculo: Joi.string().allow(null, ''),
    data_contratacao: Joi.date().allow(null),
    tipo_contrato: Joi.string().allow(null, ''),
    salario: Joi.number().precision(2).min(0).allow(null)
});