-- Cria o schema univesp
CREATE SCHEMA univesp;

CREATE TABLE IF NOT EXISTS public.employees
(
    id uuid NOT NULL,
    cpf character varying(14) COLLATE pg_catalog."default" NOT NULL,
    employee_name text COLLATE pg_catalog."default" NOT NULL,
    company_name text COLLATE pg_catalog."default" NOT NULL,
    created_at timestamp without time zone NOT NULL,
    updated_at timestamp without time zone NOT NULL,
    CONSTRAINT employees_pkey PRIMARY KEY (id)
);


ALTER TABLE IF EXISTS public.employees
    OWNER to postgres;

CREATE TABLE IF NOT EXISTS public.users
(
    id uuid NOT NULL,
    email text COLLATE pg_catalog."default" NOT NULL,
    password_hash text COLLATE pg_catalog."default" NOT NULL,
    created_at timestamp without time zone NOT NULL,
    CONSTRAINT users_pkey PRIMARY KEY (id)
);



ALTER TABLE IF EXISTS public.users
    OWNER to postgres;