export function validate(schema) {
    return (req, res, next) => {
        const { error } = schema.validate(req.body, { abortEarly: false });

        if (error) {
            const mensagens = error.details.map(detail => detail.message);
            return res.status(400).json({ erro: mensagens });
        }

        next();
    };
}