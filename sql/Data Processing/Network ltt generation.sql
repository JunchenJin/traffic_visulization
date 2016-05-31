CREATE TABLE network_ltt 
(
  link_id integer,
  interval_index integer,
  samples integer[],
  weights double precision[],
  length double precision
);

CREATE OR REPLACE FUNCTION insertttandweight()
RETURNS  void AS $$
DECLARE
    r network%rowtype;
BEGIN
    FOR r IN SELECT * FROM network
    LOOP
	INSERT INTO network_ltt
	SELECT r.id, interval_index, array_agg(tt) as data, array_agg(weight) AS weights,r.length from 
	(
	SELECT interval_index,unnest(samples) AS tt,unnest(weights) AS weight FROM phd_work.truckltt_daily where link_id = r.id
	) a
	group by interval_index order by interval_index;
    END LOOP;
    RETURN;
END
$$ LANGUAGE plpgsql;





ALTER TABLE odcost ADD COLUMN links integer[];
--SELECT * FROM insertttandweight();

--- optimization of query, storing all midium results
CREATE OR REPLACE FUNCTION self_fetch_tt_dailyV1(id integer)
  RETURNS json AS
$BODY$
--Directly search on the table of TT aggregated table
SELECT JSON_AGG(ROW_TO_JSON(row)) FROM 
(	
	SELECT interval_index,samples as data FROM network_ltt WHERE link_id= $1 order by interval_index 
) AS row
$BODY$
  LANGUAGE sql VOLATILE
  COST 100;
ALTER FUNCTION self_fetch_tt_daily(integer)
  OWNER TO postgres;


SELECT * FROM network 

SELECT *,unnest(samples),unnest(weights) FROM network_ltt WHERE link_id = 29220499 ORDER BY interval_index;
SELECT sum(array_length(samples,1)) FROM network_ltt WHERE link_id = 29220499





--function to estimate with input as an array of links
 

SELECT interval_index,COUNT(*),SUM(mean/length)*SUM(length)/COUNT(*) FROM 
(
SELECT a.*,b.mean,b.interval_index FROM 
	(
	select id2 as link_id, cost as length FROM pgr_dijkstra('
                SELECT id AS id,
                         source::integer,
                         target::integer,
                         length AS cost
                        FROM network',
                  36, 78,true, false) 
                  WHERE id2>0
        )
                  a JOIN phd_work.truck_ltt b on a.link_id=b.link_id ORDER BY b.link_id,b.interval_index 
                  ) c
                  GROUP BY interval_index ORDER BY interval_index
















SELECT * FROM phd_work.truck_ltt WHERE link_id= 29220499 OR link_id= 767363777
SELECT *,avg(samples) FROM network_ltt WHERE link_id= 29220499 OR link_id= 767363777 ORDER BY link_id,interval_index




SELECT 29220499 as id, interval_index, array_agg(tt) as data, array_length(array_agg(tt),1) AS weights from 
	(
	SELECT interval_index,unnest(samples) AS tt,unnest(weights) AS weight FROM phd_work.truckltt_daily where link_id = 29220499
	) a
	group by interval_index order by interval_index





















SELECT * FROM phd_work.truckltt_daily WHERE link_id= 29220499



select * from self_fetch_tt_daily(29220499)

CREATE OR REPLACE FUNCTION self_fetch_tt_daily(id integer)
  RETURNS json AS
$BODY$
SELECT JSON_AGG(ROW_TO_JSON(row)) FROM 
(
	SELECT interval_index, array_agg(tt) as data from 
	(
	SELECT interval_index,unnest(samples) AS tt FROM phd_work.truckltt_daily where link_id = $1
	) a
	group by interval_index order by interval_index 
) AS row
$BODY$
  LANGUAGE sql VOLATILE
  COST 100;
ALTER FUNCTION self_fetch_tt_daily(integer)
  OWNER TO postgres;

CREATE OR REPLACE FUNCTION self_fetch_tt_dailyV1(id integer)
  RETURNS json AS
$BODY$
--Directly search on the table of TT aggregated table
SELECT JSON_AGG(ROW_TO_JSON(row)) FROM 
(	
	SELECT interval_index,samples as data FROM phd_work.truck_ltt WHERE link_id= $1 order by interval_index 
) AS row
$BODY$
  LANGUAGE sql VOLATILE
  COST 100;
ALTER FUNCTION self_fetch_tt_daily(integer)
  OWNER TO postgres;





SELECT interval_index, array_agg(tt) as data, array_length(array_agg(tt) , 1)from 
	(
	SELECT interval_index,unnest(samples) AS tt FROM phd_work.truckltt_daily where link_id = 29220499
	) a
	group by interval_index order by interval_index