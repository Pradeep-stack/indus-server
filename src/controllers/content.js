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
        body {
          font-family: Arial, sans-serif;
          margin: 0;
        }
        .card {
          width: 400px;
          border: 2px solid #000;
          margin: 20px auto;
          padding: 10px;
          position: relative;
        }
        .header, .footer {
          text-align: center;
          background: #f5f5f5;
        }
        .section {
          text-align: center;
          padding: 10px;
        }
        .bold {
          font-weight: bold;
        }
        .buyer-tag {
          background: gold;
          color: black;
          padding: 5px 15px;
          display: inline-block;
          font-weight: bold;
          margin: 10px 0;
        }
        .info {
          margin-top: 20px;
          text-align: left;
          padding: 10px 20px;
          font-size: 16px;
        }
        .qr {
          position: absolute;
          bottom: 20px;
          right: 20px;
        }
        .qr img {
          width: 80px;
        }
      </style>
    </head>
    <body>
    
    <div class="card">
      <div class="header">
        <img src="${headerImage}" alt="Top Banner" style="width: 100%;">
      </div>
  
      <div class="info">
        <div><span class="bold">ID :</span> ${user.id}</div>
        <div><span class="bold">Name :</span> ${user.name}</div>
        <div><span class="bold">Comp :</span> ${user.company || ''}</div>
        <div><span class="bold">City :</span> ${user.city}</div>
      </div>
  
      <div class="qr">
        <!-- Optionally embed QR code here -->
      </div>
  
      <div class="footer">
        <img src="https://indusglobal.s3.ap-south-1.amazonaws.com/Buyer%20Footer.png" alt="Bottom Banner" style="width: 100%;">
      </div>
    </div>
  
    </body>
    </html>`;
  };
  