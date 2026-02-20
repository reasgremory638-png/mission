import { GoogleGenerativeAI } from '@google/generative-ai';
import { GEMINI_API_KEY } from '../config';

const genAI = new GoogleGenerativeAI(GEMINI_API_KEY);

const MODEL_OPTIONS = [
  'gemini-1.5-flash',
  'gemini-1.5-flash-latest',
  'gemini-1.5-pro',
  'gemini-1.5-pro-latest',
  'gemini-2.0-flash-exp',
  'gemini-2.0-flash',
  'gemini-pro',
  'gemini-1.0-pro'
];

async function getWorkingModel(prompt) {
  for (const modelName of MODEL_OPTIONS) {
    try {
      console.log(`Trying Gemini model: ${modelName}...`);
      const model = genAI.getGenerativeModel({ model: modelName });
      const result = await model.generateContent(prompt);
      console.log(`Successfully used model: ${modelName}`);
      return { text: result.response.text(), success: true, modelUsed: modelName };
    } catch (err) {
      if (err.message?.includes('404')) {
        console.warn(`Model ${modelName} not found (404), trying next...`);
        continue;
      }
      console.error(`Error with model ${modelName}:`, err.message);
      // If it's not a 404, it might be a different error (quota, key, etc.)
      // but let's try the next model anyway just in case it's a model-specific restriction
      continue;
    }
  }
  throw new Error("No available models found for this API key. Please check your AI Studio settings.");
}

export async function generateChallengeWithAI(category) {
  const prompt = `أنت مساعد متخصص في تصميم تحديات تطوير الذات.
صمم تحدياً ممتازاً لمدة 30 يوماً في مجال: "${category}".
رد بـ JSON فقط بهذا الشكل:
{
  "title": "عنوان التحدي (جملة قصيرة مشوقة)",
  "description": "وصف مختصر للتحدي في 2-3 جمل يوضح ما سيفعله المستخدم كل يوم"
}`;

  const { text } = await getWorkingModel(prompt);
  const json = text.match(/\{[\s\S]*\}/)?.[0];
  return JSON.parse(json);
}

export async function generateDailySummary(dayId, userDescription, challengeTitle) {
  const prompt = `أنت مساعد تحفيزي لتطبيق عادات.
المستخدم يعمل على تحدي: "${challengeTitle}"
اليوم رقم: ${dayId}
ما أنجزه المستخدم اليوم:
"${userDescription}"

اكتب ملخصاً يومياً موجزاً ومحفزاً بالعربية يحتوي على:
1. تلخيص ما تم إنجازه (جملة واحدة)
2. الخطوة القادمة المقترحة
3. تقييم بسيط للتقدم (من 5 نجوم)

رد بـ JSON فقط:
{
  "accomplished": "ما تم إنجازه",
  "nextStep": "الخطوة القادمة",
  "rating": 4,
  "encouragement": "جملة تشجيعية قصيرة"
}`;

  const { text } = await getWorkingModel(prompt);
  const json = text.match(/\{[\s\S]*\}/)?.[0];
  return JSON.parse(json);
}

export async function chatWithAI(message, challengeTitle, currentDay) {
  const prompt = `أنت مساعد ذكاء اصطناعي لطيف ومحفز داخل تطبيق بناء العادات "Mission Path".
المستخدم يعمل على تحدي: "${challengeTitle}"
اليوم الحالي: ${currentDay} من 30

سؤال المستخدم: "${message}"

أجب بشكل مختصر ومفيد ومحفز باللغة العربية (3-5 جمل كحد أقصى). 
لا تستخدم تنسيق Markdown معقد، فقط نص عادي.`;

  const { text } = await getWorkingModel(prompt);
  return text;
}
