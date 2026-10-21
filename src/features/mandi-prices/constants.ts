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
      { id: 'Bhopal', nameEn: 'Bhopal', nameHi: 'भोपाल' },
      { id: 'Vidisha', nameEn: 'Vidisha', nameHi: 'विदिशा' },
      { id: 'Hoshangabad', nameEn: 'Narmadapuram (Hoshangabad)', nameHi: 'नर्मदापुरम' },
      { id: 'Harda', nameEn: 'Harda', nameHi: 'हरदा' },
      { id: 'Jabalpur', nameEn: 'Jabalpur', nameHi: 'जबलपुर' },
      { id: 'Mandsaur', nameEn: 'Mandsaur', nameHi: 'मंदसौर' },
      { id: 'Neemuch', nameEn: 'Neemuch', nameHi: 'नीमच' },
    ],
  },
  {
    state: 'Uttar Pradesh',
    stateHi: 'उत्तर प्रदेश',
    districts: [
      { id: 'Agra', nameEn: 'Agra', nameHi: 'आगरा' },
      { id: 'Aligarh', nameEn: 'Aligarh', nameHi: 'अलीगढ़' },
      { id: 'Kanpur', nameEn: 'Kanpur Nagar', nameHi: 'कानपुर नगर' },
      { id: 'Lucknow', nameEn: 'Lucknow', nameHi: 'लखनऊ' },
      { id: 'Varanasi', nameEn: 'Varanasi', nameHi: 'वाराणसी' },
      { id: 'Meerut', nameEn: 'Meerut', nameHi: 'मेरठ' },
      { id: 'Mathura', nameEn: 'Mathura', nameHi: 'मथुरा' },
      { id: 'Bareilly', nameEn: 'Bareilly', nameHi: 'बरेली' },
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
      { id: 'Jaipur', nameEn: 'Jaipur', nameHi: 'जयपुर' },
      { id: 'Bikaner', nameEn: 'Bikaner', nameHi: 'बीकानेर' },
      { id: 'Jodhpur', nameEn: 'Jodhpur', nameHi: 'जोधपुर' },
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
      { id: 'Amritsar', nameEn: 'Amritsar', nameHi: 'अमृतसर' },
      { id: 'Jalandhar', nameEn: 'Jalandhar', nameHi: 'जालंधर' },
    ],
  },
  {
    state: 'Maharashtra',
    stateHi: 'महाराष्ट्र',
    districts: [
      { id: 'Nashik', nameEn: 'Nashik', nameHi: 'नासिक' },
      { id: 'Ahmednagar', nameEn: 'Ahmednagar (Ahilyanagar)', nameHi: 'अहमदनगर' },
      { id: 'Pune', nameEn: 'Pune', nameHi: 'पुणे' },
      { id: 'Latur', nameEn: 'Latur', nameHi: 'लातूर' },
      { id: 'Akola', nameEn: 'Akola', nameHi: 'अकोला' },
      { id: 'Nagpur', nameEn: 'Nagpur', nameHi: 'नागपुर' },
      { id: 'Jalgaon', nameEn: 'Jalgaon', nameHi: 'जलगांव' },
    ],
  },
  {
    state: 'Haryana',
    stateHi: 'हरियाणा',
    districts: [
      { id: 'Karnal', nameEn: 'Karnal', nameHi: 'करनाल' },
      { id: 'Ambala', nameEn: 'Ambala', nameHi: 'अंबाला' },
      { id: 'Hisar', nameEn: 'Hisar', nameHi: 'हिसार' },
      { id: 'Sirsa', nameEn: 'Sirsa', nameHi: 'सिरसा' },
      { id: 'Kurukshetra', nameEn: 'Kurukshetra', nameHi: 'कुरुक्षेत्र' },
    ],
  },
  {
    state: 'Gujarat',
    stateHi: 'गुजरात',
    districts: [
      { id: 'Rajkot', nameEn: 'Rajkot', nameHi: 'राजकोट' },
      { id: 'Gondal', nameEn: 'Gondal', nameHi: 'गोंडल' },
      { id: 'Surat', nameEn: 'Surat', nameHi: 'सूरत' },
      { id: 'Ahmedabad', nameEn: 'Ahmedabad', nameHi: 'अहमदाबाद' },
      { id: 'Junagadh', nameEn: 'Junagadh', nameHi: 'जूनागढ़' },
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
