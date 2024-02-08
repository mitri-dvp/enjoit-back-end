-- CreateTable
CREATE TABLE "product" (
    "id" SERIAL NOT NULL,
    "created_at" TIMESTAMPTZ(6) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updated_at" TIMESTAMP(3) NOT NULL,
    "name" VARCHAR(255) NOT NULL,
    "price" INTEGER NOT NULL,
    "image" VARCHAR,
    "discount" INTEGER,
    "status" INTEGER,
    "state" INTEGER NOT NULL,
    "details" VARCHAR(255),
    "position" VARCHAR(255),
    "non_process" VARCHAR(255),
    "calories" VARCHAR(255),
    "category_id" VARCHAR(255),
    "store_id" VARCHAR(255),
    "command_id" VARCHAR(255),

    CONSTRAINT "product_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "category" (
    "id" SERIAL NOT NULL,
    "created_at" TIMESTAMPTZ(6) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updated_at" TIMESTAMP(3) NOT NULL,
    "name" VARCHAR(255) NOT NULL,
    "image" VARCHAR,
    "type" VARCHAR(255),
    "state" INTEGER NOT NULL,
    "position" INTEGER,
    "parent_id" INTEGER,
    "store_id" INTEGER,

    CONSTRAINT "category_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "order" (
    "id" SERIAL NOT NULL,
    "created_at" TIMESTAMPTZ(6) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updated_at" TIMESTAMP(3) NOT NULL,
    "total_amount" INTEGER,
    "status" INTEGER,
    "type" VARCHAR(255),
    "discount_value" INTEGER,
    "gifted" VARCHAR(255),
    "tip" INTEGER,
    "address" VARCHAR(255),
    "pick_up_info" VARCHAR(255),
    "reference" VARCHAR(255),
    "tip_value" INTEGER,
    "delivery_value" INTEGER,
    "tax_value" INTEGER,
    "customer_id" INTEGER,
    "creator_id" INTEGER,
    "client_id" INTEGER,
    "store_id" INTEGER,
    "table_id" INTEGER,
    "billing_id" INTEGER,
    "parent_id" INTEGER,

    CONSTRAINT "order_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "order_item" (
    "id" SERIAL NOT NULL,
    "created_at" TIMESTAMPTZ(6) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updated_at" TIMESTAMP(3) NOT NULL,
    "quantity" INTEGER,
    "amount" INTEGER,
    "gifted" INTEGER,
    "details" INTEGER,
    "comments" VARCHAR(255),
    "cancel_reason" INTEGER,
    "product_price" DOUBLE PRECISION,
    "inv_discount" INTEGER,
    "product_name" VARCHAR(255),
    "notification" INTEGER,
    "to_print" INTEGER,
    "date_state" INTEGER,
    "status" INTEGER,
    "product_id" INTEGER,
    "order_id" INTEGER,
    "employee_id" INTEGER,

    CONSTRAINT "order_item_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "role" (
    "id" SERIAL NOT NULL,
    "created_at" TIMESTAMPTZ(6) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updated_at" TIMESTAMP(3) NOT NULL,
    "name" VARCHAR(200) NOT NULL,
    "reference" VARCHAR(200) NOT NULL,
    "state" INTEGER NOT NULL,

    CONSTRAINT "role_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "store" (
    "id" SERIAL NOT NULL,
    "created_at" TIMESTAMPTZ(6) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updated_at" TIMESTAMP(3) NOT NULL,
    "store_name" VARCHAR(255) NOT NULL,
    "store_type" VARCHAR(255) NOT NULL,
    "location" VARCHAR(255) NOT NULL,
    "profile_picture" VARCHAR(255),
    "cover_image" VARCHAR(255),
    "legal_name" VARCHAR(255),
    "test_mode" INTEGER,
    "phone" INTEGER,
    "cellphone" INTEGER,
    "code" INTEGER,
    "address" VARCHAR(255),
    "description" VARCHAR(255),
    "nit" INTEGER,
    "rating" INTEGER,
    "extra_info_address" VARCHAR(255),
    "state" INTEGER NOT NULL,
    "store_settings_id" INTEGER NOT NULL,
    "category_id" INTEGER NOT NULL,
    "country_id" INTEGER,
    "state_id" INTEGER,
    "city_id" INTEGER,
    "owner_id" INTEGER,

    CONSTRAINT "store_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "user_address" (
    "id" SERIAL NOT NULL,
    "created_at" TIMESTAMPTZ(6) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updated_at" TIMESTAMP(3) NOT NULL,
    "address" VARCHAR(255),
    "alias" VARCHAR(255),
    "details" VARCHAR(255),

    CONSTRAINT "user_address_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "user_reset" (
    "id" SERIAL NOT NULL,
    "created_at" TIMESTAMPTZ(6) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updated_at" TIMESTAMP(3) NOT NULL,
    "new_email" VARCHAR(255),
    "type" VARCHAR(255),
    "token" VARCHAR(255),
    "expire_time" VARCHAR(255),
    "user_id" INTEGER NOT NULL,

    CONSTRAINT "user_reset_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "user_role" (
    "id" SERIAL NOT NULL,
    "created_at" TIMESTAMPTZ(6) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updated_at" TIMESTAMP(3) NOT NULL,
    "state" INTEGER NOT NULL,

    CONSTRAINT "user_role_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "user" (
    "id" SERIAL NOT NULL,
    "created_at" TIMESTAMPTZ(6) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updated_at" TIMESTAMP(3) NOT NULL,
    "nick_name" VARCHAR(255) NOT NULL,
    "first_name" VARCHAR(255) NOT NULL,
    "last_name" VARCHAR(255) NOT NULL,
    "document_type" INTEGER NOT NULL,
    "document_id" INTEGER NOT NULL,
    "gender" VARCHAR(255) NOT NULL,
    "birth_date" INTEGER,
    "birth_country" VARCHAR(255),
    "birth_state" VARCHAR(255),
    "birth_city" VARCHAR(255),
    "birth_postal_code" INTEGER,
    "profile" INTEGER,
    "role" INTEGER,
    "phone" INTEGER,
    "email" VARCHAR(255),
    "password" VARCHAR(255),
    "status" INTEGER,
    "cellphone" INTEGER,
    "cellphone_prefix" INTEGER,
    "phone_prefix" INTEGER,
    "profile_pic" VARCHAR(255),
    "state" INTEGER NOT NULL,
    "country_id" INTEGER,
    "store_id" INTEGER,
    "table_id" INTEGER,

    CONSTRAINT "user_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "users_on_user_roles" (
    "user_id" INTEGER NOT NULL,
    "user_role_id" INTEGER NOT NULL,

    CONSTRAINT "users_on_user_roles_pkey" PRIMARY KEY ("user_id","user_role_id")
);

-- CreateTable
CREATE TABLE "roles_on_user_roles" (
    "role_id" INTEGER NOT NULL,
    "user_role_id" INTEGER NOT NULL,

    CONSTRAINT "roles_on_user_roles_pkey" PRIMARY KEY ("role_id","user_role_id")
);

-- CreateIndex
CREATE UNIQUE INDEX "product_name_key" ON "product"("name");

-- CreateIndex
CREATE UNIQUE INDEX "category_name_key" ON "category"("name");

-- AddForeignKey
ALTER TABLE "order_item" ADD CONSTRAINT "order_item_product_id_fkey" FOREIGN KEY ("product_id") REFERENCES "product"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "order_item" ADD CONSTRAINT "order_item_order_id_fkey" FOREIGN KEY ("order_id") REFERENCES "order"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "users_on_user_roles" ADD CONSTRAINT "users_on_user_roles_user_id_fkey" FOREIGN KEY ("user_id") REFERENCES "user"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "users_on_user_roles" ADD CONSTRAINT "users_on_user_roles_user_role_id_fkey" FOREIGN KEY ("user_role_id") REFERENCES "user_role"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "roles_on_user_roles" ADD CONSTRAINT "roles_on_user_roles_role_id_fkey" FOREIGN KEY ("role_id") REFERENCES "role"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "roles_on_user_roles" ADD CONSTRAINT "roles_on_user_roles_user_role_id_fkey" FOREIGN KEY ("user_role_id") REFERENCES "user_role"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
