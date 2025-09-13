import { serve } from "https://deno.land/std@0.190.0/http/server.ts";
import { Resend } from "npm:resend@2.0.0";
import { createClient } from 'https://esm.sh/@supabase/supabase-js@2.45.0';

const resend = new Resend(Deno.env.get("RESEND_API_KEY"));
const supabaseUrl = Deno.env.get('SUPABASE_URL')!;
const supabaseServiceKey = Deno.env.get('SUPABASE_SERVICE_ROLE_KEY')!;

const supabase = createClient(supabaseUrl, supabaseServiceKey);

const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Headers":
    "authorization, x-client-info, apikey, content-type",
};

interface VerificationEmailRequest {
  email: string;
  firstName?: string;
  lastName?: string;
}

const handler = async (req: Request): Promise<Response> => {
  // Handle CORS preflight requests
  if (req.method === "OPTIONS") {
    return new Response(null, { headers: corsHeaders });
  }

  try {
    const { email, firstName, lastName }: VerificationEmailRequest = await req.json();

    if (!email) {
      throw new Error("Email is required");
    }

    // Generate a 6-digit verification code
    const verificationCode = Math.floor(100000 + Math.random() * 900000).toString();

    // Store the verification code in the database (expires in 10 minutes)
    const expiresAt = new Date();
    expiresAt.setMinutes(expiresAt.getMinutes() + 10);

    const { error: dbError } = await supabase
      .from('email_verification_codes')
      .insert({
        email,
        code: verificationCode,
        expires_at: expiresAt.toISOString(),
      });

    if (dbError) {
      console.error("Database error:", dbError);
      throw new Error("Failed to store verification code");
    }

    // Send the email
    const emailResponse = await resend.emails.send({
      from: "ChowLocal <noreply@resend.dev>", // You can customize this
      to: [email],
      subject: "Verify your email address",
      html: `
        <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto; padding: 20px;">
          <div style="text-align: center; margin-bottom: 30px;">
            <img src="https://chowlocal.com/x/assets/images/chowlocallogo.png" alt="ChowLocal" style="width: 80px; height: auto;">
          </div>
          
          <h1 style="color: #333; text-align: center; margin-bottom: 30px;">Verify Your Email Address</h1>
          
          <p style="color: #666; font-size: 16px; line-height: 1.5; margin-bottom: 20px;">
            Hello${firstName ? ` ${firstName}` : ''},
          </p>
          
          <p style="color: #666; font-size: 16px; line-height: 1.5; margin-bottom: 30px;">
            Thank you for signing up! Please use the verification code below to complete your registration:
          </p>
          
          <div style="background-color: #f5f5f5; border: 2px dashed #ccc; border-radius: 8px; padding: 20px; text-align: center; margin-bottom: 30px;">
            <span style="font-size: 24px; font-weight: bold; color: #333; letter-spacing: 4px;">
              ${verificationCode}
            </span>
          </div>
          
          <p style="color: #666; font-size: 14px; line-height: 1.5; margin-bottom: 20px;">
            This code will expire in 10 minutes for security reasons.
          </p>
          
          <p style="color: #666; font-size: 14px; line-height: 1.5;">
            If you didn't create an account with us, you can safely ignore this email.
          </p>
          
          <hr style="border: none; border-top: 1px solid #eee; margin: 30px 0;">
          
          <p style="color: #999; font-size: 12px; text-align: center;">
            This email was sent by ChowLocal. Please do not reply to this email.
          </p>
        </div>
      `,
    });

    console.log("Email sent successfully:", emailResponse);

    if (emailResponse.error) {
      throw new Error(`Failed to send email: ${emailResponse.error.message}`);
    }

    return new Response(
      JSON.stringify({ 
        success: true, 
        message: "Verification email sent successfully" 
      }),
      {
        status: 200,
        headers: {
          "Content-Type": "application/json",
          ...corsHeaders,
        },
      }
    );
  } catch (error: any) {
    console.error("Error in send-verification-email function:", error);
    return new Response(
      JSON.stringify({ 
        error: error.message || "An unexpected error occurred" 
      }),
      {
        status: 500,
        headers: { 
          "Content-Type": "application/json", 
          ...corsHeaders 
        },
      }
    );
  }
};

serve(handler);