export async function GET(request) {
  const { searchParams } = new URL(request.url);
  const orderId = searchParams.get('order') || '';

  const html = `
    <!DOCTYPE html>
    <html lang="fr">
    <head>
      <meta charset="UTF-8">
      <meta name="viewport" content="width=device-width, initial-scale=1.0">
      <title>Paiement Réussi - L'Atelier Haute Couture</title>
      <link href="https://fonts.googleapis.com/css2?family=Plus+Jakarta+Sans:wght@400;600;700&display=swap" rel="stylesheet">
      <style>
        body {
          font-family: 'Plus Jakarta Sans', sans-serif;
          background-color: #1C0F08;
          color: #FFF6ED;
          display: flex;
          align-items: center;
          justify-content: center;
          min-height: 100vh;
          margin: 0;
          padding: 20px;
          box-sizing: border-box;
        }
        .card {
          background-color: #2E1A0F;
          border: 2px dashed #D2A679;
          border-radius: 16px;
          padding: 40px;
          text-align: center;
          max-width: 480px;
          width: 100%;
          box-shadow: 0 10px 30px rgba(0,0,0,0.5);
          position: relative;
        }
        .icon {
          width: 64px;
          height: 64px;
          background-color: rgba(0, 135, 81, 0.1);
          border: 2px solid #008751;
          color: #00b36b;
          border-radius: 50%;
          display: flex;
          align-items: center;
          justify-content: center;
          font-size: 32px;
          margin: 0 auto 24px;
        }
        h1 {
          font-size: 24px;
          margin: 0 0 12px;
          color: #D2A679;
        }
        p {
          font-size: 14px;
          color: #EADCC8;
          line-height: 1.6;
          margin: 0 0 24px;
        }
      </style>
    </head>
    <body>
      <div class="card">
        <div class="icon">✓</div>
        <h1>Paiement Réussi !</h1>
        <p>Votre règlement pour la commande #${orderId} a été enregistré avec succès par notre atelier.</p>
        <p>Merci pour votre confiance. Vous pouvez maintenant fermer cet onglet en toute sécurité.</p>
      </div>
    </body>
    </html>
  `;

  return new Response(html, {
    headers: { 'Content-Type': 'text/html; charset=utf-8' }
  });
}
