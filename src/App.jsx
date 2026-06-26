import { useState, useMemo, useRef, useEffect } from "react";

const COUNTRIES = [
  { name: "Afghanistan", wiki: "Afghanistan", cap: [34.5281, 69.1723], locs: [["Band-e Amir National Park", 34.8167, 67.0167, "nature"], ["Kandahar", 31.6133, 65.7073, "former"], ["Mazar-i-Sharif", 36.7069, 67.1124, "city"], ["Herat", 34.3482, 62.2041, "city"], ["Band-e Amir National Park", 34.8167, 67.0167, "nature"]] },
  { name: "Albania", wiki: "Albania", cap: [41.3317, 19.8319], locs: [["Valbona Valley National Park", 41.8767, 20.1867, "nature"], ["Durrës", 41.3246, 19.4565, "former"], ["Gjirokastër", 40.0758, 20.1389, "unicode"], ["Berat", 40.7058, 19.9522, "unicode"], ["Shkodër", 42.0683, 19.5126, "city"], ["Valbona Valley National Park", 41.8767, 20.1867, "nature"]] },
  { name: "Algeria", wiki: "Algeria", cap: [36.7372, 3.0865], locs: [["Tassili n'Ajjer", 24.8, 9.5, "nature"], ["Oran", 35.6969, -0.6331, "city"], ["Constantine", 36.365, 6.6147, "city"], ["Timgad", 35.4869, 6.468, "unicode"], ["Tipasa", 36.59, 2.4478, "unicode"], ["Tassili n'Ajjer", 24.8, 9.5, "nature"]] },
  { name: "Andorra", wiki: "Andorra", cap: [42.5063, 1.5218], locs: [["Escaldes-Engordany", 42.5063, 1.5395, "city"]] },
  { name: "Angola", wiki: "Angola", cap: [-8.839, 13.2894], locs: [["Iona National Park", -17.05, 12.27, "nature"], ["Lubango", -14.9177, 13.492, "city"], ["Huambo", -12.7758, 15.7392, "city"], ["Lobito", -12.3647, 13.5459, "city"], ["Iona National Park", -17.05, 12.27, "nature"]] },
  { name: "Antigua and Barbuda", wiki: "Antigua_and_Barbuda", cap: [17.1274, -61.8468], locs: [] },
  { name: "Argentina", wiki: "Argentina", cap: [-34.6037, -58.3816], locs: [["Los Glaciares National Park", -49.8, -73.0, "nature"], ["Córdoba", -31.4201, -64.1888, "city"], ["Rosario", -32.9442, -60.6505, "city"], ["Mendoza", -32.8895, -68.8458, "city"], ["La Plata", -34.9215, -57.9545, "city"], ["Los Glaciares National Park", -49.8, -73.0, "nature"]] },
  { name: "Armenia", wiki: "Armenia", cap: [40.1872, 44.5152], locs: [["Khosrov Forest State Reserve", 39.75, 44.5, "nature"], ["Gyumri", 40.7942, 43.8453, "city"], ["Vanadzor", 40.8128, 44.4879, "city"], ["Khosrov Forest State Reserve", 39.75, 44.5, "nature"]] },
  { name: "Australia", wiki: "Australia", cap: [-35.2835, 149.1281], locs: [["Great Barrier Reef Marine Park", -18.2871, 147.6992, "nature"], ["Sydney", -33.8688, 151.2093, "city"], ["Melbourne", -37.8136, 144.9631, "city"], ["Brisbane", -27.4698, 153.0251, "city"], ["Perth", -31.9505, 115.8605, "city"], ["Great Barrier Reef Marine Park", -18.2871, 147.6992, "nature"]] },
  { name: "Austria", wiki: "Austria", cap: [48.2082, 16.3738], locs: [["Hohe Tauern National Park", 47.5, 12.5, "nature"], ["Graz", 47.0707, 15.4395, "city"], ["Innsbruck", 47.2692, 11.4041, "city"], ["Salzburg", 47.8095, 13.055, "unicode"], ["Hohe Tauern National Park", 47.5, 12.5, "nature"]] },
  { name: "Azerbaijan", wiki: "Azerbaijan", cap: [40.4093, 49.8671], locs: [["Gobustan National Park", 40.35, 49.5, "nature"], ["Ganja", 40.6828, 46.3606, "city"], ["Walled City of Baku", 40.3667, 49.8333, "unicode"], ["Gobustan National Park", 40.35, 49.5, "nature"]] },
  { name: "Bahamas", wiki: "The_Bahamas", cap: [25.048, -77.3554], locs: [["Exuma Cays Land and Sea Park", 24.5, -76.3, "nature"], ["Exuma Cays Land and Sea Park", 24.5, -76.3, "nature"]] },
  { name: "Bahrain", wiki: "Bahrain", cap: [26.2154, 50.5832], locs: [["Qal'at al-Bahrain", 26.2333, 50.5167, "unicode"]] },
  { name: "Bangladesh", wiki: "Bangladesh", cap: [23.8103, 90.4125], locs: [["Sundarbans National Park", 21.9, 89.2, "nature"], ["Chittagong", 22.3569, 91.7832, "city"], ["Sylhet", 24.8949, 91.8687, "city"], ["Rajshahi", 24.3745, 88.6042, "city"], ["Sundarbans National Park", 21.9, 89.2, "nature"]] },
  { name: "Barbados", wiki: "Barbados", cap: [13.0969, -59.6145], locs: [] },
  { name: "Belarus", wiki: "Belarus", cap: [53.9006, 27.559], locs: [["Belovezhskaya Pushcha", 52.45, 23.85, "nature"], ["Brest", 52.0976, 23.7341, "city"], ["Grodno", 53.6884, 23.8258, "city"], ["Mir Castle Complex", 53.4519, 26.4728, "unicode"], ["Belovezhskaya Pushcha", 52.45, 23.85, "nature"]] },
  { name: "Belgium", wiki: "Belgium", cap: [50.8503, 4.3517], locs: [["High Fens-Eifel", 50.5, 6.0, "nature"], ["Ghent", 51.0543, 3.7174, "city"], ["Antwerp", 51.2194, 4.4025, "city"], ["Bruges", 51.2093, 3.2247, "unicode"], ["High Fens-Eifel", 50.5, 6.0, "nature"]] },
  { name: "Benin", wiki: "Benin", cap: [6.3676, 2.4252], locs: [["W National Park", 11.5, 2.3, "nature"], ["Cotonou", 6.3654, 2.4183, "city"], ["Abomey", 7.1841, 1.9888, "unicode"], ["W National Park", 11.5, 2.3, "nature"]] },
  { name: "Bhutan", wiki: "Bhutan", cap: [27.4728, 89.639], locs: [["Jigme Dorji National Park", 27.9, 89.5, "nature"], ["Paro", 27.4287, 89.4164, "city"], ["Punakha", 27.5906, 89.8678, "former"], ["Jigme Dorji National Park", 27.9, 89.5, "nature"]] },
  { name: "Bolivia", wiki: "Bolivia", cap: [-16.5, -68.1501], locs: [["Madidi National Park", -14.2, -67.5, "nature"], ["Sucre", -19.0478, -65.2592, "former"], ["Santa Cruz", -17.8146, -63.1561, "city"], ["Cochabamba", -17.3895, -66.1577, "city"], ["Madidi National Park", -14.2, -67.5, "nature"]] },
  { name: "Bosnia and Herzegovina", wiki: "Bosnia_and_Herzegovina", cap: [43.8486, 18.3564], locs: [["Sutjeska National Park", 43.6, 19.1, "nature"], ["Mostar", 43.3438, 17.8078, "unicode"], ["Banja Luka", 44.7722, 17.191, "city"], ["Sutjeska National Park", 43.6, 19.1, "nature"]] },
  { name: "Botswana", wiki: "Botswana", cap: [-24.6282, 25.9231], locs: [["Okavango Delta", -19.2825, 22.8575, "nature"], ["Francistown", -21.1658, 27.5103, "city"], ["Okavango Delta", -19.2825, 22.8575, "nature"]] },
  { name: "Brazil", wiki: "Brazil", cap: [-15.7795, -47.9297], locs: [["Amazon Rainforest", -3.0, -60.0, "nature"], ["Rio de Janeiro", -22.9068, -43.1729, "former"], ["São Paulo", -23.5558, -46.6396, "city"], ["Salvador", -12.9714, -38.5014, "city"], ["Belo Horizonte", -19.9167, -43.9345, "city"], ["Amazon Rainforest", -3.0, -60.0, "nature"]] },
  { name: "Brunei", wiki: "Brunei", cap: [4.9031, 114.9398], locs: [["Temburong National Park", 4.55, 115.15, "nature"], ["Temburong National Park", 4.55, 115.15, "nature"]] },
  { name: "Bulgaria", wiki: "Bulgaria", cap: [42.6977, 23.3219], locs: [["Rila National Park", 42.2, 23.6, "nature"], ["Plovdiv", 42.1354, 24.7453, "former"], ["Varna", 43.2141, 27.9147, "city"], ["Burgas", 42.5047, 27.4632, "city"], ["Rila National Park", 42.2, 23.6, "nature"]] },
  { name: "Burkina Faso", wiki: "Burkina_Faso", cap: [12.3714, -1.5197], locs: [["W National Park", 11.5, 2.3, "nature"], ["Bobo-Dioulasso", 11.1771, -4.2979, "city"], ["W National Park", 11.5, 2.3, "nature"]] },
  { name: "Burundi", wiki: "Burundi", cap: [-3.4271, 29.9249], locs: [["Rusizi National Park", -2.5, 29.25, "nature"], ["Bujumbura", -3.3818, 29.3622, "former"], ["Rusizi National Park", -2.5, 29.25, "nature"]] },
  { name: "Cabo Verde", wiki: "Cape_Verde", cap: [14.933, -23.5133], locs: [["Fogo National Park", 15.35, -24.35, "nature"], ["Cidade Velha", 14.9167, -23.6, "unicode"], ["Fogo National Park", 15.35, -24.35, "nature"]] },
  { name: "Cambodia", wiki: "Cambodia", cap: [11.5625, 104.916], locs: [["Angkor National Park", 13.4125, 103.867, "nature"], ["Siem Reap", 13.3671, 103.8448, "city"], ["Battambang", 13.0957, 103.2022, "city"], ["Angkor", 13.4125, 103.867, "unicode"], ["Angkor National Park", 13.4125, 103.867, "nature"]] },
  { name: "Cameroon", wiki: "Cameroon", cap: [3.8667, 11.5167], locs: [["Mount Cameroon", 4.2, 9.17, "nature"], ["Douala", 4.0511, 9.7679, "city"], ["Mount Cameroon", 4.2, 9.17, "nature"]] },
  { name: "Canada", wiki: "Canada", cap: [45.4215, -75.6972], locs: [["Banff National Park", 51.5, -115.5, "nature"], ["Toronto", 43.6532, -79.3832, "city"], ["Montreal", 45.5017, -73.5673, "city"], ["Vancouver", 49.2827, -123.1207, "city"], ["Calgary", 51.0447, -114.0719, "city"], ["Banff National Park", 51.5, -115.5, "nature"]] },
  { name: "Central African Republic", wiki: "Central_African_Republic", cap: [4.3612, 18.555], locs: [["Dzanga-Sangha", 2.25, 16.3, "nature"], ["Dzanga-Sangha", 2.25, 16.3, "nature"]] },
  { name: "Chad", wiki: "Chad", cap: [12.1048, 15.0444], locs: [["Zakouma National Park", 10.62, 19.8, "nature"], ["Moundou", 8.5667, 16.0833, "city"], ["Zakouma National Park", 10.62, 19.8, "nature"]] },
  { name: "Chile", wiki: "Chile", cap: [-33.4489, -70.6693], locs: [["Torres del Paine", -51.0, -72.5, "nature"], ["Valparaíso", -33.0472, -71.6127, "city"], ["Concepción", -36.8201, -73.0444, "city"], ["Valdivia", -39.8142, -73.2456, "city"], ["Torres del Paine", -51.0, -72.5, "nature"]] },
  { name: "China", wiki: "China", cap: [39.9042, 116.4074], locs: [["Zhangjiajie National Forest Park", 29.3, 110.5, "nature"], ["Shanghai", 31.2304, 121.4737, "city"], ["Guangzhou", 23.1291, 113.2644, "city"], ["Shenzhen", 22.5431, 114.0579, "city"], ["Chongqing", 29.4316, 106.9123, "city"], ["Zhangjiajie National Forest Park", 29.3, 110.5, "nature"]] },
  { name: "Colombia", wiki: "Colombia", cap: [4.711, -74.0721], locs: [["Tayrona National Park", 11.3, -74.6, "nature"], ["Medellín", 6.2442, -75.5812, "city"], ["Cali", 3.4516, -76.532, "city"], ["Cartagena", 10.391, -75.4794, "unicode"], ["Barranquilla", 10.9639, -74.7964, "city"], ["Tayrona National Park", 11.3, -74.6, "nature"]] },
  { name: "Comoros", wiki: "Comoros", cap: [-11.7022, 43.2551], locs: [] },
  { name: "Congo (DRC)", wiki: "Democratic_Republic_of_the_Congo", cap: [-4.3276, 15.3136], locs: [["Virunga National Park", -1.5, 29.2, "nature"], ["Lubumbashi", -11.66, 27.4794, "city"], ["Virunga National Park", -1.5, 29.2, "nature"]] },
  { name: "Congo (Republic)", wiki: "Republic_of_the_Congo", cap: [-4.2661, 15.2832], locs: [["Odzala-Kokoua National Park", 1.0, 16.2, "nature"], ["Pointe-Noire", -4.7692, 11.8664, "city"], ["Odzala-Kokoua National Park", 1.0, 16.2, "nature"]] },
  { name: "Costa Rica", wiki: "Costa_Rica", cap: [9.9281, -84.0907], locs: [["Manuel Antonio National Park", 9.4, -84.4, "nature"], ["Manuel Antonio National Park", 9.4, -84.4, "nature"]] },
  { name: "Croatia", wiki: "Croatia", cap: [45.815, 15.9819], locs: [["Plitvice Lakes National Park", 46.75, 15.6, "nature"], ["Split", 43.5081, 16.4402, "city"], ["Rijeka", 45.3271, 14.4422, "city"], ["Dubrovnik", 42.6507, 18.0944, "unicode"], ["Trogir", 43.5158, 16.2511, "unicode"], ["Plitvice Lakes National Park", 46.75, 15.6, "nature"]] },
  { name: "Cuba", wiki: "Cuba", cap: [23.1136, -82.3666], locs: [["Viñales Valley", 22.6, -83.7, "nature"], ["Santiago de Cuba", 20.0243, -75.8219, "city"], ["Camagüey", 21.3803, -77.9169, "city"], ["Trinidad", 21.8028, -79.9841, "unicode"], ["Viñales Valley", 22.6, -83.7, "nature"]] },
  { name: "Cyprus", wiki: "Cyprus", cap: [35.1856, 33.3823], locs: [["Troodos Mountains", 34.95, 33.05, "nature"], ["Limassol", 34.6786, 33.0413, "city"], ["Larnaca", 34.9127, 33.6333, "city"], ["Troodos Mountains", 34.95, 33.05, "nature"]] },
  { name: "Czech Republic", wiki: "Czech_Republic", cap: [50.0755, 14.4378], locs: [["Bohemian Switzerland", 50.85, 14.35, "nature"], ["Brno", 49.1951, 16.6068, "city"], ["Ostrava", 49.8209, 18.2625, "city"], ["Český Krumlov", 48.8127, 14.3175, "unicode"], ["Bohemian Switzerland", 50.85, 14.35, "nature"]] },
  { name: "Côte d'Ivoire", wiki: "Ivory_Coast", cap: [6.8276, -5.2893], locs: [["Taï National Park", 5.5, -7.3, "nature"], ["Abidjan", 5.36, -4.0083, "former"], ["Taï National Park", 5.5, -7.3, "nature"]] },
  { name: "Denmark", wiki: "Denmark", cap: [55.6761, 12.5683], locs: [["Møn Cliffs", 54.95, 12.45, "nature"], ["Aarhus", 56.1629, 10.2039, "city"], ["Odense", 55.4038, 10.3875, "city"], ["Møn Cliffs", 54.95, 12.45, "nature"]] },
  { name: "Dominica", wiki: "Dominica", cap: [15.3017, -61.3881], locs: [["Morne Trois Pitons National Park", 15.4, -61.35, "nature"], ["Morne Trois Pitons National Park", 15.4, -61.35, "nature"]] },
  { name: "Dominican Republic", wiki: "Dominican_Republic", cap: [18.4861, -69.9312], locs: [["Los Haitises National Park", 19.2, -69.4, "nature"], ["Santiago de los Caballeros", 19.4517, -70.697, "city"], ["Los Haitises National Park", 19.2, -69.4, "nature"]] },
  { name: "Ecuador", wiki: "Ecuador", cap: [-0.2298, -78.5249], locs: [["Galápagos Islands", -0.45, -90.2, "nature"], ["Guayaquil", -2.1962, -79.8862, "city"], ["Cuenca", -2.9001, -79.0059, "unicode"], ["Galápagos Islands", -0.45, -90.2, "nature"]] },
  { name: "Egypt", wiki: "Egypt", cap: [30.0444, 31.2357], locs: [["White Desert National Park", 27.75, 28.75, "nature"], ["Alexandria", 31.1975, 29.8925, "city"], ["Giza", 30.0131, 31.183, "city"], ["Memphis", 29.8442, 31.2527, "former"], ["White Desert National Park", 27.75, 28.75, "nature"]] },
  { name: "El Salvador", wiki: "El_Salvador", cap: [13.6929, -89.2182], locs: [["Los Volcanes National Park", 13.8, -89.6, "nature"], ["Joya de Cerén", 13.7169, -89.5728, "unicode"], ["Los Volcanes National Park", 13.8, -89.6, "nature"]] },
  { name: "Equatorial Guinea", wiki: "Equatorial_Guinea", cap: [3.75, 8.7833], locs: [["Monte Alen National Park", 1.95, 10.35, "nature"], ["Bata", 1.8639, 9.7661, "city"], ["Monte Alen National Park", 1.95, 10.35, "nature"]] },
  { name: "Eritrea", wiki: "Eritrea", cap: [15.3229, 38.9251], locs: [] },
  { name: "Estonia", wiki: "Estonia", cap: [59.437, 24.7536], locs: [["Lahemaa National Park", 59.5, 25.5, "nature"], ["Tartu", 58.378, 26.729, "city"], ["Narva", 59.3778, 28.1945, "city"], ["Lahemaa National Park", 59.5, 25.5, "nature"]] },
  { name: "Eswatini", wiki: "Eswatini", cap: [-26.3054, 31.1367], locs: [["Hluhluwe-iMfolozi Park", -28.05, 32.0, "nature"], ["Lobamba", -26.4667, 31.2, "former"], ["Hluhluwe-iMfolozi Park", -28.05, 32.0, "nature"]] },
  { name: "Ethiopia", wiki: "Ethiopia", cap: [8.9806, 38.7578], locs: [["Simien Mountains National Park", 13.2, 38.3, "nature"], ["Dire Dawa", 9.5499, 41.8606, "city"], ["Aksum", 14.131, 38.7256, "unicode"], ["Lalibela", 12.0319, 39.0472, "unicode"], ["Simien Mountains National Park", 13.2, 38.3, "nature"]] },
  { name: "Fiji", wiki: "Fiji", cap: [-18.1416, 178.4419], locs: [["Bouma National Heritage Park", -17.75, 178.1, "nature"], ["Nadi", -17.7765, 177.4356, "city"], ["Bouma National Heritage Park", -17.75, 178.1, "nature"]] },
  { name: "Finland", wiki: "Finland", cap: [60.1699, 24.9384], locs: [["Nuuksio National Park", 60.3, 24.9, "nature"], ["Espoo", 60.2055, 24.6559, "city"], ["Tampere", 61.4978, 23.761, "city"], ["Turku", 60.4518, 22.2666, "former"], ["Nuuksio National Park", 60.3, 24.9, "nature"]] },
  { name: "France", wiki: "France", cap: [48.8566, 2.3522], locs: [["Mont Blanc", 45.8325, 6.8652, "nature"], ["Marseille", 43.2965, 5.3698, "city"], ["Lyon", 45.764, 4.8357, "city"], ["Toulouse", 43.6047, 1.4442, "city"], ["Nice", 43.7102, 7.262, "city"], ["Mont Blanc", 45.8325, 6.8652, "nature"]] },
  { name: "Gabon", wiki: "Gabon", cap: [0.3901, 9.45], locs: [["Loango National Park", -2.4, 9.3, "nature"], ["Port-Gentil", -0.7193, 8.7815, "city"], ["Loango National Park", -2.4, 9.3, "nature"]] },
  { name: "Gambia", wiki: "The_Gambia", cap: [13.4531, -16.5775], locs: [["Niokolo-Koba National Park", 13.3, -12.3, "nature"], ["Niokolo-Koba National Park", 13.3, -12.3, "nature"]] },
  { name: "Georgia", wiki: "Georgia_(country)", cap: [41.6938, 44.8015], locs: [["Kazbegi National Park", 42.65, 44.6, "nature"], ["Kutaisi", 42.2679, 42.7057, "former"], ["Batumi", 41.6168, 41.6367, "city"], ["Kazbegi National Park", 42.65, 44.6, "nature"]] },
  { name: "Germany", wiki: "Germany", cap: [52.52, 13.405], locs: [["Harz National Park", 51.65, 10.45, "nature"], ["Munich", 48.1351, 11.582, "city"], ["Hamburg", 53.5753, 10.0153, "city"], ["Cologne", 50.9413, 6.9583, "city"], ["Frankfurt", 50.1109, 8.6821, "city"], ["Harz National Park", 51.65, 10.45, "nature"]] },
  { name: "Ghana", wiki: "Ghana", cap: [5.56, -0.2057], locs: [["Kakum National Park", 5.3, -1.05, "nature"], ["Kumasi", 6.6884, -1.6244, "city"], ["Kakum National Park", 5.3, -1.05, "nature"]] },
  { name: "Greece", wiki: "Greece", cap: [37.9838, 23.7275], locs: [["Mount Olympus National Park", 39.86, 22.35, "nature"], ["Thessaloniki", 40.6401, 22.9444, "city"], ["Patras", 38.2466, 21.7346, "city"], ["Delphi", 38.4824, 22.5011, "unicode"], ["Mount Olympus National Park", 39.86, 22.35, "nature"]] },
  { name: "Grenada", wiki: "Grenada", cap: [12.0561, -61.7488], locs: [["Grand Étang National Park", 12.05, -61.7, "nature"], ["Grand Étang National Park", 12.05, -61.7, "nature"]] },
  { name: "Guinea", wiki: "Guinea", cap: [9.6412, -13.5784], locs: [["Mont Nimba", 7.6, -8.4, "nature"], ["Mont Nimba", 7.6, -8.4, "nature"]] },
  { name: "Guinea-Bissau", wiki: "Guinea-Bissau", cap: [11.8636, -15.5977], locs: [["Bijagós Archipelago", 10.5, -15.5, "nature"], ["Bijagós Archipelago", 10.5, -15.5, "nature"]] },
  { name: "Guyana", wiki: "Guyana", cap: [6.8013, -58.1553], locs: [["Kaieteur Falls National Park", 5.19, -59.48, "nature"], ["Kaieteur Falls National Park", 5.19, -59.48, "nature"]] },
  { name: "Haiti", wiki: "Haiti", cap: [18.5944, -72.3074], locs: [["Pic la Selle", 18.3, -72.2, "nature"], ["Pic la Selle", 18.3, -72.2, "nature"]] },
  { name: "Honduras", wiki: "Honduras", cap: [14.0723, -87.2062], locs: [["Roatán Bay Islands", 16.3, -86.5, "nature"], ["San Pedro Sula", 15.5, -88.0333, "city"], ["Roatán Bay Islands", 16.3, -86.5, "nature"]] },
  { name: "Hungary", wiki: "Hungary", cap: [47.4979, 19.0402], locs: [["Aggtelek National Park", 48.5, 20.5, "nature"], ["Debrecen", 47.5316, 21.6273, "city"], ["Szeged", 46.253, 20.1414, "city"], ["Aggtelek National Park", 48.5, 20.5, "nature"]] },
  { name: "Iceland", wiki: "Iceland", cap: [64.1466, -21.9426], locs: [["Vatnajökull National Park", 64.0, -16.8, "nature"], ["Akureyri", 65.6885, -18.1262, "city"], ["Vatnajökull National Park", 64.0, -16.8, "nature"]] },
  { name: "India", wiki: "India", cap: [28.6139, 77.209], locs: [["Jim Corbett National Park", 29.5, 79.15, "nature"], ["Mumbai", 19.076, 72.8777, "city"], ["Bangalore", 12.9716, 77.5946, "city"], ["Kolkata", 22.5726, 88.3639, "city"], ["Chennai", 13.0827, 80.2707, "city"], ["Jim Corbett National Park", 29.5, 79.15, "nature"]] },
  { name: "Indonesia", wiki: "Indonesia", cap: [-1.0, 117.0], locs: [["Komodo National Park", -8.5, 119.6, "nature"], ["Jakarta", -6.2088, 106.8456, "former"], ["Surabaya", -7.2575, 112.7521, "city"], ["Bandung", -6.9147, 107.6098, "city"], ["Komodo National Park", -8.5, 119.6, "nature"]] },
  { name: "Iran", wiki: "Iran", cap: [35.6892, 51.389], locs: [["Mount Damavand", 35.96, 51.43, "nature"], ["Mashhad", 36.2971, 59.6062, "city"], ["Isfahan", 32.6539, 51.666, "city"], ["Shiraz", 29.5918, 52.5836, "city"], ["Mount Damavand", 35.96, 51.43, "nature"]] },
  { name: "Iraq", wiki: "Iraq", cap: [33.3152, 44.3661], locs: [["Mesopotamian Marshes", 30.8, 47.2, "nature"], ["Basra", 30.5085, 47.7804, "city"], ["Mosul", 36.335, 43.1189, "city"], ["Mesopotamian Marshes", 30.8, 47.2, "nature"]] },
  { name: "Ireland", wiki: "Republic_of_Ireland", cap: [53.3498, -6.2603], locs: [["Cliffs of Moher", 52.72, -9.93, "nature"], ["Cork", 51.8985, -8.4756, "city"], ["Galway", 53.2707, -9.0568, "city"], ["Cliffs of Moher", 52.72, -9.93, "nature"]] },
  { name: "Israel", wiki: "Israel", cap: [31.7683, 35.2137], locs: [["Dead Sea", 31.5, 35.5, "nature"], ["Tel Aviv", 32.0853, 34.7818, "city"], ["Haifa", 32.8193, 34.9897, "city"], ["Dead Sea", 31.5, 35.5, "nature"]] },
  { name: "Italy", wiki: "Italy", cap: [41.9028, 12.4964], locs: [["Cinque Terre", 43.13, 12.43, "nature"], ["Milan", 45.4642, 9.19, "city"], ["Naples", 40.8522, 14.2681, "city"], ["Florence", 43.7696, 11.2558, "unicode"], ["Venice", 45.4408, 12.3155, "unicode"], ["Cinque Terre", 43.13, 12.43, "nature"]] },
  { name: "Jamaica", wiki: "Jamaica", cap: [17.9714, -76.7937], locs: [["Dunn's River Falls", 18.3, -77.25, "nature"], ["Dunn's River Falls", 18.3, -77.25, "nature"]] },
  { name: "Japan", wiki: "Japan", cap: [35.6762, 139.6503], locs: [["Mount Fuji", 35.3622, 138.728, "nature"], ["Osaka", 34.6937, 135.5023, "city"], ["Yokohama", 35.4437, 139.638, "city"], ["Kyoto", 35.0116, 135.7681, "former"], ["Mount Fuji", 35.3622, 138.728, "nature"]] },
  { name: "Jordan", wiki: "Jordan", cap: [31.9566, 35.9456], locs: [["Wadi Rum Protected Area", 29.85, 35.45, "nature"], ["Zarqa", 32.0728, 36.088, "city"], ["Petra", 30.3285, 35.4444, "unicode"], ["Wadi Rum Protected Area", 29.85, 35.45, "nature"]] },
  { name: "Kazakhstan", wiki: "Kazakhstan", cap: [51.1801, 71.446], locs: [["Charyn Canyon National Nature Park", 43.3, 78.6, "nature"], ["Almaty", 43.222, 76.8512, "former"], ["Karaganda", 49.8047, 72.8241, "city"], ["Charyn Canyon National Nature Park", 43.3, 78.6, "nature"]] },
  { name: "Kenya", wiki: "Kenya", cap: [-1.2921, 36.8219], locs: [["Maasai Mara National Reserve", -1.5, 34.85, "nature"], ["Mombasa", -4.0435, 39.6682, "city"], ["Kisumu", -0.1022, 34.7617, "city"], ["Maasai Mara National Reserve", -1.5, 34.85, "nature"]] },
  { name: "Kiribati", wiki: "Kiribati", cap: [1.329, 172.979], locs: [] },
  { name: "Kyrgyzstan", wiki: "Kyrgyzstan", cap: [42.8746, 74.5698], locs: [["Issyk-Kul Lake", 42.5, 77.5, "nature"], ["Osh", 40.5283, 72.7985, "city"], ["Issyk-Kul Lake", 42.5, 77.5, "nature"]] },
  { name: "Laos", wiki: "Laos", cap: [17.9757, 102.6331], locs: [["Kuang Si Falls", 19.88, 102.2, "nature"], ["Luang Prabang", 19.8833, 102.1328, "unicode"], ["Kuang Si Falls", 19.88, 102.2, "nature"]] },
  { name: "Latvia", wiki: "Latvia", cap: [56.9496, 24.1052], locs: [["Gauja National Park", 57.3, 24.8, "nature"], ["Daugavpils", 55.8747, 26.5361, "city"], ["Gauja National Park", 57.3, 24.8, "nature"]] },
  { name: "Lebanon", wiki: "Lebanon", cap: [33.8886, 35.4955], locs: [["Cedars of God", 34.25, 35.9, "nature"], ["Tripoli", 34.4386, 35.845, "city"], ["Byblos", 34.1236, 35.6481, "unicode"], ["Cedars of God", 34.25, 35.9, "nature"]] },
  { name: "Lesotho", wiki: "Lesotho", cap: [-29.3167, 27.4833], locs: [["Sehlabathebe National Park", -30.25, 29.8, "nature"], ["Sehlabathebe National Park", -30.25, 29.8, "nature"]] },
  { name: "Liberia", wiki: "Liberia", cap: [6.3005, -10.7969], locs: [["Sapo National Park", 4.75, -8.0, "nature"], ["Sapo National Park", 4.75, -8.0, "nature"]] },
  { name: "Libya", wiki: "Libya", cap: [32.9006, 13.1862], locs: [["Tadrart Acacus", 24.8, 8.7, "nature"], ["Benghazi", 32.1154, 20.0686, "city"], ["Tadrart Acacus", 24.8, 8.7, "nature"]] },
  { name: "Liechtenstein", wiki: "Liechtenstein", cap: [47.141, 9.5215], locs: [["Vaduz Castle", 47.14, 9.52, "nature"], ["Vaduz Castle", 47.14, 9.52, "nature"]] },
  { name: "Lithuania", wiki: "Lithuania", cap: [54.6872, 25.2797], locs: [["Curonian Spit", 55.2, 21.0, "nature"], ["Kaunas", 54.8985, 23.9036, "city"], ["Klaipeda", 55.7206, 21.1449, "city"], ["Curonian Spit", 55.2, 21.0, "nature"]] },
  { name: "Madagascar", wiki: "Madagascar", cap: [-18.9137, 47.5361], locs: [["Avenue of the Baobabs", -19.96, 44.39, "nature"], ["Toamasina", -18.1492, 49.4023, "city"], ["Avenue of the Baobabs", -19.96, 44.39, "nature"]] },
  { name: "Malawi", wiki: "Malawi", cap: [-13.9669, 33.7873], locs: [["Lake Malawi National Park", -14.5, 34.9, "nature"], ["Blantyre", -15.7861, 35.0058, "city"], ["Lake Malawi National Park", -14.5, 34.9, "nature"]] },
  { name: "Maldives", wiki: "Maldives", cap: [4.1755, 73.5093], locs: [] },
  { name: "Mali", wiki: "Mali", cap: [12.6392, -8.0029], locs: [["Gao Region", 16.27, -0.04, "nature"], ["Timbuktu", 16.7735, -3.0074, "unicode"], ["Gao Region", 16.27, -0.04, "nature"]] },
  { name: "Malta", wiki: "Malta", cap: [35.9042, 14.5189], locs: [] },
  { name: "Marshall Islands", wiki: "Marshall_Islands", cap: [7.1167, 171.3667], locs: [] },
  { name: "Mauritania", wiki: "Mauritania", cap: [18.0735, -15.9582], locs: [["Banc d'Arguin National Park", 20.9, -16.2, "nature"], ["Banc d'Arguin National Park", 20.9, -16.2, "nature"]] },
  { name: "Mauritius", wiki: "Mauritius", cap: [-20.1608, 57.4989], locs: [["Black River Gorges National Park", -20.35, 57.4, "nature"], ["Black River Gorges National Park", -20.35, 57.4, "nature"]] },
  { name: "Micronesia", wiki: "Federated_States_of_Micronesia", cap: [6.9248, 158.1618], locs: [] },
  { name: "Moldova", wiki: "Moldova", cap: [47.0105, 28.8638], locs: [["Orheiul Vechi", 47.4, 28.4, "nature"], ["Bălți", 47.7617, 27.9297, "city"], ["Orheiul Vechi", 47.4, 28.4, "nature"]] },
  { name: "Monaco", wiki: "Monaco", cap: [43.7384, 7.4246], locs: [] },
  { name: "Mongolia", wiki: "Mongolia", cap: [47.8864, 106.9057], locs: [["Gobi Desert", 43.5, 104.0, "nature"], ["Darkhan", 49.5, 105.8167, "city"], ["Gobi Desert", 43.5, 104.0, "nature"]] },
  { name: "Montenegro", wiki: "Montenegro", cap: [42.4304, 19.2594], locs: [["Durmitor National Park", 43.2, 19.05, "nature"], ["Cetinje", 42.3931, 18.9225, "former"], ["Durmitor National Park", 43.2, 19.05, "nature"]] },
  { name: "Morocco", wiki: "Morocco", cap: [33.9716, -6.8498], locs: [["Toubkal National Park", 31.06, -8.0, "nature"], ["Casablanca", 33.5731, -7.5898, "city"], ["Fez", 34.0181, -5.0078, "former"], ["Marrakesh", 31.6295, -7.9811, "unicode"], ["Toubkal National Park", 31.06, -8.0, "nature"]] },
  { name: "Mozambique", wiki: "Mozambique", cap: [-25.9692, 32.5732], locs: [["Gorongosa National Park", -18.7, 34.4, "nature"], ["Beira", -19.8436, 34.8389, "city"], ["Gorongosa National Park", -18.7, 34.4, "nature"]] },
  { name: "Myanmar", wiki: "Myanmar", cap: [19.7633, 96.0785], locs: [["Bagan Archaeological Zone", 21.17, 94.86, "nature"], ["Yangon", 16.8661, 96.1951, "former"], ["Mandalay", 21.9162, 96.0891, "city"], ["Bagan Archaeological Zone", 21.17, 94.86, "nature"]] },
  { name: "Namibia", wiki: "Namibia", cap: [-22.5597, 17.0832], locs: [["Namib Desert", -24.5, 15.5, "nature"], ["Walvis Bay", -22.9575, 14.5053, "city"], ["Namib Desert", -24.5, 15.5, "nature"]] },
  { name: "Nauru", wiki: "Nauru", cap: [-0.5477, 166.9209], locs: [] },
  { name: "Nepal", wiki: "Nepal", cap: [27.7172, 85.324], locs: [["Sagarmatha National Park", 28.0, 86.9, "nature"], ["Pokhara", 28.2096, 83.9856, "city"], ["Sagarmatha National Park", 28.0, 86.9, "nature"]] },
  { name: "Netherlands", wiki: "Netherlands", cap: [52.3676, 4.9041], locs: [["De Hoge Veluwe National Park", 52.25, 5.85, "nature"], ["Rotterdam", 51.9225, 4.4792, "city"], ["The Hague", 52.0705, 4.3007, "city"], ["De Hoge Veluwe National Park", 52.25, 5.85, "nature"]] },
  { name: "New Zealand", wiki: "New_Zealand", cap: [-41.2865, 174.7762], locs: [["Milford Sound", -44.67, -168.0, "nature"], ["Auckland", -36.8485, 174.7633, "city"], ["Christchurch", -43.5321, 172.6362, "city"], ["Milford Sound", -44.67, -168.0, "nature"]] },
  { name: "Nicaragua", wiki: "Nicaragua", cap: [12.1364, -86.2514], locs: [["Lake Nicaragua", 11.5, -85.3, "nature"], ["León", 12.4359, -86.8782, "former"], ["Lake Nicaragua", 11.5, -85.3, "nature"]] },
  { name: "Niger", wiki: "Niger", cap: [13.5137, 2.1098], locs: [["W National Park", 2.3, 2.3, "nature"], ["W National Park", 2.3, 2.3, "nature"]] },
  { name: "Nigeria", wiki: "Nigeria", cap: [9.0579, 7.4951], locs: [["Cross-Sanaga-Bioko Coastal Forests", 4.3, 9.25, "nature"], ["Lagos", 6.5244, 3.3792, "former"], ["Ibadan", 7.3775, 3.947, "city"], ["Kano", 12.0022, 8.592, "city"], ["Cross-Sanaga-Bioko Coastal Forests", 4.3, 9.25, "nature"]] },
  { name: "North Korea", wiki: "North_Korea", cap: [39.0194, 125.7381], locs: [["Mount Paektu", 41.99, 128.06, "nature"], ["Mount Paektu", 41.99, 128.06, "nature"]] },
  { name: "North Macedonia", wiki: "North_Macedonia", cap: [41.9973, 21.428], locs: [["Galicica National Park", 41.1, 20.9, "nature"], ["Bitola", 41.0113, 21.3245, "city"], ["Ohrid", 41.1231, 20.8016, "unicode"], ["Galicica National Park", 41.1, 20.9, "nature"]] },
  { name: "Norway", wiki: "Norway", cap: [59.9139, 10.7522], locs: [["Geirangerfjord", 62.1, 7.2, "nature"], ["Bergen", 60.3913, 5.3221, "city"], ["Trondheim", 63.4269, 10.3952, "city"], ["Geirangerfjord", 62.1, 7.2, "nature"]] },
  { name: "Oman", wiki: "Oman", cap: [23.588, 58.3829], locs: [["Musandam Peninsula", 26.2, 56.2, "nature"], ["Salalah", 17.0151, 54.0924, "city"], ["Musandam Peninsula", 26.2, 56.2, "nature"]] },
  { name: "Pakistan", wiki: "Pakistan", cap: [33.6844, 73.0479], locs: [["Hunza Valley", 36.85, 74.95, "nature"], ["Karachi", 24.8607, 67.0011, "former"], ["Lahore", 31.5204, 74.3587, "city"], ["Multan", 30.1575, 71.4454, "city"], ["Hunza Valley", 36.85, 74.95, "nature"]] },
  { name: "Palau", wiki: "Palau", cap: [7.5149, 134.5825], locs: [["Palau National Marine Sanctuary", 7.3, 134.5, "nature"], ["Palau National Marine Sanctuary", 7.3, 134.5, "nature"]] },
  { name: "Papua New Guinea", wiki: "Papua_New_Guinea", cap: [-9.4438, 147.1803], locs: [["Kokoda Track", -8.8, 147.7, "nature"], ["Kokoda Track", -8.8, 147.7, "nature"]] },
  { name: "Paraguay", wiki: "Paraguay", cap: [-25.2867, -57.647], locs: [["Iguazú Falls", -25.6, -54.4, "nature"], ["Iguazú Falls", -25.6, -54.4, "nature"]] },
  { name: "Peru", wiki: "Peru", cap: [-12.0464, -77.0428], locs: [["Machu Picchu", -13.1631, -72.545, "nature"], ["Arequipa", -16.409, -71.5375, "city"], ["Cusco", -13.5319, -71.9675, "former"], ["Machu Picchu", -13.1631, -72.545, "unicode"], ["Machu Picchu", -13.1631, -72.545, "nature"]] },
  { name: "Poland", wiki: "Poland", cap: [52.2297, 21.0122], locs: [["Białowieża Forest", 52.7, 24.2, "nature"], ["Kraków", 50.0647, 19.945, "city"], ["Wrocław", 51.1079, 17.0385, "city"], ["Gdańsk", 54.352, 18.6466, "city"], ["Białowieża Forest", 52.7, 24.2, "nature"]] },
  { name: "Portugal", wiki: "Portugal", cap: [38.7223, -9.1393], locs: [["Douro Valley", 41.2, -7.5, "nature"], ["Porto", 41.1579, -8.6291, "city"], ["Covilhã", 40.2835, -7.5006, "city"], ["Douro Valley", 41.2, -7.5, "nature"]] },
  { name: "Qatar", wiki: "Qatar", cap: [25.2854, 51.531], locs: [] },
  { name: "Romania", wiki: "Romania", cap: [44.4268, 26.1025], locs: [["Carpathian Mountains", 45.5, 24.5, "nature"], ["Cluj-Napoca", 46.7712, 23.6236, "city"], ["Timișoara", 45.7489, 21.2087, "city"], ["Carpathian Mountains", 45.5, 24.5, "nature"]] },
  { name: "Russia", wiki: "Russia", cap: [55.7558, 37.6173], locs: [["Lake Baikal", 55.0, 104.0, "nature"], ["Saint Petersburg", 59.9343, 30.3351, "former"], ["Novosibirsk", 55.0415, 82.9346, "city"], ["Yekaterinburg", 56.8389, 60.6057, "city"], ["Lake Baikal", 55.0, 104.0, "nature"]] },
  { name: "Rwanda", wiki: "Rwanda", cap: [-1.9403, 29.8739], locs: [["Volcanoes National Park", -1.5, 29.6, "nature"], ["Volcanoes National Park", -1.5, 29.6, "nature"]] },
  { name: "Saint Kitts and Nevis", wiki: "Saint_Kitts_and_Nevis", cap: [17.3026, -62.7177], locs: [] },
  { name: "Saint Lucia", wiki: "Saint_Lucia", cap: [14.0101, -60.9875], locs: [] },
  { name: "Saint Vincent and the Grenadines", wiki: "Saint_Vincent_and_the_Grenadines", cap: [13.16, -61.2248], locs: [] },
  { name: "Samoa", wiki: "Samoa", cap: [-13.8506, -171.7513], locs: [["Upolu Crater Lake", -13.8, -171.7, "nature"], ["Upolu Crater Lake", -13.8, -171.7, "nature"]] },
  { name: "San Marino", wiki: "San_Marino", cap: [43.9424, 12.4578], locs: [] },
  { name: "Saudi Arabia", wiki: "Saudi_Arabia", cap: [24.6877, 46.7219], locs: [["Asir Mountains", 18.0, 42.5, "nature"], ["Mecca", 21.3891, 39.8579, "former"], ["Jeddah", 21.2854, 39.2376, "city"], ["Asir Mountains", 18.0, 42.5, "nature"]] },
  { name: "Senegal", wiki: "Senegal", cap: [14.7167, -17.4677], locs: [["Djoudj National Bird Sanctuary", 16.25, -15.45, "nature"], ["Thiès", 14.7949, -16.9239, "city"], ["Djoudj National Bird Sanctuary", 16.25, -15.45, "nature"]] },
  { name: "Serbia", wiki: "Serbia", cap: [44.8176, 20.4633], locs: [["Tara National Park", 43.7, 19.6, "nature"], ["Novi Sad", 45.2671, 19.8335, "city"], ["Niš", 43.3209, 21.8863, "city"], ["Tara National Park", 43.7, 19.6, "nature"]] },
  { name: "Seychelles", wiki: "Seychelles", cap: [-4.6191, 55.4513], locs: [["Vallée de Mai Nature Reserve", -4.33, 55.48, "nature"], ["Vallée de Mai Nature Reserve", -4.33, 55.48, "nature"]] },
  { name: "Sierra Leone", wiki: "Sierra_Leone", cap: [8.4657, -13.2317], locs: [["Outamba-Kilimi National Park", 9.5, -11.4, "nature"], ["Outamba-Kilimi National Park", 9.5, -11.4, "nature"]] },
  { name: "Singapore", wiki: "Singapore", cap: [1.3521, 103.8198], locs: [["MacRitchie Reservoir", 1.37, 103.84, "nature"], ["MacRitchie Reservoir", 1.37, 103.84, "nature"]] },
  { name: "Slovakia", wiki: "Slovakia", cap: [48.1486, 17.1077], locs: [["High Tatras", 49.2, 20.0, "nature"], ["Košice", 48.7164, 21.2611, "city"], ["High Tatras", 49.2, 20.0, "nature"]] },
  { name: "Slovenia", wiki: "Slovenia", cap: [46.0569, 14.5058], locs: [["Triglav National Park", 46.4, 14.0, "nature"], ["Maribor", 46.5547, 15.6467, "city"], ["Triglav National Park", 46.4, 14.0, "nature"]] },
  { name: "Solomon Islands", wiki: "Solomon_Islands", cap: [-9.4456, 160.0327], locs: [] },
  { name: "Somalia", wiki: "Somalia", cap: [2.0469, 45.3182], locs: [["Socotra Island", 12.5, 54.0, "nature"], ["Hargeisa", 9.5597, 44.065, "city"], ["Socotra Island", 12.5, 54.0, "nature"]] },
  { name: "South Africa", wiki: "South_Africa", cap: [-25.7479, 28.2293], locs: [["Kruger National Park", -24.0, 31.5, "nature"], ["Cape Town", -33.9249, 18.4241, "city"], ["Johannesburg", -26.2041, 28.0473, "city"], ["Bloemfontein", -29.1199, 26.2148, "former"], ["Kruger National Park", -24.0, 31.5, "nature"]] },
  { name: "South Korea", wiki: "South_Korea", cap: [37.5665, 126.978], locs: [["Seoraksan National Park", 38.1, 128.5, "nature"], ["Busan", 35.1796, 129.0756, "city"], ["Incheon", 37.4419, 126.7036, "city"], ["Daegu", 35.8714, 128.589, "city"], ["Seoraksan National Park", 38.1, 128.5, "nature"]] },
  { name: "South Sudan", wiki: "South_Sudan", cap: [4.8594, 31.5713], locs: [["Sudd Wetlands", 6.0, 30.5, "nature"], ["Sudd Wetlands", 6.0, 30.5, "nature"]] },
  { name: "Spain", wiki: "Spain", cap: [40.4168, -3.7038], locs: [["Picos de Europa National Park", 43.2, -4.8, "nature"], ["Barcelona", 41.3851, 2.1734, "city"], ["Valencia", 39.4699, -0.3763, "city"], ["Seville", 37.3886, -5.9824, "city"], ["Granada", 37.176, -3.5882, "unicode"], ["Picos de Europa National Park", 43.2, -4.8, "nature"]] },
  { name: "Sri Lanka", wiki: "Sri_Lanka", cap: [6.9008, 79.9013], locs: [["Sinharaja Rainforest", 6.4, 80.4, "nature"], ["Colombo", 6.9271, 79.8612, "former"], ["Kandy", 7.2906, 80.6337, "unicode"], ["Sinharaja Rainforest", 6.4, 80.4, "nature"]] },
  { name: "Sudan", wiki: "Sudan", cap: [15.5007, 32.5599], locs: [["Dinder National Park", 10.5, 34.5, "nature"], ["Omdurman", 15.6145, 32.48, "city"], ["Dinder National Park", 10.5, 34.5, "nature"]] },
  { name: "Suriname", wiki: "Suriname", cap: [5.852, -55.2038], locs: [["Raleighvallen National Park", 3.7, -56.4, "nature"], ["Raleighvallen National Park", 3.7, -56.4, "nature"]] },
  { name: "Sweden", wiki: "Sweden", cap: [59.3293, 18.0686], locs: [["Sarek National Park", 67.0, 16.9, "nature"], ["Gothenburg", 57.7089, 11.9746, "city"], ["Malmö", 55.605, 12.9854, "city"], ["Uppsala", 59.8586, 17.6389, "city"], ["Sarek National Park", 67.0, 16.9, "nature"]] },
  { name: "Switzerland", wiki: "Switzerland", cap: [46.948, 7.4474], locs: [["Jungfrau Region", 46.5, 8.2, "nature"], ["Zürich", 47.3769, 8.5417, "city"], ["Geneva", 46.2044, 6.1432, "city"], ["Basel", 47.5596, 7.5886, "city"], ["Jungfrau Region", 46.5, 8.2, "nature"]] },
  { name: "Syria", wiki: "Syria", cap: [33.5138, 36.2765], locs: [["Palmyra", 34.55, 38.27, "nature"], ["Aleppo", 36.2021, 37.1343, "former"], ["Homs", 34.73, 36.7237, "city"], ["Palmyra", 34.55, 38.27, "nature"]] },
  { name: "São Tomé and Príncipe", wiki: "São_Tomé_and_Príncipe", cap: [0.3365, 6.7273], locs: [] },
  { name: "Taiwan", wiki: "Taiwan", cap: [25.033, 121.5654], locs: [["Yushan Mountain", 23.47, 120.96, "nature"], ["Kaohsiung", 22.6163, 120.3006, "city"], ["Taichung", 24.1372, 120.6735, "city"], ["Yushan Mountain", 23.47, 120.96, "nature"]] },
  { name: "Tajikistan", wiki: "Tajikistan", cap: [38.5598, 68.787], locs: [["Pamir Mountains", 37.0, 72.0, "nature"], ["Khujand", 40.2864, 69.6222, "city"], ["Pamir Mountains", 37.0, 72.0, "nature"]] },
  { name: "Tanzania", wiki: "Tanzania", cap: [-6.163, 35.7516], locs: [["Mount Kilimanjaro", -3.0, 37.35, "nature"], ["Dar es Salaam", -6.7924, 39.2083, "former"], ["Moshi", -3.3667, 37.6667, "city"], ["Mount Kilimanjaro", -3.0, 37.35, "nature"]] },
  { name: "Thailand", wiki: "Thailand", cap: [13.7563, 100.5018], locs: [["Khao Yai National Park", 14.4, 101.4, "nature"], ["Chiang Mai", 18.7883, 98.9853, "city"], ["Phuket", 8.1128, 98.2997, "city"], ["Sukhothai", 17.0125, 99.8239, "unicode"], ["Khao Yai National Park", 14.4, 101.4, "nature"]] },
  { name: "Timor-Leste", wiki: "East_Timor", cap: [-8.5569, 125.5603], locs: [["Mount Ramelau", -9.0, 124.5, "nature"], ["Mount Ramelau", -9.0, 124.5, "nature"]] },
  { name: "Togo", wiki: "Togo", cap: [6.1375, 1.2123], locs: [["Koutammakou Landscape", 10.2, 1.2, "nature"], ["Koutammakou Landscape", 10.2, 1.2, "nature"]] },
  { name: "Tonga", wiki: "Tonga", cap: [-21.1393, -175.2046], locs: [["Vava'u Islands", -18.6, -173.9, "nature"], ["Vava'u Islands", -18.6, -173.9, "nature"]] },
  { name: "Trinidad and Tobago", wiki: "Trinidad_and_Tobago", cap: [10.6918, -61.2225], locs: [["Asa Wright Nature Centre", 10.72, -61.24, "nature"], ["Asa Wright Nature Centre", 10.72, -61.24, "nature"]] },
  { name: "Tunisia", wiki: "Tunisia", cap: [36.819, 10.1658], locs: [["Ichkeul National Park", 37.2, 9.1, "nature"], ["Sfax", 34.7406, 10.7603, "city"], ["Sousse", 35.8256, 10.6369, "city"], ["Ichkeul National Park", 37.2, 9.1, "nature"]] },
  { name: "Turkey", wiki: "Turkey", cap: [39.9334, 32.8597], locs: [["Cappadocia", 38.7, 34.6, "nature"], ["Istanbul", 41.0082, 28.9784, "city"], ["İzmir", 38.4161, 27.1398, "city"], ["Bursa", 40.1955, 29.0678, "city"], ["Cappadocia", 38.7, 34.6, "nature"]] },
  { name: "Turkmenistan", wiki: "Turkmenistan", cap: [37.9601, 58.3261], locs: [["Turpan Depression", 40.5, 62.0, "nature"], ["Turkmenabat", 37.1381, 65.4169, "city"], ["Turpan Depression", 40.5, 62.0, "nature"]] },
  { name: "Tuvalu", wiki: "Tuvalu", cap: [-8.52, 179.198], locs: [] },
  { name: "Uganda", wiki: "Uganda", cap: [0.3476, 32.5825], locs: [["Rwenzori Mountains National Park", 0.4, 30.0, "nature"], ["Gulu", 2.7734, 32.2764, "city"], ["Rwenzori Mountains National Park", 0.4, 30.0, "nature"]] },
  { name: "Ukraine", wiki: "Ukraine", cap: [50.4501, 30.5234], locs: [["Carpathian Mountains", 48.4, 24.5, "nature"], ["Kharkiv", 49.9935, 36.2304, "city"], ["Lviv", 49.8397, 24.0297, "city"], ["Odesa", 46.4856, 30.7326, "city"], ["Carpathian Mountains", 48.4, 24.5, "nature"]] },
  { name: "United Arab Emirates", wiki: "United_Arab_Emirates", cap: [24.4539, 54.3773], locs: [["Hajar Mountains", 25.3, 56.1, "nature"], ["Dubai", 25.2048, 55.2708, "city"], ["Sharjah", 25.3463, 55.4209, "city"], ["Hajar Mountains", 25.3, 56.1, "nature"]] },
  { name: "United Kingdom", wiki: "United_Kingdom", cap: [51.5074, -0.1278], locs: [["Lake District National Park", 54.5, -3.1, "nature"], ["Manchester", 53.4808, -2.2426, "city"], ["Birmingham", 52.5086, -1.8783, "city"], ["Leeds", 53.8008, -1.5491, "city"], ["Lake District National Park", 54.5, -3.1, "nature"]] },
  { name: "United States", wiki: "United_States", cap: [38.9072, -77.0369], locs: [["Yellowstone National Park", 44.7, -110.5, "nature"], ["New York City", 40.7128, -74.006, "city"], ["Los Angeles", 34.0522, -118.2437, "city"], ["Chicago", 41.8781, -87.6298, "city"], ["Houston", 29.7604, -95.3698, "city"], ["Yellowstone National Park", 44.7, -110.5, "nature"]] },
  { name: "Uruguay", wiki: "Uruguay", cap: [-34.9011, -56.1915], locs: [["Esteros de Ibera", -28.3, -57.2, "nature"], ["Salto", -31.3873, -57.9683, "city"], ["Esteros de Ibera", -28.3, -57.2, "nature"]] },
  { name: "Uzbekistan", wiki: "Uzbekistan", cap: [41.2995, 69.2401], locs: [["Nuratau Mountains", 40.8, 65.4, "nature"], ["Samarkand", 39.6547, 66.9758, "city"], ["Bukhara", 39.7681, 64.4272, "unicode"], ["Nuratau Mountains", 40.8, 65.4, "nature"]] },
  { name: "Vanuatu", wiki: "Vanuatu", cap: [-17.7333, 168.3167], locs: [["Mount Yasur", -19.52, 169.44, "nature"], ["Mount Yasur", -19.52, 169.44, "nature"]] },
  { name: "Venezuela", wiki: "Venezuela", cap: [10.4806, -66.9036], locs: [["Angel Falls", 5.97, -62.58, "nature"], ["Maracaibo", 10.6666, -71.6124, "city"], ["Valencia", 10.162, -67.9999, "city"], ["Angel Falls", 5.97, -62.58, "nature"]] },
  { name: "Vietnam", wiki: "Vietnam", cap: [21.0285, 105.8542], locs: [["Ha Long Bay", 20.84, 107.1, "nature"], ["Ho Chi Minh City", 10.8231, 106.6297, "former"], ["Hai Phong", 20.8449, 106.6836, "city"], ["Hội An", 15.8794, 108.335, "unicode"], ["Ha Long Bay", 20.84, 107.1, "nature"]] },
  { name: "Yemen", wiki: "Yemen", cap: [15.3527, 48.5164], locs: [["Socotra Island", 12.5, 54.0, "nature"], ["Aden", 12.7797, 45.0367, "former"], ["Taiz", 13.58, 44.0077, "city"], ["Socotra Island", 12.5, 54.0, "nature"]] },
  { name: "Zambia", wiki: "Zambia", cap: [-15.3875, 28.3228], locs: [["Victoria Falls", -17.93, 25.86, "nature"], ["Kitwe", -12.8183, 28.2559, "city"], ["Victoria Falls", -17.93, 25.86, "nature"]] },
  { name: "Zimbabwe", wiki: "Zimbabwe", cap: [-17.8252, 31.0335], locs: [["Hwange National Park", -18.5, 26.5, "nature"], ["Bulawayo", -20.1325, 28.6264, "city"], ["Hwange National Park", -18.5, 26.5, "nature"]] }
];const toRad = d => (d * Math.PI) / 180;
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
        // Keywords that indicate map/diagram graphics that would be too much of a hint
        const mapKeywords = /map|locate|position|geography|diagram|chart|flag|coat of arms|infobox|location map|administrative/i;
        
        for (const img of images_list.slice(0, 15)) {
          const imgTitle = img.title;
          // Skip SVG files and map-like graphics
          if (!/\.svg$/i.test(imgTitle) && !mapKeywords.test(imgTitle)) {
            const imgInfoUrl = `https://en.wikipedia.org/w/api.php?action=query&titles=${encodeURIComponent(imgTitle)}&prop=imageinfo&iiprop=url&format=json&origin=*`;
            const imgInfoRes = await fetch(imgInfoUrl);
            const imgInfoData = await imgInfoRes.json();
            const imgPages = imgInfoData?.query?.pages;
            const imgPage = imgPages ? Object.values(imgPages)[0] : null;
            const url = imgPage?.imageinfo?.[0]?.url;
            if (url && imageUrls.length < 2) imageUrls.push(url);
            if (imageUrls.length === 2) break;
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
  const [loading, setLoading] = useState(true);
  const [puzzle, setPuzzle] = useState(null);
  const [guesses, setGuesses] = useState(Array(6).fill(""));
  const [submitted, setSubmitted] = useState(Array(6).fill(false));
  const [currentRow, setCurrentRow] = useState(0);
  const [won, setWon] = useState(false);
  const [lost, setLost] = useState(false);
  const [copied, setCopied] = useState(false);
  const [showStats, setShowStats] = useState(false);
  const [alreadyPlayed, setAlreadyPlayed] = useState(false);
  const [showConfetti, setShowConfetti] = useState(false);
  const statsSavedRef = useRef(false);

  // Initialize puzzle on mount
  useEffect(() => {
    if (COUNTRIES.length === 0) {
      console.warn("No countries loaded");
      setLoading(false);
      return;
    }
    
    const now = new Date();
    const today = `${now.getUTCFullYear()}-${String(now.getUTCMonth() + 1).padStart(2, '0')}-${String(now.getUTCDate()).padStart(2, '0')}`;
    const stored = localStorage.getItem("witworld_puzzle_date");
    
    if (stored === today) {
      const p = localStorage.getItem("witworld_puzzle");
      if (p) {
        setPuzzle(JSON.parse(p));
        setLoading(false);
        return;
      }
    }
    
    const newPuzzle = getDailyPuzzle();
    localStorage.setItem("witworld_puzzle_date", today);
    localStorage.setItem("witworld_puzzle", JSON.stringify(newPuzzle));
    setPuzzle(newPuzzle);
    setLoading(false);
  }, []);
  
  // Only destructure puzzle when it's loaded
  const country = puzzle?.country;
  const loc = puzzle?.loc;
  const { images, loading: imgLoading } = useWikiImages(loc?.[0] || "");

  // Load stats from localStorage
  const [stats, setStats] = useState(() => {
    try {
      const stored = localStorage.getItem("witworld_stats");
      return stored ? JSON.parse(stored) : { games: 0, wins: 0, guesses: [0, 0, 0, 0, 0, 0] };
    } catch {
      return { games: 0, wins: 0, guesses: [0, 0, 0, 0, 0, 0] };
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
        newStats.guesses[5] = (newStats.guesses[5] || 0) + 1;
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
    // Calculate percentage: max distance ~20000km (halfway around Earth)
    const maxDist = 20000;
    const percentage = Math.max(0, Math.round(100 - (dist / maxDist) * 100));
    return { dist, dir, percentage };
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
      flexDirection: "column", alignItems: "center", justifyContent: "center", padding: "24px 16px 48px"
    }}>
      {typeof window !== 'undefined' && window.console && console.log('WITWorld mounted. Loading:', loading, 'Puzzle:', !!puzzle)}
      {loading ? (
        <div style={{ textAlign: "center", color: "#666" }}>
          <p>Loading game... (checking locations.json)</p>
        </div>
      ) : !puzzle ? (
        <div style={{ textAlign: "center", color: "#f87171" }}>
          <p>Error loading game. Check console for details.</p>
          <p style={{ fontSize: 12, color: "#888", marginTop: 16 }}>Countries loaded: {COUNTRIES.length}</p>
        </div>
      ) : (
      <div style={{
        minHeight: "100vh", background: "#0f0f17", color: "#f8f8f2",
        fontFamily: "'Segoe UI', system-ui, sans-serif", display: "flex",
        flexDirection: "column", alignItems: "center", padding: "24px 16px 48px", width: "100%"
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
        <h1 style={{ margin: 0, fontSize: 36, fontWeight: 900, letterSpacing: -1, color: "#f8f8f2", marginBottom: 4 }}>
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
        <p style={{ margin: 0, color: "#666", fontSize: 13 }}>
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
          <div style={{ marginTop: 8, fontSize: 12, color: "#888", textAlign: "center" }}>
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
                  padding: "6px 10px", fontSize: 12, minWidth: 0
                }}>
                  <span>
                    {hint.dir === "N" ? "⬆️" : hint.dir === "S" ? "⬇️" : hint.dir === "E" ? "➡️" : hint.dir === "W" ? "⬅️" :
                     hint.dir === "NE" ? "↗️" : hint.dir === "NW" ? "↖️" : hint.dir === "SE" ? "↘️" : "↙️"}
                  </span>
                  <span style={{ 
                    fontWeight: 700, 
                    whiteSpace: "nowrap",
                    color: hint.percentage < 70 
                      ? `hsl(${hint.percentage * 1.2}, 100%, 50%)` 
                      : `hsl(${120 - (hint.percentage - 70) * 1.2}, 100%, 50%)`
                  }}>
                    {hint.percentage}% ({hint.dist}km)
                  </span>
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
              📖 Wikipedia: {loc[0]}
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
            <button
              onClick={() => {
                const newPuzzle = getRandomPuzzle();
                if (newPuzzle) {
                  setPuzzle(newPuzzle);
                  setGuesses(Array(6).fill(""));
                  setSubmitted(Array(6).fill(false));
                  setCurrentRow(0);
                  setWon(false);
                  setLost(false);
                }
              }}
              style={{
                padding: "10px 18px", borderRadius: 8,
                background: "#6366f1", color: "#fff", border: "none",
                fontWeight: 700, fontSize: 13, cursor: "pointer"
              }}
            >
              🎮 New Game
            </button>
          </div>
        </div>
      )}

      {(won || lost) && (
        <div style={{
          background: "linear-gradient(135deg, #1e1e2e, #16162a)",
          border: "1px solid #6366f1", borderRadius: 16,
          overflow: "hidden", marginTop: 28, width: "100%", maxWidth: 520,
          padding: "20px 24px"
        }}>
          <div style={{ display: "flex", justifyContent: "center", alignItems: "center", marginBottom: 16 }}>
            <h2 style={{ margin: 0, fontSize: 20, fontWeight: 800, color: "#f8f8f2" }}>Your Stats</h2>
          </div>

          <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 12, marginBottom: 20 }}>
            <div style={{ background: "#111118", padding: 12, borderRadius: 8, textAlign: "center" }}>
              <div style={{ fontSize: 24, fontWeight: 900, color: "#6366f1" }}>{stats.games}</div>
              <div style={{ fontSize: 11, color: "#666", marginTop: 4 }}>GAMES PLAYED</div>
            </div>
            <div style={{ background: "#111118", padding: 12, borderRadius: 8, textAlign: "center" }}>
              <div style={{ fontSize: 24, fontWeight: 900, color: "#4ade80" }}>
                {stats.games > 0 ? Math.round((stats.wins / stats.games) * 100) : 0}%
              </div>
              <div style={{ fontSize: 11, color: "#666", marginTop: 4 }}>WIN RATE</div>
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
      )}

      <div style={{
        marginTop: 48, textAlign: "center", color: "#444", fontSize: 12,
        letterSpacing: 2, fontWeight: 700
      }}>
        EVERY DAY A NEW GAME
      </div>
      </div>
      )}
    </div>
  );
}
