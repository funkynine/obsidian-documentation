export async function sendTelegramNotification(order: {
  id: string;
  customer_name: string;
  phone: string;
  variety_id: string;
  delivery_date: string;
  delivery_time: string | null;
  quantity: number;
  city: string;
  notes: string | null;
  varieties?: { name: string } | null;
}) {
  const token = process.env.TELEGRAM_BOT_TOKEN;
  const chatId = process.env.TELEGRAM_CHAT_ID;

  if (!token || !chatId) return;

  const varietyName = order.varieties?.name ?? "Невідомий сорт";

  const text = [
    "🆕 *Нове замовлення!*",
    "",
    `👤 ${order.customer_name}`,
    `📞 ${order.phone}`,
    `🌷 Сорт: ${varietyName}`,
    `📦 Кількість: ${order.quantity}`,
    `📍 Місто: ${order.city}`,
    `📅 Дата: ${order.delivery_date}`,
    order.delivery_time ? `🕐 Час: ${order.delivery_time}` : null,
    order.notes ? `📝 Примітки: ${order.notes}` : null,
  ]
    .filter(Boolean)
    .join("\n");

  try {
    await fetch(
      `https://api.telegram.org/bot${token}/sendMessage`,
      {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          chat_id: chatId,
          text,
          parse_mode: "Markdown",
        }),
      }
    );
  } catch {
    // Silent fail - order is saved, Telegram is optional
  }
}
