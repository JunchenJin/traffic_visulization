SELECT link_id,interval_index,samples,self_percentile_cont(samples,0.95)FROM network_ltt WHERE link_id =28004682

SELECT * FROM network_ltt limit 10

SELECT link_id,interval_index,length,speed_limit,unnest(samples) AS ltt,unnest(weights) as weight FROM network_ltt 
-- 1100922 rows
-- It takes about 26 seconds in PgAdmin to fetch and present the result
-- but take only several seconds to fetch the data in python

SELECT * FROM phd_work.truckltt_daily where link_id=709742708 order by interval_index

SELECT * FROM network_ltt WHERE link_id=811451969 AND interval_index= 47

SELECT * FROM network_tti limit 10 



ALTER TABLE network_ltt ADD COLUMN avgltt numeric;
ALTER TABLE network_ltt ADD COLUMN freeltt numeric;
ALTER TABLE network_ltt ADD COLUMN per_95 numeric;


UPDATE network_ltt SET freeltt=d.freeltt FROM
(SELECT b.*,c.length,c.speed_limit from
	(
	select link_id,avg(samples) AS freeltt from (
	select unnest(samples)AS samples ,link_id from network_ltt WHERE interval_index in (2,3,4,5,40,41,42,43)
	) a group by link_id 
	) b
	join street c on b.link_id=c.link_id) AS d 
WHERE network_ltt.link_id=d.link_id


UPDATE network_ltt SET avgltt=d.avgltt FROM
(SELECT b.*,c.length,c.speed_limit from
	(
	select link_id,interval_index,avg(samples) AS avgltt from (
	select unnest(samples)AS samples ,link_id,interval_index from network_ltt
	) a group by link_id,interval_index 
	) b
	join street c on b.link_id=c.link_id) AS d 
WHERE network_ltt.link_id=d.link_id AND network_ltt.interval_index=d.interval_index

UPDATE network_ltt SET per_95=d.per_95 FROM
(
SELECT link_id,interval_index,self_percentile_cont(samples,0.95) as per_95   FROM network_ltt 
) AS d 
WHERE network_ltt.link_id=d.link_id AND network_ltt.interval_index=d.interval_index


CREATE OR REPLACE FUNCTION self_fetch_pti_json()
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
	SELECT c.link_id,array_agg(pti) AS tti_array from 
	(
		select link_id,interval_index,per_95/freeltt as pti from network_ltt order by link_id,interval_index
		
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

CREATE OR REPLACE FUNCTION self_fetch_bfi_json()
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
	SELECT c.link_id,array_agg(bfi) AS tti_array from 
	(
		select link_id,interval_index,per_95/avgltt as bfi from network_ltt order by link_id,interval_index
		
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











--------------------------------------------------------------------------------
CREATE OR REPLACE FUNCTION self_percentile_cont(myarray real[], percentile real)
RETURNS real AS
$$

DECLARE
  ary_cnt INTEGER;
  row_num real;
  crn real;
  frn real;
  calc_result real;
  new_array real[];
BEGIN
  ary_cnt = array_length(myarray,1);
  row_num = 1 + ( percentile * ( ary_cnt - 1 ));
  new_array = array_sort(myarray);

  crn = ceiling(row_num);
  frn = floor(row_num);

  if crn = frn and frn = row_num then
    calc_result = new_array[row_num];
  else
    calc_result = (crn - row_num) * new_array[frn] 
            + (row_num - frn) * new_array[crn];
  end if;

  RETURN calc_result;
END;
$$
  LANGUAGE 'plpgsql' IMMUTABLE;
CREATE OR REPLACE FUNCTION array_sort (ANYARRAY)
RETURNS ANYARRAY LANGUAGE SQL
AS $$
SELECT ARRAY(
    SELECT $1[s.i] AS "foo"
    FROM
        generate_series(array_lower($1,1), array_upper($1,1)) AS s(i)
    ORDER BY foo
);
$$;
