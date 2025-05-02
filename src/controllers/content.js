export const htmlContent = (user) => { 
  let headerImage = '';
  if (user.userType === 'user') {
    headerImage = 'https://indusglobal.s3.ap-south-1.amazonaws.com/Buyer%20Header.png';
  } else if (user.userType === 'member') {
    headerImage = 'https://indusglobal.s3.ap-south-1.amazonaws.com/Member%20Header.png';
  } else if (user.userType === 'agent') {
    headerImage = 'https://indusglobal.s3.ap-south-1.amazonaws.com/Agent%20Header.png';
  } else if (user.userType === 'owner') {
    headerImage = 'https://indusglobal.s3.ap-south-1.amazonaws.com/Owner%20Header.png';
  }

  return `<!DOCTYPE html>
  <html lang="en">
  <head>
    <meta charset="UTF-8">
    <title>Entry Card</title>
    <style>
      * {
        margin: 0;
        padding: 0;
        box-sizing: border-box;
      }
      body {
        font-family: Arial, sans-serif;
        margin: 0;
        padding: 0;
      }
      .card {
        width: 100%;
        max-width: 400px;
        margin: 0 auto;
      }
      .header, .footer {
        width: 100%;
      }
      .section, .info {
        padding: 5px 10px;
      }
      .bold {
        font-weight: bold;
      }
      .info div {
        margin-bottom: 5px;
      }
      .qr img {
        width: 80px;
      }
    </style>
  </head>
  <body>
    <div class="card">
      <div class="header">
        <img src="${headerImage}" alt="Top Banner" style="width: 100%; display: block;">
      </div>

      <div class="info">
        <div><span class="bold">ID :</span> ${user.id}</div>
        <div><span class="bold">Name :</span> ${user.name}</div>
        <div><span class="bold">Comp :</span> ${user.company || ''}</div>
        <div><span class="bold">City :</span> ${user.city}</div>
      </div>

      <div class="footer">
        <img src="https://indusglobal.s3.ap-south-1.amazonaws.com/Buyer%20Footer.png" alt="Bottom Banner" style="width: 100%; display: block;">
      </div>
    </div>
  </body>
  </html>`;
};
