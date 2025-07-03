--
-- PostgreSQL database dump
--

-- Dumped from database version 16.8 (Debian 16.8-1.pgdg120+1)
-- Dumped by pg_dump version 17.5

SET statement_timeout = 0;
SET lock_timeout = 0;
SET idle_in_transaction_session_timeout = 0;
SET transaction_timeout = 0;
SET client_encoding = 'UTF8';
SET standard_conforming_strings = on;
SELECT pg_catalog.set_config('search_path', '', false);
SET check_function_bodies = false;
SET xmloption = content;
SET client_min_messages = warning;
SET row_security = off;

--
-- Name: EventStatus; Type: TYPE; Schema: public; Owner: postgres
--

CREATE TYPE public."EventStatus" AS ENUM (
    'pending',
    'approved',
    'rejected'
);


ALTER TYPE public."EventStatus" OWNER TO postgres;

--
-- Name: Role; Type: TYPE; Schema: public; Owner: postgres
--

CREATE TYPE public."Role" AS ENUM (
    'student',
    'alumni',
    'faculty',
    'admin'
);


ALTER TYPE public."Role" OWNER TO postgres;

SET default_tablespace = '';

SET default_table_access_method = heap;

--
-- Name: _prisma_migrations; Type: TABLE; Schema: public; Owner: postgres
--

CREATE TABLE public._prisma_migrations (
    id character varying(36) NOT NULL,
    checksum character varying(64) NOT NULL,
    finished_at timestamp with time zone,
    migration_name character varying(255) NOT NULL,
    logs text,
    rolled_back_at timestamp with time zone,
    started_at timestamp with time zone DEFAULT now() NOT NULL,
    applied_steps_count integer DEFAULT 0 NOT NULL
);


ALTER TABLE public._prisma_migrations OWNER TO postgres;

--
-- Name: activity_logs; Type: TABLE; Schema: public; Owner: postgres
--

CREATE TABLE public.activity_logs (
    id integer NOT NULL,
    user_id integer NOT NULL,
    action character varying(100) NOT NULL,
    details jsonb,
    created_at timestamp(3) without time zone DEFAULT CURRENT_TIMESTAMP NOT NULL,
    user_type public."Role" NOT NULL
);


ALTER TABLE public.activity_logs OWNER TO postgres;

--
-- Name: activity_logs_id_seq; Type: SEQUENCE; Schema: public; Owner: postgres
--

CREATE SEQUENCE public.activity_logs_id_seq
    AS integer
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;


ALTER SEQUENCE public.activity_logs_id_seq OWNER TO postgres;

--
-- Name: activity_logs_id_seq; Type: SEQUENCE OWNED BY; Schema: public; Owner: postgres
--

ALTER SEQUENCE public.activity_logs_id_seq OWNED BY public.activity_logs.id;


--
-- Name: admins; Type: TABLE; Schema: public; Owner: postgres
--

CREATE TABLE public.admins (
    id integer NOT NULL,
    user_id integer NOT NULL
);


ALTER TABLE public.admins OWNER TO postgres;

--
-- Name: admins_id_seq; Type: SEQUENCE; Schema: public; Owner: postgres
--

CREATE SEQUENCE public.admins_id_seq
    AS integer
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;


ALTER SEQUENCE public.admins_id_seq OWNER TO postgres;

--
-- Name: admins_id_seq; Type: SEQUENCE OWNED BY; Schema: public; Owner: postgres
--

ALTER SEQUENCE public.admins_id_seq OWNED BY public.admins.id;


--
-- Name: alumni; Type: TABLE; Schema: public; Owner: postgres
--

CREATE TABLE public.alumni (
    id integer NOT NULL,
    graduation_year integer NOT NULL,
    course character varying(100),
    current_job_title character varying(100) NOT NULL,
    company_name character varying(100) NOT NULL,
    user_id integer NOT NULL,
    company_role character varying(100)
);


ALTER TABLE public.alumni OWNER TO postgres;

--
-- Name: alumni_id_seq; Type: SEQUENCE; Schema: public; Owner: postgres
--

CREATE SEQUENCE public.alumni_id_seq
    AS integer
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;


ALTER SEQUENCE public.alumni_id_seq OWNER TO postgres;

--
-- Name: alumni_id_seq; Type: SEQUENCE OWNED BY; Schema: public; Owner: postgres
--

ALTER SEQUENCE public.alumni_id_seq OWNED BY public.alumni.id;


--
-- Name: email_change_logs; Type: TABLE; Schema: public; Owner: postgres
--

CREATE TABLE public.email_change_logs (
    id integer NOT NULL,
    user_id integer NOT NULL,
    old_email character varying(100) NOT NULL,
    new_email character varying(100) NOT NULL,
    changed_at timestamp(3) without time zone DEFAULT CURRENT_TIMESTAMP NOT NULL,
    user_type public."Role" NOT NULL
);


ALTER TABLE public.email_change_logs OWNER TO postgres;

--
-- Name: email_change_logs_id_seq; Type: SEQUENCE; Schema: public; Owner: postgres
--

CREATE SEQUENCE public.email_change_logs_id_seq
    AS integer
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;


ALTER SEQUENCE public.email_change_logs_id_seq OWNER TO postgres;

--
-- Name: email_change_logs_id_seq; Type: SEQUENCE OWNED BY; Schema: public; Owner: postgres
--

ALTER SEQUENCE public.email_change_logs_id_seq OWNED BY public.email_change_logs.id;


--
-- Name: event_registrations; Type: TABLE; Schema: public; Owner: postgres
--

CREATE TABLE public.event_registrations (
    id integer NOT NULL,
    registered_user_id integer NOT NULL,
    event_id integer NOT NULL,
    registered_at timestamp(3) without time zone DEFAULT CURRENT_TIMESTAMP NOT NULL
);


ALTER TABLE public.event_registrations OWNER TO postgres;

--
-- Name: event_registrations_id_seq; Type: SEQUENCE; Schema: public; Owner: postgres
--

CREATE SEQUENCE public.event_registrations_id_seq
    AS integer
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;


ALTER SEQUENCE public.event_registrations_id_seq OWNER TO postgres;

--
-- Name: event_registrations_id_seq; Type: SEQUENCE OWNED BY; Schema: public; Owner: postgres
--

ALTER SEQUENCE public.event_registrations_id_seq OWNED BY public.event_registrations.id;


--
-- Name: events; Type: TABLE; Schema: public; Owner: postgres
--

CREATE TABLE public.events (
    id integer NOT NULL,
    user_id integer NOT NULL,
    name character varying(200) NOT NULL,
    date timestamp(3) without time zone NOT NULL,
    "time" character varying(20) NOT NULL,
    type character varying(100) NOT NULL,
    description text,
    location character varying(200) NOT NULL,
    organizer character varying(100) NOT NULL,
    image_url character varying(500),
    status public."EventStatus" DEFAULT 'pending'::public."EventStatus" NOT NULL,
    max_capacity integer,
    created_at timestamp(3) without time zone DEFAULT CURRENT_TIMESTAMP NOT NULL,
    updated_at timestamp(3) without time zone NOT NULL
);


ALTER TABLE public.events OWNER TO postgres;

--
-- Name: events_id_seq; Type: SEQUENCE; Schema: public; Owner: postgres
--

CREATE SEQUENCE public.events_id_seq
    AS integer
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;


ALTER SEQUENCE public.events_id_seq OWNER TO postgres;

--
-- Name: events_id_seq; Type: SEQUENCE OWNED BY; Schema: public; Owner: postgres
--

ALTER SEQUENCE public.events_id_seq OWNED BY public.events.id;


--
-- Name: faculty; Type: TABLE; Schema: public; Owner: postgres
--

CREATE TABLE public.faculty (
    id integer NOT NULL,
    designation character varying(100) NOT NULL,
    user_id integer NOT NULL
);


ALTER TABLE public.faculty OWNER TO postgres;

--
-- Name: faculty_id_seq; Type: SEQUENCE; Schema: public; Owner: postgres
--

CREATE SEQUENCE public.faculty_id_seq
    AS integer
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;


ALTER SEQUENCE public.faculty_id_seq OWNER TO postgres;

--
-- Name: faculty_id_seq; Type: SEQUENCE OWNED BY; Schema: public; Owner: postgres
--

ALTER SEQUENCE public.faculty_id_seq OWNED BY public.faculty.id;


--
-- Name: password_change_logs; Type: TABLE; Schema: public; Owner: postgres
--

CREATE TABLE public.password_change_logs (
    id integer NOT NULL,
    user_id integer NOT NULL,
    changed_at timestamp(3) without time zone DEFAULT CURRENT_TIMESTAMP NOT NULL,
    user_type public."Role" NOT NULL
);


ALTER TABLE public.password_change_logs OWNER TO postgres;

--
-- Name: password_change_logs_id_seq; Type: SEQUENCE; Schema: public; Owner: postgres
--

CREATE SEQUENCE public.password_change_logs_id_seq
    AS integer
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;


ALTER SEQUENCE public.password_change_logs_id_seq OWNER TO postgres;

--
-- Name: password_change_logs_id_seq; Type: SEQUENCE OWNED BY; Schema: public; Owner: postgres
--

ALTER SEQUENCE public.password_change_logs_id_seq OWNED BY public.password_change_logs.id;


--
-- Name: students; Type: TABLE; Schema: public; Owner: postgres
--

CREATE TABLE public.students (
    id integer NOT NULL,
    roll_number character varying(50) NOT NULL,
    user_id integer NOT NULL,
    current_semester integer NOT NULL,
    graduation_year integer,
    batch_end_year integer,
    batch_start_year integer
);


ALTER TABLE public.students OWNER TO postgres;

--
-- Name: students_id_seq; Type: SEQUENCE; Schema: public; Owner: postgres
--

CREATE SEQUENCE public.students_id_seq
    AS integer
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;


ALTER SEQUENCE public.students_id_seq OWNER TO postgres;

--
-- Name: students_id_seq; Type: SEQUENCE OWNED BY; Schema: public; Owner: postgres
--

ALTER SEQUENCE public.students_id_seq OWNED BY public.students.id;


--
-- Name: support_requests; Type: TABLE; Schema: public; Owner: postgres
--

CREATE TABLE public.support_requests (
    id integer NOT NULL,
    user_id integer NOT NULL,
    alumni_id integer,
    status character varying(20) DEFAULT 'pending'::character varying NOT NULL,
    created_at timestamp(3) without time zone DEFAULT CURRENT_TIMESTAMP NOT NULL,
    "descriptionbyUser" character varying(500) DEFAULT ''::character varying NOT NULL,
    "descriptionbyAlumni" character varying(500) DEFAULT ''::character varying
);


ALTER TABLE public.support_requests OWNER TO postgres;

--
-- Name: support_requests_id_seq; Type: SEQUENCE; Schema: public; Owner: postgres
--

CREATE SEQUENCE public.support_requests_id_seq
    AS integer
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;


ALTER SEQUENCE public.support_requests_id_seq OWNER TO postgres;

--
-- Name: support_requests_id_seq; Type: SEQUENCE OWNED BY; Schema: public; Owner: postgres
--

ALTER SEQUENCE public.support_requests_id_seq OWNED BY public.support_requests.id;


--
-- Name: users; Type: TABLE; Schema: public; Owner: postgres
--

CREATE TABLE public.users (
    id integer NOT NULL,
    full_name character varying(100) NOT NULL,
    email character varying(100) NOT NULL,
    password character varying(255) NOT NULL,
    phone_number character varying(20),
    department character varying(100),
    role public."Role" NOT NULL,
    created_at timestamp(3) without time zone DEFAULT CURRENT_TIMESTAMP NOT NULL,
    photo_url character varying(500),
    bio text,
    linkedin_url character varying(500),
    work_experience jsonb,
    github_url character varying(500),
    twitter_url character varying(500)
);


ALTER TABLE public.users OWNER TO postgres;

--
-- Name: users_id_seq; Type: SEQUENCE; Schema: public; Owner: postgres
--

CREATE SEQUENCE public.users_id_seq
    AS integer
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;


ALTER SEQUENCE public.users_id_seq OWNER TO postgres;

--
-- Name: users_id_seq; Type: SEQUENCE OWNED BY; Schema: public; Owner: postgres
--

ALTER SEQUENCE public.users_id_seq OWNED BY public.users.id;


--
-- Name: activity_logs id; Type: DEFAULT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.activity_logs ALTER COLUMN id SET DEFAULT nextval('public.activity_logs_id_seq'::regclass);


--
-- Name: admins id; Type: DEFAULT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.admins ALTER COLUMN id SET DEFAULT nextval('public.admins_id_seq'::regclass);


--
-- Name: alumni id; Type: DEFAULT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.alumni ALTER COLUMN id SET DEFAULT nextval('public.alumni_id_seq'::regclass);


--
-- Name: email_change_logs id; Type: DEFAULT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.email_change_logs ALTER COLUMN id SET DEFAULT nextval('public.email_change_logs_id_seq'::regclass);


--
-- Name: event_registrations id; Type: DEFAULT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.event_registrations ALTER COLUMN id SET DEFAULT nextval('public.event_registrations_id_seq'::regclass);


--
-- Name: events id; Type: DEFAULT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.events ALTER COLUMN id SET DEFAULT nextval('public.events_id_seq'::regclass);


--
-- Name: faculty id; Type: DEFAULT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.faculty ALTER COLUMN id SET DEFAULT nextval('public.faculty_id_seq'::regclass);


--
-- Name: password_change_logs id; Type: DEFAULT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.password_change_logs ALTER COLUMN id SET DEFAULT nextval('public.password_change_logs_id_seq'::regclass);


--
-- Name: students id; Type: DEFAULT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.students ALTER COLUMN id SET DEFAULT nextval('public.students_id_seq'::regclass);


--
-- Name: support_requests id; Type: DEFAULT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.support_requests ALTER COLUMN id SET DEFAULT nextval('public.support_requests_id_seq'::regclass);


--
-- Name: users id; Type: DEFAULT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.users ALTER COLUMN id SET DEFAULT nextval('public.users_id_seq'::regclass);


--
-- Data for Name: _prisma_migrations; Type: TABLE DATA; Schema: public; Owner: postgres
--

COPY public._prisma_migrations (id, checksum, finished_at, migration_name, logs, rolled_back_at, started_at, applied_steps_count) FROM stdin;
e57e0a36-3457-43a3-af3c-f06071709e11	62c9ccdb4b3a4f962f2268de62eecdb88680285840ffee7421ba063a517a5ac7	2025-07-01 17:48:51.235335+00	20250701_init_baseline		\N	2025-07-01 17:48:51.235335+00	0
b2b1e007-2d61-4320-97d1-100e318d38a5	b52ab4bfd4b51773869eb47b9c4c3afb4fcd8f5a1230b79ae3f95d19967d44ff	2025-07-01 18:03:03.100236+00	20250701180254_support_request	\N	\N	2025-07-01 18:03:02.181288+00	1
7e1d2df7-1c7a-4568-8094-4d2444dd41bb	b9df777c40f02e272de2db23671659d759d5fef1184b4e5541ba186ab1f9ec9f	2025-07-02 08:36:17.864939+00	20250702083613_support	\N	\N	2025-07-02 08:36:17.476729+00	1
e65d5683-a27c-4857-8e9c-2dc1d83e3b01	2699623b93e2a06ef5112fece6985846266bfaaf2f3de7f90b39ef4d4f76a619	2025-07-02 09:01:28.496639+00	20250702090123_supportagin	\N	\N	2025-07-02 09:01:28.033787+00	1
38313da2-613c-45d0-a558-acc514b18a4c	b90fd12ff54869ed018804bfa003f0b27efad639e11a2ca14afd87ef99d563ca	2025-07-02 09:18:05.351749+00	20250702091800_add_support_request_relations	\N	\N	2025-07-02 09:18:05.009268+00	1
32474532-7c11-4a8b-855b-8427479e6555	806aef8a27ddf525aa8207fe7ad1ad365da6b881836ddb4ecf51f08f3aeea05b	2025-07-03 16:56:30.55025+00	20250701_fresh_baseline		\N	2025-07-03 16:56:30.55025+00	0
\.


--
-- Data for Name: activity_logs; Type: TABLE DATA; Schema: public; Owner: postgres
--

COPY public.activity_logs (id, user_id, action, details, created_at, user_type) FROM stdin;
1	5	EVENT_APPROVED	{"eventId": 2, "eventName": "wef", "approvedBy": 5}	2025-06-25 07:50:51.528	admin
2	5	EVENT_APPROVED	{"eventId": 1, "eventName": "Thirike", "approvedBy": 5}	2025-06-25 07:50:56.145	admin
3	5	EVENT_APPROVED	{"eventId": 3, "eventName": "NEW EVENT", "approvedBy": 5}	2025-06-25 07:54:01.924	admin
4	4	EVENT_REGISTERED	{"eventId": 3, "eventName": "NEW EVENT"}	2025-06-25 07:55:18.092	alumni
5	6	EVENT_REGISTERED	{"eventId": 3, "eventName": "NEW EVENT"}	2025-06-25 07:58:16.701	student
6	2	EVENT_REGISTERED	{"eventId": 3, "eventName": "NEW EVENT"}	2025-06-25 07:59:19.93	student
7	5	EVENT_APPROVED	{"eventId": 4, "eventName": "Test Event", "approvedBy": 5}	2025-06-25 08:10:06.84	admin
8	4	EVENT_REGISTERED	{"eventId": 4, "eventName": "Test Event"}	2025-06-25 08:13:27.859	alumni
9	6	EVENT_REGISTERED	{"eventId": 5, "eventName": "wef"}	2025-06-25 08:17:39.772	student
10	6	EVENT_REGISTERED	{"eventId": 4, "eventName": "Test Event"}	2025-06-25 08:17:48.901	student
11	7	EVENT_REGISTERED	{"eventId": 3, "eventName": "NEW EVENT"}	2025-06-25 08:42:04.976	alumni
12	7	EVENT_REGISTERED	{"eventId": 4, "eventName": "Test Event"}	2025-06-25 08:42:11.517	alumni
13	7	EVENT_REGISTERED	{"eventId": 5, "eventName": "wef"}	2025-06-25 08:42:17.131	alumni
14	5	EVENT_APPROVED	{"eventId": 6, "eventName": "Thirike", "approvedBy": 5}	2025-06-25 12:28:12.276	admin
15	6	EVENT_REGISTERED	{"eventId": 6, "eventName": "Thirike"}	2025-06-25 15:09:16.35	student
16	5	EVENT_APPROVED	{"eventId": 7, "eventName": "Rahul R P", "approvedBy": 5}	2025-06-25 20:06:22.85	admin
17	5	EVENT_APPROVED	{"eventId": 8, "eventName": "Dhishna", "approvedBy": 5}	2025-06-25 20:11:00.582	admin
18	5	EVENT_APPROVED	{"eventId": 11, "eventName": "Test Event 3", "approvedBy": 5}	2025-06-26 13:03:00.741	admin
19	5	EVENT_APPROVED	{"eventId": 10, "eventName": "Test Event 2", "approvedBy": 5}	2025-06-26 13:03:05.484	admin
20	2	EVENT_REGISTERED	{"eventId": 6, "eventName": "Thirike"}	2025-06-26 17:18:36.559	student
21	3	EVENT_REGISTERED	{"eventId": 6, "eventName": "Thirike"}	2025-06-27 08:25:36.564	alumni
22	6	EVENT_REGISTERED	{"eventId": 10, "eventName": "Test Event 2"}	2025-06-30 11:55:50.573	student
23	3	EVENT_REGISTERED	{"eventId": 10, "eventName": "Test Event 2"}	2025-06-30 11:57:06.405	alumni
24	5	EVENT_APPROVED	{"eventId": 9, "eventName": "Test Event", "approvedBy": 5}	2025-07-01 06:54:10.708	admin
25	5	EVENT_APPROVED	{"eventId": 12, "eventName": "Latest", "approvedBy": 5}	2025-07-01 06:57:02.733	admin
26	6	EVENT_REGISTERED	{"eventId": 12, "eventName": "Latest"}	2025-07-01 06:57:10.858	student
27	3	EVENT_REGISTERED	{"eventId": 12, "eventName": "Latest"}	2025-07-01 06:59:19.659	alumni
28	5	EVENT_APPROVED	{"eventId": 13, "eventName": "Fo adith", "approvedBy": 5}	2025-07-01 07:05:48.002	admin
29	6	EVENT_REGISTERED	{"eventId": 13, "eventName": "Fo adith"}	2025-07-01 07:06:29.824	student
30	3	EVENT_REGISTERED	{"eventId": 13, "eventName": "Fo adith"}	2025-07-01 07:07:16.454	alumni
31	5	EVENT_APPROVED	{"eventId": 16, "eventName": "Uxtic", "approvedBy": 5}	2025-07-01 07:14:43.141	admin
32	5	EVENT_APPROVED	{"eventId": 14, "eventName": "Nothing", "approvedBy": 5}	2025-07-01 07:14:44.895	admin
33	5	EVENT_APPROVED	{"eventId": 15, "eventName": "Twhwj", "approvedBy": 5}	2025-07-01 07:14:49.156	admin
34	5	EVENT_APPROVED	{"eventId": 17, "eventName": "Test Event", "approvedBy": 5}	2025-07-01 07:18:01.219	admin
35	6	EVENT_REGISTERED	{"eventId": 16, "eventName": "Uxtic"}	2025-07-02 08:21:28.195	student
36	5	EVENT_APPROVED	{"eventId": 18, "eventName": "Tech Talk 2025", "approvedBy": 5}	2025-07-02 19:48:27.856	admin
37	13	EVENT_REGISTERED	{"eventId": 18, "eventName": "Tech Talk 2025", "registrationId": 1}	2025-07-02 19:49:52.876	alumni
38	13	EVENT_WITHDRAWAL	{"eventId": 18, "eventName": "Tech Talk 2025", "withdrawnAt": "2025-07-02T19:54:03.844Z"}	2025-07-02 19:54:03.845	alumni
39	13	REGISTERED_EVENTS_VIEWED	{"totalUpcomingRegistrations": 0}	2025-07-02 19:57:46.767	alumni
40	13	EVENT_REGISTERED	{"eventId": 18, "eventName": "Tech Talk 2025", "registrationId": 2}	2025-07-02 19:58:00.72	alumni
41	13	REGISTERED_EVENTS_VIEWED	{"totalUpcomingRegistrations": 1}	2025-07-02 19:58:06.422	alumni
42	13	VIEW_EVENT_REGISTRATIONS	{"eventId": "all_events", "totalEventsViewed": 1, "totalRegistrationsViewed": 1}	2025-07-02 19:59:41.837	admin
43	13	VIEW_EVENT_REGISTRATIONS	{"eventId": "all_events", "totalEventsViewed": 1, "totalRegistrationsViewed": 1}	2025-07-02 20:01:43.331	admin
44	13	USER_REMOVED_FROM_EVENT	{"eventId": 18, "eventName": "Tech Talk 2025", "removedUserId": 13, "registrationId": 2, "removedUserName": "Ramy", "removedUserRole": "alumni", "removedUserEmail": "ramy@student.com", "newRegistrationCount": 0}	2025-07-02 20:07:14.859	alumni
45	13	REMOVED_FROM_EVENT	{"eventId": 18, "eventName": "Tech Talk 2025", "removedBy": 13, "removedByRole": "alumni", "registrationId": 2}	2025-07-02 20:07:14.971	alumni
46	14	REGISTERED_EVENTS_VIEWED	{"totalUpcomingRegistrations": 0}	2025-07-02 20:39:06.322	student
47	14	EVENT_REGISTERED	{"eventId": 18, "eventName": "Tech Talk 2025", "registrationId": 3}	2025-07-02 20:39:27.656	student
48	14	EVENT_REGISTERED	{"eventId": 17, "eventName": "Test Event", "registrationId": 4}	2025-07-02 20:39:33.703	student
49	14	EVENT_REGISTERED	{"eventId": 14, "eventName": "Nothing", "registrationId": 5}	2025-07-02 20:39:41.797	student
50	14	REGISTERED_EVENTS_VIEWED	{"totalUpcomingRegistrations": 3}	2025-07-02 20:39:47.678	student
51	14	EVENT_WITHDRAWAL	{"eventId": 18, "eventName": "Tech Talk 2025", "withdrawnAt": "2025-07-02T20:41:59.734Z"}	2025-07-02 20:41:59.736	student
52	14	REGISTERED_EVENTS_VIEWED	{"totalUpcomingRegistrations": 2}	2025-07-02 20:42:08.484	student
53	3	EVENT_REGISTERED	{"eventId": 12, "eventName": "Latest", "registrationId": 6}	2025-07-03 06:03:07.998	alumni
54	6	EVENT_REGISTERED	{"eventId": 16, "eventName": "Uxtic", "registrationId": 7}	2025-07-03 06:15:22.913	student
55	6	EVENT_REGISTERED	{"eventId": 18, "eventName": "Tech Talk 2025", "registrationId": 8}	2025-07-03 06:15:32.619	student
56	6	EVENT_REGISTERED	{"eventId": 14, "eventName": "Nothing", "registrationId": 9}	2025-07-03 06:15:35.457	student
57	6	EVENT_REGISTERED	{"eventId": 17, "eventName": "Test Event", "registrationId": 10}	2025-07-03 06:27:06.812	student
58	6	EVENT_REGISTERED	{"eventId": 15, "eventName": "Twhwj", "registrationId": 11}	2025-07-03 06:27:11.976	student
\.


--
-- Data for Name: admins; Type: TABLE DATA; Schema: public; Owner: postgres
--

COPY public.admins (id, user_id) FROM stdin;
1	5
\.


--
-- Data for Name: alumni; Type: TABLE DATA; Schema: public; Owner: postgres
--

COPY public.alumni (id, graduation_year, course, current_job_title, company_name, user_id, company_role) FROM stdin;
2	2025		null	cochin university of science and technology	4	\N
3	2000	\N	CEO	Google 	7	\N
4	2022	\N	dev	fang	8	\N
5	2005	\N	Cofounder	Zappyhire	9	\N
6	2015	\N	Product Manager	Google	10	\N
7	2022	\N	dev	fang	12	\N
8	2023	B.Tech Computer Science	Software Engineer	Google	13	\N
1	2000		CEO	Google 	3	\N
\.


--
-- Data for Name: email_change_logs; Type: TABLE DATA; Schema: public; Owner: postgres
--

COPY public.email_change_logs (id, user_id, old_email, new_email, changed_at, user_type) FROM stdin;
\.


--
-- Data for Name: event_registrations; Type: TABLE DATA; Schema: public; Owner: postgres
--

COPY public.event_registrations (id, registered_user_id, event_id, registered_at) FROM stdin;
4	14	17	2025-07-02 20:39:33.583
5	14	14	2025-07-02 20:39:41.677
6	3	12	2025-07-03 06:03:07.772
7	6	16	2025-07-03 06:15:22.285
8	6	18	2025-07-03 06:15:31.303
9	6	14	2025-07-03 06:15:34.623
10	6	17	2025-07-03 06:27:06.441
11	6	15	2025-07-03 06:27:11.577
\.


--
-- Data for Name: events; Type: TABLE DATA; Schema: public; Owner: postgres
--

COPY public.events (id, user_id, name, date, "time", type, description, location, organizer, image_url, status, max_capacity, created_at, updated_at) FROM stdin;
12	5	Latest	2025-07-26 00:00:00	12:28	Networking Meetup	\N	Engineering Block	UNKNOWN	\N	approved	50	2025-07-01 06:56:53.054	2025-07-01 06:59:19.524
10	5	Test Event 2	2025-07-31 00:00:00	17:53	Cultural Festival	\N	Online (Zoom/Teams)	rahul	https://alumniblob.blob.core.windows.net/publicfiles/event-10-5-1750940398624.jpg	approved	\N	2025-06-26 12:19:58.145	2025-06-30 11:57:06.335
14	3	Nothing	2025-07-17 00:00:00	12:43	Networking Meetup	\N	Open Air Amphitheater	Jak	\N	approved	56	2025-07-01 07:13:29.525	2025-07-01 07:14:44.155
15	3	Twhwj	2025-07-24 00:00:00	15:43	Networking Meetup	\N	Engineering Block	Gajj	\N	approved	\N	2025-07-01 07:13:45.1	2025-07-01 07:14:48.512
17	10	Test Event	2025-07-23 00:00:00	17:41	Networking Meetup	\N	Main Auditorium	Google college club	https://alumniblob.blob.core.windows.net/publicfiles/event-17-10-1751354128612.jpg	approved	20	2025-07-01 07:15:28.28	2025-07-01 07:18:00.222
16	3	Uxtic	2025-07-17 00:00:00	17:44	Online Webinar	\N	Engineering Block	Tixc	\N	approved	\N	2025-07-01 07:14:26.877	2025-07-02 08:21:27.922
18	13	Tech Talk 2025	2025-07-20 00:00:00	14:00	Seminar	A tech seminar on AI trends for alumni and students.	Auditorium Hall, CUSAT	Department of Computer Science	\N	approved	\N	2025-07-02 19:45:11.119	2025-07-02 19:48:26.137
\.


--
-- Data for Name: faculty; Type: TABLE DATA; Schema: public; Owner: postgres
--

COPY public.faculty (id, designation, user_id) FROM stdin;
1	AP	11
\.


--
-- Data for Name: password_change_logs; Type: TABLE DATA; Schema: public; Owner: postgres
--

COPY public.password_change_logs (id, user_id, changed_at, user_type) FROM stdin;
\.


--
-- Data for Name: students; Type: TABLE DATA; Schema: public; Owner: postgres
--

COPY public.students (id, roll_number, user_id, current_semester, graduation_year, batch_end_year, batch_start_year) FROM stdin;
1	15	1	1	\N	\N	\N
2	18	2	2	\N	\N	\N
3	5	6	5	\N	\N	\N
4	CSE2021A045	14	6	\N	\N	\N
\.


--
-- Data for Name: support_requests; Type: TABLE DATA; Schema: public; Owner: postgres
--

COPY public.support_requests (id, user_id, alumni_id, status, created_at, "descriptionbyUser", "descriptionbyAlumni") FROM stdin;
1	9	9	pending	2025-07-01 18:04:55.066		
2	9	9	pending	2025-07-01 18:23:18.026		
3	9	9	pending	2025-07-01 18:24:23.126		
4	9	9	pending	2025-07-01 18:24:27.614		
5	9	9	pending	2025-07-01 18:27:46.785		
6	9	9	pending	2025-07-01 18:29:18.847		
7	9	9	pending	2025-07-01 18:31:45.587		
8	9	9	pending	2025-07-01 18:38:51.821		
9	9	9	pending	2025-07-01 18:39:57.18		
10	9	9	pending	2025-07-01 18:45:39.4		
11	9	9	pending	2025-07-01 18:48:01.326		
12	9	9	pending	2025-07-01 18:54:09.463		
13	9	9	pending	2025-07-01 18:57:26.041		
14	9	9	pending	2025-07-01 18:58:13.211		
15	9	9	pending	2025-07-01 18:59:42.301		
16	9	9	pending	2025-07-01 19:02:41.247		
17	9	9	pending	2025-07-01 19:03:47.181		
18	9	9	pending	2025-07-01 19:07:59.135		
19	9	9	pending	2025-07-01 19:10:10.473		
21	9	9	pending	2025-07-02 07:29:46.654		
20	9	9	rejected	2025-07-02 06:29:30.279		
24	3	7	accepted	2025-07-03 08:54:51.445	hi	Accepted
25	6	7	accepted	2025-07-03 09:28:50.511	hi	Accepted
22	1	12	accepted	2025-07-02 08:55:46.398	hey	Happy to help! Let’s talk.
23	6	3	accepted	2025-07-03 05:31:51.236	Hi	Accepted
\.


--
-- Data for Name: users; Type: TABLE DATA; Schema: public; Owner: postgres
--

COPY public.users (id, full_name, email, password, phone_number, department, role, created_at, photo_url, bio, linkedin_url, work_experience, github_url, twitter_url) FROM stdin;
7	Alumni2	aa@gmail.com	$2b$10$QT/uYPnicdo0PlF3hBgirORyihWBfy44cQXLRUgOsXxeRlydks2gu	07034722094	IT	alumni	2025-06-25 08:41:52.946	\N	\N	\N	\N	\N	\N
1	Noel S Kocheekkaran	noek@gmail.com	$2b$10$VsH4QArPrxmJd0FGsVHpOOsk.oY3vrDCw7CTZb9GCy0rXvqmFn2zK	7894561235	cse	student	2025-06-24 18:45:44.238	http://localhost:5001/uploads/user-1-1750790794006.jpeg			\N		
8	Rahul R p	alumni@gmail.com	$2b$10$1TWkufieRcnoZMOXxVlZDutyDvZkuAHwUyFEcwBgU1fTFvSBiYV9G	9544451721	cse	alumni	2025-06-29 14:43:38.454	\N	\N	\N	\N	\N	\N
9	Deepu Alumni	deepu@zappyhire.com	$2b$10$qR3q03rlJU5bjlZ6IGDTh.e/OTP270g9JY264YfL315SOxI3.B.Ve	9901276899	Mech	alumni	2025-06-30 04:24:36.625	\N	\N	\N	\N	\N	\N
10	Alumni Example	alumni@example.com	$2b$10$KjuEIEmj9DHa7HFn/wHUouXGEqy.4u.p5YWHii.w/MSF7M74AXV..	1234567891	CSE	alumni	2025-07-01 07:10:26.594	\N	\N	\N	\N	\N	\N
6	Adith Dileep	adithdileepadaditha@gmail.com	$2b$10$2WtwkRDyE0h7bpiO0c3IOO.ytx2wZpk9LAEvldlrR5JJD9.l8Klgq	07034722094	IT	student	2025-06-25 07:57:50.331	http://43.204.96.201:5001/uploads/user/user-6-1750841590422.jpg		https://github.com/rprahul07/alumini-project/blob/dev/frontend/src/components/dashboard/ProfileEditor	\N	https://github.com/rprahul07/alumini-project/blob/dev/frontend/src/components/dashboard/ProfileEditor.jsx	https://github.com/rprahul07/alumini-project/blob/dev/frontend/src/components/dashboard/ProfileEditor.jsx
11	Faculty	f@example.com	$2b$10$2u9ZOsKYMoZUcoI9I.WOEODYWFDW/IKPAGlMYy2wB21XCQa7atkHO	07034722094	IT	faculty	2025-07-01 08:17:14.093	\N	\N	\N	\N	\N	\N
12	Rahul R p	alumnialumni@gmail.com	$2b$10$97KEU9SFHpp3MiRt.eAjdOUsfplRpAcPDKdX1rtv3PIys5aXTCOD6	09544451721	hb	alumni	2025-07-02 07:34:31.624	\N	\N	\N	\N	\N	\N
13	Ramy	ramy@student.com	$2b$10$qW6ICTNCoN9yXCf4ip04xuZ0b0rv/oCzK4G5hkU9JMDA2t76FSvGK	9876543210	CSE	alumni	2025-07-02 19:41:34.232	\N	\N	\N	\N	\N	\N
14	alex K	alexs@student.com	$2b$10$MSiva8cPSQgT7ttJV7pYRudq4kSRspRLEYyogEFV0JAcQJVFckk62	9123456780	CSE	student	2025-07-02 20:38:09.934	\N	\N	\N	\N	\N	\N
3	Alumni	a@gmail.com	$2b$10$JdQfHn16dc.Z6.08HBCZE.YaX.go..ta8fvv6iwXPUQHMWyoRbL06	7034722094	IT	alumni	2025-06-25 01:14:05.798	http://43.204.96.201:5001/uploads/user/user-3-1750864492944.jpg	okkkkkkkkkkkkkkkkkkkkkkkkkkkkkkkkkkkkkkkkkkkkkkkkkkkkkkkkkkkkkkkkkkkkkkkkkkkkkkkk	 https://share.google/hlWv9xZkSVMGtwYOO	\N	   https://share.google/hlWv9xZkSVMGtwYOO	https://share.google/hlWv9xZkSVMGtwYOO
5	Rahul R P	admin@example.com	$2b$10$8uvvPa0KUa9wc88Kqk47xunfmDUcDAvMKQu.8BnY7S5FjzvZutj6a	123456789	cse	admin	2025-06-25 07:22:05.851	\N	\N	\N	\N	\N	\N
4	Van	noeelskocheekaran@gmail.com	$2b$10$HD9F9zwEaOHNOfRlToiD8O.ufxLQrKccCK2U52NWmTAmglYoMBPmm	07306761456	cse	alumni	2025-06-25 06:40:31.33	http://43.204.96.201:5001/uploads/user/user-4-1750837740165.jpeg			\N		
2	Rahul R p	rprahulofficial07@gmail.com	$2b$10$H/.4HPO/dKzZpfAtRLDXiejpm8r1oRnum3yIztiuAoapm8U0ylBK.	09544451720	cse	student	2025-06-24 18:46:13.376	http://43.204.96.201:5001/uploads/user/user-2-1750837982174.jpg			\N		
\.


--
-- Name: activity_logs_id_seq; Type: SEQUENCE SET; Schema: public; Owner: postgres
--

SELECT pg_catalog.setval('public.activity_logs_id_seq', 58, true);


--
-- Name: admins_id_seq; Type: SEQUENCE SET; Schema: public; Owner: postgres
--

SELECT pg_catalog.setval('public.admins_id_seq', 1, true);


--
-- Name: alumni_id_seq; Type: SEQUENCE SET; Schema: public; Owner: postgres
--

SELECT pg_catalog.setval('public.alumni_id_seq', 8, true);


--
-- Name: email_change_logs_id_seq; Type: SEQUENCE SET; Schema: public; Owner: postgres
--

SELECT pg_catalog.setval('public.email_change_logs_id_seq', 1, false);


--
-- Name: event_registrations_id_seq; Type: SEQUENCE SET; Schema: public; Owner: postgres
--

SELECT pg_catalog.setval('public.event_registrations_id_seq', 11, true);


--
-- Name: events_id_seq; Type: SEQUENCE SET; Schema: public; Owner: postgres
--

SELECT pg_catalog.setval('public.events_id_seq', 18, true);


--
-- Name: faculty_id_seq; Type: SEQUENCE SET; Schema: public; Owner: postgres
--

SELECT pg_catalog.setval('public.faculty_id_seq', 1, true);


--
-- Name: password_change_logs_id_seq; Type: SEQUENCE SET; Schema: public; Owner: postgres
--

SELECT pg_catalog.setval('public.password_change_logs_id_seq', 1, false);


--
-- Name: students_id_seq; Type: SEQUENCE SET; Schema: public; Owner: postgres
--

SELECT pg_catalog.setval('public.students_id_seq', 4, true);


--
-- Name: support_requests_id_seq; Type: SEQUENCE SET; Schema: public; Owner: postgres
--

SELECT pg_catalog.setval('public.support_requests_id_seq', 25, true);


--
-- Name: users_id_seq; Type: SEQUENCE SET; Schema: public; Owner: postgres
--

SELECT pg_catalog.setval('public.users_id_seq', 14, true);


--
-- Name: _prisma_migrations _prisma_migrations_pkey; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public._prisma_migrations
    ADD CONSTRAINT _prisma_migrations_pkey PRIMARY KEY (id);


--
-- Name: activity_logs activity_logs_pkey; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.activity_logs
    ADD CONSTRAINT activity_logs_pkey PRIMARY KEY (id);


--
-- Name: admins admins_pkey; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.admins
    ADD CONSTRAINT admins_pkey PRIMARY KEY (id);


--
-- Name: alumni alumni_pkey; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.alumni
    ADD CONSTRAINT alumni_pkey PRIMARY KEY (id);


--
-- Name: email_change_logs email_change_logs_pkey; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.email_change_logs
    ADD CONSTRAINT email_change_logs_pkey PRIMARY KEY (id);


--
-- Name: event_registrations event_registrations_pkey; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.event_registrations
    ADD CONSTRAINT event_registrations_pkey PRIMARY KEY (id);


--
-- Name: events events_pkey; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.events
    ADD CONSTRAINT events_pkey PRIMARY KEY (id);


--
-- Name: faculty faculty_pkey; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.faculty
    ADD CONSTRAINT faculty_pkey PRIMARY KEY (id);


--
-- Name: password_change_logs password_change_logs_pkey; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.password_change_logs
    ADD CONSTRAINT password_change_logs_pkey PRIMARY KEY (id);


--
-- Name: students students_pkey; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.students
    ADD CONSTRAINT students_pkey PRIMARY KEY (id);


--
-- Name: support_requests support_requests_pkey; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.support_requests
    ADD CONSTRAINT support_requests_pkey PRIMARY KEY (id);


--
-- Name: users users_pkey; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.users
    ADD CONSTRAINT users_pkey PRIMARY KEY (id);


--
-- Name: activity_logs_user_id_idx; Type: INDEX; Schema: public; Owner: postgres
--

CREATE INDEX activity_logs_user_id_idx ON public.activity_logs USING btree (user_id);


--
-- Name: admins_user_id_key; Type: INDEX; Schema: public; Owner: postgres
--

CREATE UNIQUE INDEX admins_user_id_key ON public.admins USING btree (user_id);


--
-- Name: alumni_user_id_key; Type: INDEX; Schema: public; Owner: postgres
--

CREATE UNIQUE INDEX alumni_user_id_key ON public.alumni USING btree (user_id);


--
-- Name: email_change_logs_user_id_idx; Type: INDEX; Schema: public; Owner: postgres
--

CREATE INDEX email_change_logs_user_id_idx ON public.email_change_logs USING btree (user_id);


--
-- Name: event_registrations_event_id_idx; Type: INDEX; Schema: public; Owner: postgres
--

CREATE INDEX event_registrations_event_id_idx ON public.event_registrations USING btree (event_id);


--
-- Name: event_registrations_registered_user_id_event_id_key; Type: INDEX; Schema: public; Owner: postgres
--

CREATE UNIQUE INDEX event_registrations_registered_user_id_event_id_key ON public.event_registrations USING btree (registered_user_id, event_id);


--
-- Name: event_registrations_registered_user_id_idx; Type: INDEX; Schema: public; Owner: postgres
--

CREATE INDEX event_registrations_registered_user_id_idx ON public.event_registrations USING btree (registered_user_id);


--
-- Name: events_date_idx; Type: INDEX; Schema: public; Owner: postgres
--

CREATE INDEX events_date_idx ON public.events USING btree (date);


--
-- Name: events_status_idx; Type: INDEX; Schema: public; Owner: postgres
--

CREATE INDEX events_status_idx ON public.events USING btree (status);


--
-- Name: events_type_idx; Type: INDEX; Schema: public; Owner: postgres
--

CREATE INDEX events_type_idx ON public.events USING btree (type);


--
-- Name: events_user_id_idx; Type: INDEX; Schema: public; Owner: postgres
--

CREATE INDEX events_user_id_idx ON public.events USING btree (user_id);


--
-- Name: faculty_user_id_key; Type: INDEX; Schema: public; Owner: postgres
--

CREATE UNIQUE INDEX faculty_user_id_key ON public.faculty USING btree (user_id);


--
-- Name: password_change_logs_user_id_idx; Type: INDEX; Schema: public; Owner: postgres
--

CREATE INDEX password_change_logs_user_id_idx ON public.password_change_logs USING btree (user_id);


--
-- Name: students_roll_number_key; Type: INDEX; Schema: public; Owner: postgres
--

CREATE UNIQUE INDEX students_roll_number_key ON public.students USING btree (roll_number);


--
-- Name: students_user_id_key; Type: INDEX; Schema: public; Owner: postgres
--

CREATE UNIQUE INDEX students_user_id_key ON public.students USING btree (user_id);


--
-- Name: support_requests_alumni_id_idx; Type: INDEX; Schema: public; Owner: postgres
--

CREATE INDEX support_requests_alumni_id_idx ON public.support_requests USING btree (alumni_id);


--
-- Name: support_requests_user_id_idx; Type: INDEX; Schema: public; Owner: postgres
--

CREATE INDEX support_requests_user_id_idx ON public.support_requests USING btree (user_id);


--
-- Name: users_email_idx; Type: INDEX; Schema: public; Owner: postgres
--

CREATE INDEX users_email_idx ON public.users USING btree (email);


--
-- Name: users_email_key; Type: INDEX; Schema: public; Owner: postgres
--

CREATE UNIQUE INDEX users_email_key ON public.users USING btree (email);


--
-- Name: admins admins_user_id_fkey; Type: FK CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.admins
    ADD CONSTRAINT admins_user_id_fkey FOREIGN KEY (user_id) REFERENCES public.users(id) ON UPDATE CASCADE ON DELETE RESTRICT;


--
-- Name: alumni alumni_user_id_fkey; Type: FK CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.alumni
    ADD CONSTRAINT alumni_user_id_fkey FOREIGN KEY (user_id) REFERENCES public.users(id) ON UPDATE CASCADE ON DELETE RESTRICT;


--
-- Name: event_registrations event_registrations_event_id_fkey; Type: FK CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.event_registrations
    ADD CONSTRAINT event_registrations_event_id_fkey FOREIGN KEY (event_id) REFERENCES public.events(id) ON UPDATE CASCADE ON DELETE RESTRICT;


--
-- Name: event_registrations event_registrations_registered_user_id_fkey; Type: FK CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.event_registrations
    ADD CONSTRAINT event_registrations_registered_user_id_fkey FOREIGN KEY (registered_user_id) REFERENCES public.users(id) ON UPDATE CASCADE ON DELETE RESTRICT;


--
-- Name: events events_user_id_fkey; Type: FK CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.events
    ADD CONSTRAINT events_user_id_fkey FOREIGN KEY (user_id) REFERENCES public.users(id) ON UPDATE CASCADE ON DELETE RESTRICT;


--
-- Name: faculty faculty_user_id_fkey; Type: FK CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.faculty
    ADD CONSTRAINT faculty_user_id_fkey FOREIGN KEY (user_id) REFERENCES public.users(id) ON UPDATE CASCADE ON DELETE RESTRICT;


--
-- Name: students students_user_id_fkey; Type: FK CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.students
    ADD CONSTRAINT students_user_id_fkey FOREIGN KEY (user_id) REFERENCES public.users(id) ON UPDATE CASCADE ON DELETE RESTRICT;


--
-- Name: support_requests support_requests_alumni_id_fkey; Type: FK CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.support_requests
    ADD CONSTRAINT support_requests_alumni_id_fkey FOREIGN KEY (alumni_id) REFERENCES public.users(id) ON UPDATE CASCADE ON DELETE SET NULL;


--
-- Name: support_requests support_requests_user_id_fkey; Type: FK CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.support_requests
    ADD CONSTRAINT support_requests_user_id_fkey FOREIGN KEY (user_id) REFERENCES public.users(id) ON UPDATE CASCADE ON DELETE RESTRICT;


--
-- PostgreSQL database dump complete
--

