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


export const formatDateToMySQL = (dateString) => {
    // Se a entrada for nula, indefinida ou uma string vazia, retorna null.
    if (!dateString) {
        return null;
    }
  
    // Tenta criar um objeto de Data.
    // new Date('') ou new Date(null) criam objetos de data inválidos.
    const date = new Date(dateString);
  
    // Verifica se a data resultante é válida. 
    // Se não for, isNaN(date.getTime()) será verdadeiro.
    if (isNaN(date.getTime())) {
        return null; // Retorna null para qualquer data inválida
    }
  
    // Se a data for válida, formata para 'YYYY-MM-DD'
    const year = date.getUTCFullYear();
    const month = String(date.getUTCMonth() + 1).padStart(2, '0');
    const day = String(date.getUTCDate()).padStart(2, '0');
  
    return `${year}-${month}-${day}`;
};