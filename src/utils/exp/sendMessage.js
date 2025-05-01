import axios from "axios";

const whatsuppUrl = "https://api.interakt.ai/v1/public/message/";

const apiKey = "RlF2V052dTVIMEdqZm1wV2UwT0NjdDg4LXh2eFR5NXFGTkFsSGpoeGtBZzo=";
const whatsAppApiSend = async (userData) => {
  console.log("Sending WhatsApp API request with data:", JSON.stringify(userData, null, 2));

  try {
    const { data } = await axios.post(whatsuppUrl, userData, {
      headers: {
        "Content-Type": "application/json",
        Authorization: `Basic ${apiKey}`,
      },
    });

    console.log("WhatsApp API response:", data);
    return { success: true, data };
  } catch (error) {
    console.error("WhatsApp API Error:");
    console.error("Status:", error.response?.status);
    console.error("Message:", error.response?.data?.message || error.message);
    console.error("Full Response:", error.response?.data);

    return {
      success: false,
      error: error.response?.data?.message || error.message,
      status: error.response?.status,
      responseData: error.response?.data,
    };
  }
};

export const sendMessage = async (user, imageUrl) => {
  if (!user || !user.phone || !imageUrl) {
    console.error("Invalid data:", { user, imageUrl });
    return;
  }

  console.log("Preparing to send WhatsApp message for user:", user.phone);

  try {
    const whatsAppData = {
      countryCode: "+91",
      phoneNumber: user.phone,
      type: "Template",
      template: {
        name: "entry_pass_with_image",
        languageCode: "en_US",
        headerValues: [imageUrl],
        bodyValues: [user.name, user.id],
      },
    };

    const response = await whatsAppApiSend(whatsAppData);

    if (!response.success) {
      console.error("WhatsApp Error:", response);
    } else {
      console.log("WhatsApp message sent successfully.");
    }
  } catch (error) {
    console.error("Error sending WhatsApp message:", error);
  }
};
