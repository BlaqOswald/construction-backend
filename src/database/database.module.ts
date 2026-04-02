import { Module } from '@nestjs/common';
import { Pool } from 'pg';
import { pool } from '../db'; // db.ts is in src/, so '../db' from inside src/database/

@Module({
providers: [
{
provide: 'DATABASE_POOL', // Injection token (consistent name)
useValue: pool, // Your exported pool from db.ts
},
],
exports: ['DATABASE_POOL'], // Allow other modules to use it
})
export class DatabaseModule {}
