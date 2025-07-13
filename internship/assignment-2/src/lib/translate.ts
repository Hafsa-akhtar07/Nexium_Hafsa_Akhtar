// const urduDict: Record<string, string> = { "the":"دی", "be":"ہونا", "to":"کو", "of":"کا", "and":"اور", "a":"ایک", "in":"میں",
//      "that":"یہ", "have":"رکھنا", "I":"میں", "it":"یہ", "for":"کے لیے", "not":"نہیں", "on":"پر", "with":"کے ساتھ", "he":"وہ", 
//      "as":"جیسے", "you":"تم", "do":"کرو", "at":"پر", "this":"یہ", "but":"لیکن", "his":"اس کا", "by":"کے ذریعے", "from":"سے", 
//      "they":"وہ", "we":"ہم", "say":"کہنا", "her":"اس کی", "she":"وہ", "or":"یا", "an":"ایک", "will":"چاہیے", "my":"میرا", "one":"ایک",
//       "all":"سب", "would":"ہوتا", "there":"وہاں", "their":"ان کا", "what":"کیا", "so":"اس لیے", "up":"اوپر", "out":"باہر", "if":"اگر", 
//       "about":"کے بارے میں", "who":"کون", "get":"حاصل کرنا", "which":"کون سا", "go":"جانا", "me":"مجھے", "when":"کب", "make":"بنانا", 
//       "can":"سکتا ہے", "like":"پسند کرنا", "time":"وقت", "no":"نہیں", "just":"بس", "him":"اسے", "know":"جاننا", "take":"لینا", "people":"لوگ", 
//       "into":"میں داخل", "year":"سال", "your":"تمہارا", "good":"اچھا", "some":"کچھ", "could":"سکتا تھا", "them":"انہیں", "see":"دیکھنا", 
//       "other":"دوسرا", "than":"سے", "then":"پھر", "now":"اب", "look":"دیکھنا", "only":"صرف", "come":"آنا", "its":"اس کا", "over":"اوپر",
//      "think":"سوچنا", "also":"بھی", "back":"واپس", "after":"بعد", "use":"استعمال کرنا", "two":"دو", "how":"کیسے", "our":"ہمارا", "work":"کام",
//       "first":"پہلا", "well":"اچھی طرح", "way":"راستہ", "even":"حتیٰ کہ", "new":"نیا", "want":"چاہنا", "because":"کیونکہ", "any":"کوئی", 
//       "these":"یہ", "give":"دینا", "day":"دن", "most":"زیادہ", "us":"ہمیں" , "is":"ہے", "very":"بہت", "more":"زیادہ", "long":"لمبا", 
//       "little":"تھوڑا", "man":"آدمی", "thing":"چیز", "woman":"عورت", "child":"بچہ", "world":"دنیا", "school":"سکول", "state":"ریاست", 
//       "family":"خاندان", "student":"طالب علم", "group":"گروہ", "country":"ملک", "problem":"مسئلہ", "hand":"ہاتھ", "part":"حصہ", 
//       "place":"جگہ", "case":"معاملہ", "week":"ہفتہ", "company":"کمپنی", "system":"نظام", "program":"پروگرام", "question":"سوال", 
//        "government":"حکومت", "number":"نمبر", "night":"رات", "point":"نقطہ", "home":"گھر", "water":"پانی", "room":"کمرہ", "mother":"ماں", 
//        "area":"علاقہ", "money":"پیسہ", "story":"کہانی", "fact":"حقیقت", "month":"مہینہ", "lot":"بہت زیادہ", "right":"درست", "study":"مطالعہ", 
//        "book":"کتاب", "eye":"آنکھ", "job":"نوکری", "word":"لفظ", "business":"کاروبار", "issue":"مسئلہ", "side":"طرف", "kind":"قسم", 
//        "head":"سر", "house":"گھر", "service":"سروس", "friend":"دوست", "father":"والد", "power":"طاقت", "hour":"گھنٹہ", "game":"کھیل", 
//        "line":"لکیر", "end":"اختتام", "member":"رکن", "law":"قانون", "car":"گاڑی", "city":"شہر", "community":"برادری", "name":"نام", 
//        "president":"صدر", "team":"ٹیم", "minute":"منٹ", "idea":"خیال", "kid":"بچہ", "body":"جسم", "information":"معلومات", 
//        "parent":"والدین", "face":"چہرہ", "others":"دوسرے", "level":"سطح", "office":"دفتر", "door":"دروازہ", "health":"صحت", "person":"شخص", 
//        "art":"فن", "war":"جنگ", "history":"تاریخ", "party":"پارٹی", "result":"نتیجہ", "change":"تبدیلی", "morning":"صبح", "reason":"وجہ", 
//        "research":"تحقیق", "girl":"لڑکی", "guy":"لڑکا", "moment":"لمحہ", "air":"ہوا", "teacher":"استاد", "force":"زور", "education":"تعلیم" ,
// "foot":"پاؤں", "boy":"لڑکا", "age":"عمر", "policy":"پالیسی", "everything":"سب کچھ", "process":"عمل", "music":"موسیقی", "market":"بازار", 
// "sense":"احساس", "nation":"قوم", "plan":"منصوبہ", "college":"کالج", "interest":"دلچسپی", "death":"موت", "experience":"تجربہ", "effect":"اثر", 
//  "class":"کلاس", "control":"کنٹرول", "care":"خیال", "perhaps":"شاید", "late":"دیر", "type":"قسم", "language":"زبان", 
// "move":"حرکت", "love":"محبت",  "support":"مدد", "technology":"ٹیکنالوجی", "catch":"پکڑنا", "situation":"صورتحال", "easy":"آسان",
//  "create":"بنانا", "record":"ریکارڈ", "opportunity":"موقع", "rate":"شرح",  "strong":"مضبوط", "action":"عمل", "answer":"جواب", 
//  "resource":"وسیلہ", "meeting":"ملاقات",  "board":"بورڈ", "event":"واقعہ", "figure":"شکل", "model":"ماڈل", "nature":"قدرت", 
//  "source":"ذریعہ", "method":"طریقہ", "data":"ڈیٹا", "product":"مصنوعات",  "cost":"لاگت", "industry":"صنعت", "value":"قدر", 
//  "activity":"سرگرمی",  "performance":"کارکردگی", "growth":"ترقی", "field":"میدان", "worker":"مزدور", 
//  "risk":"خطرہ", "news":"خبر", "security":"سیکیورٹی", "benefit":"فائدہ", "environment":"ماحول", "glass":"شیشہ", "skill":"مہارت", "goal":"مقصد", 
//  "machine":"مشین", "customer":"گاہک", "economy":"معیشت", "management":"انتظام", "relationship":"تعلق", "failure":"ناکامی", "respect":"عزت",
//  "statement":"بیان", "opinion":"رائے", "option":"اختیار", "degree":"ڈگری", "chance":"موقع", "condition":"حالت", "choice":"چوائس",
//   "character":"کردار",  "design":"ڈیزائن", "pain":"درد", "truth":"سچ", "holiday":"چھٹی", "visit":"دورہ", 
//   "opposition":"مخالفت", "agreement":"معاہدہ", "response":"جواب", "thought":"خیال", "leader":"رہنما", "difference":"فرق", "light":"روشنی", "training":"تربیت" ,
//  "income":"آمدنی",  "demand":"طلب", "attention":"توجہ", "bank":"بینک", "camera":"کیمرہ", "culture":"ثقافت", 
//  "direction":"سمت", "discussion":"بحث", "effort":"کوشش", "energy":"توانائی",   "future":"مستقبل", 
//  "image":"تصویر", "investment":"سرمایہ کاری", "knowledge":"علم", "leadership":"رہنمائی", "memory":"یادداشت",  
//  "pressure":"دباؤ", "priority":"ترجیح", "progress":"ترقی", "project":"منصوبہ", "quality":"معیار", "reaction":"رد عمل", "reality":"حقیقت", 
//  "responsibility":"ذمہ داری", "revenue":"آمدن", "strategy":"حکمت عملی", "success":"کامیابی",  "target":"ہدف", "theory":"نظریہ",
//    "understanding":"سمجھ", "vision":"نظریہ", "ability":"صلاحیت", "advertising":"اشتہار",  "analysis":"تجزیہ",
//    "application":"درخواست", "appointment":"ملاقات",  "argument":"دلیل", "arrival":"آمد", "aspect":"پہلو", "assessment":"جائزہ", 
// "assignment":"کام", "assistance":"مدد", "attempt":"کوشش", "attitude":"رویہ", "audience":"ناظرین", "awareness":"آگاہی", "background":"پس منظر",
//  "behavior":"رویہ", "belief":"یقین", "budget":"بجٹ", "capacity":"صلاحیت", "category":"زمرہ", "celebration":"تقریب", "challenge":"چیلنج", 
//    "circumstance":"حالت", "communication":"ابلاغ",  "competition":"مقابلہ", 
//  "complaint":"شکایت", "concept":"تصور", "conclusion":"نتیجہ", "confidence":"اعتماد", "conflict":"تنازع", "connection":"رابطہ", 
//  "consequence":"نتیجہ", "construction":"تعمیر", "consumer":"صارف", "contact":"رابطہ", "contribution":"شراکت", "conversation":"گفتگو", 
// "cooperation":"تعاون", "creativity":"تخلیقیت", "criticism":"تنقید",   "damage":"نقصان", "decision":"فیصلہ",
//  "definition":"تعریف", "delivery":"ترسیل", "departure":"روانگی", "description":"تفصیل", "development":"ترقی",  
//  "difficulty":"مشکل",  "disaster":"آفت",  "distribution":"تقسیم", "efficiency":"افادیت" ,
//  "emotion":"جذبہ", "employee":"ملازم", "employer":"آجر", "encouragement":"حوصلہ افزائی", "ending":"اختتام", "engagement":"مشغولیت", 
//   "enthusiasm":"جوش", "entry":"داخلہ",  "error":"غلطی", "establishment":"ادارہ", "evidence":"ثبوت", "examination":"امتحان",
//    "example":"مثال", "exchange":"تبادلہ", "excitement":"جوش", "exercise":"ورزش",  "explanation":"وضاحت", "expression":"اظہار",
//   "faith":"ایمان",  "feeling":"احساس",  "fight":"لڑائی", 
//   "file":"فائل", "finance":"مالیات", "finding":"دریافت", "flight":"پرواز", "focus":"توجہ", "food":"کھانا", "form":"فارم",
//    "foundation":"بنیاد", "freedom":"آزادی",  "friendship":"دوستی", "function":"فنکشن",  
//      "guidance":"رہنمائی", "habit":"عادت", "happiness":"خوشی",  
//     "help":"مدد",   "hope":"امید", "hospital":"ہسپتال", "hotel":"ہوٹل",   
//      "identity":"شناخت", "impact":"اثر", "importance":"اہمیت", "impression":"تاثر", "improvement":"بہتری", 
//     "independence":"خود مختاری", "initiative":"پہل", "injury":"چوٹ", "inquiry":"تحقیق", 
//     "inside":"اندر", "inspection":"معائنہ", "instance":"مثال", "instruction":"ہدایت", "insurance":"انشورنس", "intelligence":"ذہانت", 
//     "intention":"ارادہ", "interaction":"تفاعل",  "introduction":"تعارف",  
//     "invitation":"دعوت",  "item":"چیز",  "journey":"سفر", "judge":"جج", "judgment":"فیصلہ", "justice":"انصاف", 
//     "key":"چابی", "kindness":"مہربانی",  "lack":"کمی", "land":"زمین",   
//      "learning":"سیکھنا", "lecture":"لیکچر" 

// }

// export function translateToUrdu(text: string): string {
//   return text
//     .split(' ')
//     .map(word => urduDict[word] || word)
//     .join(' ');
// }
import translate from "@iamtraction/google-translate";

export async function translateToUrdu(text: string): Promise<string> {
  try {
    const res = await translate(text, { to: "ur" });
    return res.text;
  } catch (error) {
    console.error("🌐 Urdu translation failed:", error);
    return "ترجمہ ناکام ہو گیا";
  }
}
