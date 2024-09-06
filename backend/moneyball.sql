\echo 'Delete and recreate moneyball db?'
\prompt 'Return for yes or control-C to cancel > ' foo

DROP DATABASE moneyball;
CREATE DATABASE moneyball;
\connect moneyball

\i moneyball-schema.sql

\echo 'Delete and recreate moneyball_test db?'
\prompt 'Return for yes or control-C to cancel > ' foo

DROP DATABASE moneyball_test;
CREATE DATABASE moneyball_test;
\connect moneyball_test

\i moneyball-schema.sql
