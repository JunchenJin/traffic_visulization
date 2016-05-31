select a.link_id,a.interval_index,s.length/a.mean*3.6 as speed from  phd_work.truck_ltt a 
		join (
		select link_id,count(*) AS count from phd_work.truck_ltt group by link_id having count(*) = 48
		) b 
		on a.link_id=b.link_id 
		JOIN street s ON b.link_id=s.link_id where s.level=1 AND s.speed_limit>=70 order by link_id,interval_index


SELECT * FROM phd_work.truck_ltt where link_id= 767363777 AND interval_index=40

SELECT * FROM network_ltt  where link_id= 767363777 AND interval_index=40


-- TTI
select link_id,interval_index,avgltt/freeltt as tti from network_tti where interval_index=16 order by link_id,interval_index



select link_id,interval_index,avgltt/freeltt as tti from network_ltt where interval_index=16 order by link_id,interval_index


select link_id,interval_index,per_95/freeltt as tti from network_ltt where interval_index=16 order by link_id,interval_index