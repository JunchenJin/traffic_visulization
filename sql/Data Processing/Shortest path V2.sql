CREATE TABLE network
(
  id integer,
  geom geometry,
  length double precision
);
DROP TABLE network CASCADE;
DROP TABLE network_vertices_pgr CASCADE;

INSERT INTO network SELECT link_id,geom,length FROM street s WHERE s.level=1 AND s.speed_limit>=70;
ALTER TABLE network ADD COLUMN source integer;
ALTER TABLE network ADD COLUMN target integer;

SELECT pgr_createTopology('network', 0.00001, 'geom', 'id');
ALTER TABLE network_vertices_pgr RENAME the_geom TO geom;

--DROP TABLE odcost;
CREATE TABLE odcost
(
  id integer,
  source integer,
  target integer,
  cost double precision
);

-- ALTER TABLE odcost ADD COLUMN links integer[];
-- ALTER TABLE odcost ADD COLUMN routelength double precision;
-- ALTER TABLE odcost ADD COLUMN geom geometry;

INSERT INTO odcost 
SELECT  seq, id1 AS from, id2 AS to, cost
    FROM pgr_apspWarshall(
        'SELECT id, source, target, length AS cost FROM network',
        true, false
    );





CREATE OR REPLACE FUNCTION self_get_shortestpathV1(IN long1 double precision, IN lat1 double precision,IN long2 double precision, IN lat2 double precision, OUT pathlength double precision, OUT path geometry,OUT links integer[])
AS
$BODY$
DECLARE 
oid integer;
did integer;
s_geom geometry;
t_geom geometry;
BEGIN
SELECT st_setsrid(st_makepoint(long1,lat1),4326) INTO s_geom;
SELECT st_setsrid(st_makepoint(long2,lat2),4326) INTO t_geom;
FOR i IN 1..10 LOOP
	SELECT sid,tid INTO oid,did FROM 
		(
		SELECT * FROM 
		(SELECT id AS sid 
		FROM network_vertices_pgr a
		ORDER BY a.geom <-> s_geom
		LIMIT i) a
		CROSS JOIN
		(SELECT id AS tid FROM network_vertices_pgr a ORDER BY a.geom <-> t_geom LIMIT i) b 
		) c JOIN odcost d on c.sid=d.source AND c.tid=d.target ORDER BY cost LIMIT 1;
	IF (oid IS NOT NULL) THEN
		RAISE NOTICE 'Found OID % AND DID % with i %', oid,did,i;
		EXIT;		
	END IF;		
END LOOP;
SELECT sum(c.length),st_collect(c.geom),array_agg(c.id) INTO pathlength,path,links
from
(
select (pgr_dijkstra('
                SELECT id AS id,
                         source::integer,
                         target::integer,
                         length AS cost
                        FROM network',
                  oid, did,true, false)).*
                 )
                  b
                 join
                 network c on b.id2=c.id;
END
$BODY$
LANGUAGE plpgsql;

select (pgr_dijkstra('
                SELECT id AS id,
                         source::integer,
                         target::integer,
                         length AS cost
                        FROM network',
                  36, 78,true, false)).*



SELECT *,self_getroutettfromlinks(links) FROM 
SELECT * FROM self_get_shortestpathV1(17.69067,59.20341,17.998966,59.322889);
SELECT * FROM self_fetch_path_jsonV1(17.69067,59.20341,17.998966,59.322889);

--TODO https://www.google.se/maps/dir/59.3010112,18.0056752/59.2130122,17.7577913/@59.254045,17.9013,12z/data=!4m5!4m4!2m2!7e2!8j1433836800!3e0?hl=en

--Add a line chart to the web map and update the map on the server

ALTER TABLE phd_work.truck_ltt ADD COLUMN length double precision;
UPDATE phd_work.truck_ltt a SET length=b.length FROM network b where a.link_id=b.id

CREATE OR REPLACE FUNCTION self_getroutettfromlinks(IN integer[], OUT double precision[])
  RETURNS double precision[] AS
$BODY$
SELECT array_agg(routett) as routett FROM (
SELECT b.interval_index,COUNT(*),SUM(b.mean/b.length)*SUM(b.length)/COUNT(*) as routett FROM 
	(
		SELECT unnest($1) as link_id
        )
                  a JOIN phd_work.truck_ltt b on a.link_id=b.link_id 
                  GROUP BY b.interval_index ORDER BY b.interval_index 
) c
$BODY$
  LANGUAGE sql VOLATILE
  COST 100;



CREATE OR REPLACE FUNCTION self_fetch_path_jsonV1(IN long1 double precision, IN lat1 double precision,IN long2 double precision, IN lat2 double precision)
 RETURNS json AS
$BODY$
SELECT row_to_json(f) FROM (
SELECT 'Feature' AS type , 
				ST_ASGEOJSON(path)::json AS geometry,
				row_to_json((pathlength,links,self_getroutettfromlinks(links))) As properties
			from self_get_shortestpathV1(long1,lat1,long2,lat2)) f
$BODY$
  LANGUAGE sql VOLATILE
  COST 100;


  


























----------------- TEST -----------------


SELECT array_agg(routett) as routett FROM (
SELECT b.interval_index,COUNT(*),SUM(b.mean/b.length)*SUM(b.length)/COUNT(*) as routett FROM 
	(
		SELECT unnest(links) as link_id FROM self_get_shortestpathV1(17.69067,59.20341,17.998966,59.322889)
        )
                  a JOIN phd_work.truck_ltt b on a.link_id=b.link_id 
                  GROUP BY b.interval_index ORDER BY b.interval_index 
) c















DO
$$
DECLARE 
oid integer;
did integer;
s_geom geometry;
t_geom geometry;
BEGIN
SELECT st_setsrid(st_makepoint(long1,lat1),4326) INTO s_geom;
SELECT st_setsrid(st_makepoint(long2,lat2),4326) INTO t_geom;
FOR i IN 1..10 LOOP
	SELECT sid,tid INTO oid,did FROM 
		(
		SELECT * FROM 
		(SELECT id AS sid 
		FROM network_vertices_pgr a
		ORDER BY a.geom <-> s_geom
		LIMIT i) a
		CROSS JOIN
		(SELECT id AS tid FROM network_vertices_pgr a ORDER BY a.geom <-> t_geom LIMIT i) b 
		) c JOIN odcost d on c.sid=d.source AND c.tid=d.target ORDER BY cost LIMIT 1;
	IF (oid IS NOT NULL) THEN
		RAISE NOTICE 'Found OID % AND DID % with i %', oid,did,i;
		EXIT;		
	END IF;		
END LOOP;
RETURN QUERY 
SELECT sum(c.length),st_collect(c.geom),array_agg(c.id)
from
(
select (pgr_dijkstra('
                SELECT id AS id,
                         source::integer,
                         target::integer,
                         length AS cost
                        FROM network',
                  oid, did,true, false)).*
                 )
                  b
                 join
                 network c on b.id2=c.id;
END
$$
















SELECT row_to_json(f) FROM 
(
SELECT 'Feature' AS type , 
				ST_ASGEOJSON(path)::json AS geometry,
				row_to_json(row(sumlength)) As properties FROM 
(
SELECT * FROM self_get_shortestpathV1(36,78) ) a
) f




SELECT sum(c.length),st_collect(c.geom),array_agg(c.id)
from
(
select (pgr_dijkstra('
                SELECT id AS id,
                         source::integer,
                         target::integer,
                         length AS cost
                        FROM network',
                  36, 78,true, false)).*
                 )
                  b
                 join
                 network c on b.id2=c.id;















----Design a more advanced function for OD query
 
SELECT * FROM 
(
SELECT * FROM 
(SELECT id AS oid 
FROM network_vertices_pgr a
ORDER BY a.geom <-> st_setsrid(st_makepoint(17.69067,59.20341),4326)
LIMIT 5) a
CROSS JOIN
(SELECT id AS did FROM network_vertices_pgr a ORDER BY a.geom <-> st_setsrid(st_makepoint(17.998966,59.322889),4326) LIMIT 5) b 
) c JOIN odcost d on c.oid=d.source AND c.did=d.target ORDER BY cost LIMIT 1




INSERT INTO network SELECT id,geom,length FROM street s WHERE s.level=1 AND s.speed_limit>=70


ALTER TABLE network ADD COLUMN source integer;
ALTER TABLE network ADD COLUMN target integer;
ALTER TABLE network_vertices_pgr RENAME the_geom TO geom;
SELECT pgr_createTopology('network', 0.00001, 'geom', 'id');


-- create three functions to query shortest path from OD with input type as: lat&lng,node_id,geometry
CREATE OR REPLACE FUNCTION self_get_shortestpathV1(IN source_id integer, IN target_id integer, OUT sumlength double precision, OUT path geometry)
  RETURNS record AS
$BODY$
BEGIN
select into sumlength,path
sum(c.length),st_collect(c.geom) 
from
(
select (pgr_dijkstra('
                SELECT id AS id,
                         source::integer,
                         target::integer,
                         length AS cost
                        FROM network',
                   $1, $2,false, false)).*
                 )
                  b
                 join
                 network c on b.id2=c.id; --order by seq        
END
$BODY$
  LANGUAGE plpgsql

SELECT 1,* FROM self_get_shortestpathV1(1,78)


CREATE OR REPLACE FUNCTION self_fetch_path_jsonV1(IN long1 double precision, IN lat1 double precision,IN long2 double precision, IN lat2 double precision)
  RETURNS json AS
$BODY$
SELECT row_to_json(f) FROM 
(
SELECT 'Feature' AS type , 
				ST_ASGEOJSON(path)::json AS geometry,
				row_to_json(row(sumlength)) As properties FROM 
(
SELECT * FROM self_get_shortestpathV1(long1,lat1,
						long2,lat2) ) a
) f
$BODY$
  LANGUAGE sql VOLATILE
  COST 100;


select * FROM pgr_dijkstra('
                SELECT id AS id,
                         source::integer,
                         target::integer,
                         length AS cost
                        FROM network',
                   36, 78,true, false) b join
                 network c on b.id2=c.id;





CREATE OR REPLACE FUNCTION self_get_shortestpathV1(IN source_geom geometry, IN target_geom geometry, OUT sumlength double precision, OUT path geometry) AS
$BODY$
declare
source integer;
target integer;
BEGIN
SELECT id into source
FROM network_vertices_pgr a
ORDER BY a.geom <-> $1
LIMIT 1;
SELECT id into target
FROM network_vertices_pgr a
ORDER BY a.geom <-> $2
LIMIT 1;
select * into sumlength,path 
from self_get_shortestpathV1(source,target);
 --order by seq        
END
$BODY$
LANGUAGE plpgsql





CREATE OR REPLACE FUNCTION self_get_shortestpathV1(IN long1 double precision, IN lat1 double precision,IN long2 double precision, IN lat2 double precision, OUT sumlength double precision, OUT path geometry) AS
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
FROM network_vertices_pgr a
ORDER BY a.geom <-> s_geom
LIMIT 1;
SELECT id into target
FROM network_vertices_pgr a
ORDER BY a.geom <-> t_geom
LIMIT 1;
select * into sumlength,path 
from self_get_shortestpathV1(source,target);
 --order by seq        
END
$BODY$
LANGUAGE plpgsql;



CREATE OR REPLACE FUNCTION self_get_shortestpathv1(IN long1 double precision, IN lat1 double precision, IN long2 double precision, IN lat2 double precision, OUT sumlength double precision, OUT path geometry)
  RETURNS record AS
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
FROM network_vertices_pgr a
ORDER BY a.geom <-> s_geom
LIMIT 1;
SELECT id into target
FROM network_vertices_pgr a
ORDER BY a.geom <-> t_geom
LIMIT 1;
select * into sumlength,path 
from self_get_shortestpathV1(source,target);
 --order by seq        
END
$BODY$
  LANGUAGE plpgsql VOLATILE
  COST 100;

