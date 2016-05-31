-- Function: self_fetch_tt_daily(integer)

-- DROP FUNCTION self_fetch_tt_daily(integer);

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
