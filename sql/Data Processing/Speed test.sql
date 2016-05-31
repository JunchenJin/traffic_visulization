select a.link_id from  phd_work.truck_ltt a 
		join (
		select link_id,count(*) AS count from phd_work.truck_ltt group by link_id having count(*) = 48
		) b 
		on a.link_id=b.link_id 
		JOIN street s ON b.link_id=s.link_id where s.level=1 AND s.speed_limit>=70 order by link_id
--3312
--69

insert into network_ltt
SELECT n.* FROM (select link_id,count(*) AS count from phd_work.truck_ltt group by link_id having count(*) = 48) a
		JOIN (SELECT * FROM street s where s.level=1 AND s.speed_limit>=70) b
		ON a.link_id=b.link_id 
		JOIN network_lttV1 n
		ON a.link_id=n.link_id

ALTER TABLE network_ltt ADD COLUMN avgspeed double precision

UPDATE network_ltt 
SET freeltt = length/speed_limit*3.6
UPDATE network_ltt 
SET avgspeed= length/avgltt*3.6


SELECT * FROM network_ltt limit 10		

DELETE FROM network_ltt 

CREATE TABLE public.network_lttV1
(
  link_id integer,
  interval_index integer,
  samples integer[],
  weights double precision[],
  length double precision,
  speed_limit integer,
  avgltt numeric,
  freeltt numeric,
  per_95 numeric
)

insert into network_lttV1 SELECT * FROM network_ltt


SELECT * FROM street s WHERE s.level=1 AND s.speed_limit>=70 order by link_id

SELECT 69*48