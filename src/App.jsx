import { useState, useMemo, useRef, useEffect } from "react";

// ─── COUNTRIES DATA ──────────────────────────────────────────────────────────────
// 4 types only: capital, former, city, unicode
const COUNTRIES = [
  { name: "Afghanistan", wiki: "Afghanistan", cap: [34.5281, 69.1723], locs: [["Kabul", 34.5281, 69.1723, "capital"], ["Kandahar", 31.6133, 65.7073, "former"], ["Mazar-i-Sharif", 36.7069, 67.1124, "city"], ["Herat", 34.3482, 62.2041, "city"]] },
  { name: "Albania", wiki: "Albania", cap: [41.3317, 19.8319], locs: [["Tirana", 41.3317, 19.8319, "capital"], ["Durrës", 41.3246, 19.4565, "former"], ["Gjirokastër", 40.0758, 20.1389, "unicode"], ["Berat", 40.7058, 19.9522, "unicode"], ["Shkodër", 42.0683, 19.5126, "city"]] },
  { name: "Algeria", wiki: "Algeria", cap: [36.7372, 3.0865], locs: [["Algiers", 36.7372, 3.0865, "capital"], ["Oran", 35.6969, -0.6331, "city"], ["Constantine", 36.3650, 6.6147, "city"], ["Timgad", 35.4869, 6.4680, "unicode"], ["Tipasa", 36.5900, 2.4478, "unicode"]] },
  { name: "Andorra", wiki: "Andorra", cap: [42.5063, 1.5218], locs: [["Andorra la Vella", 42.5063, 1.5218, "capital"], ["Escaldes-Engordany", 42.5063, 1.5395, "city"]] },
  { name: "Angola", wiki: "Angola", cap: [-8.8390, 13.2894], locs: [["Luanda", -8.8390, 13.2894, "capital"], ["Lubango", -14.9177, 13.4920, "city"], ["Huambo", -12.7758, 15.7392, "city"], ["Lobito", -12.3647, 13.5459, "city"]] },
  { name: "Antigua and Barbuda", wiki: "Antigua_and_Barbuda", cap: [17.1274, -61.8468], locs: [["Saint John's", 17.1274, -61.8468, "capital"]] },
  { name: "Argentina", wiki: "Argentina", cap: [-34.6037, -58.3816], locs: [["Buenos Aires", -34.6037, -58.3816, "capital"], ["Córdoba", -31.4201, -64.1888, "city"], ["Rosario", -32.9442, -60.6505, "city"], ["Mendoza", -32.8895, -68.8458, "city"], ["La Plata", -34.9215, -57.9545, "city"]] },
  { name: "Armenia", wiki: "Armenia", cap: [40.1872, 44.5152], locs: [["Yerevan", 40.1872, 44.5152, "capital"], ["Gyumri", 40.7942, 43.8453, "city"], ["Vanadzor", 40.8128, 44.4879, "city"]] },
  { name: "Australia", wiki: "Australia", cap: [-35.2835, 149.1281], locs: [["Canberra", -35.2835, 149.1281, "capital"], ["Sydney", -33.8688, 151.2093, "city"], ["Melbourne", -37.8136, 144.9631, "city"], ["Brisbane", -27.4698, 153.0251, "city"], ["Perth", -31.9505, 115.8605, "city"]] },
  { name: "Austria", wiki: "Austria", cap: [48.2082, 16.3738], locs: [["Vienna", 48.2082, 16.3738, "capital"], ["Graz", 47.0707, 15.4395, "city"], ["Innsbruck", 47.2692, 11.4041, "city"], ["Salzburg", 47.8095, 13.0550, "unicode"]] },
  { name: "Azerbaijan", wiki: "Azerbaijan", cap: [40.4093, 49.8671], locs: [["Baku", 40.4093, 49.8671, "capital"], ["Ganja", 40.6828, 46.3606, "city"], ["Walled City of Baku", 40.3667, 49.8333, "unicode"]] },
  { name: "Bahamas", wiki: "The_Bahamas", cap: [25.0480, -77.3554], locs: [["Nassau", 25.0480, -77.3554, "capital"]] },
  { name: "Bahrain", wiki: "Bahrain", cap: [26.2154, 50.5832], locs: [["Manama", 26.2154, 50.5832, "capital"], ["Qal'at al-Bahrain", 26.2333, 50.5167, "unicode"]] },
  { name: "Bangladesh", wiki: "Bangladesh", cap: [23.8103, 90.4125], locs: [["Dhaka", 23.8103, 90.4125, "capital"], ["Chittagong", 22.3569, 91.7832, "city"], ["Sylhet", 24.8949, 91.8687, "city"], ["Rajshahi", 24.3745, 88.6042, "city"]] },
  { name: "Barbados", wiki: "Barbados", cap: [13.0969, -59.6145], locs: [["Bridgetown", 13.0969, -59.6145, "capital"]] },
  { name: "Belarus", wiki: "Belarus", cap: [53.9006, 27.5590], locs: [["Minsk", 53.9006, 27.5590, "capital"], ["Brest", 52.0976, 23.7341, "city"], ["Grodno", 53.6884, 23.8258, "city"], ["Mir Castle Complex", 53.4519, 26.4728, "unicode"]] },
  { name: "Belgium", wiki: "Belgium", cap: [50.8503, 4.3517], locs: [["Brussels", 50.8503, 4.3517, "capital"], ["Ghent", 51.0543, 3.7174, "city"], ["Antwerp", 51.2194, 4.4025, "city"], ["Bruges", 51.2093, 3.2247, "unicode"]] },
  { name: "Belize", wiki: "Belize", cap: [17.2510, -88.7590], locs: [["Belmopan", 17.2510, -88.7590, "capital"], ["Belize City", 17.4998, -88.1962, "former"]] },
  { name: "Benin", wiki: "Benin", cap: [6.3676, 2.4252], locs: [["Porto-Novo", 6.3676, 2.4252, "capital"], ["Cotonou", 6.3654, 2.4183, "city"], ["Abomey", 7.1841, 1.9888, "unicode"]] },
  { name: "Bhutan", wiki: "Bhutan", cap: [27.4728, 89.6390], locs: [["Thimphu", 27.4728, 89.6390, "capital"], ["Paro", 27.4287, 89.4164, "city"], ["Punakha", 27.5906, 89.8678, "former"]] },
  { name: "Bolivia", wiki: "Bolivia", cap: [-16.5000, -68.1501], locs: [["La Paz", -16.5000, -68.1501, "capital"], ["Sucre", -19.0478, -65.2592, "former"], ["Santa Cruz", -17.8146, -63.1561, "city"], ["Cochabamba", -17.3895, -66.1577, "city"]] },
  { name: "Bosnia and Herzegovina", wiki: "Bosnia_and_Herzegovina", cap: [43.8486, 18.3564], locs: [["Sarajevo", 43.8486, 18.3564, "capital"], ["Mostar", 43.3438, 17.8078, "unicode"], ["Banja Luka", 44.7722, 17.1910, "city"]] },
  { name: "Botswana", wiki: "Botswana", cap: [-24.6282, 25.9231], locs: [["Gaborone", -24.6282, 25.9231, "capital"], ["Francistown", -21.1658, 27.5103, "city"]] },
  { name: "Brazil", wiki: "Brazil", cap: [-15.7795, -47.9297], locs: [["Brasília", -15.7795, -47.9297, "capital"], ["Rio de Janeiro", -22.9068, -43.1729, "former"], ["São Paulo", -23.5558, -46.6396, "city"], ["Salvador", -12.9714, -38.5014, "city"], ["Belo Horizonte", -19.9167, -43.9345, "city"]] },
  { name: "Brunei", wiki: "Brunei", cap: [4.9031, 114.9398], locs: [["Bandar Seri Begawan", 4.9031, 114.9398, "capital"]] },
  { name: "Bulgaria", wiki: "Bulgaria", cap: [42.6977, 23.3219], locs: [["Sofia", 42.6977, 23.3219, "capital"], ["Plovdiv", 42.1354, 24.7453, "former"], ["Varna", 43.2141, 27.9147, "city"], ["Burgas", 42.5047, 27.4632, "city"]] },
  { name: "Burkina Faso", wiki: "Burkina_Faso", cap: [12.3714, -1.5197], locs: [["Ouagadougou", 12.3714, -1.5197, "capital"], ["Bobo-Dioulasso", 11.1771, -4.2979, "city"]] },
  { name: "Burundi", wiki: "Burundi", cap: [-3.4271, 29.9249], locs: [["Gitega", -3.4271, 29.9249, "capital"], ["Bujumbura", -3.3818, 29.3622, "former"]] },
  { name: "Cabo Verde", wiki: "Cape_Verde", cap: [14.9330, -23.5133], locs: [["Praia", 14.9330, -23.5133, "capital"], ["Cidade Velha", 14.9167, -23.6000, "unicode"]] },
  { name: "Cambodia", wiki: "Cambodia", cap: [11.5625, 104.9160], locs: [["Phnom Penh", 11.5625, 104.9160, "capital"], ["Siem Reap", 13.3671, 103.8448, "city"], ["Battambang", 13.0957, 103.2022, "city"], ["Angkor", 13.4125, 103.8670, "unicode"]] },
  { name: "Cameroon", wiki: "Cameroon", cap: [3.8667, 11.5167], locs: [["Yaoundé", 3.8667, 11.5167, "capital"], ["Douala", 4.0511, 9.7679, "city"]] },
  { name: "Canada", wiki: "Canada", cap: [45.4215, -75.6972], locs: [["Ottawa", 45.4215, -75.6972, "capital"], ["Toronto", 43.6532, -79.3832, "city"], ["Montreal", 45.5017, -73.5673, "city"], ["Vancouver", 49.2827, -123.1207, "city"], ["Calgary", 51.0447, -114.0719, "city"]] },
  { name: "Central African Republic", wiki: "Central_African_Republic", cap: [4.3612, 18.5550], locs: [["Bangui", 4.3612, 18.5550, "capital"]] },
  { name: "Chad", wiki: "Chad", cap: [12.1048, 15.0444], locs: [["N'Djamena", 12.1048, 15.0444, "capital"], ["Moundou", 8.5667, 16.0833, "city"]] },
  { name: "Chile", wiki: "Chile", cap: [-33.4489, -70.6693], locs: [["Santiago", -33.4489, -70.6693, "capital"], ["Valparaíso", -33.0472, -71.6127, "city"], ["Concepción", -36.8201, -73.0444, "city"], ["Valdivia", -39.8142, -73.2456, "city"]] },
  { name: "China", wiki: "China", cap: [39.9042, 116.4074], locs: [["Beijing", 39.9042, 116.4074, "capital"], ["Shanghai", 31.2304, 121.4737, "city"], ["Guangzhou", 23.1291, 113.2644, "city"], ["Shenzhen", 22.5431, 114.0579, "city"], ["Chongqing", 29.4316, 106.9123, "city"]] },
  { name: "Colombia", wiki: "Colombia", cap: [4.7110, -74.0721], locs: [["Bogotá", 4.7110, -74.0721, "capital"], ["Medellín", 6.2442, -75.5812, "city"], ["Cali", 3.4516, -76.5320, "city"], ["Cartagena", 10.3910, -75.4794, "unicode"], ["Barranquilla", 10.9639, -74.7964, "city"]] },
  { name: "Comoros", wiki: "Comoros", cap: [-11.7022, 43.2551], locs: [["Moroni", -11.7022, 43.2551, "capital"]] },
  { name: "Congo (DRC)", wiki: "Democratic_Republic_of_the_Congo", cap: [-4.3276, 15.3136], locs: [["Kinshasa", -4.3276, 15.3136, "capital"], ["Lubumbashi", -11.6600, 27.4794, "city"]] },
  { name: "Congo (Republic)", wiki: "Republic_of_the_Congo", cap: [-4.2661, 15.2832], locs: [["Brazzaville", -4.2661, 15.2832, "capital"], ["Pointe-Noire", -4.7692, 11.8664, "city"]] },
  { name: "Costa Rica", wiki: "Costa_Rica", cap: [9.9281, -84.0907], locs: [["San José", 9.9281, -84.0907, "capital"]] },
  { name: "Côte d'Ivoire", wiki: "Ivory_Coast", cap: [6.8276, -5.2893], locs: [["Yamoussoukro", 6.8276, -5.2893, "capital"], ["Abidjan", 5.3600, -4.0083, "former"]] },
  { name: "Croatia", wiki: "Croatia", cap: [45.8150, 15.9819], locs: [["Zagreb", 45.8150, 15.9819, "capital"], ["Split", 43.5081, 16.4402, "city"], ["Rijeka", 45.3271, 14.4422, "city"], ["Dubrovnik", 42.6507, 18.0944, "unicode"], ["Trogir", 43.5158, 16.2511, "unicode"]] },
  { name: "Cuba", wiki: "Cuba", cap: [23.1136, -82.3666], locs: [["Havana", 23.1136, -82.3666, "capital"], ["Santiago de Cuba", 20.0243, -75.8219, "city"], ["Camagüey", 21.3803, -77.9169, "city"], ["Trinidad", 21.8028, -79.9841, "unicode"]] },
  { name: "Cyprus", wiki: "Cyprus", cap: [35.1856, 33.3823], locs: [["Nicosia", 35.1856, 33.3823, "capital"], ["Limassol", 34.6786, 33.0413, "city"], ["Larnaca", 34.9127, 33.6333, "city"]] },
  { name: "Czech Republic", wiki: "Czech_Republic", cap: [50.0755, 14.4378], locs: [["Prague", 50.0755, 14.4378, "capital"], ["Brno", 49.1951, 16.6068, "city"], ["Ostrava", 49.8209, 18.2625, "city"], ["Český Krumlov", 48.8127, 14.3175, "unicode"]] },
  { name: "Denmark", wiki: "Denmark", cap: [55.6761, 12.5683], locs: [["Copenhagen", 55.6761, 12.5683, "capital"], ["Aarhus", 56.1629, 10.2039, "city"], ["Odense", 55.4038, 10.3875, "city"]] },
  { name: "Djibouti", wiki: "Djibouti", cap: [11.8251, 42.5903], locs: [["Djibouti City", 11.8251, 42.5903, "capital"]] },
  { name: "Dominica", wiki: "Dominica", cap: [15.3017, -61.3881], locs: [["Roseau", 15.3017, -61.3881, "capital"]] },
  { name: "Dominican Republic", wiki: "Dominican_Republic", cap: [18.4861, -69.9312], locs: [["Santo Domingo", 18.4861, -69.9312, "capital"], ["Santiago de los Caballeros", 19.4517, -70.6970, "city"]] },
  { name: "Ecuador", wiki: "Ecuador", cap: [-0.2298, -78.5249], locs: [["Quito", -0.2298, -78.5249, "capital"], ["Guayaquil", -2.1962, -79.8862, "city"], ["Cuenca", -2.9001, -79.0059, "unicode"]] },
  { name: "Egypt", wiki: "Egypt", cap: [30.0444, 31.2357], locs: [["Cairo", 30.0444, 31.2357, "capital"], ["Alexandria", 31.1975, 29.8925, "city"], ["Giza", 30.0131, 31.1830, "city"], ["Memphis", 29.8442, 31.2527, "former"]] },
  { name: "El Salvador", wiki: "El_Salvador", cap: [13.6929, -89.2182], locs: [["San Salvador", 13.6929, -89.2182, "capital"], ["Joya de Cerén", 13.7169, -89.5728, "unicode"]] },
  { name: "Equatorial Guinea", wiki: "Equatorial_Guinea", cap: [3.7500, 8.7833], locs: [["Malabo", 3.7500, 8.7833, "capital"], ["Bata", 1.8639, 9.7661, "city"]] },
  { name: "Eritrea", wiki: "Eritrea", cap: [15.3229, 38.9251], locs: [["Asmara", 15.3229, 38.9251, "capital"]] },
  { name: "Estonia", wiki: "Estonia", cap: [59.4370, 24.7536], locs: [["Tallinn", 59.4370, 24.7536, "capital"], ["Tartu", 58.3780, 26.7290, "city"], ["Narva", 59.3778, 28.1945, "city"]] },
  { name: "Eswatini", wiki: "Eswatini", cap: [-26.3054, 31.1367], locs: [["Mbabane", -26.3054, 31.1367, "capital"], ["Lobamba", -26.4667, 31.2000, "former"]] },
  { name: "Ethiopia", wiki: "Ethiopia", cap: [8.9806, 38.7578], locs: [["Addis Ababa", 8.9806, 38.7578, "capital"], ["Dire Dawa", 9.5499, 41.8606, "city"], ["Aksum", 14.1310, 38.7256, "unicode"], ["Lalibela", 12.0319, 39.0472, "unicode"]] },
  { name: "Fiji", wiki: "Fiji", cap: [-18.1416, 178.4419], locs: [["Suva", -18.1416, 178.4419, "capital"], ["Nadi", -17.7765, 177.4356, "city"]] },
  { name: "Finland", wiki: "Finland", cap: [60.1699, 24.9384], locs: [["Helsinki", 60.1699, 24.9384, "capital"], ["Espoo", 60.2055, 24.6559, "city"], ["Tampere", 61.4978, 23.7610, "city"], ["Turku", 60.4518, 22.2666, "former"]] },
  { name: "France", wiki: "France", cap: [48.8566, 2.3522], locs: [["Paris", 48.8566, 2.3522, "capital"], ["Marseille", 43.2965, 5.3698, "city"], ["Lyon", 45.7640, 4.8357, "city"], ["Toulouse", 43.6047, 1.4442, "city"], ["Nice", 43.7102, 7.2620, "city"]] },
  { name: "Gabon", wiki: "Gabon", cap: [0.3901, 9.4500], locs: [["Libreville", 0.3901, 9.4500, "capital"], ["Port-Gentil", -0.7193, 8.7815, "city"]] },
  { name: "Gambia", wiki: "The_Gambia", cap: [13.4531, -16.5775], locs: [["Banjul", 13.4531, -16.5775, "capital"]] },
  { name: "Georgia", wiki: "Georgia_(country)", cap: [41.6938, 44.8015], locs: [["Tbilisi", 41.6938, 44.8015, "capital"], ["Kutaisi", 42.2679, 42.7057, "former"], ["Batumi", 41.6168, 41.6367, "city"]] },
  { name: "Germany", wiki: "Germany", cap: [52.5200, 13.4050], locs: [["Berlin", 52.5200, 13.4050, "capital"], ["Munich", 48.1351, 11.5820, "city"], ["Hamburg", 53.5753, 10.0153, "city"], ["Cologne", 50.9413, 6.9583, "city"], ["Frankfurt", 50.1109, 8.6821, "city"]] },
  { name: "Ghana", wiki: "Ghana", cap: [5.5600, -0.2057], locs: [["Accra", 5.5600, -0.2057, "capital"], ["Kumasi", 6.6884, -1.6244, "city"]] },
  { name: "Greece", wiki: "Greece", cap: [37.9838, 23.7275], locs: [["Athens", 37.9838, 23.7275, "capital"], ["Thessaloniki", 40.6401, 22.9444, "city"], ["Patras", 38.2466, 21.7346, "city"], ["Delphi", 38.4824, 22.5011, "unicode"]] },
  { name: "Grenada", wiki: "Grenada", cap: [12.0561, -61.7488], locs: [["Saint George's", 12.0561, -61.7488, "capital"]] },
  { name: "Guatemala", wiki: "Guatemala", cap: [14.6349, -90.5069], locs: [["Guatemala City", 14.6349, -90.5069, "capital"], ["Quetzaltenango", 14.8444, -91.5175, "city"], ["Antigua Guatemala", 14.5586, -90.7295, "unicode"], ["Tikal", 17.2220, -89.6237, "unicode"]] },
  { name: "Guinea", wiki: "Guinea", cap: [9.6412, -13.5784], locs: [["Conakry", 9.6412, -13.5784, "capital"]] },
  { name: "Guinea-Bissau", wiki: "Guinea-Bissau", cap: [11.8636, -15.5977], locs: [["Bissau", 11.8636, -15.5977, "capital"]] },
  { name: "Guyana", wiki: "Guyana", cap: [6.8013, -58.1553], locs: [["Georgetown", 6.8013, -58.1553, "capital"]] },
  { name: "Haiti", wiki: "Haiti", cap: [18.5944, -72.3074], locs: [["Port-au-Prince", 18.5944, -72.3074, "capital"]] },
  { name: "Honduras", wiki: "Honduras", cap: [14.0723, -87.2062], locs: [["Tegucigalpa", 14.0723, -87.2062, "capital"], ["San Pedro Sula", 15.5000, -88.0333, "city"]] },
  { name: "Hungary", wiki: "Hungary", cap: [47.4979, 19.0402], locs: [["Budapest", 47.4979, 19.0402, "capital"], ["Debrecen", 47.5316, 21.6273, "city"], ["Szeged", 46.2530, 20.1414, "city"]] },
  { name: "Iceland", wiki: "Iceland", cap: [64.1466, -21.9426], locs: [["Reykjavik", 64.1466, -21.9426, "capital"], ["Akureyri", 65.6885, -18.1262, "city"]] },
  { name: "India", wiki: "India", cap: [28.6139, 77.2090], locs: [["New Delhi", 28.6139, 77.2090, "capital"], ["Mumbai", 19.0760, 72.8777, "city"], ["Bangalore", 12.9716, 77.5946, "city"], ["Kolkata", 22.5726, 88.3639, "city"], ["Chennai", 13.0827, 80.2707, "city"]] },
  { name: "Indonesia", wiki: "Indonesia", cap: [-1.0000, 117.0000], locs: [["Nusantara", -1.0000, 117.0000, "capital"], ["Jakarta", -6.2088, 106.8456, "former"], ["Surabaya", -7.2575, 112.7521, "city"], ["Bandung", -6.9147, 107.6098, "city"]] },
  { name: "Iran", wiki: "Iran", cap: [35.6892, 51.3890], locs: [["Tehran", 35.6892, 51.3890, "capital"], ["Mashhad", 36.2971, 59.6062, "city"], ["Isfahan", 32.6539, 51.6660, "city"], ["Shiraz", 29.5918, 52.5836, "city"]] },
  { name: "Iraq", wiki: "Iraq", cap: [33.3152, 44.3661], locs: [["Baghdad", 33.3152, 44.3661, "capital"], ["Basra", 30.5085, 47.7804, "city"], ["Mosul", 36.3350, 43.1189, "city"]] },
  { name: "Ireland", wiki: "Republic_of_Ireland", cap: [53.3498, -6.2603], locs: [["Dublin", 53.3498, -6.2603, "capital"], ["Cork", 51.8985, -8.4756, "city"], ["Galway", 53.2707, -9.0568, "city"]] },
  { name: "Israel", wiki: "Israel", cap: [31.7683, 35.2137], locs: [["Jerusalem", 31.7683, 35.2137, "capital"], ["Tel Aviv", 32.0853, 34.7818, "city"], ["Haifa", 32.8193, 34.9897, "city"]] },
  { name: "Italy", wiki: "Italy", cap: [41.9028, 12.4964], locs: [["Rome", 41.9028, 12.4964, "capital"], ["Milan", 45.4642, 9.1900, "city"], ["Naples", 40.8522, 14.2681, "city"], ["Florence", 43.7696, 11.2558, "unicode"], ["Venice", 45.4408, 12.3155, "unicode"]] },
  { name: "Jamaica", wiki: "Jamaica", cap: [17.9714, -76.7937], locs: [["Kingston", 17.9714, -76.7937, "capital"]] },
  { name: "Japan", wiki: "Japan", cap: [35.6762, 139.6503], locs: [["Tokyo", 35.6762, 139.6503, "capital"], ["Osaka", 34.6937, 135.5023, "city"], ["Yokohama", 35.4437, 139.6380, "city"], ["Kyoto", 35.0116, 135.7681, "former"]] },
  { name: "Jordan", wiki: "Jordan", cap: [31.9566, 35.9456], locs: [["Amman", 31.9566, 35.9456, "capital"], ["Zarqa", 32.0728, 36.0880, "city"], ["Petra", 30.3285, 35.4444, "unicode"]] },
  { name: "Kazakhstan", wiki: "Kazakhstan", cap: [51.1801, 71.4460], locs: [["Astana", 51.1801, 71.4460, "capital"], ["Almaty", 43.2220, 76.8512, "former"], ["Karaganda", 49.8047, 72.8241, "city"]] },
  { name: "Kenya", wiki: "Kenya", cap: [-1.2921, 36.8219], locs: [["Nairobi", -1.2921, 36.8219, "capital"], ["Mombasa", -4.0435, 39.6682, "city"], ["Kisumu", -0.1022, 34.7617, "city"]] },
  { name: "Kiribati", wiki: "Kiribati", cap: [1.3290, 172.9790], locs: [["South Tarawa", 1.3290, 172.9790, "capital"]] },
  { name: "Kuwait", wiki: "Kuwait", cap: [29.3759, 47.9774], locs: [["Kuwait City", 29.3759, 47.9774, "capital"]] },
  { name: "Kyrgyzstan", wiki: "Kyrgyzstan", cap: [42.8746, 74.5698], locs: [["Bishkek", 42.8746, 74.5698, "capital"], ["Osh", 40.5283, 72.7985, "city"]] },
  { name: "Laos", wiki: "Laos", cap: [17.9757, 102.6331], locs: [["Vientiane", 17.9757, 102.6331, "capital"], ["Luang Prabang", 19.8833, 102.1328, "unicode"]] },
  { name: "Latvia", wiki: "Latvia", cap: [56.9496, 24.1052], locs: [["Riga", 56.9496, 24.1052, "capital"], ["Daugavpils", 55.8747, 26.5361, "city"]] },
  { name: "Lebanon", wiki: "Lebanon", cap: [33.8886, 35.4955], locs: [["Beirut", 33.8886, 35.4955, "capital"], ["Tripoli", 34.4386, 35.8450, "city"], ["Byblos", 34.1236, 35.6481, "unicode"]] },
  { name: "Lesotho", wiki: "Lesotho", cap: [-29.3167, 27.4833], locs: [["Maseru", -29.3167, 27.4833, "capital"]] },
  { name: "Liberia", wiki: "Liberia", cap: [6.3005, -10.7969], locs: [["Monrovia", 6.3005, -10.7969, "capital"]] },
  { name: "Libya", wiki: "Libya", cap: [32.9006, 13.1862], locs: [["Tripoli", 32.9006, 13.1862, "capital"], ["Benghazi", 32.1154, 20.0686, "city"]] },
  { name: "Liechtenstein", wiki: "Liechtenstein", cap: [47.1410, 9.5215], locs: [["Vaduz", 47.1410, 9.5215, "capital"]] },
  { name: "Lithuania", wiki: "Lithuania", cap: [54.6872, 25.2797], locs: [["Vilnius", 54.6872, 25.2797, "capital"], ["Kaunas", 54.8985, 23.9036, "city"], ["Klaipeda", 55.7206, 21.1449, "city"]] },
  { name: "Luxembourg", wiki: "Luxembourg", cap: [49.6116, 6.1319], locs: [["Luxembourg City", 49.6116, 6.1319, "capital"]] },
  { name: "Madagascar", wiki: "Madagascar", cap: [-18.9137, 47.5361], locs: [["Antananarivo", -18.9137, 47.5361, "capital"], ["Toamasina", -18.1492, 49.4023, "city"]] },
  { name: "Malawi", wiki: "Malawi", cap: [-13.9669, 33.7873], locs: [["Lilongwe", -13.9669, 33.7873, "capital"], ["Blantyre", -15.7861, 35.0058, "city"]] },
  { name: "Malaysia", wiki: "Malaysia", cap: [3.1390, 101.6869], locs: [["Kuala Lumpur", 3.1390, 101.6869, "capital"], ["George Town", 5.4141, 100.3288, "unicode"], ["Melaka City", 2.1896, 102.2501, "unicode"]] },
  { name: "Maldives", wiki: "Maldives", cap: [4.1755, 73.5093], locs: [["Malé", 4.1755, 73.5093, "capital"]] },
  { name: "Mali", wiki: "Mali", cap: [12.6392, -8.0029], locs: [["Bamako", 12.6392, -8.0029, "capital"], ["Timbuktu", 16.7735, -3.0074, "unicode"]] },
  { name: "Malta", wiki: "Malta", cap: [35.9042, 14.5189], locs: [["Valletta", 35.9042, 14.5189, "capital"]] },
  { name: "Marshall Islands", wiki: "Marshall_Islands", cap: [7.1167, 171.3667], locs: [["Majuro", 7.1167, 171.3667, "capital"]] },
  { name: "Mauritania", wiki: "Mauritania", cap: [18.0735, -15.9582], locs: [["Nouakchott", 18.0735, -15.9582, "capital"]] },
  { name: "Mauritius", wiki: "Mauritius", cap: [-20.1608, 57.4989], locs: [["Port Louis", -20.1608, 57.4989, "capital"]] },
  { name: "Mexico", wiki: "Mexico", cap: [19.4326, -99.1332], locs: [["Mexico City", 19.4326, -99.1332, "capital"], ["Guadalajara", 20.6597, -103.3496, "city"], ["Monterrey", 25.6866, -100.3161, "city"], ["Puebla", 19.0412, -98.2062, "city"], ["Chichen Itza", 20.6843, -88.5678, "unicode"]] },
  { name: "Micronesia", wiki: "Federated_States_of_Micronesia", cap: [6.9248, 158.1618], locs: [["Palikir", 6.9248, 158.1618, "capital"]] },
  { name: "Moldova", wiki: "Moldova", cap: [47.0105, 28.8638], locs: [["Chișinău", 47.0105, 28.8638, "capital"], ["Bălți", 47.7617, 27.9297, "city"]] },
  { name: "Monaco", wiki: "Monaco", cap: [43.7384, 7.4246], locs: [["Monaco", 43.7384, 7.4246, "capital"]] },
  { name: "Mongolia", wiki: "Mongolia", cap: [47.8864, 106.9057], locs: [["Ulaanbaatar", 47.8864, 106.9057, "capital"], ["Darkhan", 49.5, 105.8167, "city"]] },
  { name: "Montenegro", wiki: "Montenegro", cap: [42.4304, 19.2594], locs: [["Podgorica", 42.4304, 19.2594, "capital"], ["Cetinje", 42.3931, 18.9225, "former"]] },
  { name: "Morocco", wiki: "Morocco", cap: [33.9716, -6.8498], locs: [["Rabat", 33.9716, -6.8498, "capital"], ["Casablanca", 33.5731, -7.5898, "city"], ["Fez", 34.0181, -5.0078, "former"], ["Marrakesh", 31.6295, -7.9811, "unicode"]] },
  { name: "Mozambique", wiki: "Mozambique", cap: [-25.9692, 32.5732], locs: [["Maputo", -25.9692, 32.5732, "capital"], ["Beira", -19.8436, 34.8389, "city"]] },
  { name: "Myanmar", wiki: "Myanmar", cap: [19.7633, 96.0785], locs: [["Naypyidaw", 19.7633, 96.0785, "capital"], ["Yangon", 16.8661, 96.1951, "former"], ["Mandalay", 21.9162, 96.0891, "city"]] },
  { name: "Namibia", wiki: "Namibia", cap: [-22.5597, 17.0832], locs: [["Windhoek", -22.5597, 17.0832, "capital"], ["Walvis Bay", -22.9575, 14.5053, "city"]] },
  { name: "Nauru", wiki: "Nauru", cap: [-0.5477, 166.9209], locs: [["Yaren", -0.5477, 166.9209, "capital"]] },
  { name: "Nepal", wiki: "Nepal", cap: [27.7172, 85.3240], locs: [["Kathmandu", 27.7172, 85.3240, "capital"], ["Pokhara", 28.2096, 83.9856, "city"]] },
  { name: "Netherlands", wiki: "Netherlands", cap: [52.3676, 4.9041], locs: [["Amsterdam", 52.3676, 4.9041, "capital"], ["Rotterdam", 51.9225, 4.4792, "city"], ["The Hague", 52.0705, 4.3007, "city"]] },
  { name: "New Zealand", wiki: "New_Zealand", cap: [-41.2865, 174.7762], locs: [["Wellington", -41.2865, 174.7762, "capital"], ["Auckland", -36.8485, 174.7633, "city"], ["Christchurch", -43.5321, 172.6362, "city"]] },
  { name: "Nicaragua", wiki: "Nicaragua", cap: [12.1364, -86.2514], locs: [["Managua", 12.1364, -86.2514, "capital"], ["León", 12.4359, -86.8782, "former"]] },
  { name: "Niger", wiki: "Niger", cap: [13.5137, 2.1098], locs: [["Niamey", 13.5137, 2.1098, "capital"]] },
  { name: "Nigeria", wiki: "Nigeria", cap: [9.0579, 7.4951], locs: [["Abuja", 9.0579, 7.4951, "capital"], ["Lagos", 6.5244, 3.3792, "former"], ["Ibadan", 7.3775, 3.9470, "city"], ["Kano", 12.0022, 8.5920, "city"]] },
  { name: "North Korea", wiki: "North_Korea", cap: [39.0194, 125.7381], locs: [["Pyongyang", 39.0194, 125.7381, "capital"]] },
  { name: "North Macedonia", wiki: "North_Macedonia", cap: [41.9973, 21.4280], locs: [["Skopje", 41.9973, 21.4280, "capital"], ["Bitola", 41.0113, 21.3245, "city"], ["Ohrid", 41.1231, 20.8016, "unicode"]] },
  { name: "Norway", wiki: "Norway", cap: [59.9139, 10.7522], locs: [["Oslo", 59.9139, 10.7522, "capital"], ["Bergen", 60.3913, 5.3221, "city"], ["Trondheim", 63.4269, 10.3952, "city"]] },
  { name: "Oman", wiki: "Oman", cap: [23.5880, 58.3829], locs: [["Muscat", 23.5880, 58.3829, "capital"], ["Salalah", 17.0151, 54.0924, "city"]] },
  { name: "Pakistan", wiki: "Pakistan", cap: [33.6844, 73.0479], locs: [["Islamabad", 33.6844, 73.0479, "capital"], ["Karachi", 24.8607, 67.0011, "former"], ["Lahore", 31.5204, 74.3587, "city"], ["Multan", 30.1575, 71.4454, "city"]] },
  { name: "Palau", wiki: "Palau", cap: [7.5149, 134.5825], locs: [["Ngerulmud", 7.5149, 134.5825, "capital"]] },
  { name: "Panama", wiki: "Panama", cap: [8.9936, -79.5197], locs: [["Panama City", 8.9936, -79.5197, "capital"], ["San Miguelito", 8.9845, -79.5233, "city"]] },
  { name: "Papua New Guinea", wiki: "Papua_New_Guinea", cap: [-9.4438, 147.1803], locs: [["Port Moresby", -9.4438, 147.1803, "capital"]] },
  { name: "Paraguay", wiki: "Paraguay", cap: [-25.2867, -57.6470], locs: [["Asunción", -25.2867, -57.6470, "capital"]] },
  { name: "Peru", wiki: "Peru", cap: [-12.0464, -77.0428], locs: [["Lima", -12.0464, -77.0428, "capital"], ["Arequipa", -16.4090, -71.5375, "city"], ["Cusco", -13.5319, -71.9675, "former"], ["Machu Picchu", -13.1631, -72.5450, "unicode"]] },
  { name: "Philippines", wiki: "Philippines", cap: [14.5995, 120.9842], locs: [["Manila", 14.5995, 120.9842, "capital"], ["Cebu City", 10.3157, 123.8854, "city"], ["Davao City", 7.0731, 125.6115, "city"]] },
  { name: "Poland", wiki: "Poland", cap: [52.2297, 21.0122], locs: [["Warsaw", 52.2297, 21.0122, "capital"], ["Kraków", 50.0647, 19.9450, "city"], ["Wrocław", 51.1079, 17.0385, "city"], ["Gdańsk", 54.3520, 18.6466, "city"]] },
  { name: "Portugal", wiki: "Portugal", cap: [38.7223, -9.1393], locs: [["Lisbon", 38.7223, -9.1393, "capital"], ["Porto", 41.1579, -8.6291, "city"], ["Covilhã", 40.2835, -7.5006, "city"]] },
  { name: "Qatar", wiki: "Qatar", cap: [25.2854, 51.5310], locs: [["Doha", 25.2854, 51.5310, "capital"]] },
  { name: "Romania", wiki: "Romania", cap: [44.4268, 26.1025], locs: [["Bucharest", 44.4268, 26.1025, "capital"], ["Cluj-Napoca", 46.7712, 23.6236, "city"], ["Timișoara", 45.7489, 21.2087, "city"]] },
  { name: "Russia", wiki: "Russia", cap: [55.7558, 37.6173], locs: [["Moscow", 55.7558, 37.6173, "capital"], ["Saint Petersburg", 59.9343, 30.3351, "former"], ["Novosibirsk", 55.0415, 82.9346, "city"], ["Yekaterinburg", 56.8389, 60.6057, "city"]] },
  { name: "Rwanda", wiki: "Rwanda", cap: [-1.9403, 29.8739], locs: [["Kigali", -1.9403, 29.8739, "capital"]] },
  { name: "Saint Kitts and Nevis", wiki: "Saint_Kitts_and_Nevis", cap: [17.3026, -62.7177], locs: [["Basseterre", 17.3026, -62.7177, "capital"]] },
  { name: "Saint Lucia", wiki: "Saint_Lucia", cap: [14.0101, -60.9875], locs: [["Castries", 14.0101, -60.9875, "capital"]] },
  { name: "Saint Vincent and the Grenadines", wiki: "Saint_Vincent_and_the_Grenadines", cap: [13.1600, -61.2248], locs: [["Kingstown", 13.1600, -61.2248, "capital"]] },
  { name: "Samoa", wiki: "Samoa", cap: [-13.8506, -171.7513], locs: [["Apia", -13.8506, -171.7513, "capital"]] },
  { name: "San Marino", wiki: "San_Marino", cap: [43.9424, 12.4578], locs: [["San Marino City", 43.9424, 12.4578, "capital"]] },
  { name: "São Tomé and Príncipe", wiki: "São_Tomé_and_Príncipe", cap: [0.3365, 6.7273], locs: [["São Tomé", 0.3365, 6.7273, "capital"]] },
  { name: "Saudi Arabia", wiki: "Saudi_Arabia", cap: [24.6877, 46.7219], locs: [["Riyadh", 24.6877, 46.7219, "capital"], ["Mecca", 21.3891, 39.8579, "former"], ["Jeddah", 21.2854, 39.2376, "city"]] },
  { name: "Senegal", wiki: "Senegal", cap: [14.7167, -17.4677], locs: [["Dakar", 14.7167, -17.4677, "capital"], ["Thiès", 14.7949, -16.9239, "city"]] },
  { name: "Serbia", wiki: "Serbia", cap: [44.8176, 20.4633], locs: [["Belgrade", 44.8176, 20.4633, "capital"], ["Novi Sad", 45.2671, 19.8335, "city"], ["Niš", 43.3209, 21.8863, "city"]] },
  { name: "Seychelles", wiki: "Seychelles", cap: [-4.6191, 55.4513], locs: [["Victoria", -4.6191, 55.4513, "capital"]] },
  { name: "Sierra Leone", wiki: "Sierra_Leone", cap: [8.4657, -13.2317], locs: [["Freetown", 8.4657, -13.2317, "capital"]] },
  { name: "Singapore", wiki: "Singapore", cap: [1.3521, 103.8198], locs: [["Singapore", 1.3521, 103.8198, "capital"]] },
  { name: "Slovakia", wiki: "Slovakia", cap: [48.1486, 17.1077], locs: [["Bratislava", 48.1486, 17.1077, "capital"], ["Košice", 48.7164, 21.2611, "city"]] },
  { name: "Slovenia", wiki: "Slovenia", cap: [46.0569, 14.5058], locs: [["Ljubljana", 46.0569, 14.5058, "capital"], ["Maribor", 46.5547, 15.6467, "city"]] },
  { name: "Solomon Islands", wiki: "Solomon_Islands", cap: [-9.4456, 160.0327], locs: [["Honiara", -9.4456, 160.0327, "capital"]] },
  { name: "Somalia", wiki: "Somalia", cap: [2.0469, 45.3182], locs: [["Mogadishu", 2.0469, 45.3182, "capital"], ["Hargeisa", 9.5597, 44.0650, "city"]] },
  { name: "South Africa", wiki: "South_Africa", cap: [-25.7479, 28.2293], locs: [["Pretoria", -25.7479, 28.2293, "capital"], ["Cape Town", -33.9249, 18.4241, "city"], ["Johannesburg", -26.2041, 28.0473, "city"], ["Bloemfontein", -29.1199, 26.2148, "former"]] },
  { name: "South Korea", wiki: "South_Korea", cap: [37.5665, 126.9780], locs: [["Seoul", 37.5665, 126.9780, "capital"], ["Busan", 35.1796, 129.0756, "city"], ["Incheon", 37.4419, 126.7036, "city"], ["Daegu", 35.8714, 128.5890, "city"]] },
  { name: "South Sudan", wiki: "South_Sudan", cap: [4.8594, 31.5713], locs: [["Juba", 4.8594, 31.5713, "capital"]] },
  { name: "Spain", wiki: "Spain", cap: [40.4168, -3.7038], locs: [["Madrid", 40.4168, -3.7038, "capital"], ["Barcelona", 41.3851, 2.1734, "city"], ["Valencia", 39.4699, -0.3763, "city"], ["Seville", 37.3886, -5.9824, "city"], ["Granada", 37.1760, -3.5882, "unicode"]] },
  { name: "Sri Lanka", wiki: "Sri_Lanka", cap: [6.9008, 79.9013], locs: [["Sri Jayawardenepura Kotte", 6.9008, 79.9013, "capital"], ["Colombo", 6.9271, 79.8612, "former"], ["Kandy", 7.2906, 80.6337, "unicode"]] },
  { name: "Sudan", wiki: "Sudan", cap: [15.5007, 32.5599], locs: [["Khartoum", 15.5007, 32.5599, "capital"], ["Omdurman", 15.6145, 32.4800, "city"]] },
  { name: "Suriname", wiki: "Suriname", cap: [5.8520, -55.2038], locs: [["Paramaribo", 5.8520, -55.2038, "capital"]] },
  { name: "Sweden", wiki: "Sweden", cap: [59.3293, 18.0686], locs: [["Stockholm", 59.3293, 18.0686, "capital"], ["Gothenburg", 57.7089, 11.9746, "city"], ["Malmö", 55.6050, 12.9854, "city"], ["Uppsala", 59.8586, 17.6389, "city"]] },
  { name: "Switzerland", wiki: "Switzerland", cap: [46.9480, 7.4474], locs: [["Bern", 46.9480, 7.4474, "capital"], ["Zürich", 47.3769, 8.5417, "city"], ["Geneva", 46.2044, 6.1432, "city"], ["Basel", 47.5596, 7.5886, "city"]] },
  { name: "Syria", wiki: "Syria", cap: [33.5138, 36.2765], locs: [["Damascus", 33.5138, 36.2765, "capital"], ["Aleppo", 36.2021, 37.1343, "former"], ["Homs", 34.7300, 36.7237, "city"]] },
  { name: "Taiwan", wiki: "Taiwan", cap: [25.0330, 121.5654], locs: [["Taipei", 25.0330, 121.5654, "capital"], ["Kaohsiung", 22.6163, 120.3006, "city"], ["Taichung", 24.1372, 120.6735, "city"]] },
  { name: "Tajikistan", wiki: "Tajikistan", cap: [38.5598, 68.7870], locs: [["Dushanbe", 38.5598, 68.7870, "capital"], ["Khujand", 40.2864, 69.6222, "city"]] },
  { name: "Tanzania", wiki: "Tanzania", cap: [-6.1630, 35.7516], locs: [["Dodoma", -6.1630, 35.7516, "capital"], ["Dar es Salaam", -6.7924, 39.2083, "former"], ["Moshi", -3.3667, 37.6667, "city"]] },
  { name: "Thailand", wiki: "Thailand", cap: [13.7563, 100.5018], locs: [["Bangkok", 13.7563, 100.5018, "capital"], ["Chiang Mai", 18.7883, 98.9853, "city"], ["Phuket", 8.1128, 98.2997, "city"], ["Sukhothai", 17.0125, 99.8239, "unicode"]] },
  { name: "Timor-Leste", wiki: "East_Timor", cap: [-8.5569, 125.5603], locs: [["Dili", -8.5569, 125.5603, "capital"]] },
  { name: "Togo", wiki: "Togo", cap: [6.1375, 1.2123], locs: [["Lomé", 6.1375, 1.2123, "capital"]] },
  { name: "Tonga", wiki: "Tonga", cap: [-21.1393, -175.2046], locs: [["Nukuʻalofa", -21.1393, -175.2046, "capital"]] },
  { name: "Trinidad and Tobago", wiki: "Trinidad_and_Tobago", cap: [10.6918, -61.2225], locs: [["Port of Spain", 10.6918, -61.2225, "capital"]] },
  { name: "Tunisia", wiki: "Tunisia", cap: [36.8190, 10.1658], locs: [["Tunis", 36.8190, 10.1658, "capital"], ["Sfax", 34.7406, 10.7603, "city"], ["Sousse", 35.8256, 10.6369, "city"]] },
  { name: "Turkey", wiki: "Turkey", cap: [39.9334, 32.8597], locs: [["Ankara", 39.9334, 32.8597, "capital"], ["Istanbul", 41.0082, 28.9784, "city"], ["İzmir", 38.4161, 27.1398, "city"], ["Bursa", 40.1955, 29.0678, "city"]] },
  { name: "Turkmenistan", wiki: "Turkmenistan", cap: [37.9601, 58.3261], locs: [["Ashgabat", 37.9601, 58.3261, "capital"], ["Turkmenabat", 37.1381, 65.4169, "city"]] },
  { name: "Tuvalu", wiki: "Tuvalu", cap: [-8.5200, 179.1980], locs: [["Funafuti", -8.5200, 179.1980, "capital"]] },
  { name: "Uganda", wiki: "Uganda", cap: [0.3476, 32.5825], locs: [["Kampala", 0.3476, 32.5825, "capital"], ["Gulu", 2.7734, 32.2764, "city"]] },
  { name: "Ukraine", wiki: "Ukraine", cap: [50.4501, 30.5234], locs: [["Kyiv", 50.4501, 30.5234, "capital"], ["Kharkiv", 49.9935, 36.2304, "city"], ["Lviv", 49.8397, 24.0297, "city"], ["Odesa", 46.4856, 30.7326, "city"]] },
  { name: "United Arab Emirates", wiki: "United_Arab_Emirates", cap: [24.4539, 54.3773], locs: [["Abu Dhabi", 24.4539, 54.3773, "capital"], ["Dubai", 25.2048, 55.2708, "city"], ["Sharjah", 25.3463, 55.4209, "city"]] },
  { name: "United Kingdom", wiki: "United_Kingdom", cap: [51.5074, -0.1278], locs: [["London", 51.5074, -0.1278, "capital"], ["Manchester", 53.4808, -2.2426, "city"], ["Birmingham", 52.5086, -1.8783, "city"], ["Leeds", 53.8008, -1.5491, "city"]] },
  { name: "United States", wiki: "United_States", cap: [38.9072, -77.0369], locs: [["Washington, D.C.", 38.9072, -77.0369, "capital"], ["New York City", 40.7128, -74.0060, "city"], ["Los Angeles", 34.0522, -118.2437, "city"], ["Chicago", 41.8781, -87.6298, "city"], ["Houston", 29.7604, -95.3698, "city"]] },
  { name: "Uruguay", wiki: "Uruguay", cap: [-34.9011, -56.1915], locs: [["Montevideo", -34.9011, -56.1915, "capital"], ["Salto", -31.3873, -57.9683, "city"]] },
  { name: "Uzbekistan", wiki: "Uzbekistan", cap: [41.2995, 69.2401], locs: [["Tashkent", 41.2995, 69.2401, "capital"], ["Samarkand", 39.6547, 66.9758, "city"], ["Bukhara", 39.7681, 64.4272, "unicode"]] },
  { name: "Vanuatu", wiki: "Vanuatu", cap: [-17.7333, 168.3167], locs: [["Port Vila", -17.7333, 168.3167, "capital"]] },
  { name: "Venezuela", wiki: "Venezuela", cap: [10.4806, -66.9036], locs: [["Caracas", 10.4806, -66.9036, "capital"], ["Maracaibo", 10.6666, -71.6124, "city"], ["Valencia", 10.1620, -67.9999, "city"]] },
  { name: "Vietnam", wiki: "Vietnam", cap: [21.0285, 105.8542], locs: [["Hanoi", 21.0285, 105.8542, "capital"], ["Ho Chi Minh City", 10.8231, 106.6297, "former"], ["Hai Phong", 20.8449, 106.6836, "city"], ["Hội An", 15.8794, 108.3350, "unicode"]] },
  { name: "Yemen", wiki: "Yemen", cap: [15.3527, 48.5164], locs: [["Sana'a", 15.3694, 44.1910, "capital"], ["Aden", 12.7797, 45.0367, "former"], ["Taiz", 13.5800, 44.0077, "city"]] },
  { name: "Zambia", wiki: "Zambia", cap: [-15.3875, 28.3228], locs: [["Lusaka", -15.3875, 28.3228, "capital"], ["Kitwe", -12.8183, 28.2559, "city"]] },
  { name: "Zimbabwe", wiki: "Zimbabwe", cap: [-17.8252, 31.0335], locs: [["Harare", -17.8252, 31.0335, "capital"], ["Bulawayo", -20.1325, 28.6264, "city"]] },
];

const toRad = d => (d * Math.PI) / 180;
function haversine(lat1, lon1, lat2, lon2) {
  const R = 6371;
  const dLat = toRad(lat2 - lat1);
  const dLon = toRad(lon2 - lon1);
  const a = Math.sin(dLat/2)**2 + Math.cos(toRad(lat1))*Math.cos(toRad(lat2))*Math.sin(dLon/2)**2;
  return R * 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1-a));
}

function bearing(lat1, lon1, lat2, lon2) {
  const dLon = toRad(lon2 - lon1);
  const y = Math.sin(dLon)*Math.cos(toRad(lat2));
  const x = Math.cos(toRad(lat1))*Math.sin(toRad(lat2)) - Math.sin(toRad(lat1))*Math.cos(toRad(lat2))*Math.cos(dLon);
  let b = (Math.atan2(y, x) * 180 / Math.PI + 360) % 360;
  const dirs = ["N","NE","E","SE","S","SW","W","NW"];
  return dirs[Math.round(b / 45) % 8];
}

function getPuzzleForDate(dateStr) {
  const hash = Array.from(dateStr).reduce((h, c) => ((h << 5) - h) + c.charCodeAt(0), 0);
  return Math.abs(hash) % COUNTRIES.length;
}

function getDailyPuzzle() {
  const now = new Date();
  const utcDateStr = `${now.getUTCFullYear()}-${String(now.getUTCMonth() + 1).padStart(2, '0')}-${String(now.getUTCDate()).padStart(2, '0')}`;
  const countryIdx = getPuzzleForDate(utcDateStr);
  const country = COUNTRIES[countryIdx];
  const locIdx = getPuzzleForDate(utcDateStr + "loc") % country.locs.length;
  const loc = country.locs[locIdx];
  return { country, loc, dateStr: utcDateStr };
}

function useWikiImages(locationName) {
  const [images, setImages] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    let cancelled = false;
    setLoading(true);
    setImages([]);

    async function fetchImages() {
      try {
        const searchUrl = `https://en.wikipedia.org/w/api.php?action=query&list=search&srsearch=${encodeURIComponent(locationName)}&srlimit=1&format=json&origin=*`;
        const searchRes = await fetch(searchUrl);
        const searchData = await searchRes.json();
        const results = searchData?.query?.search;
        if (!results?.length) { if (!cancelled) setLoading(false); return; }

        const title = results[0].title;
        const imagesUrl = `https://en.wikipedia.org/w/api.php?action=query&titles=${encodeURIComponent(title)}&prop=images&format=json&origin=*`;
        const imagesRes = await fetch(imagesUrl);
        const imagesData = await imagesRes.json();
        const pages = imagesData?.query?.pages;
        const page = pages ? Object.values(pages)[0] : null;
        const images_list = page?.images || [];

        const imageUrls = [];
        for (const img of images_list.slice(0, 10)) {
          const imgTitle = img.title;
          if (!/\.svg$/i.test(imgTitle)) {
            const imgInfoUrl = `https://en.wikipedia.org/w/api.php?action=query&titles=${encodeURIComponent(imgTitle)}&prop=imageinfo&iiprop=url&format=json&origin=*`;
            const imgInfoRes = await fetch(imgInfoUrl);
            const imgInfoData = await imgInfoRes.json();
            const imgPages = imgInfoData?.query?.pages;
            const imgPage = imgPages ? Object.values(imgPages)[0] : null;
            const url = imgPage?.imageinfo?.[0]?.url;
            if (url && imageUrls.length < 3) imageUrls.push(url);
            if (imageUrls.length === 3) break;
          }
        }

        if (!cancelled) { setImages(imageUrls); setLoading(false); }
      } catch (e) {
        if (!cancelled) { setLoading(false); }
      }
    }

    fetchImages();
    return () => { cancelled = true; };
  }, [locationName]);

  return { images, loading };
}

function ImageCarousel({ images, loading }) {
  const [currentIndex, setCurrentIndex] = useState(0);

  if (loading) {
    return (
      <div style={{
        width: "100%", height: 220, background: "#111118",
        display: "flex", alignItems: "center", justifyContent: "center",
        flexDirection: "column", gap: 8
      }}>
        <div style={{
          width: 28, height: 28, borderRadius: "50%",
          border: "3px solid #333", borderTopColor: "#6366f1",
          animation: "spin 0.8s linear infinite"
        }} />
        <span style={{ color: "#444", fontSize: 13 }}>Loading photos…</span>
      </div>
    );
  }

  if (!images.length) {
    return (
      <div style={{
        width: "100%", height: 220, background: "#111118",
        display: "flex", alignItems: "center", justifyContent: "center", fontSize: 48
      }}>
        🌍
      </div>
    );
  }

  return (
    <div
      style={{
        width: "100%", height: 220, background: "#111118",
        position: "relative", overflow: "hidden", display: "flex",
        alignItems: "center", justifyContent: "center"
      }}
      onTouchStart={(e) => {
        const startX = e.touches[0].clientX;
        const handleTouchEnd = (e2) => {
          const endX = e2.changedTouches[0].clientX;
          if (startX - endX > 50) setCurrentIndex((i) => (i + 1) % images.length);
          else if (endX - startX > 50) setCurrentIndex((i) => (i - 1 + images.length) % images.length);
          document.removeEventListener("touchend", handleTouchEnd);
        };
        document.addEventListener("touchend", handleTouchEnd);
      }}
    >
      <img
        src={images[currentIndex]}
        alt={`Photo ${currentIndex + 1}`}
        style={{ width: "100%", height: "100%", objectFit: "cover", display: "block" }}
      />
      <div style={{
        position: "absolute", bottom: 8, left: "50%", transform: "translateX(-50%)",
        display: "flex", gap: 6
      }}>
        {images.map((_, i) => (
          <div
            key={i}
            style={{
              width: 6, height: 6, borderRadius: "50%",
              background: i === currentIndex ? "#fff" : "rgba(255,255,255,0.4)"
            }}
          />
        ))}
      </div>
      <div style={{
        position: "absolute", bottom: 0, left: 0, right: 0, height: 40,
        background: "linear-gradient(transparent, #1e1e2e)"
      }} />
    </div>
  );
}

function SearchDropdown({ value, onChange, disabled, placeholder }) {
  const [open, setOpen] = useState(false);
  const [query, setQuery] = useState("");
  const ref = useRef(null);
  const countryNames = useMemo(() => COUNTRIES.map(c => c.name).sort(), []);
  const filtered = useMemo(() =>
    query.length === 0 ? countryNames : countryNames.filter(n => n.toLowerCase().includes(query.toLowerCase())),
    [query, countryNames]
  );

  useEffect(() => {
    function handler(e) { if (ref.current && !ref.current.contains(e.target)) setOpen(false); }
    document.addEventListener("mousedown", handler);
    return () => document.removeEventListener("mousedown", handler);
  }, []);

  const select = (name) => { onChange(name); setQuery(""); setOpen(false); };

  return (
    <div ref={ref} style={{ position: "relative", flex: 1 }}>
      <div
        onClick={() => { if (!disabled) { setOpen(o => !o); setQuery(""); } }}
        style={{
          padding: "10px 14px", borderRadius: 8, border: `1px solid ${disabled ? "#333" : "#555"}`,
          background: disabled ? "#1a1a1a" : "#1e1e2e", color: value ? "#f8f8f2" : "#6b7280",
          cursor: disabled ? "not-allowed" : "pointer", display: "flex", justifyContent: "space-between",
          alignItems: "center", fontSize: 14, userSelect: "none", minWidth: 0,
        }}
      >
        <span style={{ overflow: "hidden", textOverflow: "ellipsis", whiteSpace: "nowrap" }}>
          {value || placeholder}
        </span>
        <span style={{ marginLeft: 8, opacity: 0.5 }}>{open ? "▲" : "▼"}</span>
      </div>
      {open && (
        <div style={{
          position: "absolute", top: "calc(100% + 4px)", left: 0, right: 0, zIndex: 999,
          background: "#1e1e2e", border: "1px solid #555", borderRadius: 8,
          maxHeight: 220, overflow: "hidden", display: "flex", flexDirection: "column",
          boxShadow: "0 8px 24px rgba(0,0,0,0.6)"
        }}>
          <input
            autoFocus
            value={query}
            onChange={e => setQuery(e.target.value)}
            placeholder="Search country…"
            style={{
              padding: "8px 12px", background: "#2a2a3e", border: "none", borderBottom: "1px solid #444",
              color: "#f8f8f2", fontSize: "16px", outline: "none"
            }}
          />
          <div style={{ overflowY: "auto", flex: 1 }}>
            {filtered.length === 0 && (
              <div style={{ padding: "10px 14px", color: "#666", fontSize: 13 }}>No results</div>
            )}
            {filtered.map(n => (
              <div
                key={n}
                onClick={() => select(n)}
                style={{
                  padding: "8px 14px", cursor: "pointer", fontSize: 13, color: "#f8f8f2",
                  background: n === value ? "#2a2a5e" : "transparent",
                  borderBottom: "1px solid #2a2a2a"
                }}
                onMouseEnter={e => e.currentTarget.style.background = "#2a2a4e"}
                onMouseLeave={e => e.currentTarget.style.background = n === value ? "#2a2a5e" : "transparent"}
              >
                {n}
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
}

export default function WITWorld() {
  const [puzzle, setPuzzle] = useState(() => {
    try {
      const now = new Date();
      const today = `${now.getUTCFullYear()}-${String(now.getUTCMonth() + 1).padStart(2, '0')}-${String(now.getUTCDate()).padStart(2, '0')}`;
      const stored = localStorage.getItem("witworld_puzzle_date");
      if (stored === today) {
        const p = localStorage.getItem("witworld_puzzle");
        if (p) return JSON.parse(p);
      }
      const newPuzzle = getDailyPuzzle();
      localStorage.setItem("witworld_puzzle_date", today);
      localStorage.setItem("witworld_puzzle", JSON.stringify(newPuzzle));
      return newPuzzle;
    } catch {
      return getDailyPuzzle();
    }
  });
  const [guesses, setGuesses] = useState(Array(6).fill(""));
  const [submitted, setSubmitted] = useState(Array(6).fill(false));
  const [currentRow, setCurrentRow] = useState(0);
  const [won, setWon] = useState(false);
  const [lost, setLost] = useState(false);
  const [copied, setCopied] = useState(false);
  const { country, loc } = puzzle;
  const { images, loading: imgLoading } = useWikiImages(loc[0]);

  function handleGuess(idx) {
    const guess = guesses[idx];
    if (!guess || submitted[idx]) return;
    const newSub = [...submitted];
    newSub[idx] = true;
    setSubmitted(newSub);
    if (guess === country.name) {
      setWon(true);
    } else if (idx === 5) {
      setLost(true);
    } else {
      setCurrentRow(idx + 1);
    }
  }

  function getHint(idx) {
    if (!submitted[idx] || guesses[idx] === country.name) return null;
    const gc = COUNTRIES.find(c => c.name === guesses[idx]);
    if (!gc) return null;
    const dist = Math.round(haversine(loc[1], loc[2], gc.cap[0], gc.cap[1]));
    const dir = bearing(gc.cap[0], gc.cap[1], loc[1], loc[2]);
    return { dist, dir };
  }

  function shareResults() {
    const guessCount = submitted.findIndex(s => !s);
    const finalCount = guessCount === -1 ? 6 : guessCount + 1;
    const text = `Where In The World? ${finalCount}/6 🎯\nPlay: https://witworld.vercel.app`;
    navigator.clipboard.writeText(text).then(() => {
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    }).catch(() => alert(text));
  }

  const TYPE_LABELS = { capital: "🏛️ Capital", former: "🕰️ Former", city: "🌆 City", unicode: "🏛️ UNESCO" };
  const TYPE_COLORS = { capital: "#4ade80", former: "#fb923c", city: "#60a5fa", unicode: "#e879f9" };

  const typeColor = TYPE_COLORS[loc[3]];
  const typeLabel = TYPE_LABELS[loc[3]];

  return (
    <div style={{
      minHeight: "100vh", background: "#0f0f17", color: "#f8f8f2",
      fontFamily: "'Segoe UI', system-ui, sans-serif", display: "flex",
      flexDirection: "column", alignItems: "center", padding: "24px 16px 48px"
    }}>
      <style>{`@keyframes spin { to { transform: rotate(360deg); } }`}</style>

      <div style={{ textAlign: "center", marginBottom: 28 }}>
        <h1 style={{ margin: 0, fontSize: 36, fontWeight: 900, letterSpacing: -1, color: "#f8f8f2", marginBottom: 4 }}>
          Where In The World?
        </h1>
        <p style={{ margin: 0, color: "#666", fontSize: 13 }}>
          Guess the country
        </p>
      </div>

      <div style={{
        background: "linear-gradient(135deg, #1e1e2e, #16162a)",
        border: `1px solid ${typeColor}44`, borderRadius: 16,
        overflow: "hidden", marginBottom: 28, width: "100%", maxWidth: 520,
        boxShadow: `0 0 32px ${typeColor}22`
      }}>
        <ImageCarousel images={images} loading={imgLoading} />
        <div style={{ padding: "16px 24px 20px" }}>
          <div style={{ display: "flex", alignItems: "center", gap: 10, marginBottom: 10 }}>
            <span style={{
              background: `${typeColor}22`, color: typeColor, borderRadius: 6,
              padding: "3px 10px", fontSize: 12, fontWeight: 700, letterSpacing: 0.5
            }}>
              {typeLabel}
            </span>
          </div>
          <div style={{ fontSize: 28, fontWeight: 800, letterSpacing: -0.5, color: "#f8f8f2" }}>
            {loc[0]}
          </div>
          <div style={{ marginTop: 8, fontSize: 12, color: "#888" }}>
            Which country is this in?
          </div>
        </div>
      </div>

      <div style={{ width: "100%", maxWidth: 520, display: "flex", flexDirection: "column", gap: 10 }}>
        {Array.from({ length: 6 }, (_, i) => {
          const hint = getHint(i);
          const isActive = i === currentRow && !won && !lost;
          const isCorrect = submitted[i] && guesses[i] === country.name;
          const isWrong = submitted[i] && guesses[i] !== country.name;

          return (
            <div key={i} style={{ display: "flex", gap: 8, alignItems: "center", opacity: i > currentRow && !won && !lost ? 0.35 : 1 }}>
              <div style={{
                width: 24, height: 24, borderRadius: "50%", flexShrink: 0,
                background: isCorrect ? "#4ade80" : isWrong ? "#f87171" : isActive ? "#6366f1" : "#2a2a3e",
                display: "flex", alignItems: "center", justifyContent: "center",
                fontSize: 11, fontWeight: 700, color: "#fff"
              }}>
                {i + 1}
              </div>

              <SearchDropdown
                value={guesses[i]}
                onChange={v => { const g = [...guesses]; g[i] = v; setGuesses(g); }}
                disabled={!isActive}
                placeholder={isActive ? "Select…" : submitted[i] ? guesses[i] || "—" : "—"}
              />

              {isActive && (
                <button
                  onClick={() => handleGuess(i)}
                  disabled={!guesses[i]}
                  style={{
                    padding: "10px 16px", borderRadius: 8, border: "none",
                    background: guesses[i] ? "#6366f1" : "#2a2a3e",
                    color: "#fff", fontWeight: 700, fontSize: 13,
                    cursor: guesses[i] ? "pointer" : "not-allowed", flexShrink: 0,
                  }}
                >
                  Guess
                </button>
              )}

              {hint && (
                <div style={{
                  display: "flex", alignItems: "center", gap: 5, flexShrink: 0,
                  background: "#1e1e2e", border: "1px solid #333", borderRadius: 8,
                  padding: "6px 10px", fontSize: 12, color: "#fb923c", minWidth: 0
                }}>
                  <span>
                    {hint.dir === "N" ? "⬆️" : hint.dir === "S" ? "⬇️" : hint.dir === "E" ? "➡️" : hint.dir === "W" ? "⬅️" :
                     hint.dir === "NE" ? "↗️" : hint.dir === "NW" ? "↖️" : hint.dir === "SE" ? "↘️" : "↙️"}
                  </span>
                  <span style={{ fontWeight: 700, whiteSpace: "nowrap" }}>{hint.dist}km</span>
                </div>
              )}

              {isCorrect && (
                <div style={{
                  flexShrink: 0, background: "#4ade8022", border: "1px solid #4ade80",
                  borderRadius: 8, padding: "6px 10px", fontSize: 12, color: "#4ade80", fontWeight: 700
                }}>✓</div>
              )}
            </div>
          );
        })}
      </div>

      {(won || lost) && (
        <div style={{
          marginTop: 28, width: "100%", maxWidth: 520,
          background: won ? "linear-gradient(135deg,#052e16,#14532d)" : "linear-gradient(135deg,#1c0a0a,#450a0a)",
          border: `1px solid ${won ? "#4ade80" : "#f87171"}`,
          borderRadius: 16, padding: "20px 24px", textAlign: "center"
        }}>
          <div style={{ fontSize: 28, marginBottom: 6 }}>{won ? "🎉" : "💡"}</div>
          <div style={{ fontWeight: 800, fontSize: 20, color: won ? "#4ade80" : "#f87171", marginBottom: 4 }}>
            {won ? "Brilliant!" : "Better luck next time!"}
          </div>
          {lost && (
            <div style={{ color: "#aaa", marginBottom: 4, fontSize: 14 }}>
              The answer was <strong style={{ color: "#f8f8f2" }}>{country.name}</strong>
            </div>
          )}
          <div style={{ color: "#aaa", fontSize: 13, marginBottom: 16 }}>
            {loc[0]} is in <strong style={{ color: "#f8f8f2" }}>{country.name}</strong>
          </div>
          <div style={{ display: "flex", gap: 10, justifyContent: "center", flexWrap: "wrap" }}>
            <a
              href={`https://simple.wikipedia.org/wiki/${loc[0].replace(/\s+/g, '_')}`}
              target="_blank" rel="noopener noreferrer"
              style={{
                padding: "10px 18px", borderRadius: 8,
                background: "#1d4ed8", color: "#fff", textDecoration: "none",
                fontWeight: 700, fontSize: 13
              }}
            >
              📖 Learn about {loc[0]}
            </a>
            <button
              onClick={() => shareResults()}
              style={{
                padding: "10px 18px", borderRadius: 8,
                background: copied ? "#059669" : "#10b981", color: "#fff", border: "none",
                fontWeight: 700, fontSize: 13, cursor: "pointer"
              }}
            >
              {copied ? "✓ Copied!" : "📤 Share"}
            </button>
          </div>
        </div>
      )}

      {(won || lost) && (
        <div style={{
          marginTop: 16, textAlign: "center", color: "#666", fontSize: 13
        }}>
          Come back tomorrow. New game every day.
        </div>
      )}
    </div>
  );
}
