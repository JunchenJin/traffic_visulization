CREATE TABLE network_sri
(
  link_id integer,
  interval_index integer,
  avgspeed numeric,
  freespeed numeric,
  length double precision,
  speed_limit integer
)


select interval_index,avg(length/samples)*3.6  from (
select length,unnest(samples)AS samples ,interval_index from network_ltt where link_id=29981500 
) a group by interval_index order by interval_index

SELECT * FROM network_sri

INSERT INTO network_sri
(link_id,interval_index, avgspeed) 
select link_id,interval_index,avg(length/samples)*3.6 from (
select length,unnest(samples)AS samples ,interval_index,link_id from network_ltt 
) a group by link_id,interval_index order by link_id,interval_index


delete  from network_sri where link_id=706674375

UPDATE network_sri SET freespeed=d.freespeed,length=d.length,speed_limit=d.speed_limit FROM
(SELECT b.*,c.length,c.speed_limit from
	(
	select link_id,avg(length/samples)*3.6 AS freespeed from (
	select length,unnest(samples)AS samples ,link_id from network_ltt WHERE interval_index in (2,3,4,5,40,41,42,43) --1:00-3:00 8:00-10:00pm
	) a group by link_id 
	) b
	join street c on b.link_id=c.link_id) AS d 
WHERE network_sri.link_id=d.link_id


CREATE OR REPLACE FUNCTION self_fetch_sri_json()
  RETURNS json AS
$BODY$
SELECT row_to_json(fc) FROM 
(
SELECT 'FeatureCollection' As type, array_to_json(array_agg(f)) As features from 
(
	select 'Feature' AS type , 
	ST_ASGEOJSON(geom)::json AS geometry,
	row_to_json(row(link_id,sri_array)) As properties
	from 
	(
	SELECT e.*,d.geom FROM
	(
	SELECT c.link_id,array_agg(sri) AS sri_array from 
	(
		select link_id,interval_index,avgspeed/freespeed as sri from network_sri order by link_id,interval_index
		
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


 select self_fetch_sri_json()

 SELECT link_id,interval_index,samples,length FROM network_ltt WHERE link_id !=706674375
 SELECT link_id,interval_index,samples,length FROM network_ltt WHERE link_id =28004682
 

 