import { CropOption, StateLocation, MandiPriceFilter } from './types';

export const SUPPORTED_CROPS: CropOption[] = [
  { id: 'Wheat', nameEn: 'Wheat', nameHi: 'गेहूँ', category: 'Cereals' },
  { id: 'Soybean', nameEn: 'Soybean', nameHi: 'सोयाबीन', category: 'Oilseeds' },
  { id: 'Mustard', nameEn: 'Mustard', nameHi: 'सरसों', category: 'Oilseeds' },
  { id: 'Gram', nameEn: 'Gram (Chana)', nameHi: 'चना', category: 'Pulses' },
  { id: 'Onion', nameEn: 'Onion', nameHi: 'प्याज', category: 'Vegetables' },
  { id: 'Cotton', nameEn: 'Cotton (Kapas)', nameHi: 'कपास', category: 'Commercial' },
  { id: 'Maize', nameEn: 'Maize', nameHi: 'मक्का', category: 'Cereals' },
];

export const SUPPORTED_LOCATIONS: StateLocation[] = [
  {
    state: 'Madhya Pradesh',
    stateHi: 'मध्य प्रदेश',
    districts: [
      { id: 'Sehore', nameEn: 'Sehore', nameHi: 'सीहोर' },
      { id: 'Dewas', nameEn: 'Dewas', nameHi: 'देवास' },
      { id: 'Ujjain', nameEn: 'Ujjain', nameHi: 'उज्जैन' },
      { id: 'Indore', nameEn: 'Indore', nameHi: 'इंदौर' },
      { id: 'Hoshangabad', nameEn: 'Narmadapuram (Hoshangabad)', nameHi: 'नर्मदापुरम' },
      { id: 'Vidisha', nameEn: 'Vidisha', nameHi: 'विदिशा' },
    ],
  },
  {
    state: 'Punjab',
    stateHi: 'पंजाब',
    districts: [
      { id: 'Ludhiana', nameEn: 'Ludhiana', nameHi: 'लुधियाना' },
      { id: 'Khanna', nameEn: 'Khanna', nameHi: 'खन्ना' },
      { id: 'Patiala', nameEn: 'Patiala', nameHi: 'पटियाला' },
      { id: 'Bathinda', nameEn: 'Bathinda', nameHi: 'बठिंडा' },
    ],
  },
  {
    state: 'Rajasthan',
    stateHi: 'राजस्थान',
    districts: [
      { id: 'Kota', nameEn: 'Kota', nameHi: 'कोटा' },
      { id: 'Baran', nameEn: 'Baran', nameHi: 'बारां' },
      { id: 'Sri Ganganagar', nameEn: 'Sri Ganganagar', nameHi: 'श्री गंगानगर' },
      { id: 'Alwar', nameEn: 'Alwar', nameHi: 'अलवर' },
    ],
  },
  {
    state: 'Maharashtra',
    stateHi: 'महाराष्ट्र',
    districts: [
      { id: 'Nashik', nameEn: 'Nashik', nameHi: 'नासिक' },
      { id: 'Ahmednagar', nameEn: 'Ahmednagar', nameHi: 'अहमदनगर' },
      { id: 'Latur', nameEn: 'Latur', nameHi: 'लातूर' },
      { id: 'Akola', nameEn: 'Akola', nameHi: 'अकोला' },
    ],
  },
];

export const DEFAULT_FILTER: MandiPriceFilter = {
  commodity: 'Wheat',
  state: 'Madhya Pradesh',
  district: 'Sehore',
};

export const APP_DISCLAIMERS = {
  en: {
    title: 'Indicative Price Notice',
    body: 'Reported mandi modal prices are official auction benchmarks for Fair Average Quality (FAQ) produce. Actual realized prices may vary depending on moisture content, grain quality grading, bagging, weighment deductions, and local transport costs. Please confirm with your local mandi commission agent (arhatiya) before transit.',
    sourceLabel: 'Data Source',
    defaultSource: 'Agmarknet / e-NAM Live Auction Records',
  },
  hi: {
    title: 'संकेतक भाव सूचना',
    body: 'दर्ज किए गए मंडी मॉडल भाव औसत गुणवत्ता (FAQ) उपज के आधिकारिक नीलामी संदर्भ भाव हैं। वास्तविक भुगतान उपज की नमी, गुणवत्ता ग्रेडिंग, वजन कटौती तथा ढुलाई/भाड़ा खर्च पर निर्भर करता है। माल ले जाने से पूर्व अपनी स्थानीय मंडी या आढ़ती से पुष्टि अवश्य करें।',
    sourceLabel: 'डेटा स्रोत',
    defaultSource: 'एगमार्कनेट / ई-नाम नीलामी रिकॉर्ड',
  },
};
