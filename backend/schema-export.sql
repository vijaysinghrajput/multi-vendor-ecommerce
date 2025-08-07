--
-- PostgreSQL database dump
--

-- Dumped from database version 15.13 (Homebrew)
-- Dumped by pg_dump version 15.13 (Homebrew)

SET statement_timeout = 0;
SET lock_timeout = 0;
SET idle_in_transaction_session_timeout = 0;
SET client_encoding = 'UTF8';
SET standard_conforming_strings = on;
SELECT pg_catalog.set_config('search_path', '', false);
SET check_function_bodies = false;
SET xmloption = content;
SET client_min_messages = warning;
SET row_security = off;

--
-- Name: uuid-ossp; Type: EXTENSION; Schema: -; Owner: -
--

CREATE EXTENSION IF NOT EXISTS "uuid-ossp" WITH SCHEMA public;


--
-- Name: EXTENSION "uuid-ossp"; Type: COMMENT; Schema: -; Owner: -
--

COMMENT ON EXTENSION "uuid-ossp" IS 'generate universally unique identifiers (UUIDs)';


--
-- Name: commission_type; Type: TYPE; Schema: public; Owner: -
--

CREATE TYPE public.commission_type AS ENUM (
    'fixed',
    'percentage'
);


--
-- Name: discount_type; Type: TYPE; Schema: public; Owner: -
--

CREATE TYPE public.discount_type AS ENUM (
    'fixed',
    'percentage'
);


--
-- Name: exchange_status; Type: TYPE; Schema: public; Owner: -
--

CREATE TYPE public.exchange_status AS ENUM (
    'pending',
    'approved',
    'rejected',
    'completed'
);


--
-- Name: notification_type; Type: TYPE; Schema: public; Owner: -
--

CREATE TYPE public.notification_type AS ENUM (
    'push',
    'email',
    'sms'
);


--
-- Name: order_status; Type: TYPE; Schema: public; Owner: -
--

CREATE TYPE public.order_status AS ENUM (
    'placed',
    'confirmed',
    'shipped',
    'delivered',
    'cancelled',
    'returned',
    'exchanged'
);


--
-- Name: payment_gateway; Type: TYPE; Schema: public; Owner: -
--

CREATE TYPE public.payment_gateway AS ENUM (
    'razorpay',
    'stripe',
    'cashfree',
    'cod'
);


--
-- Name: payment_status; Type: TYPE; Schema: public; Owner: -
--

CREATE TYPE public.payment_status AS ENUM (
    'pending',
    'completed',
    'failed',
    'refunded'
);


--
-- Name: payout_status; Type: TYPE; Schema: public; Owner: -
--

CREATE TYPE public.payout_status AS ENUM (
    'pending',
    'processing',
    'paid',
    'failed'
);


--
-- Name: return_status; Type: TYPE; Schema: public; Owner: -
--

CREATE TYPE public.return_status AS ENUM (
    'pending',
    'approved',
    'rejected',
    'refunded'
);


--
-- Name: user_role; Type: TYPE; Schema: public; Owner: -
--

CREATE TYPE public.user_role AS ENUM (
    'admin',
    'vendor',
    'customer'
);


--
-- Name: user_status; Type: TYPE; Schema: public; Owner: -
--

CREATE TYPE public.user_status AS ENUM (
    'active',
    'inactive',
    'suspended'
);


--
-- Name: update_updated_at_column(); Type: FUNCTION; Schema: public; Owner: -
--

CREATE FUNCTION public.update_updated_at_column() RETURNS trigger
    LANGUAGE plpgsql
    AS $$
BEGIN
    NEW.updated_at = CURRENT_TIMESTAMP;
    RETURN NEW;
END;
$$;


SET default_tablespace = '';

SET default_table_access_method = heap;

--
-- Name: addresses; Type: TABLE; Schema: public; Owner: -
--

CREATE TABLE public.addresses (
    id uuid DEFAULT public.uuid_generate_v4() NOT NULL,
    user_id uuid NOT NULL,
    name character varying(100) NOT NULL,
    phone character varying(20) NOT NULL,
    address_line_1 character varying(255) NOT NULL,
    address_line_2 character varying(255),
    landmark character varying(255),
    city character varying(100) NOT NULL,
    state character varying(100) NOT NULL,
    pincode character varying(10) NOT NULL,
    country character varying(100) DEFAULT 'India'::character varying,
    latitude numeric(10,8),
    longitude numeric(11,8),
    is_default boolean DEFAULT false,
    address_type character varying(20) DEFAULT 'home'::character varying,
    created_at timestamp without time zone DEFAULT CURRENT_TIMESTAMP,
    updated_at timestamp without time zone DEFAULT CURRENT_TIMESTAMP
);


--
-- Name: carts; Type: TABLE; Schema: public; Owner: -
--

CREATE TABLE public.carts (
    id uuid DEFAULT public.uuid_generate_v4() NOT NULL,
    user_id uuid NOT NULL,
    product_id uuid NOT NULL,
    variant_id uuid,
    quantity integer DEFAULT 1 NOT NULL,
    created_at timestamp without time zone DEFAULT CURRENT_TIMESTAMP,
    updated_at timestamp without time zone DEFAULT CURRENT_TIMESTAMP
);


--
-- Name: commissions; Type: TABLE; Schema: public; Owner: -
--

CREATE TABLE public.commissions (
    id uuid DEFAULT public.uuid_generate_v4() NOT NULL,
    name character varying(255) NOT NULL,
    type public.commission_type NOT NULL,
    value numeric(5,2) NOT NULL,
    category_id uuid,
    vendor_id uuid,
    is_default boolean DEFAULT false,
    is_active boolean DEFAULT true,
    created_at timestamp without time zone DEFAULT CURRENT_TIMESTAMP,
    updated_at timestamp without time zone DEFAULT CURRENT_TIMESTAMP
);


--
-- Name: conversions; Type: TABLE; Schema: public; Owner: -
--

CREATE TABLE public.conversions (
    id uuid DEFAULT public.uuid_generate_v4() NOT NULL,
    user_id uuid,
    session_id character varying(255),
    order_id uuid,
    conversion_type character varying(50) NOT NULL,
    value numeric(10,2),
    source character varying(100),
    medium character varying(100),
    campaign character varying(100),
    converted_at timestamp without time zone DEFAULT CURRENT_TIMESTAMP
);


--
-- Name: coupons; Type: TABLE; Schema: public; Owner: -
--

CREATE TABLE public.coupons (
    id uuid DEFAULT public.uuid_generate_v4() NOT NULL,
    code character varying(50) NOT NULL,
    name character varying(255) NOT NULL,
    description text,
    discount_type public.discount_type NOT NULL,
    discount_value numeric(10,2) NOT NULL,
    minimum_order_amount numeric(10,2) DEFAULT 0,
    maximum_discount_amount numeric(10,2),
    usage_limit integer,
    used_count integer DEFAULT 0,
    user_usage_limit integer DEFAULT 1,
    start_date timestamp without time zone NOT NULL,
    expiry_date timestamp without time zone NOT NULL,
    is_active boolean DEFAULT true,
    applicable_categories uuid[],
    applicable_vendors uuid[],
    created_at timestamp without time zone DEFAULT CURRENT_TIMESTAMP,
    updated_at timestamp without time zone DEFAULT CURRENT_TIMESTAMP
);


--
-- Name: exchanges; Type: TABLE; Schema: public; Owner: -
--

CREATE TABLE public.exchanges (
    id uuid DEFAULT public.uuid_generate_v4() NOT NULL,
    order_item_id uuid NOT NULL,
    exchange_number character varying(50) NOT NULL,
    reason text NOT NULL,
    status public.exchange_status DEFAULT 'pending'::public.exchange_status NOT NULL,
    new_variant_id uuid,
    price_difference numeric(10,2) DEFAULT 0,
    admin_notes text,
    images text[],
    approved_at timestamp without time zone,
    completed_at timestamp without time zone,
    created_at timestamp without time zone DEFAULT CURRENT_TIMESTAMP,
    updated_at timestamp without time zone DEFAULT CURRENT_TIMESTAMP
);


--
-- Name: migrations; Type: TABLE; Schema: public; Owner: -
--

CREATE TABLE public.migrations (
    id integer NOT NULL,
    "timestamp" bigint NOT NULL,
    name character varying NOT NULL
);


--
-- Name: migrations_id_seq; Type: SEQUENCE; Schema: public; Owner: -
--

CREATE SEQUENCE public.migrations_id_seq
    AS integer
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;


--
-- Name: migrations_id_seq; Type: SEQUENCE OWNED BY; Schema: public; Owner: -
--

ALTER SEQUENCE public.migrations_id_seq OWNED BY public.migrations.id;


--
-- Name: notifications; Type: TABLE; Schema: public; Owner: -
--

CREATE TABLE public.notifications (
    id uuid DEFAULT public.uuid_generate_v4() NOT NULL,
    user_id uuid NOT NULL,
    type public.notification_type NOT NULL,
    title character varying(255) NOT NULL,
    body text NOT NULL,
    data jsonb,
    is_read boolean DEFAULT false,
    read_at timestamp without time zone,
    sent_at timestamp without time zone,
    created_at timestamp without time zone DEFAULT CURRENT_TIMESTAMP,
    updated_at timestamp without time zone DEFAULT CURRENT_TIMESTAMP
);


--
-- Name: order_items; Type: TABLE; Schema: public; Owner: -
--

CREATE TABLE public.order_items (
    id uuid DEFAULT public.uuid_generate_v4() NOT NULL,
    order_id uuid NOT NULL,
    product_id uuid NOT NULL,
    variant_id uuid,
    quantity integer NOT NULL,
    unit_price numeric(10,2) NOT NULL,
    total_price numeric(10,2) NOT NULL,
    product_name character varying(255) NOT NULL,
    product_sku character varying(100) NOT NULL,
    variant_details jsonb,
    created_at timestamp without time zone DEFAULT CURRENT_TIMESTAMP,
    updated_at timestamp without time zone DEFAULT CURRENT_TIMESTAMP
);


--
-- Name: order_stats; Type: TABLE; Schema: public; Owner: -
--

CREATE TABLE public.order_stats (
    id uuid DEFAULT public.uuid_generate_v4() NOT NULL,
    date date NOT NULL,
    vendor_id uuid,
    total_orders integer DEFAULT 0,
    total_revenue numeric(12,2) DEFAULT 0,
    total_commission numeric(12,2) DEFAULT 0,
    avg_order_value numeric(10,2) DEFAULT 0,
    created_at timestamp without time zone DEFAULT CURRENT_TIMESTAMP
);


--
-- Name: orders; Type: TABLE; Schema: public; Owner: -
--

CREATE TABLE public.orders (
    id uuid DEFAULT public.uuid_generate_v4() NOT NULL,
    order_number character varying(50) NOT NULL,
    user_id uuid NOT NULL,
    vendor_id uuid NOT NULL,
    status public.order_status DEFAULT 'placed'::public.order_status NOT NULL,
    payment_status public.payment_status DEFAULT 'pending'::public.payment_status NOT NULL,
    total_amount numeric(10,2) NOT NULL,
    subtotal numeric(10,2) NOT NULL,
    tax_amount numeric(10,2) DEFAULT 0,
    shipping_amount numeric(10,2) DEFAULT 0,
    discount_amount numeric(10,2) DEFAULT 0,
    shipping_address_id uuid NOT NULL,
    billing_address_id uuid,
    coupon_code character varying(50),
    notes text,
    shipped_at timestamp without time zone,
    delivered_at timestamp without time zone,
    cancelled_at timestamp without time zone,
    cancellation_reason text,
    tracking_number character varying(100),
    estimated_delivery_date date,
    created_at timestamp without time zone DEFAULT CURRENT_TIMESTAMP,
    updated_at timestamp without time zone DEFAULT CURRENT_TIMESTAMP
);


--
-- Name: payments; Type: TABLE; Schema: public; Owner: -
--

CREATE TABLE public.payments (
    id uuid DEFAULT public.uuid_generate_v4() NOT NULL,
    order_id uuid NOT NULL,
    payment_gateway public.payment_gateway NOT NULL,
    status public.payment_status DEFAULT 'pending'::public.payment_status NOT NULL,
    amount numeric(10,2) NOT NULL,
    currency character varying(3) DEFAULT 'INR'::character varying,
    transaction_id character varying(255),
    gateway_transaction_id character varying(255),
    gateway_response jsonb,
    payment_method character varying(50),
    refund_amount numeric(10,2) DEFAULT 0,
    created_at timestamp without time zone DEFAULT CURRENT_TIMESTAMP,
    updated_at timestamp without time zone DEFAULT CURRENT_TIMESTAMP
);


--
-- Name: payouts_ledger; Type: TABLE; Schema: public; Owner: -
--

CREATE TABLE public.payouts_ledger (
    id uuid DEFAULT public.uuid_generate_v4() NOT NULL,
    vendor_id uuid NOT NULL,
    order_id uuid,
    payout_id uuid,
    transaction_type character varying(20) NOT NULL,
    amount numeric(10,2) NOT NULL,
    commission_rate numeric(5,2),
    commission_amount numeric(10,2),
    description text,
    balance_after numeric(10,2) NOT NULL,
    created_at timestamp without time zone DEFAULT CURRENT_TIMESTAMP
);


--
-- Name: product_categories; Type: TABLE; Schema: public; Owner: -
--

CREATE TABLE public.product_categories (
    id uuid DEFAULT public.uuid_generate_v4() NOT NULL,
    name character varying(255) NOT NULL,
    slug character varying(255) NOT NULL,
    description text,
    image_url text,
    parent_id uuid,
    sort_order integer DEFAULT 0,
    is_active boolean DEFAULT true,
    meta_title character varying(255),
    meta_description text,
    created_at timestamp without time zone DEFAULT CURRENT_TIMESTAMP,
    updated_at timestamp without time zone DEFAULT CURRENT_TIMESTAMP
);


--
-- Name: product_variants; Type: TABLE; Schema: public; Owner: -
--

CREATE TABLE public.product_variants (
    id uuid DEFAULT public.uuid_generate_v4() NOT NULL,
    product_id uuid NOT NULL,
    sku character varying(100) NOT NULL,
    color character varying(50),
    size character varying(50),
    material character varying(100),
    price numeric(10,2) NOT NULL,
    compare_price numeric(10,2),
    stock_quantity integer DEFAULT 0,
    image_url text,
    weight numeric(8,3),
    is_active boolean DEFAULT true,
    created_at timestamp without time zone DEFAULT CURRENT_TIMESTAMP,
    updated_at timestamp without time zone DEFAULT CURRENT_TIMESTAMP
);


--
-- Name: product_views; Type: TABLE; Schema: public; Owner: -
--

CREATE TABLE public.product_views (
    id uuid DEFAULT public.uuid_generate_v4() NOT NULL,
    product_id uuid NOT NULL,
    user_id uuid,
    session_id character varying(255),
    ip_address inet,
    user_agent text,
    referrer text,
    viewed_at timestamp without time zone DEFAULT CURRENT_TIMESTAMP
);


--
-- Name: products; Type: TABLE; Schema: public; Owner: -
--

CREATE TABLE public.products (
    id uuid DEFAULT public.uuid_generate_v4() NOT NULL,
    vendor_id uuid NOT NULL,
    category_id uuid NOT NULL,
    name character varying(255) NOT NULL,
    slug character varying(255) NOT NULL,
    sku character varying(100) NOT NULL,
    description text,
    short_description text,
    images text[] DEFAULT '{}'::text[],
    price numeric(10,2) NOT NULL,
    compare_price numeric(10,2),
    cost_price numeric(10,2),
    discount_percentage numeric(5,2) DEFAULT 0,
    stock_quantity integer DEFAULT 0,
    min_stock_level integer DEFAULT 5,
    weight numeric(8,3),
    dimensions jsonb,
    rating numeric(3,2) DEFAULT 0,
    review_count integer DEFAULT 0,
    is_active boolean DEFAULT true,
    is_featured boolean DEFAULT false,
    tags text[],
    meta_title character varying(255),
    meta_description text,
    created_at timestamp without time zone DEFAULT CURRENT_TIMESTAMP,
    updated_at timestamp without time zone DEFAULT CURRENT_TIMESTAMP
);


--
-- Name: returns; Type: TABLE; Schema: public; Owner: -
--

CREATE TABLE public.returns (
    id uuid DEFAULT public.uuid_generate_v4() NOT NULL,
    order_item_id uuid NOT NULL,
    return_number character varying(50) NOT NULL,
    reason text NOT NULL,
    status public.return_status DEFAULT 'pending'::public.return_status NOT NULL,
    refund_amount numeric(10,2) NOT NULL,
    admin_notes text,
    images text[],
    approved_at timestamp without time zone,
    refunded_at timestamp without time zone,
    created_at timestamp without time zone DEFAULT CURRENT_TIMESTAMP,
    updated_at timestamp without time zone DEFAULT CURRENT_TIMESTAMP
);


--
-- Name: reviews; Type: TABLE; Schema: public; Owner: -
--

CREATE TABLE public.reviews (
    id uuid DEFAULT public.uuid_generate_v4() NOT NULL,
    user_id uuid NOT NULL,
    product_id uuid NOT NULL,
    order_item_id uuid,
    rating integer NOT NULL,
    title character varying(255),
    comment text,
    images text[],
    is_verified boolean DEFAULT false,
    is_approved boolean DEFAULT true,
    helpful_count integer DEFAULT 0,
    created_at timestamp without time zone DEFAULT CURRENT_TIMESTAMP,
    updated_at timestamp without time zone DEFAULT CURRENT_TIMESTAMP,
    CONSTRAINT reviews_rating_check CHECK (((rating >= 1) AND (rating <= 5)))
);


--
-- Name: user_sessions; Type: TABLE; Schema: public; Owner: -
--

CREATE TABLE public.user_sessions (
    id uuid DEFAULT public.uuid_generate_v4() NOT NULL,
    user_id uuid,
    session_id character varying(255) NOT NULL,
    ip_address inet,
    user_agent text,
    device_type character varying(50),
    browser character varying(100),
    os character varying(100),
    country character varying(100),
    city character varying(100),
    started_at timestamp without time zone DEFAULT CURRENT_TIMESTAMP,
    ended_at timestamp without time zone,
    page_views integer DEFAULT 0,
    duration_seconds integer DEFAULT 0
);


--
-- Name: users; Type: TABLE; Schema: public; Owner: -
--

CREATE TABLE public.users (
    id uuid DEFAULT public.uuid_generate_v4() NOT NULL,
    email character varying(255) NOT NULL,
    password_hash character varying(255) NOT NULL,
    first_name character varying(100) NOT NULL,
    last_name character varying(100) NOT NULL,
    phone character varying(20),
    role public.user_role DEFAULT 'customer'::public.user_role NOT NULL,
    status public.user_status DEFAULT 'active'::public.user_status NOT NULL,
    email_verified boolean DEFAULT false,
    phone_verified boolean DEFAULT false,
    avatar_url text,
    date_of_birth date,
    gender character varying(10),
    last_login_at timestamp without time zone,
    created_at timestamp without time zone DEFAULT CURRENT_TIMESTAMP,
    updated_at timestamp without time zone DEFAULT CURRENT_TIMESTAMP,
    login_attempts integer DEFAULT 0,
    locked_until timestamp without time zone,
    last_login_ip character varying(45),
    two_factor_enabled boolean DEFAULT false,
    two_factor_secret text,
    language character varying(10) DEFAULT 'en'::character varying,
    currency character varying(10) DEFAULT 'USD'::character varying,
    timezone character varying(50) DEFAULT 'UTC'::character varying,
    marketing_consent boolean DEFAULT false,
    push_notifications boolean DEFAULT true,
    email_notifications boolean DEFAULT true,
    sms_notifications boolean DEFAULT false,
    refresh_token text,
    reset_password_token text,
    reset_password_expires timestamp without time zone,
    email_verification_token text,
    auth_provider character varying(20) DEFAULT 'local'::character varying,
    provider_id text,
    cartid uuid,
    wishlistid uuid
);


--
-- Name: vendor_payouts; Type: TABLE; Schema: public; Owner: -
--

CREATE TABLE public.vendor_payouts (
    id uuid DEFAULT public.uuid_generate_v4() NOT NULL,
    vendor_id uuid NOT NULL,
    payout_number character varying(50) NOT NULL,
    amount numeric(10,2) NOT NULL,
    commission_deducted numeric(10,2) NOT NULL,
    net_amount numeric(10,2) NOT NULL,
    status public.payout_status DEFAULT 'pending'::public.payout_status NOT NULL,
    reference_note text,
    transaction_id character varying(255),
    processed_at timestamp without time zone,
    created_at timestamp without time zone DEFAULT CURRENT_TIMESTAMP,
    updated_at timestamp without time zone DEFAULT CURRENT_TIMESTAMP
);


--
-- Name: vendors; Type: TABLE; Schema: public; Owner: -
--

CREATE TABLE public.vendors (
    id uuid DEFAULT public.uuid_generate_v4() NOT NULL,
    user_id uuid NOT NULL,
    store_name character varying(255) NOT NULL,
    store_description text,
    gst_number character varying(15),
    pan_number character varying(10) NOT NULL,
    logo_url text,
    banner_url text,
    address text NOT NULL,
    city character varying(100) NOT NULL,
    state character varying(100) NOT NULL,
    pincode character varying(10) NOT NULL,
    country character varying(100) DEFAULT 'India'::character varying,
    latitude numeric(10,8),
    longitude numeric(11,8),
    commission_type public.commission_type DEFAULT 'percentage'::public.commission_type,
    commission_value numeric(5,2) DEFAULT 10.00,
    is_verified boolean DEFAULT false,
    is_active boolean DEFAULT true,
    bank_account_number character varying(20),
    bank_ifsc_code character varying(11),
    bank_account_holder_name character varying(255),
    created_at timestamp without time zone DEFAULT CURRENT_TIMESTAMP,
    updated_at timestamp without time zone DEFAULT CURRENT_TIMESTAMP
);


--
-- Name: wishlist; Type: TABLE; Schema: public; Owner: -
--

CREATE TABLE public.wishlist (
    id uuid DEFAULT public.uuid_generate_v4() NOT NULL,
    user_id uuid NOT NULL,
    product_id uuid NOT NULL,
    created_at timestamp without time zone DEFAULT CURRENT_TIMESTAMP
);


--
-- Name: migrations id; Type: DEFAULT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.migrations ALTER COLUMN id SET DEFAULT nextval('public.migrations_id_seq'::regclass);


--
-- Name: migrations PK_8c82d7f526340ab734260ea46be; Type: CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.migrations
    ADD CONSTRAINT "PK_8c82d7f526340ab734260ea46be" PRIMARY KEY (id);


--
-- Name: addresses addresses_pkey; Type: CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.addresses
    ADD CONSTRAINT addresses_pkey PRIMARY KEY (id);


--
-- Name: carts carts_pkey; Type: CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.carts
    ADD CONSTRAINT carts_pkey PRIMARY KEY (id);


--
-- Name: carts carts_user_id_product_id_variant_id_key; Type: CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.carts
    ADD CONSTRAINT carts_user_id_product_id_variant_id_key UNIQUE (user_id, product_id, variant_id);


--
-- Name: commissions commissions_pkey; Type: CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.commissions
    ADD CONSTRAINT commissions_pkey PRIMARY KEY (id);


--
-- Name: conversions conversions_pkey; Type: CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.conversions
    ADD CONSTRAINT conversions_pkey PRIMARY KEY (id);


--
-- Name: coupons coupons_code_key; Type: CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.coupons
    ADD CONSTRAINT coupons_code_key UNIQUE (code);


--
-- Name: coupons coupons_pkey; Type: CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.coupons
    ADD CONSTRAINT coupons_pkey PRIMARY KEY (id);


--
-- Name: exchanges exchanges_exchange_number_key; Type: CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.exchanges
    ADD CONSTRAINT exchanges_exchange_number_key UNIQUE (exchange_number);


--
-- Name: exchanges exchanges_pkey; Type: CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.exchanges
    ADD CONSTRAINT exchanges_pkey PRIMARY KEY (id);


--
-- Name: notifications notifications_pkey; Type: CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.notifications
    ADD CONSTRAINT notifications_pkey PRIMARY KEY (id);


--
-- Name: order_items order_items_pkey; Type: CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.order_items
    ADD CONSTRAINT order_items_pkey PRIMARY KEY (id);


--
-- Name: order_stats order_stats_date_vendor_id_key; Type: CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.order_stats
    ADD CONSTRAINT order_stats_date_vendor_id_key UNIQUE (date, vendor_id);


--
-- Name: order_stats order_stats_pkey; Type: CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.order_stats
    ADD CONSTRAINT order_stats_pkey PRIMARY KEY (id);


--
-- Name: orders orders_order_number_key; Type: CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.orders
    ADD CONSTRAINT orders_order_number_key UNIQUE (order_number);


--
-- Name: orders orders_pkey; Type: CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.orders
    ADD CONSTRAINT orders_pkey PRIMARY KEY (id);


--
-- Name: payments payments_pkey; Type: CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.payments
    ADD CONSTRAINT payments_pkey PRIMARY KEY (id);


--
-- Name: payouts_ledger payouts_ledger_pkey; Type: CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.payouts_ledger
    ADD CONSTRAINT payouts_ledger_pkey PRIMARY KEY (id);


--
-- Name: product_categories product_categories_pkey; Type: CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.product_categories
    ADD CONSTRAINT product_categories_pkey PRIMARY KEY (id);


--
-- Name: product_categories product_categories_slug_key; Type: CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.product_categories
    ADD CONSTRAINT product_categories_slug_key UNIQUE (slug);


--
-- Name: product_variants product_variants_pkey; Type: CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.product_variants
    ADD CONSTRAINT product_variants_pkey PRIMARY KEY (id);


--
-- Name: product_variants product_variants_sku_key; Type: CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.product_variants
    ADD CONSTRAINT product_variants_sku_key UNIQUE (sku);


--
-- Name: product_views product_views_pkey; Type: CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.product_views
    ADD CONSTRAINT product_views_pkey PRIMARY KEY (id);


--
-- Name: products products_pkey; Type: CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.products
    ADD CONSTRAINT products_pkey PRIMARY KEY (id);


--
-- Name: products products_sku_key; Type: CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.products
    ADD CONSTRAINT products_sku_key UNIQUE (sku);


--
-- Name: products products_slug_key; Type: CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.products
    ADD CONSTRAINT products_slug_key UNIQUE (slug);


--
-- Name: returns returns_pkey; Type: CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.returns
    ADD CONSTRAINT returns_pkey PRIMARY KEY (id);


--
-- Name: returns returns_return_number_key; Type: CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.returns
    ADD CONSTRAINT returns_return_number_key UNIQUE (return_number);


--
-- Name: reviews reviews_pkey; Type: CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.reviews
    ADD CONSTRAINT reviews_pkey PRIMARY KEY (id);


--
-- Name: reviews reviews_user_id_product_id_order_item_id_key; Type: CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.reviews
    ADD CONSTRAINT reviews_user_id_product_id_order_item_id_key UNIQUE (user_id, product_id, order_item_id);


--
-- Name: user_sessions user_sessions_pkey; Type: CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.user_sessions
    ADD CONSTRAINT user_sessions_pkey PRIMARY KEY (id);


--
-- Name: user_sessions user_sessions_session_id_key; Type: CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.user_sessions
    ADD CONSTRAINT user_sessions_session_id_key UNIQUE (session_id);


--
-- Name: users users_email_key; Type: CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.users
    ADD CONSTRAINT users_email_key UNIQUE (email);


--
-- Name: users users_pkey; Type: CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.users
    ADD CONSTRAINT users_pkey PRIMARY KEY (id);


--
-- Name: vendor_payouts vendor_payouts_payout_number_key; Type: CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.vendor_payouts
    ADD CONSTRAINT vendor_payouts_payout_number_key UNIQUE (payout_number);


--
-- Name: vendor_payouts vendor_payouts_pkey; Type: CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.vendor_payouts
    ADD CONSTRAINT vendor_payouts_pkey PRIMARY KEY (id);


--
-- Name: vendors vendors_gst_number_key; Type: CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.vendors
    ADD CONSTRAINT vendors_gst_number_key UNIQUE (gst_number);


--
-- Name: vendors vendors_pan_number_key; Type: CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.vendors
    ADD CONSTRAINT vendors_pan_number_key UNIQUE (pan_number);


--
-- Name: vendors vendors_pkey; Type: CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.vendors
    ADD CONSTRAINT vendors_pkey PRIMARY KEY (id);


--
-- Name: wishlist wishlist_pkey; Type: CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.wishlist
    ADD CONSTRAINT wishlist_pkey PRIMARY KEY (id);


--
-- Name: wishlist wishlist_user_id_product_id_key; Type: CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.wishlist
    ADD CONSTRAINT wishlist_user_id_product_id_key UNIQUE (user_id, product_id);


--
-- Name: idx_addresses_user_id; Type: INDEX; Schema: public; Owner: -
--

CREATE INDEX idx_addresses_user_id ON public.addresses USING btree (user_id);


--
-- Name: idx_carts_user_id; Type: INDEX; Schema: public; Owner: -
--

CREATE INDEX idx_carts_user_id ON public.carts USING btree (user_id);


--
-- Name: idx_conversions_order_id; Type: INDEX; Schema: public; Owner: -
--

CREATE INDEX idx_conversions_order_id ON public.conversions USING btree (order_id);


--
-- Name: idx_exchanges_created_at; Type: INDEX; Schema: public; Owner: -
--

CREATE INDEX idx_exchanges_created_at ON public.exchanges USING btree (created_at);


--
-- Name: idx_exchanges_order_item_id; Type: INDEX; Schema: public; Owner: -
--

CREATE INDEX idx_exchanges_order_item_id ON public.exchanges USING btree (order_item_id);


--
-- Name: idx_notifications_user_id; Type: INDEX; Schema: public; Owner: -
--

CREATE INDEX idx_notifications_user_id ON public.notifications USING btree (user_id);


--
-- Name: idx_order_items_order_id; Type: INDEX; Schema: public; Owner: -
--

CREATE INDEX idx_order_items_order_id ON public.order_items USING btree (order_id);


--
-- Name: idx_order_stats_date; Type: INDEX; Schema: public; Owner: -
--

CREATE INDEX idx_order_stats_date ON public.order_stats USING btree (date);


--
-- Name: idx_order_stats_vendor_id; Type: INDEX; Schema: public; Owner: -
--

CREATE INDEX idx_order_stats_vendor_id ON public.order_stats USING btree (vendor_id);


--
-- Name: idx_orders_created_at; Type: INDEX; Schema: public; Owner: -
--

CREATE INDEX idx_orders_created_at ON public.orders USING btree (created_at);


--
-- Name: idx_orders_status; Type: INDEX; Schema: public; Owner: -
--

CREATE INDEX idx_orders_status ON public.orders USING btree (status);


--
-- Name: idx_orders_user_id; Type: INDEX; Schema: public; Owner: -
--

CREATE INDEX idx_orders_user_id ON public.orders USING btree (user_id);


--
-- Name: idx_orders_vendor_id; Type: INDEX; Schema: public; Owner: -
--

CREATE INDEX idx_orders_vendor_id ON public.orders USING btree (vendor_id);


--
-- Name: idx_payments_order_id; Type: INDEX; Schema: public; Owner: -
--

CREATE INDEX idx_payments_order_id ON public.payments USING btree (order_id);


--
-- Name: idx_payouts_ledger_vendor_id; Type: INDEX; Schema: public; Owner: -
--

CREATE INDEX idx_payouts_ledger_vendor_id ON public.payouts_ledger USING btree (vendor_id);


--
-- Name: idx_product_categories_parent_id; Type: INDEX; Schema: public; Owner: -
--

CREATE INDEX idx_product_categories_parent_id ON public.product_categories USING btree (parent_id);


--
-- Name: idx_product_variants_product_id; Type: INDEX; Schema: public; Owner: -
--

CREATE INDEX idx_product_variants_product_id ON public.product_variants USING btree (product_id);


--
-- Name: idx_product_views_product_id; Type: INDEX; Schema: public; Owner: -
--

CREATE INDEX idx_product_views_product_id ON public.product_views USING btree (product_id);


--
-- Name: idx_product_views_viewed_at; Type: INDEX; Schema: public; Owner: -
--

CREATE INDEX idx_product_views_viewed_at ON public.product_views USING btree (viewed_at);


--
-- Name: idx_products_category_id; Type: INDEX; Schema: public; Owner: -
--

CREATE INDEX idx_products_category_id ON public.products USING btree (category_id);


--
-- Name: idx_products_created_at; Type: INDEX; Schema: public; Owner: -
--

CREATE INDEX idx_products_created_at ON public.products USING btree (created_at);


--
-- Name: idx_products_is_active; Type: INDEX; Schema: public; Owner: -
--

CREATE INDEX idx_products_is_active ON public.products USING btree (is_active);


--
-- Name: idx_products_vendor_id; Type: INDEX; Schema: public; Owner: -
--

CREATE INDEX idx_products_vendor_id ON public.products USING btree (vendor_id);


--
-- Name: idx_returns_created_at; Type: INDEX; Schema: public; Owner: -
--

CREATE INDEX idx_returns_created_at ON public.returns USING btree (created_at);


--
-- Name: idx_returns_order_item_id; Type: INDEX; Schema: public; Owner: -
--

CREATE INDEX idx_returns_order_item_id ON public.returns USING btree (order_item_id);


--
-- Name: idx_reviews_created_at; Type: INDEX; Schema: public; Owner: -
--

CREATE INDEX idx_reviews_created_at ON public.reviews USING btree (created_at);


--
-- Name: idx_reviews_product_id; Type: INDEX; Schema: public; Owner: -
--

CREATE INDEX idx_reviews_product_id ON public.reviews USING btree (product_id);


--
-- Name: idx_reviews_user_id; Type: INDEX; Schema: public; Owner: -
--

CREATE INDEX idx_reviews_user_id ON public.reviews USING btree (user_id);


--
-- Name: idx_user_sessions_user_id; Type: INDEX; Schema: public; Owner: -
--

CREATE INDEX idx_user_sessions_user_id ON public.user_sessions USING btree (user_id);


--
-- Name: idx_users_created_at; Type: INDEX; Schema: public; Owner: -
--

CREATE INDEX idx_users_created_at ON public.users USING btree (created_at);


--
-- Name: idx_users_email; Type: INDEX; Schema: public; Owner: -
--

CREATE INDEX idx_users_email ON public.users USING btree (email);


--
-- Name: idx_users_role; Type: INDEX; Schema: public; Owner: -
--

CREATE INDEX idx_users_role ON public.users USING btree (role);


--
-- Name: idx_vendor_payouts_vendor_id; Type: INDEX; Schema: public; Owner: -
--

CREATE INDEX idx_vendor_payouts_vendor_id ON public.vendor_payouts USING btree (vendor_id);


--
-- Name: idx_vendors_created_at; Type: INDEX; Schema: public; Owner: -
--

CREATE INDEX idx_vendors_created_at ON public.vendors USING btree (created_at);


--
-- Name: idx_vendors_is_active; Type: INDEX; Schema: public; Owner: -
--

CREATE INDEX idx_vendors_is_active ON public.vendors USING btree (is_active);


--
-- Name: idx_vendors_user_id; Type: INDEX; Schema: public; Owner: -
--

CREATE INDEX idx_vendors_user_id ON public.vendors USING btree (user_id);


--
-- Name: idx_wishlist_user_id; Type: INDEX; Schema: public; Owner: -
--

CREATE INDEX idx_wishlist_user_id ON public.wishlist USING btree (user_id);


--
-- Name: addresses update_addresses_updated_at; Type: TRIGGER; Schema: public; Owner: -
--

CREATE TRIGGER update_addresses_updated_at BEFORE UPDATE ON public.addresses FOR EACH ROW EXECUTE FUNCTION public.update_updated_at_column();


--
-- Name: carts update_carts_updated_at; Type: TRIGGER; Schema: public; Owner: -
--

CREATE TRIGGER update_carts_updated_at BEFORE UPDATE ON public.carts FOR EACH ROW EXECUTE FUNCTION public.update_updated_at_column();


--
-- Name: commissions update_commissions_updated_at; Type: TRIGGER; Schema: public; Owner: -
--

CREATE TRIGGER update_commissions_updated_at BEFORE UPDATE ON public.commissions FOR EACH ROW EXECUTE FUNCTION public.update_updated_at_column();


--
-- Name: coupons update_coupons_updated_at; Type: TRIGGER; Schema: public; Owner: -
--

CREATE TRIGGER update_coupons_updated_at BEFORE UPDATE ON public.coupons FOR EACH ROW EXECUTE FUNCTION public.update_updated_at_column();


--
-- Name: exchanges update_exchanges_updated_at; Type: TRIGGER; Schema: public; Owner: -
--

CREATE TRIGGER update_exchanges_updated_at BEFORE UPDATE ON public.exchanges FOR EACH ROW EXECUTE FUNCTION public.update_updated_at_column();


--
-- Name: notifications update_notifications_updated_at; Type: TRIGGER; Schema: public; Owner: -
--

CREATE TRIGGER update_notifications_updated_at BEFORE UPDATE ON public.notifications FOR EACH ROW EXECUTE FUNCTION public.update_updated_at_column();


--
-- Name: order_items update_order_items_updated_at; Type: TRIGGER; Schema: public; Owner: -
--

CREATE TRIGGER update_order_items_updated_at BEFORE UPDATE ON public.order_items FOR EACH ROW EXECUTE FUNCTION public.update_updated_at_column();


--
-- Name: orders update_orders_updated_at; Type: TRIGGER; Schema: public; Owner: -
--

CREATE TRIGGER update_orders_updated_at BEFORE UPDATE ON public.orders FOR EACH ROW EXECUTE FUNCTION public.update_updated_at_column();


--
-- Name: payments update_payments_updated_at; Type: TRIGGER; Schema: public; Owner: -
--

CREATE TRIGGER update_payments_updated_at BEFORE UPDATE ON public.payments FOR EACH ROW EXECUTE FUNCTION public.update_updated_at_column();


--
-- Name: product_categories update_product_categories_updated_at; Type: TRIGGER; Schema: public; Owner: -
--

CREATE TRIGGER update_product_categories_updated_at BEFORE UPDATE ON public.product_categories FOR EACH ROW EXECUTE FUNCTION public.update_updated_at_column();


--
-- Name: product_variants update_product_variants_updated_at; Type: TRIGGER; Schema: public; Owner: -
--

CREATE TRIGGER update_product_variants_updated_at BEFORE UPDATE ON public.product_variants FOR EACH ROW EXECUTE FUNCTION public.update_updated_at_column();


--
-- Name: products update_products_updated_at; Type: TRIGGER; Schema: public; Owner: -
--

CREATE TRIGGER update_products_updated_at BEFORE UPDATE ON public.products FOR EACH ROW EXECUTE FUNCTION public.update_updated_at_column();


--
-- Name: returns update_returns_updated_at; Type: TRIGGER; Schema: public; Owner: -
--

CREATE TRIGGER update_returns_updated_at BEFORE UPDATE ON public.returns FOR EACH ROW EXECUTE FUNCTION public.update_updated_at_column();


--
-- Name: reviews update_reviews_updated_at; Type: TRIGGER; Schema: public; Owner: -
--

CREATE TRIGGER update_reviews_updated_at BEFORE UPDATE ON public.reviews FOR EACH ROW EXECUTE FUNCTION public.update_updated_at_column();


--
-- Name: users update_users_updated_at; Type: TRIGGER; Schema: public; Owner: -
--

CREATE TRIGGER update_users_updated_at BEFORE UPDATE ON public.users FOR EACH ROW EXECUTE FUNCTION public.update_updated_at_column();


--
-- Name: vendor_payouts update_vendor_payouts_updated_at; Type: TRIGGER; Schema: public; Owner: -
--

CREATE TRIGGER update_vendor_payouts_updated_at BEFORE UPDATE ON public.vendor_payouts FOR EACH ROW EXECUTE FUNCTION public.update_updated_at_column();


--
-- Name: vendors update_vendors_updated_at; Type: TRIGGER; Schema: public; Owner: -
--

CREATE TRIGGER update_vendors_updated_at BEFORE UPDATE ON public.vendors FOR EACH ROW EXECUTE FUNCTION public.update_updated_at_column();


--
-- Name: addresses addresses_user_id_fkey; Type: FK CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.addresses
    ADD CONSTRAINT addresses_user_id_fkey FOREIGN KEY (user_id) REFERENCES public.users(id) ON DELETE CASCADE;


--
-- Name: carts carts_product_id_fkey; Type: FK CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.carts
    ADD CONSTRAINT carts_product_id_fkey FOREIGN KEY (product_id) REFERENCES public.products(id) ON DELETE CASCADE;


--
-- Name: carts carts_user_id_fkey; Type: FK CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.carts
    ADD CONSTRAINT carts_user_id_fkey FOREIGN KEY (user_id) REFERENCES public.users(id) ON DELETE CASCADE;


--
-- Name: carts carts_variant_id_fkey; Type: FK CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.carts
    ADD CONSTRAINT carts_variant_id_fkey FOREIGN KEY (variant_id) REFERENCES public.product_variants(id) ON DELETE CASCADE;


--
-- Name: commissions commissions_category_id_fkey; Type: FK CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.commissions
    ADD CONSTRAINT commissions_category_id_fkey FOREIGN KEY (category_id) REFERENCES public.product_categories(id) ON DELETE CASCADE;


--
-- Name: commissions commissions_vendor_id_fkey; Type: FK CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.commissions
    ADD CONSTRAINT commissions_vendor_id_fkey FOREIGN KEY (vendor_id) REFERENCES public.vendors(id) ON DELETE CASCADE;


--
-- Name: conversions conversions_order_id_fkey; Type: FK CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.conversions
    ADD CONSTRAINT conversions_order_id_fkey FOREIGN KEY (order_id) REFERENCES public.orders(id) ON DELETE CASCADE;


--
-- Name: conversions conversions_user_id_fkey; Type: FK CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.conversions
    ADD CONSTRAINT conversions_user_id_fkey FOREIGN KEY (user_id) REFERENCES public.users(id) ON DELETE SET NULL;


--
-- Name: exchanges exchanges_new_variant_id_fkey; Type: FK CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.exchanges
    ADD CONSTRAINT exchanges_new_variant_id_fkey FOREIGN KEY (new_variant_id) REFERENCES public.product_variants(id) ON DELETE RESTRICT;


--
-- Name: exchanges exchanges_order_item_id_fkey; Type: FK CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.exchanges
    ADD CONSTRAINT exchanges_order_item_id_fkey FOREIGN KEY (order_item_id) REFERENCES public.order_items(id) ON DELETE CASCADE;


--
-- Name: notifications notifications_user_id_fkey; Type: FK CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.notifications
    ADD CONSTRAINT notifications_user_id_fkey FOREIGN KEY (user_id) REFERENCES public.users(id) ON DELETE CASCADE;


--
-- Name: order_items order_items_order_id_fkey; Type: FK CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.order_items
    ADD CONSTRAINT order_items_order_id_fkey FOREIGN KEY (order_id) REFERENCES public.orders(id) ON DELETE CASCADE;


--
-- Name: order_items order_items_product_id_fkey; Type: FK CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.order_items
    ADD CONSTRAINT order_items_product_id_fkey FOREIGN KEY (product_id) REFERENCES public.products(id) ON DELETE RESTRICT;


--
-- Name: order_items order_items_variant_id_fkey; Type: FK CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.order_items
    ADD CONSTRAINT order_items_variant_id_fkey FOREIGN KEY (variant_id) REFERENCES public.product_variants(id) ON DELETE RESTRICT;


--
-- Name: order_stats order_stats_vendor_id_fkey; Type: FK CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.order_stats
    ADD CONSTRAINT order_stats_vendor_id_fkey FOREIGN KEY (vendor_id) REFERENCES public.vendors(id) ON DELETE CASCADE;


--
-- Name: orders orders_billing_address_id_fkey; Type: FK CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.orders
    ADD CONSTRAINT orders_billing_address_id_fkey FOREIGN KEY (billing_address_id) REFERENCES public.addresses(id) ON DELETE RESTRICT;


--
-- Name: orders orders_shipping_address_id_fkey; Type: FK CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.orders
    ADD CONSTRAINT orders_shipping_address_id_fkey FOREIGN KEY (shipping_address_id) REFERENCES public.addresses(id) ON DELETE RESTRICT;


--
-- Name: orders orders_user_id_fkey; Type: FK CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.orders
    ADD CONSTRAINT orders_user_id_fkey FOREIGN KEY (user_id) REFERENCES public.users(id) ON DELETE RESTRICT;


--
-- Name: orders orders_vendor_id_fkey; Type: FK CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.orders
    ADD CONSTRAINT orders_vendor_id_fkey FOREIGN KEY (vendor_id) REFERENCES public.vendors(id) ON DELETE RESTRICT;


--
-- Name: payments payments_order_id_fkey; Type: FK CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.payments
    ADD CONSTRAINT payments_order_id_fkey FOREIGN KEY (order_id) REFERENCES public.orders(id) ON DELETE CASCADE;


--
-- Name: payouts_ledger payouts_ledger_order_id_fkey; Type: FK CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.payouts_ledger
    ADD CONSTRAINT payouts_ledger_order_id_fkey FOREIGN KEY (order_id) REFERENCES public.orders(id) ON DELETE SET NULL;


--
-- Name: payouts_ledger payouts_ledger_payout_id_fkey; Type: FK CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.payouts_ledger
    ADD CONSTRAINT payouts_ledger_payout_id_fkey FOREIGN KEY (payout_id) REFERENCES public.vendor_payouts(id) ON DELETE SET NULL;


--
-- Name: payouts_ledger payouts_ledger_vendor_id_fkey; Type: FK CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.payouts_ledger
    ADD CONSTRAINT payouts_ledger_vendor_id_fkey FOREIGN KEY (vendor_id) REFERENCES public.vendors(id) ON DELETE CASCADE;


--
-- Name: product_categories product_categories_parent_id_fkey; Type: FK CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.product_categories
    ADD CONSTRAINT product_categories_parent_id_fkey FOREIGN KEY (parent_id) REFERENCES public.product_categories(id) ON DELETE SET NULL;


--
-- Name: product_variants product_variants_product_id_fkey; Type: FK CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.product_variants
    ADD CONSTRAINT product_variants_product_id_fkey FOREIGN KEY (product_id) REFERENCES public.products(id) ON DELETE CASCADE;


--
-- Name: product_views product_views_product_id_fkey; Type: FK CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.product_views
    ADD CONSTRAINT product_views_product_id_fkey FOREIGN KEY (product_id) REFERENCES public.products(id) ON DELETE CASCADE;


--
-- Name: product_views product_views_user_id_fkey; Type: FK CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.product_views
    ADD CONSTRAINT product_views_user_id_fkey FOREIGN KEY (user_id) REFERENCES public.users(id) ON DELETE SET NULL;


--
-- Name: products products_category_id_fkey; Type: FK CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.products
    ADD CONSTRAINT products_category_id_fkey FOREIGN KEY (category_id) REFERENCES public.product_categories(id) ON DELETE RESTRICT;


--
-- Name: products products_vendor_id_fkey; Type: FK CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.products
    ADD CONSTRAINT products_vendor_id_fkey FOREIGN KEY (vendor_id) REFERENCES public.vendors(id) ON DELETE CASCADE;


--
-- Name: returns returns_order_item_id_fkey; Type: FK CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.returns
    ADD CONSTRAINT returns_order_item_id_fkey FOREIGN KEY (order_item_id) REFERENCES public.order_items(id) ON DELETE CASCADE;


--
-- Name: reviews reviews_order_item_id_fkey; Type: FK CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.reviews
    ADD CONSTRAINT reviews_order_item_id_fkey FOREIGN KEY (order_item_id) REFERENCES public.order_items(id) ON DELETE SET NULL;


--
-- Name: reviews reviews_product_id_fkey; Type: FK CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.reviews
    ADD CONSTRAINT reviews_product_id_fkey FOREIGN KEY (product_id) REFERENCES public.products(id) ON DELETE CASCADE;


--
-- Name: reviews reviews_user_id_fkey; Type: FK CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.reviews
    ADD CONSTRAINT reviews_user_id_fkey FOREIGN KEY (user_id) REFERENCES public.users(id) ON DELETE CASCADE;


--
-- Name: user_sessions user_sessions_user_id_fkey; Type: FK CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.user_sessions
    ADD CONSTRAINT user_sessions_user_id_fkey FOREIGN KEY (user_id) REFERENCES public.users(id) ON DELETE SET NULL;


--
-- Name: users users_cartid_fkey; Type: FK CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.users
    ADD CONSTRAINT users_cartid_fkey FOREIGN KEY (cartid) REFERENCES public.carts(id);


--
-- Name: users users_wishlistid_fkey; Type: FK CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.users
    ADD CONSTRAINT users_wishlistid_fkey FOREIGN KEY (wishlistid) REFERENCES public.wishlist(id);


--
-- Name: vendor_payouts vendor_payouts_vendor_id_fkey; Type: FK CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.vendor_payouts
    ADD CONSTRAINT vendor_payouts_vendor_id_fkey FOREIGN KEY (vendor_id) REFERENCES public.vendors(id) ON DELETE CASCADE;


--
-- Name: vendors vendors_user_id_fkey; Type: FK CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.vendors
    ADD CONSTRAINT vendors_user_id_fkey FOREIGN KEY (user_id) REFERENCES public.users(id) ON DELETE CASCADE;


--
-- Name: wishlist wishlist_product_id_fkey; Type: FK CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.wishlist
    ADD CONSTRAINT wishlist_product_id_fkey FOREIGN KEY (product_id) REFERENCES public.products(id) ON DELETE CASCADE;


--
-- Name: wishlist wishlist_user_id_fkey; Type: FK CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.wishlist
    ADD CONSTRAINT wishlist_user_id_fkey FOREIGN KEY (user_id) REFERENCES public.users(id) ON DELETE CASCADE;


--
-- PostgreSQL database dump complete
--

