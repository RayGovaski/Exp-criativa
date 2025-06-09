export const validateCPF = (cpf) => {
    const cleanCpf = cpf.replace(/\D/g, '');
    return cleanCpf.length === 11;
};

export const validateEmail = (email) => {
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return emailRegex.test(email);
};

export const cleanPhone = (phone) => {
    return phone.replace(/[^\d+]/g, '');
};

export const formatDateToMySQL = (date) => {
    return new Date(date).toISOString().split('T')[0];
};

