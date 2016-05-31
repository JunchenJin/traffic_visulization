CREATE OR REPLACE FUNCTION public.self_fetch_spi_json()
  RETURNS json AS
$BODY$
SELECT row_to_json(fc) FROM 
(
SELECT 'FeatureCollection' As type, array_to_json(array_agg(f)) As features from 
(
	select 'Feature' AS type , 
	ST_ASGEOJSON(geom)::json AS geometry,
	row_to_json(row(link_id,spi_array)) As properties
	from 
	(
	SELECT e.*,d.geom FROM
	(
	SELECT c.link_id,array_agg(spi) AS spi_array from 
	(
		select link_id,interval_index,length*3.6/avgltt/speed_limit as spi from network_ltt order by link_id,interval_index
		
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
  COST 100;

SELECT * FROM self_fetch_spi_json()


select * from self_fetch_spi_json()

  
