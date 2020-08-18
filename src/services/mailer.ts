import nodemailer from 'nodemailer'

// @ts-ignore
import hbs from 'nodemailer-express-handlebars'
import path from 'path'

const { MAILER_HOST, MAILER_PASSWORD, MAILER_USER } = process.env

const mailer = nodemailer.createTransport({
  // @ts-ignore
  host: MAILER_HOST,
  secure: true,
  secureConnection: false, // TLS requires secureConnection to be false
  tls: {
    ciphers: 'SSLv3',
  },
  requireTLS: true,
  port: 465,
  debug: true,
  auth: {
    user: MAILER_USER,
    pass: MAILER_PASSWORD,
  },
})

export function templateValidateAccount(token: string) {
  return `<!DOCTYPE html>
<html lang="en-US">
  <head>
    <meta content="text/html; charset=utf-8" http-equiv="Content-Type" />
    <title>Validate Account Email Template</title>
    <meta name="description" content="Validate Account Email Template." />
    <style type="text/css">
      a:hover {
        text-decoration: underline !important;
      }
    </style>
  </head>

  <body
    marginheight="0"
    topmargin="0"
    marginwidth="0"
    style="margin: 0px; background-color: #8257e5;"
    leftmargin="0"
  >
    <!--100% body table-->
    <table
      cellspacing="0"
      border="0"
      cellpadding="0"
      width="100%"
      bgcolor="#8257e5"
      style="
        @import url(
          https://fonts.googleapis.com/css?family=Rubik:300,
          400,
          500,
          700|Open + Sans:300,
          400,
          600,
          700
        );
        font-family: 'Open Sans', sans-serif;
      "
    >
      <tr>
        <td>
          <table
            style="background-color: #8257e5; max-width: 670px; margin: 0 auto;"
            width="100%"
            border="0"
            align="center"
            cellpadding="0"
            cellspacing="0"
          >
            <tr>
              <td style="height: 80px;">&nbsp;</td>
            </tr>
            <tr>
              <td style="text-align: center;">
                <a href="https://proffys.tk" title="logo" target="_blank">
                  <img src="https://github.com/devbaraus/NLW2_ProffyWeb/blob/master/src/assets/images/logo.png?raw=true" alt="logo">
                </a>
              </td>
            </tr>
            <tr>
              <td style="height: 20px;">&nbsp;</td>
            </tr>
            <tr>
              <td>
                <table
                  width="95%"
                  border="0"
                  align="center"
                  cellpadding="0"
                  cellspacing="0"
                  style="
                    max-width: 670px;
                    background: #fff;
                    border-radius: 3px;
                    text-align: center;
                    -webkit-box-shadow: 0 6px 18px 0 rgba(0, 0, 0, 0.06);
                    -moz-box-shadow: 0 6px 18px 0 rgba(0, 0, 0, 0.06);
                    box-shadow: 0 6px 18px 0 rgba(0, 0, 0, 0.06);
                  "
                >
                  <tr>
                    <td style="height: 40px;">&nbsp;</td>
                  </tr>
                  <tr>
                    <td style="padding: 0 35px;">
                      <h1
                        style="
                          color: #1e1e2d;
                          font-weight: 500;
                          margin: 0;
                          font-size: 32px;
                          font-family: 'Rubik', sans-serif;
                        "
                      >
                        Você criou uma conta na Proffy!
                      </h1>
                      <span
                        style="
                          display: inline-block;
                          vertical-align: middle;
                          margin: 29px 0 26px;
                          border-bottom: 1px solid #cecece;
                          width: 100px;
                        "
                      ></span>
                      <p
                        style="
                          color: #455056;
                          font-size: 15px;
                          line-height: 24px;
                          margin: 0;
                        "
                      >
                        Você acaba de criar um conta nova na Proffy. Antes de começar
                        usar nossa platforma precisamos que você valide sua conta.
                        Para validar sua conta clique no link ou botão abaixo.
                        
                      </p>
                      <span style="margin: 1rem 0;"><strong>${token}</strong></span>
                      <p
                        style="
                          color: #455056;
                          font-size: 15px;
                          line-height: 24px;
                          margin: 1rem 0;
                        "
                      >
                        ${
                          process.env.NODE_ENV === 'production'
                            ? 'https://proffy.baraus.dev'
                            : 'http://localhost:3000'
                        }/validate-account?token=${token}
                      </p>
                      <a
                        href="${
                          process.env.NODE_ENV === 'production'
                            ? 'https://proffy.baraus.dev'
                            : 'http://localhost:3000'
                        }/validate-account?token=${token}"
                        style="
                          background:#04bf58;
                          text-decoration: none !important;
                          font-weight: 500;
                          margin-top: 35px;
                          color: #fff;
                          text-transform: uppercase;
                          font-size: 14px;
                          padding: 10px 24px;
                          display: inline-block;
                          border-radius: 4px;
                        "
                        >Validar Conta</a
                      >
                    </td>
                  </tr>
                  <tr>
                    <td style="height: 40px;">&nbsp;</td>
                  </tr>
                </table>
              </td>
            </tr>

            <tr>
              <td style="height: 20px;">&nbsp;</td>
            </tr>
            <tr>
              <td style="text-align: center;">
                <p
                  style="
                    font-size: 14px;
                    color:  #e6e6f0;
                    line-height: 18px;
                    margin: 0 0 0;
                  "
                >
                  &copy; <strong style="color:  #e6e6f0;">proffys.tk</strong> <span>|</span> <strong style="color:  #e6e6f0;">baraus.dev</strong>
                </p>
              </td>
            </tr>
            <tr>
              <td style="height: 80px;">&nbsp;</td>
            </tr>
          </table>
        </td>
      </tr>
    </table>
    <!--/100% body table-->
  </body>
</html>
`
}

export function templateResetPassword(token: string) {
  return `<!DOCTYPE html>
<html lang="en-US">
  <head>
    <meta content="text/html; charset=utf-8" http-equiv="Content-Type" />
    <title>Reset Password Email Template</title>
    <meta name="description" content="Reset Password Email Template." />
    <style type="text/css">
      a:hover {
        text-decoration: underline !important;
      }
    </style>
  </head>

  <body
    marginheight="0"
    topmargin="0"
    marginwidth="0"
    style="margin: 0px; background-color: #8257e5;"
    leftmargin="0"
  >
    <!--100% body table-->
    <table
      cellspacing="0"
      border="0"
      cellpadding="0"
      width="100%"
      bgcolor="#8257e5"
      style="
        @import url(
          https://fonts.googleapis.com/css?family=Rubik:300,
          400,
          500,
          700|Open + Sans:300,
          400,
          600,
          700
        );
        font-family: 'Open Sans', sans-serif;
      "
    >
      <tr>
        <td>
          <table
            style="background-color: #8257e5; max-width: 670px; margin: 0 auto;"
            width="100%"
            border="0"
            align="center"
            cellpadding="0"
            cellspacing="0"
          >
            <tr>
              <td style="height: 80px;">&nbsp;</td>
            </tr>
            <tr>
              <td style="text-align: center;">
                <a href="https://proffys.tk" title="logo" target="_blank">
                  <img src="https://github.com/devbaraus/NLW2_ProffyWeb/blob/master/src/assets/images/logo.png?raw=true" alt="logo">
                </a>
              </td>
            </tr>
            <tr>
              <td style="height: 20px;">&nbsp;</td>
            </tr>
            <tr>
              <td>
                <table
                  width="95%"
                  border="0"
                  align="center"
                  cellpadding="0"
                  cellspacing="0"
                  style="
                    max-width: 670px;
                    background: #fff;
                    border-radius: 3px;
                    text-align: center;
                    -webkit-box-shadow: 0 6px 18px 0 rgba(0, 0, 0, 0.06);
                    -moz-box-shadow: 0 6px 18px 0 rgba(0, 0, 0, 0.06);
                    box-shadow: 0 6px 18px 0 rgba(0, 0, 0, 0.06);
                  "
                >
                  <tr>
                    <td style="height: 40px;">&nbsp;</td>
                  </tr>
                  <tr>
                    <td style="padding: 0 35px;">
                      <h1
                        style="
                          color: #1e1e2d;
                          font-weight: 500;
                          margin: 0;
                          font-size: 32px;
                          font-family: 'Rubik', sans-serif;
                        "
                      >
                        Você pediu para redefinir sua senha
                      </h1>
                      <span
                        style="
                          display: inline-block;
                          vertical-align: middle;
                          margin: 29px 0 26px;
                          border-bottom: 1px solid #cecece;
                          width: 100px;
                        "
                      ></span>
                      <p
                        style="
                          color: #455056;
                          font-size: 15px;
                          line-height: 24px;
                          margin: 0;
                        "
                      >
                        Não podemos simplesmente enviar sua senha antiga. Um link para
                        redefinir sua senha foi gerado para você. Para redefinir sua senha,
                        utilize o token, clique no botão ou clique no link abaixo.
                        
                      </p>
                      <span style="margin: 1rem 0;"><strong>${token}</strong></span>
                      <p
                        style="
                          color: #455056;
                          font-size: 15px;
                          line-height: 24px;
                          margin: 1rem 0;
                        "
                      >
                        ${
                          process.env.NODE_ENV === 'production'
                            ? 'https://proffy.baraus.dev'
                            : 'http://localhost:3000'
                        }/reset-password?token=${token}
                      </p>
                      <a
                        href="${
                          process.env.NODE_ENV === 'production'
                            ? 'https://proffy.baraus.dev'
                            : 'http://localhost:3000'
                        }/reset-password?token=${token}"
                        style="
                          background:#04bf58;
                          text-decoration: none !important;
                          font-weight: 500;
                          margin-top: 35px;
                          color: #fff;
                          text-transform: uppercase;
                          font-size: 14px;
                          padding: 10px 24px;
                          display: inline-block;
                          border-radius: 4px;
                        "
                        >Redefinir senha</a
                      >
                    </td>
                  </tr>
                  <tr>
                    <td style="height: 40px;">&nbsp;</td>
                  </tr>
                </table>
              </td>
            </tr>

            <tr>
              <td style="height: 20px;">&nbsp;</td>
            </tr>
            <tr>
              <td style="text-align: center;">
                <p
                  style="
                    font-size: 14px;
                    color:  #e6e6f0;
                    line-height: 18px;
                    margin: 0 0 0;
                  "
                >
                  &copy; <strong style="color:  #e6e6f0;">proffys.tk</strong> <span>|</span> <strong style="color:  #e6e6f0;">baraus.dev</strong>
                </p>
              </td>
            </tr>
            <tr>
              <td style="height: 80px;">&nbsp;</td>
            </tr>
          </table>
        </td>
      </tr>
    </table>
    <!--/100% body table-->
  </body>
</html>
`
}

export default mailer
