-- Test with two tables

SELECT DISTINCT link_id FROM phd_work.truckltt_daily
-- 1404 links

SELECT DISTINCT link_id FROM phd_work.truck_ltt
-- 1392 links some data was filtered

SELECT sum(sample_size) FROM phd_work.truckltt_daily
-- 1416808

SELECT * FROM phd_work.truckltt_daily limit 10

SELECT sum(sample_size) FROM phd_work.truck_ltt
-- 1232852 some data was filtered

SELECT SUM(array_length(samples,1)) FROM network_ltt 

SELECT SUM(array_length(samples,1)) FROM network_ltt where link_id=29981500
-- 25134

SELECT * FROM network_ltt where link_id=29981500



-- create a table with free flow travel time
select avg(samples) from (
select unnest(samples) AS samples from network_ltt where link_id=29981500 AND interval_index in (2,3,4,5)
) a 
--60



 -- 1100922 on the major road 

-- Generate major roads
-- From truck_ltt, the data are filtered based on the major road and then added to the network_ltt with intervals


SELECT interval_index,samples as data FROM network_ltt WHERE link_id= LINKID order by interval_index

SELECT interval_index,samples as data FROM network_ltt WHERE link_id= LINKID order by interval_index
SELECT link_id,samples FROM network_ltt WHERE interval_index=20 AND link_id in (709742666, 724982779)




