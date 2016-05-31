--create topology information, node table, path table
--create functions to return the paths



-- create a table to store node of network,geom with srid 4326 

CREATE TABLE pgr_node
(
  id integer,
  geom geometry,
  CONSTRAINT pgr_node_id_key UNIQUE (id)
)
ALTER TABLE pgr_node
  OWNER TO canyang;

-- insert the nodes to the table based on topology table
INSERT INTO pgr_node
SELECT DISTINCT source, ST_SetSRID(ST_MakePoint(x1,y1),4326) as geom from at_2po_4pgr
Union
SELECT DISTINCT target, ST_SetSRID(ST_MakePoint(x2,y2),4326) from at_2po_4pgr;

-- create index on the geom column
CREATE INDEX idx_at_pgr_node
  ON pgr_node USING GIST (geom);

  

-- Function overloading is supported in postgresql, functions are identified with name and input parameter type
-- Input parameters: defined in the arguments prefixed with Keyword IN, refered in the function as: 
--	$1,$2	
--	name_of_parameters
-- output results: define in two ways:
-- 	Single row: defined in function arguments prefixed with keyword OUT 	
-- 	Multiple rows: returns as TABLE([arguments])
-- Return values to results in fuctions:
--	Single row:select into single values
-- 	Multiple rows: RETURN QUERIES SELECT ...


-- create three functions to query shortest path from OD with input type as: lat&lng,node_id,geometry
CREATE OR REPLACE FUNCTION self_get_shortestpath(IN source_id integer, IN target_id integer, OUT sumlength double precision, OUT path geometry)
  RETURNS record AS
$BODY$
BEGIN
select into sumlength,path
sum(c.km),st_collect(c.geom_way) 
from
(
select (pgr_dijkstra('
                SELECT id AS id,
                         source::integer,
                         target::integer,
                         cost AS cost,
                         reverse_cost
                        FROM at_2po_4pgr',
                   $1, $2, true, true)).*
                 )
                  b
                 join
                 at_2po_4pgr c on b.id2=c.id; --order by seq        
END
$BODY$
  LANGUAGE plpgsql

CREATE OR REPLACE FUNCTION self_get_shortestpath(IN source_geom geometry, IN target_geom geometry, OUT sumlength double precision, OUT path geometry) AS
$BODY$
declare
source integer;
target integer;
BEGIN
SELECT id into source
FROM pgr_node a
ORDER BY a.geom <-> $1
LIMIT 1;
SELECT id into target
FROM pgr_node a
ORDER BY a.geom <-> $2
LIMIT 1;
select * into sumlength,path 
from self_get_shortestpath(source,target);
 --order by seq        
END
$BODY$
LANGUAGE plpgsql

CREATE OR REPLACE FUNCTION self_get_shortestpath(IN long1 double precision, IN lat1 double precision,IN long2 double precision, IN lat2 double precision, OUT sumlength double precision, OUT path geometry) AS
$BODY$
declare
source integer;
target integer;
s_geom geometry;
t_geom geometry;
BEGIN
SELECT st_setsrid(st_makepoint(long1,lat1),4326) INTO s_geom;
SELECT st_setsrid(st_makepoint(long2,lat2),4326) INTO t_geom;
SELECT id into source
FROM pgr_node a
ORDER BY a.geom <-> s_geom
LIMIT 1;
SELECT id into target
FROM pgr_node a
ORDER BY a.geom <-> t_geom
LIMIT 1;
select * into sumlength,path 
from self_get_shortestpath(source,target);
 --order by seq        
END
$BODY$
LANGUAGE plpgsql;

-- create three functions to query k shortest paths from OD with input type as: lat&lng,node_id,geometry
CREATE OR REPLACE FUNCTION self_get_k_shortestpathV2(IN source_id integer, IN destination_id integer, IN num_path integer)
RETURNS TABLE(seq integer,route integer,edge integer) AS 
$$
SELECT seq, id1 AS route, id3 AS edge from pgr_ksp('
                SELECT id AS id,
                         source::integer,
                         target::integer,
                         cost AS cost,
                         reverse_cost
                        FROM at_2po_4pgr', $1,$2,
                         $3, true) 

$$ LANGUAGE SQL



CREATE OR REPLACE FUNCTION self_get_k_shortestpathV2(IN source_geom geometry, IN target_geom geometry, IN num_path integer)
RETURNS TABLE(seq integer,route integer,edge integer) AS 
$BODY$
declare
source integer;
target integer;
BEGIN
SELECT id into source
FROM pgr_node a
ORDER BY a.geom <-> $1
LIMIT 1;
SELECT id into target
FROM pgr_node a
ORDER BY a.geom <-> $2
LIMIT 1;
RETURN QUERY
select * 
from self_get_k_shortestpathV2(source,target,num_path);
END
$BODY$ LANGUAGE plpgsql


CREATE OR REPLACE FUNCTION self_get_k_shortestpathv2(IN long1 double precision, IN lat1 double precision,IN long2 double precision, IN lat2 double precision, IN num_path integer)
RETURNS TABLE(seq integer,route integer,edge integer) AS 
$BODY$
declare
source integer;
target integer;
s_geom geometry;
t_geom geometry;
BEGIN
SELECT st_setsrid(st_makepoint(long1,lat1),4326) INTO s_geom;
SELECT st_setsrid(st_makepoint(long2,lat2),4326) INTO t_geom;
SELECT id into source
FROM pgr_node a
ORDER BY a.geom <-> s_geom
LIMIT 1;
SELECT id into target
FROM pgr_node a
ORDER BY a.geom <-> t_geom
LIMIT 1;
RETURN QUERY
select * 
from self_get_k_shortestpathV2(source,target,num_path);
END
$BODY$ LANGUAGE plpgsql




CREATE OR REPLACE FUNCTION self_fetch_path_json(IN long1 double precision, IN lat1 double precision,IN long2 double precision, IN lat2 double precision, IN num_path integer)
  RETURNS json AS
$BODY$
SELECT row_to_json(fc) FROM 
	(
		SELECT 'FeatureCollection' As type, array_to_json(array_agg(f)) As features from 
		(
			SELECT 'Feature' AS type , 
				ST_ASGEOJSON(geom)::json AS geometry,
				row_to_json((route,length,time)) As properties
			from 
				(
					SELECT route,sum(km) as length,sum(cost) as time ,ST_LineMerge(ST_Union(geom)) as geom 
					FROM 
					(
						SELECT a.*,b.km,b.cost,b.geom_way AS geom FROM self_get_k_shortestpathV2(
						long1,lat1,
						long2,lat2,num_path
					) 
					a JOIN at_2po_4pgr b ON a.edge=b.id order by a.seq
				) c 
			group by route order by route
		) d
	) f
) fc
$BODY$
  LANGUAGE sql VOLATILE
  COST 100;

CREATE OR REPLACE FUNCTION self_fetch_path_jsonV1(IN long1 double precision, IN lat1 double precision,IN long2 double precision, IN lat2 double precision)
  RETURNS json AS
$BODY$
SELECT row_to_json(fc) FROM 
	(
		SELECT 'FeatureCollection' As type, array_to_json(array_agg(f)) As features from 
		(
			SELECT 'Feature' AS type , 
				ST_ASGEOJSON(geom)::json AS geometry,
				row_to_json((route,length,time)) As properties
			from 
				(
					
						SELECT a.*,b.km,b.cost,b.geom_way AS geom FROM self_get_shortestpathV1(
						long1,lat1,
						long2,lat2
					) 				
		) d
	) f
) fc
$BODY$
  LANGUAGE sql VOLATILE
  COST 100;

SELECT row_to_json(fc) FROM 
	(
		SELECT 'FeatureCollection' As type, array_to_json(array_agg(f)) As features from 
		(
			SELECT 'Feature' AS type , 
				ST_ASGEOJSON(geom)::json AS geometry,
				row_to_json((route,length,time)) As properties
			from 
				(
					
						SELECT a.*,b.km,b.cost,b.geom_way AS geom FROM self_get_shortestpathV1(
						long1,lat1,
						long2,lat2
					) 				
		) d
	) f
) fc
  