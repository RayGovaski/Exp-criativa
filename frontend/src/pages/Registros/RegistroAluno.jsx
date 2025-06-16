import React, { useState } from "react";
import "./RegistroAluno.css"; // Certifique-se de que este CSS existe e está estilizado
import axios from 'axios';
import { useNavigate } from 'react-router-dom';
import { toast } from 'react-toastify';

const RegistroAluno = () => {
    const navigate = useNavigate();
    const [step, setStep] = useState(1);
    const [fileNames, setFileNames] = useState({
        aluno_foto: "Nenhum arquivo selecionado"
    });

    const [formData, setFormData] = useState({
        // Responsável (passo 1)
        responsavel_nome: "",
        responsavel_cpf: "",
        responsavel_data_nascimento: "",
        responsavel_sexo: "",
        responsavel_telefone: "",
        responsavel_email: "",
        responsavel_renda_familiar: "",
        responsavel_grau_parentesco: "",
        responsavel_cep: "",
        responsavel_logradouro: "",
        responsavel_bairro: "",
        responsavel_cidade: "",
        responsavel_estado: "",
        responsavel_numero_residencia: "",

        // Aluno (passo 2)
        aluno_nome: "",
        aluno_cpf: "",
        aluno_sexo: "",
        aluno_data_nascimento: "",
        aluno_email: "",
        aluno_senha: "",
        aluno_confirmar_senha: "",
        aluno_necessidades_especiais: "",
        aluno_foto: null
    });

    const handleChange = (e) => {
        const { name, value } = e.target;
        setFormData({ ...formData, [name]: value });
    };

    const handleCepChange = async (e) => {
        const cep = e.target.value.replace(/\D/g, '');
        setFormData({ ...formData, responsavel_cep: e.target.value });

        if (cep.length === 8) {
            try {
                const { data } = await axios.get(`https://viacep.com.br/ws/${cep}/json/`);
                if (data.erro) {
                    toast.error("CEP não encontrado.");
                } else {
                    setFormData(prevData => ({
                        ...prevData,
                        responsavel_logradouro: data.logradouro,
                        responsavel_bairro: data.bairro,
                        responsavel_cidade: data.localidade,
                        responsavel_estado: data.uf
                    }));
                    toast.success("Endereço preenchido!");
                }
            } catch (error) {
                toast.error("Erro ao buscar CEP. Verifique sua conexão.");
                console.error("Erro na API ViaCEP:", error);
            }
        }
    };

    const handleFileChange = (e) => {
        const { name, files } = e.target;
        if (files && files[0]) {
            setFormData({ ...formData, [name]: files[0] });
            setFileNames({ ...fileNames, [name]: files[0].name });
        }
    };

    const handleNext = (e) => {
        e.preventDefault();
        // Validações para o Passo 1 (Responsável)
        if (!formData.responsavel_nome || !formData.responsavel_cpf || !formData.responsavel_data_nascimento ||
            !formData.responsavel_sexo || !formData.responsavel_telefone || !formData.responsavel_email ||
            !formData.responsavel_cep || !formData.responsavel_logradouro || !formData.responsavel_numero_residencia) {
            toast.error("Por favor, preencha todos os campos obrigatórios do Responsável.");
            return;
        }
        const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
        if (!emailRegex.test(formData.responsavel_email)) {
            toast.error("Por favor, insira um e-mail válido para o Responsável.");
            return;
        }
    
        setStep(2);
        window.scrollTo(0, 0);
    };
    
    const handlePrevious = (e) => {
        e.preventDefault();
        setStep(1);
        window.scrollTo(0, 0);
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        
        // Validações para o Passo 2 (Aluno)
        if (!formData.aluno_nome || !formData.aluno_cpf || !formData.aluno_data_nascimento || 
            !formData.aluno_email || !formData.aluno_senha) {
            toast.error("Por favor, preencha todos os campos obrigatórios do Aluno.");
            return;
        }
        if (formData.aluno_senha !== formData.aluno_confirmar_senha) {
            toast.error("As senhas do Aluno não coincidem!");
            return;
        }
        if (formData.aluno_senha.length < 6) {
            toast.error("A senha do Aluno deve ter pelo menos 6 caracteres.");
            return;
        }

        const submitData = new FormData();
        for (const key in formData) {
            if (formData[key] !== null && formData[key] !== undefined) {
                submitData.append(key, formData[key]);
            }
        }

        try {
            // Ajuste a URL para a sua rota de backend
            await axios.post("http://localhost:8000/aluno/registro-aluno", submitData, {
                headers: {
                    'Content-Type': 'multipart/form-data'
                }
            });
            toast.success("Cadastro realizado com sucesso!");
            navigate("/login");
        } catch (err) {
            const errorMessage = err.response?.data?.error || "Erro ao cadastrar. Verifique os dados.";
            toast.error(errorMessage);
        }
    };

    // Componente de Input de Arquivo estilizado
    const FileInput = ({ name, label, onChange, required = false }) => {
        return (
            <div className="mb-2">
                <label className="label-rosa">{label}{required && <span className="text-danger">*</span>}</label>
                <div className="file-input-wrapper">
                    <div className="file-input-container">
                        <input
                            type="file"
                            name={name}
                            onChange={onChange}
                            className="file-input-rosa"
                            required={required}
                            accept="image/*" // Aceita apenas imagens
                        />
                        <div className="file-input-button">Escolher Arquivo</div>
                    </div>
                    <span className="file-name-display">{fileNames[name]}</span>
                </div>
            </div>
        );
    };

    return (
        <div className="d-flex justify-content-center align-items-center fundo-rosa" style={{ minHeight: "100vh" }}>
            <div className="registro-container-rosa">
                <div className="registro-header-rosa"></div>
                <div className="title-container">
                    <h3 className="text-center-rosa">
                        {step === 1 ? "Cadastro do Responsável" : "Cadastro do Aluno"}
                    </h3>
                    <div className="footer-line2-rosa"></div>
                    <div className="steps-indicator">
                        <span className={`step ${step === 1 ? "active" : ""}`}>1</span>
                        <span className="step-line"></span>
                        <span className={`step ${step === 2 ? "active" : ""}`}>2</span>
                    </div>
                </div>

                <form className="registro-form-rosa p-3" onSubmit={handleSubmit}>
                    {step === 1 ? (
                        // Passo 1: Formulário do Responsável
                        <>
                            <div className="mb-2"><label className="label-rosa">Nome completo: *</label><input type="text" name="responsavel_nome" value={formData.responsavel_nome} onChange={handleChange} required /></div>
                            <div className="mb-2"><label className="label-rosa">CPF: *</label><input type="text" name="responsavel_cpf" value={formData.responsavel_cpf} onChange={handleChange} placeholder="000.000.000-00" required /></div>
                            <div className="mb-2"><label className="label-rosa">Data de nascimento: *</label><input type="date" name="responsavel_data_nascimento" value={formData.responsavel_data_nascimento} onChange={handleChange} required /></div>
                            <div className="mb-2"><label className="label-rosa">Sexo: *</label><select name="responsavel_sexo" value={formData.responsavel_sexo} onChange={handleChange} className="select-rosa" required><option value="">Selecione</option><option value="M">Masculino</option><option value="F">Feminino</option><option value="Outro">Outro</option></select></div>
                            <div className="mb-2"><label className="label-rosa">Telefone: *</label><input type="text" name="responsavel_telefone" value={formData.responsavel_telefone} onChange={handleChange} placeholder="(00) 00000-0000" required /></div>
                            <div className="mb-2"><label className="label-rosa">Email: *</label><input type="email" name="responsavel_email" value={formData.responsavel_email} onChange={handleChange} required /></div>
                            <div className="mb-2"><label className="label-rosa">Renda familiar:</label><input type="text" name="responsavel_renda_familiar" value={formData.responsavel_renda_familiar} onChange={handleChange} placeholder="R$ 0,00" /></div>
                            <div className="mb-2"><label className="label-rosa">Grau de parentesco:</label><select name="responsavel_grau_parentesco" value={formData.responsavel_grau_parentesco} onChange={handleChange} className="select-rosa"><option value="">Selecione</option><option value="Mãe/Pai">Mãe/Pai</option><option value="Avó/Avô">Avó/Avô</option><option value="Outros">Outro</option></select></div>
                            <div className="mb-2"><label className="label-rosa">CEP: *</label><input type="text" name="responsavel_cep" value={formData.responsavel_cep} onChange={handleCepChange} placeholder="00000-000" maxLength="9" required /></div>
                            <div className="mb-2"><label className="label-rosa">Logradouro: *</label><input type="text" name="responsavel_logradouro" value={formData.responsavel_logradouro} onChange={handleChange} required /></div>
                            <div className="mb-2"><label className="label-rosa">Bairro: *</label><input type="text" name="responsavel_bairro" value={formData.responsavel_bairro} onChange={handleChange} required /></div>
                            <div className="mb-2"><label className="label-rosa">Cidade: *</label><input type="text" name="responsavel_cidade" value={formData.responsavel_cidade} onChange={handleChange} required /></div>
                            <div className="mb-2"><label className="label-rosa">Estado: *</label><input type="text" name="responsavel_estado" value={formData.responsavel_estado} onChange={handleChange} required /></div>
                            <div className="mb-2"><label className="label-rosa">Número da residência: *</label><input type="text" name="responsavel_numero_residencia" value={formData.responsavel_numero_residencia} onChange={handleChange} required /></div>

                            <div className="button-container-rosa">
                                <button type="button" className="custom-button-rosa" onClick={handleNext}>Próximo</button>
                            </div>
                        </>
                    ) : (
                        // Passo 2: Formulário do Aluno
                        <>
                            <div className="mb-2"><label className="label-rosa">Nome completo: *</label><input type="text" name="aluno_nome" value={formData.aluno_nome} onChange={handleChange} required /></div>
                            <div className="mb-2"><label className="label-rosa">CPF: *</label><input type="text" name="aluno_cpf" value={formData.aluno_cpf} onChange={handleChange} placeholder="000.000.000-00" required /></div>
                            <div className="mb-2"><label className="label-rosa">Data de nascimento: *</label><input type="date" name="aluno_data_nascimento" value={formData.aluno_data_nascimento} onChange={handleChange} required /></div>
                            <div className="mb-2"><label className="label-rosa">Sexo: *</label><select name="aluno_sexo" value={formData.aluno_sexo} onChange={handleChange} className="select-rosa" required><option value="">Selecione</option><option value="M">Masculino</option><option value="F">Feminino</option><option value="Outro">Outro</option></select></div>
                            <div className="mb-2"><label className="label-rosa">Email: *</label><input type="email" name="aluno_email" value={formData.aluno_email} onChange={handleChange} required /></div>
                            <div className="mb-2"><label className="label-rosa">Senha: *</label><input type="password" name="aluno_senha" value={formData.aluno_senha} onChange={handleChange} required /></div>
                            <div className="mb-2"><label className="label-rosa">Confirmar senha: *</label><input type="password" name="aluno_confirmar_senha" value={formData.aluno_confirmar_senha} onChange={handleChange} required /></div>
                            <div className="mb-2"><label className="label-rosa">Necessidades especiais:</label><textarea name="aluno_necessidades_especiais" value={formData.aluno_necessidades_especiais} onChange={handleChange} className="textarea-rosa" placeholder="Descreva se houver" /></div>
                            <FileInput name="aluno_foto" label="Foto do aluno:" onChange={handleFileChange} />

                            <div className="button-container-rosa">
                                <button type="button" className="secondary-button-rosa" onClick={handlePrevious}>Voltar</button>
                                <button type="submit" className="custom-button-rosa">Registrar</button>
                            </div>
                        </>
                    )}
                </form>
            </div>
        </div>
    );
};

export default RegistroAluno;