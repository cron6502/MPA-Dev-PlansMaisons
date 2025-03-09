import { serve } from 'https://deno.land/std@0.168.0/http/server.ts';
import { SmtpClient } from 'https://deno.land/x/smtp@v0.7.0/mod.ts';

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
};

serve(async (req) => {
  if (req.method === 'OPTIONS') {
    return new Response('ok', { headers: corsHeaders });
  }

  try {
    const { email, code, redirectUrl } = await req.json();

    const client = new SmtpClient();

    await client.connectTLS({
      hostname: Deno.env.get('SMTP_HOSTNAME') || '',
      port: parseInt(Deno.env.get('SMTP_PORT') || '587'),
      username: Deno.env.get('SMTP_USERNAME') || '',
      password: Deno.env.get('SMTP_PASSWORD') || '',
    });

    await client.send({
      from: Deno.env.get('SMTP_FROM') || '',
      to: email,
      subject: 'Vérification de votre adresse email',
      content: `
        <h1>Vérification de votre compte</h1>
        <p>Voici votre code de vérification : <strong>${code}</strong></p>
        <p>Ce code est valable pendant 1 heure.</p>
        <p>Si vous n'avez pas demandé cette vérification, ignorez cet email.</p>
      `,
      html: true,
    });

    await client.close();

    return new Response(
      JSON.stringify({ message: 'Email envoyé avec succès' }),
      { 
        headers: { ...corsHeaders, 'Content-Type': 'application/json' },
        status: 200,
      }
    );
  } catch (error) {
    console.error('Erreur lors de l\'envoi de l\'email:', error);
    return new Response(
      JSON.stringify({ error: error.message }),
      { 
        headers: { ...corsHeaders, 'Content-Type': 'application/json' },
        status: 500,
      }
    );
  }
});