--Author: Can Yang
-- TODO: This one needs to be improved.
-- The table contains four fields:
--    road_id integer,
--    hour integer,
--    speed integer,
--    geom geometry




create table Hour(
   hour integer
);

-- insert hours in a day
INSERT INTO Hour 
select * from generate_series(1,24);



-- create table to store speed level
drop table road_speed
create table road_speed(
   road_id integer,
   hour integer,
   speed integer,
   geom geometry
);


-- randomly generate the speed level
INSERT INTO road_speed
 select a.id,b.hour,trunc(random() * 5 + 1)::integer,a.geom from 
	(select id,geom from road) as a 
	cross join 
	Hour b;


-- The road_speedV2 contains the speed level as array

DELETE FROM road_speedV2;
CREATE TABLE road_speedV2(
   road_id integer,
   speedarray integer[],
   geom geometry
);

-- create a type first for the function 
create type road_id_geom AS (
	id integer,
	geom geometry	
)
-- a function to create the array from the road speed table
CREATE OR REPLACE FUNCTION importDataAsArray() RETURNS VOID AS
$BODY$
DECLARE
    r road_id_geom;
    speeds integer[];
BEGIN
    FOR r IN SELECT DISTINCT road_id,geom FROM road_speed
    LOOP
	select ARRAY(
		select speed from road_speed where road_id=r.id order by hour)
	into speeds;
	INSERT INTO road_speedV2 VALUES(
		r.id,speeds,r.geom
	);
    END LOOP;
    RETURN;
END
$BODY$
LANGUAGE 'plpgsql' ;

select importDataAsArray();

-- check the result
-- select * from road_speedV2

-- select a value as array
-- select * from road_speed where road_id=3 order by hour

-- create a table to store the TT of path
-- create table path_travel_time(
--    path_id integer,
--    time_id integer,
--    travel_time integer
-- );

-- the following query generate a table with path_id, time_id and value
SELECT a.id AS path_id,b.id AS interval_id,trunc(random() * 5 + 20)::INTEGER AS value FROM
	(SELECT * FROM GENERATE_SERIES(1,3)) AS a(id) 
	CROSS JOIN 
	(SELECT * FROM GENERATE_SERIES(1,30)) AS b(id);

-- create JSON from the above query
SELECT row_to_json(row) from 
(
	SELECT a.id AS p_id,b.id AS t_id,trunc(random() * 10 + 50)::INTEGER AS travel_time FROM
		(SELECT * FROM GENERATE_SERIES(1,3)) AS a(id) 
		CROSS JOIN 
		(SELECT * FROM GENERATE_SERIES(1,30)) AS b(id)
) AS row


-- The function is used to simulate the query results with path id,time id and travel time

-- DROP FUNCTION self_fetch_tt()
CREATE OR REPLACE FUNCTION self_fetch_tt() RETURNS TABLE(p_id integer,t_id integer,tt integer)
AS $$
SELECT a.id AS p_id,b.id AS t_id,trunc(random() * 10 + 50)::INTEGER AS travel_time FROM
		(SELECT * FROM GENERATE_SERIES(1,3)) AS a(id) 
		CROSS JOIN 
		(SELECT * FROM GENERATE_SERIES(1,30)) AS b(id)
$$
LANGUAGE SQL ;

CREATE OR REPLACE FUNCTION self_fetch_tt(IN num_path INTEGER, IN num_interval INTEGER) RETURNS TABLE(p_id integer,t_id integer,tt integer)
AS $$
SELECT a.id AS p_id,b.id AS t_id,trunc(random() * 10 + 50)::INTEGER AS travel_time FROM
		(SELECT * FROM GENERATE_SERIES(1,num_path)) AS a(id) 
		CROSS JOIN 
		(SELECT * FROM GENERATE_SERIES(1,num_interval)) AS b(id)
$$
LANGUAGE SQL ;



-- create function to return the result in arrays
CREATE OR REPLACE FUNCTION self_fetch_tt_array() RETURNS TABLE(p_id integer,time_array integer[],tt_array integer[])
AS $$
select p_id,array_agg(t_id) AS time_array,array_agg(tt) as tt_array from self_fetch_tt() group by p_id
$$
LANGUAGE SQL ;

-- create function to return the result as json
CREATE OR REPLACE FUNCTION self_fetch_tt_json() RETURNS json
AS $$
select array_to_json(array_agg(row_to_json(row))) from self_fetch_tt_array() as row
$$
LANGUAGE SQL ;

select * from self_fetch_tt_json()





