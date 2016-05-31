-- Data is aggregated to id, interval

CREATE TABLE network_ltt
(
  link_id integer,
  interval_index integer,
  samples integer[],
  weights double precision[],
  length double precision,
  speed_limit integer
)

--