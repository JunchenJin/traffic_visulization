 CREATE EXTENSION postgis
 CREATE EXTENSION pgrouting
 CREATE USER canyang WITH PASSWORD 'canyang';

--  remember to install psycopg2 for django first before start the server



-- create a new schema and move all extension to that schema

create schema routing;

grant all on schema routing to public;

alter database postgres set search_path = "$user", public, routing;

alter extension postgis set schema routing;

alter extension pgrouting set schema routing;

