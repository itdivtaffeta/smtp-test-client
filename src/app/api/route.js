import { NextResponse } from "next/server";
import nodemailer from "nodemailer";

export async function POST(request) {
  let username;
  let password;
  let host;
  let port;
  let to;
  let subject;

  try {
    const req = await request.json();
    username = req.username;
    password = req.password;
    host = req.host;
    port = req.port;
    to = req.to;
    subject = req.subject;
  } catch (error) {
    return NextResponse.json(
      {
        message: "Must be a JSON request",
      },
      {
        status: 400,
      }
    );
  }

  if (!username || !password || !host || !port || !to) {
    return NextResponse.json(
      {
        message: "Missing required fields",
      },
      {
        status: 400,
      }
    );
  }

  const transporter = nodemailer.createTransport({
    host: host,
    port: port,
    tls: {
      rejectUnauthorized: false,
    },
    debug: false,
    secure: false,
    auth: {
      user: username,
      pass: password,
    },
  });

  const mailOptions = {
    from: username,
    to: to,
    subject: subject || "Hello from SMTP Test Client",
    text: "Hello from SMTP Test Client",
    html: `<!DOCTYPE html>
    <html>
      <head>
        <meta charset="UTF-8" />
        <title>Test Email</title>
        <style>
          body {
            font-family: Arial, sans-serif;
            background-color: #f1f1f1;
            margin: 0;
            padding: 20px;
          }
          .container {
            max-width: 600px;
            margin: 0 auto;
            background-color: #fff;
            padding: 20px;
            border-radius: 5px;
            box-shadow: 0 2px 5px rgba(0, 0, 0, 0.1);
          }
          h1 {
            text-align: center;
            color: #333;
          }
          p {
            margin-bottom: 10px;
            color: #555;
          }
          .signature {
            text-align: right;
            margin-top: 20px;
          }
        </style>
      </head>
      <body>
        <div class="container">
          <h1>Test Email</h1>
          <p>This email is being sent as a test message.</p>
          <p>Please disregard and do not take any action based on this email.</p>
          <p>Thank you for your understanding.</p>
    
          <div class="signature">
            <p>Sincerely,</p>
            <p>SMTP Test Client</p>
          </div>
        </div>
      </body>
    </html>
    `,
  };

  try {
    // set max timeout to 10 seconds

    const info = await transporter.sendMail(mailOptions);
    return NextResponse.json(
      {
        message: info?.messageId,
      },
      {
        status: 200,
      }
    );
  } catch (error) {
    return NextResponse.json(
      {
        message: error.message || "Something went wrong",
      },
      {
        status: 500,
      }
    );
  }
}

export async function GET() {
  return NextResponse.json({
    message: "Hello from the API",
  });
}
