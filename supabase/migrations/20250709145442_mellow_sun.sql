/*
  # Update Data Plans Pricing to Match API User Pricing

  1. Changes
    - Update MTN data plans pricing to match API user pricing
    - Update Airtel data plans pricing to match API user pricing
    - Update Glo data plans pricing to match API user pricing
    - Update 9mobile data plans pricing to match API user pricing
    - Update cost_price and selling_price with appropriate profit margins

  2. Purpose
    - Ensure data plans reflect current market rates
    - Maintain competitive pricing for customers
    - Ensure proper profit margins for the business
*/

-- Update MTN data plans
UPDATE data_plans
SET cost_price = 102, selling_price = 120
WHERE network = 'MTN' AND size = '110.0 MB';

UPDATE data_plans
SET cost_price = 202, selling_price = 220
WHERE network = 'MTN' AND size = '230.0 MB';

UPDATE data_plans
SET cost_price = 340, selling_price = 370
WHERE network = 'MTN' AND size = '500.0 MB' AND validity = '30 DAY VALIDITY';

UPDATE data_plans
SET cost_price = 445, selling_price = 480
WHERE network = 'MTN' AND size = '750.0 MB';

UPDATE data_plans
SET cost_price = 495, selling_price = 530
WHERE network = 'MTN' AND size = '500.0 MB' AND validity = '7 DAYS VALIDITY';

UPDATE data_plans
SET cost_price = 489, selling_price = 520
WHERE network = 'MTN' AND size = '1.0 GB' AND validity = '1 DAY VALIDITY';

UPDATE data_plans
SET cost_price = 500, selling_price = 550
WHERE network = 'MTN' AND size = '500.0 MB' AND validity = '30 DAYS';

UPDATE data_plans
SET cost_price = 592, selling_price = 630
WHERE network = 'MTN' AND size = '1.5 GB' AND validity = '2 DAY VALIDITY';

UPDATE data_plans
SET cost_price = 650, selling_price = 700
WHERE network = 'MTN' AND size = '1.0 GB' AND validity = '30 DAY VALIDITY';

UPDATE data_plans
SET cost_price = 739, selling_price = 780
WHERE network = 'MTN' AND size = '1.2 GB';

UPDATE data_plans
SET cost_price = 739, selling_price = 780
WHERE network = 'MTN' AND size = '2.5 GB' AND validity = '1 DAY VALIDITY';

UPDATE data_plans
SET cost_price = 739, selling_price = 780
WHERE network = 'MTN' AND size = '2.0 GB' AND validity = '2 DAY VALIDITY';

UPDATE data_plans
SET cost_price = 779, selling_price = 820
WHERE network = 'MTN' AND size = '1.0 GB' AND validity = '7 DAY VALIDITY';

UPDATE data_plans
SET cost_price = 879, selling_price = 920
WHERE network = 'MTN' AND size = '2.5 GB' AND validity = '2 DAY VALIDITY';

UPDATE data_plans
SET cost_price = 985, selling_price = 1050
WHERE network = 'MTN' AND size = '1.5 GB' AND validity = '7 DAY VALIDITY';

UPDATE data_plans
SET cost_price = 985, selling_price = 1050
WHERE network = 'MTN' AND size = '3.2 GB';

UPDATE data_plans
SET cost_price = 1000, selling_price = 1100
WHERE network = 'MTN' AND size = '1.0 GB' AND validity = '30 days';

UPDATE data_plans
SET cost_price = 1300, selling_price = 1400
WHERE network = 'MTN' AND size = '2.0 GB' AND validity = '30 DAY VALIDITY';

UPDATE data_plans
SET cost_price = 1465, selling_price = 1550
WHERE network = 'MTN' AND size = '2.0 GB' AND validity = '30 DAY VALIDITY';

UPDATE data_plans
SET cost_price = 1465, selling_price = 1550
WHERE network = 'MTN' AND size = '1.8 GB';

UPDATE data_plans
SET cost_price = 1950, selling_price = 2050
WHERE network = 'MTN' AND size = '3.0 GB' AND validity = '30 DAY VALIDITY';

UPDATE data_plans
SET cost_price = 2475, selling_price = 2600
WHERE network = 'MTN' AND size = '6.0 GB';

UPDATE data_plans
SET cost_price = 3250, selling_price = 3400
WHERE network = 'MTN' AND size = '5.0 GB' AND validity = '30 DAY VALIDITY';

UPDATE data_plans
SET cost_price = 3425, selling_price = 3600
WHERE network = 'MTN' AND size = '11.0 GB';

UPDATE data_plans
SET cost_price = 4899, selling_price = 5100
WHERE network = 'MTN' AND size = '14.5 GB';

UPDATE data_plans
SET cost_price = 8830, selling_price = 9200
WHERE network = 'MTN' AND size = '40.0 GB';

UPDATE data_plans
SET cost_price = 10820, selling_price = 11200
WHERE network = 'MTN' AND size = '32.0 GB';

UPDATE data_plans
SET cost_price = 17750, selling_price = 18500
WHERE network = 'MTN' AND size = '75.0 GB';

UPDATE data_plans
SET cost_price = 24350, selling_price = 25000
WHERE network = 'MTN' AND size = '90.0 GB';

UPDATE data_plans
SET cost_price = 34300, selling_price = 35500
WHERE network = 'MTN' AND size = '165.0 GB';

UPDATE data_plans
SET cost_price = 39200, selling_price = 40500
WHERE network = 'MTN' AND size = '150.0 GB';

UPDATE data_plans
SET cost_price = 53000, selling_price = 54500
WHERE network = 'MTN' AND size = '250.0 GB';

UPDATE data_plans
SET cost_price = 87930, selling_price = 90000
WHERE network = 'MTN' AND size = '480.0 GB';

-- Update GLO data plans
UPDATE data_plans
SET cost_price = 83, selling_price = 100
WHERE network = 'GLO' AND size = '200.0 MB';

UPDATE data_plans
SET cost_price = 195, selling_price = 220
WHERE network = 'GLO' AND size = '1.0 GB' AND validity = '1 DAY VALIDITY';

UPDATE data_plans
SET cost_price = 205, selling_price = 230
WHERE network = 'GLO' AND size = '500.0 MB' AND validity = '30 DAY VALIDITY';

UPDATE data_plans
SET cost_price = 275, selling_price = 300
WHERE network = 'GLO' AND size = '1.0 GB' AND validity = '3 Days';

UPDATE data_plans
SET cost_price = 290, selling_price = 320
WHERE network = 'GLO' AND size = '1.5 GB' AND validity = '1 DAY VALIDITY';

UPDATE data_plans
SET cost_price = 320, selling_price = 350
WHERE network = 'GLO' AND size = '1.0 GB' AND validity = '7 DAYS';

UPDATE data_plans
SET cost_price = 320, selling_price = 350
WHERE network = 'GLO' AND size = '1.0 GB' AND validity = '14 DAYS ( Night )';

UPDATE data_plans
SET cost_price = 410, selling_price = 450
WHERE network = 'GLO' AND size = '1.0 GB' AND validity = '30days';

UPDATE data_plans
SET cost_price = 482, selling_price = 520
WHERE network = 'GLO' AND size = '2.5 GB' AND validity = '2 DAYS VALIDITY';

UPDATE data_plans
SET cost_price = 825, selling_price = 880
WHERE network = 'GLO' AND size = '3.0 GB' AND validity = '30 days';

UPDATE data_plans
SET cost_price = 820, selling_price = 870
WHERE network = 'GLO' AND size = '2.0 GB' AND validity = '30days';

UPDATE data_plans
SET cost_price = 960, selling_price = 1020
WHERE network = 'GLO' AND size = '3.0 GB' AND validity = '14 DAYS ( Night )';

UPDATE data_plans
SET cost_price = 960, selling_price = 1020
WHERE network = 'GLO' AND size = '3.0 GB' AND validity = '7 DAYS';

UPDATE data_plans
SET cost_price = 1230, selling_price = 1300
WHERE network = 'GLO' AND size = '3.0 GB' AND validity = '30days';

UPDATE data_plans
SET cost_price = 1600, selling_price = 1700
WHERE network = 'GLO' AND size = '5.0 GB' AND validity = '14 DAYS ( Night )';

UPDATE data_plans
SET cost_price = 1600, selling_price = 1700
WHERE network = 'GLO' AND size = '5.0 GB' AND validity = '7 DAYS';

UPDATE data_plans
SET cost_price = 1925, selling_price = 2050
WHERE network = 'GLO' AND size = '10.0 GB' AND validity = '7 DAYS VALIDITY';

UPDATE data_plans
SET cost_price = 2050, selling_price = 2200
WHERE network = 'GLO' AND size = '5.0 GB' AND validity = '30days';

UPDATE data_plans
SET cost_price = 3200, selling_price = 3400
WHERE network = 'GLO' AND size = '10.0 GB' AND validity = '14 DAYS ( Night )';

UPDATE data_plans
SET cost_price = 4100, selling_price = 4300
WHERE network = 'GLO' AND size = '10.0 GB' AND validity = '30days';

-- Update AIRTEL data plans
UPDATE data_plans
SET cost_price = 355, selling_price = 380
WHERE network = 'AIRTEL' AND size = '1.0 GB' AND validity = '3 Days Don\'t buy if owing';

UPDATE data_plans
SET cost_price = 355, selling_price = 380
WHERE network = 'AIRTEL' AND size = '1.0 GB' AND validity = '1 Day - Don\'t buy if owing';

UPDATE data_plans
SET cost_price = 410, selling_price = 440
WHERE network = 'AIRTEL' AND size = '1.5 GB' AND validity = '1 Day Don\'t buy if owing';

UPDATE data_plans
SET cost_price = 480, selling_price = 520
WHERE network = 'AIRTEL' AND size = '500.0 MB' AND validity = '30days';

UPDATE data_plans
SET cost_price = 560, selling_price = 600
WHERE network = 'AIRTEL' AND size = '2.0 GB' AND validity = '2 Days Don\'t buy if owing';

UPDATE data_plans
SET cost_price = 819, selling_price = 870
WHERE network = 'AIRTEL' AND size = '4.0 GB' AND validity = '2 Days Don\'t buy if owing';

UPDATE data_plans
SET cost_price = 960, selling_price = 1020
WHERE network = 'AIRTEL' AND size = '1.0 GB' AND validity = '30days';

UPDATE data_plans
SET cost_price = 1375, selling_price = 1450
WHERE network = 'AIRTEL' AND size = '5.0 GB' AND validity = '3 Days';

UPDATE data_plans
SET cost_price = 1920, selling_price = 2000
WHERE network = 'AIRTEL' AND size = '2.0 GB' AND validity = '30days';

UPDATE data_plans
SET cost_price = 2080, selling_price = 2200
WHERE network = 'AIRTEL' AND size = '7.0 GB' AND validity = '7 Days Don\'t buy if owing';

UPDATE data_plans
SET cost_price = 3080, selling_price = 3200
WHERE network = 'AIRTEL' AND size = '10.0 GB' AND validity = '30 Days Don\'t buy if owing';

UPDATE data_plans
SET cost_price = 4800, selling_price = 5000
WHERE network = 'AIRTEL' AND size = '5.0 GB' AND validity = '30days';

UPDATE data_plans
SET cost_price = 5040, selling_price = 5200
WHERE network = 'AIRTEL' AND size = '13.0 GB' AND validity = '30 Days Don\'t buy if owing';

UPDATE data_plans
SET cost_price = 9600, selling_price = 9900
WHERE network = 'AIRTEL' AND size = '10.0 GB' AND validity = '30days';

UPDATE data_plans
SET cost_price = 10050, selling_price = 10300
WHERE network = 'AIRTEL' AND size = '35.0 GB' AND validity = '30 Days Don\'t buy if owing';

UPDATE data_plans
SET cost_price = 14400, selling_price = 14800
WHERE network = 'AIRTEL' AND size = '15.0 GB' AND validity = '30days';

UPDATE data_plans
SET cost_price = 15050, selling_price = 15400
WHERE network = 'AIRTEL' AND size = '60.0 GB' AND validity = '30 Days Don\'t buy if owing';

UPDATE data_plans
SET cost_price = 19200, selling_price = 19700
WHERE network = 'AIRTEL' AND size = '20.0 GB' AND validity = '30days';

UPDATE data_plans
SET cost_price = 20050, selling_price = 20500
WHERE network = 'AIRTEL' AND size = '100.0 GB' AND validity = '30 Days Don\'t buy if owing';

-- Update 9MOBILE data plans
UPDATE data_plans
SET cost_price = 65, selling_price = 80
WHERE network = '9MOBILE' AND size = '500.0 MB' AND validity = '30 DAYS';

UPDATE data_plans
SET cost_price = 130, selling_price = 150
WHERE network = '9MOBILE' AND size = '1.0 GB' AND validity = '30 DAYS';

UPDATE data_plans
SET cost_price = 195, selling_price = 220
WHERE network = '9MOBILE' AND size = '1.5 GB' AND validity = '30 DAYS';

UPDATE data_plans
SET cost_price = 260, selling_price = 290
WHERE network = '9MOBILE' AND size = '2.0 GB' AND validity = '30 DAYS';

UPDATE data_plans
SET cost_price = 390, selling_price = 420
WHERE network = '9MOBILE' AND size = '3.0 GB' AND validity = '30 DAYS';

UPDATE data_plans
SET cost_price = 519, selling_price = 550
WHERE network = '9MOBILE' AND size = '4.0 GB' AND validity = '30days';

UPDATE data_plans
SET cost_price = 585, selling_price = 620
WHERE network = '9MOBILE' AND size = '4.5 GB' AND validity = '30 DAYS';

UPDATE data_plans
SET cost_price = 649, selling_price = 690
WHERE network = '9MOBILE' AND size = '5.0 GB' AND validity = '30 DAYS';

UPDATE data_plans
SET cost_price = 1299, selling_price = 1350
WHERE network = '9MOBILE' AND size = '10.0 GB' AND validity = '30 DAYS';

UPDATE data_plans
SET cost_price = 1429, selling_price = 1500
WHERE network = '9MOBILE' AND size = '11.0 GB' AND validity = '30 DAYS';

UPDATE data_plans
SET cost_price = 2059, selling_price = 2150
WHERE network = '9MOBILE' AND size = '15.0 GB' AND validity = '30 DAYS';

UPDATE data_plans
SET cost_price = 2099, selling_price = 2200
WHERE network = '9MOBILE' AND size = '20.0 GB' AND validity = '30 DAYS';

UPDATE data_plans
SET cost_price = 5199, selling_price = 5400
WHERE network = '9MOBILE' AND size = '40.0 GB' AND validity = '30days';

-- Update profit margins based on the new prices
UPDATE data_plans
SET profit_margin = selling_price - cost_price
WHERE selling_price > cost_price;

-- Mark some plans as popular for better visibility
UPDATE data_plans SET is_popular = true WHERE network = 'MTN' AND size = '1.0 GB' AND validity = '30 DAY VALIDITY';
UPDATE data_plans SET is_popular = true WHERE network = 'MTN' AND size = '2.0 GB' AND validity = '30 DAY VALIDITY';
UPDATE data_plans SET is_popular = true WHERE network = 'MTN' AND size = '5.0 GB' AND validity = '30 DAY VALIDITY';
UPDATE data_plans SET is_popular = true WHERE network = 'MTN' AND size = '10.0 GB' AND validity = '30 DAY VALIDITY';

UPDATE data_plans SET is_popular = true WHERE network = 'GLO' AND size = '1.0 GB' AND validity = '30days';
UPDATE data_plans SET is_popular = true WHERE network = 'GLO' AND size = '2.0 GB' AND validity = '30days';
UPDATE data_plans SET is_popular = true WHERE network = 'GLO' AND size = '5.0 GB' AND validity = '30days';

UPDATE data_plans SET is_popular = true WHERE network = 'AIRTEL' AND size = '1.0 GB' AND validity = '30days';
UPDATE data_plans SET is_popular = true WHERE network = 'AIRTEL' AND size = '2.0 GB' AND validity = '30days';
UPDATE data_plans SET is_popular = true WHERE network = 'AIRTEL' AND size = '5.0 GB' AND validity = '30days';

UPDATE data_plans SET is_popular = true WHERE network = '9MOBILE' AND size = '1.0 GB' AND validity = '30 DAYS';
UPDATE data_plans SET is_popular = true WHERE network = '9MOBILE' AND size = '2.0 GB' AND validity = '30 DAYS';
UPDATE data_plans SET is_popular = true WHERE network = '9MOBILE' AND size = '5.0 GB' AND validity = '30 DAYS';

-- Add discount badges to some plans
UPDATE data_plans SET discount_percentage = 10, show_discount_badge = true 
WHERE network = 'MTN' AND size IN ('1.0 GB', '2.0 GB', '5.0 GB') AND validity = '30 DAY VALIDITY';

UPDATE data_plans SET discount_percentage = 15, show_discount_badge = true 
WHERE network = 'AIRTEL' AND size IN ('1.0 GB', '2.0 GB', '5.0 GB') AND validity = '30days';

UPDATE data_plans SET discount_percentage = 12, show_discount_badge = true 
WHERE network = 'GLO' AND size IN ('1.0 GB', '2.0 GB', '5.0 GB') AND validity = '30days';

UPDATE data_plans SET discount_percentage = 8, show_discount_badge = true 
WHERE network = '9MOBILE' AND size IN ('1.0 GB', '2.0 GB', '5.0 GB') AND validity = '30 DAYS';