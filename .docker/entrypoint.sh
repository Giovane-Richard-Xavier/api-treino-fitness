#!/bin/bash

echo "⏳ Waiting database..."
sleep 5

echo "📦 Generating Prisma Client..."
npx prisma generate

echo "🗄 Running migrations..."
npx prisma migrate deploy

echo "🚀 Starting NestJS..."
npm run start:dev
