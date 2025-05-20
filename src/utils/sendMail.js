// sendEmail.js
import express from "express";
import axios from "axios";

const ONESIGNAL_APP_ID = "5a708709-16d5-4171-9ee8-fff990f421a2";
const ONESIGNAL_API_KEY =
  "os_v2_app_ljyiociw2vaxdhxi774zb5bbulmdp3xjur2uurfvqzjk2njvloa4yt3wawzdc3pglucubtncyb6fidml4vtpypvh4cswuxnah7x2ycq";
const ONESIGNAL_TEMPLATE_ID = "2191a147-f747-430a-945d-a4ae2ea9af11";

/**
 * Sends an OTP email using OneSignal Email Template
 * @param {string} email - Recipient's email address
 * @param {string} otp - OTP code to be sent in the email
 * @returns {Promise<object>} - OneSignal API response
 */
async function sendOtpEmail(email, otp) {
  try {
    const response = await axios.post(
      "https://onesignal.com/api/v1/notifications",
      {
        app_id: ONESIGNAL_APP_ID,
        include_email_tokens: [email],
        template_id: ONESIGNAL_TEMPLATE_ID,
        email_body: `
<!DOCTYPE html>
<html>

<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>Email OTP</title>
    <style>
        body {
            font-family: Arial, sans-serif;
            background-color: #f4f4f4;
            margin: 0;
            padding: 0;
        }

        .container {
            width: 100%;
            max-width: 600px;
            margin: 0 auto;
            background-color: black;
            padding: 10px;
            border-radius: 8px;
          text-align: center;
            box-shadow: 0 4px 10px rgba(0, 0, 0, 0.1);
        }

        .header {
            text-align: center;
            padding-bottom: 10px;
            display: flex;
            justify-content: center;
            align-items: center;
        }

        .header h2 {
            margin: 0;
            color:white;
        }

        .header img {
            width: 230px;
            height: auto;
            margin-top: 10px;
            margin-bottom: 10px;
        }

        .content {
            line-height: 1.6;
            font-size: 14px;
            color:white;
            margin-bottom: 20px;
            padding: 0px 20px;
        }

        .footer {
            background-color: #edb058;
            padding: 5px 20px;
            border-radius: 15px;
        }
        .footer-bottom {
            display: flex;
            flex-direction: row;
            justify-content: center;
            align-items: center;
            gap: 10px;
            margin-top: 20px;
            font-size: 9px;
        }

        .footer-bottom a {
            font-size: 9px;
            color: black;
            text-decoration: none;
        }
        
    </style>
</head>

<body>
    <div class="container">
      <!-- ======Heder====== -->
        <div class="header" style="width: 100%; text-align: center;">
            <table align="center" style="margin: 0 auto; border-collapse: collapse;">
                <tr>
                    <td style="text-align: center;">
                        <div class="logo-div" style="display: inline-block; vertical-align: middle;">
                            <img src="https://indusdigicart.com/images/logo.png" alt="Company Logo"
                                style="width: 120px; height: auto;" />
                        </div>
                    </td>
                </tr>
            </table>
        </div>
        <!-- ================== -->
        <hr style="border: 1px solid #e8e7e7; margin: 0px;">
        <div class="content">
            <p style="font-size: 16px; font-weight: 700;">Here is your code:</p>
            <p>Use this code to verify your email, sign in.</p>
            <p style="text-align: center;">
                <span
                    style="text-align: center; font-size: 18px; font-weight: 700; padding: 8px 13px;
                  color: black ; border-radius: 5px; background-color: #e8e7e7; border: 1px solid #c2c2c2;">
                    ${otp}
                </span>
            </p>
            <p>Please use it to complete your login.</p>
            <p>If you did not request this OTP, please ignore this email .
             
            <p>Thank you !</p>
          
        </div>

        <div class="footer">
          <!-- ============== -->
            <div>
                <h4
                    style=" font-size: 14px; margin-bottom: 0px; font-weight: 700; font-family: sans-serif; text-align: center;">
                    Anti Spam filter:
                </h4>
                <hr style="border: 1px dashed black; margin: 5px 0px;">
                <p style="font-size: 12px; text-align: center;">Make sure that our email is received in your inbox
                    and not in your Bulk
                    or Junk folders by
                    simply adding <span
                        style="color: rgb(48, 48, 238); text-decoration: underline;">info@indusdigicart.com</span>
                    to your email address book to trusted-sender
                    list.</p> <a href="[unsubscribe_url]">Unsubscribe</a>
            </div>

            <p style="font-size: small; text-align: center; margin-bottom: 10px; font-family: sans-serif;">
                Copyright © Indus Digicart. All Rights Reserved
            </p>
        </div>
    </div>
</body>

</html>
`,
        template_data: { otp }, 
        // substitutions: { otp: otp.toString() },
      },
      {
        headers: {
          Authorization: `Basic ${ONESIGNAL_API_KEY}`,
          "Content-Type": "application/json",
        },
      }
    );

    return { success: true, data: response.data };
  } catch (error) {
    console.error(
      "OneSignal Email Error:",
      error.response?.data || error.message
    );
    return { success: false, error: error.message };
  }
}
export default sendOtpEmail;
