--Functions to format Json are explained below 

-- Original result

SELECT * FROM self_fetch_tt(2,3) AS row

-- ARRAY_AGG: values to array

SELECT p_id,array_agg(t_id) AS time_array,array_agg(tt) as tt_array FROM self_fetch_tt(2,3) group by p_id

-- ROW_TO_JSON: record TO json
SELECT ROW_TO_JSON(row) FROM self_fetch_tt(2,3) AS row

-- JSON_AGG : json row to a single json array , = ARRAY_TO_JSON+ARRAY_AGG 
SELECT JSON_AGG(ROW_TO_JSON(row)) FROM self_fetch_tt(2,3) AS row

-- For nested Json, passing a row to JSON_AGG() and the row contains an array column, 
-- Final result
SELECT JSON_AGG(ROW_TO_JSON(row)) FROM 
(SELECT p_id,array_agg(t_id) AS time_array,array_agg(tt) as tt_array FROM self_fetch_tt(2,10) group by p_id)
AS row
-- "[{"p_id":1,"time_array":[1,2,3],"tt_array":[56,56,58]}, {"p_id":2,"time_array":[1,2,3],"tt_array":[57,51,51]}]"


-- Format the result as GeoJson

-- The principle is that with ST_AsGeoJson() we can convert geometry to Json,(not GeoJson)
-- then construct a complete GeoJson from the Jsons. 
-- See the example below

select *,ST_ASGEOJSON(geom) from pgr_node limit 10
-- This is the output GeoJson format with type of text: {"type":"Point","coordinates":[18.00232,59.30109]}
-- http://www.postgresonline.com/journal/archives/267-Creating-GeoJSON-Feature-Collections-with-JSON-and-PostGIS-functions.html

-- From integer to row, just using row(integer)

SELECT row_to_json(fc) FROM 
(
SELECT 'FeatureCollection' As type, array_to_json(array_agg(f)) As features from 
(
select 'Feature' AS type , 
ST_ASGEOJSON(geom)::json AS geometry,
row_to_json(row(id)) As properties
from pgr_node limit 2
) f
) fc












