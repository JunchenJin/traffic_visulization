SELECT interval_index,avgspeed/speed_limit as si ,avgltt/freeltt AS tti, per_95/freeltt as pti, (per_95-avgltt)/avgltt as bfi FROM network_ltt 
limit 100