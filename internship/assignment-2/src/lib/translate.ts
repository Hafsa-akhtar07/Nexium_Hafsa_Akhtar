const urduDict: Record<string, string> = {
  "This": "یہ",
  "is": "ہے",
  "a": "ایک",
  "sample": "نمونہ",
  "blog": "بلاگ",
  "content": "مواد",
  "used": "استعمال کیا گیا",
  "for": "کے لیے",
  "testing": "جانچنے",
  "summary": "خلاصہ",
  "feature": "خصوصیت",
  "The": "یہ",
  "goal": "مقصد",
  "to": "کرنا",
  "check": "چیک کرنا",
  "how": "کیسے",
  "UI": "یوزر انٹرفیس",
  "looks": "دکھائی دیتا ہے"
};

export function translateToUrdu(text: string): string {
  return text
    .split(' ')
    .map(word => urduDict[word] || word)
    .join(' ');
}
