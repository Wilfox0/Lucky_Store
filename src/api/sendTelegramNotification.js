// استبدل TOKEN و CHAT_ID بالقيم الخاصة بالبوت الخاص بك
const TELEGRAM_BOT_TOKEN = "8351490932:AAGJ7JRAFLCG5g-qo-VHzCP0-vqjL1GVn7w";

const TELEGRAM_CHAT_ID = "1092353140"; // يمكن أن يكون رقم ID أو username مع @

export async function sendTelegramNotification(message) {
  try {
    await fetch(`https://api.telegram.org/bot${TELEGRAM_BOT_TOKEN}/sendMessage`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        chat_id: TELEGRAM_CHAT_ID,
        text: message
      })
    });
  } catch (err) {
    console.error("خطأ أثناء إرسال إشعار Telegram:", err);
  }
}
