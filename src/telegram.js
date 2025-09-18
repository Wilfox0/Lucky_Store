// src/telegram.js
export const sendTelegramNotification = async (message) => {
  const BOT_TOKEN = "8351490932:AAGJ7JRAFLCG5g-qo-VHzCP0-vqjL1GVn7w"; // توكن البوت
  const CHAT_ID = "1092353140"; // رقم الشات الخاص بك

  try {
    const url = `https://api.telegram.org/bot${BOT_TOKEN}/sendMessage`;
    await fetch(url, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        chat_id: CHAT_ID,
        text: message
      })
    });
    console.log("تم إرسال الإشعار عبر Telegram بنجاح!");
  } catch (err) {
    console.error("خطأ في إرسال إشعار Telegram:", err);
  }
};
