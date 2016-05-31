SELECT * FROM phd_work.truckltt_daily limit 10
SELECT DISTINCT link_id FROM phd_work.truckltt_daily

SELECT SUM(array_length(samples,1)) FROM network_ltt 


SELECT sum(sample_size) FROM phd_work.truckltt_daily