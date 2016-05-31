-- the two queries should return the same result
select * from self_get_shortestpath(12,13)

select * from self_fetch_path_json(18.0006,59.49184,
18.00143,59.38958,3)

with p1 as (select geom from pgr_node where id =12),
p2 as (select geom from pgr_node where id =13)
select (self_get_shortestpath(p1.geom,p2.geom)).* from p1,p2

-- Using (function).*, a record type can be splitted into multiple columns. 

-- The following queries are just for testing
with p1 as (select geom from pgr_node where id =29),
p2 as (select geom from pgr_node where id =134)
select (self_get_k_shortestpath(p1.geom,p2.geom,2)).* from p1,p2

select st_astext(geom) from pgr_node where id =29
select st_astext(geom) from pgr_node where id =134

select route,ST_ASTEXT(ST_Union(geom)) from self_get_k_shortestpath(
17.9804,59.49184,
18.00143,59.38958,2) group by route

select route,ST_LineMerge(ST_Union(geom)) from self_get_k_shortestpath(
18.0006,59.49184,
18.00143,59.38958,3) group by route

-- There two ways to compute distance 
select id,km,geom_way, ST_Length(geom_way::geography), ST_length(ST_transform(geom_way,3006)) from at_2po_4pgr limit 3


SELECT seq, id1 AS route, id3 AS edge from pgr_ksp('
                SELECT id AS id,
                         source::integer,
                         target::integer,
                         cost AS cost,
                         reverse_cost
                        FROM at_2po_4pgr', 24,25,
                         2, true) 

SELECT row_to_json(fc) FROM 
(
SELECT 'FeatureCollection' As type, array_to_json(array_agg(f)) As features from 
(
SELECT 'Feature' AS type , 
ST_ASGEOJSON(geom)::json AS geometry,
row_to_json((route,length,time)) As properties
from 
(
SELECT route,sum(km) as length,sum(cost) as time ,ST_LineMerge(ST_Union(geom)) as geom FROM 
(
SELECT a.*,b.km,b.cost,b.geom_way AS geom FROM self_get_k_shortestpathV2(
18.0006,59.49184,
18.00143,59.38958,3) a JOIN at_2po_4pgr b ON a.edge=b.id order by a.seq
) c group by route order by route
) d
) f
) fc





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






