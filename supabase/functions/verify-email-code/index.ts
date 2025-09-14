import { serve } from "https://deno.land/std@0.190.0/http/server.ts";
import { createClient } from 'https://esm.sh/@supabase/supabase-js@2.45.0';

const supabaseUrl = Deno.env.get('SUPABASE_URL')!;
const supabaseServiceKey = Deno.env.get('SUPABASE_SERVICE_ROLE_KEY')!;

const supabase = createClient(supabaseUrl, supabaseServiceKey);

const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Headers":
    "authorization, x-client-info, apikey, content-type",
};

interface VerifyCodeRequest {
  email: string;
  code: string;
  userData?: {
    firstName: string;
    lastName: string;
    city: string;
    phoneNumber: string;
    password: string;
  };
}

const handler = async (req: Request): Promise<Response> => {
  // Handle CORS preflight requests
  if (req.method === "OPTIONS") {
    return new Response(null, { headers: corsHeaders });
  }

  try {
    const { email, code, userData }: VerifyCodeRequest = await req.json();

    console.log('Verify request received:', { email, code, hasUserData: !!userData });

    if (!email || !code) {
      throw new Error("Email and code are required");
    }

    // Check if the verification code is valid
    const { data: verificationData, error: verificationError } = await supabase
      .from('email_verification_codes')
      .select('*')
      .eq('email', email)
      .eq('code', code)
      .eq('verified', false)
      .gt('expires_at', new Date().toISOString())
      .order('created_at', { ascending: false })
      .limit(1)
      .single();

    console.log('Verification check:', { verificationData, verificationError });

    if (verificationError || !verificationData) {
      throw new Error("Invalid or expired verification code");
    }

    // Mark the code as verified
    const { error: updateError } = await supabase
      .from('email_verification_codes')
      .update({ verified: true })
      .eq('id', verificationData.id);

    if (updateError) {
      console.error("Failed to update verification status:", updateError);
      throw new Error("Failed to verify code");
    }

    console.log('Code verified successfully');

    // If userData is provided, create the user account
    if (userData) {
      console.log('Creating user account with data:', {
        email,
        firstName: userData.firstName,
        lastName: userData.lastName,
        city: userData.city,
        phoneNumber: userData.phoneNumber
      });
      
      // Generate avatar URL using user data
      const generateAvatar = (firstName?: string, lastName?: string): string => {
        try {
          if (firstName && lastName) {
            const initials = `${firstName.charAt(0).toUpperCase()}${lastName.charAt(0).toUpperCase()}`;
            return `https://avatar-placeholder.iran.liara.run/initials?username=${initials}`;
          }
          
          if (firstName) {
            return `https://avatar-placeholder.iran.liara.run/document?username=${firstName.toLowerCase()}`;
          }
          
          const randomUsername = Math.random().toString(36).substring(2, 15);
          return `https://avatar-placeholder.iran.liara.run/document?username=${randomUsername}`;
        } catch (error) {
          console.error('Error generating avatar:', error);
          return `https://avatar-placeholder.iran.liara.run/document?username=user`;
        }
      };

      const avatarUrl = generateAvatar(userData.firstName, userData.lastName);
      console.log('Generated avatar URL:', avatarUrl);

      // Create the user with Supabase Auth
      const { data: authData, error: authError } = await supabase.auth.admin.createUser({
        email: email,
        password: userData.password,
        email_confirm: true, // This marks the email as confirmed
        user_metadata: {
          first_name: userData.firstName,
          last_name: userData.lastName,
          city: userData.city,
          phone_number: userData.phoneNumber
        }
      });

      if (authError) {
        console.error("Error creating user:", authError);
        throw new Error(`Failed to create user: ${authError.message}`);
      }

      console.log("User created successfully:", authData.user?.id);

      if (authData.user) {
        // Wait a moment for any triggers to fire
        await new Promise(resolve => setTimeout(resolve, 1000));

        // Check if profile already exists
        const { data: existingProfile } = await supabase
          .from('profiles')
          .select('id')
          .eq('user_id', authData.user.id)
          .single();

        const profileData = {
          user_id: authData.user.id,
          email: authData.user.email,
          first_name: userData.firstName,
          last_name: userData.lastName,
          city: userData.city,
          phone_number: userData.phoneNumber,
          avatar_url: avatarUrl,
        };

        console.log('Profile data to save:', profileData);

        if (existingProfile) {
          // Update existing profile
          const { error: updateProfileError } = await supabase
            .from('profiles')
            .update({
              email: authData.user.email,
              first_name: userData.firstName,
              last_name: userData.lastName,
              city: userData.city,
              phone_number: userData.phoneNumber,
              avatar_url: avatarUrl,
            })
            .eq('user_id', authData.user.id);

          if (updateProfileError) {
            console.error("Error updating profile:", updateProfileError);
            throw new Error(`Failed to update profile: ${updateProfileError.message}`);
          } else {
            console.log("Profile updated successfully with all fields");
          }
        } else {
          // Insert new profile
          const { error: insertProfileError } = await supabase
            .from('profiles')
            .insert(profileData);

          if (insertProfileError) {
            console.error("Error inserting profile:", insertProfileError);
            throw new Error(`Failed to create profile: ${insertProfileError.message}`);
          } else {
            console.log("Profile created successfully with all fields");
          }
        }

        // Verify the profile was saved correctly
        const { data: savedProfile, error: fetchError } = await supabase
          .from('profiles')
          .select('*')
          .eq('user_id', authData.user.id)
          .single();

        if (fetchError) {
          console.error("Error fetching saved profile:", fetchError);
        } else {
          console.log("Saved profile verification:", savedProfile);
        }
      }
    }

    return new Response(
      JSON.stringify({ 
        success: true, 
        message: userData ? "Email verified and account created successfully" : "Email verified successfully"
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
    console.error("Error in verify-email-code function:", error);
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
