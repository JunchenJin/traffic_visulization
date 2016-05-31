-- Function: self_fetch_street_network()

-- DROP FUNCTION self_fetch_street_network();

CREATE OR REPLACE FUNCTION self_fetch_street_network()
  RETURNS json AS
$BODY$
SELECT row_to_json(fc) FROM 
(
SELECT 'FeatureCollection' As type, array_to_json(array_agg(f)) As features from 
(
	select 'Feature' AS type , 
	ST_ASGEOJSON(geom)::json AS geometry,
	row_to_json(row(link_id)) As properties
	from 
	(
		SELECT link_id,geom FROM street
	) a
) f
) fc
$BODY$
  LANGUAGE sql VOLATILE
  COST 100;
ALTER FUNCTION self_fetch_street_network()
  OWNER TO postgres;
