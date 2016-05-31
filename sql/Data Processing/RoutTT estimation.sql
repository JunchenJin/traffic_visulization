--------- TODO --------- 
-- Define a function with input as intervalid,pathidarray and a threshold to control weight
-- It would be useful if we can 

CREATE OR REPLACE FUNCTION self_get_rtt(IN time_interval INTEGER , IN linkids INT[], IN threshold DOUBLE PRECISION)
RETURNS DOUBLE PRECISION AS
$BODY$
DECLARE
route_length DOUBLE PRECISION; --defined to store route length
rtt DOUBLE PRECISION;
BEGIN
	--Assign the route length 
	route_length:=(SELECT sum(length) FROM street WHERE link_id = ANY(linkids));
	--RAISE NOTICE 'Route length is % ', route_length;
	-- the ltt and weight information for each line and time interval
	-- is stored as array in network_ltt table, so we need to unnest 
	-- array to rows of values then compute multiple weight with ltt
	-- Perhaps we should taking congestion into account
	SELECT 	sum(routett*route_weight)/sum(route_weight) INTO rtt	
	FROM 
		(
		SELECT link_id,ltt*route_length/length AS routett,weight*length/route_length AS route_weight FROM 
			(
			SELECT 	link_id,
				unnest(samples) AS ltt,
				unnest(weights) AS weight, 
				length 
			FROM network_ltt 
			WHERE 	
				link_id = ANY(linkids) 
				AND 
				interval_index=time_interval
			) a -- In a,weight for route is computed
		) 
	b 
	WHERE route_weight>threshold;
	RETURN rtt;
END
$BODY$
LANGUAGE plpgsql VOLATILE
-- EXAMPLE 
-- INPUT ids: (709742666,573724574), interval:16, threshold: 0.5
-- AND OUTPUT 298.094285698599

-- We cannot use 'WHERE a IN ARRAY[]' when define a function as 'IN' is interpreted with FOR LOOP 
CREATE OR REPLACE FUNCTION self_get_rtt_alltime(IN linkids INT[], IN threshold DOUBLE PRECISION)
RETURNS TABLE(time_interval INTEGER,rtt DOUBLE PRECISION) AS
$BODY$
DECLARE
route_length numeric; --defined to store route length
BEGIN
	--Assign the route length 
	route_length:=(SELECT sum(length) FROM street WHERE link_id = ANY(linkids));
	--RAISE NOTICE 'Route length is % ', route_length;
	-- the ltt and weight information for each line and time interval
	-- is stored as array in network_ltt table, so we need to unnest 
	-- array to rows of values then compute multiple weight with ltt
	-- Perhaps we should taking congestion into account
	RETURN QUERY
	SELECT 	interval_index,sum(routett*route_weight)/sum(route_weight)
	FROM 
		(
		SELECT interval_index,ltt*route_length/length AS routett,weight*length/route_length AS route_weight FROM 
			(
			SELECT 	interval_index,
				unnest(samples) AS ltt,
				unnest(weights) AS weight, 
				length 
			FROM network_ltt 
			WHERE 	
				link_id = ANY(linkids) 
			) a -- In a,weight for route is computed
		) 
	b 
	WHERE route_weight>threshold GROUP BY interval_index;
END
$BODY$
LANGUAGE plpgsql VOLATILE


CREATE OR REPLACE FUNCTION self_get_rttandweight(IN linkids INT[],IN time_interval INTEGER)
RETURNS TABLE(rtt DOUBLE PRECISION,rtt_weight DOUBLE PRECISION) AS
$BODY$
DECLARE
route_length numeric; --defined to store route length
BEGIN
	--Assign the route length 
	route_length:=(SELECT sum(length) FROM street WHERE link_id = ANY(linkids));
	--RAISE NOTICE 'Route length is % ', route_length;
	-- the ltt and weight information for each line and time interval
	-- is stored as array in network_ltt table, so we need to unnest 
	-- array to rows of values then compute multiple weight with ltt
	-- Perhaps we should taking congestion into account
	RETURN QUERY
	SELECT ltt*route_length/length AS routett,weight*length/route_length AS route_weight FROM 
		(
		SELECT 	interval_index,
			unnest(samples) AS ltt,
			unnest(weights) AS weight, 
			length 
		FROM network_ltt 
		WHERE 	
			link_id = ANY(linkids) AND
			interval_index=time_interval
		) a; -- In a,weight for route is computed
END
$BODY$
LANGUAGE plpgsql VOLATILE

CREATE OR REPLACE FUNCTION self_get_rttandweight_daily(IN linkids INT[])
RETURNS TABLE(rtt DOUBLE PRECISION,rtt_weight DOUBLE PRECISION) AS
$BODY$
DECLARE
route_length numeric; --defined to store route length
BEGIN
	--Assign the route length 
	route_length:=(SELECT sum(length) FROM street WHERE link_id = ANY(linkids));
	--RAISE NOTICE 'Route length is % ', route_length;
	-- the ltt and weight information for each line and time interval
	-- is stored as array in network_ltt table, so we need to unnest 
	-- array to rows of values then compute multiple weight with ltt
	-- Perhaps we should taking congestion into account
	RETURN QUERY
	SELECT ltt*route_length/length AS routett,weight*length/route_length AS route_weight FROM 
		(
		SELECT 	unnest(samples) AS ltt,
			unnest(weights) AS weight, 
			length 
		FROM network_ltt 
		WHERE 	
			link_id = ANY(linkids)
		) a; -- In a,weight for route is computed
END
$BODY$
LANGUAGE plpgsql VOLATILE

SELECT * FROM self_get_rttandweight_daily(ARRAY[727323499, 28024890, 811440994])

SELECT sum(length*3.6/speed_limit) FROM street WHERE link_id = ANY(ARRAY[727323499, 28024890, 811440994])


SELECT * FROM network_ltt LIMIT 10


SELECT * FROM self_get_rttandweight(ARRAY[709742666,573724574],16) ORDER BY rtt
SELECT * FROM self_get_rtt_alltime(ARRAY[709742666,573724574],0.3) ORDER BY time_interval

SELECT self_get_rtt(16,ARRAY[709742666,573724574],0.3)





DO 
$$
DECLARE route_length numeric;
BEGIN
route_length := (
SELECT sum(length) FROM street WHERE link_id =ANY(ARRAY[709742666,724982779])
);
RAISE NOTICE 'Route length is % ', route_length;
SELECT
	link_id,weight*length/14 AS wholeweight FROM 
(
	SELECT 	link_id,
		unnest(samples) AS ltt,
		unnest(weights) AS weight, 
		length 
	FROM network_ltt 
	WHERE 	
		link_id in (709742666, 724982779) 
		AND 
		interval_index=12
) a;
END
$$













SELECT link_id,samples FROM network_ltt WHERE interval_index=$1 AND link_id in ($2)

SELECT link_id,unnest(samples) AS ltt ,unnest(weights) AS weight,length FROM network_ltt WHERE link_id in (709742666, 724982779) AND interval_index=12



SELECT sum(length) FROM street WHERE link_id in (709742666, 573724574)



SELECT a.interval_index,array_agg(b.sum*a.unnest/a.length) FROM 
(SELECT link_id,interval_index,unnest(samples),length FROM network_ltt WHERE link_id in (709742666, 724982779))
 a, (SELECT sum(length) FROM street WHERE link_id in (709742666, 724982779)) b
group by a.interval_index order by interval_index



