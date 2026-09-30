const { calcularPuntaje } = require('../utils/puntaje');
const db = require('../config/db');

const crearPostulacion = async (req, res) => {
    try {
        const { candidato_id, vacante_id, carta, fuente } = req.body;

        // 1. Validar datos obligatorios
        if (!candidato_id || !vacante_id || !fuente) {
            return res.status(400).json({ error: "candidato_id, vacante_id y fuente son obligatorios" });
        }

        // 2. Validar fuente contra la lista permitida
        const fuentesPermitidas = ['REFERRAL', 'INTERNAL', 'JOB_BOARD', 'OTHER'];
        if (!fuentesPermitidas.includes(fuente)) {
            return res.status(400).json({ error: "Fuente no permitida" });
        }

        // 3. Verificar que el candidato existe
        const [candidatos] = await db.query('SELECT a_experiencia FROM candidatos WHERE id = ?', [candidato_id]);
        if (candidatos.length === 0) {
            return res.status(404).json({ error: "Candidato no encontrado" });
        }
        const candidatoExperiencia = candidatos[0].a_experiencia;

        // 4. Verificar que la vacante existe y está OPEN
        const [vacantes] = await db.query('SELECT exp_minima, estado FROM vacantes WHERE id = ?', [vacante_id]);
        if (vacantes.length === 0) {
            return res.status(404).json({ error: "Vacante no encontrada" });
        }
        if (vacantes[0].estado !== 'OPEN') {
            return res.status(409).json({ error: "La vacante no se encuentra abierta" });
        }
        const vacanteExpMinima = vacantes[0].exp_minima;

        // 5. Regla de duplicidad
        const [postulacionesPrevias] = await db.query(
            'SELECT estado, actualizacion_estado FROM postulaciones WHERE candidato_id = ? AND vacante_id = ? ORDER BY actualizacion_estado DESC',
            [candidato_id, vacante_id]
        );

        if (postulacionesPrevias.length > 0) {
            const ultimaPostulacion = postulacionesPrevias[0];
            
            // Rechazar si está en RECEIVED, IN_REVIEW o HIRED
            if (['RECEIVED', 'IN_REVIEW', 'HIRED'].includes(ultimaPostulacion.estado)) {
                return res.status(409).json({ error: "Ya existe una postulación activa o fue contratado para esta vacante" });
            }

            // Si fue REJECTED, verificar que hayan pasado al menos 30 días desde la actualización
            if (ultimaPostulacion.estado === 'REJECTED') {
                const fechaRechazo = new Date(ultimaPostulacion.actualizacion_estado);
                const hoy = new Date();
                const diasTranscurridos = Math.floor((hoy - fechaRechazo) / (1000 * 60 * 60 * 24));

                if (diasTranscurridos < 30) {
                    return res.status(409).json({ error: `Debes esperar 30 días desde el rechazo. Han pasado ${diasTranscurridos} días.` });
                }
            }
        }

        // 6. Consultar cantidad de postulaciones activas del candidato en OTRAS vacantes
        const [activasOtras] = await db.query(
            `SELECT COUNT(*) as totalActivas FROM postulaciones 
             WHERE candidato_id = ? AND vacante_id != ? AND estado IN ('RECEIVED', 'IN_REVIEW')`,
            [candidato_id, vacante_id]
        );
        const postulacionesActivas = activasOtras[0].totalActivas;

        // 7. Calcular puntaje y prioridad usando la función pura
        const { puntaje, prioridad } = calcularPuntaje({
            aExperiencia: candidatoExperiencia,
            expMinima: vacanteExpMinima,
            fuente,
            carta: carta || "",
            postulacionesActivas
        });

        // 8. Guardar con estado inicial RECEIVED 
        const [resultado] = await db.query(
            `INSERT INTO postulaciones (candidato_id, vacante_id, carta, fuente, puntaje, prioridad, estado) 
             VALUES (?, ?, ?, ?, ?, ?, 'RECEIVED')`,
            [candidato_id, vacante_id, carta || "", fuente, puntaje, prioridad]
        );

        // 9. Devolver 201 con la postulación creada[cite: 5, 14]
        res.status(201).json({
            message: "Postulación creada con éxito",
            postulacion: {
                id: resultado.insertId,
                candidato_id,
                vacante_id,
                fuente,
                puntaje,
                prioridad,
                estado: 'RECEIVED'
            }
        });

    } catch (error) {
        console.error(error);
        res.status(500).json({ error: "Error interno del servidor" }); //[cite: 4]
    }
};

module.exports = { crearPostulacion };