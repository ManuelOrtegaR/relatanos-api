import nodemailer from "nodemailer";
import { EmailStructure } from "./types.ts";

export const transporter = nodemailer.createTransport({

  host: 'smtp.gmail.com',

  port: 465,
  secure: true, // upgrade later with STARTTLS
  auth: {
    user: process.env.NODEMAILER_EMAIL_SENDER,
    pass: process.env.NODEMAILER_PASSWORD_SENDER,
  },
});

export const emailStructure = ({ contactEmail, answer }: EmailStructure) => {
  return {
    from: `RELATANOS TEAM ${process.env.EMAIL_SENDER}`,
    to: contactEmail,
    subject: 'Correo de verificación de cuenta',
    text: 'Tu usuario se ha creado satisfactoriamente',
    html: `   <table style="width: 100%; height: 100%; background-color: #f2f2f2; padding: 0; margin: 0;">
                  <tr>
                    <td align="center" valign="top">
                      <img src="https://res.cloudinary.com/db9nfgjqr/image/upload/v1698162482/site_images/the_garage_logo.png" alt="logo" border="0" width="200">
                    </td>
                    <td align="center" valign="top">
                      <body>
                          <h1>¡Bienvenido a THE GARAGE!</h1>
                          <p>Gracias por registrarte en nuestro sitio web. Para completar el proceso de registro, haz clic en el siguiente enlace:</p>
                          <p>${answer}.</p>
                          <p>Atentamente,</p>
                          <p>El equipo de THE GARAGE</p>
                      </body>
                    </td>
                  </tr>
                </table>
      `,
  }
};
