-- Index
CREATE INDEX idx_ap_planoId ON Apoiador_Plano(planoId);

CREATE INDEX idx_cp_turma_id ON Controle_Presenca(turma_id);
CREATE INDEX idx_cp_aluno_id ON Controle_Presenca(aluno_id);

CREATE INDEX idx_ad_apoiador_id ON Apoiador_Doacao(apoiador_id);
CREATE INDEX idx_ad_doacao_id ON Apoiador_Doacao(doacao_id);

CREATE INDEX idx_doacao_status ON Doacao(status);

-- Mostra a qtd de planos ativos e o valor total arrecadado com esses planos
DELIMITER //

CREATE PROCEDURE ObterResumoPlanos()
BEGIN
    SELECT 
        COUNT(*) AS quantidade_planos_ativos,
        SUM(p.preco) AS total_arrecadado
    FROM 
        Apoiador_Plano ap
    JOIN 
        Plano p ON ap.planoId = p.id;
END //

DELIMITER ;

CALL ObterResumoPlanos();


--Mostrar a frequência de cada aluno em determinada turma.
DELIMITER $$

CREATE PROCEDURE RelatorioFrequenciaPorTurma(IN turma_id INT)
BEGIN
    SELECT 
        a.nome AS aluno,
        t.nome AS turma,
        COUNT(cp.id) AS total_aulas,
        SUM(cp.presenca) AS presencas,
        ROUND(SUM(cp.presenca) / COUNT(cp.id) * 100, 2) AS percentual_presenca
    FROM Controle_Presenca cp
    INNER JOIN Aluno a ON cp.aluno_id = a.id
    INNER JOIN Turma t ON cp.turma_id = t.id
    WHERE cp.turma_id = turma_id
    GROUP BY a.id, t.id;
END$$

DELIMITER ;
CALL RelatorioFrequenciaPorTurma(1);

-- Mostrar quanto cada apoiador doou no total e para quais campanhas.
DELIMITER $$

CREATE PROCEDURE RelatorioDoacoesPorApoiador()
BEGIN
    SELECT 
        ad.apoiador_id,
        ap.nome AS nome_apoiador,
        GROUP_CONCAT(d.nome SEPARATOR ', ') AS campanhas,
        COUNT(ad.doacao_id) AS qtd_doacoes,
        SUM(ad.valor_doado) AS total_doado
    FROM Apoiador_Doacao ad
    INNER JOIN Apoiador ap ON ap.id = ad.apoiador_id
    INNER JOIN Doacao d ON d.id = ad.doacao_id
    GROUP BY ad.apoiador_id;
END$$

DELIMITER ;


--Resumo de Doações por Status com Total da Meta
DELIMITER $$

CREATE PROCEDURE RelatorioResumoDoacoesComMeta(
    IN statusFiltro VARCHAR(20)
)
BEGIN
    SET @sql = '
        SELECT 
            d.status,
            COUNT(d.id) AS total_campanhas,
            SUM(d.arrecadado) AS total_arrecadado,
            SUM(d.valor_meta) AS total_meta
        FROM Doacao d
        WHERE 1 = 1
    ';

    IF statusFiltro IS NOT NULL AND statusFiltro != '' THEN
        SET @sql = CONCAT(@sql, ' AND d.status = ?');
    END IF;

    SET @sql = CONCAT(@sql, ' GROUP BY d.status');

    PREPARE stmt FROM @sql;

    IF statusFiltro IS NOT NULL AND statusFiltro != '' THEN
        SET @param = statusFiltro;
        EXECUTE stmt USING @param;
    ELSE
        EXECUTE stmt;
    END IF;

    DEALLOCATE PREPARE stmt;
END$$

DELIMITER ;

CALL RelatorioResumoDoacoesComMeta('Encerrada');

