from notificacion import enviar_notificaciones_masivas

if __name__ == "__main__":
    destinatarios = [
        "nihil.ifs@gmail.com",
    ]

    enviar_notificaciones_masivas(
        subject="Prueba de notificación masiva",
        body="Este es un correo de prueba enviado desde el scraper usando Mailhog.",
        recipients=destinatarios,
    )
