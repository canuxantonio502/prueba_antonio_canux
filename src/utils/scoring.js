function calcularPuntaje({
    aExperiencia,
    expMinima,
    fuente,
    carta = "",
    postulacionesActivas
}) {
    let puntaje = 0;

    // Experiencia: años del candidato >= mínimos exigidos
    if (aExperiencia >= expMinima) {
        puntaje += 4;
    }

    // Fuente de la postulación
    if (fuente === 'REFERRAL') {
        puntaje += 3;
    } else if (fuente === 'INTERNAL') {
        puntaje += 2;
    }

    // 3. Palabras clave en la carta de presentación
    const cartaMinusculas = carta.toLowerCase();
    if (cartaMinusculas.includes('node') || cartaMinusculas.includes('sql') || cartaMinusculas.includes('api')) {
        puntaje += 2;
    }

    // 4. Longitud de la carta (más de 500 caracteres)
    if (carta.length > 500) {
        puntaje += 1;
    }

    // 5. Penalización por postulaciones activas en otras vacantes
    if (postulacionesActivas >= 3) {
        puntaje -= 2;
    }

    // 6. El puntaje total nunca puede ser negativo
    if (puntaje < 0) {
        puntaje = 0;
    }

    // 7. Cálculo de prioridad basado en el puntaje final
    let prioridad = 'LOW';
    if (puntaje >= 0 && puntaje <= 2) {
        prioridad = 'LOW';
    } else if (puntaje >= 3 && puntaje <= 4) {
        prioridad = 'MEDIUM';
    } else if (puntaje >= 5 && puntaje <= 6) {
        prioridad = 'HIGH';
    } else if (puntaje >= 7) {
        prioridad = 'TOP';
    }

    return { puntaje, prioridad };
}

module.exports = { calcularPuntaje };