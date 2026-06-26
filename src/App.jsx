import { useState, useMemo, useRef, useEffect } from "react";

// ─── COUNTRIES DATA ──────────────────────────────────────────────────────────────
// 4 types only: capital, former, city, unicode
const COUNTRIES = [
  { name: "Afghanistan", wiki: "Afghanistan", cap: [34.5281, 69.1723], locs: [["Kabul", 34.5281, 69.1723, "capital", ["Band-e Amir National Park", 34.8167, 67.0167, "nature"]], ["Kandahar", 31.6133, 65.7073, "former"], ["Mazar-i-Sharif", 36.7069, 67.1124, "city"], ["Herat", 34.3482, 62.2041, "city"]] },
  { name: "Albania", wiki: "Albania", cap: [41.3317, 19.8319], locs: [["Tirana", 41.3317, 19.8319, "capital", ["Valbona Valley National Park", 41.8767, 20.1867, "nature"]], ["Durrës", 41.3246, 19.4565, "former"], ["Gjirokastër", 40.0758, 20.1389, "unicode"], ["Berat", 40.7058, 19.9522, "unicode"], ["Shkodër", 42.0683, 19.5126, "city"]] },
  { name: "Algeria", wiki: "Algeria", cap: [36.7372, 3.0865], locs: [["Algiers", 36.7372, 3.0865, "capital", ["Tassili n'Ajjer", 24.8, 9.5, "nature"]], ["Oran", 35.6969, -0.6331, "city"], ["Constantine", 36.3650, 6.6147, "city"], ["Timgad", 35.4869, 6.4680, "unicode"], ["Tipasa", 36.5900, 2.4478, "unicode"]] },
  { name: "Andorra", wiki: "Andorra", cap: [42.5063, 1.5218], locs: [["Andorra la Vella", 42.5063, 1.5218, "capital"], ["Escaldes-Engordany", 42.5063, 1.5395, "city"]] },
  { name: "Angola", wiki: "Angola", cap: [-8.8390, 13.2894], locs: [["Luanda", -8.8390, 13.2894, "capital", ["Iona National Park", -17.05, 12.27, "nature"]], ["Lubango", -14.9177, 13.4920, "city"], ["Huambo", -12.7758, 15.7392, "city"], ["Lobito", -12.3647, 13.5459, "city"]] },
  { name: "Antigua and Barbuda", wiki: "Antigua_and_Barbuda", cap: [17.1274, -61.8468], locs: [["Saint John's", 17.1274, -61.8468, "capital"]] },
  { name: "Argentina", wiki: "Argentina", cap: [-34.6037, -58.3816], locs: [["Buenos Aires", -34.6037, -58.3816, "capital", ["Los Glaciares National Park", -49.8, -73.0, "nature"]], ["Córdoba", -31.4201, -64.1888, "city"], ["Rosario", -32.9442, -60.6505, "city"], ["Mendoza", -32.8895, -68.8458, "city"], ["La Plata", -34.9215, -57.9545, "city"]] },
  { name: "Armenia", wiki: "Armenia", cap: [40.1872, 44.5152], locs: [["Yerevan", 40.1872, 44.5152, "capital", ["Khosrov Forest State Reserve", 39.75, 44.5, "nature"]], ["Gyumri", 40.7942, 43.8453, "city"], ["Vanadzor", 40.8128, 44.4879, "city"]] },
  { name: "Australia", wiki: "Australia", cap: [-35.2835, 149.1281], locs: [["Canberra", -35.2835, 149.1281, "capital", ["Great Barrier Reef Marine Park", -18.2871, 147.6992, "nature"]], ["Sydney", -33.8688, 151.2093, "city"], ["Melbourne", -37.8136, 144.9631, "city"], ["Brisbane", -27.4698, 153.0251, "city"], ["Perth", -31.9505, 115.8605, "city"]] },
  { name: "Austria", wiki: "Austria", cap: [48.2082, 16.3738], locs: [["Vienna", 48.2082, 16.3738, "capital", ["Hohe Tauern National Park", 47.5, 12.5, "nature"]], ["Graz", 47.0707, 15.4395, "city"], ["Innsbruck", 47.2692, 11.4041, "city"], ["Salzburg", 47.8095, 13.0550, "unicode"]] },
  { name: "Azerbaijan", wiki: "Azerbaijan", cap: [40.4093, 49.8671], locs: [["Baku", 40.4093, 49.8671, "capital", ["Gobustan National Park", 40.35, 49.5, "nature"]], ["Ganja", 40.6828, 46.3606, "city"], ["Walled City of Baku", 40.3667, 49.8333, "unicode"]] },
  { name: "Bahamas", wiki: "The_Bahamas", cap: [25.0480, -77.3554], locs: [["Nassau", 25.0480, -77.3554, "capital", ["Exuma Cays Land and Sea Park", 24.5, -76.3, "nature"]]] },
  { name: "Bahrain", wiki: "Bahrain", cap: [26.2154, 50.5832], locs: [["Manama", 26.2154, 50.5832, "capital"], ["Qal'at al-Bahrain", 26.2333, 50.5167, "unicode"]] },
  { name: "Bangladesh", wiki: "Bangladesh", cap: [23.8103, 90.4125], locs: [["Dhaka", 23.8103, 90.4125, "capital", ["Sundarbans National Park", 21.9, 89.2, "nature"]], ["Chittagong", 22.3569, 91.7832, "city"], ["Sylhet", 24.8949, 91.8687, "city"], ["Rajshahi", 24.3745, 88.6042, "city"]] },
  { name: "Barbados", wiki: "Barbados", cap: [13.0969, -59.6145], locs: [["Bridgetown", 13.0969, -59.6145, "capital"]] },
  { name: "Belarus", wiki: "Belarus", cap: [53.9006, 27.5590], locs: [["Minsk", 53.9006, 27.5590, "capital", ["Belovezhskaya Pushcha", 52.45, 23.85, "nature"]], ["Brest", 52.0976, 23.7341, "city"], ["Grodno", 53.6884, 23.8258, "city"], ["Mir Castle Complex", 53.4519, 26.4728, "unicode"]] },
  { name: "Belgium", wiki: "Belgium", cap: [50.8503, 4.3517], locs: [["Brussels", 50.8503, 4.3517, "capital", ["High Fens-Eifel", 50.5, 6.0, "nature"]], ["Ghent", 51.0543, 3.7174, "city"], ["Antwerp", 51.2194, 4.4025, "city"], ["Bruges", 51.2093, 3.2247, "unicode"]] },
  { name: "Benin", wiki: "Benin", cap: [6.3676, 2.4252], locs: [["Porto-Novo", 6.3676, 2.4252, "capital", ["W National Park", 11.5, 2.3, "nature"]], ["Cotonou", 6.3654, 2.4183, "city"], ["Abomey", 7.1841, 1.9888, "unicode"]] },
  { name: "Bhutan", wiki: "Bhutan", cap: [27.4728, 89.6390], locs: [["Thimphu", 27.4728, 89.6390, "capital", ["Jigme Dorji National Park", 27.9, 89.5, "nature"]], ["Paro", 27.4287, 89.4164, "city"], ["Punakha", 27.5906, 89.8678, "former"]] },
  { name: "Bolivia", wiki: "Bolivia", cap: [-16.5000, -68.1501], locs: [["La Paz", -16.5000, -68.1501, "capital", ["Madidi National Park", -14.2, -67.5, "nature"]], ["Sucre", -19.0478, -65.2592, "former"], ["Santa Cruz", -17.8146, -63.1561, "city"], ["Cochabamba", -17.3895, -66.1577, "city"]] },
  { name: "Bosnia and Herzegovina", wiki: "Bosnia_and_Herzegovina", cap: [43.8486, 18.3564], locs: [["Sarajevo", 43.8486, 18.3564, "capital", ["Sutjeska National Park", 43.6, 19.1, "nature"]], ["Mostar", 43.3438, 17.8078, "unicode"], ["Banja Luka", 44.7722, 17.1910, "city"]] },
  { name: "Botswana", wiki: "Botswana", cap: [-24.6282, 25.9231], locs: [["Gaborone", -24.6282, 25.9231, "capital", ["Okavango Delta", -19.2825, 22.8575, "nature"]], ["Francistown", -21.1658, 27.5103, "city"]] },
  { name: "Brazil", wiki: "Brazil", cap: [-15.7795, -47.9297], locs: [["Brasília", -15.7795, -47.9297, "capital", ["Amazon Rainforest", -3.0, -60.0, "nature"]], ["Rio de Janeiro", -22.9068, -43.1729, "former"], ["São Paulo", -23.5558, -46.6396, "city"], ["Salvador", -12.9714, -38.5014, "city"], ["Belo Horizonte", -19.9167, -43.9345, "city"]] },
  { name: "Brunei", wiki: "Brunei", cap: [4.9031, 114.9398], locs: [["Bandar Seri Begawan", 4.9031, 114.9398, "capital", ["Temburong National Park", 4.55, 115.15, "nature"]]] },
  { name: "Bulgaria", wiki: "Bulgaria", cap: [42.6977, 23.3219], locs: [["Sofia", 42.6977, 23.3219, "capital", ["Rila National Park", 42.2, 23.6, "nature"]], ["Plovdiv", 42.1354, 24.7453, "former"], ["Varna", 43.2141, 27.9147, "city"], ["Burgas", 42.5047, 27.4632, "city"]] },
  { name: "Burkina Faso", wiki: "Burkina_Faso", cap: [12.3714, -1.5197], locs: [["Ouagadougou", 12.3714, -1.5197, "capital", ["W National Park", 11.5, 2.3, "nature"]], ["Bobo-Dioulasso", 11.1771, -4.2979, "city"]] },
  { name: "Burundi", wiki: "Burundi", cap: [-3.4271, 29.9249], locs: [["Gitega", -3.4271, 29.9249, "capital", ["Rusizi National Park", -2.5, 29.25, "nature"]], ["Bujumbura", -3.3818, 29.3622, "former"]] },
  { name: "Cabo Verde", wiki: "Cape_Verde", cap: [14.9330, -23.5133], locs: [["Praia", 14.9330, -23.5133, "capital", ["Fogo National Park", 15.35, -24.35, "nature"]], ["Cidade Velha", 14.9167, -23.6000, "unicode"]] },
  { name: "Cambodia", wiki: "Cambodia", cap: [11.5625, 104.9160], locs: [["Phnom Penh", 11.5625, 104.9160, "capital", ["Angkor National Park", 13.4125, 103.867, "nature"]], ["Siem Reap", 13.3671, 103.8448, "city"], ["Battambang", 13.0957, 103.2022, "city"], ["Angkor", 13.4125, 103.8670, "unicode"]] },
  { name: "Cameroon", wiki: "Cameroon", cap: [3.8667, 11.5167], locs: [["Yaoundé", 3.8667, 11.5167, "capital", ["Mount Cameroon", 4.2, 9.17, "nature"]], ["Douala", 4.0511, 9.7679, "city"]] },
  { name: "Canada", wiki: "Canada", cap: [45.4215, -75.6972], locs: [["Ottawa", 45.4215, -75.6972, "capital", ["Banff National Park", 51.5, -115.5, "nature"]], ["Toronto", 43.6532, -79.3832, "city"], ["Montreal", 45.5017, -73.5673, "city"], ["Vancouver", 49.2827, -123.1207, "city"], ["Calgary", 51.0447, -114.0719, "city"]] },
  { name: "Central African Republic", wiki: "Central_African_Republic", cap: [4.3612, 18.5550], locs: [["Bangui", 4.3612, 18.5550, "capital", ["Dzanga-Sangha", 2.25, 16.3, "nature"]]] },
  { name: "Chad", wiki: "Chad", cap: [12.1048, 15.0444], locs: [["N'Djamena", 12.1048, 15.0444, "capital", ["Zakouma National Park", 10.62, 19.8, "nature"]], ["Moundou", 8.5667, 16.0833, "city"]] },
  { name: "Chile", wiki: "Chile", cap: [-33.4489, -70.6693], locs: [["Santiago", -33.4489, -70.6693, "capital", ["Torres del Paine", -51.0, -72.5, "nature"]], ["Valparaíso", -33.0472, -71.6127, "city"], ["Concepción", -36.8201, -73.0444, "city"], ["Valdivia", -39.8142, -73.2456, "city"]] },
  { name: "China", wiki: "China", cap: [39.9042, 116.4074], locs: [["Beijing", 39.9042, 116.4074, "capital", ["Zhangjiajie National Forest Park", 29.3, 110.5, "nature"]], ["Shanghai", 31.2304, 121.4737, "city"], ["Guangzhou", 23.1291, 113.2644, "city"], ["Shenzhen", 22.5431, 114.0579, "city"], ["Chongqing", 29.4316, 106.9123, "city"]] },
  { name: "Colombia", wiki: "Colombia", cap: [4.7110, -74.0721], locs: [["Bogotá", 4.7110, -74.0721, "capital", ["Tayrona National Park", 11.3, -74.6, "nature"]], ["Medellín", 6.2442, -75.5812, "city"], ["Cali", 3.4516, -76.5320, "city"], ["Cartagena", 10.3910, -75.4794, "unicode"], ["Barranquilla", 10.9639, -74.7964, "city"]] },
  { name: "Comoros", wiki: "Comoros", cap: [-11.7022, 43.2551], locs: [["Moroni", -11.7022, 43.2551, "capital"]] },
  { name: "Congo (DRC)", wiki: "Democratic_Republic_of_the_Congo", cap: [-4.3276, 15.3136], locs: [["Kinshasa", -4.3276, 15.3136, "capital", ["Virunga National Park", -1.5, 29.2, "nature"]], ["Lubumbashi", -11.6600, 27.4794, "city"]] },
  { name: "Congo (Republic)", wiki: "Republic_of_the_Congo", cap: [-4.2661, 15.2832], locs: [["Brazzaville", -4.2661, 15.2832, "capital", ["Odzala-Kokoua National Park", 1.0, 16.2, "nature"]], ["Pointe-Noire", -4.7692, 11.8664, "city"]] },
  { name: "Costa Rica", wiki: "Costa_Rica", cap: [9.9281, -84.0907], locs: [["San José", 9.9281, -84.0907, "capital", ["Manuel Antonio National Park", 9.4, -84.4, "nature"]]] },
  { name: "Côte d'Ivoire", wiki: "Ivory_Coast", cap: [6.8276, -5.2893], locs: [["Yamoussoukro", 6.8276, -5.2893, "capital", ["Taï National Park", 5.5, -7.3, "nature"]], ["Abidjan", 5.3600, -4.0083, "former"]] },
  { name: "Croatia", wiki: "Croatia", cap: [45.8150, 15.9819], locs: [["Zagreb", 45.8150, 15.9819, "capital", ["Plitvice Lakes National Park", 46.75, 15.6, "nature"]], ["Split", 43.5081, 16.4402, "city"], ["Rijeka", 45.3271, 14.4422, "city"], ["Dubrovnik", 42.6507, 18.0944, "unicode"], ["Trogir", 43.5158, 16.2511, "unicode"]] },
  { name: "Cuba", wiki: "Cuba", cap: [23.1136, -82.3666], locs: [["Havana", 23.1136, -82.3666, "capital", ["Viñales Valley", 22.6, -83.7, "nature"]], ["Santiago de Cuba", 20.0243, -75.8219, "city"], ["Camagüey", 21.3803, -77.9169, "city"], ["Trinidad", 21.8028, -79.9841, "unicode"]] },
  { name: "Cyprus", wiki: "Cyprus", cap: [35.1856, 33.3823], locs: [["Nicosia", 35.1856, 33.3823, "capital", ["Troodos Mountains", 34.95, 33.05, "nature"]], ["Limassol", 34.6786, 33.0413, "city"], ["Larnaca", 34.9127, 33.6333, "city"]] },
  { name: "Czech Republic", wiki: "Czech_Republic", cap: [50.0755, 14.4378], locs: [["Prague", 50.0755, 14.4378, "capital", ["Bohemian Switzerland", 50.85, 14.35, "nature"]], ["Brno", 49.1951, 16.6068, "city"], ["Ostrava", 49.8209, 18.2625, "city"], ["Český Krumlov", 48.8127, 14.3175, "unicode"]] },
  { name: "Denmark", wiki: "Denmark", cap: [55.6761, 12.5683], locs: [["Copenhagen", 55.6761, 12.5683, "capital", ["Møn Cliffs", 54.95, 12.45, "nature"]], ["Aarhus", 56.1629, 10.2039, "city"], ["Odense", 55.4038, 10.3875, "city"]] },
  { name: "Dominica", wiki: "Dominica", cap: [15.3017, -61.3881], locs: [["Roseau", 15.3017, -61.3881, "capital", ["Morne Trois Pitons National Park", 15.4, -61.35, "nature"]]] },
  { name: "Dominican Republic", wiki: "Dominican_Republic", cap: [18.4861, -69.9312], locs: [["Santo Domingo", 18.4861, -69.9312, "capital", ["Los Haitises National Park", 19.2, -69.4, "nature"]], ["Santiago de los Caballeros", 19.4517, -70.6970, "city"]] },
  { name: "Ecuador", wiki: "Ecuador", cap: [-0.2298, -78.5249], locs: [["Quito", -0.2298, -78.5249, "capital", ["Galápagos Islands", -0.45, -90.2, "nature"]], ["Guayaquil", -2.1962, -79.8862, "city"], ["Cuenca", -2.9001, -79.0059, "unicode"]] },
  { name: "Egypt", wiki: "Egypt", cap: [30.0444, 31.2357], locs: [["Cairo", 30.0444, 31.2357, "capital", ["White Desert National Park", 27.75, 28.75, "nature"]], ["Alexandria", 31.1975, 29.8925, "city"], ["Giza", 30.0131, 31.1830, "city"], ["Memphis", 29.8442, 31.2527, "former"]] },
  { name: "El Salvador", wiki: "El_Salvador", cap: [13.6929, -89.2182], locs: [["San Salvador", 13.6929, -89.2182, "capital", ["Los Volcanes National Park", 13.8, -89.6, "nature"]], ["Joya de Cerén", 13.7169, -89.5728, "unicode"]] },
  { name: "Equatorial Guinea", wiki: "Equatorial_Guinea", cap: [3.7500, 8.7833], locs: [["Malabo", 3.7500, 8.7833, "capital", ["Monte Alen National Park", 1.95, 10.35, "nature"]], ["Bata", 1.8639, 9.7661, "city"]] },
  { name: "Eritrea", wiki: "Eritrea", cap: [15.3229, 38.9251], locs: [["Asmara", 15.3229, 38.9251, "capital"]] },
  { name: "Estonia", wiki: "Estonia", cap: [59.4370, 24.7536], locs: [["Tallinn", 59.4370, 24.7536, "capital", ["Lahemaa National Park", 59.5, 25.5, "nature"]], ["Tartu", 58.3780, 26.7290, "city"], ["Narva", 59.3778, 28.1945, "city"]] },
  { name: "Eswatini", wiki: "Eswatini", cap: [-26.3054, 31.1367], locs: [["Mbabane", -26.3054, 31.1367, "capital", ["Hluhluwe-iMfolozi Park", -28.05, 32.0, "nature"]], ["Lobamba", -26.4667, 31.2000, "former"]] },
  { name: "Ethiopia", wiki: "Ethiopia", cap: [8.9806, 38.7578], locs: [["Addis Ababa", 8.9806, 38.7578, "capital", ["Simien Mountains National Park", 13.2, 38.3, "nature"]], ["Dire Dawa", 9.5499, 41.8606, "city"], ["Aksum", 14.1310, 38.7256, "unicode"], ["Lalibela", 12.0319, 39.0472, "unicode"]] },
  { name: "Fiji", wiki: "Fiji", cap: [-18.1416, 178.4419], locs: [["Suva", -18.1416, 178.4419, "capital", ["Bouma National Heritage Park", -17.75, 178.1, "nature"]], ["Nadi", -17.7765, 177.4356, "city"]] },
  { name: "Finland", wiki: "Finland", cap: [60.1699, 24.9384], locs: [["Helsinki", 60.1699, 24.9384, "capital", ["Nuuksio National Park", 60.3, 24.9, "nature"]], ["Espoo", 60.2055, 24.6559, "city"], ["Tampere", 61.4978, 23.7610, "city"], ["Turku", 60.4518, 22.2666, "former"]] },
  { name: "France", wiki: "France", cap: [48.8566, 2.3522], locs: [["Paris", 48.8566, 2.3522, "capital", ["Mont Blanc", 45.8325, 6.8652, "nature"]], ["Marseille", 43.2965, 5.3698, "city"], ["Lyon", 45.7640, 4.8357, "city"], ["Toulouse", 43.6047, 1.4442, "city"], ["Nice", 43.7102, 7.2620, "city"]] },
  { name: "Gabon", wiki: "Gabon", cap: [0.3901, 9.4500], locs: [["Libreville", 0.3901, 9.4500, "capital", ["Loango National Park", -2.4, 9.3, "nature"]], ["Port-Gentil", -0.7193, 8.7815, "city"]] },
  { name: "Gambia", wiki: "The_Gambia", cap: [13.4531, -16.5775], locs: [["Banjul", 13.4531, -16.5775, "capital", ["Niokolo-Koba National Park", 13.3, -12.3, "nature"]]] },
  { name: "Georgia", wiki: "Georgia_(country)", cap: [41.6938, 44.8015], locs: [["Tbilisi", 41.6938, 44.8015, "capital", ["Kazbegi National Park", 42.65, 44.6, "nature"]], ["Kutaisi", 42.2679, 42.7057, "former"], ["Batumi", 41.6168, 41.6367, "city"]] },
  { name: "Germany", wiki: "Germany", cap: [52.5200, 13.4050], locs: [["Berlin", 52.5200, 13.4050, "capital", ["Harz National Park", 51.65, 10.45, "nature"]], ["Munich", 48.1351, 11.5820, "city"], ["Hamburg", 53.5753, 10.0153, "city"], ["Cologne", 50.9413, 6.9583, "city"], ["Frankfurt", 50.1109, 8.6821, "city"]] },
  { name: "Ghana", wiki: "Ghana", cap: [5.5600, -0.2057], locs: [["Accra", 5.5600, -0.2057, "capital", ["Kakum National Park", 5.3, -1.05, "nature"]], ["Kumasi", 6.6884, -1.6244, "city"]] },
  { name: "Greece", wiki: "Greece", cap: [37.9838, 23.7275], locs: [["Athens", 37.9838, 23.7275, "capital", ["Mount Olympus National Park", 39.86, 22.35, "nature"]], ["Thessaloniki", 40.6401, 22.9444, "city"], ["Patras", 38.2466, 21.7346, "city"], ["Delphi", 38.4824, 22.5011, "unicode"]] },
  { name: "Grenada", wiki: "Grenada", cap: [12.0561, -61.7488], locs: [["Saint George's", 12.0561, -61.7488, "capital", ["Grand Étang National Park", 12.05, -61.7, "nature"]]] },
  { name: "Guinea", wiki: "Guinea", cap: [9.6412, -13.5784], locs: [["Conakry", 9.6412, -13.5784, "capital", ["Mont Nimba", 7.6, -8.4, "nature"]]] },
  { name: "Guinea-Bissau", wiki: "Guinea-Bissau", cap: [11.8636, -15.5977], locs: [["Bissau", 11.8636, -15.5977, "capital", ["Bijagós Archipelago", 10.5, -15.5, "nature"]]] },
  { name: "Guyana", wiki: "Guyana", cap: [6.8013, -58.1553], locs: [["Georgetown", 6.8013, -58.1553, "capital", ["Kaieteur Falls National Park", 5.19, -59.48, "nature"]]] },
  { name: "Haiti", wiki: "Haiti", cap: [18.5944, -72.3074], locs: [["Port-au-Prince", 18.5944, -72.3074, "capital", ["Pic la Selle", 18.3, -72.2, "nature"]]] },
  { name: "Honduras", wiki: "Honduras", cap: [14.0723, -87.2062], locs: [["Tegucigalpa", 14.0723, -87.2062, "capital", ["Roatán Bay Islands", 16.3, -86.5, "nature"]], ["San Pedro Sula", 15.5000, -88.0333, "city"]] },
  { name: "Hungary", wiki: "Hungary", cap: [47.4979, 19.0402], locs: [["Budapest", 47.4979, 19.0402, "capital", ["Aggtelek National Park", 48.5, 20.5, "nature"]], ["Debrecen", 47.5316, 21.6273, "city"], ["Szeged", 46.2530, 20.1414, "city"]] },
  { name: "Iceland", wiki: "Iceland", cap: [64.1466, -21.9426], locs: [["Reykjavik", 64.1466, -21.9426, "capital", ["Vatnajökull National Park", 64.0, -16.8, "nature"]], ["Akureyri", 65.6885, -18.1262, "city"]] },
  { name: "India", wiki: "India", cap: [28.6139, 77.2090], locs: [["New Delhi", 28.6139, 77.2090, "capital", ["Jim Corbett National Park", 29.5, 79.15, "nature"]], ["Mumbai", 19.0760, 72.8777, "city"], ["Bangalore", 12.9716, 77.5946, "city"], ["Kolkata", 22.5726, 88.3639, "city"], ["Chennai", 13.0827, 80.2707, "city"]] },
  { name: "Indonesia", wiki: "Indonesia", cap: [-1.0000, 117.0000], locs: [["Nusantara", -1.0000, 117.0000, "capital", ["Komodo National Park", -8.5, 119.6, "nature"]], ["Jakarta", -6.2088, 106.8456, "former"], ["Surabaya", -7.2575, 112.7521, "city"], ["Bandung", -6.9147, 107.6098, "city"]] },
  { name: "Iran", wiki: "Iran", cap: [35.6892, 51.3890], locs: [["Tehran", 35.6892, 51.3890, "capital", ["Mount Damavand", 35.96, 51.43, "nature"]], ["Mashhad", 36.2971, 59.6062, "city"], ["Isfahan", 32.6539, 51.6660, "city"], ["Shiraz", 29.5918, 52.5836, "city"]] },
  { name: "Iraq", wiki: "Iraq", cap: [33.3152, 44.3661], locs: [["Baghdad", 33.3152, 44.3661, "capital", ["Mesopotamian Marshes", 30.8, 47.2, "nature"]], ["Basra", 30.5085, 47.7804, "city"], ["Mosul", 36.3350, 43.1189, "city"]] },
  { name: "Ireland", wiki: "Republic_of_Ireland", cap: [53.3498, -6.2603], locs: [["Dublin", 53.3498, -6.2603, "capital", ["Cliffs of Moher", 52.72, -9.93, "nature"]], ["Cork", 51.8985, -8.4756, "city"], ["Galway", 53.2707, -9.0568, "city"]] },
  { name: "Israel", wiki: "Israel", cap: [31.7683, 35.2137], locs: [["Jerusalem", 31.7683, 35.2137, "capital", ["Dead Sea", 31.5, 35.5, "nature"]], ["Tel Aviv", 32.0853, 34.7818, "city"], ["Haifa", 32.8193, 34.9897, "city"]] },
  { name: "Italy", wiki: "Italy", cap: [41.9028, 12.4964], locs: [["Rome", 41.9028, 12.4964, "capital", ["Cinque Terre", 43.13, 12.43, "nature"]], ["Milan", 45.4642, 9.1900, "city"], ["Naples", 40.8522, 14.2681, "city"], ["Florence", 43.7696, 11.2558, "unicode"], ["Venice", 45.4408, 12.3155, "unicode"]] },
  { name: "Jamaica", wiki: "Jamaica", cap: [17.9714, -76.7937], locs: [["Kingston", 17.9714, -76.7937, "capital", ["Dunn's River Falls", 18.3, -77.25, "nature"]]] },
  { name: "Japan", wiki: "Japan", cap: [35.6762, 139.6503], locs: [["Tokyo", 35.6762, 139.6503, "capital", ["Mount Fuji", 35.3622, 138.728, "nature"]], ["Osaka", 34.6937, 135.5023, "city"], ["Yokohama", 35.4437, 139.6380, "city"], ["Kyoto", 35.0116, 135.7681, "former"]] },
  { name: "Jordan", wiki: "Jordan", cap: [31.9566, 35.9456], locs: [["Amman", 31.9566, 35.9456, "capital", ["Wadi Rum Protected Area", 29.85, 35.45, "nature"]], ["Zarqa", 32.0728, 36.0880, "city"], ["Petra", 30.3285, 35.4444, "unicode"]] },
  { name: "Kazakhstan", wiki: "Kazakhstan", cap: [51.1801, 71.4460], locs: [["Astana", 51.1801, 71.4460, "capital", ["Charyn Canyon National Nature Park", 43.3, 78.6, "nature"]], ["Almaty", 43.2220, 76.8512, "former"], ["Karaganda", 49.8047, 72.8241, "city"]] },
  { name: "Kenya", wiki: "Kenya", cap: [-1.2921, 36.8219], locs: [["Nairobi", -1.2921, 36.8219, "capital", ["Maasai Mara National Reserve", -1.5, 34.85, "nature"]], ["Mombasa", -4.0435, 39.6682, "city"], ["Kisumu", -0.1022, 34.7617, "city"]] },
  { name: "Kiribati", wiki: "Kiribati", cap: [1.3290, 172.9790], locs: [["South Tarawa", 1.3290, 172.9790, "capital"]] },
  { name: "Kyrgyzstan", wiki: "Kyrgyzstan", cap: [42.8746, 74.5698], locs: [["Bishkek", 42.8746, 74.5698, "capital", ["Issyk-Kul Lake", 42.5, 77.5, "nature"]], ["Osh", 40.5283, 72.7985, "city"]] },
  { name: "Laos", wiki: "Laos", cap: [17.9757, 102.6331], locs: [["Vientiane", 17.9757, 102.6331, "capital", ["Kuang Si Falls", 19.88, 102.2, "nature"]], ["Luang Prabang", 19.8833, 102.1328, "unicode"]] },
  { name: "Latvia", wiki: "Latvia", cap: [56.9496, 24.1052], locs: [["Riga", 56.9496, 24.1052, "capital", ["Gauja National Park", 57.3, 24.8, "nature"]], ["Daugavpils", 55.8747, 26.5361, "city"]] },
  { name: "Lebanon", wiki: "Lebanon", cap: [33.8886, 35.4955], locs: [["Beirut", 33.8886, 35.4955, "capital", ["Cedars of God", 34.25, 35.9, "nature"]], ["Tripoli", 34.4386, 35.8450, "city"], ["Byblos", 34.1236, 35.6481, "unicode"]] },
  { name: "Lesotho", wiki: "Lesotho", cap: [-29.3167, 27.4833], locs: [["Maseru", -29.3167, 27.4833, "capital", ["Sehlabathebe National Park", -30.25, 29.8, "nature"]]] },
  { name: "Liberia", wiki: "Liberia", cap: [6.3005, -10.7969], locs: [["Monrovia", 6.3005, -10.7969, "capital", ["Sapo National Park", 4.75, -8.0, "nature"]]] },
  { name: "Libya", wiki: "Libya", cap: [32.9006, 13.1862], locs: [["Tripoli", 32.9006, 13.1862, "capital", ["Tadrart Acacus", 24.8, 8.7, "nature"]], ["Benghazi", 32.1154, 20.0686, "city"]] },
  { name: "Liechtenstein", wiki: "Liechtenstein", cap: [47.1410, 9.5215], locs: [["Vaduz", 47.1410, 9.5215, "capital", ["Vaduz Castle", 47.14, 9.52, "nature"]]] },
  { name: "Lithuania", wiki: "Lithuania", cap: [54.6872, 25.2797], locs: [["Vilnius", 54.6872, 25.2797, "capital", ["Curonian Spit", 55.2, 21.0, "nature"]], ["Kaunas", 54.8985, 23.9036, "city"], ["Klaipeda", 55.7206, 21.1449, "city"]] },
  { name: "Madagascar", wiki: "Madagascar", cap: [-18.9137, 47.5361], locs: [["Antananarivo", -18.9137, 47.5361, "capital", ["Avenue of the Baobabs", -19.96, 44.39, "nature"]], ["Toamasina", -18.1492, 49.4023, "city"]] },
  { name: "Malawi", wiki: "Malawi", cap: [-13.9669, 33.7873], locs: [["Lilongwe", -13.9669, 33.7873, "capital", ["Lake Malawi National Park", -14.5, 34.9, "nature"]], ["Blantyre", -15.7861, 35.0058, "city"]] },
  { name: "Maldives", wiki: "Maldives", cap: [4.1755, 73.5093], locs: [["Malé", 4.1755, 73.5093, "capital"]] },
  { name: "Mali", wiki: "Mali", cap: [12.6392, -8.0029], locs: [["Bamako", 12.6392, -8.0029, "capital", ["Gao Region", 16.27, -0.04, "nature"]], ["Timbuktu", 16.7735, -3.0074, "unicode"]] },
  { name: "Malta", wiki: "Malta", cap: [35.9042, 14.5189], locs: [["Valletta", 35.9042, 14.5189, "capital"]] },
  { name: "Marshall Islands", wiki: "Marshall_Islands", cap: [7.1167, 171.3667], locs: [["Majuro", 7.1167, 171.3667, "capital"]] },
  { name: "Mauritania", wiki: "Mauritania", cap: [18.0735, -15.9582], locs: [["Nouakchott", 18.0735, -15.9582, "capital", ["Banc d'Arguin National Park", 20.9, -16.2, "nature"]]] },
  { name: "Mauritius", wiki: "Mauritius", cap: [-20.1608, 57.4989], locs: [["Port Louis", -20.1608, 57.4989, "capital", ["Black River Gorges National Park", -20.35, 57.4, "nature"]]] },
  { name: "Micronesia", wiki: "Federated_States_of_Micronesia", cap: [6.9248, 158.1618], locs: [["Palikir", 6.9248, 158.1618, "capital"]] },
  { name: "Moldova", wiki: "Moldova", cap: [47.0105, 28.8638], locs: [["Chișinău", 47.0105, 28.8638, "capital", ["Orheiul Vechi", 47.4, 28.4, "nature"]], ["Bălți", 47.7617, 27.9297, "city"]] },
  { name: "Monaco", wiki: "Monaco", cap: [43.7384, 7.4246], locs: [["Monaco", 43.7384, 7.4246, "capital"]] },
  { name: "Mongolia", wiki: "Mongolia", cap: [47.8864, 106.9057], locs: [["Ulaanbaatar", 47.8864, 106.9057, "capital", ["Gobi Desert", 43.5, 104.0, "nature"]], ["Darkhan", 49.5, 105.8167, "city"]] },
  { name: "Montenegro", wiki: "Montenegro", cap: [42.4304, 19.2594], locs: [["Podgorica", 42.4304, 19.2594, "capital", ["Durmitor National Park", 43.2, 19.05, "nature"]], ["Cetinje", 42.3931, 18.9225, "former"]] },
  { name: "Morocco", wiki: "Morocco", cap: [33.9716, -6.8498], locs: [["Rabat", 33.9716, -6.8498, "capital", ["Toubkal National Park", 31.06, -8.0, "nature"]], ["Casablanca", 33.5731, -7.5898, "city"], ["Fez", 34.0181, -5.0078, "former"], ["Marrakesh", 31.6295, -7.9811, "unicode"]] },
  { name: "Mozambique", wiki: "Mozambique", cap: [-25.9692, 32.5732], locs: [["Maputo", -25.9692, 32.5732, "capital", ["Gorongosa National Park", -18.7, 34.4, "nature"]], ["Beira", -19.8436, 34.8389, "city"]] },
  { name: "Myanmar", wiki: "Myanmar", cap: [19.7633, 96.0785], locs: [["Naypyidaw", 19.7633, 96.0785, "capital", ["Bagan Archaeological Zone", 21.17, 94.86, "nature"]], ["Yangon", 16.8661, 96.1951, "former"], ["Mandalay", 21.9162, 96.0891, "city"]] },
  { name: "Namibia", wiki: "Namibia", cap: [-22.5597, 17.0832], locs: [["Windhoek", -22.5597, 17.0832, "capital", ["Namib Desert", -24.5, 15.5, "nature"]], ["Walvis Bay", -22.9575, 14.5053, "city"]] },
  { name: "Nauru", wiki: "Nauru", cap: [-0.5477, 166.9209], locs: [["Yaren", -0.5477, 166.9209, "capital"]] },
  { name: "Nepal", wiki: "Nepal", cap: [27.7172, 85.3240], locs: [["Kathmandu", 27.7172, 85.3240, "capital", ["Sagarmatha National Park", 28.0, 86.9, "nature"]], ["Pokhara", 28.2096, 83.9856, "city"]] },
  { name: "Netherlands", wiki: "Netherlands", cap: [52.3676, 4.9041], locs: [["Amsterdam", 52.3676, 4.9041, "capital", ["De Hoge Veluwe National Park", 52.25, 5.85, "nature"]], ["Rotterdam", 51.9225, 4.4792, "city"], ["The Hague", 52.0705, 4.3007, "city"]] },
  { name: "New Zealand", wiki: "New_Zealand", cap: [-41.2865, 174.7762], locs: [["Wellington", -41.2865, 174.7762, "capital", ["Milford Sound", -44.67, -168.0, "nature"]], ["Auckland", -36.8485, 174.7633, "city"], ["Christchurch", -43.5321, 172.6362, "city"]] },
  { name: "Nicaragua", wiki: "Nicaragua", cap: [12.1364, -86.2514], locs: [["Managua", 12.1364, -86.2514, "capital", ["Lake Nicaragua", 11.5, -85.3, "nature"]], ["León", 12.4359, -86.8782, "former"]] },
  { name: "Niger", wiki: "Niger", cap: [13.5137, 2.1098], locs: [["Niamey", 13.5137, 2.1098, "capital", ["W National Park", 2.3, 2.3, "nature"]]] },
  { name: "Nigeria", wiki: "Nigeria", cap: [9.0579, 7.4951], locs: [["Abuja", 9.0579, 7.4951, "capital", ["Cross-Sanaga-Bioko Coastal Forests", 4.3, 9.25, "nature"]], ["Lagos", 6.5244, 3.3792, "former"], ["Ibadan", 7.3775, 3.9470, "city"], ["Kano", 12.0022, 8.5920, "city"]] },
  { name: "North Korea", wiki: "North_Korea", cap: [39.0194, 125.7381], locs: [["Pyongyang", 39.0194, 125.7381, "capital", ["Mount Paektu", 41.99, 128.06, "nature"]]] },
  { name: "North Macedonia", wiki: "North_Macedonia", cap: [41.9973, 21.4280], locs: [["Skopje", 41.9973, 21.4280, "capital", ["Galicica National Park", 41.1, 20.9, "nature"]], ["Bitola", 41.0113, 21.3245, "city"], ["Ohrid", 41.1231, 20.8016, "unicode"]] },
  { name: "Norway", wiki: "Norway", cap: [59.9139, 10.7522], locs: [["Oslo", 59.9139, 10.7522, "capital", ["Geirangerfjord", 62.1, 7.2, "nature"]], ["Bergen", 60.3913, 5.3221, "city"], ["Trondheim", 63.4269, 10.3952, "city"]] },
  { name: "Oman", wiki: "Oman", cap: [23.5880, 58.3829], locs: [["Muscat", 23.5880, 58.3829, "capital", ["Musandam Peninsula", 26.2, 56.2, "nature"]], ["Salalah", 17.0151, 54.0924, "city"]] },
  { name: "Pakistan", wiki: "Pakistan", cap: [33.6844, 73.0479], locs: [["Islamabad", 33.6844, 73.0479, "capital", ["Hunza Valley", 36.85, 74.95, "nature"]], ["Karachi", 24.8607, 67.0011, "former"], ["Lahore", 31.5204, 74.3587, "city"], ["Multan", 30.1575, 71.4454, "city"]] },
  { name: "Palau", wiki: "Palau", cap: [7.5149, 134.5825], locs: [["Ngerulmud", 7.5149, 134.5825, "capital", ["Palau National Marine Sanctuary", 7.3, 134.5, "nature"]]] },
  { name: "Papua New Guinea", wiki: "Papua_New_Guinea", cap: [-9.4438, 147.1803], locs: [["Port Moresby", -9.4438, 147.1803, "capital", ["Kokoda Track", -8.8, 147.7, "nature"]]] },
  { name: "Paraguay", wiki: "Paraguay", cap: [-25.2867, -57.6470], locs: [["Asunción", -25.2867, -57.6470, "capital", ["Iguazú Falls", -25.6, -54.4, "nature"]]] },
  { name: "Peru", wiki: "Peru", cap: [-12.0464, -77.0428], locs: [["Lima", -12.0464, -77.0428, "capital", ["Machu Picchu", -13.1631, -72.545, "nature"]], ["Arequipa", -16.4090, -71.5375, "city"], ["Cusco", -13.5319, -71.9675, "former"], ["Machu Picchu", -13.1631, -72.5450, "unicode"]] },
  { name: "Poland", wiki: "Poland", cap: [52.2297, 21.0122], locs: [["Warsaw", 52.2297, 21.0122, "capital", ["Białowieża Forest", 52.7, 24.2, "nature"]], ["Kraków", 50.0647, 19.9450, "city"], ["Wrocław", 51.1079, 17.0385, "city"], ["Gdańsk", 54.3520, 18.6466, "city"]] },
  { name: "Portugal", wiki: "Portugal", cap: [38.7223, -9.1393], locs: [["Lisbon", 38.7223, -9.1393, "capital", ["Douro Valley", 41.2, -7.5, "nature"]], ["Porto", 41.1579, -8.6291, "city"], ["Covilhã", 40.2835, -7.5006, "city"]] },
  { name: "Qatar", wiki: "Qatar", cap: [25.2854, 51.5310], locs: [["Doha", 25.2854, 51.5310, "capital"]] },
  { name: "Romania", wiki: "Romania", cap: [44.4268, 26.1025], locs: [["Bucharest", 44.4268, 26.1025, "capital", ["Carpathian Mountains", 45.5, 24.5, "nature"]], ["Cluj-Napoca", 46.7712, 23.6236, "city"], ["Timișoara", 45.7489, 21.2087, "city"]] },
  { name: "Russia", wiki: "Russia", cap: [55.7558, 37.6173], locs: [["Moscow", 55.7558, 37.6173, "capital", ["Lake Baikal", 55.0, 104.0, "nature"]], ["Saint Petersburg", 59.9343, 30.3351, "former"], ["Novosibirsk", 55.0415, 82.9346, "city"], ["Yekaterinburg", 56.8389, 60.6057, "city"]] },
  { name: "Rwanda", wiki: "Rwanda", cap: [-1.9403, 29.8739], locs: [["Kigali", -1.9403, 29.8739, "capital", ["Volcanoes National Park", -1.5, 29.6, "nature"]]] },
  { name: "Saint Kitts and Nevis", wiki: "Saint_Kitts_and_Nevis", cap: [17.3026, -62.7177], locs: [["Basseterre", 17.3026, -62.7177, "capital"]] },
  { name: "Saint Lucia", wiki: "Saint_Lucia", cap: [14.0101, -60.9875], locs: [["Castries", 14.0101, -60.9875, "capital"]] },
  { name: "Saint Vincent and the Grenadines", wiki: "Saint_Vincent_and_the_Grenadines", cap: [13.1600, -61.2248], locs: [["Kingstown", 13.1600, -61.2248, "capital"]] },
  { name: "Samoa", wiki: "Samoa", cap: [-13.8506, -171.7513], locs: [["Apia", -13.8506, -171.7513, "capital", ["Upolu Crater Lake", -13.8, -171.7, "nature"]]] },
  { name: "San Marino", wiki: "San_Marino", cap: [43.9424, 12.4578], locs: [["San Marino City", 43.9424, 12.4578, "capital"]] },
  { name: "São Tomé and Príncipe", wiki: "São_Tomé_and_Príncipe", cap: [0.3365, 6.7273], locs: [["São Tomé", 0.3365, 6.7273, "capital"]] },
  { name: "Saudi Arabia", wiki: "Saudi_Arabia", cap: [24.6877, 46.7219], locs: [["Riyadh", 24.6877, 46.7219, "capital", ["Asir Mountains", 18.0, 42.5, "nature"]], ["Mecca", 21.3891, 39.8579, "former"], ["Jeddah", 21.2854, 39.2376, "city"]] },
  { name: "Senegal", wiki: "Senegal", cap: [14.7167, -17.4677], locs: [["Dakar", 14.7167, -17.4677, "capital", ["Djoudj National Bird Sanctuary", 16.25, -15.45, "nature"]], ["Thiès", 14.7949, -16.9239, "city"]] },
  { name: "Serbia", wiki: "Serbia", cap: [44.8176, 20.4633], locs: [["Belgrade", 44.8176, 20.4633, "capital", ["Tara National Park", 43.7, 19.6, "nature"]], ["Novi Sad", 45.2671, 19.8335, "city"], ["Niš", 43.3209, 21.8863, "city"]] },
  { name: "Seychelles", wiki: "Seychelles", cap: [-4.6191, 55.4513], locs: [["Victoria", -4.6191, 55.4513, "capital", ["Vallée de Mai Nature Reserve", -4.33, 55.48, "nature"]]] },
  { name: "Sierra Leone", wiki: "Sierra_Leone", cap: [8.4657, -13.2317], locs: [["Freetown", 8.4657, -13.2317, "capital", ["Outamba-Kilimi National Park", 9.5, -11.4, "nature"]]] },
  { name: "Singapore", wiki: "Singapore", cap: [1.3521, 103.8198], locs: [["Singapore", 1.3521, 103.8198, "capital", ["MacRitchie Reservoir", 1.37, 103.84, "nature"]]] },
  { name: "Slovakia", wiki: "Slovakia", cap: [48.1486, 17.1077], locs: [["Bratislava", 48.1486, 17.1077, "capital", ["High Tatras", 49.2, 20.0, "nature"]], ["Košice", 48.7164, 21.2611, "city"]] },
  { name: "Slovenia", wiki: "Slovenia", cap: [46.0569, 14.5058], locs: [["Ljubljana", 46.0569, 14.5058, "capital", ["Triglav National Park", 46.4, 14.0, "nature"]], ["Maribor", 46.5547, 15.6467, "city"]] },
  { name: "Solomon Islands", wiki: "Solomon_Islands", cap: [-9.4456, 160.0327], locs: [["Honiara", -9.4456, 160.0327, "capital"]] },
  { name: "Somalia", wiki: "Somalia", cap: [2.0469, 45.3182], locs: [["Mogadishu", 2.0469, 45.3182, "capital", ["Socotra Island", 12.5, 54.0, "nature"]], ["Hargeisa", 9.5597, 44.0650, "city"]] },
  { name: "South Africa", wiki: "South_Africa", cap: [-25.7479, 28.2293], locs: [["Pretoria", -25.7479, 28.2293, "capital", ["Kruger National Park", -24.0, 31.5, "nature"]], ["Cape Town", -33.9249, 18.4241, "city"], ["Johannesburg", -26.2041, 28.0473, "city"], ["Bloemfontein", -29.1199, 26.2148, "former"]] },
  { name: "South Korea", wiki: "South_Korea", cap: [37.5665, 126.9780], locs: [["Seoul", 37.5665, 126.9780, "capital", ["Seoraksan National Park", 38.1, 128.5, "nature"]], ["Busan", 35.1796, 129.0756, "city"], ["Incheon", 37.4419, 126.7036, "city"], ["Daegu", 35.8714, 128.5890, "city"]] },
  { name: "South Sudan", wiki: "South_Sudan", cap: [4.8594, 31.5713], locs: [["Juba", 4.8594, 31.5713, "capital", ["Sudd Wetlands", 6.0, 30.5, "nature"]]] },
  { name: "Spain", wiki: "Spain", cap: [40.4168, -3.7038], locs: [["Madrid", 40.4168, -3.7038, "capital", ["Picos de Europa National Park", 43.2, -4.8, "nature"]], ["Barcelona", 41.3851, 2.1734, "city"], ["Valencia", 39.4699, -0.3763, "city"], ["Seville", 37.3886, -5.9824, "city"], ["Granada", 37.1760, -3.5882, "unicode"]] },
  { name: "Sri Lanka", wiki: "Sri_Lanka", cap: [6.9008, 79.9013], locs: [["Sri Jayawardenepura Kotte", 6.9008, 79.9013, "capital", ["Sinharaja Rainforest", 6.4, 80.4, "nature"]], ["Colombo", 6.9271, 79.8612, "former"], ["Kandy", 7.2906, 80.6337, "unicode"]] },
  { name: "Sudan", wiki: "Sudan", cap: [15.5007, 32.5599], locs: [["Khartoum", 15.5007, 32.5599, "capital", ["Dinder National Park", 10.5, 34.5, "nature"]], ["Omdurman", 15.6145, 32.4800, "city"]] },
  { name: "Suriname", wiki: "Suriname", cap: [5.8520, -55.2038], locs: [["Paramaribo", 5.8520, -55.2038, "capital", ["Raleighvallen National Park", 3.7, -56.4, "nature"]]] },
  { name: "Sweden", wiki: "Sweden", cap: [59.3293, 18.0686], locs: [["Stockholm", 59.3293, 18.0686, "capital", ["Sarek National Park", 67.0, 16.9, "nature"]], ["Gothenburg", 57.7089, 11.9746, "city"], ["Malmö", 55.6050, 12.9854, "city"], ["Uppsala", 59.8586, 17.6389, "city"]] },
  { name: "Switzerland", wiki: "Switzerland", cap: [46.9480, 7.4474], locs: [["Bern", 46.9480, 7.4474, "capital", ["Jungfrau Region", 46.5, 8.2, "nature"]], ["Zürich", 47.3769, 8.5417, "city"], ["Geneva", 46.2044, 6.1432, "city"], ["Basel", 47.5596, 7.5886, "city"]] },
  { name: "Syria", wiki: "Syria", cap: [33.5138, 36.2765], locs: [["Damascus", 33.5138, 36.2765, "capital", ["Palmyra", 34.55, 38.27, "nature"]], ["Aleppo", 36.2021, 37.1343, "former"], ["Homs", 34.7300, 36.7237, "city"]] },
  { name: "Taiwan", wiki: "Taiwan", cap: [25.0330, 121.5654], locs: [["Taipei", 25.0330, 121.5654, "capital", ["Yushan Mountain", 23.47, 120.96, "nature"]], ["Kaohsiung", 22.6163, 120.3006, "city"], ["Taichung", 24.1372, 120.6735, "city"]] },
  { name: "Tajikistan", wiki: "Tajikistan", cap: [38.5598, 68.7870], locs: [["Dushanbe", 38.5598, 68.7870, "capital", ["Pamir Mountains", 37.0, 72.0, "nature"]], ["Khujand", 40.2864, 69.6222, "city"]] },
  { name: "Tanzania", wiki: "Tanzania", cap: [-6.1630, 35.7516], locs: [["Dodoma", -6.1630, 35.7516, "capital", ["Mount Kilimanjaro", -3.0, 37.35, "nature"]], ["Dar es Salaam", -6.7924, 39.2083, "former"], ["Moshi", -3.3667, 37.6667, "city"]] },
  { name: "Thailand", wiki: "Thailand", cap: [13.7563, 100.5018], locs: [["Bangkok", 13.7563, 100.5018, "capital", ["Khao Yai National Park", 14.4, 101.4, "nature"]], ["Chiang Mai", 18.7883, 98.9853, "city"], ["Phuket", 8.1128, 98.2997, "city"], ["Sukhothai", 17.0125, 99.8239, "unicode"]] },
  { name: "Timor-Leste", wiki: "East_Timor", cap: [-8.5569, 125.5603], locs: [["Dili", -8.5569, 125.5603, "capital", ["Mount Ramelau", -9.0, 124.5, "nature"]]] },
  { name: "Togo", wiki: "Togo", cap: [6.1375, 1.2123], locs: [["Lomé", 6.1375, 1.2123, "capital", ["Koutammakou Landscape", 10.2, 1.2, "nature"]]] },
  { name: "Tonga", wiki: "Tonga", cap: [-21.1393, -175.2046], locs: [["Nukuʻalofa", -21.1393, -175.2046, "capital", ["Vava'u Islands", -18.6, -173.9, "nature"]]] },
  { name: "Trinidad and Tobago", wiki: "Trinidad_and_Tobago", cap: [10.6918, -61.2225], locs: [["Port of Spain", 10.6918, -61.2225, "capital", ["Asa Wright Nature Centre", 10.72, -61.24, "nature"]]] },
  { name: "Tunisia", wiki: "Tunisia", cap: [36.8190, 10.1658], locs: [["Tunis", 36.8190, 10.1658, "capital", ["Ichkeul National Park", 37.2, 9.1, "nature"]], ["Sfax", 34.7406, 10.7603, "city"], ["Sousse", 35.8256, 10.6369, "city"]] },
  { name: "Turkey", wiki: "Turkey", cap: [39.9334, 32.8597], locs: [["Ankara", 39.9334, 32.8597, "capital", ["Cappadocia", 38.7, 34.6, "nature"]], ["Istanbul", 41.0082, 28.9784, "city"], ["İzmir", 38.4161, 27.1398, "city"], ["Bursa", 40.1955, 29.0678, "city"]] },
  { name: "Turkmenistan", wiki: "Turkmenistan", cap: [37.9601, 58.3261], locs: [["Ashgabat", 37.9601, 58.3261, "capital", ["Turpan Depression", 40.5, 62.0, "nature"]], ["Turkmenabat", 37.1381, 65.4169, "city"]] },
  { name: "Tuvalu", wiki: "Tuvalu", cap: [-8.5200, 179.1980], locs: [["Funafuti", -8.5200, 179.1980, "capital"]] },
  { name: "Uganda", wiki: "Uganda", cap: [0.3476, 32.5825], locs: [["Kampala", 0.3476, 32.5825, "capital", ["Rwenzori Mountains National Park", 0.4, 30.0, "nature"]], ["Gulu", 2.7734, 32.2764, "city"]] },
  { name: "Ukraine", wiki: "Ukraine", cap: [50.4501, 30.5234], locs: [["Kyiv", 50.4501, 30.5234, "capital", ["Carpathian Mountains", 48.4, 24.5, "nature"]], ["Kharkiv", 49.9935, 36.2304, "city"], ["Lviv", 49.8397, 24.0297, "city"], ["Odesa", 46.4856, 30.7326, "city"]] },
  { name: "United Arab Emirates", wiki: "United_Arab_Emirates", cap: [24.4539, 54.3773], locs: [["Abu Dhabi", 24.4539, 54.3773, "capital", ["Hajar Mountains", 25.3, 56.1, "nature"]], ["Dubai", 25.2048, 55.2708, "city"], ["Sharjah", 25.3463, 55.4209, "city"]] },
  { name: "United Kingdom", wiki: "United_Kingdom", cap: [51.5074, -0.1278], locs: [["London", 51.5074, -0.1278, "capital", ["Lake District National Park", 54.5, -3.1, "nature"]], ["Manchester", 53.4808, -2.2426, "city"], ["Birmingham", 52.5086, -1.8783, "city"], ["Leeds", 53.8008, -1.5491, "city"]] },
  { name: "United States", wiki: "United_States", cap: [38.9072, -77.0369], locs: [["Washington, D.C.", 38.9072, -77.0369, "capital", ["Yellowstone National Park", 44.7, -110.5, "nature"]], ["New York City", 40.7128, -74.0060, "city"], ["Los Angeles", 34.0522, -118.2437, "city"], ["Chicago", 41.8781, -87.6298, "city"], ["Houston", 29.7604, -95.3698, "city"]] },
  { name: "Uruguay", wiki: "Uruguay", cap: [-34.9011, -56.1915], locs: [["Montevideo", -34.9011, -56.1915, "capital", ["Esteros de Ibera", -28.3, -57.2, "nature"]], ["Salto", -31.3873, -57.9683, "city"]] },
  { name: "Uzbekistan", wiki: "Uzbekistan", cap: [41.2995, 69.2401], locs: [["Tashkent", 41.2995, 69.2401, "capital", ["Nuratau Mountains", 40.8, 65.4, "nature"]], ["Samarkand", 39.6547, 66.9758, "city"], ["Bukhara", 39.7681, 64.4272, "unicode"]] },
  { name: "Vanuatu", wiki: "Vanuatu", cap: [-17.7333, 168.3167], locs: [["Port Vila", -17.7333, 168.3167, "capital", ["Mount Yasur", -19.52, 169.44, "nature"]]] },
  { name: "Venezuela", wiki: "Venezuela", cap: [10.4806, -66.9036], locs: [["Caracas", 10.4806, -66.9036, "capital", ["Angel Falls", 5.97, -62.58, "nature"]], ["Maracaibo", 10.6666, -71.6124, "city"], ["Valencia", 10.1620, -67.9999, "city"]] },
  { name: "Vietnam", wiki: "Vietnam", cap: [21.0285, 105.8542], locs: [["Hanoi", 21.0285, 105.8542, "capital", ["Ha Long Bay", 20.84, 107.1, "nature"]], ["Ho Chi Minh City", 10.8231, 106.6297, "former"], ["Hai Phong", 20.8449, 106.6836, "city"], ["Hội An", 15.8794, 108.3350, "unicode"]] },
  { name: "Yemen", wiki: "Yemen", cap: [15.3527, 48.5164], locs: [["Sana'a", 15.3694, 44.1910, "capital", ["Socotra Island", 12.5, 54.0, "nature"]], ["Aden", 12.7797, 45.0367, "former"], ["Taiz", 13.5800, 44.0077, "city"]] },
  { name: "Zambia", wiki: "Zambia", cap: [-15.3875, 28.3228], locs: [["Lusaka", -15.3875, 28.3228, "capital", ["Victoria Falls", -17.93, 25.86, "nature"]], ["Kitwe", -12.8183, 28.2559, "city"]] },
  { name: "Zimbabwe", wiki: "Zimbabwe", cap: [-17.8252, 31.0335], locs: [["Harare", -17.8252, 31.0335, "capital", ["Hwange National Park", -18.5, 26.5, "nature"]], ["Bulawayo", -20.1325, 28.6264, "city"]] },
];

// Continent mapping by country
const CONTINENTS = {
  // North America
  "United States": "North America", "Canada": "North America", "Mexico": "North America", "Guatemala": "North America", "Belize": "North America", "Honduras": "North America", "El Salvador": "North America", "Nicaragua": "North America", "Costa Rica": "North America", "Panama": "North America",
  
  // South America
  "Colombia": "South America", "Venezuela": "South America", "Guyana": "South America", "Suriname": "South America", "French Guiana": "South America", "Ecuador": "South America", "Peru": "South America", "Brazil": "South America", "Bolivia": "South America", "Paraguay": "South America", "Chile": "South America", "Argentina": "South America", "Uruguay": "South America",
  
  // Europe
  "Iceland": "Europe", "Ireland": "Europe", "United Kingdom": "Europe", "Portugal": "Europe", "Spain": "Europe", "France": "Europe", "Belgium": "Europe", "Netherlands": "Europe", "Luxembourg": "Europe", "Germany": "Europe", "Denmark": "Europe", "Sweden": "Europe", "Norway": "Europe", "Finland": "Europe", "Estonia": "Europe", "Latvia": "Europe", "Lithuania": "Europe", "Poland": "Europe", "Czech Republic": "Europe", "Slovakia": "Europe", "Austria": "Europe", "Switzerland": "Europe", "Liechtenstein": "Europe", "Italy": "Europe", "Slovenia": "Europe", "Croatia": "Europe", "Bosnia and Herzegovina": "Europe", "Serbia": "Europe", "Montenegro": "Europe", "Kosovo": "Europe", "Albania": "Europe", "North Macedonia": "Europe", "Greece": "Europe", "Romania": "Europe", "Bulgaria": "Europe", "Hungary": "Europe", "Moldova": "Europe", "Ukraine": "Europe", "Belarus": "Europe", "Russia": "Europe", "Andorra": "Europe", "Monaco": "Europe", "San Marino": "Europe", "Vatican City": "Europe", "Malta": "Europe", "Cyprus": "Europe",
  
  // Africa
  "Morocco": "Africa", "Algeria": "Africa", "Tunisia": "Africa", "Libya": "Africa", "Egypt": "Africa", "Sudan": "Africa", "South Sudan": "Africa", "Eritrea": "Africa", "Ethiopia": "Africa", "Djibouti": "Africa", "Somalia": "Africa", "Kenya": "Africa", "Uganda": "Africa", "Tanzania": "Africa", "Rwanda": "Africa", "Burundi": "Africa", "Democratic Republic of the Congo": "Africa", "Republic of the Congo": "Africa", "Central African Republic": "Africa", "Chad": "Africa", "Cameroon": "Africa", "Equatorial Guinea": "Africa", "Gabon": "Africa", "São Tomé and Príncipe": "Africa", "Angola": "Africa", "Zambia": "Africa", "Zimbabwe": "Africa", "Malawi": "Africa", "Mozambique": "Africa", "Botswana": "Africa", "Namibia": "Africa", "South Africa": "Africa", "Lesotho": "Africa", "Eswatini": "Africa", "Mali": "Africa", "Mauritania": "Africa", "Senegal": "Africa", "Gambia": "Africa", "Guinea-Bissau": "Africa", "Guinea": "Africa", "Sierra Leone": "Africa", "Liberia": "Africa", "Ivory Coast": "Africa", "Ghana": "Africa", "Togo": "Africa", "Benin": "Africa", "Niger": "Africa", "Burkina Faso": "Africa", "Western Sahara": "Africa", "Cabo Verde": "Africa", "Mauritius": "Africa", "Seychelles": "Africa", "Comoros": "Africa",
  
  // Asia
  "Turkey": "Asia", "Syria": "Asia", "Lebanon": "Asia", "Israel": "Asia", "Palestine": "Asia", "Jordan": "Asia", "Iraq": "Asia", "Iran": "Asia", "Saudi Arabia": "Asia", "Yemen": "Asia", "Oman": "Asia", "United Arab Emirates": "Asia", "Qatar": "Asia", "Bahrain": "Asia", "Kuwait": "Asia", "Pakistan": "Asia", "Afghanistan": "Asia", "Tajikistan": "Asia", "Uzbekistan": "Asia", "Turkmenistan": "Asia", "Kazakhstan": "Asia", "Kyrgyzstan": "Asia", "India": "Asia", "Nepal": "Asia", "Bhutan": "Asia", "Bangladesh": "Asia", "Sri Lanka": "Asia", "Maldives": "Asia", "Myanmar": "Asia", "Thailand": "Asia", "Laos": "Asia", "Cambodia": "Asia", "Vietnam": "Asia", "Malaysia": "Asia", "Singapore": "Asia", "Brunei": "Asia", "Indonesia": "Asia", "East Timor": "Asia", "Philippines": "Asia", "China": "Asia", "Mongolia": "Asia", "South Korea": "Asia", "North Korea": "Asia", "Japan": "Asia", "Taiwan": "Asia", "Hong Kong": "Asia", "Macau": "Asia",
  
  // Oceania
  "Australia": "Oceania", "New Zealand": "Oceania", "Fiji": "Oceania", "Samoa": "Oceania", "Vanuatu": "Oceania", "Solomon Islands": "Oceania", "Kiribati": "Oceania", "Nauru": "Oceania", "Palau": "Oceania", "Tonga": "Oceania", "Tuvalu": "Oceania", "Marshall Islands": "Oceania", "Micronesia": "Oceania", "Papua New Guinea": "Oceania",
};

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
  // Convert to PST (UTC-8)
  const pstTime = new Date(now.toLocaleString('en-US', { timeZone: 'America/Los_Angeles' }));
  const pstDateStr = `${pstTime.getFullYear()}-${String(pstTime.getMonth() + 1).padStart(2, '0')}-${String(pstTime.getDate()).padStart(2, '0')}`;
  
  let countryIdx = getPuzzleForDate(pstDateStr);
  // Add offset to change the puzzle for today
  countryIdx = (countryIdx + 42) % COUNTRIES.length;
  const country = COUNTRIES[countryIdx];
  const locIdx = getPuzzleForDate(pstDateStr + "loc") % country.locs.length;
  const loc = country.locs[locIdx];
  return { country, loc, dateStr: pstDateStr };
}

function getRandomPuzzle() {
  if (COUNTRIES.length === 0) return null;
  const countryIdx = Math.floor(Math.random() * COUNTRIES.length);
  const country = COUNTRIES[countryIdx];
  const locIdx = Math.floor(Math.random() * country.locs.length);
  const loc = country.locs[locIdx];
  return { country, loc, dateStr: null };
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
        // Search for the location
        const searchUrl = `https://en.wikipedia.org/w/api.php?action=query&list=search&srsearch=${encodeURIComponent(locationName)}&srlimit=1&format=json&origin=*`;
        const searchRes = await fetch(searchUrl);
        const searchData = await searchRes.json();
        const results = searchData?.query?.search;
        if (!results?.length) { if (!cancelled) setLoading(false); return; }

        const title = results[0].title;
        
        // Get the page image (infobox/thumbnail)
        const pageUrl = `https://en.wikipedia.org/w/api.php?action=query&titles=${encodeURIComponent(title)}&prop=pageimages&pithumbsize=400&format=json&origin=*`;
        const pageRes = await fetch(pageUrl);
        const pageData = await pageRes.json();
        const pages = pageData?.query?.pages;
        const page = pages ? Object.values(pages)[0] : null;
        const mainImage = page?.thumbnail?.source;
        
        if (mainImage && !cancelled) {
          setImages([mainImage]);
          setLoading(false);
        } else if (!cancelled) {
          setLoading(false);
        }
      } catch (e) {
        console.error("Error fetching images:", e);
        if (!cancelled) setLoading(false);
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
      // Convert to PST (UTC-8)
      const pstTime = new Date(now.toLocaleString('en-US', { timeZone: 'America/Los_Angeles' }));
      const today = `${pstTime.getFullYear()}-${String(pstTime.getMonth() + 1).padStart(2, '0')}-${String(pstTime.getDate()).padStart(2, '0')}`;
      const stored = localStorage.getItem("witworld_puzzle_date_v2");
      
      // If stored date doesn't match today, it's a new day - clear old data
      if (stored !== today) {
        localStorage.removeItem("witworld_puzzle_v2");
        localStorage.removeItem("witworld_played_dates");
      }
      
      const p = localStorage.getItem("witworld_puzzle_v2");
      if (p) return JSON.parse(p);
      
      // Generate new puzzle for today
      const newPuzzle = getDailyPuzzle();
      localStorage.setItem("witworld_puzzle_date_v2", today);
      localStorage.setItem("witworld_puzzle_v2", JSON.stringify(newPuzzle));
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
  const [showStats, setShowStats] = useState(false);
  const [alreadyPlayed, setAlreadyPlayed] = useState(false);
  const [showConfetti, setShowConfetti] = useState(false);
  const [wikiSummary, setWikiSummary] = useState("");
  const statsSavedRef = useRef(false);
  const { country, loc } = puzzle;
  const { images, loading: imgLoading } = useWikiImages(loc[0]);

  // Load stats from localStorage
  const [stats, setStats] = useState(() => {
    try {
      const stored = localStorage.getItem("witworld_stats");
      return stored ? JSON.parse(stored) : { games: 0, wins: 0, guesses: [0, 0, 0, 0, 0, 0, 0] };
    } catch {
      return { games: 0, wins: 0, guesses: [0, 0, 0, 0, 0, 0, 0] };
    }
  });

  // Check if already played today's puzzle and restore guesses
  useEffect(() => {
    try {
      const now = new Date();
      const today = `${now.getUTCFullYear()}-${String(now.getUTCMonth() + 1).padStart(2, '0')}-${String(now.getUTCDate()).padStart(2, '0')}`;
      const played = localStorage.getItem("witworld_played_dates");
      const playedDates = played ? JSON.parse(played) : {};
      
      if (playedDates[today]) {
        setAlreadyPlayed(true);
        const result = playedDates[today];
        if (result.won) {
          setWon(true);
          setSubmitted(result.submitted);
          setGuesses(result.guesses || Array(6).fill(""));
        } else {
          setLost(true);
          setSubmitted(result.submitted);
          setGuesses(result.guesses || Array(6).fill(""));
        }
        statsSavedRef.current = true;
      }
    } catch (e) {
      console.error("Error checking played dates:", e);
    }
  }, []);

  // Save stats when game ends (only once)
  useEffect(() => {
    if ((won || lost) && !statsSavedRef.current) {
      statsSavedRef.current = true;
      
      const guessCount = submitted.findIndex(s => !s);
      // guessCount is 0-indexed position of first false, so it's the number of true values
      // If guessed on try 5: submitted = [true, true, true, true, true, false], guessCount = 5
      // We want to store in index 4 (0-4 = tries 1-5)
      const arrayIndex = guessCount === -1 ? 5 : guessCount - 1;
      
      const newStats = { ...stats, games: stats.games + 1 };
      if (won) {
        newStats.wins = stats.wins + 1;
        newStats.guesses[arrayIndex] = (newStats.guesses[arrayIndex] || 0) + 1;
      } else {
        newStats.guesses[6] = (newStats.guesses[6] || 0) + 1;
      }
      
      setStats(newStats);
      localStorage.setItem("witworld_stats", JSON.stringify(newStats));
      
      // Mark puzzle as played today with guesses
      try {
        const now = new Date();
        const today = `${now.getUTCFullYear()}-${String(now.getUTCMonth() + 1).padStart(2, '0')}-${String(now.getUTCDate()).padStart(2, '0')}`;
        const played = localStorage.getItem("witworld_played_dates");
        const playedDates = played ? JSON.parse(played) : {};
        playedDates[today] = { won, submitted, guesses };
        localStorage.setItem("witworld_played_dates", JSON.stringify(playedDates));
      } catch (e) {
        console.error("Error saving played date:", e);
      }
    }
  }, [won, lost]);

  // Fetch Wikipedia summary when game ends
  useEffect(() => {
    if ((won || lost) && country) {
      const fetchWikiSummary = async () => {
        try {
          const response = await fetch(
            `https://simple.wikipedia.org/w/api.php?action=query&format=json&prop=extracts&titles=${encodeURIComponent(loc[0])}&explaintext=true&exintro=true&origin=*`
          );
          const data = await response.json();
          const pages = data.query.pages;
          const page = pages[Object.keys(pages)[0]];
          if (page && page.extract) {
            // Get everything up to the first double newline (first paragraph)
            const paragraphs = page.extract.split('\n\n');
            const firstParagraph = paragraphs[0] || page.extract;
            setWikiSummary(firstParagraph);
          }
        } catch (e) {
          console.error("Error fetching Wikipedia:", e);
          setWikiSummary("Unable to load summary.");
        }
      };
      fetchWikiSummary();
    }
  }, [won, lost, country]);

  function handleGuess(idx) {
    const guess = guesses[idx];
    if (!guess || submitted[idx]) return;
    const newSub = [...submitted];
    newSub[idx] = true;
    setSubmitted(newSub);
    if (guess === country.name) {
      setShowConfetti(true);
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
    const maxDist = 20000;
    const percentage = Math.max(0, Math.round(100 - (dist / maxDist) * 100));
    
    // Determine continent emoji
    const targetContinent = CONTINENTS[country.name] || "Unknown";
    const guessContinent = CONTINENTS[gc.name] || "Unknown";
    let proximityEmoji = "⛔️"; // wrong continent
    
    if (guessContinent === targetContinent) {
      proximityEmoji = "🆗"; // correct continent
    }
    
    return { dist, dir, percentage, proximityEmoji };
  }

  function shareResults() {
    const guessCount = submitted.findIndex(s => !s);
    const finalCount = guessCount === -1 ? 6 : guessCount + 1;
    
    // Build hints summary
    let hintsSummary = "";
    for (let i = 0; i < finalCount; i++) {
      if (submitted[i]) {
        const hint = getHint(i);
        if (hint) {
          const dirEmoji = hint.dir === "N" ? "⬆️" : hint.dir === "S" ? "⬇️" : hint.dir === "E" ? "➡️" : hint.dir === "W" ? "⬅️" :
                          hint.dir === "NE" ? "↗️" : hint.dir === "NW" ? "↖️" : hint.dir === "SE" ? "↘️" : "↙️";
          hintsSummary += `${dirEmoji} ${hint.percentage}%\n`;
        } else if (guesses[i] === country.name) {
          hintsSummary += `✓ Correct!\n`;
        }
      }
    }
    
    const text = `Where In The World? ${finalCount}/6 🎯\n\n${hintsSummary}\nPlay: https://witworld.vercel.app`;
    navigator.clipboard.writeText(text).then(() => {
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    }).catch(() => alert(text));
  }

  const TYPE_LABELS = { capital: "🏛️ Capital", former: "🕰️ Former", city: "🌆 City", unicode: "🏛️ UNESCO", nature: "🌿 Nature" };
  const TYPE_COLORS = { capital: "#4ade80", former: "#fb923c", city: "#60a5fa", unicode: "#e879f9" };

  const typeColor = TYPE_COLORS[loc[3]];
  const typeLabel = TYPE_LABELS[loc[3]];

  return (
    <div style={{
      minHeight: "100vh", background: "#0f0f17", color: "#f8f8f2",
      fontFamily: "'Segoe UI', system-ui, sans-serif", display: "flex",
      flexDirection: "column", alignItems: "center", padding: "24px 16px 48px"
    }}>
      <style>{`
        @keyframes spin { to { transform: rotate(360deg); } }
        @keyframes confetti-fall {
          0% {
            transform: translateY(-10px) translateX(0) rotate(0deg);
            opacity: 1;
          }
          100% {
            transform: translateY(100vh) translateX(var(--tx)) rotate(360deg);
            opacity: 0;
          }
        }
        .confetti {
          position: fixed;
          pointer-events: none;
          animation: confetti-fall 3s ease-out forwards;
        }
      `}</style>

      {showConfetti && (
        <>
          {Array.from({ length: 50 }).map((_, i) => (
            <div
              key={i}
              className="confetti"
              style={{
                left: `${Math.random() * 100}%`,
                top: '-10px',
                width: `${Math.random() * 10 + 5}px`,
                height: `${Math.random() * 10 + 5}px`,
                background: ['#5BCEFA', '#FFFFFF', '#F5A9B8'][Math.floor(Math.random() * 3)],
                borderRadius: Math.random() > 0.5 ? '50%' : '0',
                '--tx': `${(Math.random() - 0.5) * 200}px`,
                animationDelay: `${Math.random() * 0.5}s`,
              }}
            />
          ))}
        </>
      )}

      <div style={{ textAlign: "center", marginBottom: 28 }}>
        <h1 style={{ margin: 0, fontSize: 36, fontWeight: 900, letterSpacing: -1, color: "#f8f8f2", marginBottom: 4, fontFamily: "'Geist', 'Segoe UI', sans-serif" }}>
          where in the world?
        </h1>
        <div style={{ 
          display: "flex", 
          justifyContent: "center", 
          gap: 20, 
          marginBottom: 12,
          fontSize: 12,
          color: "#666"
        }}>
          <span>🏛️ capital</span>
          <span>🕰️ former</span>
          <span>🌆 city</span>
          <span>🏛️ unesco</span>
          <span>🌿 nature</span>
        </div>
        <p style={{ margin: 0, color: "#444", fontSize: 12, letterSpacing: 2, fontWeight: 700, textTransform: "uppercase" }}>
          guess the country
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
          <div style={{ fontSize: 28, fontWeight: 800, letterSpacing: -0.5, color: "#f8f8f2", textAlign: "center" }}>
            {loc[0]}
          </div>
          <div style={{ marginTop: 8, fontSize: 15, color: "#888", textAlign: "center" }}>
            which country is this <span style={{ color: typeColor }}>{TYPE_LABELS[loc[3]]}</span> in?
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

              {(won || lost) && submitted[i] ? (
                <div style={{
                  flex: 1, padding: "10px 14px", borderRadius: 8, border: "1px solid #555",
                  background: "#1e1e2e", color: "#f8f8f2", fontSize: 14,
                  display: "flex", alignItems: "center"
                }}>
                  {guesses[i]}
                </div>
              ) : (
                <SearchDropdown
                  value={guesses[i]}
                  onChange={v => { const g = [...guesses]; g[i] = v; setGuesses(g); }}
                  disabled={!isActive || alreadyPlayed}
                  placeholder={isActive ? "Select…" : submitted[i] ? guesses[i] || "—" : "—"}
                />
              )}

              {isActive && !alreadyPlayed && (
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
                  padding: "6px 10px", fontSize: 14, minWidth: 0
                }}>
                  <span style={{ whiteSpace: "nowrap", color: "#fff", fontSize: 14 }}>
                    {hint.dir === "N" ? "⬆️" : hint.dir === "S" ? "⬇️" : hint.dir === "E" ? "➡️" : hint.dir === "W" ? "⬅️" :
                     hint.dir === "NE" ? "↗️" : hint.dir === "NW" ? "↖️" : hint.dir === "SE" ? "↘️" : "↙️"}
                  </span>
                  <span style={{ 
                    fontWeight: 700, 
                    whiteSpace: "nowrap",
                    fontSize: 14,
                    color: hint.percentage < 70 
                      ? `hsl(${hint.percentage * 1.2}, 100%, 50%)` 
                      : `hsl(${120 - (hint.percentage - 70) * 1.2}, 100%, 50%)`
                  }}>
                    {hint.percentage}%
                  </span>
                  <span style={{ whiteSpace: "nowrap", color: "#fff", fontSize: 14 }}>
                    {hint.dist}km {hint.proximityEmoji}
                  </span>
                </div>
              )}

              {isCorrect && (
                <div style={{
                  display: "flex", alignItems: "center", gap: 5, flexShrink: 0,
                  background: "#4ade8022", border: "1px solid #4ade80", borderRadius: 8,
                  padding: "6px 10px", fontSize: 12, minWidth: 0
                }}>
                  <span style={{ whiteSpace: "nowrap", color: "#4ade80" }}>📍</span>
                  <span style={{ fontWeight: 700, whiteSpace: "nowrap", color: "#4ade80" }}>100%</span>
                  <span style={{ whiteSpace: "nowrap", color: "#4ade80" }}>0km ✅</span>
                </div>
              )}
            </div>
          );
        })}
      </div>

      {(won || lost) && (
        <div style={{ display: "flex", flexDirection: "column", gap: 20, marginTop: 28, width: "100%", maxWidth: 520 }}>
          <div style={{
            background: won ? "linear-gradient(135deg,#052e16,#14532d)" : "linear-gradient(135deg,#1c0a0a,#450a0a)",
            border: `1px solid ${won ? "#4ade80" : "#f87171"}`,
            borderRadius: 16, padding: "20px", textAlign: "center"
          }}>
            <div style={{ fontSize: 28, marginBottom: 6 }}>{won ? "🎉" : "💡"}</div>
            <div style={{ fontWeight: 800, fontSize: 20, color: won ? "#4ade80" : "#f87171", marginBottom: 4 }}>
              {won ? (
                (() => {
                  const guessCount = submitted.findIndex(s => !s);
                  const finalCount = guessCount === -1 ? 6 : guessCount + 1;
                  const messages = ["Perfect!", "Excellent!", "Great!", "Nice!", "Good!", "Phew!"];
                  return messages[finalCount - 1] || "Perfect!";
                })()
              ) : "Better luck next time!"}
            </div>
            {lost && (
              <div style={{ color: "#aaa", marginBottom: 4, fontSize: 14 }}>
                The answer was <strong style={{ color: "#f8f8f2" }}>{country.name}</strong>
              </div>
            )}
            <div style={{ color: "#aaa", fontSize: 13, marginBottom: 16 }}>
              {loc[0]} is in <strong style={{ color: "#f8f8f2" }}>{country.name}</strong>
            </div>
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
          {/* Wikipedia Card */}
          <div style={{
            background: "linear-gradient(135deg, #1e1e2e, #16162a)",
            border: "1px solid #6366f1", borderRadius: 16,
            padding: "20px", textAlign: "center"
          }}>
            <div style={{ fontSize: 13, color: "#ccc", lineHeight: 1.6, marginBottom: 16, textAlign: "left" }}>
              {wikiSummary ? wikiSummary : "Loading..."}
            </div>
            <a href={`https://en.wikipedia.org/wiki/${loc[0].replace(/\s+/g, '_')}`} target="_blank" rel="noopener noreferrer"
              style={{
                display: "inline-block",
                padding: "8px 16px", borderRadius: 8,
                background: "#6366f1", color: "#fff", textDecoration: "none",
                fontWeight: 700, fontSize: 12, cursor: "pointer"
              }}
            >
              📖 Wikipedia: {loc[0]}
            </a>
          </div>

          {/* Stats Card */}
          <div style={{
            background: "linear-gradient(135deg, #1e1e2e, #16162a)",
            border: "1px solid #6366f1", borderRadius: 16,
            overflow: "hidden", padding: "20px 24px"
          }}>
            <div style={{ display: "flex", justifyContent: "center", alignItems: "center", marginBottom: 16 }}>
              <h2 style={{ margin: 0, fontSize: 20, fontWeight: 800, color: "#f8f8f2" }}>Your Stats</h2>
            </div>

            <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr 1fr", gap: 12, marginBottom: 20 }}>
              <div style={{ background: "#111118", padding: 12, borderRadius: 8, textAlign: "center" }}>
                <div style={{ fontSize: 22, fontWeight: 900, color: "#6366f1" }}>{stats.games}</div>
                <div style={{ fontSize: 10, color: "#666", marginTop: 4 }}>GAMES</div>
              </div>
              <div style={{ background: "#111118", padding: 12, borderRadius: 8, textAlign: "center" }}>
                <div style={{ fontSize: 22, fontWeight: 900, color: "#4ade80" }}>
                  {stats.games > 0 ? Math.round((stats.wins / stats.games) * 100) : 0}%
                </div>
                <div style={{ fontSize: 10, color: "#666", marginTop: 4 }}>WIN RATE</div>
              </div>
              <div style={{ background: "#111118", padding: 12, borderRadius: 8, textAlign: "center" }}>
                <div style={{ fontSize: 22, fontWeight: 900, color: "#60a5fa" }}>
                  {stats.games > 0 && stats.wins > 0 ? (stats.guesses.reduce((a, b) => a + b, 0) / stats.wins).toFixed(1) : "–"}
                </div>
                <div style={{ fontSize: 10, color: "#666", marginTop: 4 }}>AVG GUESSES</div>
              </div>
            </div>

            <div>
              <div style={{ fontSize: 12, fontWeight: 700, color: "#aaa", marginBottom: 8 }}>GUESS DISTRIBUTION</div>
              {[1, 2, 3, 4, 5, 6].map(i => {
                const count = stats.guesses[i - 1] || 0;
                const maxCount = Math.max(...stats.guesses, 1);
                const percent = maxCount > 0 ? (count / maxCount) * 100 : 0;
                return (
                  <div key={i} style={{ display: "flex", gap: 8, alignItems: "center", marginBottom: 6 }}>
                    <span style={{ fontSize: 12, fontWeight: 700, color: "#aaa", width: 20 }}>{i}</span>
                    <div style={{
                      flex: 1, height: 20, background: "#1a1a1a", borderRadius: 4, overflow: "hidden"
                    }}>
                      <div style={{
                        width: `${percent}%`, height: "100%",
                        background: i === 1 ? "#4ade80" : i <= 3 ? "#60a5fa" : "#fb923c",
                        transition: "width 0.3s"
                      }} />
                    </div>
                    <span style={{ fontSize: 12, fontWeight: 700, color: "#aaa", width: 20, textAlign: "right" }}>{count}</span>
                  </div>
                );
              })}
            </div>
          </div>
        </div>
      )}

      <div style={{
        marginTop: 48, textAlign: "center", color: "#444", fontSize: 12,
        letterSpacing: 2, fontWeight: 700
      }}>
        EVERY DAY A NEW GAME
      </div>
    </div>
  );
}
