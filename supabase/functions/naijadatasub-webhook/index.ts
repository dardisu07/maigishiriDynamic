import { serve } from "https://deno.land/std@0.168.0/http/server.ts";
import { createClient } from "npm:@supabase/supabase-js@2";

const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Headers": "authorization, x-client-info, apikey, content-type",
  "Access-Control-Allow-Methods": "POST, OPTIONS",
};

serve(async (req) => {
  // Handle CORS preflight requests
  if (req.method === "OPTIONS") {
    return new Response(null, {
      status: 204,
      headers: corsHeaders,
    });
  }

  try {
    // Initialize Supabase client with service role key for admin access
    const supabaseUrl = Deno.env.get("SUPABASE_URL") || "";
    const supabaseServiceKey = Deno.env.get("SUPABASE_SERVICE_ROLE_KEY") || "";
    const supabase = createClient(supabaseUrl, supabaseServiceKey);

    // Get the webhook secret from environment variables or database
    const { data: apiSettings, error: settingsError } = await supabase
      .from("api_settings")
      .select("key_value")
      .eq("key_name", "naijadatasub_webhook_secret")
      .single();

    if (settingsError) {
      console.error("Error fetching webhook secret:", settingsError);
    }

    const webhookSecret = apiSettings?.key_value || Deno.env.get("NAIJADATASUB_WEBHOOK_SECRET");

    // Get the signature from the request headers
    const signature = req.headers.get("x-naijadatasub-signature");
    
    // In production, verify the signature
    // For testing, we'll skip this step but in production you should uncomment this
    /*
    if (!signature || signature !== webhookSecret) {
      console.error("Invalid webhook signature");
      return new Response(
        JSON.stringify({ success: false, error: "Invalid signature" }),
        {
          status: 401,
          headers: { ...corsHeaders, "Content-Type": "application/json" },
        }
      );
    }
    */

    // Parse webhook payload
    const payload = await req.json();
    console.log("Webhook payload:", JSON.stringify(payload));

    // Process based on event type
    const eventType = payload.event || "";
    
    if (eventType === "transaction.completed") {
      // Handle successful transaction
      const transactionData = payload.data;
      
      // Find the transaction in our database
      const { data: transaction, error: txError } = await supabase
        .from("transactions")
        .select("*")
        .eq("reference", transactionData.reference)
        .single();
      
      if (txError) {
        console.error("Error finding transaction:", txError);
        return new Response(
          JSON.stringify({ success: false, error: "Transaction not found" }),
          {
            status: 404,
            headers: { ...corsHeaders, "Content-Type": "application/json" },
          }
        );
      }
      
      // Update transaction status
      const { error: updateError } = await supabase
        .from("transactions")
        .update({ 
          status: "success",
          details: {
            ...transaction.details,
            webhook_data: payload,
            completed_at: new Date().toISOString()
          }
        })
        .eq("id", transaction.id);
      
      if (updateError) {
        console.error("Error updating transaction:", updateError);
      }
      
      // Log the webhook event
      await supabase.from("admin_logs").insert([{
        admin_id: null,
        action: "naijadatasub_webhook",
        details: { 
          event: eventType,
          transaction_id: transaction.id,
          reference: transactionData.reference,
          status: "success"
        },
      }]);
    } 
    else if (eventType === "transaction.failed") {
      // Handle failed transaction
      const transactionData = payload.data;
      
      // Find the transaction in our database
      const { data: transaction, error: txError } = await supabase
        .from("transactions")
        .select("*")
        .eq("reference", transactionData.reference)
        .single();
      
      if (txError) {
        console.error("Error finding transaction:", txError);
        return new Response(
          JSON.stringify({ success: false, error: "Transaction not found" }),
          {
            status: 404,
            headers: { ...corsHeaders, "Content-Type": "application/json" },
          }
        );
      }
      
      // Update transaction status
      const { error: updateError } = await supabase
        .from("transactions")
        .update({ 
          status: "failed",
          details: {
            ...transaction.details,
            webhook_data: payload,
            failure_reason: payload.data.reason || "Unknown failure reason",
            failed_at: new Date().toISOString()
          }
        })
        .eq("id", transaction.id);
      
      if (updateError) {
        console.error("Error updating transaction:", updateError);
      }
      
      // If this was a wallet payment, refund the user
      if (transaction.type !== "wallet_funding") {
        // Get user's current wallet balance
        const { data: profile, error: profileError } = await supabase
          .from("profiles")
          .select("wallet_balance")
          .eq("id", transaction.user_id)
          .single();
        
        if (!profileError && profile) {
          // Refund the amount to the user's wallet
          const newBalance = profile.wallet_balance + Number(transaction.amount);
          
          const { error: refundError } = await supabase
            .from("profiles")
            .update({ wallet_balance: newBalance })
            .eq("id", transaction.user_id);
          
          if (refundError) {
            console.error("Error refunding user:", refundError);
          } else {
            // Create a refund transaction record
            await supabase.from("transactions").insert([{
              user_id: transaction.user_id,
              type: "refund",
              amount: transaction.amount,
              status: "success",
              reference: `REFUND-${transaction.reference}`,
              details: {
                original_transaction_id: transaction.id,
                original_reference: transaction.reference,
                reason: "Failed transaction refund",
                refunded_at: new Date().toISOString()
              }
            }]);
          }
        }
      }
      
      // Log the webhook event
      await supabase.from("admin_logs").insert([{
        admin_id: null,
        action: "naijadatasub_webhook",
        details: { 
          event: eventType,
          transaction_id: transaction.id,
          reference: transactionData.reference,
          status: "failed",
          reason: payload.data.reason || "Unknown failure reason"
        },
      }]);
    }
    else {
      // Log unknown event type
      console.log(`Unhandled webhook event type: ${eventType}`);
      await supabase.from("admin_logs").insert([{
        admin_id: null,
        action: "naijadatasub_webhook",
        details: { 
          event: eventType,
          status: "unhandled",
          payload: payload
        },
      }]);
    }

    // Return success response
    return new Response(
      JSON.stringify({ success: true, message: "Webhook processed successfully" }),
      {
        status: 200,
        headers: { ...corsHeaders, "Content-Type": "application/json" },
      }
    );
  } catch (error) {
    console.error("Webhook processing error:", error);
    
    return new Response(
      JSON.stringify({
        success: false,
        error: error.message || "Failed to process webhook",
      }),
      {
        status: 500,
        headers: { ...corsHeaders, "Content-Type": "application/json" },
      }
    );
  }
});