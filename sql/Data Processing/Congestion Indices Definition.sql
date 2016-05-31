CREATE TABLE network_tti
(
  link_id integer,
  interval_index integer,
  avgltt numeric,
  freeltt numeric,
  length double precision,
  speed_limit integer
)

select avg(length/samples)*3.6,speed_limit from (
select length,unnest(samples),speed_limit AS samples from network_ltt where interval_index in (16,17)
) a 
-- 63
SELECT length/avgltt*3.6,speed_limit FROM network_ltt limit 100

select interval_index,avg(length/samples)*3.6  from (
select length,unnest(samples)AS samples ,interval_index from network_ltt where link_id=29981500 
) a group by interval_index order by interval_index




select interval_index,avg(samples) from (
select unnest(samples)AS samples ,interval_index from network_ltt where link_id=29981500 
) a group by interval_index order by interval_index



INSERT INTO network_tti 
(link_id,interval_index, avgltt) 
select link_id,interval_index,avg(samples) from (
select unnest(samples)AS samples ,interval_index,link_id from network_ltt 
) a group by link_id,interval_index order by link_id,interval_index

delete  from network_tti where link_id=706674375
SELECT link_id,count(interval_index) FROM network_tti group by link_id

UPDATE network_tti SET freeltt=d.freeltt,length=d.length,speed_limit=d.speed_limit FROM
(SELECT b.*,c.length,c.speed_limit from
	(
	select link_id,avg(samples) AS freeltt from (
	select unnest(samples)AS samples ,link_id from network_ltt WHERE interval_index in (2,3,4,5,40,41,42,43)
	) a group by link_id 
	) b
	join street c on b.link_id=c.link_id) AS d 
WHERE network_tti.link_id=d.link_id



SELECT link_id,length FROM street 

--TODO 
-- How to add the congestion indices to the web page?

CREATE OR REPLACE FUNCTION self_fetch_tti_json()
  RETURNS json AS
$BODY$
SELECT row_to_json(fc) FROM 
(
SELECT 'FeatureCollection' As type, array_to_json(array_agg(f)) As features from 
(
	select 'Feature' AS type , 
	ST_ASGEOJSON(geom)::json AS geometry,
	row_to_json(row(link_id,tti_array)) As properties
	from 
	(
	SELECT e.*,d.geom FROM
	(
	SELECT c.link_id,array_agg(tti) AS tti_array from 
	(
		select link_id,interval_index,avgltt/freeltt as tti from network_tti 
		order by link_id,interval_index
		
	) c group by link_id
	) e 
	join 
	street d 
	on 
	e.link_id=d.link_id
	) g
) f
) fc
$BODY$
 LANGUAGE sql VOLATILE

select a.link_id,a.interval_index,s.length/a.mean*3.6 as speed from  phd_work.truck_ltt a 
		join (
		select link_id,count(*) AS count from phd_work.truck_ltt group by link_id having count(*) = 48
		) b 
		on a.link_id=b.link_id 
		JOIN street s ON b.link_id=s.link_id where s.level=1 AND s.speed_limit>=70 order by link_id,interval_index

SELECT * FROM street s WHERE s.level=1 AND s.speed_limit>=70 