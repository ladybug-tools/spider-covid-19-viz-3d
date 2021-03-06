const places = [
	[ "Country / Region", "Province / State", "Lat", "Long", "" ],
	[ "Afghanistan", "", "33", "65", "" ],
	[ "Albania", "", "41.1533", "20.1683", "" ],
	[ "Algeria", "", "28.0339", "1.6596", "" ],
	[ "Andorra", "", "42.5063", "1.5218", "" ],
	[ "Angola", "", "-11.2027", "17.8739", "" ],
	[ "Antigua and Barbuda", "", "17.0608", "-61.7964", "" ],
	[ "Argentina", "", "-38.4161", "-63.6167", "" ],
	[ "Armenia", "", "40.0691", "45.0382", "" ],
	[ "Australia", "", "-25.2744", "133.7751", "" ],
	[ "Australia", "Australian Capital Territory", "-35.4735", "149.0124", "" ],
	[ "Australia", "New South Wales", "-33.8688", "151.2093", "" ],
	[ "Australia", "Northern Territory", "-12.4634", "130.8456", "" ],
	[ "Australia", "Queensland", "-28.0167", "153.4", "" ],
	[ "Australia", "South Australia", "-34.9285", "138.6007", "" ],
	[ "Australia", "Tasmania", "-41.4545", "145.9707", "" ],
	[ "Australia", "Victoria", "-37.8136", "144.9631", "" ],
	[ "Australia", "Western Australia", "-31.9505", "115.8605", "" ],
	[ "Austria", "", "47.5162", "14.5501", "" ],
	[ "Azerbaijan", "", "40.1431", "47.5769", "" ],
	[ "Bahamas", "", "25.0343", "-77.3963", "" ],
	[ "Bahrain", "", "26.0275", "50.55", "" ],
	[ "Bangladesh", "", "23.685", "90.3563", "" ],
	[ "Barbados", "", "13.1939", "-59.5432", "" ],
	[ "Belarus", "", "53.7098", "27.9534", "" ],
	[ "Belgium", "", "50.8333", "4", "" ],
	[ "Belize", "", "13.1939", "-59.5432", "" ],
	[ "Benin", "", "9.3077", "2.3158", "" ],
	[ "Bhutan", "", "27.5142", "90.4336", "" ],
	[ "Bolivia", "", "-16.2902", "-63.5887", "" ],
	[ "Bosnia and Herzegovina", "", "43.9159", "17.6791", "" ],
	[ "Brazil", "", "-14.235", "-51.9253", "" ],
	[ "Brunei", "", "4.5353", "114.7277", "" ],
	[ "Bulgaria", "", "42.7339", "25.4858", "" ],
	[ "Burkina Faso", "", "12.2383", "-1.5616", "" ],
	[ "Cabo Verde", "", "16.5388", "-23.0418", "" ],
	[ "Cape Verde", "", "16.5388", "-23.0418", "" ],
	[ "Cambodia", "", "11.55", "104.9167", "" ],
	[ "Cameroon", "", "3.848", "11.5021", "" ],
	[ "Canada", "", "51.2538", "-85.3232", "" ],
	[ "Canada", "Alberta", "53.9333", "-116.5765", "" ],
	[ "Canada", "British Columbia", "49.2827", "-123.1207", "" ],
	[ "Canada", "Manitoba", "53.7609", "-98.8139", "" ],
	[ "Canada", "New Brunswick", "46.5653", "-66.4619", "" ],
	[ "Canada", "Newfoundland and Labrador", "53.1355", "-57.6604", "" ],
	[ "Canada", "Northwest Territories", "64.8255", "-124.8457", "" ],
	[ "Canada", "Nova Scotia", "44.682", "-63.7443", "" ],
	[ "Canada", "Ontario", "51.2538", "-85.3232", "" ],
	[ "Canada", "Prince Edward Island", "46.5107", "-63.4168", "" ],
	[ "Canada", "Quebec", "52.9399", "-73.5491", "" ],
	[ "Canada", "Yukon", "64.2823", "-135", "" ],
	[ "Canada", "Saskatchewan", "52.9399", "-106.4509", "" ],
	[ "Central African Republic", "", "6.6111", "20.9394", "" ],
	[ "Chad", "", "15.4542", "18.7322", "" ],
	[ "Chile", "", "-35.6751", "-71.543", "" ],
	[ "China (mainland)", "", "35.8617", "104.1954", "" ],
	[ "China", "", "35.8617", "104.1954", "1" ],
	[ "China", "Anhui", "31.8257", "117.2264", "" ],
	[ "China", "Beijing", "40.1824", "116.4142", "" ],
	[ "China", "Chongqing", "30.0572", "107.874", "" ],
	[ "China", "Fujian", "26.0789", "117.9874", "" ],
	[ "China", "Gansu", "37.8099", "101.0583", "" ],
	[ "China", "Guangdong", "23.3417", "113.4244", "" ],
	[ "China", "Guangxi", "23.8298", "108.7881", "" ],
	[ "China", "Guizhou", "26.8154", "106.8748", "" ],
	[ "China", "Hainan", "19.1959", "109.7453", "" ],
	[ "China", "Hebei", "39.549", "116.1306", "" ],
	[ "China", "Heilongjiang", "47.862", "127.7615", "" ],
	[ "China", "Henan", "33.882", "113.614", "" ],
	[ "China", "Hong Kong", "22.3", "114.2", "" ],
	[ "China", "Hubei", "30.9756", "112.2707", "" ],
	[ "China", "Hunan", "27.6104", "111.7088", "" ],
	[ "China", "Inner Mongolia", "44.0935", "113.9448", "" ],
	[ "China", "Jiangsu", "32.9711", "119.455", "" ],
	[ "China", "Jiangxi", "27.614", "115.7221", "" ],
	[ "China", "Jilin", "43.6661", "126.1923", "" ],
	[ "China", "Liaoning", "41.2956", "122.6085", "" ],
	[ "China", "Macau", "22.1667", "113.55", "" ],
	[ "China", "Ningxia", "37.2692", "106.1655", "" ],
	[ "China", "Qinghai", "35.7452", "95.9956", "" ],
	[ "China", "Shaanxi", "35.1917", "108.8701", "" ],
	[ "China", "Shandong", "36.3427", "118.1498", "" ],
	[ "China", "Shanghai", "31.202", "121.4491", "" ],
	[ "China", "Shanxi", "37.5777", "112.2922", "" ],
	[ "China", "Sichuan", "30.6171", "102.7103", "" ],
	[ "China", "Tianjin", "39.3054", "117.323", "" ],
	[ "China", "Tibet", "31.6927", "88.0924", "" ],
	[ "China", "Xinjiang", "41.1129", "85.2401", "" ],
	[ "China", "Yunnan", "24.974", "101.487", "" ],
	[ "China", "Zhejiang", "29.1832", "120.0934", "" ],
	[ "Colombia", "", "4.5709", "-74.2973", "" ],
	[ "DR Congo", "", "-4.0383", "21.7587", "" ],
	[ "Republic of the Congo", "", "-4.0383", "21.7587", "" ],
	[ "Congo (Brazzaville)", "", "-4.0383", "21.7587", "" ],
	[ "Congo (Kinshasa)", "", "-4.0383", "21.7587", "" ],
	[ "Costa Rica", "", "9.7489", "-83.7534", "" ],
	[ "Ivory Coast", "", "7.54", "-5.5471", "" ],
	[ "Cote d'Ivoire", "", "7.54", "-5.5471", "" ],
	[ "Croatia", "", "45.1", "15.2", "" ],
	[ "Cuba", "", "22", "-80", "" ],
	[ "Cyprus", "", "35.1264", "33.4299", "" ],
	[ "Northern Cyprus", "", "35.1264", "33.4299", "" ],
	[ "Czech Republic", "", "49.8175", "15.473", "" ],
	[ "Czechia", "", "49.8175", "15.473", "" ],
	[ "Denmark", "", "56.2639", "9.5018", "" ],
	[ "Denmark", "Faroe Islands", "61.8926", "-6.9118", "" ],
	[ "Denmark", "Greenland", "71.7069", "-42.6043", "" ],
	[ "Djibouti", "", "11.8251", "42.5903", "" ],
	[ "Dominica", "", "15.415", "-61.371", "" ],
	[ "Dominican Republic", "", "18.7357", "-70.1627", "" ],
	[ "Ecuador", "", "-1.8312", "-78.1834", "" ],
	[ "Egypt", "", "26", "30", "" ],
	[ "El Salvador", "", "13.7942", "-88.8965", "" ],
	[ "Equatorial Guinea", "", "1.5", "10", "" ],
	[ "Eritrea", "", "15.1794", "39.7823", "" ],
	[ "Estonia", "", "58.5953", "25.0136", "" ],
	[ "Eswatini", "", "-26.5225", "31.4659", "" ],
	[ "Ethiopia", "", "9.145", "40.4897", "" ],
	[ "Fiji", "", "-17.7134", "178.065", "" ],
	[ "Finland", "", "64", "26", "" ],
	[ "France", "", "46.2276", "2.2137", "0" ],
	[ "France", "French Guiana", "3.9339", "-53.1258", "" ],
	[ "France", "French Polynesia", "-17.6797", "149.4068", "" ],
	[ "France", "Guadeloupe", "16.25", "-61.5833", "" ],
	[ "France", "Martinique", "14.6415", "-61.0242", "" ],
	[ "France", "Mayotte", "-12.8275", "45.1662", "" ],
	[ "France", "New Caledonia", "-20.9043", "165.618", "" ],
	[ "France", "Reunion", "-21.1351", "55.2471", "" ],
	[ "France", "Saint Barthelemy", "17.9", "-62.8333", "" ],
	[ "France", "St Martin", "18.0708", "-63.0501", "" ],
	[ "Gabon", "", "-0.8037", "11.6094", "" ],
	[ "Gambia", "", "13.4432", "-15.3101", "" ],
	[ "Georgia", "", "42.3154", "43.3569", "" ],
	[ "Germany", "", "51", "9", "" ],
	[ "Ghana", "", "7.9465", "-1.0232", "" ],
	[ "Greece", "", "39.0742", "21.8243", "" ],
	[ "Grenada", "", "12.1165", "-61.679", "" ],
	[ "Guatemala", "", "15.7835", "-90.2308", "" ],
	[ "Guinea", "", "9.9456", "-9.6966", "" ],
	[ "Guinea-Bissau", "", "11.8037", "-15.1804", "" ],
	[ "Guyana", "", "5", "-58.75", "" ],
	[ "Haiti", "", "18.9712", "-72.2852", "" ],
	[ "Honduras", "", "15.2", "-86.2419", "" ],
	[ "Hong Kong", "", "22.3", "114.2", "" ],
	[ "Hungary", "", "47.1625", "19.5033", "" ],
	[ "Iceland", "", "64.9631", "-19.0208", "" ],
	[ "India", "", "21", "78", "" ],
	[ "Indonesia", "", "-0.7893", "113.9213", "" ],
	[ "Iran", "", "32", "53", "" ],
	[ "Iraq", "", "33", "44", "" ],
	[ "Ireland", "", "53.1424", "-7.6921", "" ],
	[ "Israel", "", "31", "35", "" ],
	[ "Italy", "", "43", "12", "" ],
	[ "Jamaica", "", "18.1096", "-77.2975", "" ],
	[ "Japan", "", "36", "138", "" ],
	[ "Jordan", "", "31.24", "36.51", "" ],
	[ "Kazakhstan", "", "48.0196", "66.9237", "" ],
	[ "Kenya", "", "-0.0236", "37.9062", "" ],
	[ "Kosovo", "", "42.602636", "20.902977", "" ],
	[ "Kuwait", "", "29.5", "47.75", "" ],
	[ "Kyrgyzstan", "", "41.2044", "74.7661", "" ],
	[ "Laos", "", "19.85627", "102.495496", "" ],
	[ "Latvia", "", "56.8796", "24.6032", "" ],
	[ "Lebanon", "", "33.8547", "35.8623", "" ],
	[ "Liberia", "", "6.4281", "-9.4295", "" ],
	[ "Libya", "", "26.3351", "17.228331", "" ],
	[ "Liechtenstein", "", "47.14", "9.55", "" ],
	[ "Lithuania", "", "55.1694", "23.8813", "" ],
	[ "Luxembourg", "", "49.8153", "6.1296", "" ],
	[ "Macau", "", "22.1667", "113.55", "" ],
	[ "Madagascar", "", "-18.7669", "46.8691", "" ],
	[ "Malaysia", "", "2.5", "112.5", "" ],
	[ "Maldives", "", "3.2028", "73.2207", "" ],
	[ "Mali", "", "17.570692", "-3.996166", "" ],
	[ "Malta", "", "35.9375", "14.3754", "" ],
	[ "Mauritania", "", "21.0079", "10.9408", "" ],
	[ "Mauritius", "", "-20.2", "57.5", "" ],
	[ "Mexico", "", "23.6345", "-102.5528", "" ],
	[ "Moldova", "", "47.4116", "28.3699", "" ],
	[ "Monaco", "", "43.7333", "7.4167", "" ],
	[ "Mongolia", "", "46.8625", "103.8467", "" ],
	[ "Montenegro", "", "42.5", "19.3", "" ],
	[ "Morocco", "", "31.7917", "-7.0926", "" ],
	[ "Mozambique", "", "-18.665695", "35.529562", "" ],
	[ "Myanmar", "", "21.9162", "95.9560", "" ],
	[ "Namibia", "", "-22.9576", "18.4904", "" ],
	[ "Nepal", "", "28.1667", "84.25", "" ],
	[ "Netherlands", "", "52.1326", "5.2913", "" ],
	[ "Netherlands", "Aruba", "12.5186", "-70.0358", "" ],
	[ "Netherlands", "Curacao", "12.1696", "-68.99", "" ],
	[ "Netherlands", "Sint Maarten", "18.0425", "-63.0548", "" ],
	[ "New Zealand", "", "-40.9006", "174.886", "" ],
	[ "Nicaragua", "", "12.8654", "-85.2072", "" ],
	[ "Niger", "", "17.6078", "8.0817", "" ],
	[ "Nigeria", "", "9.082", "8.6753", "" ],
	[ "North Macedonia", "", "41.6086", "21.7453", "" ],
	[ "Norway", "", "60.472", "8.4689", "" ],
	[ "Oman", "", "21", "57", "" ],
	[ "Pakistan", "", "30.3753", "69.3451", "" ],
	[ "Panama", "", "8.538", "-80.7821", "" ],
	[ "Papua New Guinea", "", "-6.315", "143.9555", "" ],
	[ "Paraguay", "", "-23.4425", "-58.4438", "" ],
	[ "Peru", "", "-9.19", "-75.0152", "" ],
	[ "Philippines", "", "13", "122", "" ],
	[ "Poland", "", "51.9194", "19.1451", "1" ],
	[ "Portugal", "", "39.3999", "-8.2245", "1" ],
	[ "Qatar", "", "25.3548", "51.1839", "" ],
	[ "Romania", "", "45.9432", "24.9668", "" ],
	[ "Russia", "", "60", "90", "" ],
	[ "Rwanda", "", "-1.9403", "29.8739", "" ],
	[ "Saint Kitts and Nevis", "", "17.357822", "-62.782998", "" ],
	[ "Saint Lucia", "", "13.9094", "-60.9789", "" ],
	[ "Saint Vincent and the Grenadines", "", "12.9843", "-61.2872", "" ],
	[ "San Marino", "", "43.9424", "12.4578", "" ],
	[ "Saudi Arabia", "", "24", "45", "" ],
	[ "Senegal", "", "14.4974", "-14.4524", "" ],
	[ "Serbia", "", "44.0165", "21.0059", "" ],
	[ "Seychelles", "", "-4.6796", "55.492", "" ],
	[ "Singapore", "", "1.2833", "103.8333", "" ],
	[ "Slovakia", "", "48.669", "19.699", "" ],
	[ "Slovenia", "", "46.1512", "14.9955", "" ],
	[ "Somalia", "", "5.1521", "46.1996", "" ],
	[ "South Africa", "", "-30.5595", "22.9375", "" ],
	[ "South Korea", "", "36", "128", "1" ],
	[ "Spain", "", "40", "-4", "" ],
	[ "Sri Lanka", "", "7", "81", "" ],
	[ "Sudan", "", "12.8628", "30.2176", "" ],
	[ "Suriname", "", "3.9193", "-56.0278", "" ],
	[ "Sweden", "", "63", "16", "" ],
	[ "Switzerland", "", "46.8182", "8.2275", "" ],
	[ "Syria", "", "34.802075", "38.996815", "" ],
	[ "Taiwan", "", "23.7", "121", "" ],
	[ "Tanzania", "", "-6.369", "34.8888", "" ],
	[ "Thailand", "", "15", "101", "" ],
	[ "East Timor", "", "-8.874217", "125.727539", "" ],
	[ "Timor-Leste", "", "-8.874217", "125.727539", "" ],
	[ "Togo", "", "8.6195", "0.8248", "" ],
	[ "Transnistria", "", "47.2153", "29.4638", "" ],
	[ "Trinidad and Tobago", "", "10.6918", "-61.2225", "" ],
	[ "Tunisia", "", "34", "9", "" ],
	[ "Turkey", "", "38.9637", "35.2433", "" ],
	[ "Uganda", "", "1", "32", "" ],
	[ "Ukraine", "", "48.3794", "31.1656", "" ],
	[ "United Arab Emirates", "", "24", "54", "" ],
	[ "United Kingdom", "", "55.3781", "-3.436", "" ],
	[ "United Kingdom", "Bermuda", "32.3078", "-64.7505", "" ],
	[ "United Kingdom", "Cayman Islands", "19.3133", "-81.2546", "" ],
	[ "Guernsey", "", "49.3723", "-2.3644", "" ],
	[ "Jersey", "", "49.3723", "-2.3644", "" ],
	[ "United Kingdom", "Channel Islands", "49.3723", "-2.3644", "" ],
	[ "United Kingdom", "Gibraltar", "36.1408", "-5.3536", "" ],
	[ "United Kingdom", "Isle of Man", "54.2361", "-4.5481", "" ],
	[ "Isle of Man", "", "54.2361", "-4.5481", "" ],
	[ "United Kingdom", "Montserrat", "16.7425", "-62.1874", "" ],
	[ "United States", "", "37.0902", "-95.7129", "0" ],
	[ "Uruguay", "", "-32.5228", "-55.7658", "" ],
	[ "Uzbekistan", "", "41.3775", "64.5853", "" ],
	[ "Vatican City", "", "41.9029", "12.4534", "" ],
	[ "Venezuela", "", "6.4238", "-66.5897", "" ],
	[ "Vietnam", "", "16", "108", "" ],
	[ "Palestine", "", "31.9522", "35.2332", "" ],
	[ "West Bank and Gaza", "", "31.9522", "35.2332", "" ],
	[ "Zambia", "", "-15.4167", "28.2833", "" ],
	[ "Zimbabwe", "", "-20", "30", "" ],

	[ "United States", "Alabama", "32.6010112", "-86.6807365", "" ],
	[ "United States", "Alaska", "61.3025006", "-158.7750198", "" ],
	[ "United States", "American Samoa", "14.2710", "170.1322", "" ],
	[ "United States", "Arizona", "34.1682185", "-111.930907", "" ],
	[ "United States", "Arkansas", "34.7519275", "-92.1313784", "" ],
	[ "United States", "California", "37.2718745", "-119.2704153", "1" ],
	[ "United States", "Colorado", "38.9979339", "-105.550567", "" ],
	[ "United States", "Connecticut", "41.5187835", "-72.757507", "" ],
	[ "United States", "Delaware", "39.145251", "-75.4189206", "" ],
	[ "United States", "District of Columbia", "38.8993487", "-77.0145666", "" ],
	[ "United States", "Florida", "27.9757279", "-83.8330166", "" ],
	[ "United States", "Georgia", "32.6781248", "-83.2229757", "" ],
	[ "United States", "Guam", "13.4443", "144.7937"],
	[ "United States", "Hawaii", "20.46", "-157.505", "" ],
	[ "United States", "Idaho", "45.4945756", "-114.1424303", "" ],
	[ "United States", "Illinois", "39.739318", "-89.504139", "" ],
	[ "United States", "Indiana", "39.7662195", "-86.441277", "" ],
	[ "United States", "Iowa", "41.9383166", "-93.389798", "" ],
	[ "United States", "Kansas", "38.4987789", "-98.3200779", "" ],
	[ "United States", "Kentucky", "37.8222935", "-85.7682399", "" ],
	[ "United States", "Louisiana", "30.9733766", "-91.4299097", "" ],
	[ "United States", "Maine", "45.2185133", "-69.0148656", "" ],
	[ "United States", "Maryland", "38.8063524", "-77.2684162", "" ],
	[ "United States", "Massachusetts", "42.0629398", "-71.718067", "" ],
	[ "United States", "Michigan", "44.9435598", "-86.4158049", "" ],
	[ "United States", "Minnesota", "46.4418595", "-93.3655146", "" ],
	[ "United States", "Mississippi", "32.5851062", "-89.8772196", "" ],
	[ "United States", "Missouri", "38.3046615", "-92.437099", "" ],
	[ "United States", "Montana", "46.6797995", "-110.044783", "" ],
	[ "United States", "Nebraska", "41.5008195", "-99.680902", "" ],
	[ "United States", "Nevada", "38.502032", "-117.0230604", "" ],
	[ "United States", "New Hampshire", "44.0012306", "-71.5799231", "" ],
	[ "United States", "New Jersey", "40.1430058", "-74.7311156", "" ],
	[ "United States", "New Mexico", "34.1662325", "-106.0260685", "" ],
	[ "United States", "New York", "40.7056258", "-73.97968", "0" ],
	[ "United States", "North Carolina", "35.2145629", "-79.8912675", "" ],
	[ "United States", "North Dakota", "47.4678819", "-100.3022655", "" ],
	[ "United States", "Northern Mariana Islands", "15.0979", "145.6739", "" ],
	[ "United States", "Ohio", "40.1903624", "-82.6692525", "" ],
	[ "United States", "Oklahoma", "35.3097654", "-98.7165585", "" ],
	[ "United States", "Oregon", "44.1419049", "-120.5380993", "" ],
	[ "United States", "Pennsylvania", "40.9945928", "-77.6046984", "" ],
	[ "United States", "Puerto Rico", "18.2208", "66.5901"],
	[ "United States", "Rhode Island", "41.5827282", "-71.5064508", "" ],
	[ "United States", "South Carolina", "33.62505", "-80.9470381", "" ],
	[ "United States", "South Dakota", "44.2126995", "-100.2471641", "" ],
	[ "United States", "Tennessee", "35.830521", "-85.9785989", "" ],
	[ "United States", "Texas", "31.1693363", "-100.0768425", "" ],
	[ "United States", "U.S. Virgin Islands", "18.3358", "64.8963", "" ],
	[ "United States", "Utah", "39.4997605", "-111.547028", "" ],
	[ "United States", "Vermont", "43.8717545", "-72.4477828", "" ],
	[ "United States", "Virginia", "38.0033855", "-79.4587861", "" ],
	[ "United States", "Washington", "38.8993487", "-77.0145665", "" ],
	[ "United States", "West Virginia", "38.9201705", "-80.1816905", "" ],
	[ "United States", "Wisconsin", "44.7862968", "-89.8267049", "" ],
	[ "United States", "Wyoming", "43.000325", "-107.5545669" ]
]