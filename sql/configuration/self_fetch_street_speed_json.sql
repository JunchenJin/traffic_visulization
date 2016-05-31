﻿-- Function: self_fetch_street_speed_json()

-- DROP FUNCTION self_fetch_street_speed_json();

CREATE OR REPLACE FUNCTION self_fetch_street_speed_json()
  RETURNS json AS
$BODY$
SELECT row_to_json(fc) FROM 
(
SELECT 'FeatureCollection' As type, array_to_json(array_agg(f)) As features from 
(
	select 'Feature' AS type , 
	ST_ASGEOJSON(geom)::json AS geometry,
	row_to_json(row(link_id,speed_array)) As properties
	from 
	(
	SELECT e.*,d.geom FROM
	(
	SELECT c.link_id,array_agg(speed) AS speed_array from 
	(
		select a.link_id,a.interval_index,s.length/a.mean as speed from  phd_work.truck_ltt a 
		join (
		select link_id,count(*) AS count from phd_work.truck_ltt group by link_id having count(*) = 48
		) b 
		on a.link_id=b.link_id 
		JOIN street s ON b.link_id=s.link_id order by link_id,interval_index
		
	) c group by link_id
	) e 
	join street d 
	on 
	e.link_id=d.link_id
	) g
) f
) fc
$BODY$
  LANGUAGE sql VOLATILE
  COST 100;
ALTER FUNCTION self_fetch_street_speed_json()
  OWNER TO postgres;
